/**
 * Webhook ingress filter chain — author-facing types.
 *
 * Authors call `params.$.http.configureIngressFilters(...)` from `hooks.save`
 * to declare a Go-native filter chain that runs at the edge **instead of**
 * proxying the request back to Node. The chain is validated at publish time
 * and persisted onto the element's stash row at {@link INGRESS_FILTERS_KEY}.
 *
 * The Go edge reads this list verbatim — no translation layer — and executes
 * each filter in order. When the chain is absent the edge falls back to
 * `ext_proc` (proxy back to the Node API).
 *
 * Style mirrors {@link ./http-request-cache.ts}: a single save-hook host
 * method with a typed options shape that materializes onto the element row.
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
 * Receives the published instance row as `config` and uses it to render the
 * static response, optionally body-only emit, and project the inbound HTTP
 * envelope onto Pulsar in the same shape the Node executor produced.
 */
export type IngressHttpNewRequestsFilter = {
    type: 'http_new_requests';
    config: {
        resStatusCode?: number;
        resBody?: string;
        resContentType?: string;
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
export type IngressFilterDescriptor = IngressVerifyAuthFilter | IngressHttpNewRequestsFilter | IngressRespondThenEmitFilter | IngressHMACVerifyFilter | IngressChallengeResponseFilter | IngressJSONPathMetaFilter;
/** Save-only: hooks.save → `$.http.configureIngressFilters`. */
export type ConfigureIngressFiltersOptions = {
    filters: IngressFilterDescriptor[];
};
/** Materialized at save → `elementData.$ingressFilters`. */
export type IngressFiltersPolicy = {
    filters: IngressFilterDescriptor[];
};
export declare const INGRESS_FILTERS_KEY: "$ingressFilters";
/** Names accepted at publish time. Keep in sync with the Go filter registry. */
export declare const INGRESS_FILTER_TYPES: ReadonlyArray<IngressFilterDescriptor['type']>;
//# sourceMappingURL=ingress-filters.d.ts.map