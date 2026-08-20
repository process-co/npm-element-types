"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseActionSurfaceDefinitions = parseActionSurfaceDefinitions;
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
function isRecord(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function isJsonValue(value) {
    if (value === null || ['boolean', 'number', 'string'].includes(typeof value))
        return true;
    if (Array.isArray(value))
        return value.every(isJsonValue);
    return isRecord(value) && Object.values(value).every(isJsonValue);
}
/** Validate untrusted build metadata before it is persisted in the registry. */
function parseActionSurfaceDefinitions(value) {
    if (!isRecord(value))
        throw new Error('Action surfaces must be an object');
    for (const [surfaceKey, surface] of Object.entries(value)) {
        if (!surfaceKey || !isRecord(surface))
            throw new Error(`Invalid action surface: ${surfaceKey}`);
        if (typeof surface.contract !== 'string' || !surface.contract.includes('/v')) {
            throw new Error(`Action surface ${surfaceKey} must declare a versioned contract`);
        }
        if (!Array.isArray(surface.renderers) || surface.renderers.length === 0) {
            throw new Error(`Action surface ${surfaceKey} must declare at least one renderer`);
        }
        if (!isRecord(surface.bindings)) {
            throw new Error(`Action surface ${surfaceKey} must declare bindings`);
        }
        if (surface.targets !== undefined && (!Array.isArray(surface.targets) ||
            !surface.targets.every((target) => typeof target === 'string' && VALID_TARGETS.has(target))))
            throw new Error(`Action surface ${surfaceKey} has an invalid target`);
        if (surface.modes !== undefined && (!Array.isArray(surface.modes) ||
            surface.modes.length === 0 ||
            !surface.modes.every((mode) => typeof mode === 'string' && VALID_MODES.has(mode)) ||
            new Set(surface.modes).size !== surface.modes.length))
            throw new Error(`Action surface ${surfaceKey} has an invalid mode`);
        for (const renderer of surface.renderers) {
            if (!isRecord(renderer))
                throw new Error(`Action surface ${surfaceKey} has an invalid renderer`);
            if (renderer.kind === 'element-react') {
                if (typeof renderer.uiKey !== 'string' || !SAFE_UI_KEY.test(renderer.uiKey) || renderer.uiKey.includes('..')) {
                    throw new Error(`Action surface ${surfaceKey} has an unsafe UI key`);
                }
            }
            else if (renderer.kind === 'declarative') {
                if (renderer.renderer !== 'json-render' || !isJsonValue(renderer.document)) {
                    throw new Error(`Action surface ${surfaceKey} has an invalid declarative renderer`);
                }
            }
            else if (renderer.kind === 'static-preview') {
                if (typeof renderer.assetKey !== 'string' ||
                    !SAFE_UI_KEY.test(renderer.assetKey) ||
                    renderer.assetKey.includes('..') ||
                    renderer.assetKey.startsWith('/'))
                    throw new Error(`Action surface ${surfaceKey} has an unsafe preview asset key`);
                if (renderer.mimeType !== 'image/png') {
                    throw new Error(`Action surface ${surfaceKey} has an invalid preview MIME type`);
                }
                if (typeof renderer.alt !== 'string' || !renderer.alt.trim()) {
                    throw new Error(`Action surface ${surfaceKey} must describe its static preview`);
                }
                if (typeof renderer.width !== 'number' || !Number.isInteger(renderer.width) || renderer.width <= 0 ||
                    typeof renderer.height !== 'number' || !Number.isInteger(renderer.height) || renderer.height <= 0 ||
                    (renderer.pixelRatio !== undefined && (typeof renderer.pixelRatio !== 'number' ||
                        ![1, 2, 3, 4].includes(renderer.pixelRatio))))
                    throw new Error(`Action surface ${surfaceKey} has invalid preview dimensions`);
                if (typeof renderer.activateCommand !== 'string' || !renderer.activateCommand) {
                    throw new Error(`Action surface ${surfaceKey} must bind its preview activation`);
                }
            }
            else if (renderer.kind !== 'schema') {
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
            if (!isRecord(surface.commands))
                throw new Error(`Action surface ${surfaceKey} has invalid commands`);
            for (const command of Object.values(surface.commands)) {
                if (!isRecord(command) || typeof command.intent !== 'string' || !VALID_INTENTS.has(command.intent)) {
                    throw new Error(`Action surface ${surfaceKey} has an invalid command`);
                }
            }
        }
        for (const renderer of surface.renderers) {
            if (!isRecord(renderer) || renderer.kind !== 'static-preview')
                continue;
            const command = isRecord(surface.commands) ? surface.commands[renderer.activateCommand] : undefined;
            if (!isRecord(command) || command.intent !== 'open-in-process') {
                throw new Error(`Action surface ${surfaceKey} preview must activate an open-in-process command`);
            }
        }
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLXN1cmZhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWN0aW9uLXN1cmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUErSkEsc0VBa0dDO0FBNUhELE1BQU0sV0FBVyxHQUFHLCtCQUErQixDQUFDO0FBQ3BELE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ25HLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQzlELE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzFCLGNBQWM7SUFDZCxhQUFhO0lBQ2IsZ0JBQWdCO0lBQ2hCLE9BQU87SUFDUCxPQUFPO0lBQ1AsS0FBSztJQUNMLGdCQUFnQjtDQUNuQixDQUFDLENBQUM7QUFDSCxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUN2RyxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBRXJELFNBQVMsUUFBUSxDQUFDLEtBQWM7SUFDNUIsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsS0FBYztJQUMvQixJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEs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