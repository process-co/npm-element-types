"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngressFiltersValidationError = void 0;
exports.normalizeIngressHmacFilter = normalizeIngressHmacFilter;
/** Cold preparation errors retain the same field path in every host. */
class IngressFiltersValidationError extends Error {
    path;
    constructor(message, path) {
        super(`ingressFilters[${path}]: ${message}`);
        this.path = path;
        this.name = 'IngressFiltersValidationError';
    }
}
exports.IngressFiltersValidationError = IngressFiltersValidationError;
/** One canonical HMAC policy for restricted hooks and publication. No secrets are resolved here. */
function normalizeIngressHmacFilter(config, index) {
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
            algorithm: algorithm, signatureHeader, secretRef,
            ...(signatureEncoding !== undefined ? { signatureEncoding } : {}),
            ...(typeof config.signaturePrefix === 'string' ? { signaturePrefix: config.signaturePrefix } : {}),
            ...(expectedHeaders !== undefined ? { expectedHeaders } : {}),
        } };
}
function requiredText(config, key, index) {
    const value = config[key];
    if (typeof value !== 'string' || !value.length) {
        throw new IngressFiltersValidationError(`hmac_verify.config.${key} is required`, `${index}.config.${key}`);
    }
    return value;
}
function normalizeExpectedHeaders(value, index) {
    if (value === undefined)
        return undefined;
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return invalidHeaders(index);
    const entries = Object.entries(value);
    if (entries.length > 16 || new Set(entries.map(([key]) => key.toLowerCase())).size !== entries.length
        || entries.some(([key, text]) => !/^[a-zA-Z0-9!#$%&'*+.^_`|~-]+$/u.test(key)
            || typeof text !== 'string' || !text || text.length > 8192 || /[\r\n\0]/u.test(text)))
        return invalidHeaders(index);
    return Object.fromEntries(entries);
}
function invalidHeaders(index) {
    throw new IngressFiltersValidationError('hmac_verify.config.expectedHeaders must contain bounded exact header values', `${index}.config.expectedHeaders`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ncmVzcy1maWx0ZXItdmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmdyZXNzLWZpbHRlci12YWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVdBLGdFQW9CQztBQTdCRCx3RUFBd0U7QUFDeEUsTUFBYSw2QkFBOEIsU0FBUSxLQUFLO0lBQ1Q7SUFBN0MsWUFBWSxPQUFlLEVBQWtCLElBQVk7UUFDdkQsS0FBSyxDQUFDLGtCQUFrQixJQUFJLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQztRQURGLFNBQUksR0FBSixJQUFJLENBQVE7UUFFdkQsSUFBSSxDQUFDLElBQUksR0FBRywrQkFBK0IsQ0FBQztJQUM5QyxDQUFDO0NBQ0Y7QUFMRCxzRUFLQztBQUVELG9HQUFvRztBQUNwRyxTQUFnQiwwQkFBMEIsQ0FDeEMsTUFBK0IsRUFBRSxLQUFhO0lBRTlDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDdEQsTUFBTSxJQUFJLDZCQUE2QixDQUFDLHlEQUF5RCxFQUFFLEdBQUcsS0FBSyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2xJLENBQUM7SUFDRCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUNuRCxJQUFJLGlCQUFpQixLQUFLLFNBQVMsSUFBSSxpQkFBaUIsS0FBSyxLQUFLLElBQUksaUJBQWlCLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDckcsTUFBTSxJQUFJLDZCQUE2QixDQUFDLHlEQUF5RCxFQUFFLEdBQUcsS0FBSywyQkFBMkIsQ0FBQyxDQUFDO0lBQzFJLENBQUM7SUFDRCxNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNELE1BQU0sZUFBZSxHQUFHLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEYsT0FBTyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFO1lBQ3BDLFNBQVMsRUFBRSxTQUEyRCxFQUFFLGVBQWUsRUFBRSxTQUFTO1lBQ2xHLEdBQUcsQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2pFLEdBQUcsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxlQUFlLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNsRyxHQUFHLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQzlELEVBQUUsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxNQUErQixFQUFFLEdBQW9DLEVBQUUsS0FBYTtJQUN4RyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0MsTUFBTSxJQUFJLDZCQUE2QixDQUFDLHNCQUFzQixHQUFHLGNBQWMsRUFBRSxHQUFHLEtBQUssV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzdHLENBQUM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxTQUFTLHdCQUF3QixDQUFDLEtBQWMsRUFBRSxLQUFhO0lBQzdELElBQUksS0FBSyxLQUFLLFNBQVM7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUMxQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU07V0FDaEcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7ZUFDdkUsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4SCxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUEyQixDQUFDO0FBQy9ELENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFhO0lBQ25DLE1BQU0sSUFBSSw2QkFBNkIsQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEtBQUsseUJBQXlCLENBQUMsQ0FBQztBQUM1SixDQUFDIn0=