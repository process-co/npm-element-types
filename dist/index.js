"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBa1ZBLDBGQW1DQztBQThRRCw0REFLQztBQW1FRCxrRUFTQztBQStCRCxrREFvQ0M7QUE0MEJELDhCQUVDO0FBMktELG9DQVdDO0FBZ05ELG9DQVdDO0FBcC9ERCxrQ0FBZ0M7QUFrQ2hDLDZEQUErRDtBQUF0RCw2SEFBQSxzQkFBc0IsT0FBQTtBQXdDL0IseURBVzZCO0FBVjNCLG1JQUFBLDhCQUE4QixPQUFBO0FBQzlCLGtJQUFBLDZCQUE2QixPQUFBO0FBQzdCLG9JQUFBLCtCQUErQixPQUFBO0FBQy9CLHVJQUFBLGtDQUFrQyxPQUFBO0FBQ2xDLHFJQUFBLGdDQUFnQyxPQUFBO0FBQ2hDLHFJQUFBLGdDQUFnQyxPQUFBO0FBQ2hDLDJJQUFBLHNDQUFzQyxPQUFBO0FBQ3RDLGdJQUFBLDJCQUEyQixPQUFBO0FBQzNCLDZIQUFBLHdCQUF3QixPQUFBO0FBQ3hCLG1JQUFBLDhCQUE4QixPQUFBO0FBR2hDLHlFQUdxQztBQUZuQywySUFBQSw4QkFBOEIsT0FBQTtBQUM5QixxSUFBQSx3QkFBd0IsT0FBQTtBQVcxQixpRkFLeUM7QUFKckMsMklBQUEsMEJBQTBCLE9BQUE7QUFjOUIsZ0lBQWdJO0FBQ2hJLHVFQUFnRjtBQUF2RSw4SUFBQSxrQ0FBa0MsT0FBQTtBQUUzQyxtREFHMEI7QUFGeEIsa0hBQUEsZ0JBQWdCLE9BQUE7QUFDaEIsd0hBQUEsc0JBQXNCLE9BQUE7QUEwQnhCLCtEQUdnQztBQUY1QiwySUFBQSxtQ0FBbUMsT0FBQTtBQUNuQyxpSUFBQSx5QkFBeUIsT0FBQTtBQUc3QiwyREFXOEI7QUFWMUIsbUlBQUEsNkJBQTZCLE9BQUE7QUFDN0IsMEhBQUEsb0JBQW9CLE9BQUE7QUFDcEIsdUhBQUEsaUJBQWlCLE9BQUE7QUFVckIscURBa0IyQjtBQWpCdkIsc0hBQUEsbUJBQW1CLE9BQUE7QUFDbkIsdUhB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