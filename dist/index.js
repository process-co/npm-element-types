"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodObjectToContainerExportJsonSchema = exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = void 0;
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
/**
 * When validation is required (explicit `validation: true`, or a non-empty `compiledValidatorKey`
 * with `validation` not `false`), awaits the bound host's `enforceSchema` so the API runs the
 * **compiled Zod** validator. Otherwise returns `value` unchanged.
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
            if (r.ok) {
                return { ok: true, value: r.value };
            }
            return { ok: false, message: r.message };
        }
        return { ok: true, value: out };
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return { ok: false, message };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBbU5BLGtFQVNDO0FBUUQsa0RBcUNDO0FBaWZELDhCQUVDO0FBR0Qsb0NBWUM7QUFFRCxvQ0FFQztBQXJ2QkQsaUZBS3lDO0FBSnJDLDJJQUFBLDBCQUEwQixPQUFBO0FBYzlCLGdJQUFnSTtBQUNoSSx1RUFBZ0Y7QUFBdkUsOElBQUEsa0NBQWtDLE9BQUE7QUFlM0MsK0RBR2dDO0FBRjVCLDJJQUFBLG1DQUFtQyxPQUFBO0FBQ25DLGlJQUFBLHlCQUF5QixPQUFBO0FBNEg3QiwwRkFBMEY7QUFDMUYsTUFBTSwyQkFBMkIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFldEYsU0FBUyxrQ0FBa0M7SUFDdkMsT0FBUSxVQUFvRixDQUN4RiwyQkFBMkIsQ0FDOUIsQ0FBQztBQUNOLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLDJCQUEyQixDQUN2QyxJQUFpRDtJQUVqRCxNQUFNLENBQUMsR0FBRyxVQUFtRixDQUFDO0lBQzlGLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDMUMsQ0FBQztTQUFNLENBQUM7UUFDSixDQUFDLENBQUMsMkJBQTJCLENBQUMsR0FBRyxJQUFpRCxDQUFDO0lBQ3ZGLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSSxLQUFLLFVBQVUsbUJBQW1CLENBQ3JDLFdBQWdELEVBQ2hELEtBQWM7SUFFZCxNQUFNLFdBQVcsR0FDYixXQUFXO1FBQ1gsT0FBTyxXQUFXLENBQUMsb0JBQW9CLEtBQUssUUFBUTtRQUNwRCxXQUFXLENBQUMsb0JBQW9CLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRCxJQUFJLFdBQVcsRUFBRSxVQUFVLEtBQUssS0FBSyxFQUFFLENBQUM7UUFDcEMsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQVUsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFDRCxJQUFJLENBQUMsV0FBVyxJQUFJLFdBQVcsRUFBRSxVQUFVLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDbkQsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQVUsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFDRCxNQUFNLEtBQUssR0FBRyxrQ0FBa0MsRUFBRSxDQUFDO0lBQ25ELE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxhQUFhLENBQUM7SUFDckMsSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztRQUNoQyxPQUFPO1lBQ0gsRUFBRSxFQUFFLEtBQUs7WUFDVCxPQUFPLEVBQ0gscVBBQXFQO1NBQzVQLENBQUM7SUFDTixDQUFDO0lBQ0QsSUFBSSxDQUFDO1FBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUksV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELElBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDaEQsTUFBTSxDQUFDLEdBQUcsR0FBNkIsQ0FBQztZQUN4QyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDUCxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3hDLENBQUM7WUFDRCxPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzdDLENBQUM7UUFDRCxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBUSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDVCxNQUFNLE9BQU8sR0FBRyxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDbEMsQ0FBQztBQUNMLENBQUM7QUFnZkQseURBQXlEO0FBQ3pELFNBQWdCLFNBQVMsQ0FBeUIsR0FBdUM7SUFDckYsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQsNERBQTREO0FBQzVELFNBQWdCLFlBQVksQ0FVSCxNQUE2QztJQUNsRSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRUQsU0FBZ0IsWUFBWSxDQUEwRSxNQUE2QztJQUMvSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBSUQsdUZBRzRDO0FBRnhDLDhKQUFBLDBDQUEwQyxPQUFBO0FBQzFDLHdKQUFBLG9DQUFvQyxPQUFBIn0=