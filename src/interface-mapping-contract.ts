import { z } from 'zod';

import { SemanticInterfaceTypeIdSchema } from './semantic-interface';

const IdSchema = z.string().trim().min(1).max(300);
const RevisionIdSchema = z.string().trim().min(1).max(200);
const DigestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);

export const CompiledInterfaceMappingDescriptorSchema = z
    .object({
        mappingId: IdSchema,
        revisionId: RevisionIdSchema,
        sourceInterface: SemanticInterfaceTypeIdSchema,
        targetInterface: SemanticInterfaceTypeIdSchema,
        kind: z.enum(['declarative', 'custom-adapter']),
        lossiness: z.enum(['lossless', 'lossy']),
        resolution: z.enum(['deterministic', 'probabilistic']),
        status: z.enum(['draft', 'published', 'deprecated']),
        contentDigest: DigestSchema,
    })
    .strict()
    .refine(
        ({ sourceInterface, targetInterface }) => sourceInterface !== targetInterface,
        'A mapping must connect distinct interfaces.',
    );

export type CompiledInterfaceMappingExpression =
    | { op: 'source'; pointer: string }
    | { op: 'item'; pointer: string }
    | { op: 'constant'; value: unknown }
    | { op: 'object'; fields: Record<string, CompiledInterfaceMappingExpression> }
    | { op: 'array'; items: CompiledInterfaceMappingExpression[] }
    | {
        op: 'map';
        input: CompiledInterfaceMappingExpression;
        item: CompiledInterfaceMappingExpression;
        maxItems: number;
    }
    | { op: 'coalesce'; values: CompiledInterfaceMappingExpression[] }
    | {
        op: 'value-map';
        input: CompiledInterfaceMappingExpression;
        values: Record<string, unknown>;
        fallback?: CompiledInterfaceMappingExpression;
    }
    | {
        op: 'convert';
        input: CompiledInterfaceMappingExpression;
        to: 'string' | 'number' | 'integer' | 'boolean';
    }
    | {
        op: 'parse-date';
        input: CompiledInterfaceMappingExpression;
        invalid: 'omit' | 'error';
    }
    | {
        op: 'transform';
        input: CompiledInterfaceMappingExpression;
        name: 'trim' | 'lowercase' | 'uppercase';
    };

const JsonPointerSchema = z
    .string()
    .max(2_000)
    .refine((pointer) => {
        if (pointer === '') return true;
        if (!pointer.startsWith('/') || pointer.includes('//') || /~(?![01])/u.test(pointer)) {
            return false;
        }
        return pointer
            .slice(1)
            .split('/')
            .map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'))
            .every((segment) => !['__proto__', 'constructor', 'prototype'].includes(segment));
    }, 'Expected an RFC 6901 JSON pointer.');

const JsonValueSchema: z.ZodType<unknown> = z.lazy(() => z.union([
    z.null(),
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
]));

export const CompiledInterfaceMappingExpressionSchema:
z.ZodType<CompiledInterfaceMappingExpression> = z.lazy(() => z.discriminatedUnion('op', [
    z.object({ op: z.literal('source'), pointer: JsonPointerSchema }).strict(),
    z.object({ op: z.literal('item'), pointer: JsonPointerSchema }).strict(),
    z.object({ op: z.literal('constant'), value: JsonValueSchema }).strict(),
    z.object({
        op: z.literal('object'),
        fields: z.record(z.string().min(1).max(500), CompiledInterfaceMappingExpressionSchema),
    }).strict(),
    z.object({
        op: z.literal('array'),
        items: z.array(CompiledInterfaceMappingExpressionSchema),
    }).strict(),
    z.object({
        op: z.literal('map'),
        input: CompiledInterfaceMappingExpressionSchema,
        item: CompiledInterfaceMappingExpressionSchema,
        maxItems: z.number().int().min(1).max(100_000),
    }).strict(),
    z.object({
        op: z.literal('coalesce'),
        values: z.array(CompiledInterfaceMappingExpressionSchema).min(1).max(100),
    }).strict(),
    z.object({
        op: z.literal('value-map'),
        input: CompiledInterfaceMappingExpressionSchema,
        values: z.record(z.string().max(1_000), JsonValueSchema),
        fallback: CompiledInterfaceMappingExpressionSchema.optional(),
    }).strict(),
    z.object({
        op: z.literal('convert'),
        input: CompiledInterfaceMappingExpressionSchema,
        to: z.enum(['string', 'number', 'integer', 'boolean']),
    }).strict(),
    z.object({
        op: z.literal('parse-date'),
        input: CompiledInterfaceMappingExpressionSchema,
        invalid: z.enum(['omit', 'error']),
    }).strict(),
    z.object({
        op: z.literal('transform'),
        input: CompiledInterfaceMappingExpressionSchema,
        name: z.enum(['trim', 'lowercase', 'uppercase']),
    }).strict(),
]));

export const CompiledInterfaceMappingLimitsSchema = z.object({
    maxOperations: z.number().int().min(1).max(1_000_000),
    maxDepth: z.number().int().min(1).max(128),
    maxArrayItems: z.number().int().min(1).max(100_000),
    maxOutputBytes: z.number().int().min(1).max(64 * 1024 * 1024),
    maxResolverFields: z.number().int().min(0).max(1_000),
    maxEvidenceBytes: z.number().int().min(0).max(16 * 1024 * 1024),
}).strict();

export const CompiledProbabilisticFieldPolicySchema = z.object({
    targetPointer: JsonPointerSchema.refine((pointer) => pointer !== '', 'Root cannot be probabilistic.'),
    resolverRevisionId: RevisionIdSchema,
    evidence: z.array(z.object({
        name: z.string().trim().min(1).max(200),
        expression: CompiledInterfaceMappingExpressionSchema,
    }).strict()).min(1).max(100),
    minConfidence: z.number().min(0).max(1),
    whenPresent: z.enum(['accept-deterministic', 'reject']),
    onAbstain: z.enum(['omit', 'review', 'reject', 'fallback']),
    onLowConfidence: z.enum(['omit', 'review', 'reject', 'fallback']),
    fallback: CompiledInterfaceMappingExpressionSchema.optional(),
}).strict().superRefine((policy, context) => {
    const needsFallback = policy.onAbstain === 'fallback' || policy.onLowConfidence === 'fallback';
    if (needsFallback && !policy.fallback) {
        context.addIssue({ code: 'custom', path: ['fallback'], message: 'Fallback requires an expression.' });
    }
});

export const CompiledDeclarativeMappingProgramSchema = z.object({
    version: z.literal(1),
    mapping: CompiledInterfaceMappingDescriptorSchema,
    limits: CompiledInterfaceMappingLimitsSchema,
    root: CompiledInterfaceMappingExpressionSchema,
    probabilisticFields: z.array(CompiledProbabilisticFieldPolicySchema).max(1_000).default([]),
}).strict();

export const CompiledCustomAdapterArtifactSchema = z.object({
    runtime: z.enum(['nodejs', 'quickjs']),
    artifactPath: z.string().trim().min(1).max(2_000)
        .refine((path) => !path.startsWith('/') && !path.split('/').includes('..'), 'Artifact path must be relative.'),
    exportName: z.string().regex(/^[A-Za-z_$][A-Za-z0-9_$]{0,199}$/),
    contentDigest: DigestSchema,
}).strict();

export const CompiledInterfaceMappingArtifactSchema = z.object({
    descriptor: CompiledInterfaceMappingDescriptorSchema,
    implementation: z.discriminatedUnion('kind', [
        z.object({
            kind: z.literal('declarative'),
            program: CompiledDeclarativeMappingProgramSchema,
        }).strict(),
        z.object({
            kind: z.literal('custom-adapter'),
            adapter: CompiledCustomAdapterArtifactSchema,
        }).strict(),
    ]),
}).strict().superRefine((artifact, context) => {
    if (artifact.descriptor.kind !== artifact.implementation.kind) {
        context.addIssue({
            code: 'custom',
            path: ['implementation', 'kind'],
            message: 'Implementation kind must match the artifact descriptor.',
        });
    }
    if (artifact.implementation.kind !== 'declarative') return;
    const program = artifact.implementation.program.mapping;
    const descriptor = artifact.descriptor;
    for (const key of [
        'mappingId',
        'revisionId',
        'sourceInterface',
        'targetInterface',
        'kind',
        'lossiness',
        'resolution',
        'status',
        'contentDigest',
    ] as const) {
        if (program[key] !== descriptor[key]) {
            context.addIssue({
                code: 'custom',
                path: ['implementation', 'program', 'mapping', key],
                message: `Program ${key} must match the artifact descriptor.`,
            });
        }
    }
});

export type CompiledInterfaceMappingDescriptor = z.infer<
    typeof CompiledInterfaceMappingDescriptorSchema
>;
export type CompiledDeclarativeMappingProgram = z.infer<
    typeof CompiledDeclarativeMappingProgramSchema
>;
export type CompiledInterfaceMappingArtifact = z.infer<
    typeof CompiledInterfaceMappingArtifactSchema
>;
