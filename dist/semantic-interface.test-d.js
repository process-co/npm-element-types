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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtYW50aWMtaW50ZXJmYWNlLnRlc3QtZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZW1hbnRpYy1pbnRlcmZhY2UudGVzdC1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQXdCO0FBRXhCLG1DQUtpQjtBQUVqQixNQUFNLFlBQVksR0FBRyxJQUFBLDJCQUFtQixFQUFDO0lBQ3JDLEVBQUUsRUFBRSx5QkFBeUI7SUFDN0IsS0FBSyxFQUFFLGVBQWU7SUFDdEIsV0FBVyxFQUFFLDJCQUEyQjtJQUN4QyxNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztDQUM1QyxDQUFDLENBQUM7QUFFSCxNQUFNLFNBQVMsR0FBOEIsWUFBWSxDQUFDLEVBQUUsQ0FBQztBQUM3RCxNQUFNLGFBQWEsR0FBb0QsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDNUYsS0FBSyxTQUFTLENBQUM7QUFDZixLQUFLLGFBQWEsQ0FBQztBQUVuQixJQUFBLG9CQUFZLEVBQUM7SUFDVCxJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUNSLE1BQU0sRUFBRSw0QkFBNEI7UUFDcEMsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztRQUN6QixPQUFPLEVBQUU7WUFDTDtnQkFDSSxhQUFhLEVBQUUsNkJBQTZCO2dCQUM1QyxPQUFPLEVBQUU7b0JBQ0wsU0FBUyxFQUFFLHVCQUF1QjtvQkFDbEMsVUFBVSxFQUFFLGVBQWU7b0JBQzNCLElBQUksRUFBRSxhQUFhO2lCQUN0QjtnQkFDRCxTQUFTLEVBQUUsVUFBVTthQUN4QjtTQUNKO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFO0tBQzlEO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsS0FBSyxDQUFDLEdBQUc7WUFDTCxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDbEIsbUZBQW1GO1lBQ25GLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUM7QUFFSCxJQUFBLG9CQUFZLEVBQUM7SUFDVCxJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxnQ0FBZ0MsRUFBRTtJQUN4RCxPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRTtDQUM5QixDQUFDLENBQUM7QUFFSCxJQUFBLDJCQUFtQixFQUFDO0lBQ2hCLGtHQUFrRztJQUNsRyxFQUFFLEVBQUUsaUJBQWlCO0lBQ3JCLEtBQUssRUFBRSxTQUFTO0lBQ2hCLFdBQVcsRUFBRSw2QkFBNkI7SUFDMUMsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0NBQ3ZCLENBQUMsQ0FBQztBQUVILElBQUEsb0JBQVksRUFBQztJQUNULElBQUksRUFBRSxRQUFRO0lBQ2QsVUFBVSxFQUFFO1FBQ1IsTUFBTSxFQUFFLDRCQUE0QjtRQUNwQyxPQUFPLEVBQUU7WUFDTDtnQkFDSSxhQUFhLEVBQUUseUJBQXlCO2dCQUN4QyxpRkFBaUY7Z0JBQ2pGLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO2dCQUNoRSxTQUFTLEVBQUUsVUFBVTthQUN4QjtTQUNKO0tBQ0o7SUFDRCxPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRTtDQUM5QixDQUFDLENBQUMifQ==