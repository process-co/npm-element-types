"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthProviderManifestSchema = exports.OAuthProviderPresetSchema = void 0;
const zod_1 = require("zod");
/** Public protocol configuration only; client material and connection tokens live elsewhere. */
exports.OAuthProviderPresetSchema = zod_1.z.enum(['oidc', 'ms_v2', 'slack', 'google', 'private_key_jwt']);
exports.OAuthProviderManifestSchema = zod_1.z.object({
    preset: zod_1.z.string().optional(),
    version: zod_1.z.literal('v2').optional(),
    authorization_endpoint: zod_1.z.string().nullable().optional(),
    auth_url: zod_1.z.string().nullable().optional(),
    token_endpoint: zod_1.z.string().nullable().optional(),
    scopeDelimiter: zod_1.z.string().optional(),
    pathVars: zod_1.z.array(zod_1.z.string()).optional(),
    /** Additional provider callback proof, checked after single-use state admission. */
    callbackVerification: zod_1.z.object({
        kind: zod_1.z.literal('shopify-query-hmac'),
        shopDomain: zod_1.z.string().max(512).regex(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|\{\{\s*custom_fields\.[A-Za-z][A-Za-z0-9_]*\s*\}\})\.myshopify\.com$/),
    }).strict().optional(),
    authParams: zod_1.z.object({
        authorization_endpoint: zod_1.z.string().nullable().optional(),
        include_pkce: zod_1.z.boolean().optional(),
        response_mode: zod_1.z.enum(['query', 'fragment']).optional(),
        extra: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    }).strict().optional(),
    tokenParams: zod_1.z.object({
        extra: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
        include_code_verifier: zod_1.z.boolean().optional(),
        client_assertion_type: zod_1.z.string().optional(),
        sign_assertion: zod_1.z.boolean().optional(),
    }).strict().optional(),
    token_endpoint_auth_method: zod_1.z.enum(['none', 'client_secret_post', 'client_secret_basic', 'private_key_jwt']).optional(),
    /** Airtable requires raw client material encoded as base64url instead of OAuth form/base64. */
    token_endpoint_basic_encoding: zod_1.z.enum(['form-base64', 'raw-base64url']).optional(),
    token_endpoint_auth_signing_alg: zod_1.z.enum(['RS256', 'PS256']).nullable().optional(),
    refresh: zod_1.z.object({
        supported: zod_1.z.boolean().optional(),
        rotatingRefreshTokens: zod_1.z.boolean().optional(),
        offlineAccess: zod_1.z.object({
            required: zod_1.z.boolean().optional(),
            scope: zod_1.z.string().optional(),
            grantType: zod_1.z.string().optional(),
            additionalParams: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
        }).strict().optional(),
    }).strict().optional(),
    identity: zod_1.z.object({
        id_token_claims: zod_1.z.array(zod_1.z.string()).optional(),
        email_claims: zod_1.z.array(zod_1.z.string()).optional(),
        tenant_claims: zod_1.z.array(zod_1.z.string()).optional(),
        response_paths: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    }).strict().optional(),
    errors: zod_1.z.object({
        reauth: zod_1.z.array(zod_1.z.string()).optional(),
        transient: zod_1.z.array(zod_1.z.string()).optional(),
        retryHeaders: zod_1.z.array(zod_1.z.string()).optional(),
        claimsChallengeHeader: zod_1.z.string().optional(),
    }).strict().optional(),
}).strict().superRefine((manifest, context) => {
    if (manifest.token_endpoint_basic_encoding && manifest.token_endpoint_auth_method !== 'client_secret_basic') {
        context.addIssue({ code: 'custom', path: ['token_endpoint_basic_encoding'], message: 'Basic encoding requires Basic client authentication' });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtcHJvdmlkZXItbWFuaWZlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvb2F1dGgtcHJvdmlkZXItbWFuaWZlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXdCO0FBRXhCLGdHQUFnRztBQUNuRixRQUFBLHlCQUF5QixHQUFHLE9BQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRzVGLFFBQUEsMkJBQTJCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNoRCxNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM3QixPQUFPLEVBQUUsT0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDbkMsc0JBQXNCLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUN4RCxRQUFRLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUMxQyxjQUFjLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNoRCxjQUFjLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNyQyxRQUFRLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDeEMsb0ZBQW9GO0lBQ3BGLG9CQUFvQixFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxFQUFFLE9BQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7UUFDckMsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFH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