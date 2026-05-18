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
    methods: {
        async run() {
            this.http.httpRequest.execute;
            this.httpInterface.deferHttpResponse;
        },
    },
});
const _httpPropCheck = true;
const _notDefinitionCheck = true;
const _httpRequestCheck = true;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXNpZ25hbC1hcHAtcHJvcC50ZXN0LWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVmaW5lLXNpZ25hbC1hcHAtcHJvcC50ZXN0LWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILG1DQUtpQjtBQUVqQixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFTLEVBQUM7SUFDdEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxHQUFHLEVBQUUsTUFBTTtJQUNYLE1BQU0sRUFBRSxJQUFJO0lBQ1osZUFBZSxFQUFFO1FBQ2IsV0FBVyxFQUFFO1lBQ1QsSUFBSSxFQUFFLGNBQWM7WUFDcEIsS0FBSyxFQUFFLDRCQUE0QjtTQUN0QztLQUNKO0NBQ0ssQ0FBQyxDQUFDO0FBRVosTUFBTSxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQ3pCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFO1FBQ0gsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1FBQzNDLElBQUksRUFBRSxPQUFPO0tBQ2hCO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsS0FBSyxDQUFDLEdBQUc7WUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztRQUN6QyxDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUM7QUFLSCxNQUFNLGNBQWMsR0FBb0IsSUFBSSxDQUFDO0FBRTdDLE1BQU0sbUJBQW1CLEdBQXlCLElBQUksQ0FBQztBQUl2RCxNQUFNLGlCQUFpQixHQUF1QixJQUFJLENBQUMifQ==