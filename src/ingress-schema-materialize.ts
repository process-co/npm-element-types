/**
 * Shared ingress validation materialization: resolve per-key `$.interface.schema`
 * property blobs and project author-facing `{ type: 'validate_schema' }` references
 * into actionable `validate_json_schema` / `validate_zod` filters for the Go edge.
 */

import type {
    IngressFilterDescriptor,
    IngressValidateSchemaFilter,
} from './ingress-filters';

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

const COMPILED_VALIDATOR_SUFFIX = '.validator.mjs';
const EDGE_VALIDATOR_SUFFIX = '.edge-validator.js';

const ACTIONABLE_VALIDATION_TYPES = new Set(['validate_json_schema', 'validate_zod']);

type SchemaPropertyInfo = {
    type?: unknown;
    key?: unknown;
    typeOptions?: unknown;
    data?: unknown;
};

function readRecord(value: unknown): Record<string, unknown> | undefined {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? value as Record<string, unknown>
        : undefined;
}

function schemaPropertyInfo(value: unknown): SchemaPropertyInfo | undefined {
    const outer = readRecord(value);
    if (!outer) return undefined;
    const inner = readRecord(outer.data);
    const candidate = inner ?? outer;
    return candidate.type === '$.interface.schema' ? candidate as SchemaPropertyInfo : undefined;
}

function typeOptionsFromProperty(prop: SchemaPropertyInfo): Record<string, unknown> {
    return readRecord(prop.typeOptions) ?? {};
}

export function schemaKeyFromPropertyDescriptor(prop: {
    key?: unknown;
    typeOptions?: unknown;
}): string | undefined {
    const typeOptions = readRecord(prop.typeOptions) ?? {};
    const overrideKey = typeof typeOptions.schemaPropertyKey === 'string'
        ? typeOptions.schemaPropertyKey.trim()
        : '';
    if (overrideKey) return overrideKey;
    return typeof prop.key === 'string' && prop.key.trim() ? prop.key.trim() : undefined;
}

function applySeparateValidationKeys(
    wire: IngressInputSchemaWire,
    data: Record<string, unknown>,
    prop: SchemaPropertyInfo,
): IngressInputSchemaWire {
    const typeOptions = typeOptionsFromProperty(prop);
    const validationKey = typeof typeOptions.validationPropertyKey === 'string'
        ? typeOptions.validationPropertyKey.trim()
        : '';
    const validationLevelKey = typeof typeOptions.validationLevelPropertyKey === 'string'
        ? typeOptions.validationLevelPropertyKey.trim()
        : '';
    const next: IngressInputSchemaWire = { ...wire };
    if (validationKey && typeof data[validationKey] === 'boolean') {
        next.validation = data[validationKey];
    }
    if (
        validationLevelKey &&
        (data[validationLevelKey] === 'typing' || data[validationLevelKey] === 'basic' || data[validationLevelKey] === 'full')
    ) {
        next.validationLevel = data[validationLevelKey];
    }
    return next;
}

function isSchemaBlob(value: unknown): value is IngressInputSchemaWire {
    const record = readRecord(value);
    if (!record) return false;
    return (
        record.exportSchema != null
        || (typeof record.exportSchemaSource === 'string' && record.exportSchemaSource.trim().length > 0)
        || typeof record.schemaBuildKey === 'string'
        || record.validationLevel != null
        || typeof record.validation === 'boolean'
    );
}

/**
 * FNV-1a-style hash for schema source change detection (browser + Node safe).
 */
export function computeSchemaSourceHash(source: string): string {
    let hash = 2166136261;
    for (let i = 0; i < source.length; i += 1) {
        hash ^= source.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
}

/** True when compiled artifacts match the current source hash. */
export function schemaArtifactsFresh(blob: IngressInputSchemaWire | undefined): boolean {
    if (!blob) return false;
    const source = typeof blob.exportSchemaSource === 'string' ? blob.exportSchemaSource.trim() : '';
    if (!source) return false;
    const storedHash = typeof blob.sourceHash === 'string' ? blob.sourceHash.trim() : '';
    if (!storedHash || storedHash !== computeSchemaSourceHash(source)) return false;

    const hasCompiled =
        (typeof blob.compiledValidatorKey === 'string' && blob.compiledValidatorKey.trim().length > 0)
        || (typeof blob.edgeValidatorKey === 'string' && blob.edgeValidatorKey.trim().length > 0);
    const hasJsonSchema =
        blob.exportSchema != null && typeof blob.exportSchema === 'object' && !Array.isArray(blob.exportSchema);

    const level = ingressValidationLevelFromSchema(blob);
    if (level === 'full') {
        return hasCompiled;
    }
    if (level === 'basic') {
        return hasJsonSchema;
    }
    return hasCompiled || hasJsonSchema;
}

export function deriveEdgeValidatorKey(compiledValidatorKey: string): string {
    if (compiledValidatorKey.endsWith(EDGE_VALIDATOR_SUFFIX)) return compiledValidatorKey;
    if (compiledValidatorKey.endsWith(COMPILED_VALIDATOR_SUFFIX)) {
        return compiledValidatorKey.slice(0, -COMPILED_VALIDATOR_SUFFIX.length) + EDGE_VALIDATOR_SUFFIX;
    }
    return '';
}

function readValidatorBackend(inputSchema: IngressInputSchemaWire | undefined): 'inline' | 'sidecar' | undefined {
    return inputSchema?.validatorBackend === 'inline' || inputSchema?.validatorBackend === 'sidecar'
        ? inputSchema.validatorBackend
        : undefined;
}

function readCoerceLeafPrimitives(inputSchema: IngressInputSchemaWire | undefined): boolean | 'auto' | undefined {
    const mode = inputSchema?.coerceLeafPrimitives;
    return typeof mode === 'boolean' || mode === 'auto' ? mode : undefined;
}

export function ingressValidationLevelFromSchema(
    inputSchema: IngressInputSchemaWire | undefined,
): IngressValidationLevel {
    if (!inputSchema) return 'typing';
    if (
        inputSchema.validationLevel === 'typing'
        || inputSchema.validationLevel === 'basic'
        || inputSchema.validationLevel === 'full'
    ) {
        return inputSchema.validationLevel;
    }
    return inputSchema.validation === true ? 'full' : 'typing';
}

/**
 * Resolve every `$.interface.schema` property to its persisted blob keyed by
 * schema property key.
 */
export function resolveIngressInputSchemas(
    publishPayload: Record<string, unknown>,
    properties?: Record<string, unknown>,
): Record<string, IngressInputSchemaWire> {
    const out: Record<string, IngressInputSchemaWire> = {};
    if (properties) {
        for (const value of Object.values(properties)) {
            const prop = schemaPropertyInfo(value);
            if (!prop) continue;
            const schemaKey = schemaKeyFromPropertyDescriptor(prop);
            if (!schemaKey) continue;
            const schemaBlob = readRecord(publishPayload[schemaKey]);
            if (!schemaBlob) continue;
            out[schemaKey] = applySeparateValidationKeys(
                schemaBlob as IngressInputSchemaWire,
                publishPayload,
                prop,
            );
        }
    }
    if (Object.keys(out).length === 0) {
        for (const [key, value] of Object.entries(publishPayload)) {
            if (!isSchemaBlob(value)) continue;
            out[key] = value as IngressInputSchemaWire;
        }
    }
    return out;
}

/** Resolve schema blobs from element instance data (element-host save path). */
export function resolveIngressInputSchemasFromElementData(
    elementData: Record<string, unknown>,
): Record<string, IngressInputSchemaWire> {
    const out: Record<string, IngressInputSchemaWire> = {};
    for (const [key, value] of Object.entries(elementData)) {
        if (key.startsWith('$') || key.startsWith('$$')) continue;
        if (!isSchemaBlob(value)) continue;
        out[key] = value as IngressInputSchemaWire;
    }
    return out;
}

export class IngressValidateSchemaResolutionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IngressValidateSchemaResolutionError';
    }
}

/**
 * Pick the schema property key for a `validate` reference. When `schema` is
 * omitted, requires exactly one known schema key.
 */
export function resolveValidateSchemaKey(
    referenceSchema: string | undefined,
    knownKeys: string[],
): string {
    const trimmed = typeof referenceSchema === 'string' ? referenceSchema.trim() : '';
    if (trimmed) {
        if (!knownKeys.includes(trimmed)) {
            throw new IngressValidateSchemaResolutionError(
                `validate filter references unknown schema property "${trimmed}"; known: ${knownKeys.join(', ') || '(none)'}`,
            );
        }
        return trimmed;
    }
    if (knownKeys.length === 1) return knownKeys[0]!;
    if (knownKeys.length === 0) {
        throw new IngressValidateSchemaResolutionError(
            'validate filter requires config.schema when no interface schema properties are present',
        );
    }
    throw new IngressValidateSchemaResolutionError(
        `validate filter requires config.schema when multiple interface schema properties exist (${knownKeys.join(', ')})`,
    );
}

function withoutUndefinedFields(config: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(config).filter(([, value]) => value !== undefined));
}

/**
 * Project one author `validate` reference into an actionable filter using the
 * referenced property's validation level and compiled artifacts.
 */
export function materializeValidationFilter(
    reference: IngressValidateSchemaFilter,
    inputSchema: IngressInputSchemaWire | undefined,
): IngressFilterDescriptor | undefined {
    const level = ingressValidationLevelFromSchema(inputSchema);
    const schemaName = typeof reference.schema === 'string' && reference.schema.trim()
        ? reference.schema.trim()
        : 'inputSchema';

    if (level === 'typing') return undefined;

    if (level === 'basic') {
        const schema = inputSchema?.exportSchema;
        if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return undefined;
        return {
            type: 'validate_json_schema',
            config: withoutUndefinedFields({
                schema: schema as Record<string, unknown>,
                coerceLeafPrimitives: readCoerceLeafPrimitives(inputSchema),
            }) as { schema: Record<string, unknown> },
        };
    }

    const schemaBuildId = typeof inputSchema?.schemaBuildKey === 'string' ? inputSchema.schemaBuildKey.trim() : '';
    const edgeValidatorKey =
        typeof inputSchema?.edgeValidatorKey === 'string' ? inputSchema.edgeValidatorKey.trim() : '';
    const compiledValidatorKey =
        typeof inputSchema?.compiledValidatorKey === 'string' ? inputSchema.compiledValidatorKey.trim() : '';
    const validatorBackend = readValidatorBackend(inputSchema);
    if (!schemaBuildId) return undefined;

    const artifactKey = edgeValidatorKey || deriveEdgeValidatorKey(compiledValidatorKey);
    return {
        type: 'validate_zod',
        config: withoutUndefinedFields({
            schemaBuildId,
            artifactKey: artifactKey || undefined,
            compiledValidatorKey: compiledValidatorKey || undefined,
            schemaName,
            validatorBackend,
        }),
    } as IngressFilterDescriptor;
}

/**
 * Resolve a `validate_schema` reference to a known schema key for lazy
 * publish-time materialization.
 *
 * The reference is the durable source of truth, so an *absent* schema — an
 * explicit key that isn't (yet) compiled, or no schema properties at all — is a
 * normal "validation disabled" state and resolves to `undefined` (drop). Only a
 * genuinely *ambiguous* omitted reference (multiple schema properties, none
 * named) is an authoring error and still throws.
 */
function resolveValidateSchemaKeyLenient(
    referenceSchema: string | undefined,
    knownKeys: string[],
): string | undefined {
    const trimmed = typeof referenceSchema === 'string' ? referenceSchema.trim() : '';
    if (trimmed) return knownKeys.includes(trimmed) ? trimmed : undefined;
    if (knownKeys.length <= 1) return knownKeys[0];
    throw new IngressValidateSchemaResolutionError(
        `validate filter requires config.schema when multiple interface schema properties exist (${knownKeys.join(', ')})`,
    );
}

/**
 * Replace each `{ type: 'validate_schema' }` slot with its materialized
 * actionable filter. Drops the slot when the referenced schema is absent,
 * cleared, or at `typing` level. Preserves chain order.
 */
export function materializeIngressFilterChain(
    filters: IngressFilterDescriptor[],
    schemasByKey: Record<string, IngressInputSchemaWire>,
): IngressFilterDescriptor[] {
    const knownKeys = Object.keys(schemasByKey);
    const out: IngressFilterDescriptor[] = [];
    for (const filter of filters) {
        if (filter.type !== 'validate_schema') {
            out.push(filter);
            continue;
        }
        const schemaKey = resolveValidateSchemaKeyLenient(filter.schema, knownKeys);
        if (!schemaKey) continue;
        const materialized = materializeValidationFilter(filter, schemasByKey[schemaKey]);
        if (materialized) out.push(materialized);
    }
    return out;
}

/** First property-backed schema key for back-compat `inputSchema` wire field. */
export function primaryIngressInputSchema(
    schemasByKey: Record<string, IngressInputSchemaWire>,
): IngressInputSchemaWire | undefined {
    const keys = Object.keys(schemasByKey);
    return keys.length > 0 ? schemasByKey[keys[0]!] : undefined;
}

export function isActionableValidationFilter(filter: IngressFilterDescriptor): boolean {
    return ACTIONABLE_VALIDATION_TYPES.has(filter.type);
}
