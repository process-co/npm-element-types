/**
 * Compile-only checks for defineAction (not emitted).
 */
import {
    defineAction,
    defineApp,
    type ActionReentryOptions,
    type ActionRunOptions,
    type DeriveActionInstance,
    type DeriveEmbeddedAppPropInstance,
    type WorkflowContinuationTimeoutSignal,
} from './index';

const _timeoutSignal: WorkflowContinuationTimeoutSignal = {
    type: 'continuation.timeout',
    deadlineAt: '2026-08-01T12:00:00Z',
};
void _timeoutSignal;

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
            $.tag('rate.limited', 'true');
            // @ts-expect-error — system tags are runtime-owned, not author-emittable
            $.tag('socket.state', 'completed');
            const typedTag = $.tag.typed<{
                'retry.state': 'scheduled' | 'exhausted';
                'trace.id': string;
            }>();
            typedTag('retry.state', 'scheduled');
            typedTag('trace.id', 'trace-123');
            // @ts-expect-error — declared tag values remain a closed union
            typedTag('retry.state', 'complete');
            // @ts-expect-error — undeclared keys use $.tag, not this typed scope
            typedTag('rate.limited', 'true');
            const invalidSystemTag = $.tag.typed<{
                'socket.state': 'open';
            }>();
            // @ts-expect-error — a custom registry cannot claim a system key
            invalidSystemTag('socket.state', 'open');
            void $.flow;
            const datasets = await $.table.listDatasets();
            void datasets.datasets[0]?.capabilities.read;
            const page = await $.table.queryRows<{ total: number }>('dataset-1', {
                limit: 10,
            });
            void page.rows[0]?.columns?.total;
            const inserted = await $.table.insertRow('dataset-1', {
                value: 'created by element',
            });
            void inserted.rowId;
            const continuation = await $.continuation('onApproval', {
                ttlSeconds: 300,
                channel: 'email',
            });
            continuation.urlFor({ channel: 'sms' });
            this.label;
            this.http.httpRequest.execute;
        },
    },
    reentry: {
        async onApproval({ $, input }: ActionReentryOptions<{ approvedBy: string }>) {
            $.export('approvedBy', input.approvedBy);
            this.label;
        },
        async onUnspecifiedPayload({ $, input }) {
            $.export('callback', 'received');
            this.label;
            // @ts-expect-error — callback payloads must be author-declared before use
            input.approvedBy;
            // @ts-expect-error — the definition bag is not an instance field
            this.reentry;
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
type _approvalParams = Parameters<typeof _action.reentry.onApproval>[0];
type _approvalInput = _approvalParams['input'];
type _assertApprovalInput = _approvalInput extends { approvedBy: string } ? true : false;
const _approvalInputCheck: _assertApprovalInput = true;

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
