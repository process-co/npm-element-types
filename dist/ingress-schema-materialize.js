"use strict";
/**
 * Shared ingress validation materialization: resolve per-key `$.interface.schema`
 * property blobs and project author-facing `{ type: 'validate_schema' }` references
 * into actionable `validate_json_schema` / `validate_zod` filters for the Go edge.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngressValidateSchemaResolutionError = void 0;
exports.schemaKeyFromPropertyDescriptor = schemaKeyFromPropertyDescriptor;
exports.computeSchemaSourceHash = computeSchemaSourceHash;
exports.schemaArtifactsFresh = schemaArtifactsFresh;
exports.deriveEdgeValidatorKey = deriveEdgeValidatorKey;
exports.ingressValidationLevelFromSchema = ingressValidationLevelFromSchema;
exports.resolveIngressInputSchemas = resolveIngressInputSchemas;
exports.resolveIngressInputSchemasFromElementData = resolveIngressInputSchemasFromElementData;
exports.resolveValidateSchemaKey = resolveValidateSchemaKey;
exports.materializeValidationFilter = materializeValidationFilter;
exports.materializeIngressFilterChain = materializeIngressFilterChain;
exports.primaryIngressInputSchema = primaryIngressInputSchema;
exports.isActionableValidationFilter = isActionableValidationFilter;
const COMPILED_VALIDATOR_SUFFIX = '.validator.mjs';
const EDGE_VALIDATOR_SUFFIX = '.edge-validator.js';
const ACTIONABLE_VALIDATION_TYPES = new Set(['validate_json_schema', 'validate_zod']);
function readRecord(value) {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? value
        : undefined;
}
function schemaPropertyInfo(value) {
    const outer = readRecord(value);
    if (!outer)
        return undefined;
    const inner = readRecord(outer.data);
    const candidate = inner ?? outer;
    return candidate.type === '$.interface.schema' ? candidate : undefined;
}
function typeOptionsFromProperty(prop) {
    return readRecord(prop.typeOptions) ?? {};
}
function schemaKeyFromPropertyDescriptor(prop) {
    const typeOptions = readRecord(prop.typeOptions) ?? {};
    const overrideKey = typeof typeOptions.schemaPropertyKey === 'string'
        ? typeOptions.schemaPropertyKey.trim()
        : '';
    if (overrideKey)
        return overrideKey;
    return typeof prop.key === 'string' && prop.key.trim() ? prop.key.trim() : undefined;
}
function applySeparateValidationKeys(wire, data, prop) {
    const typeOptions = typeOptionsFromProperty(prop);
    const validationKey = typeof typeOptions.validationPropertyKey === 'string'
        ? typeOptions.validationPropertyKey.trim()
        : '';
    const validationLevelKey = typeof typeOptions.validationLevelPropertyKey === 'string'
        ? typeOptions.validationLevelPropertyKey.trim()
        : '';
    const next = { ...wire };
    if (validationKey && typeof data[validationKey] === 'boolean') {
        next.validation = data[validationKey];
    }
    if (validationLevelKey &&
        (data[validationLevelKey] === 'typing' || data[validationLevelKey] === 'basic' || data[validationLevelKey] === 'full')) {
        next.validationLevel = data[validationLevelKey];
    }
    return next;
}
function isSchemaBlob(value) {
    const record = readRecord(value);
    if (!record)
        return false;
    return (record.exportSchema != null
        || (typeof record.exportSchemaSource === 'string' && record.exportSchemaSource.trim().length > 0)
        || typeof record.schemaBuildKey === 'string'
        || record.validationLevel != null
        || typeof record.validation === 'boolean');
}
/**
 * FNV-1a-style hash for schema source change detection (browser + Node safe).
 */
function computeSchemaSourceHash(source) {
    let hash = 2166136261;
    for (let i = 0; i < source.length; i += 1) {
        hash ^= source.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
}
/** True when compiled artifacts match the current source hash. */
function schemaArtifactsFresh(blob) {
    if (!blob)
        return false;
    const source = typeof blob.exportSchemaSource === 'string' ? blob.exportSchemaSource.trim() : '';
    if (!source)
        return false;
    const storedHash = typeof blob.sourceHash === 'string' ? blob.sourceHash.trim() : '';
    if (!storedHash || storedHash !== computeSchemaSourceHash(source))
        return false;
    const hasCompiled = (typeof blob.compiledValidatorKey === 'string' && blob.compiledValidatorKey.trim().length > 0)
        || (typeof blob.edgeValidatorKey === 'string' && blob.edgeValidatorKey.trim().length > 0);
    const hasJsonSchema = blob.exportSchema != null && typeof blob.exportSchema === 'object' && !Array.isArray(blob.exportSchema);
    const level = ingressValidationLevelFromSchema(blob);
    if (level === 'full') {
        return hasCompiled;
    }
    if (level === 'basic') {
        return hasJsonSchema;
    }
    return hasCompiled || hasJsonSchema;
}
function deriveEdgeValidatorKey(compiledValidatorKey) {
    if (compiledValidatorKey.endsWith(EDGE_VALIDATOR_SUFFIX))
        return compiledValidatorKey;
    if (compiledValidatorKey.endsWith(COMPILED_VALIDATOR_SUFFIX)) {
        return compiledValidatorKey.slice(0, -COMPILED_VALIDATOR_SUFFIX.length) + EDGE_VALIDATOR_SUFFIX;
    }
    return '';
}
function readValidatorBackend(inputSchema) {
    return inputSchema?.validatorBackend === 'inline' || inputSchema?.validatorBackend === 'sidecar'
        ? inputSchema.validatorBackend
        : undefined;
}
function readCoerceLeafPrimitives(inputSchema) {
    const mode = inputSchema?.coerceLeafPrimitives;
    return typeof mode === 'boolean' || mode === 'auto' ? mode : undefined;
}
function ingressValidationLevelFromSchema(inputSchema) {
    if (!inputSchema)
        return 'typing';
    if (inputSchema.validationLevel === 'typing'
        || inputSchema.validationLevel === 'basic'
        || inputSchema.validationLevel === 'full') {
        return inputSchema.validationLevel;
    }
    return inputSchema.validation === true ? 'full' : 'typing';
}
/**
 * Resolve every `$.interface.schema` property to its persisted blob keyed by
 * schema property key.
 */
function resolveIngressInputSchemas(publishPayload, properties) {
    const out = {};
    if (properties) {
        for (const value of Object.values(properties)) {
            const prop = schemaPropertyInfo(value);
            if (!prop)
                continue;
            const schemaKey = schemaKeyFromPropertyDescriptor(prop);
            if (!schemaKey)
                continue;
            const schemaBlob = readRecord(publishPayload[schemaKey]);
            if (!schemaBlob)
                continue;
            out[schemaKey] = applySeparateValidationKeys(schemaBlob, publishPayload, prop);
        }
    }
    if (Object.keys(out).length === 0) {
        for (const [key, value] of Object.entries(publishPayload)) {
            if (!isSchemaBlob(value))
                continue;
            out[key] = value;
        }
    }
    return out;
}
/** Resolve schema blobs from element instance data (element-host save path). */
function resolveIngressInputSchemasFromElementData(elementData) {
    const out = {};
    for (const [key, value] of Object.entries(elementData)) {
        if (key.startsWith('$') || key.startsWith('$$'))
            continue;
        if (!isSchemaBlob(value))
            continue;
        out[key] = value;
    }
    return out;
}
class IngressValidateSchemaResolutionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IngressValidateSchemaResolutionError';
    }
}
exports.IngressValidateSchemaResolutionError = IngressValidateSchemaResolutionError;
/**
 * Pick the schema property key for a `validate` reference. When `schema` is
 * omitted, requires exactly one known schema key.
 */
function resolveValidateSchemaKey(referenceSchema, knownKeys) {
    const trimmed = typeof referenceSchema === 'string' ? referenceSchema.trim() : '';
    if (trimmed) {
        if (!knownKeys.includes(trimmed)) {
            throw new IngressValidateSchemaResolutionError(`validate filter references unknown schema property "${trimmed}"; known: ${knownKeys.join(', ') || '(none)'}`);
        }
        return trimmed;
    }
    if (knownKeys.length === 1)
        return knownKeys[0];
    if (knownKeys.length === 0) {
        throw new IngressValidateSchemaResolutionError('validate filter requires config.schema when no interface schema properties are present');
    }
    throw new IngressValidateSchemaResolutionError(`validate filter requires config.schema when multiple interface schema properties exist (${knownKeys.join(', ')})`);
}
function withoutUndefinedFields(config) {
    return Object.fromEntries(Object.entries(config).filter(([, value]) => value !== undefined));
}
/**
 * Project one author `validate` reference into an actionable filter using the
 * referenced property's validation level and compiled artifacts.
 */
function materializeValidationFilter(reference, inputSchema) {
    const level = ingressValidationLevelFromSchema(inputSchema);
    const schemaName = typeof reference.schema === 'string' && reference.schema.trim()
        ? reference.schema.trim()
        : 'inputSchema';
    if (level === 'typing')
        return undefined;
    if (level === 'basic') {
        const schema = inputSchema?.exportSchema;
        if (!schema || typeof schema !== 'object' || Array.isArray(schema))
            return undefined;
        return {
            type: 'validate_json_schema',
            config: withoutUndefinedFields({
                schema: schema,
                coerceLeafPrimitives: readCoerceLeafPrimitives(inputSchema),
            }),
        };
    }
    const schemaBuildId = typeof inputSchema?.schemaBuildKey === 'string' ? inputSchema.schemaBuildKey.trim() : '';
    const edgeValidatorKey = typeof inputSchema?.edgeValidatorKey === 'string' ? inputSchema.edgeValidatorKey.trim() : '';
    const compiledValidatorKey = typeof inputSchema?.compiledValidatorKey === 'string' ? inputSchema.compiledValidatorKey.trim() : '';
    const validatorBackend = readValidatorBackend(inputSchema);
    if (!schemaBuildId)
        return undefined;
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
    };
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
function resolveValidateSchemaKeyLenient(referenceSchema, knownKeys) {
    const trimmed = typeof referenceSchema === 'string' ? referenceSchema.trim() : '';
    if (trimmed)
        return knownKeys.includes(trimmed) ? trimmed : undefined;
    if (knownKeys.length <= 1)
        return knownKeys[0];
    throw new IngressValidateSchemaResolutionError(`validate filter requires config.schema when multiple interface schema properties exist (${knownKeys.join(', ')})`);
}
/**
 * Replace each `{ type: 'validate_schema' }` slot with its materialized
 * actionable filter. Drops the slot when the referenced schema is absent,
 * cleared, or at `typing` level. Preserves chain order.
 */
function materializeIngressFilterChain(filters, schemasByKey) {
    const knownKeys = Object.keys(schemasByKey);
    const out = [];
    for (const filter of filters) {
        if (filter.type !== 'validate_schema') {
            out.push(filter);
            continue;
        }
        const schemaKey = resolveValidateSchemaKeyLenient(filter.schema, knownKeys);
        if (!schemaKey)
            continue;
        const materialized = materializeValidationFilter(filter, schemasByKey[schemaKey]);
        if (materialized)
            out.push(materialized);
    }
    return out;
}
/** First property-backed schema key for back-compat `inputSchema` wire field. */
function primaryIngressInputSchema(schemasByKey) {
    const keys = Object.keys(schemasByKey);
    return keys.length > 0 ? schemasByKey[keys[0]] : undefined;
}
function isActionableValidationFilter(filter) {
    return ACTIONABLE_VALIDATION_TYPES.has(filter.type);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ncmVzcy1zY2hlbWEtbWF0ZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5ncmVzcy1zY2hlbWEtbWF0ZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7OztBQXVESCwwRUFVQztBQTBDRCwwREFPQztBQUdELG9EQXFCQztBQUVELHdEQU1DO0FBYUQsNEVBWUM7QUFNRCxnRUEyQkM7QUFHRCw4RkFVQztBQWFELDREQXNCQztBQVVELGtFQTBDQztBQTZCRCxzRUFpQkM7QUFHRCw4REFLQztBQUVELG9FQUVDO0FBalZELE1BQU0seUJBQXlCLEdBQUcsZ0JBQWdCLENBQUM7QUFDbkQsTUFBTSxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztBQUVuRCxNQUFNLDJCQUEyQixHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsc0JBQXNCLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztBQVN0RixTQUFTLFVBQVUsQ0FBQyxLQUFjO0lBQzlCLE9BQU8sS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzlELENBQUMsQ0FBQyxLQUFnQztRQUNsQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ3BCLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEtBQWM7SUFDdEMsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDN0IsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDO0lBQ2pDLE9BQU8sU0FBUyxDQUFDLElBQUksS0FBSyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsU0FBK0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxD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