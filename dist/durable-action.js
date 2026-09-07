"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurableActionDefinitionsSchema = exports.DurableActionDefinitionSchema = exports.DurableActionEffectBindingSchema = exports.DurableActionLifecycleSchema = void 0;
exports.parseDurableActionDefinitions = parseDurableActionDefinitions;
const zod_1 = require("zod");
const callable_resource_1 = require("./callable-resource");
const durable_action_validation_1 = require("./durable-action-validation");
const SAFE_KEY = /^[A-Za-z][A-Za-z0-9._-]*$/;
const VERSIONED_ID = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\/v[1-9][0-9]*$/;
const KeySchema = zod_1.z.string().trim().min(1).max(200).regex(SAFE_KEY);
const VersionedIdSchema = zod_1.z.string().trim().min(1).max(300).regex(VERSIONED_ID);
const JsonPathSchema = zod_1.z.string().trim().min(1).max(500).refine((path) => !path.includes('..'), 'Paths cannot traverse parent values');
exports.DurableActionLifecycleSchema = zod_1.z.enum([
    'preparing',
    'proposed',
    'waiting',
    'executing',
    'observing',
    'reconciling',
    'unknown',
    'succeeded',
    'failed',
    'denied',
    'cancelled',
    'expired',
]);
const DurableActionTransitionSchema = zod_1.z.object({
    event: KeySchema,
    target: KeySchema,
    effects: zod_1.z.array(KeySchema).default([]),
}).strict();
const DurableActionStateSchema = zod_1.z.object({
    lifecycle: exports.DurableActionLifecycleSchema,
    final: zod_1.z.boolean().default(false),
    on: zod_1.z.array(DurableActionTransitionSchema).default([]),
}).strict();
const LocalActionEffectBindingSchema = zod_1.z.object({
    kind: zod_1.z.literal('local-action'),
    actionKey: KeySchema,
}).strict();
// Authoring selectors are resolved by admission; this is never an executable target.
const AuthoredCallableEffectBindingSchema = zod_1.z.object({
    kind: zod_1.z.literal('authored-callable'),
    definitionFern: zod_1.z.string().trim().min(1).max(2048),
}).strict();
const PinnedCallableEffectBindingSchema = zod_1.z.object({
    kind: zod_1.z.literal('pinned-callable'),
    resource: callable_resource_1.CallableResourceReferenceSchema,
}).strict().superRefine(({ resource }, context) => {
    if (resource.version.mode !== 'pinned') {
        context.addIssue({
            code: 'custom',
            message: 'Durable Action callables must use an immutable pinned version',
            path: ['resource', 'version'],
        });
    }
});
exports.DurableActionEffectBindingSchema = zod_1.z.discriminatedUnion('kind', [
    LocalActionEffectBindingSchema,
    AuthoredCallableEffectBindingSchema,
    PinnedCallableEffectBindingSchema,
]);
const DurableActionSettlementEventSchema = zod_1.z.union([
    KeySchema,
    zod_1.z.array(KeySchema).min(1),
]);
const DurableActionEffectSchema = zod_1.z.object({
    binding: exports.DurableActionEffectBindingSchema,
    inputMapping: callable_resource_1.ObjectProjectionDocumentSchema.optional(),
    outputProjection: callable_resource_1.ObjectProjectionDocumentSchema.optional(),
    settlementEvents: zod_1.z.object({
        succeeded: DurableActionSettlementEventSchema,
        failed: KeySchema,
        cancelled: KeySchema.optional(),
        timedOut: KeySchema.optional(),
    }).strict(),
}).strict();
const DurableActionResourceIdentitySchema = zod_1.z.object({
    providerInstallationIdPath: JsonPathSchema,
    accountIdPath: JsonPathSchema,
    resourceIdPath: JsonPathSchema,
    tenantIdPath: JsonPathSchema.optional(),
    containerIdPath: JsonPathSchema.optional(),
    parentResourceIdPath: JsonPathSchema.optional(),
    versionPath: JsonPathSchema.optional(),
}).strict();
const DurableActionResourceSchema = zod_1.z.object({
    kind: VersionedIdSchema,
    mutableExternally: zod_1.z.boolean(),
    identity: DurableActionResourceIdentitySchema,
    retainAfterTerminalSeconds: zod_1.z.number().int().nonnegative().max(31_536_000).default(0),
}).strict();
const DurableActionObservationSchema = zod_1.z.object({
    profile: VersionedIdSchema,
    event: VersionedIdSchema,
    resource: KeySchema,
    machineEvent: KeySchema,
    evidence: zod_1.z.enum(['hint', 'authoritative']),
    reconcile: zod_1.z.enum(['always', 'when-uncertain', 'never']),
}).strict().superRefine((observation, context) => {
    if (observation.evidence === 'hint' && observation.reconcile === 'never') {
        context.addIssue({
            code: 'custom',
            message: 'Hint observations require reconciliation',
            path: ['reconcile'],
        });
    }
});
const DurableActionReconciliationSchema = zod_1.z.object({
    resource: KeySchema,
    effect: KeySchema,
    triggers: zod_1.z.array(zod_1.z.enum([
        'after-effect',
        'observation',
        'resume',
        'timer',
        'unknown-settlement',
    ])).min(1),
    freshnessSeconds: zod_1.z.number().int().nonnegative().max(86_400),
    maxAttempts: zod_1.z.number().int().min(1).max(100),
    backoff: zod_1.z.object({
        kind: zod_1.z.enum(['fixed', 'exponential']),
        initialDelayMs: zod_1.z.number().int().nonnegative(),
        maxDelayMs: zod_1.z.number().int().nonnegative(),
    }).strict().superRefine((backoff, context) => {
        if (backoff.maxDelayMs < backoff.initialDelayMs) {
            context.addIssue({
                code: 'custom',
                message: 'maxDelayMs must be greater than or equal to initialDelayMs',
                path: ['maxDelayMs'],
            });
        }
    }),
}).strict();
const DurableActionCommandSchema = zod_1.z.object({
    intent: KeySchema,
    event: KeySchema,
    allowedStates: zod_1.z.array(KeySchema).min(1),
    inputMapping: callable_resource_1.ObjectProjectionDocumentSchema.optional(),
}).strict();
const DurableActionTimerSchema = zod_1.z.object({
    delayMs: zod_1.z.number().int().positive().max(31_536_000_000),
    event: KeySchema,
    startInStates: zod_1.z.array(KeySchema).min(1),
    cancelInStates: zod_1.z.array(KeySchema).default([]),
}).strict();
const DurableActionSurfaceReferenceSchema = zod_1.z.object({
    actionKey: KeySchema,
    surfaceKey: KeySchema,
}).strict();
const DurableActionPresentationSchema = zod_1.z.object({
    states: zod_1.z.array(KeySchema).min(1),
    surface: DurableActionSurfaceReferenceSchema,
    mode: zod_1.z.enum(['proposal', 'receipt']),
    commands: zod_1.z.array(KeySchema).default([]),
}).strict();
const DurableActionDefinitionObjectSchema = zod_1.z.object({
    schemaVersion: zod_1.z.literal(1),
    key: KeySchema,
    contract: VersionedIdSchema,
    initial: KeySchema,
    states: zod_1.z.record(KeySchema, DurableActionStateSchema),
    effects: zod_1.z.record(KeySchema, DurableActionEffectSchema).default({}),
    commands: zod_1.z.record(KeySchema, DurableActionCommandSchema).default({}),
    timers: zod_1.z.record(KeySchema, DurableActionTimerSchema).default({}),
    resources: zod_1.z.record(KeySchema, DurableActionResourceSchema).default({}),
    observations: zod_1.z.record(KeySchema, DurableActionObservationSchema).default({}),
    reconciliation: zod_1.z.record(KeySchema, DurableActionReconciliationSchema).default({}),
    presentations: zod_1.z.record(KeySchema, DurableActionPresentationSchema).default({}),
}).strict();
exports.DurableActionDefinitionSchema = DurableActionDefinitionObjectSchema.superRefine(durable_action_validation_1.validateDurableActionDefinition);
exports.DurableActionDefinitionsSchema = zod_1.z.record(KeySchema, exports.DurableActionDefinitionSchema)
    .superRefine((definitions, context) => {
    for (const [definitionKey, definition] of Object.entries(definitions)) {
        if (definition.key === definitionKey)
            continue;
        context.addIssue({
            code: 'custom',
            message: `Definition key ${definition.key} must match record key ${definitionKey}`,
            path: [definitionKey, 'key'],
        });
    }
});
/**
 * Validate element-authored Durable Actions and their references to local
 * atomic actions and already-declared action surfaces.
 *
 * Execution admission remains responsible for resolving local actions and
 * authored selectors to immutable versions and physical artifacts. This authoring
 * boundary never accepts credentials or executable provider code.
 */
function parseDurableActionDefinitions(value, references) {
    const definitions = exports.DurableActionDefinitionsSchema.parse(value);
    for (const [definitionKey, definition] of Object.entries(definitions)) {
        validateLocalActionReferences(definitionKey, definition, references);
        validateSurfaceReferences(definitionKey, definition, references);
    }
    return definitions;
}
function validateLocalActionReferences(definitionKey, definition, references) {
    for (const [effectKey, effect] of Object.entries(definition.effects)) {
        if (effect.binding.kind !== 'local-action')
            continue;
        if (references.actions[effect.binding.actionKey])
            continue;
        throw new Error(`Durable Action ${definitionKey} effect ${effectKey} references unknown action ${effect.binding.actionKey}`);
    }
}
function validateSurfaceReferences(definitionKey, definition, references) {
    for (const [presentationKey, presentation] of Object.entries(definition.presentations)) {
        const { actionKey, surfaceKey } = presentation.surface;
        const action = references.actions[actionKey];
        if (!action) {
            throw new Error(`Durable Action ${definitionKey} presentation ${presentationKey} references unknown action ${actionKey}`);
        }
        if (action.surfaceKeys?.includes(surfaceKey))
            continue;
        throw new Error(`Durable Action ${definitionKey} presentation ${presentationKey} references unknown surface ${actionKey}.${surfaceKey}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYWJsZS1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZHVyYWJsZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBc09BLHNFQVlDO0FBbFBELDZCQUF3QjtBQUV4QiwyREFHNkI7QUFDN0IsMkVBQThFO0FBRTlFLE1BQU0sUUFBUSxHQUFHLDJCQUEyQixDQUFDO0FBQzdDLE1BQU0sWUFBWSxHQUFHLHVEQUF1RCxDQUFDO0FBRTdFLE1BQU0sU0FBUyxHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRSxNQUFNLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoRixNQUFNLGNBQWMsR0FBRyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQzdELENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQzlCLHFDQUFxQyxDQUN0QyxDQUFDO0FBRVcsUUFBQSw0QkFBNEIsR0FBRyxPQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2pELFdBQVc7SUFDWCxVQUFVO0lBQ1YsU0FBUztJQUNULFdBQVc7SUFDWCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFNBQVM7SUFDVCxXQUFXO0lBQ1gsUUFBUTtJQUNSLFFBQVE7SUFDUixXQUFXO0lBQ1gsU0FBUztDQUNWLENBQUMsQ0FBQztBQUVI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