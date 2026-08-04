import type { ObjectProjectionDocument } from './object-projection';
import { z } from 'zod';
/** Implementations that share the same invocation and settlement boundary. */
export type CallableImplementationKind = 'action' | 'workflowGroup' | 'workflow' | 'hosted' | 'external';
export type CallableResourceScope = 'workflow' | 'project' | 'team' | 'public';
/**
 * Execution must resolve either an immutable version or the editing session's
 * isolated draft. Mutable "latest" pointers are intentionally not executable.
 */
export type CallableVersionSelector = {
    mode: 'pinned';
    versionId: string;
    versionNumber: number;
} | {
    mode: 'draft';
    editingSessionId: string;
};
export type CallableContract = {
    /** Portable JSON Schema owned by the callable version. */
    inputSchema?: unknown;
    successSchema?: unknown;
    errorSchema?: unknown;
};
/**
 * Immutable physical artifact selected when a callable snapshot is published.
 * Logical identity remains in `definitionFern`; runtimes use this locator
 * without consulting a mutable `latest` pointer.
 */
export type CallableRuntimeTarget = {
    artifactKey: string;
    /** Stable cache identity for this exact artifact (normally the Version.id). */
    artifactIdentity: string;
};
/** Stable resource identity plus the exact implementation selected to run. */
export type CallableResourceReference = {
    stableId: string;
    definitionFern?: string;
    implementationKind: CallableImplementationKind;
    scope: CallableResourceScope;
    version: CallableVersionSelector;
    runtimeTarget?: CallableRuntimeTarget;
    contract?: CallableContract;
};
/** A node is an invocation of a resource, not a copy of its implementation. */
export type CallableInvocationDefinition = {
    version: 1;
    instanceId: string;
    resource: CallableResourceReference;
    inputMapping?: ObjectProjectionDocument;
    outputProjection?: ObjectProjectionDocument;
    timeoutMs?: number | null;
    idempotencyExpression?: string;
    retry?: CallableRetryPolicy;
    errorPolicy?: CallableInvocationErrorPolicy;
};
export type CallableRetryPolicy = {
    maxAttempts: number;
    backoff?: 'none' | 'fixed' | 'exponential';
    initialDelayMs?: number;
    maxDelayMs?: number;
    retryableCodes?: readonly string[];
};
export type CallableInvocationErrorPolicy = {
    action: 'propagate';
} | {
    action: 'continue';
} | {
    action: 'invokeRecovery';
    recoveryCallable: CallableResourceReference;
};
export declare const ObjectProjectionDocumentSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const CallableVersionSelectorSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    mode: z.ZodLiteral<"pinned">;
    versionId: z.ZodString;
    versionNumber: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    mode: z.ZodLiteral<"draft">;
    editingSessionId: z.ZodString;
}, z.core.$strict>], "mode">;
export declare const CallableResourceReferenceSchema: z.ZodType<CallableResourceReference>;
/** Runtime validator used at publish boundaries before an invocation is cached. */
export declare const CallableInvocationDefinitionSchema: z.ZodType<CallableInvocationDefinition>;
export type CallableInvocationIdentity = {
    executionId: string;
    invocationId: string;
    instanceId: string;
    workflowId: string;
    nodeId: string;
    attempt: number;
    parentInvocationId?: string;
    causationId?: string;
    correlationId?: string;
    containerId?: string;
    slotId?: string;
};
export type CallableErrorEnvelope = {
    code: string;
    message: string;
    retryable: boolean;
    sourceInstanceId: string;
    phase: 'mapping' | 'dispatch' | 'execution' | 'settlement' | 'timeout' | 'cancellation';
    identity: CallableInvocationIdentity;
    cause?: CallableErrorEnvelope;
    details?: unknown;
};
export type CallableInvocationPolicySnapshot = {
    timeoutMs?: number | null;
    retry?: CallableRetryPolicy;
    errorPolicy?: CallableInvocationErrorPolicy;
};
/**
 * Runtime call boundary shared by native, hosted, workflow and external
 * implementations. The resource and policy are snapshots captured when the
 * call begins; mutable editor/catalog state is never consulted during replay.
 */
export type CallableInvocationEnvelope<T = unknown> = {
    version: 1;
    identity: CallableInvocationIdentity;
    resource: CallableResourceReference;
    input: T;
    policy: CallableInvocationPolicySnapshot;
    startedAt: string;
    deadlineAt?: string;
    contextCapabilities?: readonly string[];
};
/** Canonical result used by actions, groups, workflows and recovery handlers. */
export type CallableSettlement<T = unknown> = {
    status: 'succeeded';
    output: T;
} | {
    status: 'failed';
    error: CallableErrorEnvelope;
} | {
    status: 'cancelled';
    reason?: string;
} | {
    status: 'timedOut';
    error: CallableErrorEnvelope;
};
export type CallableRecoveryDecision<T = unknown> = {
    action: 'propagate';
} | {
    action: 'continue';
    output?: T;
} | {
    action: 'retry';
    delayMs?: number;
} | {
    action: 'replace';
    output: T;
} | {
    action: 'route';
    target: string;
    output?: T;
} | {
    action: 'compensate';
    callable: CallableResourceReference;
    input?: unknown;
};
export declare const CallableInvocationIdentitySchema: z.ZodType<CallableInvocationIdentity>;
export declare const CallableErrorEnvelopeSchema: z.ZodType<CallableErrorEnvelope>;
export declare const CallableInvocationPolicySnapshotSchema: z.ZodType<CallableInvocationPolicySnapshot>;
export declare const CallableInvocationEnvelopeSchema: z.ZodType<CallableInvocationEnvelope>;
export declare const CallableSettlementSchema: z.ZodType<CallableSettlement>;
export declare const CallableRecoveryDecisionSchema: z.ZodType<CallableRecoveryDecision>;
//# sourceMappingURL=callable-resource.d.ts.map