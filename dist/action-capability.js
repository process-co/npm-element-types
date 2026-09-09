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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWNhcGFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWN0aW9uLWNhcGFiaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE2SkEsc0VBVUM7QUFHRCxrRUFzREM7QUF6TEQsTUFBTSxZQUFZLEdBQUcsdURBQXVELENBQUM7QUFDN0UsTUFBTSxVQUFVLEdBQUcsZ0NBQWdDLENBQUM7QUFDcEQsTUFBTSxTQUFTLEdBQUcsOEJBQThCLENBQUM7QUFDakQsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUUxQixTQUFTLFFBQVEsQ0FBQyxLQUFjO0lBQzVCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBYyxFQUFFLEtBQWE7SUFDMUQsSUFBSSxLQUFLLEtBQUssU0FBUztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzFDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLGlDQUFpQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFjLEVBQUUsS0FBYTtJQUNqRCxJQUFJLEtBQUssS0FBSyxTQUFTO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxjQUFjLEVBQUUsQ0FBQztRQUN6RCxNQUFNLElBQUksS0FBSyxDQUFD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