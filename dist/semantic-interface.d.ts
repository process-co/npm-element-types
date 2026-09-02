import type { z } from 'zod';
/** A concrete major revision in the Process or organization interface taxonomy. */
export type SemanticInterfaceTypeId = `process.${string}@${number}` | `org.${string}.${string}@${number}`;
/** Author-owned schema declaration. Publication supplies governance and immutable revision metadata. */
export type SemanticInterfaceTypeDefinition<Id extends SemanticInterfaceTypeId = SemanticInterfaceTypeId, Schema extends z.ZodTypeAny = z.ZodTypeAny> = {
    readonly id: Id;
    readonly title: string;
    readonly description: string;
    readonly schema: Schema;
};
/**
 * Preserve an interface identifier and Zod schema as literal types for element authoring.
 * This identity helper performs no registration or side effects.
 */
export declare function defineInterfaceType<const Id extends SemanticInterfaceTypeId, const Schema extends z.ZodTypeAny>(definition: SemanticInterfaceTypeDefinition<Id, Schema>): SemanticInterfaceTypeDefinition<Id, Schema>;
/** Infer the value accepted by an interface declaration's Zod schema. */
export type InferSemanticInterfaceType<T extends SemanticInterfaceTypeDefinition> = z.output<T['schema']>;
/** Immutable reference to a published mapping implementation. */
export type SemanticInterfaceMappingReference = {
    readonly mappingId: string;
    readonly revisionId: string;
    readonly kind: 'declarative' | 'custom-adapter';
};
/** One explicit projection from the producer-native value to a named interface. */
export type SemanticInterfaceProjectionDeclaration = {
    readonly interfaceType: SemanticInterfaceTypeId;
    readonly mapping: SemanticInterfaceMappingReference;
    readonly lossiness: 'lossless' | 'lossy';
    readonly resolution?: 'deterministic' | 'probabilistic';
};
/** Semantic inputs, native output, and explicit projected outputs for an element operation. */
export type ElementSemanticInterfaceDeclaration = {
    readonly native: SemanticInterfaceTypeId;
    readonly inputs?: readonly SemanticInterfaceTypeId[];
    readonly outputs?: readonly SemanticInterfaceProjectionDeclaration[];
};
/** Optional static semantic metadata accepted by actions, signals, and sources. */
export type ElementSemanticInterfaceMetadata = {
    readonly interfaces?: ElementSemanticInterfaceDeclaration;
};
/** Runtime guard used at build/publication boundaries that receive untyped JSON. */
export declare function parseSemanticInterfaceTypeId(value: unknown, path?: string): SemanticInterfaceTypeId;
/** Normalize and validate a declaration before it enters the versioned authoring catalog. */
export declare function parseElementSemanticInterfaceDeclaration(value: unknown): ElementSemanticInterfaceDeclaration;
//# sourceMappingURL=semantic-interface.d.ts.map