"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWNhcGFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWN0aW9uLWNhcGFiaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUF1RUEsa0VBOENDO0FBMUZELE1BQU0sWUFBWSxHQUFHLHVEQUF1RCxDQUFDO0FBQzdFLE1BQU0sVUFBVSxHQUFHLGdDQUFnQyxDQUFDO0FBQ3BELE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFDO0FBQ2pELE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFFMUIsU0FBUyxRQUFRLENBQUMsS0FBYztJQUM1QixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFFRCxTQUFTLHVCQUF1QixDQUFDLEtBQWMsRUFBRSxLQUFhO0lBQzFELElBQUksS0FBSyxLQUFLLFNBQVM7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUMxQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN6RCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsS0FBYyxFQUFFLEtBQWE7SUFDakQsSUFBSSxLQUFLLEtBQUssU0FBUztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsY0FBYyxFQUFFLENBQUM7UUFDekQsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUss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