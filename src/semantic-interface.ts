import { z } from 'zod';

/** A concrete major revision in the Process or organization interface taxonomy. */
export type SemanticInterfaceTypeId =
    | `process.${string}@${number}`
    | `org.${string}.${string}@${number}`;

/** Author-owned schema declaration. Publication supplies governance and immutable revision metadata. */
export type SemanticInterfaceTypeDefinition<
    Id extends SemanticInterfaceTypeId = SemanticInterfaceTypeId,
    Schema extends z.ZodTypeAny = z.ZodTypeAny,
> = {
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
    readonly conformanceFixtures?: readonly (
        | {
            readonly name: string;
            readonly expectation: 'valid';
            readonly value: z.input<Schema>;
            readonly reason: string;
        }
        | {
            readonly name: string;
            readonly expectation: 'invalid';
            readonly value: unknown;
            readonly reason: string;
        }
    )[];
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
export function defineInterfaceType<
    const Id extends SemanticInterfaceTypeId,
    const Schema extends z.ZodTypeAny,
>(definition: SemanticInterfaceTypeDefinition<Id, Schema>): SemanticInterfaceTypeDefinition<Id, Schema> {
    return definition;
}

/** Infer the value accepted by an interface declaration's Zod schema. */
export type InferSemanticInterfaceType<T extends SemanticInterfaceTypeDefinition> =
    z.output<T['schema']>;

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

const SEMANTIC_INTERFACE_ID =
    /^(?:process(?:\.[a-z][a-z0-9-]*)+|org\.[a-z0-9][a-z0-9-]{0,62}(?:\.[a-z][a-z0-9-]*)+)@[1-9]\d*$/;

/** Shared wire validator for semantic identifiers at build, ingestion, and runtime boundaries. */
export const SemanticInterfaceTypeIdSchema: z.ZodType<SemanticInterfaceTypeId> = z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(SEMANTIC_INTERFACE_ID) as z.ZodType<SemanticInterfaceTypeId>;

export const SemanticInterfaceMappingReferenceSchema = z.object({
    mappingId: z.string().trim().min(1).max(300),
    revisionId: z.string().trim().min(1).max(200),
    kind: z.enum(['declarative', 'custom-adapter']),
}).strict();

export const SemanticInterfaceProjectionDeclarationSchema = z.object({
    interfaceType: SemanticInterfaceTypeIdSchema,
    mapping: SemanticInterfaceMappingReferenceSchema,
    lossiness: z.enum(['lossless', 'lossy']),
    resolution: z.enum(['deterministic', 'probabilistic']).default('deterministic'),
}).strict();

export const ElementSemanticInterfaceDeclarationSchema = z.object({
    native: SemanticInterfaceTypeIdSchema,
    inputs: z.array(SemanticInterfaceTypeIdSchema).max(100).default([]),
    outputs: z.array(SemanticInterfaceProjectionDeclarationSchema).max(100).default([]),
}).strict();

function record(value: unknown, path: string): Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new TypeError(`${path} must be an object`);
    }
    return value as Record<string, unknown>;
}

function boundedString(value: unknown, path: string): string {
    if (typeof value !== 'string' || value.trim().length === 0 || value.length > 300) {
        throw new TypeError(`${path} must be a non-empty string of at most 300 characters`);
    }
    return value.trim();
}

/** Runtime guard used at build/publication boundaries that receive untyped JSON. */
export function parseSemanticInterfaceTypeId(
    value: unknown,
    path = 'interfaceType',
): SemanticInterfaceTypeId {
    const candidate = boundedString(value, path);
    if (!SemanticInterfaceTypeIdSchema.safeParse(candidate).success) {
        throw new TypeError(`${path} is not a valid semantic interface type identifier`);
    }
    return candidate as SemanticInterfaceTypeId;
}

/** Normalize and validate a declaration before it enters the versioned authoring catalog. */
export function parseElementSemanticInterfaceDeclaration(
    value: unknown,
): ElementSemanticInterfaceDeclaration {
    const declaration = record(value, 'interfaces');
    const inputs = declaration.inputs ?? [];
    const outputs = declaration.outputs ?? [];
    if (!Array.isArray(inputs) || inputs.length > 100) {
        throw new TypeError('interfaces.inputs must be an array of at most 100 items');
    }
    if (!Array.isArray(outputs) || outputs.length > 100) {
        throw new TypeError('interfaces.outputs must be an array of at most 100 items');
    }
    return {
        native: parseSemanticInterfaceTypeId(declaration.native, 'interfaces.native'),
        inputs: inputs.map((input, index) =>
            parseSemanticInterfaceTypeId(input, `interfaces.inputs[${index}]`)),
        outputs: outputs.map((output, index) => {
            const projection = record(output, `interfaces.outputs[${index}]`);
            const mapping = record(projection.mapping, `interfaces.outputs[${index}].mapping`);
            const kind = mapping.kind;
            const lossiness = projection.lossiness;
            const resolution = projection.resolution ?? 'deterministic';
            if (kind !== 'declarative' && kind !== 'custom-adapter') {
                throw new TypeError(`interfaces.outputs[${index}].mapping.kind is invalid`);
            }
            if (lossiness !== 'lossless' && lossiness !== 'lossy') {
                throw new TypeError(`interfaces.outputs[${index}].lossiness is invalid`);
            }
            if (resolution !== 'deterministic' && resolution !== 'probabilistic') {
                throw new TypeError(`interfaces.outputs[${index}].resolution is invalid`);
            }
            return {
                interfaceType: parseSemanticInterfaceTypeId(
                    projection.interfaceType,
                    `interfaces.outputs[${index}].interfaceType`,
                ),
                mapping: {
                    mappingId: boundedString(
                        mapping.mappingId,
                        `interfaces.outputs[${index}].mapping.mappingId`,
                    ),
                    revisionId: boundedString(
                        mapping.revisionId,
                        `interfaces.outputs[${index}].mapping.revisionId`,
                    ),
                    kind,
                },
                lossiness,
                resolution,
            };
        }),
    };
}
