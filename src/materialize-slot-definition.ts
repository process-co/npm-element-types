import type {
  ISlotDefinition,
  ISlotInstanceDefinition,
  ISlotStaticInstanceDefinition,
} from './slot-definition';

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

function branchKind(row: ISlotInstanceDefinition | ISlotStaticInstanceDefinition): 'static' | 'dynamic' {
  return 'type' in row && row.type === 'static' ? 'static' : 'dynamic';
}

function pickBranch(row: ISlotInstanceDefinition | ISlotStaticInstanceDefinition): MaterializedSlotBranch {
  const b: MaterializedSlotBranch = { kind: branchKind(row) };
  if (row.id !== undefined) b.id = row.id;
  if (row.label !== undefined) b.label = row.label;
  if (row.branchValue !== undefined) b.branchValue = row.branchValue;
  if (row.path !== undefined) b.path = row.path;
  if (row.idPath !== undefined) b.idPath = row.idPath;
  if (row.labelPath !== undefined) b.labelPath = row.labelPath;
  if (row.enabledPath !== undefined) b.enabledPath = row.enabledPath;
  if (row.actionsPath !== undefined) b.actionsPath = row.actionsPath;
  if (row.exportsPath !== undefined) b.exportsPath = row.exportsPath;
  if (row.hideOnDisable !== undefined) b.hideOnDisable = row.hideOnDisable;
  if (row.labelPlaceholderTemplate !== undefined) b.labelPlaceholderTemplate = row.labelPlaceholderTemplate;
  if (row.labelPlaceholderValue !== undefined) b.labelPlaceholderValue = row.labelPlaceholderValue;
  return b;
}

function pickLayout(def: ISlotDefinition): MaterializedSlotLayout {
  const layout: MaterializedSlotLayout = {};
  if (def.showBranchLabels !== undefined) layout.showBranchLabels = def.showBranchLabels;
  if (def.activeSlotId !== undefined) layout.activeSlotId = def.activeSlotId;
  if (def.activeSlotLabel !== undefined) layout.activeSlotLabel = def.activeSlotLabel;
  if (def.hideDisabled !== undefined) layout.hideDisabled = def.hideDisabled;
  if (def.hideDisabledPath !== undefined) layout.hideDisabledPath = def.hideDisabledPath;
  if (def.hideOnDisable !== undefined) layout.hideOnDisable = def.hideOnDisable;
  if (def.exportSchemaPath !== undefined) layout.exportSchemaPath = def.exportSchemaPath;
  return layout;
}

function isEffectivelyEmpty(def: ISlotDefinition): boolean {
  const rows = def.slots ?? [];
  const layout = pickLayout(def);
  return rows.length === 0 && Object.keys(layout).length === 0;
}

/** Normalize **`ISlotDefinition`** for codegen / workflow inference (JSON-serializable). */
export function materializeSlotDefinition(
  def: ISlotDefinition | null | undefined,
): MaterializedSlotDefinition | null {
  if (def == null || isEffectivelyEmpty(def)) {
    return null;
  }
  return {
    layout: pickLayout(def),
    branches: (def.slots ?? []).map(pickBranch),
  };
}
