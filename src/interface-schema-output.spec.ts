import { projectInterfaceSchemaOutput } from './interface-schema-output';

const schema = { type: 'object', properties: { first: { type: 'string' }, email: { type: 'string', format: 'email' } },
  required: ['first', 'email'], additionalProperties: false };
const native = { type: 'object', properties: { body: {}, headers: { type: 'object' }, query: { type: 'object' } }, required: ['headers'] };
const outputBinding = { path: ['body'], rootWhen: { property: 'eventData', equals: 'body' } };
const props = [{ key: 'inputSchema', type: '$.interface.schema', typeOptions: { outputBinding } },
  { key: 'eventData', type: 'string', default: 'full' }];

test.each([{}, { eventData: 'full' }, { eventData: 'raw' }])('keeps body constraints under body and retains the envelope %#', data => {
  const before = JSON.stringify({ schema, native, props });
  expect(projectInterfaceSchemaOutput(schema, data, props, native)).toEqual({ ...native,
    properties: { ...native.properties, body: schema }, required: ['headers', 'body'] });
  expect(JSON.stringify({ schema, native, props })).toBe(before);
});

test('body-only returns the body schema, including its root restrictions', () => {
  expect(projectInterfaceSchemaOutput(schema, { eventData: 'body' }, props, native)).toEqual(schema);
  expect(projectInterfaceSchemaOutput(schema, {}, [props[0], { ...props[1], default: 'body' }], native)).toEqual(schema);
});

test('unannotated definitions retain existing root-schema behavior', () => {
  expect(projectInterfaceSchemaOutput(schema, {}, [{ key: 'shape', type: '$.interface.schema' }], native)).toEqual(schema);
});

test('invalid definition metadata falls back to the native shape', () => {
  expect(projectInterfaceSchemaOutput(schema, {}, [{ ...props[0], typeOptions: { outputBinding: { path: 'body' } } }], native)).toEqual(native);
});

test('rebases body-local references while preserving data and nested resource references', () => {
  const referenced = { type: 'object', definitions: { contact: schema },
    properties: { contact: { $ref: '#/definitions/contact' }, recursive: { $ref: '#' },
      independent: { $id: 'https://example.test/schema', $ref: '#/definitions/contact', definitions: { contact: schema } } },
    examples: [{ $ref: '#/literal-data' }], default: { $ref: '#' } };
  const result = projectInterfaceSchemaOutput(referenced, {}, props, native) as any;
  expect(result.properties.body.properties.contact.$ref).toBe('#/properties/body/definitions/contact');
  expect(result.properties.body.properties.recursive.$ref).toBe('#/properties/body');
  expect(result.properties.body.properties.independent).toEqual(referenced.properties.independent);
  expect(result.properties.body.examples).toEqual(referenced.examples);
  expect(result.properties.body.default).toEqual(referenced.default);
});

test('supports nested paths and literal pointer characters without prototype mutation', () => {
  const descriptors = [{ data: { ...props[0], typeOptions: { outputBinding: { path: ['event', '__proto__', 'a~/b'] } } } }];
  const result = projectInterfaceSchemaOutput({ $ref: '#' }, {}, descriptors) as any;
  expect(Object.keys(result.properties.event.properties)).toEqual(['__proto__']);
  expect(result.properties.event.properties.__proto__.properties['a~/b'].$ref)
    .toBe('#/properties/event/properties/__proto__/properties/a~0~1b');
  expect(Object.prototype).not.toHaveProperty('event');
});
