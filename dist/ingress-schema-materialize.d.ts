/**
 * Shared ingress validation materialization: resolve per-key `$.interface.schema`
 * property blobs and project author-facing `{ type: 'validate_schema' }` references
 * into actionable `validate_json_schema` / `validate_zod` filters for the Go edge.
 */
import type { IngressFilterDescriptor, IngressValidateSchemaFilter } from './ingress-filters';
export type IngressValidationLevel = 'typing' | 'basic' | 'full';
/** Persisted subset of a `$.interface.schema` property used for ingress materialization. */
export type IngressInputSchemaWire = {
    validation?: unknown;
    validationLevel?: unknown;
    exportSchema?: unknown;
    exportSchemaZodex?: unknown;
    exportSchemaKey?: unknown;
    exportSchemaSource?: unknown;
    schemaBuildKey?: unknown;
    edgeValidatorKey?: unknown;
    compiledValidatorKey?: unknown;
    validatorBackend?: unknown;
    coerceLeafPrimitives?: unknown;
    sourceHash?: unknown;
};
export declare function schemaKeyFromPropertyDescriptor(prop: {
    key?: unknown;
    typeOptions?: unknown;
}): string | undefined;
/**
 * FNV-1a-style hash for schema source change detection (browser + Node safe).
 */
export declare function computeSchemaSourceHash(source: string): string;
/** True when compiled artifacts match the current source hash. */
export declare function schemaArtifactsFresh(blob: IngressInputSchemaWire | undefined): boolean;
export declare function deriveEdgeValidatorKey(compiledValidatorKey: string): string;
export declare function ingressValidationLevelFromSchema(inputSchema: IngressInputSchemaWire | undefined): IngressValidationLevel;
/**
 * Resolve every `$.interface.schema` property to its persisted blob keyed by
 * schema property key.
 */
export declare function resolveIngressInputSchemas(publishPayload: Record<string, unknown>, properties?: Record<string, unknown>): Record<string, IngressInputSchemaWire>;
/** Resolve schema blobs from element instance data (element-host save path). */
export declare function resolveIngressInputSchemasFromElementData(elementData: Record<string, unknown>): Record<string, IngressInputSchemaWire>;
export declare class IngressValidateSchemaResolutionError extends Error {
    constructor(message: string);
}
/**
 * Pick the schema property key for a `validate` reference. When `schema` is
 * omitted, requires exactly one known schema key.
 */
export declare function resolveValidateSchemaKey(referenceSchema: string | undefined, knownKeys: string[]): string;
/**
 * Project one author `validate` reference into an actionable filter using the
 * referenced property's validation level and compiled artifacts.
 */
export declare function materializeValidationFilter(reference: IngressValidateSchemaFilter, inputSchema: IngressInputSchemaWire | undefined): IngressFilterDescriptor | undefined;
/**
 * Replace each `{ type: 'validate_schema' }` slot with its materialized
 * actionable filter. Drops the slot when the referenced schema is absent,
 * cleared, or at `typing` level. Preserves chain order.
 */
export declare function materializeIngressFilterChain(filters: IngressFilterDescriptor[], schemasByKey: Record<string, IngressInputSchemaWire>): IngressFilterDescriptor[];
/** First property-backed schema key for back-compat `inputSchema` wire field. */
export declare function primaryIngressInputSchema(schemasByKey: Record<string, IngressInputSchemaWire>): IngressInputSchemaWire | undefined;
export declare function isActionableValidationFilter(filter: IngressFilterDescriptor): boolean;
//# sourceMappingURL=ingress-schema-materialize.d.ts.map