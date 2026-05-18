/**
 * Compile-only: embedded `defineApp` in signal `props` (not emitted).
 */
import { type DeriveEmbeddedAppPropInstance, type DeriveSignalInstance } from './index';
declare const httpApp: {
    readonly type: "app";
    readonly app: "http";
    readonly noAuth: true;
    readonly propDefinitions: {
        readonly httpRequest: {
            readonly type: "http_request";
            readonly label: "HTTP Request Configuration";
        };
    };
};
declare const _signal: {
    readonly type: "signal";
    readonly props: {
        readonly httpInterface: {
            readonly type: "$.interface.http";
        };
        readonly http: {
            readonly type: "app";
            readonly app: "http";
            readonly noAuth: true;
            readonly propDefinitions: {
                readonly httpRequest: {
                    readonly type: "http_request";
                    readonly label: "HTTP Request Configuration";
                };
            };
        };
    };
    readonly methods: {
        readonly run: () => Promise<void>;
    };
};
export type _HttpOnThis = DeriveSignalInstance<typeof _signal>['http'];
export type _HttpRuntime = DeriveEmbeddedAppPropInstance<typeof httpApp>;
export {};
//# sourceMappingURL=define-signal-app-prop.test-d.d.ts.map