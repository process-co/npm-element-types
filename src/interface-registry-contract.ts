import { z } from 'zod';

import { CompiledInterfaceMappingArtifactSchema } from './interface-mapping-contract';
import { SemanticInterfaceTypeIdSchema } from './semantic-interface';

const IdSchema = z.string().trim().min(1).max(300);
const RevisionIdSchema = z.string().trim().min(1).max(200);
const DigestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const TextSchema = z.string().trim().min(1).max(20_000);
const TextListSchema = z.array(TextSchema).max(100);

export const CompiledInterfaceExampleSchema = z.object({
    name: z.string().trim().min(1).max(200),
    summary: z.string().trim().min(1).max(2_000).optional(),
    value: z.unknown(),
}).strict();

export const CompiledInterfaceHumanDocumentationSchema = z.object({
    summary: z.string().trim().min(1).max(500),
    description: TextSchema,
    useWhen: TextListSchema,
    avoidWhen: TextListSchema.default([]),
    fieldNotes: z.record(z.string().trim().min(1).max(500), TextSchema),
    examples: z.array(CompiledInterfaceExampleSchema).max(50),
}).strict();

export const CompiledInterfaceAgentDocumentationSchema = z.object({
    instructions: TextListSchema,
    invariants: TextListSchema,
    prohibitedInferences: TextListSchema,
    mappingGuidance: TextListSchema.default([]),
}).strict();

export const CompiledInterfaceDocumentationSchema = z.object({
    human: CompiledInterfaceHumanDocumentationSchema,
    agent: CompiledInterfaceAgentDocumentationSchema,
}).strict();

export const CompiledInterfaceOwnerSchema = z.discriminatedUnion('scope', [
    z.object({ scope: z.literal('system') }).strict(),
    z.object({
        scope: z.literal('organization'),
        organizationId: z.string().trim().min(1).max(100),
    }).strict(),
]);

export const CompiledInterfaceJsonSchemaSchema = z.record(z.string(), z.unknown()).refine(
    (schema) => schema.type === 'object',
    'An interface schema must describe an object.',
);

export const CompiledInterfaceDataClassificationSchema = z.union([
    z.enum([
        'public',
        'internal',
        'confidential',
        'restricted',
        'personal-data',
        'authentication',
        'security-observation',
        'policy-decision',
    ]),
    z.string().regex(/^org\.[a-z0-9][a-z0-9-]{0,62}\.[a-z][a-z0-9.-]*$/),
]);

export const CompiledInterfaceCompatibilitySchema = z.object({
    extends: z.array(SemanticInterfaceTypeIdSchema).max(20).default([]),
    replaces: SemanticInterfaceTypeIdSchema.optional(),
}).strict();

export const CompiledInterfaceDefinitionSchema = z.object({
    id: SemanticInterfaceTypeIdSchema,
    owner: CompiledInterfaceOwnerSchema,
    title: z.string().trim().min(1).max(200),
    schema: CompiledInterfaceJsonSchemaSchema,
    documentation: CompiledInterfaceDocumentationSchema,
    dataClassifications: z.array(CompiledInterfaceDataClassificationSchema).max(50),
    trustedFields: z.array(z.string().trim().min(1).max(500)).max(100).default([]),
    compatibility: CompiledInterfaceCompatibilitySchema,
}).strict().superRefine((definition, context) => {
    const systemId = definition.id.startsWith('process.');
    if (systemId !== (definition.owner.scope === 'system')) {
        issue(context, ['owner'], 'Interface identifier and owner scope do not match.');
    }
    if (
        definition.owner.scope === 'organization'
        && !definition.id.startsWith(`org.${definition.owner.organizationId}.`)
    ) {
        issue(context, ['id'], 'Organization interface ID must use its owner namespace.');
    }
});

export const CompiledInterfaceConformanceFixtureSchema = z.object({
    name: z.string().trim().min(1).max(200),
    expectation: z.enum(['valid', 'invalid']),
    value: z.unknown(),
    reason: z.string().trim().min(1).max(2_000),
}).strict();

export const CompiledInterfaceDefinitionArtifactSchema = z.object({
    revisionId: RevisionIdSchema,
    definition: CompiledInterfaceDefinitionSchema,
    conformanceFixtures: z.array(CompiledInterfaceConformanceFixtureSchema).max(10_000).optional(),
    contentDigest: DigestSchema,
}).strict().superRefine((artifact, context) => {
    const names = new Set<string>();
    (artifact.conformanceFixtures ?? []).forEach((fixture, index) => {
        if (names.has(fixture.name)) {
            issue(context, ['conformanceFixtures', index, 'name'], `Duplicate fixture name: ${fixture.name}`);
        }
        names.add(fixture.name);
    });
});

export const CompiledStructuralTypeArtifactSchema = z.object({
    artifactId: IdSchema,
    role: z.enum(['input', 'output']),
    /** Author-authored TypeScript source used by the existing Monaco/codegen path. */
    typescript: z.object({
        source: z.string().trim().min(1).max(1_000_000),
        typeName: z.string().trim().min(1).max(300).optional(),
    }).strict().optional(),
    declaration: z.object({
        artifactPath: z.string().trim().min(1).max(2_000)
            .refine((path) => !path.startsWith('/') && !path.split('/').includes('..')),
        typeName: z.string().trim().min(1).max(300),
        contentDigest: DigestSchema,
    }).strict().optional(),
    jsonSchema: z.record(z.string(), z.unknown()).optional(),
    contentDigest: DigestSchema,
}).strict().refine(
    ({ typescript, declaration, jsonSchema }) =>
        typescript !== undefined || declaration !== undefined || jsonSchema !== undefined,
    'A structural artifact requires TypeScript source, a declaration, or JSON Schema.',
);

export const CompiledMappingReferenceSchema = z.object({
    mappingId: IdSchema,
    revisionId: RevisionIdSchema,
}).strict();

const DirectionalInterfaceEdgeSchema = z.object({
    interfaceType: SemanticInterfaceTypeIdSchema,
    mapping: CompiledMappingReferenceSchema,
}).strict();

export const CompiledElementInterfaceOperationSchema = z.object({
    operation: z.object({
        kind: z.enum(['action', 'signal', 'source']),
        key: z.string().trim().min(1).max(300),
        fern: z.string().trim().min(1).max(1_000),
    }).strict(),
    native: z.object({
        interfaceType: SemanticInterfaceTypeIdSchema.optional(),
        structuralArtifactId: IdSchema.optional(),
    }).strict().refine(
        ({ interfaceType, structuralArtifactId }) =>
            interfaceType !== undefined || structuralArtifactId !== undefined,
        'An operation requires a semantic interface or structural artifact.',
    ),
    accepts: z.array(DirectionalInterfaceEdgeSchema).max(100).default([]),
    emits: z.array(DirectionalInterfaceEdgeSchema).max(100).default([]),
}).strict();

export const InterfaceRegistryManifestSourceSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('process-core'),
        packageName: z.string().trim().min(1).max(300),
        packageVersion: z.string().trim().min(1).max(100),
        sourceRevision: z.string().trim().min(1).max(200),
    }).strict(),
    z.object({
        kind: z.literal('element-build'),
        namespace: z.string().trim().min(1).max(200),
        sourceRepository: z.string().trim().min(1).max(500),
        sourceRevision: z.string().trim().min(1).max(200),
    }).strict(),
    z.object({
        kind: z.literal('system-overlay'),
        overlayId: IdSchema,
        revisionId: RevisionIdSchema,
    }).strict(),
    z.object({
        kind: z.literal('organization'),
        organizationId: IdSchema,
        publicationId: RevisionIdSchema,
    }).strict(),
]);

export const InterfaceRegistryManifestSchema = z.object({
    version: z.literal(1),
    manifestId: IdSchema,
    source: InterfaceRegistryManifestSourceSchema,
    contentDigest: DigestSchema,
    /** Definitions owned by another manifest and required to resolve this graph fragment. */
    externalDefinitions: z.array(SemanticInterfaceTypeIdSchema).max(10_000).default([]),
    definitions: z.array(CompiledInterfaceDefinitionArtifactSchema).max(10_000),
    structuralTypes: z.array(CompiledStructuralTypeArtifactSchema).max(100_000),
    mappings: z.array(CompiledInterfaceMappingArtifactSchema).max(100_000),
    operations: z.array(CompiledElementInterfaceOperationSchema).max(100_000),
}).strict().superRefine((manifest, context) => {
    assertUnique(manifest.definitions.map(({ definition }) => definition.id), 'definitions', context);
    assertUnique(manifest.definitions.map(({ revisionId }) => revisionId), 'definitionRevisions', context);
    assertUnique(manifest.externalDefinitions, 'externalDefinitions', context);
    assertUnique(manifest.structuralTypes.map(({ artifactId }) => artifactId), 'structuralTypes', context);
    assertUnique(manifest.mappings.map(({ descriptor }) => descriptor.revisionId), 'mappings', context);
    assertUnique(manifest.operations.map(({ operation }) => operation.fern), 'operations', context);

    const localDefinitions = new Set(manifest.definitions.map(({ definition }) => definition.id));
    const definitions = new Set([...localDefinitions, ...manifest.externalDefinitions]);
    manifest.externalDefinitions.forEach((id, index) => {
        if (localDefinitions.has(id)) {
            issue(context, ['externalDefinitions', index], 'A local definition cannot also be external.');
        }
    });
    const structures = new Set(manifest.structuralTypes.map(({ artifactId }) => artifactId));
    const mappings = new Map(manifest.mappings.map((mapping) => [
        `${mapping.descriptor.mappingId}\u0000${mapping.descriptor.revisionId}`,
        mapping.descriptor,
    ]));
    manifest.mappings.forEach((mapping, index) => {
        if (!definitions.has(mapping.descriptor.sourceInterface)) {
            issue(context, ['mappings', index, 'descriptor', 'sourceInterface'], 'Source definition is missing.');
        }
        if (!definitions.has(mapping.descriptor.targetInterface)) {
            issue(context, ['mappings', index, 'descriptor', 'targetInterface'], 'Target definition is missing.');
        }
    });
    manifest.operations.forEach((operation, index) => {
        if (operation.native.interfaceType && !definitions.has(operation.native.interfaceType)) {
            issue(context, ['operations', index, 'native', 'interfaceType'], 'Native definition is missing.');
        }
        if (operation.native.structuralArtifactId && !structures.has(operation.native.structuralArtifactId)) {
            issue(context, ['operations', index, 'native', 'structuralArtifactId'], 'Structural artifact is missing.');
        }
        for (const [direction, edges] of [
            ['accepts', operation.accepts],
            ['emits', operation.emits],
        ] as const) {
            if (edges.length > 0 && !operation.native.interfaceType) {
                issue(context, ['operations', index, 'native', 'interfaceType'], 'Mapped edges require a semantic native interface.');
                continue;
            }
            edges.forEach((edge, edgeIndex) => {
                const mapping = mappings.get(`${edge.mapping.mappingId}\u0000${edge.mapping.revisionId}`);
                if (!mapping) {
                    issue(context, ['operations', index, direction, edgeIndex, 'mapping'], 'Mapping artifact is missing.');
                    return;
                }
                const source = direction === 'accepts' ? edge.interfaceType : operation.native.interfaceType!;
                const target = direction === 'accepts' ? operation.native.interfaceType! : edge.interfaceType;
                if (mapping.sourceInterface !== source || mapping.targetInterface !== target) {
                    issue(context, ['operations', index, direction, edgeIndex], 'Mapping direction does not match the operation edge.');
                }
            });
        }
    });
});

export const StructuralTypeObservationSchema = z.object({
    observationId: IdSchema,
    buildRunId: IdSchema,
    structuralArtifactId: IdSchema,
    source: z.enum(['editor-execution', 'test-execution']),
    jsonSchema: z.record(z.string(), z.unknown()),
    sampleDigest: DigestSchema,
    confidence: z.number().min(0).max(1),
    observedAt: z.iso.datetime(),
}).strict();

export const StructuralTypeMergeDiagnosticSchema = z.object({
    path: z.string().trim().min(1).max(2_000),
    code: z.enum(['type-conflict', 'requiredness-conflict', 'format-conflict', 'observation-widened']),
    message: z.string().trim().min(1).max(4_000),
    observationIds: z.array(IdSchema).max(1_000),
}).strict();

function issue(context: z.RefinementCtx, path: PropertyKey[], message: string) {
    context.addIssue({ code: 'custom', path, message });
}

function assertUnique(values: string[], path: string, context: z.RefinementCtx) {
    const seen = new Set<string>();
    values.forEach((value, index) => {
        if (seen.has(value)) issue(context, [path, index], `Duplicate ${path} identity: ${value}`);
        seen.add(value);
    });
}

export type CompiledInterfaceDefinition = z.infer<typeof CompiledInterfaceDefinitionSchema>;
export type CompiledInterfaceConformanceFixture = z.infer<
    typeof CompiledInterfaceConformanceFixtureSchema
>;
export type CompiledInterfaceDefinitionArtifact = z.infer<
    typeof CompiledInterfaceDefinitionArtifactSchema
>;
export type CompiledStructuralTypeArtifact = z.infer<typeof CompiledStructuralTypeArtifactSchema>;
export type CompiledElementInterfaceOperation = z.infer<typeof CompiledElementInterfaceOperationSchema>;
export type InterfaceRegistryManifest = z.infer<typeof InterfaceRegistryManifestSchema>;
export type StructuralTypeObservation = z.infer<typeof StructuralTypeObservationSchema>;
export type StructuralTypeMergeDiagnostic = z.infer<typeof StructuralTypeMergeDiagnosticSchema>;
