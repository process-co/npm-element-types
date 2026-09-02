import { z } from 'zod';
export declare const CompiledInterfaceExampleSchema: z.ZodObject<{
    name: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    value: z.ZodUnknown;
}, z.core.$strict>;
export declare const CompiledInterfaceHumanDocumentationSchema: z.ZodObject<{
    summary: z.ZodString;
    description: z.ZodString;
    useWhen: z.ZodArray<z.ZodString>;
    avoidWhen: z.ZodDefault<z.ZodArray<z.ZodString>>;
    fieldNotes: z.ZodRecord<z.ZodString, z.ZodString>;
    examples: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        summary: z.ZodOptional<z.ZodString>;
        value: z.ZodUnknown;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const CompiledInterfaceAgentDocumentationSchema: z.ZodObject<{
    instructions: z.ZodArray<z.ZodString>;
    invariants: z.ZodArray<z.ZodString>;
    prohibitedInferences: z.ZodArray<z.ZodString>;
    mappingGuidance: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const CompiledInterfaceDocumentationSchema: z.ZodObject<{
    human: z.ZodObject<{
        summary: z.ZodString;
        description: z.ZodString;
        useWhen: z.ZodArray<z.ZodString>;
        avoidWhen: z.ZodDefault<z.ZodArray<z.ZodString>>;
        fieldNotes: z.ZodRecord<z.ZodString, z.ZodString>;
        examples: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            summary: z.ZodOptional<z.ZodString>;
            value: z.ZodUnknown;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    agent: z.ZodObject<{
        instructions: z.ZodArray<z.ZodString>;
        invariants: z.ZodArray<z.ZodString>;
        prohibitedInferences: z.ZodArray<z.ZodString>;
        mappingGuidance: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const CompiledInterfaceOwnerSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    scope: z.ZodLiteral<"system">;
}, z.core.$strict>, z.ZodObject<{
    scope: z.ZodLiteral<"organization">;
    organizationId: z.ZodString;
}, z.core.$strict>], "scope">;
export declare const CompiledInterfaceJsonSchemaSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export declare const CompiledInterfaceDataClassificationSchema: z.ZodUnion<readonly [z.ZodEnum<{
    public: "public";
    internal: "internal";
    confidential: "confidential";
    restricted: "restricted";
    "personal-data": "personal-data";
    authentication: "authentication";
    "security-observation": "security-observation";
    "policy-decision": "policy-decision";
}>, z.ZodString]>;
export declare const CompiledInterfaceCompatibilitySchema: z.ZodObject<{
    extends: z.ZodDefault<z.ZodArray<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>>;
    replaces: z.ZodOptional<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>;
}, z.core.$strict>;
export declare const CompiledInterfaceDefinitionSchema: z.ZodObject<{
    id: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
    owner: z.ZodDiscriminatedUnion<[z.ZodObject<{
        scope: z.ZodLiteral<"system">;
    }, z.core.$strict>, z.ZodObject<{
        scope: z.ZodLiteral<"organization">;
        organizationId: z.ZodString;
    }, z.core.$strict>], "scope">;
    title: z.ZodString;
    schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    documentation: z.ZodObject<{
        human: z.ZodObject<{
            summary: z.ZodString;
            description: z.ZodString;
            useWhen: z.ZodArray<z.ZodString>;
            avoidWhen: z.ZodDefault<z.ZodArray<z.ZodString>>;
            fieldNotes: z.ZodRecord<z.ZodString, z.ZodString>;
            examples: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                summary: z.ZodOptional<z.ZodString>;
                value: z.ZodUnknown;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        agent: z.ZodObject<{
            instructions: z.ZodArray<z.ZodString>;
            invariants: z.ZodArray<z.ZodString>;
            prohibitedInferences: z.ZodArray<z.ZodString>;
            mappingGuidance: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>;
    }, z.core.$strict>;
    dataClassifications: z.ZodArray<z.ZodUnion<readonly [z.ZodEnum<{
        public: "public";
        internal: "internal";
        confidential: "confidential";
        restricted: "restricted";
        "personal-data": "personal-data";
        authentication: "authentication";
        "security-observation": "security-observation";
        "policy-decision": "policy-decision";
    }>, z.ZodString]>>;
    trustedFields: z.ZodDefault<z.ZodArray<z.ZodString>>;
    compatibility: z.ZodObject<{
        extends: z.ZodDefault<z.ZodArray<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>>;
        replaces: z.ZodOptional<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const CompiledInterfaceConformanceFixtureSchema: z.ZodObject<{
    name: z.ZodString;
    expectation: z.ZodEnum<{
        invalid: "invalid";
        valid: "valid";
    }>;
    value: z.ZodUnknown;
    reason: z.ZodString;
}, z.core.$strict>;
export declare const CompiledInterfaceDefinitionArtifactSchema: z.ZodObject<{
    revisionId: z.ZodString;
    definition: z.ZodObject<{
        id: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
        owner: z.ZodDiscriminatedUnion<[z.ZodObject<{
            scope: z.ZodLiteral<"system">;
        }, z.core.$strict>, z.ZodObject<{
            scope: z.ZodLiteral<"organization">;
            organizationId: z.ZodString;
        }, z.core.$strict>], "scope">;
        title: z.ZodString;
        schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        documentation: z.ZodObject<{
            human: z.ZodObject<{
                summary: z.ZodString;
                description: z.ZodString;
                useWhen: z.ZodArray<z.ZodString>;
                avoidWhen: z.ZodDefault<z.ZodArray<z.ZodString>>;
                fieldNotes: z.ZodRecord<z.ZodString, z.ZodString>;
                examples: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    summary: z.ZodOptional<z.ZodString>;
                    value: z.ZodUnknown;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            agent: z.ZodObject<{
                instructions: z.ZodArray<z.ZodString>;
                invariants: z.ZodArray<z.ZodString>;
                prohibitedInferences: z.ZodArray<z.ZodString>;
                mappingGuidance: z.ZodDefault<z.ZodArray<z.ZodString>>;
            }, z.core.$strict>;
        }, z.core.$strict>;
        dataClassifications: z.ZodArray<z.ZodUnion<readonly [z.ZodEnum<{
            public: "public";
            internal: "internal";
            confidential: "confidential";
            restricted: "restricted";
            "personal-data": "personal-data";
            authentication: "authentication";
            "security-observation": "security-observation";
            "policy-decision": "policy-decision";
        }>, z.ZodString]>>;
        trustedFields: z.ZodDefault<z.ZodArray<z.ZodString>>;
        compatibility: z.ZodObject<{
            extends: z.ZodDefault<z.ZodArray<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>>;
            replaces: z.ZodOptional<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>;
        }, z.core.$strict>;
    }, z.core.$strict>;
    conformanceFixtures: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        expectation: z.ZodEnum<{
            invalid: "invalid";
            valid: "valid";
        }>;
        value: z.ZodUnknown;
        reason: z.ZodString;
    }, z.core.$strict>>>;
    contentDigest: z.ZodString;
}, z.core.$strict>;
export declare const CompiledStructuralTypeArtifactSchema: z.ZodObject<{
    artifactId: z.ZodString;
    role: z.ZodEnum<{
        input: "input";
        output: "output";
    }>;
    typescript: z.ZodOptional<z.ZodObject<{
        source: z.ZodString;
        typeName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    declaration: z.ZodOptional<z.ZodObject<{
        artifactPath: z.ZodString;
        typeName: z.ZodString;
        contentDigest: z.ZodString;
    }, z.core.$strict>>;
    jsonSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    contentDigest: z.ZodString;
}, z.core.$strict>;
export declare const CompiledMappingReferenceSchema: z.ZodObject<{
    mappingId: z.ZodString;
    revisionId: z.ZodString;
}, z.core.$strict>;
export declare const CompiledElementInterfaceOperationSchema: z.ZodObject<{
    operation: z.ZodObject<{
        kind: z.ZodEnum<{
            source: "source";
            action: "action";
            signal: "signal";
        }>;
        key: z.ZodString;
        fern: z.ZodString;
    }, z.core.$strict>;
    native: z.ZodObject<{
        interfaceType: z.ZodOptional<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>;
        structuralArtifactId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    accepts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        interfaceType: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
        mapping: z.ZodObject<{
            mappingId: z.ZodString;
            revisionId: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    emits: z.ZodDefault<z.ZodArray<z.ZodObject<{
        interfaceType: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
        mapping: z.ZodObject<{
            mappingId: z.ZodString;
            revisionId: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const InterfaceRegistryManifestSourceSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"process-core">;
    packageName: z.ZodString;
    packageVersion: z.ZodString;
    sourceRevision: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"element-build">;
    namespace: z.ZodString;
    sourceRepository: z.ZodString;
    sourceRevision: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"system-overlay">;
    overlayId: z.ZodString;
    revisionId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"organization">;
    organizationId: z.ZodString;
    publicationId: z.ZodString;
}, z.core.$strict>], "kind">;
export declare const InterfaceRegistryManifestSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    manifestId: z.ZodString;
    source: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"process-core">;
        packageName: z.ZodString;
        packageVersion: z.ZodString;
        sourceRevision: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"element-build">;
        namespace: z.ZodString;
        sourceRepository: z.ZodString;
        sourceRevision: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"system-overlay">;
        overlayId: z.ZodString;
        revisionId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"organization">;
        organizationId: z.ZodString;
        publicationId: z.ZodString;
    }, z.core.$strict>], "kind">;
    contentDigest: z.ZodString;
    externalDefinitions: z.ZodDefault<z.ZodArray<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>>;
    definitions: z.ZodArray<z.ZodObject<{
        revisionId: z.ZodString;
        definition: z.ZodObject<{
            id: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
            owner: z.ZodDiscriminatedUnion<[z.ZodObject<{
                scope: z.ZodLiteral<"system">;
            }, z.core.$strict>, z.ZodObject<{
                scope: z.ZodLiteral<"organization">;
                organizationId: z.ZodString;
            }, z.core.$strict>], "scope">;
            title: z.ZodString;
            schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            documentation: z.ZodObject<{
                human: z.ZodObject<{
                    summary: z.ZodString;
                    description: z.ZodString;
                    useWhen: z.ZodArray<z.ZodString>;
                    avoidWhen: z.ZodDefault<z.ZodArray<z.ZodString>>;
                    fieldNotes: z.ZodRecord<z.ZodString, z.ZodString>;
                    examples: z.ZodArray<z.ZodObject<{
                        name: z.ZodString;
                        summary: z.ZodOptional<z.ZodString>;
                        value: z.ZodUnknown;
                    }, z.core.$strict>>;
                }, z.core.$strict>;
                agent: z.ZodObject<{
                    instructions: z.ZodArray<z.ZodString>;
                    invariants: z.ZodArray<z.ZodString>;
                    prohibitedInferences: z.ZodArray<z.ZodString>;
                    mappingGuidance: z.ZodDefault<z.ZodArray<z.ZodString>>;
                }, z.core.$strict>;
            }, z.core.$strict>;
            dataClassifications: z.ZodArray<z.ZodUnion<readonly [z.ZodEnum<{
                public: "public";
                internal: "internal";
                confidential: "confidential";
                restricted: "restricted";
                "personal-data": "personal-data";
                authentication: "authentication";
                "security-observation": "security-observation";
                "policy-decision": "policy-decision";
            }>, z.ZodString]>>;
            trustedFields: z.ZodDefault<z.ZodArray<z.ZodString>>;
            compatibility: z.ZodObject<{
                extends: z.ZodDefault<z.ZodArray<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>>;
                replaces: z.ZodOptional<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>;
            }, z.core.$strict>;
        }, z.core.$strict>;
        conformanceFixtures: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            expectation: z.ZodEnum<{
                invalid: "invalid";
                valid: "valid";
            }>;
            value: z.ZodUnknown;
            reason: z.ZodString;
        }, z.core.$strict>>>;
        contentDigest: z.ZodString;
    }, z.core.$strict>>;
    structuralTypes: z.ZodArray<z.ZodObject<{
        artifactId: z.ZodString;
        role: z.ZodEnum<{
            input: "input";
            output: "output";
        }>;
        typescript: z.ZodOptional<z.ZodObject<{
            source: z.ZodString;
            typeName: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        declaration: z.ZodOptional<z.ZodObject<{
            artifactPath: z.ZodString;
            typeName: z.ZodString;
            contentDigest: z.ZodString;
        }, z.core.$strict>>;
        jsonSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        contentDigest: z.ZodString;
    }, z.core.$strict>>;
    mappings: z.ZodArray<z.ZodObject<{
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
                root: z.ZodType<import("./interface-mapping-contract").CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<import("./interface-mapping-contract").CompiledInterfaceMappingExpression, unknown>>;
                probabilisticFields: z.ZodDefault<z.ZodArray<z.ZodObject<{
                    targetPointer: z.ZodString;
                    resolverRevisionId: z.ZodString;
                    evidence: z.ZodArray<z.ZodObject<{
                        name: z.ZodString;
                        expression: z.ZodType<import("./interface-mapping-contract").CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<import("./interface-mapping-contract").CompiledInterfaceMappingExpression, unknown>>;
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
                    fallback: z.ZodOptional<z.ZodType<import("./interface-mapping-contract").CompiledInterfaceMappingExpression, unknown, z.core.$ZodTypeInternals<import("./interface-mapping-contract").CompiledInterfaceMappingExpression, unknown>>>;
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
    }, z.core.$strict>>;
    operations: z.ZodArray<z.ZodObject<{
        operation: z.ZodObject<{
            kind: z.ZodEnum<{
                source: "source";
                action: "action";
                signal: "signal";
            }>;
            key: z.ZodString;
            fern: z.ZodString;
        }, z.core.$strict>;
        native: z.ZodObject<{
            interfaceType: z.ZodOptional<z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>>;
            structuralArtifactId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        accepts: z.ZodDefault<z.ZodArray<z.ZodObject<{
            interfaceType: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
            mapping: z.ZodObject<{
                mappingId: z.ZodString;
                revisionId: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strict>>>;
        emits: z.ZodDefault<z.ZodArray<z.ZodObject<{
            interfaceType: z.ZodType<import("./semantic-interface").SemanticInterfaceTypeId, unknown, z.core.$ZodTypeInternals<import("./semantic-interface").SemanticInterfaceTypeId, unknown>>;
            mapping: z.ZodObject<{
                mappingId: z.ZodString;
                revisionId: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const StructuralTypeObservationSchema: z.ZodObject<{
    observationId: z.ZodString;
    buildRunId: z.ZodString;
    structuralArtifactId: z.ZodString;
    source: z.ZodEnum<{
        "editor-execution": "editor-execution";
        "test-execution": "test-execution";
    }>;
    jsonSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    sampleDigest: z.ZodString;
    confidence: z.ZodNumber;
    observedAt: z.ZodISODateTime;
}, z.core.$strict>;
export declare const StructuralTypeMergeDiagnosticSchema: z.ZodObject<{
    path: z.ZodString;
    code: z.ZodEnum<{
        "type-conflict": "type-conflict";
        "requiredness-conflict": "requiredness-conflict";
        "format-conflict": "format-conflict";
        "observation-widened": "observation-widened";
    }>;
    message: z.ZodString;
    observationIds: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export type CompiledInterfaceDefinition = z.infer<typeof CompiledInterfaceDefinitionSchema>;
export type CompiledInterfaceConformanceFixture = z.infer<typeof CompiledInterfaceConformanceFixtureSchema>;
export type CompiledInterfaceDefinitionArtifact = z.infer<typeof CompiledInterfaceDefinitionArtifactSchema>;
export type CompiledStructuralTypeArtifact = z.infer<typeof CompiledStructuralTypeArtifactSchema>;
export type CompiledElementInterfaceOperation = z.infer<typeof CompiledElementInterfaceOperationSchema>;
export type InterfaceRegistryManifest = z.infer<typeof InterfaceRegistryManifestSchema>;
export type StructuralTypeObservation = z.infer<typeof StructuralTypeObservationSchema>;
export type StructuralTypeMergeDiagnostic = z.infer<typeof StructuralTypeMergeDiagnosticSchema>;
//# sourceMappingURL=interface-registry-contract.d.ts.map