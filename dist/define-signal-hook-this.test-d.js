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
            // @ts-expect-error — `run` host `$` is not available in hooks.save
            $.enforceSchema;
            // @ts-expect-error — `$emit` is only on `run` `this`, not hooks
            this.$emit;
            // @ts-expect-error — no runtime HTTP interface on hook `this`
            await this.httpInterface.respond({ status: 200, body: {} });
        },
    },
    async run({ $, event }) {
        void event;
        $.enforceSchema;
        // @ts-expect-error — save-only host `$` is not available in run
        $.http;
        await this.httpInterface.deferHttpResponse(30_000);
    },
});
const _saveDollarCheck = true;
const _saveDollarNotRunCheck = true;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1ob29rLXRoaXMudGVzdC1kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlZmluZS1zaWduYWwtaG9vay10aGlzLnRlc3QtZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsbUNBSWlCO0FBRWpCLE1BQU0sUUFBUSxHQUFHLElBQUEsb0JBQVksRUFBQztJQUMxQixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRTtRQUNILGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtRQUMzQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUM3RCxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7S0FDaEQ7SUFDRCxLQUFLLEVBQUU7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1osTUFBTSxNQUFNLEdBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxLQUFLLE1BQU0sQ0FBQztZQUNaLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztnQkFDbEMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN4QixNQUFNLEVBQUUsR0FBRzthQUNkLENBQUMsQ0FBQztZQUNILG1FQUFtRTtZQUNuRSxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ2hCLGdFQUFnRTtZQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ1gsOERBQThEO1lBQzlELE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7S0FDSjtJQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO1FBQ2xCLEtBQUssS0FBSyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUNoQixnRUFBZ0U7UUFDaEUsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNQLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBT0gsTUFBTSxnQkFBZ0IsR0FBc0IsSUFBSSxDQUFDO0FBRWpELE1BQU0sc0JBQXNCLEdBQXNCLElBQUksQ0FBQyJ9