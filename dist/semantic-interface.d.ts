import { z } from 'zod';
/** A concrete major revision in the Process or organization interface taxonomy. */
export type SemanticInterfaceTypeId = `process.${string}@${number}` | `org.${string}.${string}@${number}`;
/** Author-owned schema declaration. Publication supplies governance and immutable revision metadata. */
export type SemanticInterfaceTypeDefinition<Id extends SemanticInterfaceTypeId = SemanticInterfaceTypeId, Schema extends z.ZodTypeAny = z.ZodTypeAny> = {
    readonly id: Id;
    readonly title: string;
    readonly description: string;
    readonly schema: Schema;
    /** Optional immutable revision label. The build compiler derives one from content when omitted. */
    readonly revisionId?: string;
    /** Security and governance labels copied into the compiled catalog definition. */
    readonly dataClassifications?: readonly string[];
    /** Fields whose provenance permits consumers to treat them as attributable facts. */
    readonly trustedFields?: readonly string[];
    readonly compatibility?: {
        readonly extends?: readonly SemanticInterfaceTypeId[];
        readonly replaces?: SemanticInterfaceTypeId;
    };
    /** Build-time examples that prove both accepted and rejected values for this exact definition. */
    readonly conformanceFixtures?: readonly ({
        readonly name: string;
        readonly expectation: 'valid';
        readonly value: z.input<Schema>;
        readonly reason: string;
    } | {
        readonly name: string;
        readonly expectation: 'invalid';
        readonly value: unknown;
        readonly reason: string;
    })[];
    /** Human- and agent-oriented guidance published with the interface. */
    readonly documentation?: {
        readonly human?: {
            readonly summary?: string;
            readonly useWhen?: readonly string[];
            readonly avoidWhen?: readonly string[];
            readonly fieldNotes?: Readonly<Record<string, string>>;
            readonly examples?: readonly {
                readonly name: string;
                readonly summary?: string;
                readonly value: unknown;
            }[];
        };
        readonly agent?: {
            readonly instructions?: readonly string[];
            readonly invariants?: readonly string[];
            readonly prohibitedInferences?: readonly string[];
            readonly mappingGuidance?: readonly string[];
        };
    };
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
/** Forward declaration for the richer build-time authoring shape. */
export type AuthoredElementSemanticInterfaceDeclaration = import('./interface-authoring').AuthoredElementSemanticInterfaceDeclaration;
/** Optional static semantic metadata accepted by actions, signals, and sources. */
export type ElementSemanticInterfaceMetadata = {
    readonly interfaces?: ElementSemanticInterfaceDeclaration | AuthoredElementSemanticInterfaceDeclaration;
};
/** Shared wire validator for semantic identifiers at build, ingestion, and runtime boundaries. */
export declare const SemanticInterfaceTypeIdSchema: z.ZodType<SemanticInterfaceTypeId>;
export declare const SemanticInterfaceMappingReferenceSchema: z.ZodObject<{
    mappingId: z.ZodString;
    revisionId: z.ZodString;
    kind: z.ZodEnum<{
        declarative: "declarative";
        "custom-adapter": "custom-adapter";
    }>;
}, z.core.$strict>;
export declare const SemanticInterfaceProjectionDeclarationSchema: z.ZodObject<{
    interfaceType: z.ZodType<SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<SemanticInterfaceTypeId, unknown>>;
    mapping: z.ZodObject<{
        mappingId: z.ZodString;
        revisionId: z.ZodString;
        kind: z.ZodEnum<{
            declarative: "declarative";
            "custom-adapter": "custom-adapter";
        }>;
    }, z.core.$strict>;
    lossiness: z.ZodEnum<{
        lossless: "lossless";
        lossy: "lossy";
    }>;
    resolution: z.ZodDefault<z.ZodEnum<{
        deterministic: "deterministic";
        probabilistic: "probabilistic";
    }>>;
}, z.core.$strict>;
export declare const ElementSemanticInterfaceDeclarationSchema: z.ZodObject<{
    native: z.ZodType<SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<SemanticInterfaceTypeId, unknown>>;
    inputs: z.ZodDefault<z.ZodArray<z.ZodType<SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<SemanticInterfaceTypeId, unknown>>>>;
    outputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        interfaceType: z.ZodType<SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<SemanticInterfaceTypeId, unknown>>;
        mapping: z.ZodObject<{
            mappingId: z.ZodString;
            revisionId: z.ZodString;
            kind: z.ZodEnum<{
                declarative: "declarative";
                "custom-adapter": "custom-adapter";
            }>;
        }, z.core.$strict>;
        lossiness: z.ZodEnum<{
            lossless: "lossless";
            lossy: "lossy";
        }>;
        resolution: z.ZodDefault<z.ZodEnum<{
            deterministic: "deterministic";
            probabilistic: "probabilistic";
        }>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
/** Runtime guard used at build/publication boundaries that receive untyped JSON. */
export declare function parseSemanticInterfaceTypeId(value: unknown, path?: string): SemanticInterfaceTypeId;
/** Normalize and validate a declaration before it enters the versioned authoring catalog. */
export declare function parseElementSemanticInterfaceDeclaration(value: unknown): ElementSemanticInterfaceDeclaration;
//# sourceMappingURL=semantic-interface.d.ts.map