"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authoringCatalogContractFromCliOutput = exports.toAuthoringCatalogContract = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.materializeAuthoringCatalogFromCliOutput = exports.buildProcessSignalFern = exports.buildProcessActionFern = exports.materializeSlotDefinition = exports.builtinActionSlotsRegistry = void 0;
exports.defineApp = defineApp;
exports.defineAction = defineAction;
exports.defineSignal = defineSignal;
var builtin_action_slots_registry_1 = require("./builtin-action-slots-registry");
Object.defineProperty(exports, "builtinActionSlotsRegistry", { enumerable: true, get: function () { return builtin_action_slots_registry_1.builtinActionSlotsRegistry; } });
var materialize_slot_definition_1 = require("./materialize-slot-definition");
Object.defineProperty(exports, "materializeSlotDefinition", { enumerable: true, get: function () { return materialize_slot_definition_1.materializeSlotDefinition; } });
var materialize_authoring_from_cli_output_1 = require("./materialize-authoring-from-cli-output");
Object.defineProperty(exports, "buildProcessActionFern", { enumerable: true, get: function () { return materialize_authoring_from_cli_output_1.buildProcessActionFern; } });
Object.defineProperty(exports, "buildProcessSignalFern", { enumerable: true, get: function () { return materialize_authoring_from_cli_output_1.buildProcessSignalFern; } });
Object.defineProperty(exports, "materializeAuthoringCatalogFromCliOutput", { enumerable: true, get: function () { return materialize_authoring_from_cli_output_1.materializeAuthoringCatalogFromCliOutput; } });
/** Locked authoring catalog + helpers for FERN / slot / prop inference (not raw CLI JSON). */
var authoring_contract_1 = require("./authoring-contract");
Object.defineProperty(exports, "ELEMENT_AUTHORING_CONTRACT_VERSION", { enumerable: true, get: function () { return authoring_contract_1.ELEMENT_AUTHORING_CONTRACT_VERSION; } });
Object.defineProperty(exports, "toAuthoringCatalogContract", { enumerable: true, get: function () { return authoring_contract_1.toAuthoringCatalogContract; } });
Object.defineProperty(exports, "authoringCatalogContractFromCliOutput", { enumerable: true, get: function () { return authoring_contract_1.authoringCatalogContractFromCliOutput; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBMG1CQSw4QkFFQztBQUdELG9DQVlDO0FBRUQsb0NBRUM7QUFybUJELGlGQUt5QztBQUpyQywySUFBQSwwQkFBMEIsT0FBQTtBQW1COUIsNkVBQTBFO0FBQWpFLHdJQUFBLHlCQUF5QixPQUFBO0FBUWxDLGlHQUlpRDtBQUg3QywrSUFBQSxzQkFBc0IsT0FBQTtBQUN0QiwrSUFBQSxzQkFBc0IsT0FBQTtBQUN0QixpS0FBQSx3Q0FBd0MsT0FBQTtBQUc1Qyw4RkFBOEY7QUFDOUYsMkRBSThCO0FBSDFCLHdJQUFBLGtDQUFrQyxPQUFBO0FBQ2xDLGdJQUFBLDBCQUEwQixPQUFBO0FBQzFCLDJJQUFBLHFDQUFxQyxPQUFBO0FBeWlCekMseURBQXlEO0FBQ3pELFNBQWdCLFNBQVMsQ0FBeUIsR0FBdUM7SUFDckYsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQsNERBQTREO0FBQzVELFNBQWdCLFlBQVksQ0FVSCxNQUE2QztJQUNsRSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRUQsU0FBZ0IsWUFBWSxDQUFzRSxNQUE2QztJQUMzSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDIn0=