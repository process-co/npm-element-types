/**
 * Compile-only checks for defineSignal hook vs run `this` (not emitted).
 */
import {
    defineSignal,
    type SignalRunHostServices,
    type SignalSaveHostParameters,
} from './index';

const _webhook = defineSignal({
    type: 'signal',
    props: {
        httpInterface: { type: '$.interface.http' },
        cacheMaxAge: { type: '$.interface.duration', default: 86400 },
        authType: { type: 'string', default: 'none' },
    },
    hooks: {
        async save({ $ }) {
            const _draft: boolean = $.isDraft;
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

export type _webhookType = typeof _webhook;

type _saveParams = Parameters<NonNullable<typeof _webhook.hooks>['save']>[0];
type _saveDollar = _saveParams['$'];
type _assertSaveDollar = _saveDollar extends SignalSaveHostParameters['$'] ? true : false;
const _saveDollarCheck: _assertSaveDollar = true;
type _saveDollarNotRun = SignalRunHostServices extends _saveDollar ? false : true;
const _saveDollarNotRunCheck: _saveDollarNotRun = true;
