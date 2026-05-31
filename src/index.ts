/// <reference types="node" />
import type { z } from 'zod';

// Element types
export type ElementString = { type: "string"; label?: string; description?: string };
export type ElementObject = { type: "object"; label?: string; description?: string };
export type ElementNumber = { type: "number"; label?: string; description?: string };
export type ElementInteger = { type: "integer"; label?: string; description?: string };
export type ElementBoolean = { type: "boolean"; label?: string; description?: string };
export type ElementApp<T> = { type: "app"; app: T };

export type ElementAction<T> = { type: "action"; icon?: ElementIcon; label?: string; description?: string } & T;
export type ElementSource<T> = { type: "source"; icon?: ElementIcon; label?: string; description?: string } & T;
export type ElementTrigger<T> = { type: "trigger"; icon?: ElementIcon; label?: string; description?: string } & T;
export type ElementSignal<T> = { type: "signal"; icon?: ElementIcon; label?: string; description?: string } & T;

export type ElementIcon = { type: "FontAwesome" | "MaterialIcons" | "ProcessIcons" | "RemoteImage" | "image"; icon: string | ['far' | 'fas' | 'fab' | 'fal' | 'fad', string] } | string;

import type {
    ISlotInstanceDefinition,
    ISlotStaticInstanceDefinition,
    ISlotDefinition,
} from './slot-definition';
import { ConfigureResponseCachingOptions } from './http-request-cache';
import type { ConfigureIngressFiltersOptions } from './ingress-filters';

export type { ISlotInstanceDefinition, ISlotStaticInstanceDefinition, ISlotDefinition };

export {
    builtinActionSlotsRegistry,
    type BuiltinActionSlotsRegistry,
    type BuiltinActionSlotsFern,
    type InferBuiltinActionSlots,
} from './builtin-action-slots-registry';

/** Full **`process-element` CLI** JSON shape (types only; materialize in **`@process.co/compatibility`** **`authoring-spec`**). */
export type {
    ProcessElementPropCliWire,
    ProcessElementActionCliWire,
    ProcessElementSignalCliWire,
    ProcessElementCliOutputWire,
} from './process-element-cli-output';

/** Locked authoring catalog **types** + version (runtime materialize: **`@process.co/compatibility`** **`authoring-spec`**). */
export { ELEMENT_AUTHORING_CONTRACT_VERSION } from './authoring-contract-types';
export type {
    AuthoringPropWireKind,
    AuthoringPropContract,
    SlotBranchAuthoringContract,
    SlotsAuthoringContract,
    ActionAuthoringContract,
    SignalAuthoringContract,
    ElementAuthoringCatalogContract,
    ChildStepsPropertyForBranch,
    ActionPropKeys,
    ActionContractByFern,
    FernAuthoringShardFileV1,
} from './authoring-contract-types';

export {
    PLATFORM_BOUND_LOADER_TYPE_PREFIXES,
    isPlatformBoundLoaderType,
} from './platform-loader-type';

export {
    HTTP_REQUEST_CACHE_POLICY_KEY,
    REPLAY_BINDING_RANGE,
    REPLAY_META_RANGE,
    type BodyVaryProjection,
    type CacheVaryInfoWire,
    type ConfigureResponseCachingOptions,
    type DurationWire,
    type HttpRequestCacheMode,
    type HttpRequestCachePolicy,
    type HttpRequestCacheVary,
} from './http-request-cache';

export {
    INGRESS_FILTERS_KEY,
    INGRESS_FILTER_TYPES,
    type ConfigureIngressFiltersOptions,
    type IngressAuthExtract,
    type IngressChallengeResponseFilter,
    type IngressFilterDescriptor,
    type IngressFiltersPolicy,
    type IngressHMACVerifyFilter,
    type IngressHttpNewRequestsFilter,
    type IngressJSONPathMetaFilter,
    type IngressRespondThenEmitFilter,
    type IngressVerifyAuthFilter,
    type IngressVerifyAuthKind,
} from './ingress-filters';

// Base types for module definitions
export type ModuleDefinition = {
    type: string;
    app: string;
    propDefinitions: Record<string, unknown>;
    methods: Record<string, (params: any) => Promise<unknown>>;
};

export type ProcessTicket = {
    requestId: string;
    timestamp: string;
    executionId: string;
    flowId: string;
    source: 'webhook' | 'smtp' | 'manual' | 'scheduled';
    verified: boolean;
    buildId: string;
}

export type SignalEventShape = {

    $$process: ProcessTicket;

    method: string;

    path: string;

    query: {
        [key: string]: string;
    };

    hostname: string;

    headers: {
        [key: string]: string;
    };

    bodyRaw: string | Buffer | NodeJS.ReadableStream | undefined;

    body: {
        [key: string]: JSONValue;
    } | string | Buffer | NodeJS.ReadableStream;

};

/**
 * Persisted subset of `$.interface.schema` (HTTP triggers, etc.) used at execution.
 *
 * Design-time fields (`exportSchema`, `exportSchemaZodex`, `exportSchemaSource`,
 * `compiledValidatorKey`) are authoring/typing metadata used by the editor for type
 * inference, completion, and tooling. They never trigger runtime validation by themselves.
 *
 * Runtime Zod enforcement is controlled exclusively by {@link HttpInterfaceSchemaWire.validation}:
 * when `validation === true` the runner loads the compiled ESM at
 * {@link HttpInterfaceSchemaWire.compiledValidatorKey} (default export = Zod schema) and
 * runs full `safeParse` on the payload via {@link SignalRunHostServices.enforceSchema}
 * (see {@link setSignalEmitValidationHost}). When `validation` is `undefined` or `false`,
 * the schema is treated as types-only and the value is passed through unchanged.
 */
export type HttpInterfaceSchemaWire = {
    /**
     * When true, `enforceSchema` runs the **compiled** default-export Zod schema for this interface
     * (full parse/transform/refine), not a lightweight check of `exportSchema` alone.
     */
    validation?: boolean;
    exportSchema?: Record<string, JSONValue>;
    exportSchemaZodex?: Record<string, JSONValue>;
    exportSchemaSource?: string;
    exportSchemaKey?: string | null;
    /** S3 object key (element-registry bucket) for compiled ESM whose default export is the Zod schema used at runtime. */
    compiledValidatorKey?: string | null;
    /**
     * Client-issued token stored with the interface schema blob; included in validator artifact paths
     * so successive saves and draft/live rows do not share one S3 prefix unless intended.
     */
    schemaBuildKey?: string;
    /**
     * When set, the API may coerce **string** leaf values to number / boolean / bigint / Date **only
     * where the compiled Zod schema expects those types** (schema-guided), before `safeParse`.
     *
     * - `'auto'` (default when omitted): enable for form-like `Content-Type` (`application/x-www-form-urlencoded`,
     *   `multipart/form-data`). Typical JSON bodies skip coercion so numeric strings stay strings.
     * - `true`: always run schema-guided coercion.
     * - `false`: never coerce (strict).
     */
    coerceLeafPrimitives?: boolean | 'auto';
};

/**
 * Host `params.$` during signal **`run`** (live webhook / test execution).
 * Not passed to `hooks.save` — use {@link SignalSaveHookHostServices} there.
 */
export type SignalRunHostServices = {
    export: (category: string, message: string) => void | Promise<void>;

    $transitionToSlot: (slots: Array<SlotTransitionDefinition>) => void | Promise<void>;

    /**
     * When `inputSchema.validation` is set, runs the published **full Zod** validator for that
     * interface (`compiledValidatorKey`); otherwise may no-op. Implemented by the Process API
     * (validator worker + `safeParse`), not by element code.
     */
    enforceSchema: <T>(
        inputSchema: HttpInterfaceSchemaWire | undefined,
        value: unknown,
    ) => Promise<EnforceSchemaResult<T>>;

    /**
     * Wire for the primary `$.interface.schema` property (same persisted object the publish
     * pipeline attaches `compiledValidatorKey` to). Use with {@link SignalRunHostServices.enforceSchema},
     * e.g. `await $.enforceSchema($.interfaceEmitSchema, toEmit)`.
     */
    interfaceEmitSchema?: HttpInterfaceSchemaWire;

    /**
     * Runtime metadata (parsed FERN info) for the currently-executing signal.
     * See {@link ProcessRuntimeContext}.
     */
    runtime?: ProcessRuntimeContext;
};

/** @deprecated Use {@link SignalRunHostServices} for `run`; hook `$` types are separate. */
export type SignalHostServices = SignalRunHostServices;

/** Shared on all signal hook `params.$` surfaces. */
export type SignalHookHostContext = {
    /**
     * `true` when the hook runs during draft/editor materialization;
     * `false` on publish / production hook runs.
     */
    isDraft: boolean;
};

/** Host `params.$` during **`hooks.save`**. */
export type SignalSaveHookHostServices = SignalHookHostContext & {
    http: {
    
        /**
         * Configure response caching for this signal.
         * @param options - The options for configuring response caching.
         * @returns A promise that resolves when the response caching is configured.
         */
        configureResponseCaching: (
            options: ConfigureResponseCachingOptions,
        ) => Promise<void> | void;

        /**
         * Declare a Go-native ingress filter chain for this signal.
         * The chain is validated at publish time and persisted onto the
         * element row at `$ingressFilters`. The Go edge executes the filters
         * in order **instead of** proxying back to Node.
         *
         * Omit (or call with an empty list) to fall back to the default
         * `ext_proc` proxy.
         */
        configureIngressFilters: (
            options: ConfigureIngressFiltersOptions,
        ) => Promise<void> | void;
    };

};

/** @deprecated Use {@link SignalSaveHookHostServices} */
export type HookSaveHostServices = SignalSaveHookHostServices;

/** Host `params.$` during `hooks.activate` / `hooks.deactivate`. */
export type SignalLifecycleHookHostServices = SignalHookHostContext &
    Pick<SignalRunHostServices, 'export'>;

/** Inputs used to resolve {@link SignalHookHostContext.isDraft} in the API runner. */
export type SignalHookDraftContextInput = {
    isDraft?: boolean;
    executionContext?: 'editor' | 'production' | 'test' | 'webhook' | (string & {});
};

/** Resolve `$.isDraft` for hook invocations (explicit flag wins; else `executionContext === 'editor'`). */
export function resolveSignalHookIsDraft(ctx: SignalHookDraftContextInput): boolean {
    if (typeof ctx.isDraft === 'boolean') {
        return ctx.isDraft;
    }
    return ctx.executionContext === 'editor';
}

/** One row from a failed Zod `safeParse` (host / `validateEmitPayload`). */
export type SchemaValidationIssue = {
    path: string;
    message: string;
    code: string;
};

export type EnforceSchemaResult<T extends unknown = unknown> =
    | {
        ok: true;
        value: T;
    }
    | {
        ok: false;
        message: string;
        issues?: SchemaValidationIssue[];
    };

/**
 * Marker on successful `schema.enforce` RPC results from the Process API.
 * Zod-validated HTTP bodies may legally include their own `ok` / `value` fields; this
 * discriminant prevents {@link validateEmitPayload} (and worker RPC unwrap) from
 * confusing user payloads with the host envelope.
 *
 * Keep in sync with `apps/api` `DynamicRunnerService` `schema.enforce` and `runner-host` unwrap.
 */
export const PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = 'enforceSchema' as const;

export type SignalRunOptions = {
    $: SignalRunHostServices;
    event: SignalEventShape;
};

export type ValidateEmitPayloadResult<T> =
    | { ok: true; value: T }
    | { ok: false; message: string; issues?: SchemaValidationIssue[] };

/** Shared across bundled copies of this package in the same JS realm (worker isolate). */
const SIGNAL_EMIT_VALIDATION_HOST = Symbol.for('process.co.signalEmitValidationHost');

/**
 * Host shape accepted from the runner RPC bridge (`$.enforceSchema` may be typed as
 * returning `Promise<unknown>` while {@link SignalRunHostServices} uses a generic `T`).
 */
export type SignalEmitValidationHostBinding =
    | Pick<SignalRunHostServices, 'enforceSchema'>
    | {
        enforceSchema?: (
            inputSchema: HttpInterfaceSchemaWire | undefined,
            value: unknown,
        ) => Promise<unknown>;
    };

function getSignalEmitValidationHostBinding(): Pick<SignalRunHostServices, 'enforceSchema'> | undefined {
    return (globalThis as Record<symbol, Pick<SignalRunHostServices, 'enforceSchema'> | undefined>)[
        SIGNAL_EMIT_VALIDATION_HOST
    ];
}

/**
 * Binds the trusted signal host used by {@link validateEmitPayload} for the current
 * invocation. The runner sets this from the RPC/proxy host **outside** element code and
 * clears it when the invocation completes. Uses `globalThis` so a bundled copy of
 * `validateEmitPayload` inside an element module still sees the same binding as the runner.
 */
export function setSignalEmitValidationHost(
    host: SignalEmitValidationHostBinding | undefined,
): void {
    const g = globalThis as Record<symbol, Pick<SignalRunHostServices, 'enforceSchema'> | undefined>;
    if (host === undefined) {
        delete g[SIGNAL_EMIT_VALIDATION_HOST];
    } else {
        g[SIGNAL_EMIT_VALIDATION_HOST] = host as Pick<SignalRunHostServices, 'enforceSchema'>;
    }
}

function validationIssuesFromUnknown(e: unknown): SchemaValidationIssue[] | undefined {
    if (!e || typeof e !== 'object') return undefined;
    const issues = (e as { issues?: unknown }).issues;
    if (!Array.isArray(issues) || issues.length === 0) return undefined;
    const out: SchemaValidationIssue[] = [];
    for (const row of issues) {
        if (!row || typeof row !== 'object') continue;
        const o = row as Record<string, unknown>;
        out.push({
            path: typeof o.path === 'string' ? o.path : '(root)',
            message: typeof o.message === 'string' ? o.message : String(o.message ?? ''),
            code: typeof o.code === 'string' ? o.code : 'custom',
        });
    }
    return out.length > 0 ? out : undefined;
}

/**
 * Validation policy: `inputSchema.validation === true` is the sole switch that turns
 * runtime Zod enforcement on. The presence of `compiledValidatorKey` /
 * `exportSchemaSource` is authoring metadata for editor type inference and does not, by
 * itself, cause runtime validation. When validation is on, this awaits the bound host's
 * `enforceSchema` so the API runs the **compiled Zod** validator. Otherwise returns
 * `value` unchanged.
 *
 * On failure, `issues` lists Zod paths/messages when the host provides them (forward into your
 * `http.respond` JSON body alongside any `requestStatus` you use).
 * (see {@link setSignalEmitValidationHost}).
 */
export async function validateEmitPayload<T>(
    inputSchema: HttpInterfaceSchemaWire | undefined,
    value: unknown,
): Promise<ValidateEmitPayloadResult<T>> {
    if (inputSchema?.validation !== true) {
        return { ok: true, value: value as T };
    }
    const bound = getSignalEmitValidationHostBinding();
    const enforce = bound?.enforceSchema;
    if (typeof enforce !== 'function') {
        return {
            ok: false,
            message:
                'Input validation is enabled for this HTTP trigger, but the runtime did not provide enforceSchema. Use `run`/`this.$` from the Process worker (RPC host), and pass the wire from `$.interfaceEmitSchema` as the first argument to `$.enforceSchema`.',
        };
    }
    try {
        const out = await enforce<T>(inputSchema, value);
        if (out && typeof out === 'object' && 'ok' in out) {
            const r = out as Partial<EnforceSchemaResult<T>> & Record<string, unknown>;
            if (r.ok === false && typeof r.message === 'string') {
                return r.issues?.length
                    ? { ok: false, message: r.message, issues: r.issues as SchemaValidationIssue[] }
                    : { ok: false, message: r.message };
            }
            if (r.ok === true && 'value' in r) {
                return { ok: true, value: r.value as T };
            }
        }
        // Legacy host binding returned bare validated payload (not `EnforceSchemaResult`).
        return { ok: true, value: out as T };
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const issues = validationIssuesFromUnknown(e);
        return issues?.length ? { ok: false, message, issues } : { ok: false, message };
    }
}

export interface FileMetadata {
    size: number;
    contentType?: string;
    lastModified?: Date;
    name?: string;
    etag?: string;
}

/**
 * Http Response.
 */
export interface HTTPResponse {
    /**
     * HTTP Status
     */
    status: number;
    /**
     * Http Body
     */
    body: string | Buffer | NodeJS.ReadableStream;
    /**
     * If true, issue the response when the promise returned is resolved, otherwise issue
     * the response at the end of the workflow execution
     */
    immediate?: boolean;

    headers?: SendConfigHTTPKv;
}

export interface FlowFunctions {
    exit: (reason: string) => void;
    delay: (ms: number, context: object) => {
        resume_url: string;
        cancel_url: string;
    };
    rerun: (ms: number, context: object) => {
        resume_url: string;
        cancel_url: string;
    };
    suspend: (ms: number, context: object) => {
        resume_url: string;
        cancel_url: string;
    };
    refreshTimeout: () => string;
}

export type SendPayload = any;

export interface SendConfigHTTPKv {
    [key: string]: string;
}
export interface SendConfigHTTPAuth {
    username: string;
    password: string;
}
export type UppercaseHTTPMethod =
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "PATCH";

export type HTTPAuthenticationType = "none" | "simple" | "platform" | "external";

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue; };

/**
 * Incremental / SSE frame for {@link HttpInterfaceType.send}.
 * Host formats SSE `event` / `id` / `data` lines; supply `data` and/or `comment` (comment-only heartbeats).
 */
export type HttpInterfaceSendPayload = {
    event?: string;
    id?: string;
    data?: string | JSONValue;
    /** SSE comment line content (`:` lines); ignored by `EventSource` default `onmessage` */
    comment?: string;
};

/** Default TTFB deadline (ms) when {@link HttpInterfaceType.deferHttpResponse} omits `timeoutMs`. */
export const DEFAULT_DEFER_HTTP_RESPONSE_MS = 30_000;

/** Incremental stream mode selected in {@link HttpDeferResponseOptions} (at most one). */
export type HttpDeferredStreamMode = 'sse' | 'ndjson' | 'json-array' | 'concatenated';

/**
 * Options for {@link HttpInterfaceType.deferHttpResponse}.
 * Omit stream flags for a **regular** HTTP response completed later via `respond` / `redirect`.
 * Set exactly one stream flag for incremental streaming (`send` or `append`).
 */
export type HttpDeferResponseOptions = {
    /**
     * When `true`, the deferred exchange is SSE (`send` / stream). When omitted or `false`, expect a normal delayed `respond` / `redirect`.
     */
    sse?: boolean;
    /**
     * When `true`, stream newline-delimited JSON / JSON Lines (`append` + `\n` per record).
     * See [NDJSON](https://en.wikipedia.org/wiki/JSON_streaming#Newline-delimited_JSON).
     */
    ndjson?: boolean;
    /**
     * When `true`, stream a single JSON **array** built incrementally (`[` … comma-separated `append` … `]`).
     * Valid `application/json` after `end`. Not the same as Wikipedia “concatenated JSON”.
     */
    jsonArray?: boolean;
    /**
     * When `true`, stream [concatenated JSON](https://en.wikipedia.org/wiki/JSON_streaming#Concatenated_JSON):
     * back-to-back JSON values with **no** delimiters (`{…}{…}`). Requires a streaming JSON parser on the client.
     */
    concatenated?: boolean;
    /**
     * SSE keepalive interval (ms). Only used when `sse` is `true`. Host writes comment heartbeats by default.
     */
    sseHeartbeatInterval?: number;
    /** SSE `event:` for a single terminal frame when TTFB elapses before any output (SSE mode only) */
    sseTimeoutEvent?: string;
    /** JSON payload for `sseTimeoutEvent` `data:` lines; host-defined defaults if omitted (SSE mode only) */
    sseTimeoutData?: JSONValue;
    /** NDJSON / json-array TTFB timeout record; host defaults if omitted */
    streamTimeoutRecord?: JSONValue;
};

/**
 * Periodic SSE keepalive while the stream is open; cleared on {@link HttpInterfaceType.end} or a terminal {@link HttpInterfaceType.respond}.
 * Pass `null` to disable a previously configured heartbeat.
 */
export type HttpSseHeartbeatOptions = {
    intervalMs: number;
    /** When true, write comment frames (`:`) suitable for silent heartbeats */
    asComment?: boolean;
    event?: string;
    data?: string | JSONValue;
};

export interface SendConfigHTTP {
    method?: UppercaseHTTPMethod;
    url: string;
    headers?: SendConfigHTTPKv;
    params?: SendConfigHTTPKv;
    auth?: SendConfigHTTPAuth;
    data?: SendPayload;
}
export interface SendConfigS3 {
    bucket: string;
    prefix: string;
    payload: SendPayload;
}
export interface SendConfigEmail {
    subject: string;
    text?: string;
    html?: string;
}
export interface SendConfigEmit {
    raw_event: SendPayload;
}
export interface SendConfigSSE {
    channel: string;
    payload: SendPayload;
}
export interface SendFunctionsWrapper {
    http: (config: SendConfigHTTP) => void;
    email: (config: SendConfigEmail) => void;
    emit: (config: SendConfigEmit) => void;
    s3: (config: SendConfigS3) => void;
    sse: (config: SendConfigSSE) => void;
}

export interface IFile {
    delete(): Promise<void>;
    createReadStream(): Promise<NodeJS.ReadableStream>;
    createWriteStream(contentType?: string, contentLength?: number): Promise<NodeJS.WritableStream>;
    toEncodedString(encoding?: string, start?: number, end?: number): Promise<string>;
    toUrl(): Promise<string>;
    toFile(localFilePath: string): Promise<void>;
    toBuffer(): Promise<Buffer>;
    fromReadableStream(readableStream: NodeJS.ReadableStream, contentType?: string, contentSize?: number): Promise<IFile>;
    fromFile(localFilePath: string, contentType?: string): Promise<IFile>;
    fromUrl(url: string, options?: any): Promise<IFile>;
    toJSON(): any;
}

export interface IApi {
    open(path: string): IFile;
    openDescriptor(descriptor: any): IFile;
    dir(path?: string): AsyncGenerator<{
        isDirectory: () => boolean;
        isFile: () => boolean;
        path: string;
        name: string;
        size?: number;
        modifiedAt?: Date;
        file?: IFile;
    }>;
}

export interface SlotTransitionDefinition {
    id: string;
    label: string;
}

/**
 * Subset of parsed FERN information for the currently-executing element.
 * Mirrors `IFERNInfo` from `@process.co/interfaces`; defined locally so
 * `@process.co/element-types` stays a leaf published package.
 */
export interface ProcessRuntimeFernInfo {
    /** Namespace slug (e.g. `process-internal`, `acme`). */
    namespace?: string;
    /** Optional `[modifier]` between namespace and tag (e.g. `[client_id]`). */
    namespaceModifier?: string;
    /** Namespace tag (e.g. `main`); mutually exclusive with `serial`. */
    tag?: string;
    /** Numeric namespace serial; mutually exclusive with `tag`. */
    serial?: bigint;
    /** Element type kind: `action` | `signal` | `flow` | `credential` | … */
    elementType?: string;
    /** Element type slug (e.g. `switch`, `if-then`). */
    elementTypeName?: string;
    /** Cuid for the specific instance of the element in a flow/document. */
    elementId?: string;
    /** Optional inner flow/container id. */
    flowId?: string;
    /** Optional simulation/session id. */
    sessionId?: string;
    /** Optional element display name. */
    elementName?: string;
    /** Method name (defaults to `execute` for actions/signals/flows). */
    methodName?: string;
    /** Optional method class (e.g. `hooks`). */
    methodClass?: string;
    /** Globally qualified element type (no tag/serial). */
    gqElementType?: string;
    /** Fully qualified element type (with tag/serial). */
    fqElementType?: string;
    /** Globally qualified element type name. */
    gqElementTypeName?: string;
    /** Fully qualified element type name. */
    fqElementTypeName?: string;
    /** Globally qualified method name. */
    gqMethodName?: string;
    /** Fully qualified method name. */
    fqMethodName?: string;
    /** Globally qualified namespace. */
    gqNamespace?: string;
    /** Fully qualified namespace. */
    fqNamespace?: string;
    /** Composite element id key (`elementId#flowId@sessionId:$id`). */
    fqElementIDKey?: string;
    /** True when the element type denotes user-authored code. */
    isUserCodeElement?: boolean;
    /** True when the element type denotes a workflow/flow element. */
    isWorkflowElement?: boolean;
}

/**
 * Runtime metadata exposed on `$.runtime` for internal element code.
 *
 * Use `$.runtime.current.elementId` (and other parsed FERN fields) inside
 * `run()` to construct slot ids, log keys, etc. without relying on the
 * legacy `{{ID_GUID}}` template placeholder that the executor used to
 * substitute after the fact.
 */
export interface ProcessRuntimeContext {
    /**
     * Parsed FERN info for the currently-executing element. Populated by
     * the runner host from the inbound `FERN` and made available on `$`
     * before user `run()` code is invoked.
     */
    current: ProcessRuntimeFernInfo;
}

export interface ProcessInternalFunctions extends ProcessFunctions {
    $transitionToSlot(slots: Array<SlotTransitionDefinition>): void;
    /**
     * Runtime metadata for the currently-executing element. Use
     * `$.runtime.current.elementId` (etc.) instead of the deprecated
     * `{{ID_GUID}}` slot-id template placeholder.
     */
    runtime: ProcessRuntimeContext;
}

export interface FlowControlExtensions {
    $$innerSlots?: Record<string, string>;
    $$event?: 'slotCompletionEvent' | 'slotIterationEvent';
    $$iteration?: number;
    $$slotId?: string;
    // /$transitionToSlot(slotId: string): void;
}

export interface ProcessFunctions {

    export: (key: string, value: JSONValue) => void;

    send: SendFunctionsWrapper;

    /**
     * Respond to an HTTP interface.
     * @param response Define the status and body of the request.
     * @returns A promise that is fulfilled when the body is read or an immediate response is issued
     */
    respond: (response: HTTPResponse) => Promise<any> | void;

    flow: FlowFunctions;


    // end: () => void;

    files: IApi;

}

export interface ActionRunOptions<T extends ProcessFunctions = ProcessFunctions> {

    $: T;

    steps: JSONValue;

}

export interface EmitMetadata {
    id?: string | number;
    name?: string;
    summary?: string;
    ts?: number;
}

export interface IdEmitMetadata extends EmitMetadata {
    id: string | number;
}

type EmitFunction = {
    $emit: (event: SignalEventShape | SignalEventShape["body"] | SignalEventShape["bodyRaw"] | JSONValue, metadata?: EmitMetadata) => Promise<void>;
};

type IdEmitFunction = {
    $emit: (event: JSONValue, metadata: IdEmitMetadata) => Promise<void>;
};

// ============================================
// Template literal type parsing for $infer<T>
// ============================================

// Map string literals to actual types
type StringToType<S extends string> =
    S extends "string" ? string :
    S extends "string(text)" ? string :
    S extends "string(html)" ? string :
    S extends "string(markdown)" ? string :
    S extends "string(json)" ? string :
    S extends "string(xml)" ? string :
    S extends "string(javascript)" ? string :
    S extends "string(yaml)" ? string :
    S extends "string(csv)" ? string :
    S extends "string(tsv)" ? string :
    S extends "string(css)" ? string :
    S extends "string(sql)" ? string :
    S extends "string(email)" ? string :
    S extends "string(emailList)" ? string :
    S extends "string(urlList)" ? string :
    S extends "string(url)" ? string :
    S extends "number" ? number :
    S extends "boolean" ? boolean :
    S extends "null" ? null :
    S extends "undefined" ? undefined :
    S extends "object" ? object :
    S extends "any" ? any :
    S extends "unknown" ? unknown :
    S extends "never" ? never :
    S extends "void" ? void :
    never;

// Trim leading/trailing spaces
type TrimSpaces<S extends string> =
    S extends ` ${infer R}` ? TrimSpaces<R> :
    S extends `${infer R} ` ? TrimSpaces<R> :
    S;

// Parse union types separated by |
type ParseUnion<S extends string> =
    S extends `${infer A}|${infer B}`
    ? StringToType<TrimSpaces<A>> | ParseUnion<B>
    : StringToType<TrimSpaces<S>>;

type Expand<T> = T extends object ? { [K in keyof T]: T[K] } : T;
type InferZodOutput<T> = T extends { _output: infer O } ? O : never;
type InferZodObjectShape<T> = T extends { shape: infer Shape extends Record<string, z.ZodTypeAny> }
    ? Expand<{
        [K in keyof Shape]: InferZodOutput<Shape[K]>;
    }>
    : never;

// Extract and parse the type parameter from $infer<...>
type InferType<T extends string> =
    T extends `$infer<${infer Inner}>`
    ? ParseUnion<Inner>
    : any;  // fallback to any if no generic specified

type PropOptionValue<T> =
    T extends { value: infer V }
    ? V
    : never;

type PropOptionsValue<T> =
    T extends { options: readonly (infer Option)[] }
    ? PropOptionValue<Option>
    : never;

type BasePropDefinition = {
    label?: string;
    description?: string;
    options?: readonly { label?: string; value: unknown }[];
    ui?: any;
    default?: any;
    visibleWhen?: any;
};

type PropDefinitionInput<TType = unknown> = BasePropDefinition & {
    type: TType;
};

export type HttpInterfaceType = {

    /**
     * Full HTTP response (status / headers / body). Sending `body` completes the exchange for typical requests.
     */
    respond: (response: HTTPResponse) => Promise<any> | void;

    /**
     * Incremental write or SSE frame; does not complete the exchange. Pair with {@link end} or a terminal {@link respond} where applicable.
     */
    send: (payload: HttpInterfaceSendPayload) => Promise<void> | void;
    redirect: (url: string, status?: 301 | 302) => Promise<void>;

    /**
     * Defer finishing the HTTP exchange until a later step completes it (or the TTFB deadline elapses).
     * Use `options.sse` for SSE (`send`), or `ndjson` / `jsonArray` / `concatenated` for `append`, or omit for delayed `respond` / `redirect`.
     * @param timeoutMs Time to first byte in milliseconds. Defaults to {@link DEFAULT_DEFER_HTTP_RESPONSE_MS} (30s) when omitted.
     */
    deferHttpResponse: (timeoutMs?: number, options?: HttpDeferResponseOptions) => void;

    /**
     * Optional runtime vary suffix (hashed and appended to the HTTP base scenario key).
     * Call when saved `$httpRequestCachePolicy.needsRuntimeVaryKey` is true.
     */
    setRequestVaryKey: (value: string) => void;

    /**
     * Append one JSON value to an incremental stream (`ndjson` or `jsonArray` defer modes). Each call is one line (NDJSON) or one array element (json-array).
     */
    append: (record: JSONValue) => Promise<void> | void;

    /**
     * SSE keepalive while the stream stays open. Pass `null` to disable.
     */
    setSseHeartbeat: (options: HttpSseHeartbeatOptions | null) => void;
    authenticate: (authType: HTTPAuthenticationType, options?: { token?: string }) => Promise<any> | void;
    flow: FlowFunctions;
    end: () => void;
    execute: () => Promise<{ headers?: Record<string, string>;[key: string]: any }>

};


type PropTypeFromTypeValue<U, T = unknown> =
    U extends z.ZodObject<any, any> ? InferZodObjectShape<U>
    : U extends z.ZodArray<infer Item> ? Expand<Array<InferZodOutput<Item>>>
    : U extends z.ZodTypeAny ? Expand<InferZodOutput<U>>
    : U extends "http_request"
    ? { execute: () => Promise<{ headers?: Record<string, string>;[key: string]: any }> }
    : U extends "string"
    ? [PropOptionsValue<T>] extends [never] ? string : PropOptionsValue<T>
    : U extends "string(html)" ? string
    : U extends "string(markdown)" ? string
    : U extends "string(json)" ? string
    : U extends "string(xml)" ? string
    : U extends "string(yaml)" ? string
    : U extends "string(base64)" ? string
    : U extends "string(javascript)" ? string
    : U extends "string(csv)" ? string
    : U extends "string(tsv)" ? string
    : U extends "string(css)" ? string
    : U extends "string(sql)" ? string
    : U extends "string(email)" ? string
    : U extends "string(emailList)" ? string[]
    : U extends "string(urlList)" ? string[]
    : U extends "string(url)" ? string
    : U extends `$infer<${string}>` ? InferType<U>
    : U extends "$infer" ? any
    : U extends "object" ? Record<string, unknown>
    : U extends `object(${PropObjectDefinitionTypes})` ? any
    : U extends `file(${PropFileDefinitionTypes})` ? IFile
    : U extends "number" ? number
    : U extends "boolean" ? boolean
    : U extends "integer" ? number
    : U extends "$.interface.schema" ? HttpInterfaceSchemaWire
    : U extends "$.interface.http" ? HttpInterfaceType
    : U extends "$.interface.duration" ? import('./http-request-cache').DurationWire
    : U extends "$.interface.cacheVaryInfo" ? import('./http-request-cache').CacheVaryInfoWire
    : unknown;

/**
 * Runtime shape of an embedded app prop (`props: { http: httpApp }` on a signal/action).
 * Maps `propDefinitions` / `props` / `methods` to instance fields — not the `defineApp` module metadata (`type`, `app`, …).
 */
export type DeriveEmbeddedAppPropInstance<T extends { type: 'app' }> = Spread<
    (T extends { propDefinitions: Record<string, any> }
        ? { [K in keyof T['propDefinitions']]: PropType<T['propDefinitions'][K]> }
        : {}) &
        (T extends { props: Record<string, any> }
            ? { [K in keyof T['props']]: PropType<T['props'][K]> }
            : {}) &
        (T extends { methods: Record<string, any> }
            ? { [K in keyof T['methods']]: T['methods'][K] }
            : {})
>;

// Utility type for transforming prop definitions to their runtime types
export type PropType<T> =
    // 1. Embedded app module → runtime prop surface (not the definition object)
    T extends { type: 'app' }
    ? DeriveEmbeddedAppPropInstance<T>
    : T extends { props: Record<string, any>; methods: Record<string, any> }
    ? DeriveAppInstance<T>
    // 2. If T is a propDefinition, resolve from propDefinitions or props
    : T extends { propDefinition: readonly [infer App, infer PropName] }
    ? App extends { propDefinitions: Record<string, any> }
    ? PropName extends keyof App["propDefinitions"]
    ? PropType<App["propDefinitions"][PropName]>
    : App extends { props: Record<string, any> }
    ? PropName extends keyof App["props"]
    ? PropType<App["props"][PropName]>
    : unknown
    : unknown
    : App extends { props: Record<string, any> }
    ? PropName extends keyof App["props"]
    ? PropType<App["props"][PropName]>
    : unknown
    : unknown
    // 3. Nested objects (recursion) - handle objects with their own props
    : T extends { props: Record<string, any> }
    ? { [K in keyof T["props"]]: PropType<T["props"][K]> }
    // 4. Map the type field to the runtime property type
    : T extends { type: infer U }
    ? PropTypeFromTypeValue<U, T>
    // 5. Fallback
    : unknown;

// Base module shape type
export type ModuleShape = {
    type: string;
    props: Record<string, any>;
    methods: Record<string, any>;
};

// Utility type to force flattening of intersections
export type Spread<T> = { [K in keyof T]: T[K] };

// Helper type to derive instance type from app definition, fully flattened
// export type DeriveAppInstance<T> =
//   T extends { methods: Record<string, any>; props: Record<string, any> }
//   ? Spread<
//     Omit<T, "props" | "methods"> &
//     { [K in keyof T["props"]]: PropType<T["props"][K]> } &
//     { [K in keyof T["methods"]]: T["methods"][K] }
//   >
//   : never;


export type DeriveAppInstance<T> =
    Spread<
        Omit<T, "props" | "propDefinitions" | "methods"> &
        (T extends { props: Record<string, any> }
            ? { [K in keyof T["props"]]: PropType<T["props"][K]> }
            : {}) &
        (T extends { propDefinitions: Record<string, any> }
            ? { [K in keyof T["propDefinitions"]]: PropType<T["propDefinitions"][K]> }
            : {}) &
        // Add $emit to all signal instances
        EmitFunction &

        (T extends { methods: Record<string, any> }
            ? { [K in keyof T["methods"]]: T["methods"][K] }
            : {}) &

        // Also include all direct methods on the object
        { [K in keyof T as K extends "props" | "propDefinitions" | "methods" ? never : K]: T[K] }
    >;

/** True when a prop definition resolves to `$.interface.http` (runtime-only on `run`). */
type IsHttpInterfacePropDef<P> =
    P extends { type: '$.interface.http' }
    ? true
    : P extends { propDefinition: readonly [infer App, infer PropName] }
    ? App extends { propDefinitions: Record<string, any> }
        ? PropName extends keyof App['propDefinitions']
            ? App['propDefinitions'][PropName] extends { type: '$.interface.http' }
                ? true
                : false
            : false
        : App extends { props: Record<string, any> }
            ? PropName extends keyof App['props']
                ? App['props'][PropName] extends { type: '$.interface.http' }
                    ? true
                    : false
                : false
            : false
    : false;

export type DeriveSignalInstance<T> =
    Spread<
        Omit<T, SignalInstanceExcludedKeys> &
        (T extends { props: Record<string, any> }
            ? { [K in keyof T['props']]: PropType<T['props'][K]> }
            : {}) &
        (T extends { propDefinitions: Record<string, any> }
            ? { [K in keyof T['propDefinitions']]: PropType<T['propDefinitions'][K]> }
            : {}) &
        EmitFunction &
        (T extends { methods: Record<string, any> }
            ? { [K in keyof T['methods']]: T['methods'][K] }
            : {}) &
        {
            [K in keyof T as K extends SignalInstanceExcludedKeys ? never : K]: T[K];
        }
    >;

/** Module definition keys that are not instance fields on `this` in `run` or hooks. */
type SignalInstanceExcludedKeys =
    | 'props'
    | 'propDefinitions'
    | 'methods'
    | 'run'
    | 'hooks';

/** Prop names on `T` that are `$.interface.http` (excluded from hook `this`). */
type HttpInterfacePropKeys<T> =
    T extends { props: infer P extends Record<string, unknown> }
        ? keyof {
              [K in keyof P as IsHttpInterfacePropDef<P[K]> extends true ? K : never]: true;
          }
        : never;

/**
 * `this` inside signal hooks: instance props minus `$.interface.http` and `$emit`.
 * Use `params.$.http.configureResponseCaching` in `save`.
 */
export type DeriveSignalHookInstance<T> = Omit<
    DeriveSignalInstance<T>,
    HttpInterfacePropKeys<T> | keyof EmitFunction
>;

// In your element-types
export type PropDefinitionType<App, PropName extends string> =
    App extends { propDefinitions: Record<string, any> }
    ? PropName extends keyof App['propDefinitions']
    ? PropType<App['propDefinitions'][PropName]>
    : unknown
    : unknown;

/** Module definition keys that are not instance fields on `this` in `run`. */
type ActionInstanceExcludedKeys =
    | 'props'
    | 'propDefinitions'
    | 'methods'
    | 'run'
    | 'type'
    | 'name'
    | 'description'
    | 'icon'
    | 'noAuth'
    | 'slots'
    | 'hasNew'
    | 'initValue';

/** Runtime `this` for action `run` (prop values via {@link PropType}, including embedded apps). */
export type DeriveActionInstance<T> =
    Spread<
        Omit<T, ActionInstanceExcludedKeys> &
        (T extends { props: Record<string, any> }
            ? { [K in keyof T['props']]: PropType<T['props'][K]> }
            : {}) &
        (T extends { propDefinitions: Record<string, any> }
            ? { [K in keyof T['propDefinitions']]: PropType<T['propDefinitions'][K]> }
            : {}) &
        (T extends { methods: Record<string, any> }
            ? { [K in keyof T['methods']]: T['methods'][K] }
            : {}) &
        {
            [K in keyof T as K extends ActionInstanceExcludedKeys ? never : K]: T[K];
        }
    >;

// Helper type to create a module with proper this context
export type ModuleWithThis<T> = T & ThisType<DeriveActionInstance<T>>;

// export interface ActionRunParams {
//     $: {
//         export: (key: string, value: JSONValue) => void;
//         send: SendFunctionsWrapper;
//         respond: (response: HTTPResponse) => Promise<any> | void;
//         flow: FlowFunctions;
//         end: () => void;
//         files: IApi;
//     }
// }

// Action-specific types
export interface Action<P extends Record<string, any> = Record<string, any>> extends ModuleDefinition {
    type: "action";
    props: P;
    run: (this: DeriveActionInstance<Action<P>>, params: ActionRunOptions) => Promise<unknown>;
}

export interface Signal<P extends Record<string, any> = Record<string, any>> {
    type: "signal";
    app: string;
    props: P;
    methods?: Record<string, unknown> & {
        run: (this: DeriveSignalInstance<Signal<P>>, params: SignalRunOptions) => Promise<unknown>;
    };
    /**
     * @deprecated Use `methods.run`.
     */
    run?: (this: DeriveSignalInstance<Signal<P>>, params: SignalRunOptions) => Promise<unknown>;
    hooks?: SignalHooksDefinition<Signal<P>>;
}

type SignalRun<T> = (this: DeriveSignalInstance<T>, params: SignalRunOptions) => Promise<unknown>;


export type ActionInstance<A extends Action> = DeriveActionInstance<A>;
export type SignalInstance<S extends Signal> = DeriveSignalInstance<S>;

export type SignalMethod<S extends Signal> = (this: SignalInstance<S>, params: SignalRunOptions) => Promise<unknown>;
export type ActionMethod<A extends Action> = (
    this: ActionInstance<A>,
    params: ActionRunOptions,
) => Promise<unknown>;

export type PropStringDefinitionTypes = "text" | "html" | "markdown" | "json" | "xml" | "yaml" | "csv" | "tsv" | "css" | "sql" | "email" | "emailList" | "urlList" | "url" | "base64" | "javascript";

export type PropObjectDefinitionTypes = "json" | "base64"

export type PropFileDefinitionTypes = "url" | "base64"

export type PropDefinitionTypes = "string" | "number" | "boolean" | "integer" | "object" | "array" | "file" | "image" | "video" | "audio" | `object(${PropObjectDefinitionTypes})` | `file(${PropFileDefinitionTypes})` | `string(${PropStringDefinitionTypes})` | `$infer<${string}>` | "$infer" | "app" | `array<${string}>`;

type StringPropDefinition = BasePropDefinition & {
    type: PropDefinitionTypes;
};

type SchemaPropDefinition<TSchema extends z.ZodTypeAny = z.ZodTypeAny> =
    BasePropDefinition & {
        type: TSchema;
    };

// Prop definition type
export type PropDefinition = StringPropDefinition | SchemaPropDefinition;

// Helper to provide ThisType context for app definitions
export function defineApp<const T extends object>(app: T & ThisType<DeriveAppInstance<T>>): T {
    return app;
}

export type ActionRunFn = (params: ActionRunOptions) => void | Promise<unknown>;

/** Canonical action entrypoint — implement `run` here (see process-internal loop, etc.). */
export type ActionMethodsRun = {
    methods: Record<string, unknown> & { run: ActionRunFn };
};

/**
 * @deprecated Use `methods: { run }` instead of a top-level `run` property.
 * Runtime still accepts this shape via `restructureElement`.
 */
export type ActionMethodsLegacyTopLevelRun = {
    /** @deprecated Use `methods.run`. */
    run?: ActionRunFn;
};

/** Minimum shape for {@link defineAction}. Prefer {@link ActionMethodsRun}. */
export type ActionMethods = ActionMethodsRun | ActionMethodsLegacyTopLevelRun;

/** Structural requirements for an action module (tooling; prefer {@link defineAction}). */
export type ActionDefinitionShape<T> = {
    methods: Record<string, unknown> & {
        run: (this: DeriveActionInstance<T>, params: ActionRunOptions) => Promise<unknown>;
    };
    /**
     * @deprecated Use `methods.run`.
     */
    run?: (this: DeriveActionInstance<T>, params: ActionRunOptions) => Promise<unknown>;
};

/** Contextual `this` for top-level and `methods.*` action functions. */
export type ActionMethodsWithThis<T> = T &
    ThisType<DeriveActionInstance<T>> &
    (T extends { methods?: infer M extends Record<string, unknown> }
        ? { methods: M & ThisType<DeriveActionInstance<T>> }
        : {});

export function defineAction<
    const T extends ActionMethods & { type: 'action' } & Record<string, unknown>,
>(action: ActionMethodsWithThis<T>): T {
    return action;
}

/** `params.$` for `hooks.activate` / `hooks.deactivate`. */
export type SignalHostHookParameters = {
    $: SignalLifecycleHookHostServices;
};

/** `params.$` for `hooks.save` — publish-only; not {@link SignalRunHostServices}. */
export type SignalSaveHostParameters = {
    $: SignalSaveHookHostServices;
};

export type SignalHostHookMethod<T> = (
    this: DeriveSignalHookInstance<T>,
    params: SignalHostHookParameters,
) => void | Promise<void>;

export type SignalSaveHookMethod<T> = (
    this: DeriveSignalHookInstance<T>,
    params: SignalSaveHostParameters,
) => void | Promise<void>;

export type SignalHooksDefinition<T> = {
    deactivate?: SignalHostHookMethod<T>;
    activate?: SignalHostHookMethod<T>;
    save?: SignalSaveHookMethod<T>;
    onDeactivate?: SignalHostHookMethod<T>;
    onActivate?: SignalHostHookMethod<T>;
    onSave?: SignalSaveHookMethod<T>;
};

/**
 * Hook implementations for {@link defineSignal}: `params.$` is typed here; `this` comes from
 * {@link ThisType}<{@link DeriveSignalHookInstance}<T>> (avoids circular `T` and empty `this`).
 */
export type SignalHooksContextualDefinition = {
    deactivate?: (params: SignalHostHookParameters) => void | Promise<void>;
    activate?: (params: SignalHostHookParameters) => void | Promise<void>;
    save?: (params: SignalSaveHostParameters) => void | Promise<void>;
    onDeactivate?: (params: SignalHostHookParameters) => void | Promise<void>;
    onActivate?: (params: SignalHostHookParameters) => void | Promise<void>;
    onSave?: (params: SignalSaveHostParameters) => void | Promise<void>;
};

/** Hook bag for {@link defineSignal}. */
export type SignalHooksWithThis<T> = SignalHooksContextualDefinition &
    ThisType<DeriveSignalHookInstance<T>>;

/** Structural requirements for a signal module (used by tooling; prefer {@link defineSignal}). */
export type SignalDefinitionShape<T> = {
    methods: Record<string, unknown> & {
        run: (this: DeriveSignalInstance<T>, params: SignalRunOptions) => Promise<unknown>;
    };
    /**
     * @deprecated Use `methods.run`.
     */
    run?: (this: DeriveSignalInstance<T>, params: SignalRunOptions) => Promise<unknown>;
    hooks?: SignalHooksDefinition<T>;
};

export type SignalRunFn = (params: SignalRunOptions) => void | Promise<unknown>;

/** Canonical signal entrypoint — implement `run` here. */
export type SignalMethodsRun = {
    methods: Record<string, unknown> & { run: SignalRunFn };
};

/**
 * @deprecated Use `methods: { run }` instead of a top-level `run` property.
 * Runtime still accepts this shape via `restructureElement`.
 */
export type SignalMethodsLegacyTopLevelRun = {
    /** @deprecated Use `methods.run`. */
    run?: SignalRunFn;
};

/** Minimum shape for {@link defineSignal}. Prefer {@link SignalMethodsRun}. */
export type SignalMethods = SignalMethodsRun | SignalMethodsLegacyTopLevelRun;

/** Contextual `this` for top-level and `methods.*` signal functions. */
export type SignalMethodsWithThis<T> = T &
    ThisType<DeriveSignalInstance<T>> &
    (T extends { methods?: infer M extends Record<string, unknown> }
        ? { methods: M & ThisType<DeriveSignalInstance<T>> }
        : {});

export function defineSignal<
    const T extends SignalMethods & Record<string, unknown>,
>(signal: SignalMethodsWithThis<T> & { hooks?: SignalHooksWithThis<T> }): T {
    return signal;
}

export type RunReturn<T> =
    T extends { methods: { run: (...args: any[]) => infer R } }
        ? Awaited<R>
        : T extends { run: (...args: any[]) => infer R }
          ? Awaited<R>
          : never;

export {
    ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS,
    zodObjectToContainerExportJsonSchema,
} from './zod-container-export-json-schema';

export type OnChangeOpts = { layoutShift?: boolean };

export type ElementUIProps<T> = {
    onChange: (value: T, opts?: OnChangeOpts) => void;
    onBlur: () => void;
    value: T;
    readonly?: boolean;
}

// Utility type to automatically infer the correct this context for methods
export type WithThis<T> = T extends { methods: Record<string, any>; props: Record<string, any> }
    ? Omit<T, 'methods'> & {
        methods: {
            [K in keyof T['methods']]: T['methods'][K] extends (...args: infer A) => infer R
            ? (this: DeriveActionInstance<T>, ...args: A) => R
            : T['methods'][K];
        };
    }
    : T; 
