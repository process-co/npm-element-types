/** Compile-only checks for typed `$interface` recovery subscriptions. */
import {
    defineAction,
    defineSignal,
    type ActionInterfaceSubscriptionsDefinition,
} from './index';

declare module './index' {
    interface ElementInterfaceEventMap {
        'provider.partial-failure': {
            failedIds: string[];
            retryable: boolean;
        };
    }
}

const _action = defineAction({
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
            const _eventId: string = input.id;
            const _retryable: boolean = input.payload.retryable;
            const _eventType: 'provider.partial-failure' = input.type;
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
            const _terminal: true = input.payload.terminal;
            const _status: number = input.payload.status;
            void _terminal;
            void _status;
        },
        async 'element.error'({ input }) {
            const _phase: string = input.payload.phase;
            const _retryable: boolean = input.payload.retryable;
            void _phase;
            void _retryable;
        },
    },
});

const _signal = defineSignal({
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
            const _eventType: 'interface.ready' = input.type;
            void _eventType;
            this.source;
        },
    },
});

void _action;
void _signal;

const _invalidSubscriptionBag: ActionInterfaceSubscriptionsDefinition<typeof _action> = {
    // @ts-expect-error — event keys must exist in ElementInterfaceEventMap
    async 'provider.unknown'() {},
};
void _invalidSubscriptionBag;
