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
export declare const CONTAINER_RUNTIME_ROUTING_SLUG = "$container-runtime";
export declare function containerRuntimeRangeKey(containerFern: string, slotId: string): string;
//# sourceMappingURL=container-runtime-routing.d.ts.map