import { materializeSlotDefinition, type MaterializedSlotDefinition } from './materialize-slot-definition';
import type {
  ProcessElementActionCliWire,
  ProcessElementCliOutputWire,
  ProcessElementPropCliWire,
  ProcessElementSignalCliWire,
} from './process-element-cli-output';

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

function stripNamespacePrefixFromActionKey(namespace: string, key: string): string {
  const prefix = `${namespace}-`;
  return key.startsWith(prefix) ? key.slice(prefix.length) : key;
}

/**
 * Build registry FERN for an action (**`namespace::action:slug`**), matching common API normalization.
 */
export function buildProcessActionFern(namespace: string, actionKey: string): string {
  const slug = stripNamespacePrefixFromActionKey(namespace, actionKey);
  return `${namespace}::action:${slug}`;
}

/** Build registry FERN for a signal (**`namespace::signal:slug`**). */
export function buildProcessSignalFern(namespace: string, signalKey: string): string {
  const slug = stripNamespacePrefixFromActionKey(namespace, signalKey);
  return `${namespace}::signal:${slug}`;
}

function wireTypeLabel(type: unknown): string {
  if (type === undefined || type === null) {
    return 'unknown';
  }
  if (typeof type === 'string') {
    return type;
  }
  try {
    return JSON.stringify(type);
  } catch {
    return 'unknown';
  }
}

function materializeProp(p: ProcessElementPropCliWire): MaterializedPropAuthoring {
  return {
    key: p.key,
    label: p.label,
    description: typeof p.description === 'string' ? p.description : '',
    wireType: wireTypeLabel(p.type),
    required: p.required === true,
    hasJsonType: p.jsonType !== undefined && p.jsonType !== null,
    isFunction: p.isFunction === true,
  };
}

function materializeAction(
  namespace: string,
  a: ProcessElementActionCliWire,
): MaterializedActionAuthoringEntry {
  const fern = buildProcessActionFern(namespace, a.key);
  return {
    kind: 'action',
    fern,
    elementKey: a.key,
    name: a.name,
    description: typeof a.description === 'string' ? a.description : undefined,
    returns: typeof a.returns === 'string' ? a.returns : undefined,
    props: (Array.isArray(a.props) ? a.props : []).map(materializeProp),
    slots: materializeSlotDefinition(a.slots),
  };
}

function materializeSignal(
  namespace: string,
  s: ProcessElementSignalCliWire,
): MaterializedSignalAuthoringEntry {
  const fern = buildProcessSignalFern(namespace, s.key);
  return {
    kind: 'signal',
    fern,
    elementKey: s.key,
    name: s.name,
    description: typeof s.description === 'string' ? s.description : undefined,
    returns: typeof s.returns === 'string' ? s.returns : undefined,
    props: (Array.isArray(s.props) ? s.props : []).map(materializeProp),
  };
}

/**
 * Turn the **entire compatibility CLI / `loadElementPointers` JSON** into FERN-keyed authoring material
 * (props + slot paths + returns hints) for codegen or merging into **`@process.co/workflow-sdk`**.
 *
 * @param namespace — FERN namespace segment (e.g. **`process-internal`**). Defaults to **`info.name`** (element app slug).
 */
export function materializeAuthoringCatalogFromCliOutput(
  info: ProcessElementCliOutputWire,
  namespace?: string,
): MaterializedAuthoringCatalog {
  const ns = namespace ?? info.name;
  const actionsByFern: Record<string, MaterializedActionAuthoringEntry> = {};
  const signalsByFern: Record<string, MaterializedSignalAuthoringEntry> = {};

  for (const a of info.actions) {
    if (a?.type !== 'action' || typeof a.key !== 'string') {
      continue;
    }
    const entry = materializeAction(ns, a as ProcessElementActionCliWire);
    actionsByFern[entry.fern] = entry;
  }

  for (const s of info.signals) {
    if (s?.type !== 'signal' || typeof s.key !== 'string') {
      continue;
    }
    const entry = materializeSignal(ns, s as ProcessElementSignalCliWire);
    signalsByFern[entry.fern] = entry;
  }

  return { namespace: ns, actionsByFern, signalsByFern };
}
