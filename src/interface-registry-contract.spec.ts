import {
    InterfaceRegistryManifestSchema,
    StructuralTypeObservationSchema,
} from './interface-registry-contract';

const digest = `sha256:${'a'.repeat(64)}`;
const native = 'process.vendor.message@1' as const;
const canonical = 'process.email.message@1' as const;

function definition(id: typeof native | typeof canonical) {
    return {
        id,
        owner: { scope: 'system' as const },
        title: id === native ? 'Vendor message' : 'Email message',
        schema: { type: 'object', properties: {} },
        documentation: {
            human: {
                summary: 'Summary',
                description: 'Description',
                useWhen: ['Use when applicable.'],
                avoidWhen: [],
                fieldNotes: {},
                examples: [],
            },
            agent: {
                instructions: ['Validate before use.'],
                invariants: [],
                prohibitedInferences: ['Do not infer identity.'],
                mappingGuidance: [],
            },
        },
        dataClassifications: [],
        trustedFields: [],
        compatibility: { extends: [] },
    };
}

function manifest() {
    const descriptor = {
        mappingId: 'vendor.message-to-email',
        revisionId: 'vendor.message-to-email@1',
        sourceInterface: native,
        targetInterface: canonical,
        kind: 'declarative' as const,
        lossiness: 'lossless' as const,
        resolution: 'deterministic' as const,
        status: 'published' as const,
        contentDigest: digest,
    };
    return {
        version: 1 as const,
        manifestId: 'vendor-build-manifest',
        source: {
            kind: 'element-build' as const,
            namespace: 'vendor',
            sourceRepository: 'process-elements/vendor',
            sourceRevision: 'commit-123',
        },
        contentDigest: digest,
        externalDefinitions: [],
        definitions: [
            { revisionId: 'native-revision-1', definition: definition(native), contentDigest: digest },
            { revisionId: 'canonical-revision-1', definition: definition(canonical), contentDigest: digest },
        ],
        structuralTypes: [{
            artifactId: 'vendor.action.output',
            role: 'output' as const,
            declaration: {
                artifactPath: 'bundled/actions/send/response.d.ts',
                typeName: 'VendorMessage',
                contentDigest: digest,
            },
            contentDigest: digest,
        }],
        mappings: [{
            descriptor,
            implementation: {
                kind: 'declarative' as const,
                program: {
                    version: 1 as const,
                    mapping: descriptor,
                    limits: {
                        maxOperations: 100,
                        maxDepth: 10,
                        maxArrayItems: 100,
                        maxOutputBytes: 10_000,
                        maxResolverFields: 0,
                        maxEvidenceBytes: 0,
                    },
                    root: { op: 'object' as const, fields: {} },
                    probabilisticFields: [],
                },
            },
        }],
        operations: [{
            operation: {
                kind: 'action' as const,
                key: 'send',
                fern: 'vendor::action:send',
            },
            native: {
                interfaceType: native,
                structuralArtifactId: 'vendor.action.output',
            },
            accepts: [],
            emits: [{
                interfaceType: canonical,
                mapping: {
                    mappingId: descriptor.mappingId,
                    revisionId: descriptor.revisionId,
                },
            }],
        }],
    };
}

describe('compiled interface registry contract', () => {
    it('accepts one internally complete build-scoped graph fragment', () => {
        expect(InterfaceRegistryManifestSchema.parse(manifest())).toEqual(manifest());
    });

    it('rejects an operation edge whose mapping implementation is absent', () => {
        const candidate = manifest();
        candidate.mappings = [];
        const result = InterfaceRegistryManifestSchema.safeParse(candidate);
        expect(result.success).toBe(false);
        expect(result.error?.issues).toEqual(expect.arrayContaining([
            expect.objectContaining({ message: 'Mapping artifact is missing.' }),
        ]));
    });

    it('rejects a mapping wired in the wrong direction', () => {
        const candidate = structuredClone(manifest()) as any;
        candidate.mappings[0]!.descriptor.sourceInterface = canonical;
        candidate.mappings[0]!.descriptor.targetInterface = native;
        candidate.mappings[0]!.implementation.program.mapping.sourceInterface = canonical;
        candidate.mappings[0]!.implementation.program.mapping.targetInterface = native;
        const result = InterfaceRegistryManifestSchema.safeParse(candidate);
        expect(result.success).toBe(false);
        expect(result.error?.issues).toEqual(expect.arrayContaining([
            expect.objectContaining({ message: 'Mapping direction does not match the operation edge.' }),
        ]));
    });

    it('requires observed structural evidence to name its exact build and artifact', () => {
        expect(StructuralTypeObservationSchema.parse({
            observationId: 'observation-1',
            buildRunId: 'build-1',
            structuralArtifactId: 'vendor.action.output',
            source: 'editor-execution',
            jsonSchema: { type: 'object' },
            sampleDigest: digest,
            confidence: 0.8,
            observedAt: '2026-09-02T12:00:00.000Z',
        })).toMatchObject({ buildRunId: 'build-1' });
    });
});
