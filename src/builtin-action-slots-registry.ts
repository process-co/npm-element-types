import type { ISlotDefinition } from './slot-definition';

/**
 * Optional bootstrap registry (FERN → **`ISlotDefinition`**).
 * Prefer driving inference from **`@process.co/compatibility`** **`authoring-spec`** **`materializeAuthoringCatalogFromCliOutput`**
 * on the full **`process-element` / `loadElementPointers`** JSON — that includes **props**, **returns**, and **slots**.
 */
export const builtinActionSlotsRegistry = {
  'process-internal::action:switch': {
    hideDisabled: true,
    slots: [
      {
        type: 'static' as const,
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
  } satisfies ISlotDefinition,
} as const;

export type BuiltinActionSlotsRegistry = typeof builtinActionSlotsRegistry;

export type BuiltinActionSlotsFern = keyof BuiltinActionSlotsRegistry;

export type InferBuiltinActionSlots<Fern extends string> = Fern extends BuiltinActionSlotsFern
  ? BuiltinActionSlotsRegistry[Fern]
  : undefined;
