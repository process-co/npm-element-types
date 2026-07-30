"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compile-only checks for defineAction (not emitted).
 */
const index_1 = require("./index");
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
            this.label;
            this.http.httpRequest.execute;
        },
    },
});
const _runDollarCheck = true;
const _httpPropCheck = true;
const _notDefinitionCheck = true;
const _runOnThisCheck = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLWFjdGlvbi50ZXN0LWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVmaW5lLWFjdGlvbi50ZXN0LWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILG1DQU1pQjtBQUVqQixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFTLEVBQUM7SUFDdEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxHQUFHLEVBQUUsTUFBTTtJQUNYLGVBQWUsRUFBRTtRQUNiLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtLQUMvRDtDQUNLLENBQUMsQ0FBQztBQUVaLE1BQU0sT0FBTyxHQUFHLElBQUEsb0JBQVksRUFBQztJQUN6QixJQUFJLEVBQUUsUUFBUTtJQUNkLEdBQUcsRUFBRSxhQUFhO0lBQ2xCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLEtBQUssRUFBRTtRQUNILEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTtRQUN0QyxJQUFJLEVBQUUsT0FBTztLQUNoQjtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO1lBQ2xCLEtBQUssS0FBSyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEIsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ1osTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzlDLEtBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQzdDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQW9CLFdBQVcsRUFBRTtnQkFDakUsS0FBSyxFQUFFLEVBQUU7YUFDWixDQUFDLENBQUM7WUFDSCxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztZQUNsQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtnQkFDbEQsS0FBSyxFQUFFLG9CQUFvQjthQUM5QixDQUFDLENBQUM7WUFDSCxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUNsQyxDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUM7QUFPSCxNQUFNLGVBQWUsR0FBcUIsSUFBSSxDQUFDO0FBSy9DLE1BQU0sY0FBYyxHQUFvQixJQUFJLENBQUM7QUFFN0MsTUFBTSxtQkFBbUIsR0FBeUIsSUFBSSxDQUFDO0FBSXZELE1BQU0sZUFBZSxHQUFxQixJQUFJLENBQUM7QUFFL0MsdUVBQXVFO0FBQ3ZFLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQ3BDLElBQUksRUFBRSxRQUFRO0lBQ2QsR0FBRyxFQUFFLFlBQVk7SUFDakIsT0FBTyxFQUFFLE9BQU87SUFDaEIsS0FBSyxFQUFFLEVBQUU7SUFDVCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRTtRQUNsQixLQUFLLEtBQUssQ0FBQztRQUNYLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDSixDQUFDLENBQUM7QUFFSCxLQUFLLGtCQUFrQixDQUFDIn0=