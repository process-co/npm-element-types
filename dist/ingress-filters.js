"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.INGRESS_FILTER_TYPES = exports.INGRESS_FILTERS_KEY = void 0;
exports.INGRESS_FILTERS_KEY = '$ingressFilters';
/** Names accepted at publish time. Keep in sync with the Go filter registry. */
exports.INGRESS_FILTER_TYPES = [
    'verify_auth',
    'http_new_requests',
    'respond_then_emit',
    'hmac_verify',
    'challenge_response',
    'jsonpath_meta',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ncmVzcy1maWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2luZ3Jlc3MtZmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7OztBQXlIVSxRQUFBLG1CQUFtQixHQUFHLGlCQUEwQixDQUFDO0FBRTlELGdGQUFnRjtBQUNuRSxRQUFBLG9CQUFvQixHQUFtRDtJQUNoRixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQixhQUFhO0lBQ2Isb0JBQW9CO0lBQ3BCLGVBQWU7Q0FDVCxDQUFDIn0=