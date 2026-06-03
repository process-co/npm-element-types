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
  /** Milliseconds until the container scope times out (element data path). */
  timeoutMsPath?: string;
  /** FERN of the handler to run on timeout (element data path). */
  timeoutHandlerFernPath?: string;
  /** Dispatch mode: `execute` | `signal` (element data path). */
  timeoutHandlerModePath?: string;
  /** Payload path resolved at fire time (element data path). */
  timeoutHandlerDataPath?: string;
  /** Recovery policy: `resurrect` | `drop` (element data path). */
  timeoutRecoveryPolicyPath?: string;
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
