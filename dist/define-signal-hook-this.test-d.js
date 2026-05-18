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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1ob29rLXRoaXMudGVzdC1kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlZmluZS1zaWduYWwtaG9vay10aGlzLnRlc3QtZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsbUNBS2lCO0FBRWpCLE1BQU0sUUFBUSxHQUFHLElBQUEsb0JBQVksRUFBQztJQUMxQixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRTtRQUNILGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtRQUMzQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUM3RCxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7S0FDaEQ7SUFDRCxLQUFLLEVBQUU7UUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1osTUFBTSxNQUFNLEdBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxLQUFLLE1BQU0sQ0FBQztZQUNaLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztnQkFDbEMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN4QixNQUFNLEVBQUUsR0FBRzthQUNkLENBQUMsQ0FBQztZQUNILG1FQUFtRTtZQUNuRSxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ2hCLGdFQUFnRTtZQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ1gsOERBQThEO1lBQzlELE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7S0FDSjtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO1lBQ2xCLEtBQUssS0FBSyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUNoQixnRUFBZ0U7WUFDaEUsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNQLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUM7QUFPSCxNQUFNLGdCQUFnQixHQUFzQixJQUFJLENBQUM7QUFFakQsTUFBTSxzQkFBc0IsR0FBc0IsSUFBSSxDQUFDO0FBS3ZELE1BQU0sZUFBZSxHQUFxQixJQUFJLENBQUM7QUFFL0MsdUVBQXVFO0FBQ3ZFLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQ3BDLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFLEVBQUU7SUFDVCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRTtRQUNsQixLQUFLLEtBQUssQ0FBQztRQUNYLENBQUMsQ0FBQyxhQUFhLENBQUM7SUFDcEIsQ0FBQztDQUNKLENBQUMsQ0FBQztBQUVILEtBQUssa0JBQWtCLENBQUMifQ==