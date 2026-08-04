import {
  CallableInvocationEnvelopeSchema,
  CallableInvocationDefinitionSchema,
  CallableRecoveryDecisionSchema,
  CallableSettlementSchema,
  type CallableInvocationDefinition,
} from './callable-resource';

const invocation = (): CallableInvocationDefinition => ({
  version: 1,
  instanceId: 'node-1',
  resource: {
    stableId: 'resource-1',
    implementationKind: 'action',
    scope: 'project',
    version: { mode: 'pinned', versionId: 'version-1', versionNumber: 1 },
  },
  inputMapping: {
    version: 1,
    strategy: 'selected',
    sources: [{ id: 'caller', label: 'Caller' }],
    rules: [{ id: 'name', sourceId: 'caller', sourceExpression: '$.name', destinationPath: '$.name' }],
  },
  retry: { maxAttempts: 3, backoff: 'exponential', initialDelayMs: 100, maxDelayMs: 1_000 },
});

const identity = {
  executionId: 'execution-1',
  invocationId: 'invocation-1',
  instanceId: 'node-1',
  workflowId: 'workflow-1',
  nodeId: 'node-1',
  attempt: 1,
  containerId: 'parallel-1',
  slotId: 'left',
};

describe('CallableInvocationDefinitionSchema', () => {
  it('accepts a pinned invocation with independent mapping and execution policy', () => {
    expect(CallableInvocationDefinitionSchema.parse(invocation())).toEqual(invocation());
  });

  it('rejects mapping rules that reference a source outside the interface', () => {
    const candidate = invocation();
    candidate.inputMapping = {
      ...candidate.inputMapping!,
      rules: [{ id: 'bad', sourceId: 'missing', sourceExpression: '$.name', destinationPath: '$.name' }],
    };
    const result = CallableInvocationDefinitionSchema.safeParse(candidate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('Unknown projection source'))).toBe(true);
    }
  });

  it('rejects mutable selectors and incoherent retry timing', () => {
    const candidate = {
      ...invocation(),
      resource: { ...invocation().resource, version: { mode: 'latest' } },
      retry: { maxAttempts: 3, initialDelayMs: 2_000, maxDelayMs: 100 },
    };
    expect(CallableInvocationDefinitionSchema.safeParse(candidate).success).toBe(false);
  });

  it('requires a key expression for keyed projection writes', () => {
    const candidate = invocation();
    candidate.inputMapping = {
      ...candidate.inputMapping!,
      rules: [{
        id: 'keyed', sourceId: 'caller', sourceExpression: '$.customer',
        destinationPath: '$.customers', writePolicy: 'keyed',
      }],
    };
    expect(CallableInvocationDefinitionSchema.safeParse(candidate).success).toBe(false);
  });
});

describe('callable runtime envelopes', () => {
  it('captures an immutable callable and policy snapshot at the invocation boundary', () => {
    const envelope = {
      version: 1,
      identity,
      resource: invocation().resource,
      input: { customerId: 'customer-1' },
      policy: { timeoutMs: 30_000, retry: { maxAttempts: 2, backoff: 'fixed' } },
      startedAt: '2026-08-04T01:00:00.000Z',
      deadlineAt: '2026-08-04T01:00:30.000Z',
      contextCapabilities: ['workflow.db:read'],
    };
    expect(CallableInvocationEnvelopeSchema.parse(envelope)).toEqual(envelope);
  });

  it('rejects invalid attempts and deadlines that precede invocation start', () => {
    expect(CallableInvocationEnvelopeSchema.safeParse({
      version: 1,
      identity: { ...identity, attempt: 0 },
      resource: invocation().resource,
      input: {},
      policy: {},
      startedAt: '2026-08-04T01:00:00.000Z',
      deadlineAt: '2026-08-04T00:59:59.000Z',
    }).success).toBe(false);
  });

  it('validates nested canonical failures with invocation and slot identity', () => {
    const error = {
      code: 'HOST_FAILED',
      message: 'Hosted action failed',
      retryable: true,
      sourceInstanceId: 'node-1',
      phase: 'execution' as const,
      identity,
      cause: {
        code: 'UPSTREAM_TIMEOUT',
        message: 'Upstream timed out',
        retryable: true,
        sourceInstanceId: 'node-1',
        phase: 'timeout' as const,
        identity,
      },
    };
    expect(CallableSettlementSchema.parse({ status: 'failed', error })).toEqual({
      status: 'failed',
      error,
    });
  });

  it('supports replacement and compensation as typed recovery decisions', () => {
    expect(CallableRecoveryDecisionSchema.parse({
      action: 'replace',
      output: { customerId: 'fallback' },
    })).toEqual({ action: 'replace', output: { customerId: 'fallback' } });
    expect(CallableRecoveryDecisionSchema.parse({
      action: 'compensate',
      callable: invocation().resource,
      input: { chargeId: 'charge-1' },
    })).toEqual({
      action: 'compensate',
      callable: invocation().resource,
      input: { chargeId: 'charge-1' },
    });
  });
});
