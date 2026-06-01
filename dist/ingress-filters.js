"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.INGRESS_FILTER_TYPES = exports.INGRESS_FILTERS_KEY = void 0;
exports.INGRESS_FILTERS_KEY = '$ingressFilters';
/** Names accepted at publish time. Keep in sync with the Go filter registry. */
exports.INGRESS_FILTER_TYPES = [
    'verify_auth',
    'validate_json_schema',
    'validate_zod',
    '$emit',
    'http_new_requests',
    'respond_then_emit',
    'hmac_verify',
    'challenge_response',
    'jsonpath_meta',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ncmVzcy1maWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2luZ3Jlc3MtZmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7OztBQW9MVSxRQUFBLG1CQUFtQixHQUFHLGlCQUEwQixDQUFDO0FBRTlELGdGQUFnRjtBQUNuRSxRQUFBLG9CQUFvQixHQUFtRDtJQUNoRixhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLGNBQWM7SUFDZCxPQUFPO0lBQ1AsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQixhQUFhO0lBQ2Isb0JBQW9CO0lBQ3BCLGVBQWU7Q0FDVCxDQUFDIn0=