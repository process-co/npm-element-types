import { z } from 'zod';

/** Public protocol configuration only; client material and connection tokens live elsewhere. */
export const OAuthProviderPresetSchema = z.enum(['oidc', 'ms_v2', 'slack', 'google', 'private_key_jwt']);
export type OAuthProviderPreset = z.infer<typeof OAuthProviderPresetSchema>;

export const OAuthProviderManifestSchema = z.object({
    preset: z.string().optional(),
    version: z.literal('v2').optional(),
    authorization_endpoint: z.string().nullable().optional(),
    auth_url: z.string().nullable().optional(),
    token_endpoint: z.string().nullable().optional(),
    scopeDelimiter: z.string().optional(),
    pathVars: z.array(z.string()).optional(),
    authParams: z.object({
        authorization_endpoint: z.string().nullable().optional(),
        include_pkce: z.boolean().optional(),
        response_mode: z.enum(['query', 'fragment']).optional(),
        extra: z.record(z.string(), z.string()).optional(),
    }).strict().optional(),
    tokenParams: z.object({
        extra: z.record(z.string(), z.string()).optional(),
        include_code_verifier: z.boolean().optional(),
        client_assertion_type: z.string().optional(),
        sign_assertion: z.boolean().optional(),
    }).strict().optional(),
    token_endpoint_auth_method: z.enum(['none', 'client_secret_post', 'client_secret_basic', 'private_key_jwt']).optional(),
    token_endpoint_auth_signing_alg: z.enum(['RS256', 'PS256']).nullable().optional(),
    refresh: z.object({
        supported: z.boolean().optional(),
        rotatingRefreshTokens: z.boolean().optional(),
        offlineAccess: z.object({
            required: z.boolean().optional(),
            scope: z.string().optional(),
            grantType: z.string().optional(),
            additionalParams: z.record(z.string(), z.string()).optional(),
        }).strict().optional(),
    }).strict().optional(),
    identity: z.object({
        id_token_claims: z.array(z.string()).optional(),
        email_claims: z.array(z.string()).optional(),
        tenant_claims: z.array(z.string()).optional(),
        response_paths: z.record(z.string(), z.string()).optional(),
    }).strict().optional(),
    errors: z.object({
        reauth: z.array(z.string()).optional(),
        transient: z.array(z.string()).optional(),
        retryHeaders: z.array(z.string()).optional(),
        claimsChallengeHeader: z.string().optional(),
    }).strict().optional(),
}).strict();

export type OAuthProviderManifest = z.infer<typeof OAuthProviderManifestSchema>;
