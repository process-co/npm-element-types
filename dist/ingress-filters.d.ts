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
    };
};
/**
 * Validate the inbound payload against a Zod schema hosted on Node.
 *
 * The Go edge cannot evaluate Zod schemas natively (they are TypeScript
 * runtime objects, not data), so this filter delegates to a Node
 * "validate" microservice at `_internal/zod-validate/:schemaBuildId`.
 * The schema is registered against `schemaBuildId` at element publish
 * time; the edge calls it as a sidecar and reads back a structured
 * result. Aligns with the envoy-style filter chain so we keep full Zod
 * validation on the edge without porting the engine to Go.
 *
 * `failOpen=true` lets the chain continue when the validate endpoint is
 * unreachable. Default is `false` (reject with 502 on outage).
 */
export type IngressValidateZodFilter = {
    type: 'validate_zod';
    config: {
        /** Stable identity for the registered Zod schema. Required. */
        schemaBuildId: string;
        /** Optional friendly name used in error messages. */
        schemaName?: string;
        eventData?: 'full' | 'body';
        responseType?: 'OK' | 'NO_CONTENT' | 'STATIC' | 'CUSTOM' | string;
        /** Continue the chain when the validate endpoint cannot be reached. */
        failOpen?: boolean;
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
export type IngressFilterDescriptor = IngressVerifyAuthFilter | IngressValidateJSONSchemaFilter | IngressValidateZodFilter | IngressEmitFilter | IngressHttpNewRequestsFilter | IngressRespondThenEmitFilter | IngressHMACVerifyFilter | IngressChallengeResponseFilter | IngressJSONPathMetaFilter;
/** Save-only override: hooks.save → `$.http.configureIngressFilters`. */
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