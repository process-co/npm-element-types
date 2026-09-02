import { z } from 'zod';
export declare const CompiledInterfaceMappingDescriptorSchema: z.ZodObject<{
    mappingId: z.ZodString;
    revisionId: z.ZodString;
    sourceInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
    targetInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
    kind: z.ZodEnum<{
        declarative: "declarative";
        "custom-adapter": "custom-adapter";
    }>;
    lossiness: z.ZodEnum<{
        lossless: "lossless";
        lossy: "lossy";
    }>;
    resolution: z.ZodEnum<{
        deterministic: "deterministic";
        probabilistic: "probabilistic";
    }>;
    status: z.ZodEnum<{
        draft: "draft";
        published: "published";
        deprecated: "deprecated";
    }>;
    contentDigest: z.ZodString;
}, z.core.$strict>;
export type CompiledInterfaceMappingExpression = {
    op: 'source';
    pointer: string;
} | {
    op: 'item';
    pointer: string;
} | {
    op: 'constant';
    value: unknown;
} | {
    op: 'object';
    fields: Record<string, CompiledInterfaceMappingExpression>;
} | {
    op: 'array';
    items: CompiledInterfaceMappingExpression[];
} | {
    op: 'map';
    input: CompiledInterfaceMappingExpression;
    item: CompiledInterfaceMappingExpression;
    maxItems: number;
} | {
    op: 'coalesce';
    values: CompiledInterfaceMappingExpression[];
} | {
    op: 'value-map';
    input: CompiledInterfaceMappingExpression;
    values: Record<string, unknown>;
    fallback?: CompiledInterfaceMappingExpression;
} | {
    op: 'convert';
    input: CompiledInterfaceMappingExpression;
    to: 'string' | 'number' | 'integer' | 'boolean';
} | {
    op: 'parse-date';
    input: CompiledInterfaceMappingExpression;
    invalid: 'omit' | 'error';
} | {
    op: 'transform';
    input: CompiledInterfaceMappingExpression;
    name: 'trim' | 'lowercase' | 'uppercase';
};
export declare const CompiledInterfaceMappingExpressionSchema: z.ZodType<CompiledInterfaceMappingExpression>;
export declare const CompiledInterfaceMappingLimitsSchema: z.ZodObject<{
    maxOperations: z.ZodNumber;
    maxDepth: z.ZodNumber;
    maxArrayItems: z.ZodNumber;
    maxOutputBytes: z.ZodNumber;
    maxResolverFields: z.ZodNumber;
    maxEvidenceBytes: z.ZodNumber;
}, z.core.$strict>;
export declare const CompiledProbabilisticFieldPolicySchema: z.ZodObject<{
    targetPointer: z.ZodString;
    resolverRevisionId: z.ZodString;
    evidence: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        expression: z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>;
    }, z.core.$strict>>;
    minConfidence: z.ZodNumber;
    whenPresent: z.ZodEnum<{
        "accept-deterministic": "accept-deterministic";
        reject: "reject";
    }>;
    onAbstain: z.ZodEnum<{
        omit: "omit";
        fallback: "fallback";
        reject: "reject";
        review: "review";
    }>;
    onLowConfidence: z.ZodEnum<{
        omit: "omit";
        fallback: "fallback";
        reject: "reject";
        review: "review";
    }>;
    fallback: z.ZodOptional<z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>>;
}, z.core.$strict>;
export declare const CompiledDeclarativeMappingProgramSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    mapping: z.ZodObject<{
        mappingId: z.ZodString;
        revisionId: z.ZodString;
        sourceInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
        targetInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
        kind: z.ZodEnum<{
            declarative: "declarative";
            "custom-adapter": "custom-adapter";
        }>;
        lossiness: z.ZodEnum<{
            lossless: "lossless";
            lossy: "lossy";
        }>;
        resolution: z.ZodEnum<{
            deterministic: "deterministic";
            probabilistic: "probabilistic";
        }>;
        status: z.ZodEnum<{
            draft: "draft";
            published: "published";
            deprecated: "deprecated";
        }>;
        contentDigest: z.ZodString;
    }, z.core.$strict>;
    limits: z.ZodObject<{
        maxOperations: z.ZodNumber;
        maxDepth: z.ZodNumber;
        maxArrayItems: z.ZodNumber;
        maxOutputBytes: z.ZodNumber;
        maxResolverFields: z.ZodNumber;
        maxEvidenceBytes: z.ZodNumber;
    }, z.core.$strict>;
    root: z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>;
    probabilisticFields: z.ZodDefault<z.ZodArray<z.ZodObject<{
        targetPointer: z.ZodString;
        resolverRevisionId: z.ZodString;
        evidence: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            expression: z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>;
        }, z.core.$strict>>;
        minConfidence: z.ZodNumber;
        whenPresent: z.ZodEnum<{
            "accept-deterministic": "accept-deterministic";
            reject: "reject";
        }>;
        onAbstain: z.ZodEnum<{
            omit: "omit";
            fallback: "fallback";
            reject: "reject";
            review: "review";
        }>;
        onLowConfidence: z.ZodEnum<{
            omit: "omit";
            fallback: "fallback";
            reject: "reject";
            review: "review";
        }>;
        fallback: z.ZodOptional<z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const CompiledCustomAdapterArtifactSchema: z.ZodObject<{
    runtime: z.ZodEnum<{
        nodejs: "nodejs";
        quickjs: "quickjs";
    }>;
    artifactPath: z.ZodString;
    exportName: z.ZodString;
    contentDigest: z.ZodString;
}, z.core.$strict>;
export declare const CompiledInterfaceMappingArtifactSchema: z.ZodObject<{
    descriptor: z.ZodObject<{
        mappingId: z.ZodString;
        revisionId: z.ZodString;
        sourceInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
        targetInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
        kind: z.ZodEnum<{
            declarative: "declarative";
            "custom-adapter": "custom-adapter";
        }>;
        lossiness: z.ZodEnum<{
            lossless: "lossless";
            lossy: "lossy";
        }>;
        resolution: z.ZodEnum<{
            deterministic: "deterministic";
            probabilistic: "probabilistic";
        }>;
        status: z.ZodEnum<{
            draft: "draft";
            published: "published";
            deprecated: "deprecated";
        }>;
        contentDigest: z.ZodString;
    }, z.core.$strict>;
    implementation: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"declarative">;
        program: z.ZodObject<{
            version: z.ZodLiteral<1>;
            mapping: z.ZodObject<{
                mappingId: z.ZodString;
                revisionId: z.ZodString;
                sourceInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
                targetInterface: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
                kind: z.ZodEnum<{
                    declarative: "declarative";
                    "custom-adapter": "custom-adapter";
                }>;
                lossiness: z.ZodEnum<{
                    lossless: "lossless";
                    lossy: "lossy";
                }>;
                resolution: z.ZodEnum<{
                    deterministic: "deterministic";
                    probabilistic: "probabilistic";
                }>;
                status: z.ZodEnum<{
                    draft: "draft";
                    published: "published";
                    deprecated: "deprecated";
                }>;
                contentDigest: z.ZodString;
            }, z.core.$strict>;
            limits: z.ZodObject<{
                maxOperations: z.ZodNumber;
                maxDepth: z.ZodNumber;
                maxArrayItems: z.ZodNumber;
                maxOutputBytes: z.ZodNumber;
                maxResolverFields: z.ZodNumber;
                maxEvidenceBytes: z.ZodNumber;
            }, z.core.$strict>;
            root: z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>;
            probabilisticFields: z.ZodDefault<z.ZodArray<z.ZodObject<{
                targetPointer: z.ZodString;
                resolverRevisionId: z.ZodString;
                evidence: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    expression: z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>;
                }, z.core.$strict>>;
                minConfidence: z.ZodNumber;
                whenPresent: z.ZodEnum<{
                    "accept-deterministic": "accept-deterministic";
                    reject: "reject";
                }>;
                onAbstain: z.ZodEnum<{
                    omit: "omit";
                    fallback: "fallback";
                    reject: "reject";
                    review: "review";
                }>;
                onLowConfidence: z.ZodEnum<{
                    omit: "omit";
                    fallback: "fallback";
                    reject: "reject";
                    review: "review";
                }>;
                fallback: z.ZodOptional<z.ZodType<CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<CompiledInterfaceMappingExpression, unknown>>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"custom-adapter">;
        adapter: z.ZodObject<{
            runtime: z.ZodEnum<{
                nodejs: "nodejs";
                quickjs: "quickjs";
            }>;
            artifactPath: z.ZodString;
            exportName: z.ZodString;
            contentDigest: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>;
export type CompiledInterfaceMappingDescriptor = z.infer<typeof CompiledInterfaceMappingDescriptorSchema>;
export type CompiledDeclarativeMappingProgram = z.infer<typeof CompiledDeclarativeMappingProgramSchema>;
export type CompiledInterfaceMappingArtifact = z.infer<typeof CompiledInterfaceMappingArtifactSchema>;
//# sourceMappingURL=interface-mapping-contract.d.ts.map