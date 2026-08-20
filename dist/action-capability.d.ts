/**
 * A provider-neutral operation implemented by a concrete element action.
 *
 * Capability identifiers are deliberately versioned. An agent may be granted
 * the logical capability while the runtime resolves an eligible concrete
 * action from the organization build registry and its available connections.
 */
export type ActionCapabilityClaim = {
    capability: string;
    /** Optional shared input/UI contract implemented by the action. */
    inputContract?: string;
    /** Provider-specific features available from this concrete action. */
    features?: readonly string[];
    /** OAuth/API scopes the selected connection must satisfy. */
    requiredScopes?: readonly string[];
    /** Paths used to compare the connection identity with the requested actor. */
    identity?: {
        kind: string;
        addressPath?: string;
        aliasesPath?: string;
        organizationPath?: string;
        tenantPath?: string;
    };
};
export type ActionCapabilityClaims = readonly ActionCapabilityClaim[];
/** Validate and normalize untrusted action capability metadata before ingest. */
export declare function parseActionCapabilityClaims(value: unknown): ActionCapabilityClaims;
//# sourceMappingURL=action-capability.d.ts.map