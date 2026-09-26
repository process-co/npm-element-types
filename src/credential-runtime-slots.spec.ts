import {
  ElementCredentialRuntimeBindingSchema,
  ElementCredentialSlotSchema,
  ElementCredentialSlotsSchema,
} from './credential-runtime-slots';

const slot = (id: string, path: string[] = []) => ({ id, providerId: 'microsoft', path });

describe('element credential runtime slots', () => {
  it('represents root auth explicitly and distinguishes two accounts of the same provider', () => {
    const slots = [slot('root'), slot('sender', ['outlook']), slot('recipient', ['otherOutlook'])];
    expect(ElementCredentialSlotsSchema.parse(slots)).toEqual(slots);
    expect(ElementCredentialRuntimeBindingSchema.parse({ kind: 'element-auth', slot: 'sender' }))
      .toEqual({ kind: 'element-auth', slot: 'sender' });
  });

  it('allows no credential slots without inventing a root binding', () => {
    expect(ElementCredentialSlotsSchema.parse([])).toEqual([]);
    expect(ElementCredentialSlotSchema.safeParse({ id: 'root', providerId: 'microsoft' }).success).toBe(false);
  });

  it.each([
    [slot('same', ['one']), slot('same', ['two'])],
    [slot('one', ['same']), slot('two', ['same'])],
    [slot('one'), slot('two')],
  ])('rejects duplicate slot IDs or target paths: %j', (...slots) => {
    expect(ElementCredentialSlotsSchema.safeParse(slots).success).toBe(false);
  });

  it.each(['__proto__', 'constructor', 'prototype', '$auth', 'app.$auth', '', ' app', 'app/child'])
  ('rejects unsafe or nonliteral target property %j', property => {
    expect(ElementCredentialSlotSchema.safeParse(slot('sender', [property])).success).toBe(false);
    expect(ElementCredentialSlotSchema.safeParse(slot('sender', ['app', property])).success).toBe(false);
  });

  it('rejects unknown account or credential material fields', () => {
    expect(ElementCredentialSlotSchema.safeParse({ ...slot('sender'), credentialFern: 'credential:other' }).success).toBe(false);
    expect(ElementCredentialRuntimeBindingSchema.safeParse({ kind: 'element-auth', slot: 'sender', accountId: 'other' }).success).toBe(false);
    expect(ElementCredentialRuntimeBindingSchema.safeParse({ kind: 'provider', slot: 'sender' }).success).toBe(false);
  });

  it('bounds authored inventories and nested paths', () => {
    expect(ElementCredentialSlotsSchema.safeParse(Array.from({ length: 65 }, (_, index) => slot(`slot${index}`, [`app${index}`]))).success).toBe(false);
    expect(ElementCredentialSlotSchema.safeParse(slot('sender', Array(9).fill('app'))).success).toBe(false);
  });
});
