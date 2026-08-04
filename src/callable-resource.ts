import type { ObjectProjectionDocument } from './object-projection';
import { z } from 'zod';

/** Implementations that share the same invocation and settlement boundary. */
export type CallableImplementationKind =
  | 'action'
  | 'workflowGroup'
  | 'workflow'
  | 'hosted'
  | 'external';

export type CallableResourceScope = 'workflow' | 'project' | 'team' | 'public';

/**
 * Execution must resolve either an immutable version or the editing session's
 * isolated draft. Mutable "latest" pointers are intentionally not executable.
 */
export type CallableVersionSelector =
  | {
      mode: 'pinned';
      versionId: string;
      versionNumber: number;
    }
  | {
      mode: 'draft';
      editingSessionId: string;
    };

export type CallableContract = {
  /** Portable JSON Schema owned by the callable version. */
  inputSchema?: unknown;
  successSchema?: unknown;
  errorSchema?: unknown;
};

/**
 * Immutable physical artifact selected when a callable snapshot is published.
 * Logical identity remains in `definitionFern`; runtimes use this locator
 * without consulting a mutable `latest` pointer.
 */
export type CallableRuntimeTarget = {
  artifactKey: string;
  /** Stable cache identity for this exact artifact (normally the Version.id). */
  artifactIdentity: string;
};

/** Stable resource identity plus the exact implementation selected to run. */
export type CallableResourceReference = {
  stableId: string;
  definitionFern?: string;
  implementationKind: CallableImplementationKind;
  scope: CallableResourceScope;
  version: CallableVersionSelector;
  runtimeTarget?: CallableRuntimeTarget;
  contract?: CallableContract;
};

/** A node is an invocation of a resource, not a copy of its implementation. */
export type CallableInvocationDefinition = {
  version: 1;
  instanceId: string;
  resource: CallableResourceReference;
  inputMapping?: ObjectProjectionDocument;
  outputProjection?: ObjectProjectionDocument;
  timeoutMs?: number | null;
  idempotencyExpression?: string;
  retry?: CallableRetryPolicy;
  errorPolicy?: CallableInvocationErrorPolicy;
};

export type CallableRetryPolicy = {
  maxAttempts: number;
  backoff?: 'none' | 'fixed' | 'exponential';
  initialDelayMs?: number;
  maxDelayMs?: number;
  retryableCodes?: readonly string[];
};

export type CallableInvocationErrorPolicy =
  | { action: 'propagate' }
  | { action: 'continue' }
  | { action: 'invokeRecovery'; recoveryCallable: CallableResourceReference };

const projectionSourceSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  description: z.string().optional(),
  schema: z.unknown().optional(),
  optional: z.boolean().optional(),
}).strict();

const projectionRuleSchema = z.object({
  id: z.string().trim().min(1),
  sourceId: z.string().trim().min(1),
  sourceExpression: z.string().trim().min(1),
  destinationPath: z.string().trim().min(1),
  sourceType: z.enum(['string', 'number', 'integer', 'boolean', 'object', 'array', 'null', 'unknown']).optional(),
  destinationType: z.enum(['string', 'number', 'integer', 'boolean', 'object', 'array', 'null', 'unknown']).optional(),
  writePolicy: z.enum(['error', 'first', 'last', 'replace', 'deepMerge', 'append', 'keyed']).optional(),
  keyExpression: z.string().trim().min(1).optional(),
}).strict().superRefine((rule, ctx) => {
  if (rule.writePolicy === 'keyed' && !rule.keyExpression) {
    ctx.addIssue({ code: 'custom', path: ['keyExpression'], message: 'keyExpression is required for keyed writes' });
  }
});

export const ObjectProjectionDocumentSchema = z.object({
  version: z.literal(1),
  strategy: z.enum(['selected', 'concurrent', 'iterate']),
  sources: z.array(projectionSourceSchema),
  targetSchema: z.unknown().optional(),
  defaultWritePolicy: z.enum(['error', 'first', 'last', 'replace', 'deepMerge', 'append', 'keyed']).optional(),
  targetCoverage: z.enum(['partial', 'required', 'all']).optional(),
  rules: z.array(projectionRuleSchema),
}).strict().superRefine((document, ctx) => {
  const sourceIds = new Set(document.sources.map((source) => source.id));
  const ruleIds = new Set<string>();
  for (const [index, rule] of document.rules.entries()) {
    if (!sourceIds.has(rule.sourceId)) {
      ctx.addIssue({ code: 'custom', path: ['rules', index, 'sourceId'], message: `Unknown projection source ${rule.sourceId}` });
    }
    if (ruleIds.has(rule.id)) {
      ctx.addIssue({ code: 'custom', path: ['rules', index, 'id'], message: `Duplicate projection rule ${rule.id}` });
    }
    ruleIds.add(rule.id);
  }
});

export const CallableVersionSelectorSchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('pinned'), versionId: z.string().trim().min(1), versionNumber: z.number().int().nonnegative() }).strict(),
  z.object({ mode: z.literal('draft'), editingSessionId: z.string().trim().min(1) }).strict(),
]);

export const CallableResourceReferenceSchema: z.ZodType<CallableResourceReference> = z.object({
  stableId: z.string().trim().min(1),
  definitionFern: z.string().trim().min(1).optional(),
  implementationKind: z.enum(['action', 'workflowGroup', 'workflow', 'hosted', 'external']),
  scope: z.enum(['workflow', 'project', 'team', 'public']),
  version: CallableVersionSelectorSchema,
  runtimeTarget: z.object({
    artifactKey: z.string().trim().min(1),
    artifactIdentity: z.string().trim().min(1),
  }).strict().optional(),
  contract: z.object({ inputSchema: z.unknown().optional(), successSchema: z.unknown().optional(), errorSchema: z.unknown().optional() }).strict().optional(),
}).strict().superRefine((resource, ctx) => {
  if (resource.runtimeTarget && resource.version.mode !== 'pinned') {
    ctx.addIssue({
      code: 'custom',
      path: ['runtimeTarget'],
      message: 'runtimeTarget requires a pinned callable version',
    });
  }
  if (
    resource.runtimeTarget &&
    resource.version.mode === 'pinned' &&
    resource.runtimeTarget.artifactIdentity !== resource.version.versionId
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['runtimeTarget', 'artifactIdentity'],
      message: 'artifactIdentity must match the pinned versionId',
    });
  }
  if (
    resource.version.mode === 'pinned' &&
    resource.definitionFern?.includes('code[') &&
    !resource.runtimeTarget
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['runtimeTarget'],
      message: 'Pinned dynamic callables require an immutable runtimeTarget',
    });
  }
});

const callableRetryPolicySchema = z.object({
  maxAttempts: z.number().int().min(1).max(100),
  backoff: z.enum(['none', 'fixed', 'exponential']).optional(),
  initialDelayMs: z.number().int().nonnegative().optional(),
  maxDelayMs: z.number().int().nonnegative().optional(),
  retryableCodes: z.array(z.string().trim().min(1)).optional(),
}).strict().superRefine((policy, ctx) => {
  if (policy.maxDelayMs != null && policy.initialDelayMs != null && policy.maxDelayMs < policy.initialDelayMs) {
    ctx.addIssue({ code: 'custom', path: ['maxDelayMs'], message: 'maxDelayMs must be greater than or equal to initialDelayMs' });
  }
});

const callableErrorPolicySchema: z.ZodType<CallableInvocationErrorPolicy> = z.discriminatedUnion('action', [
  z.object({ action: z.literal('propagate') }).strict(),
  z.object({ action: z.literal('continue') }).strict(),
  z.object({ action: z.literal('invokeRecovery'), recoveryCallable: CallableResourceReferenceSchema }).strict(),
]);

/** Runtime validator used at publish boundaries before an invocation is cached. */
export const CallableInvocationDefinitionSchema: z.ZodType<CallableInvocationDefinition> = z.object({
  version: z.literal(1),
  instanceId: z.string().trim().min(1),
  resource: CallableResourceReferenceSchema,
  inputMapping: ObjectProjectionDocumentSchema.optional(),
  outputProjection: ObjectProjectionDocumentSchema.optional(),
  timeoutMs: z.number().int().positive().nullable().optional(),
  idempotencyExpression: z.string().trim().min(1).optional(),
  retry: callableRetryPolicySchema.optional(),
  errorPolicy: callableErrorPolicySchema.optional(),
}).strict();

export type CallableInvocationIdentity = {
  executionId: string;
  invocationId: string;
  instanceId: string;
  workflowId: string;
  nodeId: string;
  attempt: number;
  parentInvocationId?: string;
  causationId?: string;
  correlationId?: string;
  containerId?: string;
  slotId?: string;
};

export type CallableErrorEnvelope = {
  code: string;
  message: string;
  retryable: boolean;
  sourceInstanceId: string;
  phase: 'mapping' | 'dispatch' | 'execution' | 'settlement' | 'timeout' | 'cancellation';
  identity: CallableInvocationIdentity;
  cause?: CallableErrorEnvelope;
  details?: unknown;
};

export type CallableInvocationPolicySnapshot = {
  timeoutMs?: number | null;
  retry?: CallableRetryPolicy;
  errorPolicy?: CallableInvocationErrorPolicy;
};

/**
 * Runtime call boundary shared by native, hosted, workflow and external
 * implementations. The resource and policy are snapshots captured when the
 * call begins; mutable editor/catalog state is never consulted during replay.
 */
export type CallableInvocationEnvelope<T = unknown> = {
  version: 1;
  identity: CallableInvocationIdentity;
  resource: CallableResourceReference;
  input: T;
  policy: CallableInvocationPolicySnapshot;
  startedAt: string;
  deadlineAt?: string;
  contextCapabilities?: readonly string[];
};

/** Canonical result used by actions, groups, workflows and recovery handlers. */
export type CallableSettlement<T = unknown> =
  | { status: 'succeeded'; output: T }
  | { status: 'failed'; error: CallableErrorEnvelope }
  | { status: 'cancelled'; reason?: string }
  | { status: 'timedOut'; error: CallableErrorEnvelope };

export type CallableRecoveryDecision<T = unknown> =
  | { action: 'propagate' }
  | { action: 'continue'; output?: T }
  | { action: 'retry'; delayMs?: number }
  | { action: 'replace'; output: T }
  | { action: 'route'; target: string; output?: T }
  | { action: 'compensate'; callable: CallableResourceReference; input?: unknown };

export const CallableInvocationIdentitySchema: z.ZodType<CallableInvocationIdentity> = z.object({
  executionId: z.string().trim().min(1),
  invocationId: z.string().trim().min(1),
  instanceId: z.string().trim().min(1),
  workflowId: z.string().trim().min(1),
  nodeId: z.string().trim().min(1),
  attempt: z.number().int().min(1),
  parentInvocationId: z.string().trim().min(1).optional(),
  causationId: z.string().trim().min(1).optional(),
  correlationId: z.string().trim().min(1).optional(),
  containerId: z.string().trim().min(1).optional(),
  slotId: z.string().trim().min(1).optional(),
}).strict();

const callableErrorEnvelopeBaseSchema = z.object({
  code: z.string().trim().min(1),
  message: z.string().trim().min(1),
  retryable: z.boolean(),
  sourceInstanceId: z.string().trim().min(1),
  phase: z.enum(['mapping', 'dispatch', 'execution', 'settlement', 'timeout', 'cancellation']),
  identity: CallableInvocationIdentitySchema,
  details: z.unknown().optional(),
}).strict();

export const CallableErrorEnvelopeSchema: z.ZodType<CallableErrorEnvelope> = callableErrorEnvelopeBaseSchema.extend({
  cause: z.lazy(() => CallableErrorEnvelopeSchema).optional(),
});

export const CallableInvocationPolicySnapshotSchema: z.ZodType<CallableInvocationPolicySnapshot> = z.object({
  timeoutMs: z.number().int().positive().nullable().optional(),
  retry: callableRetryPolicySchema.optional(),
  errorPolicy: callableErrorPolicySchema.optional(),
}).strict();

export const CallableInvocationEnvelopeSchema: z.ZodType<CallableInvocationEnvelope> = z.object({
  version: z.literal(1),
  identity: CallableInvocationIdentitySchema,
  resource: CallableResourceReferenceSchema,
  input: z.unknown(),
  policy: CallableInvocationPolicySnapshotSchema,
  startedAt: z.string().datetime({ offset: true }),
  deadlineAt: z.string().datetime({ offset: true }).optional(),
  contextCapabilities: z.array(z.string().trim().min(1)).optional(),
}).strict().superRefine((envelope, ctx) => {
  if (envelope.deadlineAt && Date.parse(envelope.deadlineAt) < Date.parse(envelope.startedAt)) {
    ctx.addIssue({ code: 'custom', path: ['deadlineAt'], message: 'deadlineAt must not precede startedAt' });
  }
});

export const CallableSettlementSchema: z.ZodType<CallableSettlement> = z.discriminatedUnion('status', [
  z.object({ status: z.literal('succeeded'), output: z.unknown() }).strict(),
  z.object({ status: z.literal('failed'), error: CallableErrorEnvelopeSchema }).strict(),
  z.object({ status: z.literal('cancelled'), reason: z.string().trim().min(1).optional() }).strict(),
  z.object({ status: z.literal('timedOut'), error: CallableErrorEnvelopeSchema }).strict(),
]);

export const CallableRecoveryDecisionSchema: z.ZodType<CallableRecoveryDecision> = z.discriminatedUnion('action', [
  z.object({ action: z.literal('propagate') }).strict(),
  z.object({ action: z.literal('continue'), output: z.unknown().optional() }).strict(),
  z.object({ action: z.literal('retry'), delayMs: z.number().int().nonnegative().optional() }).strict(),
  z.object({ action: z.literal('replace'), output: z.unknown() }).strict(),
  z.object({ action: z.literal('route'), target: z.string().trim().min(1), output: z.unknown().optional() }).strict(),
  z.object({ action: z.literal('compensate'), callable: CallableResourceReferenceSchema, input: z.unknown().optional() }).strict(),
]);
