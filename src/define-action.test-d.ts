/**
 * Compile-only checks for defineAction (not emitted).
 */
import {
    defineAction,
    defineApp,
    type ActionRunOptions,
    type DeriveActionInstance,
    type DeriveEmbeddedAppPropInstance,
} from './index';

const httpApp = defineApp({
    type: 'app',
    app: 'http',
    propDefinitions: {
        httpRequest: { type: 'http_request', label: 'HTTP Request' },
    },
} as const);

const _action = defineAction({
    type: 'action',
    key: 'test-action',
    version: '1.0.0',
    props: {
        label: { type: 'string', default: '' },
        http: httpApp,
    },
    methods: {
        async run({ $, steps }) {
            void steps;
            $.export('out', {});
            void $.flow;
            this.label;
            this.http.httpRequest.execute;
        },
    },
});

export type _actionType = typeof _action;

type _runParams = Parameters<NonNullable<typeof _action.methods>['run']>[0];
type _runDollar = _runParams['$'];
type _assertRunDollar = _runDollar extends ActionRunOptions['$'] ? true : false;
const _runDollarCheck: _assertRunDollar = true;

type _httpOnThis = DeriveActionInstance<typeof _action>['http'];
type _httpRuntime = DeriveEmbeddedAppPropInstance<typeof httpApp>;
type _assertHttpProp = _httpOnThis extends _httpRuntime ? true : false;
const _httpPropCheck: _assertHttpProp = true;
type _assertNotDefinition = 'type' extends keyof _httpOnThis ? false : true;
const _notDefinitionCheck: _assertNotDefinition = true;
type _assertRunOnThis = typeof _action.methods.run extends DeriveActionInstance<typeof _action>['run']
    ? true
    : false;
const _runOnThisCheck: _assertRunOnThis = true;

/** @deprecated top-level `run` — still accepted for older elements. */
const _legacyTopLevelRun = defineAction({
    type: 'action',
    key: 'legacy-run',
    version: '1.0.0',
    props: {},
    async run({ $, steps }) {
        void steps;
        $.export('legacy', true);
    },
});

void _legacyTopLevelRun;
