"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledInterfaceMappingArtifactSchema = exports.CompiledCustomAdapterArtifactSchema = exports.CompiledDeclarativeMappingProgramSchema = exports.CompiledProbabilisticFieldPolicySchema = exports.CompiledInterfaceMappingLimitsSchema = exports.CompiledInterfaceMappingExpressionSchema = exports.CompiledInterfaceMappingDescriptorSchema = void 0;
const zod_1 = require("zod");
const semantic_interface_1 = require("./semantic-interface");
const IdSchema = zod_1.z.string().trim().min(1).max(300);
const RevisionIdSchema = zod_1.z.string().trim().min(1).max(200);
const DigestSchema = zod_1.z.string().regex(/^sha256:[a-f0-9]{64}$/);
exports.CompiledInterfaceMappingDescriptorSchema = zod_1.z
    .object({
    mappingId: IdSchema,
    revisionId: RevisionIdSchema,
    sourceInterface: semantic_interface_1.SemanticInterfaceTypeIdSchema,
    targetInterface: semantic_interface_1.SemanticInterfaceTypeIdSchema,
    kind: zod_1.z.enum(['declarative', 'custom-adapter']),
    lossiness: zod_1.z.enum(['lossless', 'lossy']),
    resolution: zod_1.z.enum(['deterministic', 'probabilistic']),
    status: zod_1.z.enum(['draft', 'published', 'deprecated']),
    contentDigest: DigestSchema,
})
    .strict()
    .refine(({ sourceInterface, targetInterface }) => sourceInterface !== targetInterface, 'A mapping must connect distinct interfaces.');
const JsonPointerSchema = zod_1.z
    .string()
    .max(2_000)
    .refine((pointer) => {
    if (pointer === '')
        return true;
    if (!pointer.startsWith('/') || pointer.includes('//') || /~(?![01])/u.test(pointer)) {
        return false;
    }
    return pointer
        .slice(1)
        .split('/')
        .map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'))
        .every((segment) => !['__proto__', 'constructor', 'prototype'].includes(segment));
}, 'Expected an RFC 6901 JSON pointer.');
const ProbabilisticTargetPointerSchema = JsonPointerSchema
    .refine((pointer) => pointer !== '', 'Root cannot be probabilistic.')
    .refine((pointer) => ![
    '/principal',
    '/security',
    '/authentication',
    '/authorization',
    '/policyDecision',
    '/context/ingress/principal',
    '/context/ingress/observations',
].some((prefix) => pointer === prefix || pointer.startsWith(`${prefix}/`)), 'Probabilistic mapping cannot write trusted security, identity, observation, or policy state.');
const JsonValueSchema = zod_1.z.lazy(() => zod_1.z.union([
    zod_1.z.null(),
    zod_1.z.string(),
    zod_1.z.number().finite(),
    zod_1.z.boolean(),
    zod_1.z.array(JsonValueSchema),
    zod_1.z.record(zod_1.z.string(), JsonValueSchema),
]));
exports.CompiledInterfaceMappingExpressionSchema = zod_1.z.lazy(() => zod_1.z.discriminatedUnion('op', [
    zod_1.z.object({ op: zod_1.z.literal('source'), pointer: JsonPointerSchema }).strict(),
    zod_1.z.object({ op: zod_1.z.literal('item'), pointer: JsonPointerSchema }).strict(),
    zod_1.z.object({ op: zod_1.z.literal('constant'), value: JsonValueSchema }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('object'),
        fields: zod_1.z.record(zod_1.z.string().min(1).max(500), exports.CompiledInterfaceMappingExpressionSchema),
    }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('array'),
        items: zod_1.z.array(exports.CompiledInterfaceMappingExpressionSchema),
    }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('map'),
        input: exports.CompiledInterfaceMappingExpressionSchema,
        item: exports.CompiledInterfaceMappingExpressionSchema,
        maxItems: zod_1.z.number().int().min(1).max(100_000),
    }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('coalesce'),
        values: zod_1.z.array(exports.CompiledInterfaceMappingExpressionSchema).min(1).max(100),
    }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('value-map'),
        input: exports.CompiledInterfaceMappingExpressionSchema,
        values: zod_1.z.record(zod_1.z.string().max(1_000), JsonValueSchema),
        fallback: exports.CompiledInterfaceMappingExpressionSchema.optional(),
    }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('convert'),
        input: exports.CompiledInterfaceMappingExpressionSchema,
        to: zod_1.z.enum(['string', 'number', 'integer', 'boolean']),
    }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('parse-date'),
        input: exports.CompiledInterfaceMappingExpressionSchema,
        invalid: zod_1.z.enum(['omit', 'error']),
    }).strict(),
    zod_1.z.object({
        op: zod_1.z.literal('transform'),
        input: exports.CompiledInterfaceMappingExpressionSchema,
        name: zod_1.z.enum(['trim', 'lowercase', 'uppercase']),
    }).strict(),
]));
exports.CompiledInterfaceMappingLimitsSchema = zod_1.z.object({
    maxOperations: zod_1.z.number().int().min(1).max(1_000_000),
    maxDepth: zod_1.z.number().int().min(1).max(128),
    maxArrayItems: zod_1.z.number().int().min(1).max(100_000),
    maxOutputBytes: zod_1.z.number().int().min(1).max(64 * 1024 * 1024),
    maxResolverFields: zod_1.z.number().int().min(0).max(1_000),
    maxEvidenceBytes: zod_1.z.number().int().min(0).max(16 * 1024 * 1024),
}).strict();
exports.CompiledProbabilisticFieldPolicySchema = zod_1.z.object({
    targetPointer: ProbabilisticTargetPointerSchema,
    resolverRevisionId: RevisionIdSchema,
    evidence: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().trim().min(1).max(200),
        expression: exports.CompiledInterfaceMappingExpressionSchema,
    }).strict()).min(1).max(100),
    minConfidence: zod_1.z.number().min(0).max(1),
    whenPresent: zod_1.z.enum(['accept-deterministic', 'reject']),
    onAbstain: zod_1.z.enum(['omit', 'review', 'reject', 'fallback']),
    onLowConfidence: zod_1.z.enum(['omit', 'review', 'reject', 'fallback']),
    fallback: exports.CompiledInterfaceMappingExpressionSchema.optional(),
}).strict().superRefine((policy, context) => {
    const needsFallback = policy.onAbstain === 'fallback' || policy.onLowConfidence === 'fallback';
    if (needsFallback && !policy.fallback) {
        context.addIssue({ code: 'custom', path: ['fallback'], message: 'Fallback requires an expression.' });
    }
});
exports.CompiledDeclarativeMappingProgramSchema = zod_1.z.object({
    version: zod_1.z.literal(1),
    mapping: exports.CompiledInterfaceMappingDescriptorSchema,
    limits: exports.CompiledInterfaceMappingLimitsSchema,
    root: exports.CompiledInterfaceMappingExpressionSchema,
    probabilisticFields: zod_1.z.array(exports.CompiledProbabilisticFieldPolicySchema).max(1_000).default([]),
}).strict();
exports.CompiledCustomAdapterArtifactSchema = zod_1.z.object({
    executionClass: zod_1.z.literal('interface-value-materializer'),
    runtime: zod_1.z.enum(['nodejs', 'quickjs']),
    artifactPath: zod_1.z.string().trim().min(1).max(2_000)
        .refine((path) => !path.startsWith('/') && !path.split('/').includes('..'), 'Artifact path must be relative.'),
    exportName: zod_1.z.string().regex(/^[A-Za-z_$][A-Za-z0-9_$]{0,199}$/),
    contentDigest: DigestSchema,
    limits: zod_1.z.object({
        timeoutMs: zod_1.z.number().int().min(1).max(5_000),
        memoryBytes: zod_1.z.number().int().min(1).max(128 * 1024 * 1024),
        outputBytes: zod_1.z.number().int().min(1).max(64 * 1024 * 1024),
    }).strict(),
}).strict();
exports.CompiledInterfaceMappingArtifactSchema = zod_1.z.object({
    descriptor: exports.CompiledInterfaceMappingDescriptorSchema,
    implementation: zod_1.z.discriminatedUnion('kind', [
        zod_1.z.object({
            kind: zod_1.z.literal('declarative'),
            program: exports.CompiledDeclarativeMappingProgramSchema,
        }).strict(),
        zod_1.z.object({
            kind: zod_1.z.literal('custom-adapter'),
            adapter: exports.CompiledCustomAdapterArtifactSchema,
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
    if (artifact.implementation.kind !== 'declarative')
        return;
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
    ]) {
        if (program[key] !== descriptor[key]) {
            context.addIssue({
                code: 'custom',
                path: ['implementation', 'program', 'mapping', key],
                message: `Program ${key} must match the artifact descriptor.`,
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLW1hcHBpbmctY29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW50ZXJmYWNlLW1hcHBpbmctY29udHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXdCO0FBRXhCLDZEQUFxRTtBQUVyRSxNQUFNLFFBQVEsR0FBRyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRCxNQUFNLGdCQUFnQixHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNELE1BQU0sWUFBWSxHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUVsRCxRQUFBLHdDQUF3QyxHQUFHLE9BQUM7S0FDcEQsTUFBTSxDQUFDO0lBQ0osU0FBUyxFQUFFLFFBQVE7SUFDbkIsVUFBVSxFQUFFLGdCQUFnQjtJQUM1QixlQUFlLEVBQUUsa0RBQTZCO0lBQzlDLGVBQWUsRUFBRSxrREFBNkI7SUFDOUMsSUFBSSxFQUFFLE9BQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMvQyxTQUFTLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4QyxVQUFVLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN0RCxNQUFNLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDcEQsYUFBYSxFQUFFLFlBQVk7Q0FD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