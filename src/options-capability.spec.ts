import { parseOptionsCapabilityClaims } from './options-capability';

const observed = { capability: 'calendar.events.read/v1', requiredScopes: ['Calendars.Read'],
  effect: { disposition: 'observe', reversibility: 'not-applicable', settlement: 'immediate' } };
it('preserves options-specific scopes and effects', () => {
  expect(parseOptionsCapabilityClaims([observed])).toEqual([expect.objectContaining(observed)]);
});
it.each([[], undefined, [{ capability: 'calendar.events.read/v1' }],
  [{ capability: 'communication.email.send/v1' }],
  [{ ...observed, effect: { ...observed.effect, disposition: 'commit' } }]])(
  'rejects missing or non-observational options claims %j', value => {
    expect(() => parseOptionsCapabilityClaims(value)).toThrow();
  });
