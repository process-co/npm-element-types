/**
 * Compile-only: embedded `defineApp` in signal `props` (not emitted).
 */
import {
    defineApp,
    defineSignal,
    type DeriveEmbeddedAppPropInstance,
    type DeriveSignalInstance,
} from './index';

const httpApp = defineApp({
    type: 'app',
    app: 'http',
    noAuth: true,
    propDefinitions: {
        httpRequest: {
            type: 'http_request',
            label: 'HTTP Request Configuration',
        },
    },
} as const);

const _signal = defineSignal({
    type: 'signal',
    props: {
        httpInterface: { type: '$.interface.http' },
        http: httpApp,
    },
    async run() {
        this.http.httpRequest.execute;
        this.httpInterface.deferHttpResponse;
    },
});

export type _HttpOnThis = DeriveSignalInstance<typeof _signal>['http'];
export type _HttpRuntime = DeriveEmbeddedAppPropInstance<typeof httpApp>;
type _assertHttpProp = _HttpOnThis extends _HttpRuntime ? true : false;
const _httpPropCheck: _assertHttpProp = true;
type _assertNotDefinition = 'type' extends keyof _HttpOnThis ? false : true;
const _notDefinitionCheck: _assertNotDefinition = true;
type _assertHttpRequest = _HttpOnThis['httpRequest'] extends { execute: () => Promise<unknown> }
    ? true
    : false;
const _httpRequestCheck: _assertHttpRequest = true;
