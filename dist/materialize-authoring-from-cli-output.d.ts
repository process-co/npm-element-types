import { type MaterializedSlotDefinition } from './materialize-slot-definition';
import type { ProcessElementCliOutputWire } from './process-element-cli-output';
export type MaterializedPropAuthoring = {
    key: string;
    label: string;
    description: string;
    /** String from loader **`type`** (e.g. **`string`**, **`object`**, or zodex-serialized object as JSON). */
    wireType: string;
    required: boolean;
    hasJsonType: boolean;
    isFunction: boolean;
};
export type MaterializedActionAuthoringEntry = {
    kind: 'action';
    fern: string;
    /** Raw action key from the element (may include namespace prefix). */
    elementKey: string;
    name: string;
    description?: string;
    returns?: string;
    props: MaterializedPropAuthoring[];
    slots: MaterializedSlotDefinition | null;
};
export type MaterializedSignalAuthoringEntry = {
    kind: 'signal';
    fern: string;
    elementKey: string;
    name: string;
    description?: string;
    returns?: string;
    props: MaterializedPropAuthoring[];
};
export type MaterializedAuthoringCatalog = {
    namespace: string;
    actionsByFern: Record<string, MaterializedActionAuthoringEntry>;
    signalsByFern: Record<string, MaterializedSignalAuthoringEntry>;
};
/**
 * Build registry FERN for an action (**`namespace::action:slug`**), matching common API normalization.
 */
export declare function buildProcessActionFern(namespace: string, actionKey: string): string;
/** Build registry FERN for a signal (**`namespace::signal:slug`**). */
export declare function buildProcessSignalFern(namespace: string, signalKey: string): string;
/**
 * Turn the **entire compatibility CLI / `loadElementPointers` JSON** into FERN-keyed authoring material
 * (props + slot paths + returns hints) for codegen or merging into **`@process.co/workflow-sdk`**.
 *
 * @param namespace — FERN namespace segment (e.g. **`process-internal`**). Defaults to **`info.name`** (element app slug).
 */
export declare function materializeAuthoringCatalogFromCliOutput(info: ProcessElementCliOutputWire, namespace?: string): MaterializedAuthoringCatalog;
//# sourceMappingURL=materialize-authoring-from-cli-output.d.ts.map