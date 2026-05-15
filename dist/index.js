"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodObjectToContainerExportJsonSchema = exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = exports.PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBdU9BLGtFQVNDO0FBMkJELGtEQTJDQztBQW1mRCw4QkFFQztBQUdELG9DQVlDO0FBRUQsb0NBRUM7QUFweUJELGlGQUt5QztBQUpyQywySUFBQSwwQkFBMEIsT0FBQTtBQWM5QixnSUFBZ0k7QUFDaEksdUVBQWdGO0FBQXZFLDhJQUFBLGtDQUFrQyxPQUFBO0FBZTNDLCtEQUdnQztBQUY1QiwySUFBQSxtQ0FBbUMsT0FBQTtBQUNuQyxpSUFBQSx5QkFBeUIsT0FBQTtBQTZIN0I7Ozs7Ozs7R0FPRztBQUNVLFFBQUEsNkNBQTZDLEdBQUcsZUFBd0IsQ0FBQztBQVd0RiwwRkFBMEY7QUFDMUYsTUFBTSwyQkFBMkIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFldEYsU0FBUyxrQ0FBa0M7SUFDdkMsT0FBUSxVQUFvRixDQUN4RiwyQkFBMkIsQ0FDOUIsQ0FBQztBQUNOLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLDJCQUEyQixDQUN2QyxJQUFpRDtJQUVqRCxNQUFNLENBQUMsR0FBRyxVQUFtRixDQUFDO0lBQzlGLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDMUMsQ0FBQztTQUFNLENBQUM7UUFDSixDQUFDLENBQUMsMkJBQTJCLENBQUMsR0FBRyxJQUFpRCxDQUFDO0lBQ3ZGLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUywyQkFBMkIsQ0FBQyxDQUFVO0lBQzNDLElBQUksQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQ2xELE1BQU0sTUFBTSxHQUFJLENBQTBCLENBQUMsTUFBTSxDQUFDO0lBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMs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