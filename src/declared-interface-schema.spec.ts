import { declaredInterfaceOutputSchema, resolveDeclaredInterfaceSchema } from './declared-interface-schema';
import { computeSchemaSourceHash } from './ingress-schema-materialize';

const source = 'export default z.object({ first: z.string(), last: z.string() });';
const schema = { type: 'object', properties: { first: { type: 'string' }, last: { type: 'string' } } };
const wire = { exportSchemaSource: source, sourceHash: computeSchemaSourceHash(source), exportSchema: schema };
const props = [{ type: '$.interface.schema', key: 'inputShape' }];

test('declared shape is available without examples, validation, or compiled validators', () => {
  expect(declaredInterfaceOutputSchema({ inputShape: wire }, props)).toEqual(schema);
  expect(declaredInterfaceOutputSchema({ inputShape: { ...wire, validationLevel: 'full' } }, props)).toEqual(schema);
});

test('honors schema persistence keys and wrapped property definitions', () => {
  const descriptors = [{ data: { ...props[0], typeOptions: { schemaPropertyKey: 'payload' } } }];
  expect(resolveDeclaredInterfaceSchema({ payload: wire }, descriptors)).toEqual({ propertyKey: 'payload', wire });
});

test('does not infer output from arbitrary configuration or a later unrelated schema', () => {
  expect(declaredInterfaceOutputSchema({ inputShape: wire }, [])).toBeUndefined();
  expect(declaredInterfaceOutputSchema({ inputShape: wire }, [{ type: 'object', key: 'inputShape' }])).toBeUndefined();
  expect(declaredInterfaceOutputSchema({ other: wire }, [...props, { type: '$.interface.schema', key: 'other' }])).toBeUndefined();
});

test.each([
  { ...wire, sourceHash: 'stale' },
  { ...wire, exportSchemaSource: '' },
  { exportSchema: schema },
  { ...wire, exportSchema: [] },
])('ignores an absent or stale compiled schema %#', stale => {
  expect(declaredInterfaceOutputSchema({ inputShape: stale }, props)).toBeUndefined();
});
