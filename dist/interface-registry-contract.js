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
}).strict().refine(({ typescript, declaration, jsonSchema }) => typescript !== undefined || declaration !== undefined || jsonSchema !== undefined, 'A structural artifact requires TypeScript source, a declaration, or JSON Schema.');
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