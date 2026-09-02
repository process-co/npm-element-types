import { z } from 'zod';

import {
    defineAction,
    defineElementInterfaces,
    defineInterfaceMapping,
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

const ProviderMessage = defineInterfaceType({
    id: 'org.example.provider-message@1',
    title: 'Provider message',
    description: 'Provider-native message.',
    schema: z.object({ providerSubject: z.string() }),
});

const providerToEmail = defineInterfaceMapping({
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
        const subject: string = value.providerSubject;
        return { subject };
    },
});

const emailToProvider = defineInterfaceMapping({
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

const providerInterfaces = defineElementInterfaces({
    version: 2,
    native: ProviderMessage,
    accepts: [emailToProvider],
    emits: [providerToEmail],
});

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

defineAction({
    type: 'action',
    interfaces: providerInterfaces,
    methods: { async run() {} },
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
