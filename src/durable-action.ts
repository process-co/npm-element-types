import { z } from 'zod';

import {
  CallableResourceReferenceSchema,
  ObjectProjectionDocumentSchema,
} from './callable-resource';
import { validateDurableActionDefinition } from './durable-action-validation';

const SAFE_KEY = /^[A-Za-z][A-Za-z0-9._-]*$/;
const VERSIONED_ID = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\/v[1-9][0-9]*$/;

const KeySchema = z.string().trim().min(1).max(200).regex(SAFE_KEY);
const VersionedIdSchema = z.string().trim().min(1).max(300).regex(VERSIONED_ID);
const JsonPathSchema = z.string().trim().min(1).max(500).refine(
  (path) => !path.includes('..'),
  'Paths cannot traverse parent values',
);

export const DurableActionLifecycleSchema = z.enum([
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

const DurableActionTransitionSchema = z.object({
  event: KeySchema,
  target: KeySchema,
  effects: z.array(KeySchema).default([]),
}).strict();

const DurableActionStateSchema = z.object({
  lifecycle: DurableActionLifecycleSchema,
  final: z.boolean().default(false),
  on: z.array(DurableActionTransitionSchema).default([]),
}).strict();

const LocalActionEffectBindingSchema = z.object({
  kind: z.literal('local-action'),
  actionKey: KeySchema,
}).strict();

// Authoring selectors are resolved by admission; this is never an executable target.
const AuthoredCallableEffectBindingSchema = z.object({
  kind: z.literal('authored-callable'),
  definitionFern: z.string().trim().min(1).max(2048),
}).strict();

const PinnedCallableEffectBindingSchema = z.object({
  kind: z.literal('pinned-callable'),
  resource: CallableResourceReferenceSchema,
}).strict().superRefine(({ resource }, context) => {
  if (resource.version.mode !== 'pinned') {
    context.addIssue({
      code: 'custom',
      message: 'Durable Action callables must use an immutable pinned version',
      path: ['resource', 'version'],
    });
  }
});

export const DurableActionEffectBindingSchema = z.discriminatedUnion('kind', [
  LocalActionEffectBindingSchema,
  AuthoredCallableEffectBindingSchema,
  PinnedCallableEffectBindingSchema,
]);

const DurableActionSettlementEventSchema = z.union([
  KeySchema,
  z.array(KeySchema).min(1),
]);

const DurableActionEffectSchema = z.object({
  binding: DurableActionEffectBindingSchema,
  inputMapping: ObjectProjectionDocumentSchema.optional(),
  outputProjection: ObjectProjectionDocumentSchema.optional(),
  settlementEvents: z.object({
    succeeded: DurableActionSettlementEventSchema,
    failed: KeySchema,
    cancelled: KeySchema.optional(),
    timedOut: KeySchema.optional(),
  }).strict(),
}).strict();

const DurableActionResourceIdentitySchema = z.object({
  providerInstallationIdPath: JsonPathSchema,
  accountIdPath: JsonPathSchema,
  resourceIdPath: JsonPathSchema,
  tenantIdPath: JsonPathSchema.optional(),
  containerIdPath: JsonPathSchema.optional(),
  parentResourceIdPath: JsonPathSchema.optional(),
  versionPath: JsonPathSchema.optional(),
}).strict();

const DurableActionResourceSchema = z.object({
  kind: VersionedIdSchema,
  mutableExternally: z.boolean(),
  identity: DurableActionResourceIdentitySchema,
  retainAfterTerminalSeconds: z.number().int().nonnegative().max(31_536_000).default(0),
}).strict();

const DurableActionObservationSchema = z.object({
  profile: VersionedIdSchema,
  event: VersionedIdSchema,
  resource: KeySchema,
  machineEvent: KeySchema,
  evidence: z.enum(['hint', 'authoritative']),
  reconcile: z.enum(['always', 'when-uncertain', 'never']),
}).strict().superRefine((observation, context) => {
  if (observation.evidence === 'hint' && observation.reconcile === 'never') {
    context.addIssue({
      code: 'custom',
      message: 'Hint observations require reconciliation',
      path: ['reconcile'],
    });
  }
});

const DurableActionReconciliationSchema = z.object({
  resource: KeySchema,
  effect: KeySchema,
  triggers: z.array(z.enum([
    'after-effect',
    'observation',
    'resume',
    'timer',
    'unknown-settlement',
  ])).min(1),
  freshnessSeconds: z.number().int().nonnegative().max(86_400),
  maxAttempts: z.number().int().min(1).max(100),
  backoff: z.object({
    kind: z.enum(['fixed', 'exponential']),
    initialDelayMs: z.number().int().nonnegative(),
    maxDelayMs: z.number().int().nonnegative(),
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

const DurableActionCommandSchema = z.object({
  intent: KeySchema,
  event: KeySchema,
  allowedStates: z.array(KeySchema).min(1),
  inputMapping: ObjectProjectionDocumentSchema.optional(),
}).strict();

const DurableActionTimerSchema = z.object({
  delayMs: z.number().int().positive().max(31_536_000_000),
  event: KeySchema,
  startInStates: z.array(KeySchema).min(1),
  cancelInStates: z.array(KeySchema).default([]),
}).strict();

const DurableActionSurfaceReferenceSchema = z.object({
  actionKey: KeySchema,
  surfaceKey: KeySchema,
}).strict();

const DurableActionPresentationSchema = z.object({
  states: z.array(KeySchema).min(1),
  surface: DurableActionSurfaceReferenceSchema,
  mode: z.enum(['proposal', 'receipt']),
  commands: z.array(KeySchema).default([]),
}).strict();

const DurableActionDefinitionObjectSchema = z.object({
  schemaVersion: z.literal(1),
  key: KeySchema,
  contract: VersionedIdSchema,
  initial: KeySchema,
  states: z.record(KeySchema, DurableActionStateSchema),
  effects: z.record(KeySchema, DurableActionEffectSchema).default({}),
  commands: z.record(KeySchema, DurableActionCommandSchema).default({}),
  timers: z.record(KeySchema, DurableActionTimerSchema).default({}),
  resources: z.record(KeySchema, DurableActionResourceSchema).default({}),
  observations: z.record(KeySchema, DurableActionObservationSchema).default({}),
  reconciliation: z.record(KeySchema, DurableActionReconciliationSchema).default({}),
  presentations: z.record(KeySchema, DurableActionPresentationSchema).default({}),
}).strict();

export type DurableActionDefinitionInput = z.infer<typeof DurableActionDefinitionObjectSchema>;

export const DurableActionDefinitionSchema = DurableActionDefinitionObjectSchema.superRefine(
  validateDurableActionDefinition,
);

export const DurableActionDefinitionsSchema = z.record(KeySchema, DurableActionDefinitionSchema)
  .superRefine((definitions, context) => {
    for (const [definitionKey, definition] of Object.entries(definitions)) {
      if (definition.key === definitionKey) continue;
      context.addIssue({
        code: 'custom',
        message: `Definition key ${definition.key} must match record key ${definitionKey}`,
        path: [definitionKey, 'key'],
      });
    }
  });

export type DurableActionLifecycle = z.infer<typeof DurableActionLifecycleSchema>;
export type DurableActionEffectBinding = z.infer<typeof DurableActionEffectBindingSchema>;
export type DurableActionEffect = z.infer<typeof DurableActionEffectSchema>;
export type DurableActionDefinition = z.infer<typeof DurableActionDefinitionSchema>;
export type DurableActionDefinitions = z.infer<typeof DurableActionDefinitionsSchema>;

export type DurableActionAuthoringReferences = {
  actions: Record<string, { surfaceKeys?: readonly string[] }>;
};

/**
 * Validate element-authored Durable Actions and their references to local
 * atomic actions and already-declared action surfaces.
 *
 * Execution admission remains responsible for resolving local actions and
 * authored selectors to immutable versions and physical artifacts. This authoring
 * boundary never accepts credentials or executable provider code.
 */
export function parseDurableActionDefinitions(
  value: unknown,
  references: DurableActionAuthoringReferences,
): DurableActionDefinitions {
  const definitions = DurableActionDefinitionsSchema.parse(value);

  for (const [definitionKey, definition] of Object.entries(definitions)) {
    validateLocalActionReferences(definitionKey, definition, references);
    validateSurfaceReferences(definitionKey, definition, references);
  }

  return definitions;
}

function validateLocalActionReferences(
  definitionKey: string,
  definition: DurableActionDefinition,
  references: DurableActionAuthoringReferences,
): void {
  for (const [effectKey, effect] of Object.entries(definition.effects)) {
    if (effect.binding.kind !== 'local-action') continue;
    if (references.actions[effect.binding.actionKey]) continue;
    throw new Error(
      `Durable Action ${definitionKey} effect ${effectKey} references unknown action ${effect.binding.actionKey}`,
    );
  }
}

function validateSurfaceReferences(
  definitionKey: string,
  definition: DurableActionDefinition,
  references: DurableActionAuthoringReferences,
): void {
  for (const [presentationKey, presentation] of Object.entries(definition.presentations)) {
    const { actionKey, surfaceKey } = presentation.surface;
    const action = references.actions[actionKey];
    if (!action) {
      throw new Error(
        `Durable Action ${definitionKey} presentation ${presentationKey} references unknown action ${actionKey}`,
      );
    }
    if (action.surfaceKeys?.includes(surfaceKey)) continue;
    throw new Error(
      `Durable Action ${definitionKey} presentation ${presentationKey} references unknown surface ${actionKey}.${surfaceKey}`,
    );
  }
}
