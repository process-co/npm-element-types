"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compile-only checks for defineAction (not emitted).
 */
const index_1 = require("./index");
const _timeoutSignal = {
    type: 'continuation.timeout',
    deadlineAt: '2026-08-01T12:00:00Z',
};
void _timeoutSignal;
const httpApp = (0, index_1.defineApp)({
    type: 'app',
    app: 'http',
    propDefinitions: {
        httpRequest: { type: 'http_request', label: 'HTTP Request' },
    },
});
const _action = (0, index_1.defineAction)({
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
            const typedTag = $.tag.typed();
            typedTag('retry.state', 'scheduled');
            typedTag('trace.id', 'trace-123');
            // @ts-expect-error — declared tag values remain a closed union
            typedTag('retry.state', 'complete');
            // @ts-expect-error — undeclared keys use $.tag, not this typed scope
            typedTag('rate.limited', 'true');
            const invalidSystemTag = $.tag.typed();
            // @ts-expect-error — a custom registry cannot claim a system key
            invalidSystemTag('socket.state', 'open');
            void $.flow;
            const datasets = await $.table.listDatasets();
            void datasets.datasets[0]?.capabilities.read;
            const page = await $.table.queryRows('dataset-1', {
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
        async onApproval({ $, input }) {
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
const _runDollarCheck = true;
const _httpPropCheck = true;
const _notDefinitionCheck = true;
const _runOnThisCheck = true;
const _approvalInputCheck = true;
/** @deprecated top-level `run` — still accepted for older elements. */
const _legacyTopLevelRun = (0, index_1.defineAction)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLWFjdGlvbi50ZXN0LWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVmaW5lLWFjdGlvbi50ZXN0LWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILG1DQVFpQjtBQUVqQixNQUFNLGNBQWMsR0FBc0M7SUFDdEQsSUFBSSxFQUFFLHNCQUFzQjtJQUM1QixVQUFVLEVBQUUsc0JBQXNCO0NBQ3JDLENBQUM7QUFDRixLQUFLLGNBQWMsQ0FBQztBQUVwQixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFTLEVBQUM7SUFDdEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxHQUFHLEVBQUUsTUFBTTtJQUNYLGVBQWUsRUFBRTtRQUNiLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtLQUMvRDtDQUNLLENBQUMsQ0FBQztBQUVaLE1BQU0sT0FBTyxHQUFHLElBQUEsb0JBQVksRUFBQztJQUN6QixJQUFJLEVBQUUsUUFBUTtJQUNkLEdBQUcsRUFBRSxhQUFhO0lBQ2xCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLEtBQUssRUFBRTtRQUNILEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTtRQUN0QyxJQUFJLEVBQUUsT0FBTztLQUNoQjtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO1lBQ2xCLEtBQUssS0FBSyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUIseUVBQXlFO1lBQ3pFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sUUFBUSxHQUFH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