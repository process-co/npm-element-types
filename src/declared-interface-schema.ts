import { computeSchemaSourceHash, schemaKeyFromPropertyDescriptor, type IngressInputSchemaWire } from './ingress-schema-materialize';

function record(value: unknown): Record<string, unknown> | undefined {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : undefined;
}

/** Select only the first schema property declared by the exact element definition. */
export function resolveDeclaredInterfaceSchema(data: unknown, properties: readonly unknown[]) {
  const instance = record(data);
  if (!instance) return undefined;
  for (const value of properties) {
    const outer = record(value);
    const property = record(outer?.data) ?? outer;
    if (property?.type !== '$.interface.schema') continue;
    const propertyKey = schemaKeyFromPropertyDescriptor(property);
    if (!propertyKey) return undefined;
    const wire = record(instance[propertyKey]);
    return wire ? { propertyKey, wire: wire as IngressInputSchemaWire } : undefined;
  }
  return undefined;
}

/** Authoring preview only: matching source proves freshness, not execution authority. */
export function declaredInterfaceOutputSchema(data: unknown, properties: readonly unknown[]): Record<string, unknown> | undefined {
  const wire = resolveDeclaredInterfaceSchema(data, properties)?.wire;
  const source = typeof wire?.exportSchemaSource === 'string' ? wire.exportSchemaSource.trim() : '';
  if (!source || wire?.sourceHash !== computeSchemaSourceHash(source)) return undefined;
  return record(wire.exportSchema);
}
