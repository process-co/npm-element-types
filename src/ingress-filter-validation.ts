import type { IngressHMACVerifyFilter } from './ingress-filters';

/** Cold preparation errors retain the same field path in every host. */
export class IngressFiltersValidationError extends Error {
  constructor(message: string, public readonly path: string) {
    super(`ingressFilters[${path}]: ${message}`);
    this.name = 'IngressFiltersValidationError';
  }
}

/** One canonical HMAC policy for restricted hooks and publication. No secrets are resolved here. */
export function normalizeIngressHmacFilter(
  config: Record<string, unknown>, index: number,
): IngressHMACVerifyFilter {
  const algorithm = String(config.algorithm ?? '');
  if (!['sha1', 'sha256', 'sha512'].includes(algorithm)) {
    throw new IngressFiltersValidationError('hmac_verify.config.algorithm must be sha1|sha256|sha512', `${index}.config.algorithm`);
  }
  const signatureEncoding = config.signatureEncoding;
  if (signatureEncoding !== undefined && signatureEncoding !== 'hex' && signatureEncoding !== 'base64') {
    throw new IngressFiltersValidationError('hmac_verify.config.signatureEncoding must be hex|base64', `${index}.config.signatureEncoding`);
  }
  const signatureHeader = requiredText(config, 'signatureHeader', index);
  const secretRef = requiredText(config, 'secretRef', index);
  const expectedHeaders = normalizeExpectedHeaders(config.expectedHeaders, index);
  return { type: 'hmac_verify', config: {
    algorithm: algorithm as IngressHMACVerifyFilter['config']['algorithm'], signatureHeader, secretRef,
    ...(signatureEncoding !== undefined ? { signatureEncoding } : {}),
    ...(typeof config.signaturePrefix === 'string' ? { signaturePrefix: config.signaturePrefix } : {}),
    ...(expectedHeaders !== undefined ? { expectedHeaders } : {}),
  } };
}

function requiredText(config: Record<string, unknown>, key: 'signatureHeader' | 'secretRef', index: number): string {
  const value = config[key];
  if (typeof value !== 'string' || !value.length) {
    throw new IngressFiltersValidationError(`hmac_verify.config.${key} is required`, `${index}.config.${key}`);
  }
  return value;
}

function normalizeExpectedHeaders(value: unknown, index: number): Record<string, string> | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalidHeaders(index);
  const entries = Object.entries(value);
  if (entries.length > 16 || new Set(entries.map(([key]) => key.toLowerCase())).size !== entries.length
    || entries.some(([key, text]) => !/^[a-zA-Z0-9!#$%&'*+.^_`|~-]+$/u.test(key)
      || typeof text !== 'string' || !text || text.length > 8192 || /[\r\n\0]/u.test(text))) return invalidHeaders(index);
  return Object.fromEntries(entries) as Record<string, string>;
}

function invalidHeaders(index: number): never {
  throw new IngressFiltersValidationError('hmac_verify.config.expectedHeaders must contain bounded exact header values', `${index}.config.expectedHeaders`);
}
