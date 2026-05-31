"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compile-only checks for defineSignal hook vs run `this` (not emitted).
 */
const index_1 = require("./index");
const _webhook = (0, index_1.defineSignal)({
    type: 'signal',
    props: {
        httpInterface: { type: '$.interface.http' },
        cacheMaxAge: { type: '$.interface.duration', default: 86400 },
        authType: { type: 'string', default: 'none' },
    },
    hooks: {
        async save({ $ }) {
            const _draft = $.isDraft;
            void _draft;
            await $.http.configureResponseCaching({
                maxAge: this.cacheMaxAge,
                varyBy: '*',
            });
            await $.http.configureIngressFilters({
                filters: [
                    {
                        type: 'http_new_requests',
                        config: { resStatusCode: 200, resBody: 'ok' },
                    },
                ],
            });
            // @ts-expect-error — `run` host `$` is not available in hooks.save
            $.enforceSchema;
            // @ts-expect-error — `$emit` is only on `run` `this`, not hooks
            this.$emit;
            // @ts-expect-error — no runtime HTTP interface on hook `this`
            await this.httpInterface.respond({ status: 200, body: {} });
        },
    },
    methods: {
        async run({ $, event }) {
            void event;
            $.enforceSchema;
            // @ts-expect-error — save-only host `$` is not available in run
            $.http;
            await this.httpInterface.deferHttpResponse(30_000);
        },
    },
});
const _saveDollarCheck = true;
const _saveDollarNotRunCheck = true;
const _runOnThisCheck = true;
/** @deprecated top-level `run` — still accepted for older elements. */
const _legacyTopLevelRun = (0, index_1.defineSignal)({
    type: 'signal',
    props: {},
    async run({ $, event }) {
        void event;
        $.enforceSchema;
    },
});
void _legacyTopLevelRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1ob29rLXRoaXMudGVzdC1kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlZmluZS1zaWduYWwtaG9vay10aGlzLnRlc3QtZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsbUNBS2lCO0FBRWpCLE1BQU0sUUFBUSxHQUFHLElBQUEsb0JBQVksRUFBQztJQUMxQixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRTtRQUNILGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtRQUMzQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUM3RCxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7S0FDaEQ7SUFDRCxLQUFLLEVBQUU7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1osTUFBTSxNQUFNLEdBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxLQUFLLE1BQU0sQ0FBQztZQUNaLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztnQkFDbEMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN4QixNQUFNLEVBQUUsR0FBRzthQUNkLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztnQkFDakMsT0FBTyxFQUFFO29CQUNMO3dCQUNJLElBQUksRUFBRSxtQkFBbUI7d0JBQ3pCLE1BQU0sRUFBRSxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtxQkFDaEQ7aUJBQ0o7YUFDSixDQUFDLENBQUM7WUFDSCxtRUFBbUU7WUFDbkUsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUNoQixnRUFBZ0U7WUFDaEUsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNYLDhEQUE4RDtZQUM5RCxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO0tBQ0o7SUFDRCxPQUFPLEVBQUU7UUFDTCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRTtZQUNsQixLQUFLLEtBQUssQ0FBQztZQUNYLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDaEIsZ0VBQWdFO1lBQ2hFLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDUCxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsQ0FBQztLQUNKO0NBQ0osQ0FBQyxDQUFDO0FBT0gsTUFBTSxnQkFBZ0IsR0FBc0IsSUFBSSxDQUFDO0FBRWpELE1BQU0sc0JBQXNCLEdBQXNCLElBQUksQ0FBQztBQUt2RCxNQUFNLGVBQWUsR0FBcUIsSUFBSSxDQUFDO0FBRS9DLHVFQUF1RTtBQUN2RSxNQUFNLGtCQUFrQixHQUFHLElBQUEsb0JBQVksRUFBQztJQUNwQyxJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRSxFQUFFO0lBQ1QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUU7UUFDbEIsS0FBSyxLQUFLLENBQUM7UUFDWCxDQUFDLENBQUMsYUFBYSxDQUFDO0lBQ3BCLENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCxLQUFLLGtCQUFrQixDQUFDIn0=