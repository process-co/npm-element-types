import type { StructuralTypeMergeDiagnostic, StructuralTypeObservation } from './interface-registry-contract';
type JsonSchema = Record<string, unknown>;
export type MergeStructuralTypeEvidenceInput = {
    buildRunId: string;
    structuralArtifactId: string;
    declaredSchema: JsonSchema;
    observations: readonly StructuralTypeObservation[];
};
export type MergedStructuralType = {
    jsonSchema: JsonSchema;
    observationIds: string[];
    diagnostics: StructuralTypeMergeDiagnostic[];
};
/**
 * Merge editor/test evidence into one build-scoped structural view.
 * Declared structure wins every conflict; observation-only fields remain
 * optional and may widen to explicit variants.
 */
export declare function mergeStructuralTypeEvidence(input: MergeStructuralTypeEvidenceInput): MergedStructuralType;
export {};
//# sourceMappingURL=structural-type-merge.d.ts.map