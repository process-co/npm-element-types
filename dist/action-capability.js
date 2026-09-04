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
    'communication.email.account.inspect/v1': observedEffect(),
    'communication.email.search/v1': observedEffect(),
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
    return claims;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWNhcGFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWN0aW9uLWNhcGFiaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE0SkEsc0VBVUM7QUFHRCxrRUFrREM7QUFwTEQsTUFBTSxZQUFZLEdBQUcsdURBQXVELENBQUM7QUFDN0UsTUFBTSxVQUFVLEdBQUcsZ0NBQWdDLENBQUM7QUFDcEQsTUFBTSxTQUFTLEdBQUcsOEJBQThCLENBQUM7QUFDakQsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUUxQixTQUFTLFFBQVEsQ0FBQyxLQUFjO0lBQzVCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBYyxFQUFFLEtBQWE7SUFDMUQsSUFBSSxLQUFLLEtBQUssU0FBUztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzFDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLGlDQUFpQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFjLEVBQUUsS0FBYTtJQUNqRCxJQUFJLEtBQUssS0FBSyxTQUFTO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxjQUFjLEVBQUUsQ0FBQztRQUN6RCxNQUFNLElBQUksS0FBSyxDQUFD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