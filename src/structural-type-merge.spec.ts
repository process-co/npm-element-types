import type { StructuralTypeObservation } from './interface-registry-contract';
import { mergeStructuralTypeEvidence } from './structural-type-merge';

const digest = `sha256:${'b'.repeat(64)}`;

function observation(
    observationId: string,
    jsonSchema: Record<string, unknown>,
    overrides: Partial<StructuralTypeObservation> = {},
): StructuralTypeObservation {
    return {
        observationId,
        buildRunId: 'build-1',
        structuralArtifactId: 'action-output',
        source: 'editor-execution',
        jsonSchema,
        sampleDigest: digest,
        confidence: 0.9,
        observedAt: '2026-09-02T12:00:00.000Z',
        ...overrides,
    };
}

describe('mergeStructuralTypeEvidence', () => {
    it('preserves declared required fields and adds observed fields as optional', () => {
        const result = mergeStructuralTypeEvidence({
            buildRunId: 'build-1',
            structuralArtifactId: 'action-output',
            declaredSchema: {
                type: 'object',
                properties: { id: { type: 'string' } },
                required: ['id'],
            },
            observations: [observation('obs-1', {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    vendorField: { type: 'number' },
                },
                required: ['id', 'vendorField'],
            })],
        });

        expect(result.jsonSchema).toEqual({
            type: 'object',
            properties: {
                id: { type: 'string' },
                vendorField: { type: 'number' },
            },
            required: ['id'],
        });
        expect(result.diagnostics).toEqual([]);
    });

    it('retains a declared type and records conflicting observation evidence', () => {
        const result = mergeStructuralTypeEvidence({
            buildRunId: 'build-1',
            structuralArtifactId: 'action-output',
            declaredSchema: {
                type: 'object',
                properties: { count: { type: 'number' } },
            },
            observations: [observation('obs-conflict', {
                type: 'object',
                properties: { count: { type: 'string' } },
            })],
        });

        expect(result.jsonSchema).toMatchObject({
            properties: { count: { type: 'number' } },
        });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                path: '$.count',
                code: 'type-conflict',
                observationIds: ['obs-conflict'],
            }),
        ]);
    });

    it('widens conflicting observation-only fields instead of selecting the last sample', () => {
        const result = mergeStructuralTypeEvidence({
            buildRunId: 'build-1',
            structuralArtifactId: 'action-output',
            declaredSchema: { type: 'object', properties: {} },
            observations: [
                observation('obs-1', {
                    type: 'object',
                    properties: { state: { type: 'string' } },
                }),
                observation('obs-2', {
                    type: 'object',
                    properties: { state: { type: 'number' } },
                }),
            ],
        });

        expect(result.jsonSchema).toMatchObject({
            properties: {
                state: { anyOf: [{ type: 'string' }, { type: 'number' }] },
            },
        });
        expect(result.diagnostics[0]).toMatchObject({
            path: '$.state',
            code: 'observation-widened',
            observationIds: ['obs-2'],
        });
    });

    it('uses observed structure when the exact build declares a true unknown', () => {
        const result = mergeStructuralTypeEvidence({
            buildRunId: 'build-1',
            structuralArtifactId: 'action-output',
            declaredSchema: {},
            observations: [observation('obs-only', {
                type: 'object',
                properties: {
                    vendorId: { type: 'string' },
                    nested: {
                        type: 'object',
                        properties: { count: { type: 'number' } },
                        required: ['count'],
                    },
                },
                required: ['vendorId', 'nested'],
            })],
        });

        expect(result.jsonSchema).toEqual({
            type: 'object',
            properties: {
                vendorId: { type: 'string' },
                nested: {
                    type: 'object',
                    properties: { count: { type: 'number' } },
                },
            },
        });
    });

    it('rejects evidence from another build before merging', () => {
        expect(() => mergeStructuralTypeEvidence({
            buildRunId: 'build-1',
            structuralArtifactId: 'action-output',
            declaredSchema: { type: 'object' },
            observations: [observation('obs-other', { type: 'object' }, { buildRunId: 'build-2' })],
        })).toThrow('belongs to build build-2, not build-1');
    });
});
