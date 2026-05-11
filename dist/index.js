"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodObjectToContainerExportJsonSchema = exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = void 0;
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
 * When `inputSchema.validation` is true, awaits `host.enforceSchema(inputSchema, value)`.
 * Otherwise returns `value` unchanged.
 */
async function validateEmitPayload(host, inputSchema, value) {
    if (!inputSchema?.validation) {
        return { ok: true, value: value };
    }
    const enforce = host.enforceSchema;
    if (typeof enforce !== 'function') {
        return {
            ok: false,
            message: 'Input validation is enabled but the runtime did not provide enforceSchema.',
        };
    }
    try {
        const out = await enforce(inputSchema, value);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZ0pBLGtEQXVCQztBQWdmRCw4QkFFQztBQUdELG9DQVlDO0FBRUQsb0NBRUM7QUFscEJELGlGQUt5QztBQUpyQywySUFBQSwwQkFBMEIsT0FBQTtBQWM5QixnSUFBZ0k7QUFDaEksdUVBQWdGO0FBQXZFLDhJQUFBLGtDQUFrQyxPQUFBO0FBZTNDLCtEQUdnQztBQUY5QiwySUFBQSxtQ0FBbUMsT0FBQTtBQUNuQyxpSUFBQSx5QkFBeUIsT0FBQTtBQWlGM0I7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLG1CQUFtQixDQUNyQyxJQUErQyxFQUMvQyxXQUFnRCxFQUNoRCxLQUFjO0lBRWQsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUMzQixPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBVSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDbkMsSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztRQUNoQyxPQUFPO1lBQ0gsRUFBRSxFQUFFLEtBQUs7WUFDVCxPQUFPLEVBQ0gsNEVBQTRFO1NBQ25GLENBQUM7SUFDTixDQUFDO0lBQ0QsSUFBSSxDQUFDO1FBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxPQUFPLENBQUksV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNULE1BQU0sT0FBTyxHQUFHLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0FBQ0wsQ0FBQztBQStlRCx5REFBeUQ7QUFDekQsU0FBZ0IsU0FBUyxDQUF5QixHQUF1QztJQUNyRixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRCw0REFBNEQ7QUFDNUQsU0FBZ0IsWUFBWSxDQVVILE1BQTZDO0lBQ2xFLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQTBFLE1BQTZDO0lBQy9JLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFJRCx1RkFHNEM7QUFGeEMsOEpBQUEsMENBQTBDLE9BQUE7QUFDMUMsd0pBQUEsb0NBQW9DLE9BQUEifQ==