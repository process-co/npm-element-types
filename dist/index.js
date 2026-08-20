"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodObjectToContainerExportJsonSchema = exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = exports.DEFAULT_DEFER_HTTP_RESPONSE_MS = exports.PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = exports.IngressValidateSchemaResolutionError = exports.schemaKeyFromPropertyDescriptor = exports.schemaArtifactsFresh = exports.resolveValidateSchemaKey = exports.resolveIngressInputSchemasFromElementData = exports.resolveIngressInputSchemas = exports.primaryIngressInputSchema = exports.materializeValidationFilter = exports.materializeIngressFilterChain = exports.ingressValidationLevelFromSchema = exports.deriveEdgeValidatorKey = exports.computeSchemaSourceHash = exports.INGRESS_FILTER_TYPES = exports.INGRESS_FILTERS_KEY = exports.REPLAY_META_RANGE = exports.REPLAY_BINDING_RANGE = exports.HTTP_REQUEST_CACHE_POLICY_KEY = exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.isKnownExecutionTagKey = exports.SOCKET_STATE_TAG = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = exports.containerRuntimeRangeKey = exports.CONTAINER_RUNTIME_ROUTING_SLUG = exports.CallableRecoveryDecisionSchema = exports.CallableSettlementSchema = exports.CallableErrorEnvelopeSchema = exports.CallableInvocationPolicySnapshotSchema = exports.CallableInvocationEnvelopeSchema = exports.CallableInvocationIdentitySchema = exports.CallableInvocationDefinitionSchema = exports.CallableResourceReferenceSchema = exports.CallableVersionSelectorSchema = exports.ObjectProjectionDocumentSchema = exports.evaluatePropVisibility = void 0;
exports.resolveHttpInterfaceEmitWireFromAppData = resolveHttpInterfaceEmitWireFromAppData;
exports.resolveSignalHookIsDraft = resolveSignalHookIsDraft;
exports.setSignalEmitValidationHost = setSignalEmitValidationHost;
exports.validateEmitPayload = validateEmitPayload;
exports.defineApp = defineApp;
exports.defineAction = defineAction;
exports.defineSignal = defineSignal;
require("./schema-documentation");
var property_visibility_1 = require("./property-visibility");
Object.defineProperty(exports, "evaluatePropVisibility", { enumerable: true, get: function () { return property_visibility_1.evaluatePropVisibility; } });
var callable_resource_1 = require("./callable-resource");
Object.defineProperty(exports, "ObjectProjectionDocumentSchema", { enumerable: true, get: function () { return callable_resource_1.ObjectProjectionDocumentSchema; } });
Object.defineProperty(exports, "CallableVersionSelectorSchema", { enumerable: true, get: function () { return callable_resource_1.CallableVersionSelectorSchema; } });
Object.defineProperty(exports, "CallableResourceReferenceSchema", { enumerable: true, get: function () { return callable_resource_1.CallableResourceReferenceSchema; } });
Object.defineProperty(exports, "CallableInvocationDefinitionSchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationDefinitionSchema; } });
Object.defineProperty(exports, "CallableInvocationIdentitySchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationIdentitySchema; } });
Object.defineProperty(exports, "CallableInvocationEnvelopeSchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationEnvelopeSchema; } });
Object.defineProperty(exports, "CallableInvocationPolicySnapshotSchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationPolicySnapshotSchema; } });
Object.defineProperty(exports, "CallableErrorEnvelopeSchema", { enumerable: true, get: function () { return callable_resource_1.CallableErrorEnvelopeSchema; } });
Object.defineProperty(exports, "CallableSettlementSchema", { enumerable: true, get: function () { return callable_resource_1.CallableSettlementSchema; } });
Object.defineProperty(exports, "CallableRecoveryDecisionSchema", { enumerable: true, get: function () { return callable_resource_1.CallableRecoveryDecisionSchema; } });
var container_runtime_routing_1 = require("./container-runtime-routing");
Object.defineProperty(exports, "CONTAINER_RUNTIME_ROUTING_SLUG", { enumerable: true, get: function () { return container_runtime_routing_1.CONTAINER_RUNTIME_ROUTING_SLUG; } });
Object.defineProperty(exports, "containerRuntimeRangeKey", { enumerable: true, get: function () { return container_runtime_routing_1.containerRuntimeRangeKey; } });
var builtin_action_slots_registry_1 = require("./builtin-action-slots-registry");
Object.defineProperty(exports, "builtinActionSlotsRegistry", { enumerable: true, get: function () { return builtin_action_slots_registry_1.builtinActionSlotsRegistry; } });
/** Locked authoring catalog **types** + version (runtime materialize: **`@process.co/compatibility`** **`authoring-spec`**). */
var authoring_contract_types_1 = require("./authoring-contract-types");
Object.defineProperty(exports, "ELEMENT_AUTHORING_CONTRACT_VERSION", { enumerable: true, get: function () { return authoring_contract_types_1.ELEMENT_AUTHORING_CONTRACT_VERSION; } });
var execution_tags_1 = require("./execution-tags");
Object.defineProperty(exports, "SOCKET_STATE_TAG", { enumerable: true, get: function () { return execution_tags_1.SOCKET_STATE_TAG; } });
Object.defineProperty(exports, "isKnownExecutionTagKey", { enumerable: true, get: function () { return execution_tags_1.isKnownExecutionTagKey; } });
var platform_loader_type_1 = require("./platform-loader-type");
Object.defineProperty(exports, "PLATFORM_BOUND_LOADER_TYPE_PREFIXES", { enumerable: true, get: function () { return platform_loader_type_1.PLATFORM_BOUND_LOADER_TYPE_PREFIXES; } });
Object.defineProperty(exports, "isPlatformBoundLoaderType", { enumerable: true, get: function () { return platform_loader_type_1.isPlatformBoundLoaderType; } });
var http_request_cache_1 = require("./http-request-cache");
Object.defineProperty(exports, "HTTP_REQUEST_CACHE_POLICY_KEY", { enumerable: true, get: function () { return http_request_cache_1.HTTP_REQUEST_CACHE_POLICY_KEY; } });
Object.defineProperty(exports, "REPLAY_BINDING_RANGE", { enumerable: true, get: function () { return http_request_cache_1.REPLAY_BINDING_RANGE; } });
Object.defineProperty(exports, "REPLAY_META_RANGE", { enumerable: true, get: function () { return http_request_cache_1.REPLAY_META_RANGE; } });
var ingress_filters_1 = require("./ingress-filters");
Object.defineProperty(exports, "INGRESS_FILTERS_KEY", { enumerable: true, get: function () { return ingress_filters_1.INGRESS_FILTERS_KEY; } });
Object.defineProperty(exports, "INGRESS_FILTER_TYPES", { enumerable: true, get: function () { return ingress_filters_1.INGRESS_FILTER_TYPES; } });
var ingress_schema_materialize_1 = require("./ingress-schema-materialize");
Object.defineProperty(exports, "computeSchemaSourceHash", { enumerable: true, get: function () { return ingress_schema_materialize_1.computeSchemaSourceHash; } });
Object.defineProperty(exports, "deriveEdgeValidatorKey", { enumerable: true, get: function () { return ingress_schema_materialize_1.deriveEdgeValidatorKey; } });
Object.defineProperty(exports, "ingressValidationLevelFromSchema", { enumerable: true, get: function () { return ingress_schema_materialize_1.ingressValidationLevelFromSchema; } });
Object.defineProperty(exports, "materializeIngressFilterChain", { enumerable: true, get: function () { return ingress_schema_materialize_1.materializeIngressFilterChain; } });
Object.defineProperty(exports, "materializeValidationFilter", { enumerable: true, get: function () { return ingress_schema_materialize_1.materializeValidationFilter; } });
Object.defineProperty(exports, "primaryIngressInputSchema", { enumerable: true, get: function () { return ingress_schema_materialize_1.primaryIngressInputSchema; } });
Object.defineProperty(exports, "resolveIngressInputSchemas", { enumerable: true, get: function () { return ingress_schema_materialize_1.resolveIngressInputSchemas; } });
Object.defineProperty(exports, "resolveIngressInputSchemasFromElementData", { enumerable: true, get: function () { return ingress_schema_materialize_1.resolveIngressInputSchemasFromElementData; } });
Object.defineProperty(exports, "resolveValidateSchemaKey", { enumerable: true, get: function () { return ingress_schema_materialize_1.resolveValidateSchemaKey; } });
Object.defineProperty(exports, "schemaArtifactsFresh", { enumerable: true, get: function () { return ingress_schema_materialize_1.schemaArtifactsFresh; } });
Object.defineProperty(exports, "schemaKeyFromPropertyDescriptor", { enumerable: true, get: function () { return ingress_schema_materialize_1.schemaKeyFromPropertyDescriptor; } });
Object.defineProperty(exports, "IngressValidateSchemaResolutionError", { enumerable: true, get: function () { return ingress_schema_materialize_1.IngressValidateSchemaResolutionError; } });
function schemaPersistenceKeyFromPropInfo(propInfo) {
    const raw = propInfo.typeOptions?.schemaPropertyKey;
    if (typeof raw === 'string' && raw.trim().length > 0)
        return raw.trim();
    const key = propInfo.key;
    return typeof key === 'string' && key.length > 0 ? key : undefined;
}
function validationPersistenceKeyFromPropInfo(propInfo) {
    const raw = propInfo.typeOptions?.validationPropertyKey;
    return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : undefined;
}
/**
 * Resolves the persisted schema wire for the first `$.interface.schema`
 * property on an element instance. This is shared by every signal runtime so
 * editor, Node-transition, and element-host invocations cannot drift on which
 * authored validation policy is active.
 */
function resolveHttpInterfaceEmitWireFromAppData(app, data) {
    if (!app || typeof app !== 'object' || !data || typeof data !== 'object' || Array.isArray(data)) {
        return undefined;
    }
    const instanceData = data;
    for (const metaKey of Object.keys(app)) {
        if (!metaKey.startsWith('&PROC&__'))
            continue;
        const propInfo = app[metaKey];
        if (!propInfo || typeof propInfo !== 'object')
            continue;
        const propRecord = propInfo;
        if (propRecord.type !== '$.interface.schema')
            continue;
        const schemaKey = schemaPersistenceKeyFromPropInfo(propRecord);
        if (!schemaKey)
            continue;
        const blob = instanceData[schemaKey];
        if (!blob || typeof blob !== 'object' || Array.isArray(blob))
            continue;
        const wire = { ...blob };
        const validationKey = validationPersistenceKeyFromPropInfo(propRecord);
        if (validationKey && Object.prototype.hasOwnProperty.call(instanceData, validationKey)) {
            const validation = instanceData[validationKey];
            if (typeof validation === 'boolean')
                wire.validation = validation;
        }
        return wire;
    }
    return undefined;
}
/** Resolve `$.isDraft` for hook invocations (explicit flag wins; else `executionContext === 'editor'`). */
function resolveSignalHookIsDraft(ctx) {
    if (typeof ctx.isDraft === 'boolean') {
        return ctx.isDraft;
    }
    return ctx.executionContext === 'editor';
}
/**
 * Marker on successful `schema.enforce` RPC results from the Process API.
 * Zod-validated HTTP bodies may legally include their own `ok` / `value` fields; this
 * discriminant prevents {@link validateEmitPayload} (and worker RPC unwrap) from
 * confusing user payloads with the host envelope.
 *
 * Keep in sync with `apps/api` `DynamicRunnerService` `schema.enforce` and `runner-host` unwrap.
 */
exports.PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = 'enforceSchema';
/** Shared across bundled copies of this package in the same JS realm (worker isolate). */
const SIGNAL_EMIT_VALIDATION_HOST = Symbol.for('process.co.signalEmitValidationHost');
function getSignalEmitValidationHostBinding() {
    return globalThis[SIGNAL_EMIT_VALIDATION_HOST];
}
/**
 * Binds the trusted signal host used by {@link validateEmitPayload} for the current
 * invocation. The runner sets this from the RPC/proxy host **outside** element code and
 * clears it when the invocation completes. Uses `globalThis` so a bundled copy of
 * `validateEmitPayload` inside an element module still sees the same binding as the runner.
 */
function setSignalEmitValidationHost(host) {
    const g = globalThis;
    if (host === undefined) {
        delete g[SIGNAL_EMIT_VALIDATION_HOST];
    }
    else {
        g[SIGNAL_EMIT_VALIDATION_HOST] = host;
    }
}
function validationIssuesFromUnknown(e) {
    if (!e || typeof e !== 'object')
        return undefined;
    const issues = e.issues;
    if (!Array.isArray(issues) || issues.length === 0)
        return undefined;
    const out = [];
    for (const row of issues) {
        if (!row || typeof row !== 'object')
            continue;
        const o = row;
        out.push({
            path: typeof o.path === 'string' ? o.path : '(root)',
            message: typeof o.message === 'string' ? o.message : String(o.message ?? ''),
            code: typeof o.code === 'string' ? o.code : 'custom',
        });
    }
    return out.length > 0 ? out : undefined;
}
/**
 * Validation policy: `inputSchema.validation === true` is the sole switch that turns
 * runtime Zod enforcement on. The presence of `compiledValidatorKey` /
 * `exportSchemaSource` is authoring metadata for editor type inference and does not, by
 * itself, cause runtime validation. When validation is on, this awaits the bound host's
 * `enforceSchema` so the API runs the **compiled Zod** validator. Otherwise returns
 * `value` unchanged.
 *
 * On failure, `issues` lists Zod paths/messages when the host provides them (forward into your
 * `http.respond` JSON body alongside any `requestStatus` you use).
 * (see {@link setSignalEmitValidationHost}).
 */
async function validateEmitPayload(inputSchema, value) {
    if (inputSchema?.validation !== true) {
        return { ok: true, value: value };
    }
    const bound = getSignalEmitValidationHostBinding();
    const enforce = bound?.enforceSchema;
    if (typeof enforce !== 'function') {
        return {
            ok: false,
            message: 'Input validation is enabled for this HTTP trigger, but the runtime did not provide enforceSchema. Use `run`/`this.$` from the Process worker (RPC host), and pass the wire from `$.interfaceEmitSchema` as the first argument to `$.enforceSchema`.',
        };
    }
    try {
        const out = await enforce(inputSchema, value);
        if (out && typeof out === 'object' && 'ok' in out) {
            const r = out;
            if (r.ok === false && typeof r.message === 'string') {
                return r.issues?.length
                    ? { ok: false, message: r.message, issues: r.issues }
                    : { ok: false, message: r.message };
            }
            if (r.ok === true && 'value' in r) {
                return { ok: true, value: r.value };
            }
        }
        // Legacy host binding returned bare validated payload (not `EnforceSchemaResult`).
        return { ok: true, value: out };
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const issues = validationIssuesFromUnknown(e);
        return issues?.length ? { ok: false, message, issues } : { ok: false, message };
    }
}
/** Default TTFB deadline (ms) when {@link HttpInterfaceType.deferHttpResponse} omits `timeoutMs`. */
exports.DEFAULT_DEFER_HTTP_RESPONSE_MS = 30_000;
// Helper to provide ThisType context for app definitions
function defineApp(app) {
    return app;
}
function defineAction(action) {
    return action;
}
function defineSignal(signal) {
    return signal;
}
var zod_container_export_json_schema_1 = require("./zod-container-export-json-schema");
Object.defineProperty(exports, "ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS", { enumerable: true, get: function () { return zod_container_export_json_schema_1.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS; } });
Object.defineProperty(exports, "zodObjectToContainerExportJsonSchema", { enumerable: true, get: function () { return zod_container_export_json_schema_1.zodObjectToContainerExportJsonSchema; } });
__exportStar(require("./action-surface"), exports);
__exportStar(require("./action-capability"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrVkEsMEZBbUNDO0FBOFFELDREQUtDO0FBbUVELGtFQVNDO0FBK0JELGtEQW9DQztBQTQwQkQsOEJBRUM7QUE2S0Qsb0NBYUM7QUEwTkQsb0NBV0M7QUFsZ0VELGtDQUFnQztBQWtDaEMsNkRBQStEO0FBQXRELDZIQUFBLHNCQUFzQixPQUFBO0FBd0MvQix5REFXNkI7QUFWM0IsbUlBQUEsOEJBQThCLE9BQUE7QUFDOUIsa0lBQUEsNkJBQTZCLE9BQUE7QUFDN0Isb0lBQUEsK0JBQStCLE9BQUE7QUFDL0IsdUlBQUEsa0NBQWtDLE9BQUE7QUFDbEMscUlBQUEsZ0NBQWdDLE9BQUE7QUFDaEMscUlBQUEsZ0NBQWdDLE9BQUE7QUFDaEMsMklBQUEsc0NBQXNDLE9BQUE7QUFDdEMsZ0lBQUEsMkJBQTJCLE9BQUE7QUFDM0IsNkhBQUEsd0JBQXdCLE9BQUE7QUFDeEIsbUlBQUEsOEJBQThCLE9BQUE7QUFHaEMseUVBR3FDO0FBRm5DLDJJQUFBLDhCQUE4QixPQUFBO0FBQzlCLHFJQUFBLHdCQUF3QixPQUFBO0FBVzFCLGlGQUt5QztBQUpyQywySUFBQSwwQkFBMEIsT0FBQTtBQWM5QixnSUFBZ0k7QUFDaEksdUVBQWdGO0FBQXZFLDhJQUFBLGtDQUFrQyxPQUFBO0FBRTNDLG1EQUcwQjtBQUZ4QixrSEFBQSxnQkFBZ0IsT0FBQTtBQUNoQix3SEFBQSxzQkFBc0IsT0FBQTtBQTBCeEIsK0RBR2dDO0FBRjVCLDJJQUFBLG1DQUFtQyxPQUFBO0FBQ25DLGlJQUFBLHlCQUF5QixPQUFBO0FBRzdCLDJEQVc4QjtBQVYxQixtSUFBQSw2QkFBNkIsT0FBQTtBQUM3QiwwSEFBQSxvQkFBb0IsT0FBQTtBQUNwQix1SEFBQSxpQkFBaUIsT0FBQTtBQVVyQixxREFrQjJCO0FBakJ2QixzSEFBQSxtQkFBbUIs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