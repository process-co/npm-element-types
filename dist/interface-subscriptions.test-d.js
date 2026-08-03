"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Compile-only checks for typed `$interface` recovery subscriptions. */
const index_1 = require("./index");
const _action = (0, index_1.defineAction)({
    type: 'action',
    key: 'interface-recovery-action',
    version: '1.0.0',
    props: {
        label: { type: 'string', default: '' },
    },
    methods: {
        async run({ $ }) {
            $.export('started', true);
        },
    },
    interfaceSubscriptions: {
        async 'provider.partial-failure'({ $, input }) {
            $.export('failed-count', input.payload.failedIds.length);
            $.recovery.continue();
            const _eventId = input.id;
            const _retryable = input.payload.retryable;
            const _eventType = input.type;
            void _retryable;
            void _eventType;
            void _eventId;
            this.label;
            // @ts-expect-error — the event payload is registry-typed
            input.payload.missing;
            // @ts-expect-error — subscription definitions are not instance props
            this.interfaceSubscriptions;
        },
        async 'http.disconnected'({ input }) {
            const _terminal = input.payload.terminal;
            const _status = input.payload.status;
            void _terminal;
            void _status;
        },
        async 'element.error'({ input }) {
            const _phase = input.payload.phase;
            const _retryable = input.payload.retryable;
            void _phase;
            void _retryable;
        },
    },
});
const _signal = (0, index_1.defineSignal)({
    type: 'signal',
    props: {
        source: { type: 'string', default: '' },
    },
    methods: {
        async run({ event }) {
            void event;
        },
    },
    interfaceSubscriptions: {
        async 'interface.ready'({ $, input }) {
            $.export('interface-fern', input.payload.fern ?? '');
            $.recovery.continue();
            const _eventType = input.type;
            void _eventType;
            this.source;
        },
    },
});
void _action;
void _signal;
const _invalidSubscriptionBag = {
    // @ts-expect-error — event keys must exist in ElementInterfaceEventMap
    async 'provider.unknown'() { },
};
void _invalidSubscriptionBag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLXN1YnNjcmlwdGlvbnMudGVzdC1kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ludGVyZmFjZS1zdWJzY3JpcHRpb25zLnRlc3QtZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlFQUF5RTtBQUN6RSxtQ0FJaUI7QUFXakIsTUFBTSxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQ3pCLElBQUksRUFBRSxRQUFRO0lBQ2QsR0FBRyxFQUFFLDJCQUEyQjtJQUNoQyxPQUFPLEVBQUUsT0FBTztJQUNoQixLQUFLLEVBQUU7UUFDSCxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7S0FDekM7SUFDRCxPQUFPLEVBQUU7UUFDTCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1gsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQztLQUNKO0lBQ0Qsc0JBQXNCLEVBQUU7UUFDcEIsS0FBSyxDQUFDLDBCQUEwQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRTtZQUN6QyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sUUFBUSxHQUFXLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDbEMsTUFBTSxVQUFVLEdBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDcEQsTUFBTSxVQUFVLEdBQStCLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDMUQsS0FBSyxVQUFVLENBQUM7WUFDaEIsS0FBSyxVQUFVLENBQUM7WUFDaEIsS0FBSyxRQUFRLENBQUM7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ1gseURBQXlEO1lBQ3pELEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3RCLHFFQUFxRTtZQUNyRSxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFDaEMsQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEtBQUssRUFBRTtZQUMvQixNQUFNLFNBQVMsR0FBUyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUMvQyxNQUFNLE9BQU8sR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUM3QyxLQUFLLFNBQVMsQ0FBQztZQUNmLEtBQUssT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFO1lBQzNCLE1BQU0sTUFBTSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzNDLE1BQU0sVUFBVSxHQUFZLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ3BELEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxVQUFVLENBQUM7UUFDcEIsQ0FBQztLQUNKO0NBQ0osQ0FBQyxDQUFDO0FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQ3pCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFO1FBQ0gsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO0tBQzFDO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtZQUNmLEtBQUssS0FBSyxDQUFDO1FBQ2YsQ0FBQztLQUNKO0lBQ0Qsc0JBQXNCLEVBQUU7UUFDcEIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRTtZQUNoQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsTUFBTSxVQUFVLEdBQXNCLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDakQsS0FBSyxVQUFVLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUM7QUFFSCxLQUFLLE9BQU8sQ0FBQztBQUNiLEtBQUssT0FBTyxDQUFDO0FBRWIsTUFBTSx1QkFBdUIsR0FBMkQ7SUFDcEYsdUVBQXVFO0lBQ3ZFLEtBQUssQ0FBQyxrQkFBa0IsS0FBSSxDQUFDO0NBQ2hDLENBQUM7QUFDRixLQUFLLHVCQUF1QixDQUFDIn0=