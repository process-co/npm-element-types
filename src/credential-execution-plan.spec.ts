import { ElementCredentialExecutionPlanSchema, ElementCredentialLayoutSchema } from './credential-execution-plan';

const slots = [
  { id: 'root', providerId: 'mail', path: [] },
  { id: 'sender', providerId: 'mail', path: ['sender'] },
];
const bindings = [{ requirementId: 'req:root', slot: 'root' }, { requirementId: 'req:sender', slot: 'sender' }];
const plan = () => ({ v: 1, slots, bindings: bindings.map(binding => ({
  ...binding, credentialFern: 'mail::credential::[account]', credentialKind: 'oauth',
})) });

it('accepts a sealed layout and a shared account covering distinct same-provider slots', () => {
  expect(ElementCredentialLayoutSchema.parse({ slots, bindings })).toEqual({ slots, bindings });
  expect(ElementCredentialExecutionPlanSchema.parse(plan())).toEqual(plan());
});

it('accepts distinct OAuth and static accounts for separate slots', () => {
  const value = plan();
  value.bindings[1] = { ...value.bindings[1]!, credentialFern: 'mail::credential::[second]', credentialKind: 'static' };
  expect(ElementCredentialExecutionPlanSchema.parse(value)).toEqual(value);
});

it.each(['empty', 'missing', 'extra', 'duplicate requirement', 'duplicate slot', 'unknown slot'])(
  'rejects %s coverage in layout and execution plan', mutation => {
    const value = structuredClone({ slots, bindings });
    if (mutation === 'empty') { value.slots = []; value.bindings = []; }
    if (mutation === 'missing') value.bindings.pop();
    if (mutation === 'extra') value.bindings.push({ requirementId: 'extra', slot: 'extra' });
    if (mutation === 'duplicate requirement') value.bindings[1]!.requirementId = value.bindings[0]!.requirementId;
    if (mutation === 'duplicate slot') value.bindings[1]!.slot = value.bindings[0]!.slot;
    if (mutation === 'unknown slot') value.bindings[1]!.slot = 'other';
    expect(ElementCredentialLayoutSchema.safeParse(value).success).toBe(false);
    expect(ElementCredentialExecutionPlanSchema.safeParse({ v: 1, ...value,
      bindings: value.bindings.map(binding => ({ ...binding, credentialFern: 'mail::credential::[account]', credentialKind: 'static' })),
    }).success).toBe(false);
  },
);

it('rejects disagreement about the kind of one shared credential', () => {
  const value = plan(); value.bindings[1]!.credentialKind = 'static';
  expect(ElementCredentialExecutionPlanSchema.safeParse(value).success).toBe(false);
});

it.each(['mail::credential::account', 'mail::credential::[]', ' mail::credential::[account]', 'mail::credential::[account] ', 'mail::credential::[two accounts]', 'mail::action:send'])(
  'rejects noncanonical credential FERN %j', credentialFern => {
    const value = plan(); value.bindings[0]!.credentialFern = credentialFern;
    expect(ElementCredentialExecutionPlanSchema.safeParse(value).success).toBe(false);
  },
);

it('rejects missing kind/version, unsupported version, or embedded authority/material', () => {
  const value = plan();
  const { credentialKind: _kind, ...withoutKind } = value.bindings[0]!;
  const { v: _version, ...withoutVersion } = value;
  for (const candidate of [withoutVersion, { ...value, v: 2 }, { ...value, token: 'forbidden' },
    { ...value, bindings: [withoutKind, value.bindings[1]] },
    { ...value, bindings: [{ ...value.bindings[0], data: {} }, value.bindings[1]] }]) {
    expect(ElementCredentialExecutionPlanSchema.safeParse(candidate).success).toBe(false);
  }
  expect(ElementCredentialLayoutSchema.safeParse({ slots, bindings: value.bindings }).success).toBe(false);
});

it('bounds requirement identities and rejects noncanonical whitespace', () => {
  for (const requirementId of ['', ' ', 'x'.repeat(513), ' req:sender ', ' req:root ']) {
    expect(ElementCredentialLayoutSchema.safeParse({ slots, bindings: [{ ...bindings[0], requirementId }, bindings[1]] }).success).toBe(false);
  }
  const many = Array.from({ length: 65 }, (_, i) => ({ id: `slot${i}`, providerId: 'mail', path: [`app${i}`] }));
  expect(ElementCredentialLayoutSchema.safeParse({ slots: many, bindings: many.map(slot => ({ slot: slot.id, requirementId: slot.id })) }).success).toBe(false);
});
