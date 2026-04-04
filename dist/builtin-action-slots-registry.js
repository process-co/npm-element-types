"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtinActionSlotsRegistry = void 0;
/**
 * Optional bootstrap registry (FERN → **`ISlotDefinition`**).
 * Prefer driving inference from **`materializeAuthoringCatalogFromCliOutput`** on the full
 * **`process-element` / `loadElementPointers`** JSON — that includes **props**, **returns**, and **slots**.
 */
exports.builtinActionSlotsRegistry = {
    'process-internal::action:switch': {
        hideDisabled: true,
        slots: [
            {
                type: 'static',
                id: '{{ID_GUID}}_default_case',
                labelPath: '$.data.cases.defaultLabel',
                enabledPath: '$.data.cases.defaultEnabled',
                hideOnDisable: true,
            },
            {
                path: '$.data.cases.cases[*]',
                idPath: '$.data.cases.cases[*].id',
                labelPath: '$.data.cases.cases[*].label',
                enabledPath: '$.data.cases.cases[*].enabled',
                hideOnDisable: true,
            },
        ],
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbHRpbi1hY3Rpb24tc2xvdHMtcmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnVpbHRpbi1hY3Rpb24tc2xvdHMtcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUE7Ozs7R0FJRztBQUNVLFFBQUEsMEJBQTBCLEdBQUc7SUFDeEMsaUNBQWlDLEVBQUU7UUFDakMsWUFBWSxFQUFFLElBQUk7UUFDbEIsS0FBSyxFQUFFO1lBQ0w7Z0JBQ0UsSUFBSSxFQUFFLFFBQWlCO2dCQUN2QixFQUFFLEVBQUUsMEJBQTBCO2dCQUM5QixTQUFTLEVBQUUsMkJBQTJCO2dCQUN0QyxXQUFXLEVBQUUsNkJBQTZCO2dCQUMxQyxhQUFhLEVBQUUsSUFBSTthQUNwQjtZQUNEO2dCQUNFLElBQUksRUFBRSx1QkFBdUI7Z0JBQzdCLE1BQU0sRUFBRSwwQkFBMEI7Z0JBQ2xDLFNBQVMsRUFBRSw2QkFBNkI7Z0JBQ3hDLFdBQVcsRUFBRSwrQkFBK0I7Z0JBQzVDLGFBQWEsRUFBRSxJQUFJO2FBQ3BCO1NBQ0Y7S0FDd0I7Q0FDbkIsQ0FBQyJ9