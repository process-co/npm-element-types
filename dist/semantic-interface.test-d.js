"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const index_1 = require("./index");
const EmailMessage = (0, index_1.defineInterfaceType)({
    id: 'process.email.message@1',
    title: 'Email message',
    description: 'A hydrated email message.',
    schema: zod_1.z.object({ subject: zod_1.z.string() }),
});
const literalId = EmailMessage.id;
const inferredValue = { subject: 'Hello' };
void literalId;
void inferredValue;
const ProviderMessage = (0, index_1.defineInterfaceType)({
    id: 'org.example.provider-message@1',
    title: 'Provider message',
    description: 'Provider-native message.',
    schema: zod_1.z.object({ providerSubject: zod_1.z.string() }),
});
const providerToEmail = (0, index_1.defineInterfaceMapping)({
    kind: 'custom-adapter',
    mappingId: 'example.provider-to-email',
    source: ProviderMessage,
    target: EmailMessage,
    lossiness: 'lossless',
    adapter: {
        runtime: 'nodejs',
        artifactPath: 'mappings/provider-to-email.js',
        exportName: 'providerToEmail',
    },
    convert(value) {
        const subject = value.providerSubject;
        return { subject };
    },
});
const emailToProvider = (0, index_1.defineInterfaceMapping)({
    kind: 'declarative',
    mappingId: 'example.email-to-provider',
    source: EmailMessage,
    target: ProviderMessage,
    lossiness: 'lossless',
    root: {
        op: 'object',
        fields: { providerSubject: { op: 'source', pointer: '/subject' } },
    },
});
const providerInterfaces = (0, index_1.defineElementInterfaces)({
    version: 2,
    native: ProviderMessage,
    accepts: [emailToProvider],
    emits: [providerToEmail],
});
(0, index_1.defineAction)({
    type: 'action',
    interfaces: {
        native: 'process.provider.message@1',
        inputs: [EmailMessage.id],
        outputs: [
            {
                interfaceType: 'process.email.message-ref@1',
                mapping: {
                    mappingId: 'provider-to-email-ref',
                    revisionId: 'mapping_rev_1',
                    kind: 'declarative',
                },
                lossiness: 'lossless',
            },
        ],
    },
    props: {
        message: { type: 'object', interfaceType: EmailMessage.id },
    },
    methods: {
        async run() {
            void this.message;
            // @ts-expect-error semantic definition metadata is not a runtime instance property
            void this.interfaces;
        },
    },
});
(0, index_1.defineAction)({
    type: 'action',
    interfaces: providerInterfaces,
    methods: { async run() { } },
});
(0, index_1.defineSource)({
    type: 'source',
    interfaces: { native: 'process.smtp.inbound-message@1' },
    methods: { async run() { } },
});
(0, index_1.defineInterfaceType)({
    // @ts-expect-error interface identifiers must be Process- or organization-qualified and versioned
    id: 'email.message@1',
    title: 'Invalid',
    description: 'Invalid identifier example.',
    schema: zod_1.z.object({}),
});
(0, index_1.defineAction)({
    type: 'action',
    interfaces: {
        native: 'process.provider.message@1',
        outputs: [
            {
                interfaceType: 'process.email.message@1',
                // @ts-expect-error published projection declarations must pin a mapping revision
                mapping: { mappingId: 'provider-to-email', kind: 'declarative' },
                lossiness: 'lossless',
            },
        ],
    },
    methods: { async run() { } },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtYW50aWMtaW50ZXJmYWNlLnRlc3QtZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZW1hbnRpYy1pbnRlcmZhY2UudGVzdC1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQXdCO0FBRXhCLG1DQU9pQjtBQUVqQixNQUFNLFlBQVksR0FBRyxJQUFBLDJCQUFtQixFQUFDO0lBQ3JDLEVBQUUsRUFBRSx5QkFBeUI7SUFDN0IsS0FBSyxFQUFFLGVBQWU7SUFDdEIsV0FBVyxFQUFFLDJCQUEyQjtJQUN4QyxNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztDQUM1QyxDQUFDLENBQUM7QUFFSCxNQUFNLFNBQVMsR0FBOEIsWUFBWSxDQUFDLEVBQUUsQ0FBQztBQUM3RCxNQUFNLGFBQWEsR0FBb0QsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDNUYsS0FBSyxTQUFTLENBQUM7QUFDZixLQUFLLGFBQWEsQ0FBQztBQUVuQixNQUFNLGVBQWUsR0FBRyxJQUFBLDJCQUFtQixFQUFDO0lBQ3hDLEVBQUUsRUFBRSxnQ0FBZ0M7SUFDcEMsS0FBSyxFQUFFLGtCQUFrQjtJQUN6QixXQUFXLEVBQUUsMEJBQTBCO0lBQ3ZDLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsZUFBZSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO0NBQ3BELENBQUMsQ0FBQztBQUVILE1BQU0sZUFBZSxHQUFHLElBQUEsOEJBQXNCLEVBQUM7SUFDM0MsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixTQUFTLEVBQUUsMkJBQTJCO0lBQ3RDLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLFNBQVMsRUFBRSxVQUFVO0lBQ3JCLE9BQU8sRUFBRTtRQUNMLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLFlBQVks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