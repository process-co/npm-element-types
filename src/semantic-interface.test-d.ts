import { z } from 'zod';

import {
    defineAction,
    defineInterfaceType,
    defineSource,
    type InferSemanticInterfaceType,
} from './index';

const EmailMessage = defineInterfaceType({
    id: 'process.email.message@1',
    title: 'Email message',
    description: 'A hydrated email message.',
    schema: z.object({ subject: z.string() }),
});

const literalId: 'process.email.message@1' = EmailMessage.id;
const inferredValue: InferSemanticInterfaceType<typeof EmailMessage> = { subject: 'Hello' };
void literalId;
void inferredValue;

defineAction({
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

defineSource({
    type: 'source',
    interfaces: { native: 'process.smtp.inbound-message@1' },
    methods: { async run() {} },
});

defineInterfaceType({
    // @ts-expect-error interface identifiers must be Process- or organization-qualified and versioned
    id: 'email.message@1',
    title: 'Invalid',
    description: 'Invalid identifier example.',
    schema: z.object({}),
});

defineAction({
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
    methods: { async run() {} },
});
