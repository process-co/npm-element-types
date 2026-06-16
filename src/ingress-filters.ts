/**
 * Webhook ingress filter chain — author-facing types.
 *
 * Authors declare a static Go-native filter chain with
 * `defineSignal({ ingress: { filters } })`, and may call
 * `params.$.http.configureIngressFilters(...)` from `hooks.save` to replace
 * that default chain. The final chain runs at the edge **instead of**
 * proxying the request back to Node. The chain is validated at publish time
 * and persisted onto the element's stash row at {@link INGRESS_FILTERS_KEY}.
 *
 * The Go edge reads this list verbatim — no translation layer — and executes
 * each filter in order. When the chain is absent the edge falls back to
 * `ext_proc` (proxy back to the Node API).
 *
 * Style mirrors {@link ./http-request-cache.ts}: public authoring shape first,
 * reserved `$` materialized row field at save/publish time.
 */

/** Where to read auth material from on the inbound HTTP request. */
export type IngressAuthExtract = {
    from: 'header' | 'query' | 'cookie';
    name: string;
    /** Optional scheme prefix to strip (e.g. `'Bearer '`). */
    scheme?: string;
};

export type IngressVerifyAuthKind = 'none' | 'simple' | 'platform' | 'external';

/**
 * Verify inbound auth before any other filter runs.
 * `kind: 'simple'` performs constant-time compare on the edge.
 * Everything else delegates to the auth-check service.
 */
export type IngressVerifyAuthFilter = {
    type: 'verify_auth';
    config: {
        kind: IngressVerifyAuthKind;
        /** Element identity for audit / per-element auth policy lookup. */
        elementId?: string;
        elementVersion?: string;
        extract: IngressAuthExtract;
        /** Required when `kind: 'simple'`. Constant-time compared on the edge. */
        simpleToken?: string;
    };
};

/**
 * Native Go implementation of `http::signal:new-requests`.
 *
 * This is a built-in filter for a specific element shape. The chain entry
 * should usually be `{ type: 'http_new_requests' }`; the Go runtime reads
 * authored fields such as `responseType`, `resBodyJSON`, `eventData`, and
 * `resIncludeProcessTicket` from the published element row.
 */
export type IngressHttpNewRequestsFilter = {
    type: 'http_new_requests';
    config?: {
        resStatusCode?: number;
        resBody?: string;
        resContentType?: string;
        emitBodyOnly?: boolean;
        eventData?: 'full' | 'body';
        responseType?: 'OK' | 'NO_CONTENT' | 'STATIC' | 'CUSTOM' | string;
        responseTimeout?: number;
        includeProcessTicket?: boolean;
        summary?: string;
    };
};

/** Validate the selected inbound payload against JSON Schema before emit. */
export type IngressValidateJSONSchemaFilter = {
    type: 'validate_json_schema';
    config: {
        schema: Record<string, unknown>;
        eventData?: 'full' | 'body';
        responseType?: 'OK' | 'NO_CONTENT' | 'STATIC' | 'CUSTOM' | string;
        /** Auto-coerce string leaf values for form-like requests by default. */
        coerceLeafPrimitives?: boolean | 'auto';
    };
};

/**
 * Author-facing validation reference. Names a `$.interface.schema` property by
 * key (or its `typeOptions.schemaPropertyKey` override). Required when the
 * element has more than one schema property; optional when exactly one exists.
 *
 * Always validates the request body. Materialized at save/publish into
 * `validate_json_schema` or `validate_zod` using that property's compiled
 * artifacts and validation level.
 */
export type IngressValidateSchemaFilter = {
    type: 'validate_schema';
    /** Interface schema property key. Omit when the element has exactly one. */
    schema?: string;
};

/**
 * Validate the inbound payload against a Zod schema before emit.
 *
 * The Go edge runs this inline with its embedded QuickJS/Zod engine by default
 * using `artifactKey` (the edge-compatible validator artifact). A trusted-tier
 * sidecar is used only when `validatorBackend` is explicitly set to `sidecar`.
 *
 * `failOpen=true` lets the chain continue when validation is operationally
 * unavailable. Default is `false` (reject with 502 on outage).
 */
export type IngressValidateZodFilter = {
    type: 'validate_zod';
    config: {
        /** Stable identity for the registered Zod schema. Required. */
        schemaBuildId: string;
        /** Optional S3 key for the edge-compatible validator artifact. */
        artifactKey?: string;
        /** Legacy/current S3 key for the compiled validator module. */
        compiledValidatorKey?: string;
        /** Optional friendly name used in error messages. */
        schemaName?: string;
        eventData?: 'full' | 'body';
        responseType?: 'OK' | 'NO_CONTENT' | 'STATIC' | 'CUSTOM' | string;
        /** Continue the chain when the validate endpoint cannot be reached. */
        failOpen?: boolean;
        /**
         * Compile-time hint for how the edge should run this validator:
         * `inline` (embedded QuickJS/Zod) or `sidecar` (trusted-tier endpoint).
         * Absent ⇒ edge uses its deployment default (inline).
         */
        validatorBackend?: 'inline' | 'sidecar';
    };
};

/**
 * Generic chain equivalent of a source calling `$emit`. Compound filters such
 * as `http_new_requests` may emit directly instead of composing this filter.
 */
export type IngressEmitFilter = {
    type: '$emit';
    config: {
        eventData?: 'full' | 'body';
        emitBodyOnly?: boolean;
        summary?: string;
    };
};

/**
 * Respond synchronously with a static body, then continue the chain so a
 * later filter can emit. Used by webhooks that must ACK quickly.
 */
export type IngressRespondThenEmitFilter = {
    type: 'respond_then_emit';
    config: {
        status?: number;
        contentType?: string;
        body?: string;
    };
};

/** Verify HMAC signatures (e.g. GitHub `X-Hub-Signature-256`). */
export type IngressHMACVerifyFilter = {
    type: 'hmac_verify';
    config: {
        algorithm: 'sha1' | 'sha256' | 'sha512';
        signatureHeader: string;
        /** Optional prefix on the signature value (e.g. `'sha256='`). */
        signaturePrefix?: string;
        /** Secret material is resolved by the auth-check service. */
        secretRef: string;
    };
};

/**
 * Echo a challenge value (Slack URL verification, Stripe Connect, etc.).
 * If the inbound request includes the configured challenge, respond
 * immediately without emitting.
 */
export type IngressChallengeResponseFilter = {
    type: 'challenge_response';
    config: {
        from: 'body' | 'query' | 'header';
        name: string;
        responseTemplate?: string;
        contentType?: string;
    };
};

/** Set context metadata derived from a JSON path on the request body. */
export type IngressJSONPathMetaFilter = {
    type: 'jsonpath_meta';
    config: {
        path: string;
        as: string;
    };
};

/**
 * Discriminated union of supported ingress filters. Any new filter type
 * must be added here AND registered on the Go edge — `validate-ingress-filters`
 * rejects unknown types at publish time.
 */
export type IngressFilterDescriptor =
    | IngressVerifyAuthFilter
    | IngressValidateSchemaFilter
    | IngressValidateJSONSchemaFilter
    | IngressValidateZodFilter
    | IngressEmitFilter
    | IngressHttpNewRequestsFilter
    | IngressRespondThenEmitFilter
    | IngressHMACVerifyFilter
    | IngressChallengeResponseFilter
    | IngressJSONPathMetaFilter;

/** Save-only override: hooks.save → `$.http.configureIngressFilters`. */
export type ConfigureIngressFiltersOptions = {
    filters: IngressFilterDescriptor[];
};

/** Materialized at save → `elementData.$ingressFilters`. */
export type IngressFiltersPolicy = {
    filters: IngressFilterDescriptor[];
};

export const INGRESS_FILTERS_KEY = '$ingressFilters' as const;

/** Names accepted at publish time. Keep in sync with the Go filter registry. */
export const INGRESS_FILTER_TYPES: ReadonlyArray<IngressFilterDescriptor['type']> = [
    'verify_auth',
    'validate_schema',
    'validate_json_schema',
    'validate_zod',
    '$emit',
    'http_new_requests',
    'respond_then_emit',
    'hmac_verify',
    'challenge_response',
    'jsonpath_meta',
] as const;
