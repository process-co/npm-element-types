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

const VERSIONED_ID = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\/v[1-9][0-9]*$/;
const SAFE_TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/;
const SAFE_PATH = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const MAX_CLAIMS = 32;
const MAX_LIST_ITEMS = 64;

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readOptionalVersionedId(value: unknown, field: string): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== 'string' || !VERSIONED_ID.test(value)) {
        throw new Error(`${field} must be a versioned identifier`);
    }
    return value;
}

function readStringList(value: unknown, field: string): string[] | undefined {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length > MAX_LIST_ITEMS) {
        throw new Error(`${field} must be an array with at most ${MAX_LIST_ITEMS} entries`);
    }
    const entries = value.map((entry) => {
        if (typeof entry !== 'string' || !SAFE_TOKEN.test(entry) || entry.length > 300) {
            throw new Error(`${field} contains an invalid entry`);
        }
        return entry;
    });
    if (new Set(entries).size !== entries.length) {
        throw new Error(`${field} entries must be unique`);
    }
    return entries;
}

function readOptionalPath(value: unknown, field: string): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== 'string' || !SAFE_PATH.test(value) || value.includes('..')) {
        throw new Error(`${field} must be a safe connection metadata path`);
    }
    return value;
}

/** Validate and normalize untrusted action capability metadata before ingest. */
export function parseActionCapabilityClaims(value: unknown): ActionCapabilityClaims {
    if (!Array.isArray(value) || value.length > MAX_CLAIMS) {
        throw new Error(`Action capability claims must be an array with at most ${MAX_CLAIMS} entries`);
    }

    const claims = value.map((entry, index): ActionCapabilityClaim => {
        if (!isRecord(entry)) throw new Error(`Action capability claim ${index} must be an object`);
        if (typeof entry.capability !== 'string' || !VERSIONED_ID.test(entry.capability)) {
            throw new Error(`Action capability claim ${index} must declare a versioned capability`);
        }

        let identity: ActionCapabilityClaim['identity'];
        if (entry.identity !== undefined) {
            if (!isRecord(entry.identity) || typeof entry.identity.kind !== 'string' || !SAFE_TOKEN.test(entry.identity.kind)) {
                throw new Error(`Action capability claim ${entry.capability} has an invalid identity declaration`);
            }
            const addressPath = readOptionalPath(entry.identity.addressPath, 'identity.addressPath');
            const aliasesPath = readOptionalPath(entry.identity.aliasesPath, 'identity.aliasesPath');
            const organizationPath = readOptionalPath(entry.identity.organizationPath, 'identity.organizationPath');
            const tenantPath = readOptionalPath(entry.identity.tenantPath, 'identity.tenantPath');
            identity = {
                kind: entry.identity.kind,
                ...(addressPath === undefined ? {} : { addressPath }),
                ...(aliasesPath === undefined ? {} : { aliasesPath }),
                ...(organizationPath === undefined ? {} : { organizationPath }),
                ...(tenantPath === undefined ? {} : { tenantPath }),
            };
        }

        const inputContract = readOptionalVersionedId(entry.inputContract, 'inputContract');
        const features = readStringList(entry.features, 'features');
        const requiredScopes = readStringList(entry.requiredScopes, 'requiredScopes');
        return {
            capability: entry.capability,
            ...(inputContract === undefined ? {} : { inputContract }),
            ...(features === undefined ? {} : { features }),
            ...(requiredScopes === undefined ? {} : { requiredScopes }),
            ...(identity === undefined ? {} : { identity }),
        };
    });

    const capabilityIds = claims.map((claim) => claim.capability);
    if (new Set(capabilityIds).size !== capabilityIds.length) {
        throw new Error('An action may only claim a canonical capability once');
    }
    return claims;
}
