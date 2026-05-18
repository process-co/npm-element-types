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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1ob29rLXRoaXMudGVzdC1kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlZmluZS1zaWduYWwtaG9vay10aGlzLnRlc3QtZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsbUNBSWlCO0FBRWpCLE1BQU0sUUFBUSxHQUFHLElBQUEsb0JBQVksRUFBQztJQUMxQixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRTtRQUNILGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtRQUMzQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUM3RCxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7S0FDaEQ7SUFDRCxLQUFLLEVBQUU7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1osTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDO2dCQUNsQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVc7Z0JBQ3hCLE1BQU0sRUFBRSxHQUFHO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsbUVBQW1FO1lBQ25FLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDaEIsZ0VBQWdFO1lBQ2hFLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDWCw4REFBOEQ7WUFDOUQsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEUsQ0FBQztLQUNKO0lBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUU7UUFDbEIsS0FBSyxLQUFLLENBQUM7UUFDWCxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQ2hCLGdFQUFnRTtRQUNoRSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1AsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDSixDQUFDLENBQUM7QUFPSCxNQUFNLGdCQUFnQixHQUFzQixJQUFJLENBQUM7QUFFakQsTUFBTSxzQkFBc0IsR0FBc0IsSUFBSSxDQUFDIn0=