/**
 * Compile-only checks for defineAction (not emitted).
 */
import { type ActionRunOptions } from './index';
declare const _action: {
    readonly type: "action";
    readonly key: "test-action";
    readonly version: "1.0.0";
    readonly props: {
        readonly label: {
            readonly type: "string";
            readonly default: "";
        };
        readonly http: {
            readonly type: "app";
            readonly app: "http";
            readonly propDefinitions: {
                readonly httpRequest: {
                    readonly type: "http_request";
                    readonly label: "HTTP Request";
                };
            };
        };
    };
    readonly methods: {
        readonly run: ({ $, steps }: ActionRunOptions<import("./index").ProcessFunctions>) => Promise<void>;
    };
};
export type _actionType = typeof _action;
export {};
//# sourceMappingURL=define-action.test-d.d.ts.map