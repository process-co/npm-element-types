import type {
  ObjectProjectionStrategy,
  ObjectProjectionTargetCoverage,
  ObjectProjectionWritePolicy,
} from './object-projection';

export type SlotCompletionMode =
  | 'all'
  | 'allSettled'
  | 'any'
  | 'race'
  | 'minimumSucceeded'
  | 'minimumSettled';

export type SlotCompletionErrorPolicy =
  | 'failFast'
  | 'waitForAll'
  | 'collect'
  | 'ignore'
  | 'continue';

/**
 * Declarative completion contract for a slotted container. Paths are evaluated
 * against the same canonical node shape used by the slot layout definition.
 */
export type SlotCompletionDefinition = {
  mode?: SlotCompletionMode;
  modePath?: string;
  modeMap?: Readonly<Record<string, SlotCompletionMode>>;
  /** Required successful/settled paths for minimum* modes. Defaults to one. */
  minimum?: number;
  minimumPath?: string;
  errorPolicy?: SlotCompletionErrorPolicy;
  errorPolicyPath?: string;
  /** Allow this authored policy to be inherited by nested containers. */
  inheritable?: boolean;
  /** Optional instance-level override for `inheritable`. */
  inheritablePath?: string;
  maxConcurrencyPath?: string;
  timeoutMsPath?: string;
  cancelOnFailure?: boolean;
  cancelOnFailurePath?: string;
  trace?: boolean;
  tracePath?: string;
};

export type SlotControlExecutionDefinition = {
  /** Selected slots execute as one branch, concurrently, or as iterations. */
  strategy: 'selected' | 'concurrent' | 'iterate';
  /** Present only when the selected slots require a distributed join barrier. */
  completion?: SlotCompletionDefinition;
};

/**
 * Closed execution-plane declaration for a Process-owned orchestration
 * control. This is deliberately separate from the slot strategy: `selected`,
 * `concurrent`, and `iterate` describe graph behavior, while this declaration
 * decides whether the element host is invoked at all.
 */
export type SlotControlRuntimeDefinition = {
  strategy: 'native';
  intrinsic: string;
  /** Contract version understood by the gateway intrinsic registry. */
  version: 1;
};

export type SlotControlSurfaceNodeDefinition = {
  title?: string;
  description?: string;
  badge?: string;
  icon?: string;
};

export type SlotControlSurfaceBadgeDefinition = {
  id: string;
  label?: string;
  labelPath?: string;
  tone?: string;
  visiblePath?: string;
};

export type SlotControlSurfaceControlDefinition = {
  id: string;
  label: string;
  /** Registered editor command; definitions cannot inject executable UI code. */
  command: string;
  icon?: string;
  visiblePath?: string;
  disabledPath?: string;
};

/**
 * Definition-owned canvas presentation. `type` selects a registered generic
 * renderer; `config` is renderer-owned JSON configuration for future controls.
 */
export type SlotControlSurfaceDefinition = {
  type: 'decision' | 'fork-join' | 'iteration' | string;
  accent?: 'slate' | 'indigo' | 'amber' | 'emerald' | 'violet' | string;
  /** Opaque is the safe default because connectors run behind node surfaces. */
  opacity?: 'opaque' | 'translucent';
  connectorMask?: 'bounds' | 'none';
  fork?: SlotControlSurfaceNodeDefinition;
  join?: SlotControlSurfaceNodeDefinition;
  region?: SlotControlSurfaceNodeDefinition;
  badges?: readonly SlotControlSurfaceBadgeDefinition[];
  controls?: readonly SlotControlSurfaceControlDefinition[];
  config?: Readonly<Record<string, unknown>>;
};

/**
 * The container result is assembled from the existing per-slot export mappings
 * and checked against the existing container export schema.
 */
export type SlotControlResultDefinition = {
  source: 'slot-exports';
  merge?: 'deep';
  target?: 'result';
  includeSettlement?: boolean;
  /**
   * Definition-owned defaults for the shared slot projection editor/runtime.
   * Per-container projection documents still own their source rules and target
   * schema; this block prevents Parallel/If/Switch/Loop renderers from
   * hard-coding different merge behavior.
   */
  projection?: {
    /** Defaults to the control execution strategy. */
    strategy?: ObjectProjectionStrategy;
    defaultWritePolicy?: ObjectProjectionWritePolicy;
    targetCoverage?: ObjectProjectionTargetCoverage;
  };
};

/**
 * Generic flow-control metadata attached to an ordinary slot definition.
 * Runtime and editor code interpret this contract without inspecting the
 * element FERN, display name, or element-specific property names.
 */
export type SlotControlDefinition = {
  kind: string;
  runtime?: SlotControlRuntimeDefinition;
  execution: SlotControlExecutionDefinition;
  result?: SlotControlResultDefinition;
  surface?: SlotControlSurfaceDefinition;
};
