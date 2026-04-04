import type { ISlotDefinition } from './slot-definition';
export type MaterializedSlotBranch = {
    kind: 'static' | 'dynamic';
    id?: string;
    label?: string;
    branchValue?: string;
    path?: string;
    idPath?: string;
    labelPath?: string;
    enabledPath?: string;
    actionsPath?: string;
    exportsPath?: string;
    hideOnDisable?: boolean;
    labelPlaceholderTemplate?: string;
    labelPlaceholderValue?: string;
};
export type MaterializedSlotLayout = {
    showBranchLabels?: boolean;
    activeSlotId?: string;
    activeSlotLabel?: string;
    hideDisabled?: boolean;
    hideDisabledPath?: string;
    hideOnDisable?: boolean;
    exportSchemaPath?: string;
};
export type MaterializedSlotDefinition = {
    layout: MaterializedSlotLayout;
    branches: MaterializedSlotBranch[];
};
/** Normalize **`ISlotDefinition`** for codegen / workflow inference (JSON-serializable). */
export declare function materializeSlotDefinition(def: ISlotDefinition | null | undefined): MaterializedSlotDefinition | null;
//# sourceMappingURL=materialize-slot-definition.d.ts.map