import type { ISlotDefinition } from './slot-definition';
/**
 * One flattened prop row from **`process-co` compatibility `loadElementPointers`** (`buildProp` output).
 * Matches **`@process.co/elements`** `IProcessDefinitionUIPointers.props[]` plus loader fields.
 */
export type ProcessElementPropCliWire = {
    key: string;
    label: string;
    description?: string;
    type?: unknown;
    jsonType?: unknown;
    isFunction?: boolean;
    required?: boolean;
    default?: unknown;
    ui?: string;
    options?: unknown;
    deps?: string[];
    placeholder?: string;
    [key: string]: unknown;
};
/**
 * One action row from **`loadElementPointers`** for a Process element (not Pipedream shape).
 * This is what sits in **`IProcessDefinitionUIInfo.actions[]`** after the process loader runs.
 */
export type ProcessElementActionCliWire = {
    type: 'action';
    key: string;
    name: string;
    description?: string;
    icon?: unknown;
    ui?: string;
    categoryKey?: string;
    sampleEmit?: unknown;
    returns?: string;
    slots?: ISlotDefinition;
    noAuth?: boolean;
    hasNew?: boolean;
    initValue?: unknown;
    props?: ProcessElementPropCliWire[];
    [key: string]: unknown;
};
/**
 * One signal row from **`loadElementPointers`** for a Process element.
 */
export type ProcessElementSignalCliWire = {
    type: 'signal';
    key: string;
    name: string;
    description?: string;
    ui?: string;
    categoryKey?: string;
    sampleEmit?: unknown;
    returns?: string;
    noAuth?: boolean;
    hasNew?: boolean;
    initValue?: unknown;
    icon?: unknown;
    hooks?: boolean;
    dedupe?: unknown;
    http?: unknown;
    instant?: boolean;
    props?: ProcessElementPropCliWire[];
    [key: string]: unknown;
};
/**
 * Full object emitted by **`process-element`** (compatibility CLI): **`SuperJSON.stringify(loadElementPointers(...))`**.
 * Structurally aligned with **`@process.co/elements` `IProcessDefinitionUIInfo`** plus process-loader fields on each row.
 */
export type ProcessElementCliOutputWire = {
    elementType: 'process' | 'pipedream' | 'dofloV1' | 'n8n';
    /** App / namespace slug (`element.app`); used as default FERN namespace when building keys. */
    name: string;
    description: {
        short: string;
        long: string;
        MD: string;
    };
    actions: ProcessElementActionCliWire[];
    signals: ProcessElementSignalCliWire[];
    credentials: unknown[];
};
//# sourceMappingURL=process-element-cli-output.d.ts.map