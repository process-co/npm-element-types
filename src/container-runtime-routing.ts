/**
 * Resolved container timeout metadata persisted on workflow context rows
 * (`routingInfo` on ContextDataService saves).
 */

export type WorkflowTimeoutHandlerMode = 'execute' | 'signal';

export type WorkflowTimeoutRecoveryPolicy = 'resurrect' | 'drop';

export type WorkflowContainerRoutingRef = {
  fern: string;
  slotId: string;
  groupId?: string;
  elementId?: string;
};

export type WorkflowContainerTimeoutRouting = {
  durationMs: number;
  startedAtMs: number;
  expiresAtMs: number;
};

export type WorkflowContainerTimeoutHandlerRouting = {
  fern: string;
  mode: WorkflowTimeoutHandlerMode;
  dataPath?: string;
  dataSnapshot?: unknown;
  recoveryPolicy: WorkflowTimeoutRecoveryPolicy;
};

export type WorkflowContainerRuntimeRoutingInfo = {
  container: WorkflowContainerRoutingRef;
  timeout: WorkflowContainerTimeoutRouting;
  timeoutHandler: WorkflowContainerTimeoutHandlerRouting;
  /** Set when a timeout actor claims this row (ms epoch). */
  timeoutClaimedAt?: number;
  /** Terminal when timeout handling completed. */
  timeoutTerminal?: boolean;
};

export const CONTAINER_RUNTIME_ROUTING_SLUG = '$container-runtime';

export function containerRuntimeRangeKey(containerFern: string, slotId: string): string {
  const fern = containerFern.trim();
  const slot = slotId.trim();
  return `$container-runtime#${fern}#${slot}`;
}
