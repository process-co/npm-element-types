import { z } from 'zod';
import { installZodSchemaDocumentation } from './schema-documentation';

installZodSchemaDocumentation(z);

describe('schema documentation metadata', () => {
  it('survives the canonical Zod to JSON Schema projection', () => {
    const schema = z.object({
      businessName: z.string().meta({
        description: 'Legal business name',
        examples: ['Apollo Global LLC'],
      }),
    }).meta({
      description: 'Merchant signup request',
      examples: [{ businessName: 'Apollo Global LLC' }],
    });

    expect(z.toJSONSchema(schema)).toMatchObject({
      description: 'Merchant signup request',
      examples: [{ businessName: 'Apollo Global LLC' }],
      properties: {
        businessName: {
          description: 'Legal business name',
          examples: ['Apollo Global LLC'],
        },
      },
    });
  });

  it('supports typed fluent examples and appends repeated examples', () => {
    const schema = z.string().example('Apollo').example('Acme');

    expect(z.toJSONSchema(schema)).toMatchObject({
      examples: ['Apollo', 'Acme'],
    });
  });
});
