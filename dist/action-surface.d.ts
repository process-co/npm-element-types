/** JSON-safe value used by declarative action surfaces. */
export type ActionSurfaceJsonValue = null | boolean | number | string | ActionSurfaceJsonValue[] | {
    [key: string]: ActionSurfaceJsonValue;
};
/** Product surfaces on which an action can be presented. */
export type ActionSurfaceTarget = 'process-chat' | 'process-app' | 'process-mobile' | 'slack' | 'teams' | 'sms' | 'apple-messages';
export type ActionSurfaceBindingAccess = 'read' | 'write' | 'read-write';
export type ActionSurfaceMode = 'proposal' | 'receipt';
export type ActionSurfaceExecutionStatus = 'proposed' | 'awaiting-approval' | 'executing' | 'settlement-unknown' | 'succeeded' | 'failed' | 'denied' | 'cancelled';
/**
 * Maps one field in a reusable UI contract to authoritative action state.
 * The host resolves the root; remote controls never receive credentials or a
 * direct provider client.
 */
export type ActionSurfaceBinding = {
    source: 'input' | 'context' | 'output' | 'policy' | 'connection' | 'execution';
    path: string;
    access?: ActionSurfaceBindingAccess;
    required?: boolean;
};
/** A signed React control bundled from the element's `ui/` directory. */
export type ElementReactActionSurfaceRenderer = {
    kind: 'element-react';
    uiKey: string;
};
/** A JSON document rendered by a host-owned, allowlisted renderer. */
export type DeclarativeActionSurfaceRenderer = {
    kind: 'declarative';
    renderer: 'json-render';
    document: ActionSurfaceJsonValue;
};
/** Automatic fallback generated from the action input schema. */
export type SchemaActionSurfaceRenderer = {
    kind: 'schema';
};
/**
 * Signed bundle asset used when a host cannot mount the rich renderer. The
 * host turns activation into the named `open-in-process` command; the image
 * itself never receives credentials or executes an action.
 */
export type StaticPreviewActionSurfaceRenderer = {
    kind: 'static-preview';
    assetKey: string;
    mimeType: 'image/png';
    alt: string;
    width: number;
    height: number;
    pixelRatio?: 1 | 2 | 3 | 4;
    activateCommand: string;
};
export type ActionSurfaceRenderer = ElementReactActionSurfaceRenderer | DeclarativeActionSurfaceRenderer | SchemaActionSurfaceRenderer | StaticPreviewActionSurfaceRenderer;
/** Host-owned transitions exposed to a surface; none bypass action policy. */
export type ActionSurfaceCommand = {
    intent: 'execute' | 'approve' | 'deny' | 'return-for-changes' | 'open-in-process';
    label?: string;
};
/**
 * Versioned UI contract for one action experience. Renderers are evaluated in
 * order, which makes a provider control optional while guaranteeing a generic
 * schema fallback.
 */
export type ActionSurfaceDefinition = {
    contract: string;
    targets?: readonly ActionSurfaceTarget[];
    /** Proposal is interactive; receipt is an immutable post-execution view. */
    modes?: readonly ActionSurfaceMode[];
    renderers: readonly ActionSurfaceRenderer[];
    bindings: Record<string, ActionSurfaceBinding>;
    commands?: Record<string, ActionSurfaceCommand>;
};
export type ActionSurfaceDefinitions = Record<string, ActionSurfaceDefinition>;
/** Props exposed to an element React action surface by the Process host. */
export type ElementActionSurfaceProps<TValue = Record<string, unknown>> = {
    value: TValue;
    mode?: ActionSurfaceMode;
    execution?: {
        status: ActionSurfaceExecutionStatus;
        invocationId?: string;
        occurredAt?: string;
        actor?: {
            kind: 'human' | 'agent' | 'system';
            id: string;
            displayName?: string;
        };
        evidenceRef?: string;
        error?: string;
    };
    readonly?: boolean;
    pending?: boolean;
    onChange: (value: TValue) => void;
    onCommand: (command: string) => void | Promise<void>;
};
/** Validate untrusted build metadata before it is persisted in the registry. */
export declare function parseActionSurfaceDefinitions(value: unknown): ActionSurfaceDefinitions;
//# sourceMappingURL=action-surface.d.ts.map