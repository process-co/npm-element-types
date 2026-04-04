/**
 * Optional bootstrap registry (FERN → **`ISlotDefinition`**).
 * Prefer driving inference from **`@process.co/compatibility`** **`authoring-spec`** **`materializeAuthoringCatalogFromCliOutput`**
 * on the full **`process-element` / `loadElementPointers`** JSON — that includes **props**, **returns**, and **slots**.
 */
export declare const builtinActionSlotsRegistry: {
    readonly 'process-internal::action:switch': {
        hideDisabled: true;
        slots: ({
            type: "static";
            id: string;
            labelPath: string;
            enabledPath: string;
            hideOnDisable: true;
            path?: undefined;
            idPath?: undefined;
        } | {
            path: string;
            idPath: string;
            labelPath: string;
            enabledPath: string;
            hideOnDisable: true;
            type?: undefined;
            id?: undefined;
        })[];
    };
};
export type BuiltinActionSlotsRegistry = typeof builtinActionSlotsRegistry;
export type BuiltinActionSlotsFern = keyof BuiltinActionSlotsRegistry;
export type InferBuiltinActionSlots<Fern extends string> = Fern extends BuiltinActionSlotsFern ? BuiltinActionSlotsRegistry[Fern] : undefined;
//# sourceMappingURL=builtin-action-slots-registry.d.ts.map