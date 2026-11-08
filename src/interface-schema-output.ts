import { z } from 'zod';

/** Definition-owned placement of a configured schema within the emitted value. */
export const InterfaceSchemaOutputBindingSchema = z.object({
  path: z.array(z.string().min(1)).max(16),
  rootWhen: z.object({ property: z.string().min(1), equals: z.union([z.string(), z.number(), z.boolean()]) }).optional(),
}).strict();

export type InterfaceSchemaOutputBinding = z.infer<typeof InterfaceSchemaOutputBindingSchema>;

function record(value: unknown): Record<string, unknown> | undefined {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : undefined;
}

function descriptors(properties: readonly unknown[]) {
  return properties.map(value => record(record(value)?.data) ?? record(value));
}

export function hasInterfaceSchemaOutputBinding(properties: readonly unknown[]): boolean {
  const property = descriptors(properties).find(prop => prop?.type === '$.interface.schema');
  return InterfaceSchemaOutputBindingSchema.safeParse(record(property?.typeOptions)?.outputBinding).success;
}

// Local pointers are relative to the schema root, which changes when embedded.
// A nested $id establishes its own resource and retains its own reference scope.
function rebaseReferences(value: unknown, prefix: string): unknown {
  if (Array.isArray(value)) return value.map(item => rebaseReferences(item, prefix));
  const object = record(value);
  if (!object || typeof object.$id === 'string') return value;
  return Object.fromEntries(Object.entries(object).map(([key, item]) => {
    if (key === '$ref' && typeof item === 'string' && (item === '#' || item.startsWith('#/'))) {
      return [key, `${prefix}${item.slice(1)}`];
    }
    if (['properties', 'patternProperties', '$defs', 'definitions', 'dependentSchemas', 'dependencies'].includes(key) && record(item)) {
      return [key, Object.fromEntries(Object.entries(item as Record<string, unknown>)
        .map(([name, child]) => [name, rebaseReferences(child, prefix)]))];
    }
    return [key, ['items', 'prefixItems', 'additionalItems', 'additionalProperties', 'unevaluatedProperties',
      'unevaluatedItems', 'contains', 'propertyNames', 'allOf', 'anyOf', 'oneOf', 'not', 'if', 'then', 'else'].includes(key)
      ? rebaseReferences(item, prefix) : item];
  }));
}

function placeSchema(base: Record<string, unknown>, path: string[], schema: Record<string, unknown>): Record<string, unknown> {
  if (!path.length) return schema;
  const [key, ...rest] = path;
  const properties = record(base.properties) ?? {};
  return { ...base, type: 'object',
    properties: { ...properties, [key!]: placeSchema(record(properties[key!]) ?? {}, rest, schema) },
    required: [...new Set([...(Array.isArray(base.required) ? base.required.filter(key => typeof key === 'string') : []), key!])],
  };
}

/** Typing only. This does not change validation scope or validate the envelope. */
export function projectInterfaceSchemaOutput(
  schema: Record<string, unknown>, data: unknown, properties: readonly unknown[],
  nativeSchema: Record<string, unknown> = {},
): Record<string, unknown> {
  const declared = descriptors(properties);
  const property = declared.find(prop => prop?.type === '$.interface.schema');
  const binding = record(property?.typeOptions)?.outputBinding;
  if (binding === undefined) return schema;
  const parsed = InterfaceSchemaOutputBindingSchema.safeParse(binding);
  // Invalid metadata cannot turn a body schema into an unrelated root declaration.
  if (!parsed.success) return nativeSchema;
  const { path, rootWhen } = parsed.data;
  const configuration = record(data);
  const selected = rootWhen && (configuration && Object.hasOwn(configuration, rootWhen.property)
    ? configuration[rootWhen.property] : declared.find(prop => prop?.key === rootWhen.property)?.default);
  if (!path.length || rootWhen && selected === rootWhen.equals) return schema;
  const prefix = `#${path.map(key => `/properties/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`).join('')}`;
  return placeSchema(nativeSchema, path, rebaseReferences(schema, prefix) as Record<string, unknown>);
}
