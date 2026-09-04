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
    /**
     * Observable effect produced by this action. The Process host carries this
     * through policy, execution, UI, and settlement evidence so a provider
     * draft can never be presented as a committed external action.
     */
    effect?: ActionCapabilityEffect;
};

export type ActionCapabilityEffect = {
    disposition: 'observe' | 'prepare' | 'provider-draft' | 'commit';
    reversibility: 'not-applicable' | 'reversible' | 'compensatable' | 'irreversible';
    settlement: 'immediate' | 'provider-acknowledged' | 'externally-observed';
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

const CONSERVATIVE_EFFECT: ActionCapabilityEffect = {
    disposition: 'commit',
    reversibility: 'irreversible',
    settlement: 'externally-observed',
};

const EMAIL_EFFECTS: Record<string, ActionCapabilityEffect> = {
    'communication.email.account.inspect/v1': observedEffect(),
    'communication.email.search/v1': observedEffect(),
    'communication.email.thread.read/v1': observedEffect(),
    'communication.email.attachment.read/v1': observedEffect(),
    'communication.email.analytics.read/v1': observedEffect(),
    'communication.email.draft.compose/v1': providerDraftEffect(),
    'communication.email.reply.compose/v1': providerDraftEffect(),
    'communication.email.forward.compose/v1': providerDraftEffect(),
    'communication.email.send/v1': CONSERVATIVE_EFFECT,
};

function observedEffect(): ActionCapabilityEffect {
    return {
        disposition: 'observe',
        reversibility: 'not-applicable',
        settlement: 'immediate',
    };
}

function providerDraftEffect(): ActionCapabilityEffect {
    return {
        disposition: 'provider-draft',
        reversibility: 'reversible',
        settlement: 'provider-acknowledged',
    };
}

function sameEffect(left: ActionCapabilityEffect, right: ActionCapabilityEffect): boolean {
    return left.disposition === right.disposition &&
        left.reversibility === right.reversibility &&
        left.settlement === right.settlement;
}

function readOptionalEffect(
    value: unknown,
    capability: string,
): ActionCapabilityEffect | undefined {
    if (value === undefined) return undefined;
    if (!isRecord(value)) {
        throw new Error(`Action capability claim ${capability} has an invalid effect declaration`);
    }
    const dispositions = new Set(['observe', 'prepare', 'provider-draft', 'commit']);
    const reversibilities = new Set(['not-applicable', 'reversible', 'compensatable', 'irreversible']);
    const settlements = new Set(['immediate', 'provider-acknowledged', 'externally-observed']);
    if (
        typeof value.disposition !== 'string' || !dispositions.has(value.disposition) ||
        typeof value.reversibility !== 'string' || !reversibilities.has(value.reversibility) ||
        typeof value.settlement !== 'string' || !settlements.has(value.settlement)
    ) {
        throw new Error(`Action capability claim ${capability} has an invalid effect declaration`);
    }
    return value as ActionCapabilityEffect;
}

/**
 * Resolve a claim to explicit effect semantics. Well-known capabilities have
 * canonical semantics that an element cannot weaken; unknown extensions use
 * their declaration or the conservative irreversible-commit default.
 */
export function resolveActionCapabilityEffect(
    claim: Pick<ActionCapabilityClaim, 'capability' | 'effect'>,
): ActionCapabilityEffect {
    const canonical = EMAIL_EFFECTS[claim.capability];
    if (canonical && claim.effect && !sameEffect(canonical, claim.effect)) {
        throw new Error(
            `Action capability claim ${claim.capability} conflicts with its canonical effect`,
        );
    }
    return canonical ?? claim.effect ?? CONSERVATIVE_EFFECT;
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
        const effect = readOptionalEffect(entry.effect, entry.capability);
        const claim: ActionCapabilityClaim = {
            capability: entry.capability,
            ...(inputContract === undefined ? {} : { inputContract }),
            ...(features === undefined ? {} : { features }),
            ...(requiredScopes === undefined ? {} : { requiredScopes }),
            ...(identity === undefined ? {} : { identity }),
            ...(effect === undefined ? {} : { effect }),
        };
        resolveActionCapabilityEffect(claim);
        return claim;
    });

    const capabilityIds = claims.map((claim) => claim.capability);
    if (new Set(capabilityIds).size !== capabilityIds.length) {
        throw new Error('An action may only claim a canonical capability once');
    }
    return claims;
}
