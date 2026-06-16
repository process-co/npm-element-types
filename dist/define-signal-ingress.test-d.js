"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compile-only checks for static `defineSignal().ingress` declarations.
 */
const index_1 = require("./index");
const _staticIngressSignal = (0, index_1.defineSignal)({
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
            return this.ingress.filters;
        },
    },
    hooks: {
        async save({ $ }) {
            await $.http.configureIngressFilters({
                filters: this.ingress.filters,
            });
        },
    },
});
(0, index_1.defineSignal)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1pbmdyZXNzLnRlc3QtZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZpbmUtc2lnbmFsLWluZ3Jlc3MudGVzdC1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCxtQ0FBdUM7QUFFdkMsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDdEMsSUFBSSxFQUFFLFFBQVE7SUFDZCxHQUFHLEVBQUUsTUFBTTtJQUNYLEdBQUcsRUFBRSxjQUFjO0lBQ25CLElBQUksRUFBRSxjQUFjO0lBQ3BCLE9BQU8sRUFBRTtRQUNMLE9BQU8sRUFBRTtZQUNMO2dCQUNJLElBQUksRUFBRSxhQUFhO2dCQUNuQixNQUFNLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFFBQVE7b0JBQ2QsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7b0JBQ3BFLFdBQVcsRUFBRSxPQUFPO2lCQUN2QjthQUNKO1lBQ0QsNkRBQTZEO1lBQzdELDZEQUE2RDtZQUM3RCxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFO1lBQ2xELDBFQUEwRTtZQUMxRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUMzQixFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRTtTQUNoQztLQUNKO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsS0FBSyxDQUFDLEdBQUc7WUFDTCxPQUFPLElBQUksQ0FBQyxPQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2pDLENBQUM7S0FDSjtJQUNELEtBQUssRUFBRTtRQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDWixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUM7Z0JBQ2pDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBUSxDQUFDLE9BQU87YUFDakMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUNKO0NBQ0osQ0FBQyxDQUFDO0FBRUgsSUFBQSxvQkFBWSxFQUFDO0lBQ1QsSUFBSSxFQUFFLFFBQVE7SUFDZCxPQUFPLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDTCw2REFBNkQ7WUFDN0QsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7U0FDaEM7S0FDSjtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUssQ0FBQyxHQUFHO1lBQ0wsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztLQUNKO0NBQ0osQ0FBQyxDQUFDIn0=