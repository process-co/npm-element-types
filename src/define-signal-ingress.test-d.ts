/**
 * Compile-only checks for static `defineSignal().ingress` declarations.
 */
import { defineSignal } from './index';

const _staticIngressSignal = defineSignal({
    type: 'signal',
    app: 'http',
    key: 'new-requests',
    name: 'New Requests',
    ingress: {
        filters: [
            {
                type: 'verify_auth',
                config: {
                    kind: 'simple',
                    extract: { from: 'header', name: 'Authorization', scheme: 'Bearer' },
                    simpleToken: 'token',
                },
            },
            // Simple author-facing validation reference, materialized at
            // save/publish from the named `$.interface.schema` property.
            { type: 'validate_schema', schema: 'inputSchema' },
            // schema may be omitted when the element has exactly one schema property.
            { type: 'validate_schema' },
            { type: 'http_new_requests' },
        ],
    },
    methods: {
        async run() {
            return this.ingress!.filters;
        },
    },
    hooks: {
        async save({ $ }) {
            await $.http.configureIngressFilters({
                filters: this.ingress!.filters,
            });
        },
    },
});

defineSignal({
    type: 'signal',
    ingress: {
        filters: [
            // @ts-expect-error unknown ingress filter types are rejected
            { type: 'not_a_real_filter' },
        ],
    },
    methods: {
        async run() {
            return null;
        },
    },
});
