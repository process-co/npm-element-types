import { z } from 'zod';
/** Public protocol configuration only; client material and connection tokens live elsewhere. */
export declare const OAuthProviderPresetSchema: z.ZodEnum<{
    slack: "slack";
    oidc: "oidc";
    ms_v2: "ms_v2";
    google: "google";
    private_key_jwt: "private_key_jwt";
}>;
export type OAuthProviderPreset = z.infer<typeof OAuthProviderPresetSchema>;
export declare const OAuthProviderManifestSchema: z.ZodObject<{
    preset: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodLiteral<"v2">>;
    authorization_endpoint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    auth_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    token_endpoint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    scopeDelimiter: z.ZodOptional<z.ZodString>;
    pathVars: z.ZodOptional<z.ZodArray<z.ZodString>>;
    authParams: z.ZodOptional<z.ZodObject<{
        authorization_endpoint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        include_pkce: z.ZodOptional<z.ZodBoolean>;
        response_mode: z.ZodOptional<z.ZodEnum<{
            query: "query";
            fragment: "fragment";
        }>>;
        extra: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
    tokenParams: z.ZodOptional<z.ZodObject<{
        extra: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        include_code_verifier: z.ZodOptional<z.ZodBoolean>;
        client_assertion_type: z.ZodOptional<z.ZodString>;
        sign_assertion: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    token_endpoint_auth_method: z.ZodOptional<z.ZodEnum<{
        none: "none";
        private_key_jwt: "private_key_jwt";
        client_secret_post: "client_secret_post";
        client_secret_basic: "client_secret_basic";
    }>>;
    token_endpoint_auth_signing_alg: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        RS256: "RS256";
        PS256: "PS256";
    }>>>;
    refresh: z.ZodOptional<z.ZodObject<{
        supported: z.ZodOptional<z.ZodBoolean>;
        rotatingRefreshTokens: z.ZodOptional<z.ZodBoolean>;
        offlineAccess: z.ZodOptional<z.ZodObject<{
            required: z.ZodOptional<z.ZodBoolean>;
            scope: z.ZodOptional<z.ZodString>;
            grantType: z.ZodOptional<z.ZodString>;
            additionalParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    identity: z.ZodOptional<z.ZodObject<{
        id_token_claims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        email_claims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        tenant_claims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        response_paths: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
    errors: z.ZodOptional<z.ZodObject<{
        reauth: z.ZodOptional<z.ZodArray<z.ZodString>>;
        transient: z.ZodOptional<z.ZodArray<z.ZodString>>;
        retryHeaders: z.ZodOptional<z.ZodArray<z.ZodString>>;
        claimsChallengeHeader: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type OAuthProviderManifest = z.infer<typeof OAuthProviderManifestSchema>;
//# sourceMappingURL=oauth-provider-manifest.d.ts.map