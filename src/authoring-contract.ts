import type {
  MaterializedActionAuthoringEntry,
  MaterializedAuthoringCatalog,
  MaterializedSignalAuthoringEntry,
} from './materialize-authoring-from-cli-output';
import type { MaterializedSlotBranch, MaterializedSlotDefinition } from './materialize-slot-definition';
import type { ProcessElementCliOutputWire } from './process-element-cli-output';
import { materializeAuthoringCatalogFromCliOutput } from './materialize-authoring-from-cli-output';

/**
 * Bump when this contract changes — regenerate workflow-sdk / codegen consumers.
 * Raw CLI JSON does not carry this; the **contract** is the stable TS surface.
 */
export const ELEMENT_AUTHORING_CONTRACT_VERSION = 1 as const;

/**
 * Normalized prop kind for **`keyof` / conditional types** (not the raw loader string).
 */
export type AuthoringPropWireKind =
  | 'string'
  | 'number'
  | 'boolean'
  | 'integer'
  | 'object'
  | 'array'
  | 'unknown';

/** One action prop in the **locked** authoring shape. */
export interface AuthoringPropContract {
  readonly key: string;
  readonly label: string;
  readonly wireKind: AuthoringPropWireKind;
  readonly required: boolean;
}

/**
 * One container branch. **`childStepsProperty`** is intentionally a **string literal type** so
 * `defineGroup`-style APIs can use `B['childStepsProperty']` and get `'actions'`, not `string`.
 */
export interface SlotBranchAuthoringContract {
  readonly kind: 'static' | 'dynamic';
  readonly slotRowId?: string;
  readonly paths: Readonly<{
    row?: string;
    id?: string;
    label?: string;
    enabled?: string;
    actions?: string;
    exports?: string;
  }>;
  /**
   * Where nested steps attach on each branch row, relative to that row’s object.
   * Locked default **`actions`**; override only if element contract documents otherwise.
   */
  readonly childStepsProperty: 'actions';
  /** Branch-level export callback property when present (e.g. switch **`export`**). */
  readonly branchExportsProperty?: 'export' | 'exports';
}

export interface SlotsAuthoringContract {
  readonly layout: Readonly<{
    showBranchLabels?: boolean;
    activeSlotId?: string;
    activeSlotLabel?: string;
    hideDisabled?: boolean;
    hideDisabledPath?: string;
    hideOnDisable?: boolean;
    exportSchemaPath?: string;
  }>;
  readonly branches: readonly SlotBranchAuthoringContract[];
}

/** Locked per-action shape for FERN-keyed inference. */
export interface ActionAuthoringContract {
  readonly fern: string;
  readonly elementKey: string;
  readonly name: string;
  readonly returnsTypeName?: string;
  readonly props: readonly AuthoringPropContract[];
  readonly slots: SlotsAuthoringContract | null;
}

export interface SignalAuthoringContract {
  readonly fern: string;
  readonly elementKey: string;
  readonly name: string;
  readonly returnsTypeName?: string;
  readonly props: readonly AuthoringPropContract[];
}

/**
 * **Canonical object** for TypeScript to hang inference off — not the CLI blob.
 *
 * - Runtime: **`authoringCatalogContractFromCliOutput`** / **`toAuthoringCatalogContract`**.
 * - Best inference: codegen emits **`export const X = { … } as const satisfies ElementAuthoringCatalogContract`**
 *   so **`keyof X['actions']`** is a **union of FERN literals**, not plain **`string`**.
 */
export interface ElementAuthoringCatalogContract {
  readonly version: typeof ELEMENT_AUTHORING_CONTRACT_VERSION;
  readonly namespace: string;
  readonly actions: Readonly<Record<string, ActionAuthoringContract>>;
  readonly signals: Readonly<Record<string, SignalAuthoringContract>>;
}

// --- Type-level helpers (the “magic” entry points) -------------------------------------------

export type ChildStepsPropertyForBranch<B extends SlotBranchAuthoringContract> = B['childStepsProperty'];

export type ActionPropKeys<A extends ActionAuthoringContract> = A['props'][number]['key'];

export type ActionContractByFern<
  C extends ElementAuthoringCatalogContract,
  Fern extends keyof C['actions'] & string,
> = C['actions'][Fern];

// --- Normalization: materialized → contract ---------------------------------------------------

function normalizeWireKind(wireType: string): AuthoringPropWireKind {
  const t = wireType.trim().toLowerCase();
  if (t === 'string' || t === 'number' || t === 'boolean' || t === 'integer') {
    return t as AuthoringPropWireKind;
  }
  if (t === 'object' || t.startsWith('object(')) {
    return 'object';
  }
  if (t === 'array' || t.startsWith('array<')) {
    return 'array';
  }
  return 'unknown';
}

function inferBranchExportsProperty(branch: MaterializedSlotBranch): 'export' | 'exports' | undefined {
  const e = branch.exportsPath;
  if (e === undefined) {
    return undefined;
  }
  if (e.endsWith('.export') || e.includes('.export.')) {
    return 'export';
  }
  if (e.endsWith('.exports') || e.includes('.exports.')) {
    return 'exports';
  }
  return undefined;
}

function branchToContract(branch: MaterializedSlotBranch): SlotBranchAuthoringContract {
  const exportsProp = inferBranchExportsProperty(branch);
  return {
    kind: branch.kind,
    slotRowId: branch.id,
    paths: {
      row: branch.path,
      id: branch.idPath,
      label: branch.labelPath,
      enabled: branch.enabledPath,
      actions: branch.actionsPath,
      exports: branch.exportsPath,
    },
    childStepsProperty: 'actions',
    ...(exportsProp !== undefined ? { branchExportsProperty: exportsProp } : {}),
  };
}

function slotsToContract(slots: MaterializedSlotDefinition | null): SlotsAuthoringContract | null {
  if (slots === null) {
    return null;
  }
  return {
    layout: { ...slots.layout },
    branches: slots.branches.map(branchToContract),
  };
}

function propToContract(p: { key: string; label: string; wireType: string; required: boolean }): AuthoringPropContract {
  return {
    key: p.key,
    label: p.label,
    wireKind: normalizeWireKind(p.wireType),
    required: p.required,
  };
}

function actionToContract(a: MaterializedActionAuthoringEntry): ActionAuthoringContract {
  return {
    fern: a.fern,
    elementKey: a.elementKey,
    name: a.name,
    returnsTypeName: a.returns,
    props: a.props.map(propToContract),
    slots: slotsToContract(a.slots),
  };
}

function signalToContract(s: MaterializedSignalAuthoringEntry): SignalAuthoringContract {
  return {
    fern: s.fern,
    elementKey: s.elementKey,
    name: s.name,
    returnsTypeName: s.returns,
    props: s.props.map(propToContract),
  };
}

/**
 * Map **loose materialized catalog** (from CLI JSON) into the **locked `ElementAuthoringCatalogContract`**.
 */
export function toAuthoringCatalogContract(cat: MaterializedAuthoringCatalog): ElementAuthoringCatalogContract {
  const actions: Record<string, ActionAuthoringContract> = {};
  const signals: Record<string, SignalAuthoringContract> = {};
  for (const [fern, a] of Object.entries(cat.actionsByFern)) {
    actions[fern] = actionToContract(a);
  }
  for (const [fern, s] of Object.entries(cat.signalsByFern)) {
    signals[fern] = signalToContract(s);
  }
  return {
    version: ELEMENT_AUTHORING_CONTRACT_VERSION,
    namespace: cat.namespace,
    actions,
    signals,
  };
}

/** One-shot: **`process-element` JSON shape** → locked contract. */
export function authoringCatalogContractFromCliOutput(
  info: ProcessElementCliOutputWire,
  namespace?: string,
): ElementAuthoringCatalogContract {
  return toAuthoringCatalogContract(materializeAuthoringCatalogFromCliOutput(info, namespace));
}

/**
 * **Early** artifact: one file per element / build, written by **`@process.co/compatibility`**.
 * **Late** step merges many shards into **`workflow-sdk`** `fern-authoring-registry.generated.ts`.
 */
export type FernAuthoringShardFileV1 = {
  readonly version: typeof ELEMENT_AUTHORING_CONTRACT_VERSION;
  /** Source path or id (optional, for debugging). */
  readonly source?: string;
  readonly namespace: string;
  readonly actions: Record<string, ActionAuthoringContract>;
  readonly signals: Record<string, SignalAuthoringContract>;
};
