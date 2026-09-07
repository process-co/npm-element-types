import { z } from 'zod';
export declare const DurableActionLifecycleSchema: z.ZodEnum<{
    proposed: "proposed";
    executing: "executing";
    succeeded: "succeeded";
    failed: "failed";
    denied: "denied";
    cancelled: "cancelled";
    unknown: "unknown";
    preparing: "preparing";
    waiting: "waiting";
    observing: "observing";
    reconciling: "reconciling";
    expired: "expired";
}>;
export declare const DurableActionEffectBindingSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"local-action">;
    actionKey: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"authored-callable">;
    definitionFern: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"pinned-callable">;
    resource: z.ZodType<import("./callable-resource").CallableResourceReference, unknown, z.core.$ZodTypeInternals<import("./callable-resource").CallableResourceReference, unknown>>;
}, z.core.$strict>], "kind">;
declare const DurableActionEffectSchema: z.ZodObject<{
    binding: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"local-action">;
        actionKey: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"authored-callable">;
        definitionFern: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"pinned-callable">;
        resource: z.ZodType<import("./callable-resource").CallableResourceReference, unknown, z.core.$ZodTypeInternals<import("./callable-resource").CallableResourceReference, unknown>>;
    }, z.core.$strict>], "kind">;
    inputMapping: z.ZodOptional<z.ZodObject<{
        version: z.ZodLiteral<1>;
        strategy: z.ZodEnum<{
            selected: "selected";
            concurrent: "concurrent";
            iterate: "iterate";
        }>;
        sources: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            schema: z.ZodOptional<z.ZodUnknown>;
            optional: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        targetSchema: z.ZodOptional<z.ZodUnknown>;
        defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
            error: "error";
            first: "first";
            last: "last";
            replace: "replace";
            deepMerge: "deepMerge";
            append: "append";
            keyed: "keyed";
        }>>;
        targetCoverage: z.ZodOptional<z.ZodEnum<{
            partial: "partial";
            required: "required";
            all: "all";
        }>>;
        rules: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            sourceId: z.ZodString;
            sourceExpression: z.ZodString;
            destinationPath: z.ZodString;
            sourceType: z.ZodOptional<z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                object: "object";
                integer: "integer";
                array: "array";
                null: "null";
                unknown: "unknown";
            }>>;
            destinationType: z.ZodOptional<z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                object: "object";
                integer: "integer";
                array: "array";
                null: "null";
                unknown: "unknown";
            }>>;
            writePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            keyExpression: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    outputProjection: z.ZodOptional<z.ZodObject<{
        version: z.ZodLiteral<1>;
        strategy: z.ZodEnum<{
            selected: "selected";
            concurrent: "concurrent";
            iterate: "iterate";
        }>;
        sources: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            schema: z.ZodOptional<z.ZodUnknown>;
            optional: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        targetSchema: z.ZodOptional<z.ZodUnknown>;
        defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
            error: "error";
            first: "first";
            last: "last";
            replace: "replace";
            deepMerge: "deepMerge";
            append: "append";
            keyed: "keyed";
        }>>;
        targetCoverage: z.ZodOptional<z.ZodEnum<{
            partial: "partial";
            required: "required";
            all: "all";
        }>>;
        rules: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            sourceId: z.ZodString;
            sourceExpression: z.ZodString;
            destinationPath: z.ZodString;
            sourceType: z.ZodOptional<z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                object: "object";
                integer: "integer";
                array: "array";
                null: "null";
                unknown: "unknown";
            }>>;
            destinationType: z.ZodOptional<z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                object: "object";
                integer: "integer";
                array: "array";
                null: "null";
                unknown: "unknown";
            }>>;
            writePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            keyExpression: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    settlementEvents: z.ZodObject<{
        succeeded: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
        failed: z.ZodString;
        cancelled: z.ZodOptional<z.ZodString>;
        timedOut: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
declare const DurableActionDefinitionObjectSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    key: z.ZodString;
    contract: z.ZodString;
    initial: z.ZodString;
    states: z.ZodRecord<z.ZodString, z.ZodObject<{
        lifecycle: z.ZodEnum<{
            proposed: "proposed";
            executing: "executing";
            succeeded: "succeeded";
            failed: "failed";
            denied: "denied";
            cancelled: "cancelled";
            unknown: "unknown";
            preparing: "preparing";
            waiting: "waiting";
            observing: "observing";
            reconciling: "reconciling";
            expired: "expired";
        }>;
        final: z.ZodDefault<z.ZodBoolean>;
        on: z.ZodDefault<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            target: z.ZodString;
            effects: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    effects: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        binding: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"local-action">;
            actionKey: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"authored-callable">;
            definitionFern: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pinned-callable">;
            resource: z.ZodType<import("./callable-resource").CallableResourceReference, unknown, z.core.$ZodTypeInternals<import("./callable-resource").CallableResourceReference, unknown>>;
        }, z.core.$strict>], "kind">;
        inputMapping: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        outputProjection: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        settlementEvents: z.ZodObject<{
            succeeded: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
            failed: z.ZodString;
            cancelled: z.ZodOptional<z.ZodString>;
            timedOut: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    commands: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        intent: z.ZodString;
        event: z.ZodString;
        allowedStates: z.ZodArray<z.ZodString>;
        inputMapping: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    timers: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        delayMs: z.ZodNumber;
        event: z.ZodString;
        startInStates: z.ZodArray<z.ZodString>;
        cancelInStates: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
    resources: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        kind: z.ZodString;
        mutableExternally: z.ZodBoolean;
        identity: z.ZodObject<{
            providerInstallationIdPath: z.ZodString;
            accountIdPath: z.ZodString;
            resourceIdPath: z.ZodString;
            tenantIdPath: z.ZodOptional<z.ZodString>;
            containerIdPath: z.ZodOptional<z.ZodString>;
            parentResourceIdPath: z.ZodOptional<z.ZodString>;
            versionPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        retainAfterTerminalSeconds: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>>;
    observations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        profile: z.ZodString;
        event: z.ZodString;
        resource: z.ZodString;
        machineEvent: z.ZodString;
        evidence: z.ZodEnum<{
            hint: "hint";
            authoritative: "authoritative";
        }>;
        reconcile: z.ZodEnum<{
            never: "never";
            always: "always";
            "when-uncertain": "when-uncertain";
        }>;
    }, z.core.$strict>>>;
    reconciliation: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        resource: z.ZodString;
        effect: z.ZodString;
        triggers: z.ZodArray<z.ZodEnum<{
            "after-effect": "after-effect";
            observation: "observation";
            resume: "resume";
            timer: "timer";
            "unknown-settlement": "unknown-settlement";
        }>>;
        freshnessSeconds: z.ZodNumber;
        maxAttempts: z.ZodNumber;
        backoff: z.ZodObject<{
            kind: z.ZodEnum<{
                fixed: "fixed";
                exponential: "exponential";
            }>;
            initialDelayMs: z.ZodNumber;
            maxDelayMs: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    presentations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        states: z.ZodArray<z.ZodString>;
        surface: z.ZodObject<{
            actionKey: z.ZodString;
            surfaceKey: z.ZodString;
        }, z.core.$strict>;
        mode: z.ZodEnum<{
            proposal: "proposal";
            receipt: "receipt";
        }>;
        commands: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type DurableActionDefinitionInput = z.infer<typeof DurableActionDefinitionObjectSchema>;
export declare const DurableActionDefinitionSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    key: z.ZodString;
    contract: z.ZodString;
    initial: z.ZodString;
    states: z.ZodRecord<z.ZodString, z.ZodObject<{
        lifecycle: z.ZodEnum<{
            proposed: "proposed";
            executing: "executing";
            succeeded: "succeeded";
            failed: "failed";
            denied: "denied";
            cancelled: "cancelled";
            unknown: "unknown";
            preparing: "preparing";
            waiting: "waiting";
            observing: "observing";
            reconciling: "reconciling";
            expired: "expired";
        }>;
        final: z.ZodDefault<z.ZodBoolean>;
        on: z.ZodDefault<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            target: z.ZodString;
            effects: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    effects: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        binding: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"local-action">;
            actionKey: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"authored-callable">;
            definitionFern: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pinned-callable">;
            resource: z.ZodType<import("./callable-resource").CallableResourceReference, unknown, z.core.$ZodTypeInternals<import("./callable-resource").CallableResourceReference, unknown>>;
        }, z.core.$strict>], "kind">;
        inputMapping: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        outputProjection: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        settlementEvents: z.ZodObject<{
            succeeded: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
            failed: z.ZodString;
            cancelled: z.ZodOptional<z.ZodString>;
            timedOut: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    commands: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        intent: z.ZodString;
        event: z.ZodString;
        allowedStates: z.ZodArray<z.ZodString>;
        inputMapping: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    timers: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        delayMs: z.ZodNumber;
        event: z.ZodString;
        startInStates: z.ZodArray<z.ZodString>;
        cancelInStates: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
    resources: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        kind: z.ZodString;
        mutableExternally: z.ZodBoolean;
        identity: z.ZodObject<{
            providerInstallationIdPath: z.ZodString;
            accountIdPath: z.ZodString;
            resourceIdPath: z.ZodString;
            tenantIdPath: z.ZodOptional<z.ZodString>;
            containerIdPath: z.ZodOptional<z.ZodString>;
            parentResourceIdPath: z.ZodOptional<z.ZodString>;
            versionPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        retainAfterTerminalSeconds: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>>;
    observations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        profile: z.ZodString;
        event: z.ZodString;
        resource: z.ZodString;
        machineEvent: z.ZodString;
        evidence: z.ZodEnum<{
            hint: "hint";
            authoritative: "authoritative";
        }>;
        reconcile: z.ZodEnum<{
            never: "never";
            always: "always";
            "when-uncertain": "when-uncertain";
        }>;
    }, z.core.$strict>>>;
    reconciliation: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        resource: z.ZodString;
        effect: z.ZodString;
        triggers: z.ZodArray<z.ZodEnum<{
            "after-effect": "after-effect";
            observation: "observation";
            resume: "resume";
            timer: "timer";
            "unknown-settlement": "unknown-settlement";
        }>>;
        freshnessSeconds: z.ZodNumber;
        maxAttempts: z.ZodNumber;
        backoff: z.ZodObject<{
            kind: z.ZodEnum<{
                fixed: "fixed";
                exponential: "exponential";
            }>;
            initialDelayMs: z.ZodNumber;
            maxDelayMs: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    presentations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        states: z.ZodArray<z.ZodString>;
        surface: z.ZodObject<{
            actionKey: z.ZodString;
            surfaceKey: z.ZodString;
        }, z.core.$strict>;
        mode: z.ZodEnum<{
            proposal: "proposal";
            receipt: "receipt";
        }>;
        commands: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const DurableActionDefinitionsSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    key: z.ZodString;
    contract: z.ZodString;
    initial: z.ZodString;
    states: z.ZodRecord<z.ZodString, z.ZodObject<{
        lifecycle: z.ZodEnum<{
            proposed: "proposed";
            executing: "executing";
            succeeded: "succeeded";
            failed: "failed";
            denied: "denied";
            cancelled: "cancelled";
            unknown: "unknown";
            preparing: "preparing";
            waiting: "waiting";
            observing: "observing";
            reconciling: "reconciling";
            expired: "expired";
        }>;
        final: z.ZodDefault<z.ZodBoolean>;
        on: z.ZodDefault<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            target: z.ZodString;
            effects: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    effects: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        binding: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"local-action">;
            actionKey: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"authored-callable">;
            definitionFern: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"pinned-callable">;
            resource: z.ZodType<import("./callable-resource").CallableResourceReference, unknown, z.core.$ZodTypeInternals<import("./callable-resource").CallableResourceReference, unknown>>;
        }, z.core.$strict>], "kind">;
        inputMapping: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        outputProjection: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        settlementEvents: z.ZodObject<{
            succeeded: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
            failed: z.ZodString;
            cancelled: z.ZodOptional<z.ZodString>;
            timedOut: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    commands: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        intent: z.ZodString;
        event: z.ZodString;
        allowedStates: z.ZodArray<z.ZodString>;
        inputMapping: z.ZodOptional<z.ZodObject<{
            version: z.ZodLiteral<1>;
            strategy: z.ZodEnum<{
                selected: "selected";
                concurrent: "concurrent";
                iterate: "iterate";
            }>;
            sources: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodOptional<z.ZodUnknown>;
                optional: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
            targetSchema: z.ZodOptional<z.ZodUnknown>;
            defaultWritePolicy: z.ZodOptional<z.ZodEnum<{
                error: "error";
                first: "first";
                last: "last";
                replace: "replace";
                deepMerge: "deepMerge";
                append: "append";
                keyed: "keyed";
            }>>;
            targetCoverage: z.ZodOptional<z.ZodEnum<{
                partial: "partial";
                required: "required";
                all: "all";
            }>>;
            rules: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                sourceId: z.ZodString;
                sourceExpression: z.ZodString;
                destinationPath: z.ZodString;
                sourceType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                destinationType: z.ZodOptional<z.ZodEnum<{
                    string: "string";
                    number: "number";
                    boolean: "boolean";
                    object: "object";
                    integer: "integer";
                    array: "array";
                    null: "null";
                    unknown: "unknown";
                }>>;
                writePolicy: z.ZodOptional<z.ZodEnum<{
                    error: "error";
                    first: "first";
                    last: "last";
                    replace: "replace";
                    deepMerge: "deepMerge";
                    append: "append";
                    keyed: "keyed";
                }>>;
                keyExpression: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    timers: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        delayMs: z.ZodNumber;
        event: z.ZodString;
        startInStates: z.ZodArray<z.ZodString>;
        cancelInStates: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
    resources: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        kind: z.ZodString;
        mutableExternally: z.ZodBoolean;
        identity: z.ZodObject<{
            providerInstallationIdPath: z.ZodString;
            accountIdPath: z.ZodString;
            resourceIdPath: z.ZodString;
            tenantIdPath: z.ZodOptional<z.ZodString>;
            containerIdPath: z.ZodOptional<z.ZodString>;
            parentResourceIdPath: z.ZodOptional<z.ZodString>;
            versionPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        retainAfterTerminalSeconds: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>>;
    observations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        profile: z.ZodString;
        event: z.ZodString;
        resource: z.ZodString;
        machineEvent: z.ZodString;
        evidence: z.ZodEnum<{
            hint: "hint";
            authoritative: "authoritative";
        }>;
        reconcile: z.ZodEnum<{
            never: "never";
            always: "always";
            "when-uncertain": "when-uncertain";
        }>;
    }, z.core.$strict>>>;
    reconciliation: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        resource: z.ZodString;
        effect: z.ZodString;
        triggers: z.ZodArray<z.ZodEnum<{
            "after-effect": "after-effect";
            observation: "observation";
            resume: "resume";
            timer: "timer";
            "unknown-settlement": "unknown-settlement";
        }>>;
        freshnessSeconds: z.ZodNumber;
        maxAttempts: z.ZodNumber;
        backoff: z.ZodObject<{
            kind: z.ZodEnum<{
                fixed: "fixed";
                exponential: "exponential";
            }>;
            initialDelayMs: z.ZodNumber;
            maxDelayMs: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    presentations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        states: z.ZodArray<z.ZodString>;
        surface: z.ZodObject<{
            actionKey: z.ZodString;
            surfaceKey: z.ZodString;
        }, z.core.$strict>;
        mode: z.ZodEnum<{
            proposal: "proposal";
            receipt: "receipt";
        }>;
        commands: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strict>>;
export type DurableActionLifecycle = z.infer<typeof DurableActionLifecycleSchema>;
export type DurableActionEffectBinding = z.infer<typeof DurableActionEffectBindingSchema>;
export type DurableActionEffect = z.infer<typeof DurableActionEffectSchema>;
export type DurableActionDefinition = z.infer<typeof DurableActionDefinitionSchema>;
export type DurableActionDefinitions = z.infer<typeof DurableActionDefinitionsSchema>;
export type DurableActionAuthoringReferences = {
    actions: Record<string, {
        surfaceKeys?: readonly string[];
    }>;
};
/**
 * Validate element-authored Durable Actions and their references to local
 * atomic actions and already-declared action surfaces.
 *
 * Execution admission remains responsible for resolving local actions and
 * authored selectors to immutable versions and physical artifacts. This authoring
 * boundary never accepts credentials or executable provider code.
 */
export declare function parseDurableActionDefinitions(value: unknown, references: DurableActionAuthoringReferences): DurableActionDefinitions;
export {};
//# sourceMappingURL=durable-action.d.ts.map