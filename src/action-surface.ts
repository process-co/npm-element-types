/** JSON-safe value used by declarative action surfaces. */
export type ActionSurfaceJsonValue =
    | null
    | boolean
    | number
    | string
    | ActionSurfaceJsonValue[]
    | { [key: string]: ActionSurfaceJsonValue };

/** Product surfaces on which an action can be presented. */
export type ActionSurfaceTarget =
    | 'process-chat'
    | 'process-app'
    | 'process-mobile'
    | 'slack'
    | 'teams'
    | 'sms'
    | 'apple-messages';

export type ActionSurfaceBindingAccess = 'read' | 'write' | 'read-write';
export type ActionSurfaceMode = 'proposal' | 'receipt';
export type ActionSurfaceExecutionStatus =
  | 'proposed'
  | 'awaiting-approval'
  | 'executing'
  | 'settlement-unknown'
  | 'succeeded'
    | 'failed'
    | 'denied'
    | 'cancelled';

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

export type ActionSurfaceRenderer =
    | ElementReactActionSurfaceRenderer
    | DeclarativeActionSurfaceRenderer
    | SchemaActionSurfaceRenderer
    | StaticPreviewActionSurfaceRenderer;

/** Host-owned transitions exposed to a surface; none bypass action policy. */
export type ActionSurfaceCommand = {
    intent:
        | 'execute'
        | 'approve'
        | 'deny'
        | 'return-for-changes'
        | 'open-in-process';
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

const SAFE_UI_KEY = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;
const VALID_SOURCES = new Set(['input', 'context', 'output', 'policy', 'connection', 'execution']);
const VALID_ACCESS = new Set(['read', 'write', 'read-write']);
const VALID_TARGETS = new Set([
    'process-chat',
    'process-app',
    'process-mobile',
    'slack',
    'teams',
    'sms',
    'apple-messages',
]);
const VALID_INTENTS = new Set(['execute', 'approve', 'deny', 'return-for-changes', 'open-in-process']);
const VALID_MODES = new Set(['proposal', 'receipt']);

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isJsonValue(value: unknown): value is ActionSurfaceJsonValue {
    if (value === null || ['boolean', 'number', 'string'].includes(typeof value)) return true;
    if (Array.isArray(value)) return value.every(isJsonValue);
    return isRecord(value) && Object.values(value).every(isJsonValue);
}

/** Validate untrusted build metadata before it is persisted in the registry. */
export function parseActionSurfaceDefinitions(value: unknown): ActionSurfaceDefinitions {
    if (!isRecord(value)) throw new Error('Action surfaces must be an object');

    for (const [surfaceKey, surface] of Object.entries(value)) {
        if (!surfaceKey || !isRecord(surface)) throw new Error(`Invalid action surface: ${surfaceKey}`);
        if (typeof surface.contract !== 'string' || !surface.contract.includes('/v')) {
            throw new Error(`Action surface ${surfaceKey} must declare a versioned contract`);
        }
        if (!Array.isArray(surface.renderers) || surface.renderers.length === 0) {
            throw new Error(`Action surface ${surfaceKey} must declare at least one renderer`);
        }
        if (!isRecord(surface.bindings)) {
            throw new Error(`Action surface ${surfaceKey} must declare bindings`);
        }
        if (surface.targets !== undefined && (
            !Array.isArray(surface.targets) ||
            !surface.targets.every((target) => typeof target === 'string' && VALID_TARGETS.has(target))
        )) throw new Error(`Action surface ${surfaceKey} has an invalid target`);
        if (surface.modes !== undefined && (
            !Array.isArray(surface.modes) ||
            surface.modes.length === 0 ||
            !surface.modes.every((mode) => typeof mode === 'string' && VALID_MODES.has(mode)) ||
            new Set(surface.modes).size !== surface.modes.length
        )) throw new Error(`Action surface ${surfaceKey} has an invalid mode`);

        for (const renderer of surface.renderers) {
            if (!isRecord(renderer)) throw new Error(`Action surface ${surfaceKey} has an invalid renderer`);
            if (renderer.kind === 'element-react') {
                if (typeof renderer.uiKey !== 'string' || !SAFE_UI_KEY.test(renderer.uiKey) || renderer.uiKey.includes('..')) {
                    throw new Error(`Action surface ${surfaceKey} has an unsafe UI key`);
                }
            } else if (renderer.kind === 'declarative') {
                if (renderer.renderer !== 'json-render' || !isJsonValue(renderer.document)) {
                    throw new Error(`Action surface ${surfaceKey} has an invalid declarative renderer`);
                }
            } else if (renderer.kind === 'static-preview') {
                if (
                    typeof renderer.assetKey !== 'string' ||
                    !SAFE_UI_KEY.test(renderer.assetKey) ||
                    renderer.assetKey.includes('..') ||
                    renderer.assetKey.startsWith('/')
                ) throw new Error(`Action surface ${surfaceKey} has an unsafe preview asset key`);
                if (renderer.mimeType !== 'image/png') {
                    throw new Error(`Action surface ${surfaceKey} has an invalid preview MIME type`);
                }
                if (typeof renderer.alt !== 'string' || !renderer.alt.trim()) {
                    throw new Error(`Action surface ${surfaceKey} must describe its static preview`);
                }
                if (
                    typeof renderer.width !== 'number' || !Number.isInteger(renderer.width) || renderer.width <= 0 ||
                    typeof renderer.height !== 'number' || !Number.isInteger(renderer.height) || renderer.height <= 0 ||
                    (renderer.pixelRatio !== undefined && (
                        typeof renderer.pixelRatio !== 'number' ||
                        ![1, 2, 3, 4].includes(renderer.pixelRatio)
                    ))
                ) throw new Error(`Action surface ${surfaceKey} has invalid preview dimensions`);
                if (typeof renderer.activateCommand !== 'string' || !renderer.activateCommand) {
                    throw new Error(`Action surface ${surfaceKey} must bind its preview activation`);
                }
            } else if (renderer.kind !== 'schema') {
                throw new Error(`Action surface ${surfaceKey} has an unknown renderer`);
            }
        }

        for (const binding of Object.values(surface.bindings)) {
            if (!isRecord(binding) || typeof binding.source !== 'string' || !VALID_SOURCES.has(binding.source)) {
                throw new Error(`Action surface ${surfaceKey} has an invalid binding source`);
            }
            if (typeof binding.path !== 'string' || !binding.path) {
                throw new Error(`Action surface ${surfaceKey} has an invalid binding path`);
            }
            if (binding.access !== undefined && (typeof binding.access !== 'string' || !VALID_ACCESS.has(binding.access))) {
                throw new Error(`Action surface ${surfaceKey} has an invalid binding access`);
            }
            if ((binding.source === 'policy' || binding.source === 'connection' || binding.source === 'execution') && binding.access && binding.access !== 'read') {
                throw new Error(`Action surface ${surfaceKey} cannot write policy, connection, or execution state`);
            }
        }

        if (surface.commands !== undefined) {
            if (!isRecord(surface.commands)) throw new Error(`Action surface ${surfaceKey} has invalid commands`);
            for (const command of Object.values(surface.commands)) {
                if (!isRecord(command) || typeof command.intent !== 'string' || !VALID_INTENTS.has(command.intent)) {
                    throw new Error(`Action surface ${surfaceKey} has an invalid command`);
                }
            }
        }

        for (const renderer of surface.renderers) {
            if (!isRecord(renderer) || renderer.kind !== 'static-preview') continue;
            const command = isRecord(surface.commands) ? surface.commands[renderer.activateCommand as string] : undefined;
            if (!isRecord(command) || command.intent !== 'open-in-process') {
                throw new Error(`Action surface ${surfaceKey} preview must activate an open-in-process command`);
            }
        }
    }

    return value as ActionSurfaceDefinitions;
}
