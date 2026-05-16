"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodObjectToContainerExportJsonSchema = exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = exports.DEFAULT_DEFER_HTTP_RESPONSE_MS = exports.PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = void 0;
exports.setSignalEmitValidationHost = setSignalEmitValidationHost;
exports.validateEmitPayload = validateEmitPayload;
exports.defineApp = defineApp;
exports.defineAction = defineAction;
exports.defineSignal = defineSignal;
var builtin_action_slots_registry_1 = require("./builtin-action-slots-registry");
Object.defineProperty(exports, "builtinActionSlotsRegistry", { enumerable: true, get: function () { return builtin_action_slots_registry_1.builtinActionSlotsRegistry; } });
/** Locked authoring catalog **types** + version (runtime materialize: **`@process.co/compatibility`** **`authoring-spec`**). */
var authoring_contract_types_1 = require("./authoring-contract-types");
Object.defineProperty(exports, "ELEMENT_AUTHORING_CONTRACT_VERSION", { enumerable: true, get: function () { return authoring_contract_types_1.ELEMENT_AUTHORING_CONTRACT_VERSION; } });
var platform_loader_type_1 = require("./platform-loader-type");
Object.defineProperty(exports, "PLATFORM_BOUND_LOADER_TYPE_PREFIXES", { enumerable: true, get: function () { return platform_loader_type_1.PLATFORM_BOUND_LOADER_TYPE_PREFIXES; } });
Object.defineProperty(exports, "isPlatformBoundLoaderType", { enumerable: true, get: function () { return platform_loader_type_1.isPlatformBoundLoaderType; } });
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
 * When validation is required (explicit `validation: true`, or a non-empty `compiledValidatorKey`
 * with `validation` not `false`), awaits the bound host's `enforceSchema` so the API runs the
 * **compiled Zod** validator. Otherwise returns `value` unchanged.
 * On failure, `issues` lists Zod paths/messages when the host provides them (forward into your
 * `http.respond` JSON body alongside any `requestStatus` you use).
 * (see {@link setSignalEmitValidationHost}).
 */
async function validateEmitPayload(inputSchema, value) {
    const hasCompiled = inputSchema &&
        typeof inputSchema.compiledValidatorKey === 'string' &&
        inputSchema.compiledValidatorKey.length > 0;
    if (inputSchema?.validation === false) {
        return { ok: true, value: value };
    }
    if (!hasCompiled && inputSchema?.validation !== true) {
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
// Helper to provide ThisType context for action definitions
function defineAction(action) {
    return action;
}
function defineSignal(signal) {
    return signal;
}
var zod_container_export_json_schema_1 = require("./zod-container-export-json-schema");
Object.defineProperty(exports, "ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS", { enumerable: true, get: function () { return zod_container_export_json_schema_1.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS; } });
Object.defineProperty(exports, "zodObjectToContainerExportJsonSchema", { enumerable: true, get: function () { return zod_container_export_json_schema_1.zodObjectToContainerExportJsonSchema; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBdU9BLGtFQVNDO0FBMkJELGtEQTJDQztBQWlsQkQsOEJBRUM7QUFHRCxvQ0FZQztBQUVELG9DQUVDO0FBbDRCRCxpRkFLeUM7QUFKckMsMklBQUEsMEJBQTBCLE9BQUE7QUFjOUIsZ0lBQWdJO0FBQ2hJLHVFQUFnRjtBQUF2RSw4SUFBQSxrQ0FBa0MsT0FBQTtBQWUzQywrREFHZ0M7QUFGNUIsMklBQUEsbUNBQW1DLE9BQUE7QUFDbkMsaUlBQUEseUJBQXlCLE9BQUE7QUE2SDdCOzs7Ozs7O0dBT0c7QUFDVSxRQUFBLDZDQUE2QyxHQUFHLGVBQXdCLENBQUM7QUFXdEYsMEZBQTBGO0FBQzFGLE1BQU0sMkJBQTJCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBZXRGLFNBQVMsa0NBQWtDO0lBQ3ZDLE9BQVEsVUFBb0YsQ0FDeEYsMkJBQTJCLENBQzlCLENBQUM7QUFDTixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQiwyQkFBMkIsQ0FDdkMsSUFBaUQ7SUFFakQsTUFBTSxDQUFDLEdBQUcsVUFBbUYsQ0FBQztJQUM5RixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUNyQixPQUFPLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQzFDLENBQUM7U0FBTSxDQUFDO1FBQ0osQ0FBQyxDQUFDLDJCQUEyQixDQUFDLEdBQUcsSUFBaUQsQ0FBQztJQUN2RixDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsMkJBQTJCLENBQUMsQ0FBVTtJQUMzQyxJQUFJLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNsRCxNQUFNLE1BQU0sR0FBSSxDQUEwQixDQUFDLE1BQU0sQ0FBQztJQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNwRSxNQUFNLEdBQUcsR0FBNEIsRUFBRSxDQUFDO0lBQ3hDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO1lBQUUsU0FBUztRQUM5QyxNQUFNLENBQUMsR0FBRyxHQUE4QixDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDTCxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUTtZQUNwRCxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQzVFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRO1NBQ3ZELENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUM1QyxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNJLEtBQUssVUFBVSxtQkFBbUIsQ0FDckMsV0FBZ0QsRUFDaEQsS0FBYztJQUVkLE1BQU0sV0FBVyxHQUNiLFdBQVc7UUFDWCxPQUFPLFdBQVcsQ0FBQyxvQkFBb0IsS0FBSyxRQUFRO1FBQ3BELFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELElBQUksV0FBVyxFQUFFLFVBQVUsS0FBSyxLQUFLLEVBQUUsQ0FBQztRQUNwQyxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBVSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUNELElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxFQUFFLFVBQVUsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUNuRCxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBVSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQU0sS0FBSyxHQUFHLGtDQUFrQyxFQUFFLENBQUM7SUFDbkQsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLGFBQWEsQ0FBQztJQUNyQyxJQUFJLE9BQU8sT0FBTyxLQUFLLFVBQVUsRUFBRSxDQUFDO1FBQ2hDLE9BQU87WUFDSCxFQUFFLEVBQUUsS0FBSztZQUNULE9BQU8sRUFDSCxxUEFBcVA7U0FDNVAsQ0FBQztJQUNOLENBQUM7SUFDRCxJQUFJLENBQUM7UUFDRCxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBSSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakQsSUFBSSxHQUFHLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNoRCxNQUFNLENBQUMsR0FBRyxHQUFnRSxDQUFDO1lBQzNFLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRSxDQUFDO2dCQUNsRCxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTTtvQkFDbkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQWlDLEVBQUU7b0JBQ2hGLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksSUFBSSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ2hDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBVSxFQUFFLENBQUM7WUFDN0MsQ0FBQztRQUNMLENBQUM7UUFDRCxtRkFBbUY7UUFDbkYsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQVEsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sTUFBTSxHQUFHLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ3BGLENBQUM7QUFDTCxDQUFDO0FBMEZELHFHQUFxRztBQUN4RixRQUFBLDhCQUE4QixHQUFHLE1BQU0sQ0FBQztBQXFmckQseURBQXlEO0FBQ3pELFNBQWdCLFNBQVMsQ0FBeUIsR0FBdUM7SUFDckYsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQsNERBQTREO0FBQzVELFNBQWdCLFlBQVksQ0FVSCxNQUE2QztJQUNsRSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRUQsU0FBZ0IsWUFBWSxDQUEwRSxNQUE2QztJQUMvSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBSUQsdUZBRzRDO0FBRnhDLDhKQUFBLDBDQUEwQyxPQUFBO0FBQzFDLHdKQUFBLG9DQUFvQyxPQUFBIn0=