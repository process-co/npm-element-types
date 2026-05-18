/**
 * Compile-only checks for defineSignal hook vs run `this` (not emitted).
 */
import { type SignalSaveHostParameters } from './index';
declare const _webhook: {
    readonly type: "signal";
    readonly props: {
        readonly httpInterface: {
            readonly type: "$.interface.http";
        };
        readonly cacheMaxAge: {
            readonly type: "$.interface.duration";
            readonly default: 86400;
        };
        readonly authType: {
            readonly type: "string";
            readonly default: "none";
        };
    };
    readonly hooks: {
        readonly save: ({ $ }: SignalSaveHostParameters) => Promise<void>;
    };
    readonly run: ({ $, event }: import("./index").SignalRunOptions) => Promise<void>;
};
export type _webhookType = typeof _webhook;
export {};
//# sourceMappingURL=define-signal-hook-this.test-d.d.ts.map