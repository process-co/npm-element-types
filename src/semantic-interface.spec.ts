import { z } from 'zod';

import {
  defineAction,
  defineInterfaceType,
  defineSource,
  parseElementSemanticInterfaceDeclaration,
  type InferSemanticInterfaceType,
} from './index';

describe('semantic interface authoring', () => {
  const EmailMessage = defineInterfaceType({
    id: 'process.email.message@1',
    title: 'Email message',
    description: 'A hydrated Internet email message.',
    schema: z.object({
      $type: z.literal('process.email.message@1'),
      subject: z.string(),
    }),
  });

  it('preserves literal identifiers and schema inference', () => {
    const id: 'process.email.message@1' = EmailMessage.id;
    const value: InferSemanticInterfaceType<typeof EmailMessage> = {
      $type: id,
      subject: 'Hello',
    };

    expect(EmailMessage.schema.parse(value)).toEqual(value);
  });

  it('types action properties separately from semantic metadata', () => {
    const action = defineAction({
      type: 'action',
      interfaces: {
        native: 'process.provider.send-result@1',
        inputs: [EmailMessage.id],
        outputs: [{
          interfaceType: 'process.email.message-ref@1',
          mapping: { mappingId: 'send-result-to-ref', revisionId: 'rev_1', kind: 'declarative' },
          lossiness: 'lossless',
        }],
      },
      props: {
        message: {
          type: 'object',
          interfaceType: EmailMessage.id,
        },
      },
      methods: {
        async run() {
          return this.message;
        },
      },
    });

    expect(action.interfaces.outputs?.[0]?.mapping.revisionId).toBe('rev_1');
  });

  it('provides a source-specialized signal declaration', () => {
    const source = defineSource({
      type: 'source',
      interfaces: {
        native: 'process.smtp.inbound-message@1',
        outputs: [{
          interfaceType: EmailMessage.id,
          mapping: { mappingId: 'smtp-to-email', revisionId: 'rev_2', kind: 'declarative' },
          lossiness: 'lossless',
          resolution: 'deterministic',
        }],
      },
      methods: { async run() {} },
    });

    expect(source.type).toBe('source');
  });

  it('rejects unpinned mapping metadata at an untyped publication boundary', () => {
    expect(() => parseElementSemanticInterfaceDeclaration({
      native: 'process.smtp.inbound-message@1',
      outputs: [{
        interfaceType: 'process.email.message@1',
        mapping: { mappingId: 'smtp-to-email', kind: 'declarative' },
        lossiness: 'lossless',
      }],
    })).toThrow('revisionId');
  });
});
