import type { IngressHMACVerifyFilter } from './ingress-filters';
/** Cold preparation errors retain the same field path in every host. */
export declare class IngressFiltersValidationError extends Error {
    readonly path: string;
    constructor(message: string, path: string);
}
/** One canonical HMAC policy for restricted hooks and publication. No secrets are resolved here. */
export declare function normalizeIngressHmacFilter(config: Record<string, unknown>, index: number): IngressHMACVerifyFilter;
//# sourceMappingURL=ingress-filter-validation.d.ts.map