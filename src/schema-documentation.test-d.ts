import { z } from 'zod';
import './schema-documentation';

z.string().example('Apollo Global LLC');
z.number().example(3500);
z.object({ businessName: z.string() }).example({ businessName: 'Apollo Global LLC' });

// @ts-expect-error examples are typed from the schema input
z.number().example('not a number');

z.string().meta({
  description: 'Legal business name',
  examples: ['Apollo Global LLC'],
  default: 'Apollo Global LLC',
  readOnly: false,
});

z.object({
  businessName: z.string(),
  averageTicket: z.number(),
}).meta({
  description: 'Merchant signup request',
  examples: [{ businessName: 'Apollo Global LLC', averageTicket: 3500 }],
});

z.number().meta({
  // @ts-expect-error examples are typed from the documented schema input
  examples: ['not a number'],
});
