import { type IngressInputSchemaWire } from './ingress-schema-materialize';
/** Select only the first schema property declared by the exact element definition. */
export declare function resolveDeclaredInterfaceSchema(data: unknown, properties: readonly unknown[]): {
    propertyKey: string;
    wire: IngressInputSchemaWire;
} | undefined;
/** Authoring preview only: matching source proves freshness, not execution authority. */
export declare function declaredInterfaceOutputSchema(data: unknown, properties: readonly unknown[]): Record<string, unknown> | undefined;
//# sourceMappingURL=declared-interface-schema.d.ts.map