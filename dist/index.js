"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodObjectToContainerExportJsonSchema = exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = exports.DEFAULT_DEFER_HTTP_RESPONSE_MS = exports.PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = exports.INGRESS_FILTER_TYPES = exports.INGRESS_FILTERS_KEY = exports.REPLAY_META_RANGE = exports.REPLAY_BINDING_RANGE = exports.HTTP_REQUEST_CACHE_POLICY_KEY = exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = exports.containerRuntimeRangeKey = exports.CONTAINER_RUNTIME_ROUTING_SLUG = void 0;
exports.resolveSignalHookIsDraft = resolveSignalHookIsDraft;
exports.setSignalEmitValidationHost = setSignalEmitValidationHost;
exports.validateEmitPayload = validateEmitPayload;
exports.defineApp = defineApp;
exports.defineAction = defineAction;
exports.defineSignal = defineSignal;
var container_runtime_routing_1 = require("./container-runtime-routing");
Object.defineProperty(exports, "CONTAINER_RUNTIME_ROUTING_SLUG", { enumerable: true, get: function () { return container_runtime_routing_1.CONTAINER_RUNTIME_ROUTING_SLUG; } });
Object.defineProperty(exports, "containerRuntimeRangeKey", { enumerable: true, get: function () { return container_runtime_routing_1.containerRuntimeRangeKey; } });
var builtin_action_slots_registry_1 = require("./builtin-action-slots-registry");
Object.defineProperty(exports, "builtinActionSlotsRegistry", { enumerable: true, get: function () { return builtin_action_slots_registry_1.builtinActionSlotsRegistry; } });
/** Locked authoring catalog **types** + version (runtime materialize: **`@process.co/compatibility`** **`authoring-spec`**). */
var authoring_contract_types_1 = require("./authoring-contract-types");
Object.defineProperty(exports, "ELEMENT_AUTHORING_CONTRACT_VERSION", { enumerable: true, get: function () { return authoring_contract_types_1.ELEMENT_AUTHORING_CONTRACT_VERSION; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBNFJBLDREQUtDO0FBbUVELGtFQVNDO0FBK0JELGtEQW9DQztBQW93QkQsOEJBRUM7QUF1Q0Qsb0NBSUM7QUE2R0Qsb0NBSUM7QUF0ekNELHlFQUdxQztBQUZuQywySUFBQSw4QkFBOEIsT0FBQTtBQUM5QixxSUFBQSx3QkFBd0IsT0FBQTtBQVcxQixpRkFLeUM7QUFKckMsMklBQUEsMEJBQTBCLE9BQUE7QUFjOUIsZ0lBQWdJO0FBQ2hJLHVFQUFnRjtBQUF2RSw4SUFBQSxrQ0FBa0MsT0FBQTtBQWUzQywrREFHZ0M7QUFGNUIsMklBQUEsbUNBQW1DLE9BQUE7QUFDbkMsaUlBQUEseUJBQXlCLE9BQUE7QUFHN0IsMkRBVzhCO0FBVjFCLG1JQUFBLDZCQUE2QixPQUFBO0FBQzdCLDBIQUFBLG9CQUFvQixPQUFBO0FBQ3BCLHVIQUFBLGlCQUFpQixPQUFBO0FBVXJCLHFEQWlCMkI7QUFoQnZCLHNIQUFBLG1CQUFtQixPQUFBO0FBQ25CLHVIQUFBLG9CQUFvQixPQUFBO0FBK0x4QiwyR0FBMkc7QUFDM0csU0FBZ0Isd0JBQXdCLENBQUMsR0FBZ0M7SUFDckUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDbkMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsS0FBSyxRQUFRLENBQUM7QUFDN0MsQ0FBQztBQW9CRDs7Ozs7OztHQU9HO0FBQ1UsUUFBQSw2Q0FBNkMsR0FBRyxlQUF3QixDQUFDO0FBV3RGLDBGQUEwRjtBQUMxRixNQUFNLDJCQUEyQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQWV0RixTQUFTLGtDQUFrQztJQUN2QyxPQUFRLFVBQXVGLENBQzNGLDJCQUEyQixDQUM5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