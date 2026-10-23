"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuralTypeMergeDiagnosticSchema = exports.StructuralTypeObservationSchema = exports.InterfaceRegistryManifestSchema = exports.InterfaceRegistryManifestSourceSchema = exports.CompiledElementInterfaceOperationSchema = exports.CompiledMappingReferenceSchema = exports.CompiledStructuralTypeArtifactSchema = exports.CompiledInterfaceDefinitionArtifactSchema = exports.CompiledInterfaceConformanceFixtureSchema = exports.CompiledInterfaceDefinitionSchema = exports.CompiledInterfaceCompatibilitySchema = exports.CompiledInterfaceDataClassificationSchema = exports.CompiledInterfaceJsonSchemaSchema = exports.CompiledInterfaceOwnerSchema = exports.CompiledInterfaceDocumentationSchema = exports.CompiledInterfaceAgentDocumentationSchema = exports.CompiledInterfaceHumanDocumentationSchema = exports.CompiledInterfaceExampleSchema = void 0;
const zod_1 = require("zod");
const interface_mapping_contract_1 = require("./interface-mapping-contract");
const semantic_interface_1 = require("./semantic-interface");
const IdSchema = zod_1.z.string().trim().min(1).max(300);
const RevisionIdSchema = zod_1.z.string().trim().min(1).max(200);
const DigestSchema = zod_1.z.string().regex(/^sha256:[a-f0-9]{64}$/);
const TextSchema = zod_1.z.string().trim().min(1).max(20_000);
const TextListSchema = zod_1.z.array(TextSchema).max(100);
exports.CompiledInterfaceExampleSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(200),
    summary: zod_1.z.string().trim().min(1).max(2_000).optional(),
    value: zod_1.z.unknown(),
}).strict();
exports.CompiledInterfaceHumanDocumentationSchema = zod_1.z.object({
    summary: zod_1.z.string().trim().min(1).max(500),
    description: TextSchema,
    useWhen: TextListSchema,
    avoidWhen: TextListSchema.default([]),
    fieldNotes: zod_1.z.record(zod_1.z.string().trim().min(1).max(500), TextSchema),
    examples: zod_1.z.array(exports.CompiledInterfaceExampleSchema).max(50),
}).strict();
exports.CompiledInterfaceAgentDocumentationSchema = zod_1.z.object({
    instructions: TextListSchema,
    invariants: TextListSchema,
    prohibitedInferences: TextListSchema,
    mappingGuidance: TextListSchema.default([]),
}).strict();
exports.CompiledInterfaceDocumentationSchema = zod_1.z.object({
    human: exports.CompiledInterfaceHumanDocumentationSchema,
    agent: exports.CompiledInterfaceAgentDocumentationSchema,
}).strict();
exports.CompiledInterfaceOwnerSchema = zod_1.z.discriminatedUnion('scope', [
    zod_1.z.object({ scope: zod_1.z.literal('system') }).strict(),
    zod_1.z.object({
        scope: zod_1.z.literal('organization'),
        organizationId: zod_1.z.string().trim().min(1).max(100),
    }).strict(),
]);
exports.CompiledInterfaceJsonSchemaSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).refine((schema) => schema.type === 'object', 'An interface schema must describe an object.');
exports.CompiledInterfaceDataClassificationSchema = zod_1.z.union([
    zod_1.z.enum([
        'public',
        'internal',
        'confidential',
        'restricted',
        'personal-data',
        'authentication',
        'security-observation',
        'policy-decision',
    ]),
    zod_1.z.string().regex(/^org\.[a-z0-9][a-z0-9-]{0,62}\.[a-z][a-z0-9.-]*$/),
]);
exports.CompiledInterfaceCompatibilitySchema = zod_1.z.object({
    extends: zod_1.z.array(semantic_interface_1.SemanticInterfaceTypeIdSchema).max(20).default([]),
    replaces: semantic_interface_1.SemanticInterfaceTypeIdSchema.optional(),
}).strict();
exports.CompiledInterfaceDefinitionSchema = zod_1.z.object({
    id: semantic_interface_1.SemanticInterfaceTypeIdSchema,
    owner: exports.CompiledInterfaceOwnerSchema,
    title: zod_1.z.string().trim().min(1).max(200),
    schema: exports.CompiledInterfaceJsonSchemaSchema,
    documentation: exports.CompiledInterfaceDocumentationSchema,
    dataClassifications: zod_1.z.array(exports.CompiledInterfaceDataClassificationSchema).max(50),
    trustedFields: zod_1.z.array(zod_1.z.string().trim().min(1).max(500)).max(100).default([]),
    compatibility: exports.CompiledInterfaceCompatibilitySchema,
}).strict().superRefine((definition, context) => {
    const systemId = definition.id.startsWith('process.');
    if (systemId !== (definition.owner.scope === 'system')) {
        issue(context, ['owner'], 'Interface identifier and owner scope do not match.');
    }
    if (definition.owner.scope === 'organization'
        && !definition.id.startsWith(`org.${definition.owner.organizationId}.`)) {
        issue(context, ['id'], 'Organization interface ID must use its owner namespace.');
    }
});
exports.CompiledInterfaceConformanceFixtureSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(200),
    expectation: zod_1.z.enum(['valid', 'invalid']),
    value: zod_1.z.unknown(),
    reason: zod_1.z.string().trim().min(1).max(2_000),
}).strict();
exports.CompiledInterfaceDefinitionArtifactSchema = zod_1.z.object({
    revisionId: RevisionIdSchema,
    definition: exports.CompiledInterfaceDefinitionSchema,
    conformanceFixtures: zod_1.z.array(exports.CompiledInterfaceConformanceFixtureSchema).max(10_000).optional(),
    contentDigest: DigestSchema,
}).strict().superRefine((artifact, context) => {
    const names = new Set();
    (artifact.conformanceFixtures ?? []).forEach((fixture, index) => {
        if (names.has(fixture.name)) {
            issue(context, ['conformanceFixtures', index, 'name'], `Duplicate fixture name: ${fixture.name}`);
        }
        names.add(fixture.name);
    });
});
exports.CompiledStructuralTypeArtifactSchema = zod_1.z.object({
    artifactId: IdSchema,
    role: zod_1.z.enum(['input', 'output']),
    outputMode: zod_1.z.literal('none').optional(),
    /** Author-authored TypeScript source used by the existing Monaco/codegen path. */
    typescript: zod_1.z.object({
        source: zod_1.z.string().trim().min(1).max(1_000_000),
        typeName: zod_1.z.string().trim().min(1).max(300).optional(),
    }).strict().optional(),
    declaration: zod_1.z.object({
        artifactPath: zod_1.z.string().trim().min(1).max(2_000)
            .refine((path) => !path.startsWith('/') && !path.split('/').includes('..')),
        typeName: zod_1.z.string().trim().min(1).max(300),
        contentDigest: DigestSchema,
    }).strict().optional(),
    jsonSchema: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    contentDigest: DigestSchema,
}).strict().refine(({ role, typescript, declaration, jsonSchema, outputMode }) => outputMode === 'none'
    ? role === 'output' && typescript?.source === 'void' && jsonSchema === undefined
    : typescript !== undefined || declaration !== undefined || jsonSchema !== undefined, 'A structural artifact requires TypeScript source, a declaration, or JSON Schema.');
exports.CompiledMappingReferenceSchema = zod_1.z.object({
    mappingId: IdSchema,
    revisionId: RevisionIdSchema,
}).strict();
const DirectionalInterfaceEdgeSchema = zod_1.z.object({
    interfaceType: semantic_interface_1.SemanticInterfaceTypeIdSchema,
    mapping: exports.CompiledMappingReferenceSchema,
}).strict();
exports.CompiledElementInterfaceOperationSchema = zod_1.z.object({
    operation: zod_1.z.object({
        kind: zod_1.z.enum(['action', 'signal', 'source']),
        key: zod_1.z.string().trim().min(1).max(300),
        fern: zod_1.z.string().trim().min(1).max(1_000),
    }).strict(),
    native: zod_1.z.object({
        interfaceType: semantic_interface_1.SemanticInterfaceTypeIdSchema.optional(),
        structuralArtifactId: IdSchema.optional(),
    }).strict().refine(({ interfaceType, structuralArtifactId }) => interfaceType !== undefined || structuralArtifactId !== undefined, 'An operation requires a semantic interface or structural artifact.'),
    accepts: zod_1.z.array(DirectionalInterfaceEdgeSchema).max(100).default([]),
    emits: zod_1.z.array(DirectionalInterfaceEdgeSchema).max(100).default([]),
}).strict();
exports.InterfaceRegistryManifestSourceSchema = zod_1.z.discriminatedUnion('kind', [
    zod_1.z.object({
        kind: zod_1.z.literal('process-core'),
        packageName: zod_1.z.string().trim().min(1).max(300),
        packageVersion: zod_1.z.string().trim().min(1).max(100),
        sourceRevision: zod_1.z.string().trim().min(1).max(200),
    }).strict(),
    zod_1.z.object({
        kind: zod_1.z.literal('element-build'),
        namespace: zod_1.z.string().trim().min(1).max(200),
        sourceRepository: zod_1.z.string().trim().min(1).max(500),
        sourceRevision: zod_1.z.string().trim().min(1).max(200),
    }).strict(),
    zod_1.z.object({
        kind: zod_1.z.literal('system-overlay'),
        overlayId: IdSchema,
        revisionId: RevisionIdSchema,
    }).strict(),
    zod_1.z.object({
        kind: zod_1.z.literal('organization'),
        organizationId: IdSchema,
        publicationId: RevisionIdSchema,
    }).strict(),
]);
exports.InterfaceRegistryManifestSchema = zod_1.z.object({
    version: zod_1.z.literal(1),
    manifestId: IdSchema,
    source: exports.InterfaceRegistryManifestSourceSchema,
    contentDigest: DigestSchema,
    /** Definitions owned by another manifest and required to resolve this graph fragment. */
    externalDefinitions: zod_1.z.array(semantic_interface_1.SemanticInterfaceTypeIdSchema).max(10_000).default([]),
    definitions: zod_1.z.array(exports.CompiledInterfaceDefinitionArtifactSchema).max(10_000),
    structuralTypes: zod_1.z.array(exports.CompiledStructuralTypeArtifactSchema).max(100_000),
    mappings: zod_1.z.array(interface_mapping_contract_1.CompiledInterfaceMappingArtifactSchema).max(100_000),
    operations: zod_1.z.array(exports.CompiledElementInterfaceOperationSchema).max(100_000),
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
        ]) {
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
                const source = direction === 'accepts' ? edge.interfaceType : operation.native.interfaceType;
                const target = direction === 'accepts' ? operation.native.interfaceType : edge.interfaceType;
                if (mapping.sourceInterface !== source || mapping.targetInterface !== target) {
                    issue(context, ['operations', index, direction, edgeIndex], 'Mapping direction does not match the operation edge.');
                }
            });
        }
    });
});
exports.StructuralTypeObservationSchema = zod_1.z.object({
    observationId: IdSchema,
    buildRunId: IdSchema,
    structuralArtifactId: IdSchema,
    source: zod_1.z.enum(['editor-execution', 'test-execution']),
    jsonSchema: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
    sampleDigest: DigestSchema,
    confidence: zod_1.z.number().min(0).max(1),
    observedAt: zod_1.z.iso.datetime(),
}).strict();
exports.StructuralTypeMergeDiagnosticSchema = zod_1.z.object({
    path: zod_1.z.string().trim().min(1).max(2_000),
    code: zod_1.z.enum(['type-conflict', 'requiredness-conflict', 'format-conflict', 'observation-widened']),
    message: zod_1.z.string().trim().min(1).max(4_000),
    observationIds: zod_1.z.array(IdSchema).max(1_000),
}).strict();
function issue(context, path, message) {
    context.addIssue({ code: 'custom', path, message });
}
function assertUnique(values, path, context) {
    const seen = new Set();
    values.forEach((value, index) => {
        if (seen.has(value))
            issue(context, [path, index], `Duplicate ${path} identity: ${value}`);
        seen.add(value);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLXJlZ2lzdHJ5LWNvbnRyYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ludGVyZmFjZS1yZWdpc3RyeS1jb250cmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBd0I7QUFFeEIsNkVBQXNGO0FBQ3RGLDZEQUFxRTtBQUVyRSxNQUFNLFFBQVEsR0FBRyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRCxNQUFNLGdCQUFnQixHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNELE1BQU0sWUFBWSxHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMvRCxNQUFNLFVBQVUsR0FBRyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4RCxNQUFNLGNBQWMsR0FBRyxPQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV2QyxRQUFBLDhCQUE4QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDbkQsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN2QyxPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxH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