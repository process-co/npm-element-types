"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compile-only: embedded `defineApp` in signal `props` (not emitted).
 */
const index_1 = require("./index");
const httpApp = (0, index_1.defineApp)({
    type: 'app',
    app: 'http',
    noAuth: true,
    propDefinitions: {
        httpRequest: {
            type: 'http_request',
            label: 'HTTP Request Configuration',
        },
    },
});
const _signal = (0, index_1.defineSignal)({
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
const _httpPropCheck = true;
const _notDefinitionCheck = true;
const _httpRequestCheck = true;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1hcHAtcHJvcC50ZXN0LWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVmaW5lLXNpZ25hbC1hcHAtcHJvcC50ZXN0LWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILG1DQUtpQjtBQUVqQixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFTLEVBQUM7SUFDdEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxHQUFHLEVBQUUsTUFBTTtJQUNYLE1BQU0sRUFBRSxJQUFJO0lBQ1osZUFBZSxFQUFFO1FBQ2IsV0FBVyxFQUFFO1lBQ1QsSUFBSSxFQUFFLGNBQWM7WUFDcEIsS0FBSyxFQUFFLDRCQUE0QjtTQUN0QztLQUNKO0NBQ0ssQ0FBQyxDQUFDO0FBRVosTUFBTSxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQ3pCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFO1FBQ0gsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1FBQzNDLElBQUksRUFBRSxPQUFPO0tBQ2hCO0lBQ0QsS0FBSyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztJQUN6QyxDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBS0gsTUFBTSxjQUFjLEdBQW9CLElBQUksQ0FBQztBQUU3QyxNQUFNLG1CQUFtQixHQUF5QixJQUFJLENBQUM7QUFJdkQsTUFBTSxpQkFBaUIsR0FBdUIsSUFBSSxDQUFDIn0=