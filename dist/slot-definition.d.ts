export type ISlotInstanceDefinition = {
    id?: string;
    label?: string;
    enabled?: boolean;
    path?: string;
    idPath?: string;
    labelPath?: string;
    enabledPath?: string;
    labelPlaceholderTemplate?: string;
    labelPlaceholderValue?: string;
    branchValue?: string;
    hideOnDisable?: boolean;
    actionsPath?: string;
    exportsPath?: string;
};
export type ISlotStaticInstanceDefinition = ISlotInstanceDefinition & {
    type: 'static';
};
export type ISlotDefinition = {
    showBranchLabels?: boolean;
    activeSlotId?: string;
    activeSlotLabel?: string;
    hideDisabled?: boolean;
    /** Expression/template path for per-row hide-disabled (flow editor / container layout). */
    hideDisabledPath?: string;
    hideOnDisable?: boolean;
    exportSchemaPath?: string;
    slots?: (ISlotInstanceDefinition | ISlotStaticInstanceDefinition)[];
};
//# sourceMappingURL=slot-definition.d.ts.map