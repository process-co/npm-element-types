"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBd2xCQSw4QkFFQztBQUdELG9DQVlDO0FBRUQsb0NBRUM7QUFubEJELGlGQUt5QztBQUpyQywySUFBQSwwQkFBMEIsT0FBQTtBQWM5QixnSUFBZ0k7QUFDaEksdUVBQWdGO0FBQXZFLDhJQUFBLGtDQUFrQyxPQUFBO0FBZTNDLCtEQUdnQztBQUY5QiwySUFBQSxtQ0FBbUMsT0FBQTtBQUNuQyxpSUFBQSx5QkFBeUIsT0FBQTtBQTRoQjNCLHlEQUF5RDtBQUN6RCxTQUFnQixTQUFTLENBQXlCLEdBQXVDO0lBQ3JGLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVELDREQUE0RDtBQUM1RCxTQUFnQixZQUFZLENBVUgsTUFBNkM7SUFDbEUsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQWdCLFlBQVksQ0FBc0UsTUFBNkM7SUFDM0ksT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyJ9