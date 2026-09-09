import { parseActionCapabilityClaims, type ActionCapabilityClaims } from './action-capability';

/** Options use the shared capability contract, independently of the element's run method. */
export function parseOptionsCapabilityClaims(value: unknown): ActionCapabilityClaims {
  const claims = parseActionCapabilityClaims(value);
  if (!claims.length || claims.some(claim => claim.effect?.disposition !== 'observe')) {
    throw new Error('Options capabilities must explicitly declare observational effects');
  }
  return claims;
}
