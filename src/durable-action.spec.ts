import {
  DurableActionDefinitionsSchema,
  parseDurableActionDefinitions,
} from './durable-action';

const references = {
  actions: {
    createDraft: { surfaceKeys: ['compose'] },
    sendDraft: { surfaceKeys: ['receipt'] },
    readDraft: {},
    postMessage: { surfaceKeys: ['message'] },
    readMessage: {},
    uploadFile: { surfaceKeys: ['file'] },
    readFile: {},
  },
};

const emailDefinition = {
  schemaVersion: 1,
  key: 'email-compose',
  contract: 'communication.email.compose/v1',
  initial: 'preparing',
  states: {
    preparing: {
      lifecycle: 'preparing',
      on: [{ event: 'START', target: 'proposed', effects: ['create-draft'] }],
    },
    proposed: {
      lifecycle: 'proposed',
      on: [
        { event: 'DRAFT_CREATED', target: 'proposed' },
        { event: 'CREATE_FAILED', target: 'failed' },
        { event: 'SEND', target: 'executing', effects: ['send-draft'] },
        { event: 'EXTERNAL_CHANGE', target: 'reconciling', effects: ['read-draft'] },
        { event: 'CANCEL', target: 'cancelled' },
      ],
    },
    executing: {
      lifecycle: 'executing',
      on: [
        { event: 'SEND_SETTLED', target: 'observing' },
        { event: 'SEND_FAILED', target: 'failed' },
        { event: 'SEND_UNKNOWN', target: 'reconciling', effects: ['read-draft'] },
      ],
    },
    observing: {
      lifecycle: 'observing',
      on: [{ event: 'EXTERNAL_CHANGE', target: 'reconciling', effects: ['read-draft'] }],
    },
    reconciling: {
      lifecycle: 'reconciling',
      on: [
        { event: 'RECONCILED_SENT', target: 'succeeded' },
        { event: 'RECONCILED_DRAFT', target: 'proposed' },
        { event: 'RECONCILE_FAILED', target: 'unknown' },
      ],
    },
    unknown: {
      lifecycle: 'unknown',
      on: [{ event: 'RETRY_RECONCILE', target: 'reconciling', effects: ['read-draft'] }],
    },
    succeeded: { lifecycle: 'succeeded', final: true },
    failed: { lifecycle: 'failed', final: true },
    cancelled: { lifecycle: 'cancelled', final: true },
  },
  effects: {
    'create-draft': {
      binding: { kind: 'local-action', actionKey: 'createDraft' },
      settlementEvents: { succeeded: 'DRAFT_CREATED', failed: 'CREATE_FAILED' },
    },
    'send-draft': {
      binding: { kind: 'local-action', actionKey: 'sendDraft' },
      settlementEvents: {
        succeeded: 'SEND_SETTLED',
        failed: 'SEND_FAILED',
        timedOut: 'SEND_UNKNOWN',
      },
    },
    'read-draft': {
      binding: { kind: 'local-action', actionKey: 'readDraft' },
      settlementEvents: {
        succeeded: ['RECONCILED_SENT', 'RECONCILED_DRAFT'],
        failed: 'RECONCILE_FAILED',
      },
    },
  },
  commands: {
    send: { intent: 'execute', event: 'SEND', allowedStates: ['proposed'] },
    cancel: { intent: 'cancel', event: 'CANCEL', allowedStates: ['proposed'] },
  },
  timers: {
    'retry-reconciliation': {
      delayMs: 30_000,
      event: 'RETRY_RECONCILE',
      startInStates: ['unknown'],
      cancelInStates: ['succeeded', 'failed', 'cancelled'],
    },
  },
  resources: {
    draft: {
      kind: 'communication.email.draft/v1',
      mutableExternally: true,
      identity: {
        providerInstallationIdPath: 'connection.installationId',
        accountIdPath: 'connection.accountId',
        resourceIdPath: 'draft.id',
        parentResourceIdPath: 'draft.threadId',
        versionPath: 'draft.changeKey',
      },
      retainAfterTerminalSeconds: 86_400,
    },
  },
  observations: {
    'draft-changed': {
      profile: 'communication.email.observe/v1',
      event: 'communication.email.draft.changed/v1',
      resource: 'draft',
      machineEvent: 'EXTERNAL_CHANGE',
      evidence: 'hint',
      reconcile: 'always',
    },
  },
  reconciliation: {
    'read-current-draft': {
      resource: 'draft',
      effect: 'read-draft',
      triggers: ['observation', 'unknown-settlement', 'resume'],
      freshnessSeconds: 10,
      maxAttempts: 8,
      backoff: { kind: 'exponential', initialDelayMs: 1_000, maxDelayMs: 60_000 },
    },
  },
  presentations: {
    compose: {
      states: ['proposed', 'executing', 'observing', 'reconciling', 'unknown'],
      surface: { actionKey: 'createDraft', surfaceKey: 'compose' },
      mode: 'proposal',
      commands: ['send', 'cancel'],
    },
    receipt: {
      states: ['succeeded', 'failed', 'cancelled'],
      surface: { actionKey: 'sendDraft', surfaceKey: 'receipt' },
      mode: 'receipt',
    },
  },
};

function cloneDefinition(): any {
  return structuredClone(emailDefinition);
}

describe('Durable Action definitions', () => {
  it('validates a provider-owned email draft lifecycle', () => {
    const definitions = parseDurableActionDefinitions(
      { 'email-compose': emailDefinition },
      references,
    );

    expect(definitions['email-compose']?.resources.draft?.mutableExternally).toBe(true);
    expect(definitions['email-compose']?.presentations.receipt?.mode).toBe('receipt');
    expect(definitions['email-compose']?.effects['read-draft']?.settlementEvents.succeeded).toEqual([
      'RECONCILED_SENT',
      'RECONCILED_DRAFT',
    ]);
  });

  it('validates Process-owned preparation for Slack without an email-style draft', () => {
    const slack = cloneDefinition();
    slack.key = 'slack-message';
    slack.contract = 'communication.slack.message/v1';
    slack.states.preparing.on = [{ event: 'START', target: 'proposed' }];
    slack.states.proposed.on = [
      { event: 'SEND', target: 'executing', effects: ['send-draft'] },
      { event: 'CANCEL', target: 'cancelled' },
    ];
    delete slack.effects['create-draft'];
    slack.effects['send-draft'].binding = { kind: 'local-action', actionKey: 'postMessage' };
    slack.effects['read-draft'].binding = { kind: 'local-action', actionKey: 'readMessage' };
    slack.resources.draft.kind = 'communication.slack.message/v1';
    slack.resources.draft.identity.accountIdPath = 'connection.workspaceId';
    slack.resources.draft.identity.resourceIdPath = 'message.ts';
    slack.observations['draft-changed'].profile = 'communication.slack.observe/v1';
    slack.observations['draft-changed'].event = 'communication.slack.message.changed/v1';
    slack.presentations.compose.surface = { actionKey: 'postMessage', surfaceKey: 'message' };
    slack.presentations.receipt.surface = { actionKey: 'postMessage', surfaceKey: 'message' };

    const definitions = parseDurableActionDefinitions({ 'slack-message': slack }, references);
    expect(definitions['slack-message']?.states.preparing?.on[0]?.effects).toEqual([]);
    expect(definitions['slack-message']?.effects['create-draft']).toBeUndefined();
    expect(definitions['slack-message']?.effects['send-draft']?.binding).toEqual({
      kind: 'local-action',
      actionKey: 'postMessage',
    });
    expect(definitions['slack-message']?.states.proposed?.on.some((transition) => (
      transition.event === 'EXTERNAL_CHANGE'
    ))).toBe(false);
  });

  it('validates a version-aware Box or OneDrive file lifecycle', () => {
    const file = cloneDefinition();
    file.key = 'file-operation';
    file.contract = 'document.file.manage/v1';
    file.effects['create-draft'].binding = { kind: 'local-action', actionKey: 'uploadFile' };
    file.effects['send-draft'].binding = { kind: 'local-action', actionKey: 'uploadFile' };
    file.effects['read-draft'].binding = { kind: 'local-action', actionKey: 'readFile' };
    file.resources.draft.kind = 'document.file/v1';
    file.resources.draft.identity.containerIdPath = 'file.driveOrFolderId';
    file.resources.draft.identity.resourceIdPath = 'file.id';
    file.resources.draft.identity.versionPath = 'file.etag';
    file.observations['draft-changed'].profile = 'document.file.observe/v1';
    file.observations['draft-changed'].event = 'document.file.changed/v1';
    file.presentations.compose.surface = { actionKey: 'uploadFile', surfaceKey: 'file' };
    file.presentations.receipt.surface = { actionKey: 'uploadFile', surfaceKey: 'file' };

    expect(() => parseDurableActionDefinitions({ 'file-operation': file }, references)).not.toThrow();
  });

  it('rejects unknown local actions and surfaces', () => {
    const unknownAction = cloneDefinition();
    unknownAction.effects['create-draft'].binding = { kind: 'local-action', actionKey: 'missing' };
    expect(() => parseDurableActionDefinitions({ 'email-compose': unknownAction }, references))
      .toThrow('references unknown action missing');

    const unknownSurface = cloneDefinition();
    unknownSurface.presentations.compose.surface.surfaceKey = 'missing';
    expect(() => parseDurableActionDefinitions({ 'email-compose': unknownSurface }, references))
      .toThrow('references unknown surface createDraft.missing');
  });

  it('requires externally mutable resources to be observable or reconcilable', () => {
    const unobserved = cloneDefinition();
    unobserved.observations = {};
    unobserved.reconciliation = {};

    const result = DurableActionDefinitionsSchema.safeParse({ 'email-compose': unobserved });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) =>
      issue.message.includes('requires observation or reconciliation'))).toBe(true);
  });

  it('requires hint observations to declare an observation-triggered reconciler', () => {
    const hintOnly = cloneDefinition();
    hintOnly.reconciliation = {};

    const missing = DurableActionDefinitionsSchema.safeParse({ 'email-compose': hintOnly });
    expect(missing.success).toBe(false);
    expect(missing.error?.issues.some((issue) =>
      issue.message.includes('Hint observation draft-changed requires reconciliation'))).toBe(true);

    const timerOnly = cloneDefinition();
    timerOnly.reconciliation['read-current-draft'].triggers = ['timer'];
    const unusedTrigger = DurableActionDefinitionsSchema.safeParse({ 'email-compose': timerOnly });
    expect(unusedTrigger.success).toBe(false);
    expect(unusedTrigger.error?.issues.some((issue) =>
      issue.message.includes('Hint observation draft-changed requires reconciliation'))).toBe(true);
  });

  it('requires command allowed states to handle the command event', () => {
    const unhandled = cloneDefinition();
    unhandled.commands.send.allowedStates = ['proposed', 'observing'];

    const result = DurableActionDefinitionsSchema.safeParse({ 'email-compose': unhandled });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) =>
      issue.message.includes('Command send event SEND has no transition in state observing'))).toBe(true);
  });

  it('requires provider installation, account, and resource correlation identity', () => {
    const ambiguous = cloneDefinition();
    delete ambiguous.resources.draft.identity.accountIdPath;

    const result = DurableActionDefinitionsSchema.safeParse({ 'email-compose': ambiguous });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) =>
      issue.path.join('.') === 'email-compose.resources.draft.identity.accountIdPath')).toBe(true);
  });

  it('rejects transitions that reference undeclared effects', () => {
    const unknownEffect = cloneDefinition();
    unknownEffect.states.preparing.on[0].effects = ['missing-effect'];

    const result = DurableActionDefinitionsSchema.safeParse({ 'email-compose': unknownEffect });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) =>
      issue.message.includes('references unknown effect missing-effect'))).toBe(true);
  });

  it('prevents hint observations from claiming terminal settlement directly', () => {
    const unsafe = cloneDefinition();
    unsafe.states.observing.on[0] = { event: 'EXTERNAL_CHANGE', target: 'succeeded' };

    const result = DurableActionDefinitionsSchema.safeParse({ 'email-compose': unsafe });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) =>
      issue.message.includes('cannot transition directly to final state'))).toBe(true);
  });

  it('keeps receipt projections immutable and final', () => {
    const mutableReceipt = cloneDefinition();
    mutableReceipt.presentations.receipt.commands = ['send'];

    const result = DurableActionDefinitionsSchema.safeParse({ 'email-compose': mutableReceipt });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.message.includes('cannot expose commands'))).toBe(true);
  });

  it('retains an authored callable selector in a complete lifecycle definition', () => {
    const authored = cloneDefinition();
    authored.effects['send-draft'].binding = {
      kind: 'authored-callable', definitionFern: 'outlook@main::action:sendDraft',
    };
    const definitions = parseDurableActionDefinitions({ 'email-compose': authored }, references);
    expect(definitions['email-compose']?.effects['send-draft']?.binding).toEqual(
      authored.effects['send-draft'].binding,
    );
  });

  it('rejects a draft selector masquerading as an executable pinned callable', () => {
    const unpinned = cloneDefinition();
    unpinned.effects['create-draft'].binding = {
      kind: 'pinned-callable',
      resource: {
        stableId: 'email.create-draft',
        implementationKind: 'action',
        scope: 'team',
        version: { mode: 'draft', editingSessionId: 'editing-1' },
      },
    };

    const result = DurableActionDefinitionsSchema.safeParse({ 'email-compose': unpinned });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.message.includes('immutable pinned version'))).toBe(true);
  });
});
