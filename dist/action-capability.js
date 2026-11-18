"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveActionCapabilityEffect = resolveActionCapabilityEffect;
exports.parseActionCapabilityClaims = parseActionCapabilityClaims;
const VERSIONED_ID = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+\/v[1-9][0-9]*$/;
const SAFE_TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/;
const SAFE_PATH = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const MAX_CLAIMS = 32;
const MAX_LIST_ITEMS = 64;
function isRecord(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function readOptionalVersionedId(value, field) {
    if (value === undefined)
        return undefined;
    if (typeof value !== 'string' || !VERSIONED_ID.test(value)) {
        throw new Error(`${field} must be a versioned identifier`);
    }
    return value;
}
function readStringList(value, field) {
    if (value === undefined)
        return undefined;
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
function readOptionalPath(value, field) {
    if (value === undefined)
        return undefined;
    if (typeof value !== 'string' || !SAFE_PATH.test(value) || value.includes('..')) {
        throw new Error(`${field} must be a safe connection metadata path`);
    }
    return value;
}
const CONSERVATIVE_EFFECT = {
    disposition: 'commit',
    reversibility: 'irreversible',
    settlement: 'externally-observed',
};
const WELL_KNOWN_EFFECTS = {
    'credential.connection.verify/v1': observedEffect(),
    'communication.email.account.inspect/v1': observedEffect(),
    'communication.email.search/v1': observedEffect(),
    'communication.email.inbox.search/v1': observedEffect(),
    'communication.email.thread.read/v1': observedEffect(),
    'communication.email.attachment.read/v1': observedEffect(),
    'communication.email.analytics.read/v1': observedEffect(),
    'communication.email.draft.compose/v1': providerDraftEffect(),
    'communication.email.reply.compose/v1': providerDraftEffect(),
    'communication.email.forward.compose/v1': providerDraftEffect(),
    'communication.email.send/v1': CONSERVATIVE_EFFECT,
    'calendar.account.inspect/v1': observedEffect(),
    'calendar.events.read/v1': observedEffect(),
    'calendar.availability.compute/v1': observedEffect(),
    'calendar.event.create/v1': {
        disposition: 'commit',
        reversibility: 'compensatable',
        settlement: 'provider-acknowledged',
    },
};
function observedEffect() {
    return {
        disposition: 'observe',
        reversibility: 'not-applicable',
        settlement: 'immediate',
    };
}
function providerDraftEffect() {
    return {
        disposition: 'provider-draft',
        reversibility: 'reversible',
        settlement: 'provider-acknowledged',
    };
}
function sameEffect(left, right) {
    return left.disposition === right.disposition &&
        left.reversibility === right.reversibility &&
        left.settlement === right.settlement;
}
function readOptionalEffect(value, capability) {
    if (value === undefined)
        return undefined;
    if (!isRecord(value)) {
        throw new Error(`Action capability claim ${capability} has an invalid effect declaration`);
    }
    const dispositions = new Set(['observe', 'prepare', 'provider-draft', 'commit']);
    const reversibilities = new Set(['not-applicable', 'reversible', 'compensatable', 'irreversible']);
    const settlements = new Set(['immediate', 'provider-acknowledged', 'externally-observed']);
    if (typeof value.disposition !== 'string' || !dispositions.has(value.disposition) ||
        typeof value.reversibility !== 'string' || !reversibilities.has(value.reversibility) ||
        typeof value.settlement !== 'string' || !settlements.has(value.settlement)) {
        throw new Error(`Action capability claim ${capability} has an invalid effect declaration`);
    }
    return value;
}
/**
 * Resolve a claim to explicit effect semantics. Well-known capabilities have
 * canonical semantics that an element cannot weaken; unknown extensions use
 * their declaration or the conservative irreversible-commit default.
 */
function resolveActionCapabilityEffect(claim) {
    const canonical = WELL_KNOWN_EFFECTS[claim.capability];
    if (canonical && claim.effect && !sameEffect(canonical, claim.effect)) {
        throw new Error(`Action capability claim ${claim.capability} conflicts with its canonical effect`);
    }
    return canonical ?? claim.effect ?? CONSERVATIVE_EFFECT;
}
/** Validate and normalize untrusted action capability metadata before ingest. */
function parseActionCapabilityClaims(value) {
    if (!Array.isArray(value) || value.length > MAX_CLAIMS) {
        throw new Error(`Action capability claims must be an array with at most ${MAX_CLAIMS} entries`);
    }
    const claims = value.map((entry, index) => {
        if (!isRecord(entry))
            throw new Error(`Action capability claim ${index} must be an object`);
        if (typeof entry.capability !== 'string' || !VERSIONED_ID.test(entry.capability)) {
            throw new Error(`Action capability claim ${index} must declare a versioned capability`);
        }
        let identity;
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
        const claim = {
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
    if (claims.some(claim => claim.capability === 'credential.connection.verify/v1') &&
        claims.some(claim => resolveActionCapabilityEffect(claim).disposition !== 'observe')) {
        throw new Error('Credential verification actions may only declare observational capabilities');
    }
    return claims;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWNhcGFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWN0aW9uLWNhcGFiaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE4SkEsc0VBVUM7QUFHRCxrRUFzREM7QUExTEQsTUFBTSxZQUFZLEdBQUcsdURBQXVELENBQUM7QUFDN0UsTUFBTSxVQUFVLEdBQUcsZ0NBQWdDLENBQUM7QUFDcEQsTUFBTSxTQUFTLEdBQUcsOEJBQThCLENBQUM7QUFDakQsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUUxQixTQUFTLFFBQVEsQ0FBQyxLQUFjO0lBQzVCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBYyxFQUFFLEtBQWE7SUFDMUQsSUFBSSxLQUFLLEtBQUssU0FBUztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzFDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLGlDQUFpQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFjLEVBQUUsS0FBYTtJQUNqRCxJQUFJLEtBQUssS0FBSyxTQUFTO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxjQUFjLEVBQUUsQ0FBQztRQUN6RCxNQUFNLElBQUksS0FBSyxDQUFD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