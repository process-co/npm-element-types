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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1pbmdyZXNzLnRlc3QtZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZpbmUtc2lnbmFsLWluZ3Jlc3MudGVzdC1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCxtQ0FBdUM7QUFFdkMsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDdEMsSUFBSSxFQUFFLFFBQVE7SUFDZCxHQUFHLEVBQUUsTUFBTTtJQUNYLEdBQUcsRUFBRSxjQUFjO0lBQ25CLElBQUksRUFBRSxjQUFjO0lBQ3BCLE9BQU8sRUFBRTtRQUNMLE9BQU8sRUFBRTtZQUNMO2dCQUNJLElBQUksRUFBRSxhQUFhO2dCQUNuQixNQUFNLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFFBQVE7b0JBQ2QsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7b0JBQ3BFLFdBQVcsRUFBRSxPQUFPO2lCQUN2QjthQUNKO1lBQ0QsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7U0FDaEM7S0FDSjtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUssQ0FBQyxHQUFHO1lBQ0wsT0FBTyxJQUFJLENBQUMsT0FBUSxDQUFDLE9BQU8sQ0FBQztRQUNqQyxDQUFDO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1osTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDO2dCQUNqQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQVEsQ0FBQyxPQUFPO2FBQ2pDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FDSjtDQUNKLENBQUMsQ0FBQztBQUVILElBQUEsb0JBQVksRUFBQztJQUNULElBQUksRUFBRSxRQUFRO0lBQ2QsT0FBTyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ0wsNkRBQTZEO1lBQzdELEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1NBQ2hDO0tBQ0o7SUFDRCxPQUFPLEVBQUU7UUFDTCxLQUFLLENBQUMsR0FBRztZQUNMLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7S0FDSjtDQUNKLENBQUMsQ0FBQyJ9