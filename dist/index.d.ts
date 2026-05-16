import type { z } from 'zod';
export type ElementString = {
    type: "string";
    label?: string;
    description?: string;
};
export type ElementObject = {
    type: "object";
    label?: string;
    description?: string;
};
export type ElementNumber = {
    type: "number";
    label?: string;
    description?: string;
};
export type ElementInteger = {
    type: "integer";
    label?: string;
    description?: string;
};
export type ElementBoolean = {
    type: "boolean";
    label?: string;
    description?: string;
};
export type ElementApp<T> = {
    type: "app";
    app: T;
};
export type ElementAction<T> = {
    type: "action";
    icon?: ElementIcon;
    label?: string;
    description?: string;
} & T;
export type ElementSource<T> = {
    type: "source";
    icon?: ElementIcon;
    label?: string;
    description?: string;
} & T;
export type ElementTrigger<T> = {
    type: "trigger";
    icon?: ElementIcon;
    label?: string;
    description?: string;
} & T;
export type ElementSignal<T> = {
    type: "signal";
    icon?: ElementIcon;
    label?: string;
    description?: string;
} & T;
export type ElementIcon = {
    type: "FontAwesome" | "MaterialIcons" | "ProcessIcons" | "RemoteImage" | "image";
    icon: string | ['far' | 'fas' | 'fab' | 'fal' | 'fad', string];
} | string;
import type { ISlotInstanceDefinition, ISlotStaticInstanceDefinition, ISlotDefinition } from './slot-definition';
export type { ISlotInstanceDefinition, ISlotStaticInstanceDefinition, ISlotDefinition };
export { builtinActionSlotsRegistry, type BuiltinActionSlotsRegistry, type BuiltinActionSlotsFern, type InferBuiltinActionSlots, } from './builtin-action-slots-registry';
/** Full **`process-element` CLI** JSON shape (types only; materialize in **`@process.co/compatibility`** **`authoring-spec`**). */
export type { ProcessElementPropCliWire, ProcessElementActionCliWire, ProcessElementSignalCliWire, ProcessElementCliOutputWire, } from './process-element-cli-output';
/** Locked authoring catalog **types** + version (runtime materialize: **`@process.co/compatibility`** **`authoring-spec`**). */
export { ELEMENT_AUTHORING_CONTRACT_VERSION } from './authoring-contract-types';
export type { AuthoringPropWireKind, AuthoringPropContract, SlotBranchAuthoringContract, SlotsAuthoringContract, ActionAuthoringContract, SignalAuthoringContract, ElementAuthoringCatalogContract, ChildStepsPropertyForBranch, ActionPropKeys, ActionContractByFern, FernAuthoringShardFileV1, } from './authoring-contract-types';
export { PLATFORM_BOUND_LOADER_TYPE_PREFIXES, isPlatformBoundLoaderType, } from './platform-loader-type';
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
};
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
 * Design-time fields (`exportSchema`, `exportSchemaZodex`, etc.) are hints for editors and tooling.
 * When {@link HttpInterfaceSchemaWire.validation} is true, the runtime does **not** validate against
 * those JSON blobs alone: it loads the ESM at {@link HttpInterfaceSchemaWire.compiledValidatorKey}
 * (default export = Zod schema) and runs full `safeParse` on the payload via the runner-bound
 * {@link SignalHostServices.enforceSchema} RPC (see {@link setSignalEmitValidationHost}).
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
/** Host-backed RPC surface passed as `params.$` to signal `run` (parallel to action `ActionRunOptions.$`). */
export type SignalHostServices = {
    export: (category: string, message: string) => void | Promise<void>;
    $transitionToSlot: (slots: Array<SlotTransitionDefinition>) => void | Promise<void>;
    /**
     * When `inputSchema.validation` is set, runs the published **full Zod** validator for that
     * interface (`compiledValidatorKey`); otherwise may no-op. Implemented by the Process API
     * (validator worker + `safeParse`), not by element code.
     */
    enforceSchema: <T>(inputSchema: HttpInterfaceSchemaWire | undefined, value: unknown) => Promise<EnforceSchemaResult<T>>;
    /**
     * Wire for the primary `$.interface.schema` property (same persisted object the publish
     * pipeline attaches `compiledValidatorKey` to). Use with {@link SignalHostServices.enforceSchema},
     * e.g. `await $.enforceSchema($.interfaceEmitSchema, toEmit)`.
     */
    interfaceEmitSchema?: HttpInterfaceSchemaWire;
};
/** One row from a failed Zod `safeParse` (host / `validateEmitPayload`). */
export type SchemaValidationIssue = {
    path: string;
    message: string;
    code: string;
};
export type EnforceSchemaResult<T extends unknown = unknown> = {
    ok: true;
    value: T;
} | {
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
export declare const PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER: "enforceSchema";
export type SignalRunOptions = {
    $: SignalHostServices;
    event: SignalEventShape;
};
export type ValidateEmitPayloadResult<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    message: string;
    issues?: SchemaValidationIssue[];
};
/**
 * Host shape accepted from the runner RPC bridge (`$.enforceSchema` may be typed as
 * returning `Promise<unknown>` while {@link SignalHostServices} uses a generic `T`).
 */
export type SignalEmitValidationHostBinding = Pick<SignalHostServices, 'enforceSchema'> | {
    enforceSchema?: (inputSchema: HttpInterfaceSchemaWire | undefined, value: unknown) => Promise<unknown>;
};
/**
 * Binds the trusted signal host used by {@link validateEmitPayload} for the current
 * invocation. The runner sets this from the RPC/proxy host **outside** element code and
 * clears it when the invocation completes. Uses `globalThis` so a bundled copy of
 * `validateEmitPayload` inside an element module still sees the same binding as the runner.
 */
export declare function setSignalEmitValidationHost(host: SignalEmitValidationHostBinding | undefined): void;
/**
 * When validation is required (explicit `validation: true`, or a non-empty `compiledValidatorKey`
 * with `validation` not `false`), awaits the bound host's `enforceSchema` so the API runs the
 * **compiled Zod** validator. Otherwise returns `value` unchanged.
 * On failure, `issues` lists Zod paths/messages when the host provides them (forward into your
 * `http.respond` JSON body alongside any `requestStatus` you use).
 * (see {@link setSignalEmitValidationHost}).
 */
export declare function validateEmitPayload<T>(inputSchema: HttpInterfaceSchemaWire | undefined, value: unknown): Promise<ValidateEmitPayloadResult<T>>;
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
export type UppercaseHTTPMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
export type HTTPAuthenticationType = "none" | "simple" | "platform" | "external";
export type JSONValue = string | number | boolean | null | JSONValue[] | {
    [key: string]: JSONValue;
};
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
export declare const DEFAULT_DEFER_HTTP_RESPONSE_MS = 30000;
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
export interface ProcessInternalFunctions extends ProcessFunctions {
    $transitionToSlot(slots: Array<SlotTransitionDefinition>): void;
}
export interface FlowControlExtensions {
    $$innerSlots?: Record<string, string>;
    $$event?: 'slotCompletionEvent' | 'slotIterationEvent';
    $$iteration?: number;
    $$slotId?: string;
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
type StringToType<S extends string> = S extends "string" ? string : S extends "string(text)" ? string : S extends "string(html)" ? string : S extends "string(markdown)" ? string : S extends "string(json)" ? string : S extends "string(xml)" ? string : S extends "string(javascript)" ? string : S extends "string(yaml)" ? string : S extends "string(csv)" ? string : S extends "string(tsv)" ? string : S extends "string(css)" ? string : S extends "string(sql)" ? string : S extends "string(email)" ? string : S extends "string(emailList)" ? string : S extends "string(urlList)" ? string : S extends "string(url)" ? string : S extends "number" ? number : S extends "boolean" ? boolean : S extends "null" ? null : S extends "undefined" ? undefined : S extends "object" ? object : S extends "any" ? any : S extends "unknown" ? unknown : S extends "never" ? never : S extends "void" ? void : never;
type TrimSpaces<S extends string> = S extends ` ${infer R}` ? TrimSpaces<R> : S extends `${infer R} ` ? TrimSpaces<R> : S;
type ParseUnion<S extends string> = S extends `${infer A}|${infer B}` ? StringToType<TrimSpaces<A>> | ParseUnion<B> : StringToType<TrimSpaces<S>>;
type Expand<T> = T extends object ? {
    [K in keyof T]: T[K];
} : T;
type InferZodOutput<T> = T extends {
    _output: infer O;
} ? O : never;
type InferZodObjectShape<T> = T extends {
    shape: infer Shape extends Record<string, z.ZodTypeAny>;
} ? Expand<{
    [K in keyof Shape]: InferZodOutput<Shape[K]>;
}> : never;
type InferType<T extends string> = T extends `$infer<${infer Inner}>` ? ParseUnion<Inner> : any;
type PropOptionValue<T> = T extends {
    value: infer V;
} ? V : never;
type PropOptionsValue<T> = T extends {
    options: readonly (infer Option)[];
} ? PropOptionValue<Option> : never;
type BasePropDefinition = {
    label?: string;
    description?: string;
    options?: readonly {
        label?: string;
        value: unknown;
    }[];
    ui?: any;
    default?: any;
    visibleWhen?: any;
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
     * Append one JSON value to an incremental stream (`ndjson` or `jsonArray` defer modes). Each call is one line (NDJSON) or one array element (json-array).
     */
    append: (record: JSONValue) => Promise<void> | void;
    /**
     * SSE keepalive while the stream stays open. Pass `null` to disable.
     */
    setSseHeartbeat: (options: HttpSseHeartbeatOptions | null) => void;
    authenticate: (authType: HTTPAuthenticationType, options?: {
        token?: string;
    }) => Promise<any> | void;
    flow: FlowFunctions;
    end: () => void;
    execute: () => Promise<{
        headers?: Record<string, string>;
        [key: string]: any;
    }>;
};
type PropTypeFromTypeValue<U, T = unknown> = U extends z.ZodObject<any, any> ? InferZodObjectShape<U> : U extends z.ZodArray<infer Item> ? Expand<Array<InferZodOutput<Item>>> : U extends z.ZodTypeAny ? Expand<InferZodOutput<U>> : U extends "http_request" ? {
    execute: () => Promise<{
        headers?: Record<string, string>;
        [key: string]: any;
    }>;
} : U extends "string" ? [PropOptionsValue<T>] extends [never] ? string : PropOptionsValue<T> : U extends "string(html)" ? string : U extends "string(markdown)" ? string : U extends "string(json)" ? string : U extends "string(xml)" ? string : U extends "string(yaml)" ? string : U extends "string(base64)" ? string : U extends "string(javascript)" ? string : U extends "string(csv)" ? string : U extends "string(tsv)" ? string : U extends "string(css)" ? string : U extends "string(sql)" ? string : U extends "string(email)" ? string : U extends "string(emailList)" ? string[] : U extends "string(urlList)" ? string[] : U extends "string(url)" ? string : U extends `$infer<${string}>` ? InferType<U> : U extends "$infer" ? any : U extends "object" ? Record<string, unknown> : U extends `object(${PropObjectDefinitionTypes})` ? any : U extends `file(${PropFileDefinitionTypes})` ? IFile : U extends "number" ? number : U extends "boolean" ? boolean : U extends "integer" ? number : U extends "$.interface.schema" ? HttpInterfaceSchemaWire : U extends "$.interface.http" ? HttpInterfaceType : unknown;
export type PropType<T> = T extends {
    props: Record<string, any>;
    methods: Record<string, any>;
} ? DeriveAppInstance<T> : T extends {
    propDefinition: readonly [infer App, infer PropName];
} ? App extends {
    propDefinitions: Record<string, any>;
} ? PropName extends keyof App["propDefinitions"] ? PropType<App["propDefinitions"][PropName]> : App extends {
    props: Record<string, any>;
} ? PropName extends keyof App["props"] ? PropType<App["props"][PropName]> : unknown : unknown : App extends {
    props: Record<string, any>;
} ? PropName extends keyof App["props"] ? PropType<App["props"][PropName]> : unknown : unknown : T extends {
    props: Record<string, any>;
} ? {
    [K in keyof T["props"]]: PropType<T["props"][K]>;
} : T extends {
    type: infer U;
} ? PropTypeFromTypeValue<U, T> : unknown;
export type ModuleShape = {
    type: string;
    props: Record<string, any>;
    methods: Record<string, any>;
};
export type Spread<T> = {
    [K in keyof T]: T[K];
};
export type DeriveAppInstance<T> = Spread<Omit<T, "props" | "propDefinitions" | "methods"> & (T extends {
    props: Record<string, any>;
} ? {
    [K in keyof T["props"]]: PropType<T["props"][K]>;
} : {}) & (T extends {
    propDefinitions: Record<string, any>;
} ? {
    [K in keyof T["propDefinitions"]]: PropType<T["propDefinitions"][K]>;
} : {}) & EmitFunction & (T extends {
    methods: Record<string, any>;
} ? {
    [K in keyof T["methods"]]: T["methods"][K];
} : {}) & {
    [K in keyof T as K extends "props" | "propDefinitions" | "methods" ? never : K]: T[K];
}>;
export type DeriveSignalInstance<T> = Spread<Omit<T, "props" | "propDefinitions" | "methods"> & (T extends {
    props: Record<string, any>;
} ? {
    [K in keyof T["props"]]: PropType<T["props"][K]>;
} : {}) & (T extends {
    propDefinitions: Record<string, any>;
} ? {
    [K in keyof T["propDefinitions"]]: PropType<T["propDefinitions"][K]>;
} : {}) & EmitFunction & (T extends {
    methods: Record<string, any>;
} ? {
    [K in keyof T["methods"]]: T["methods"][K];
} : {}) & {
    [K in keyof T as K extends "props" | "propDefinitions" | "methods" ? never : K]: T[K];
}>;
export type PropDefinitionType<App, PropName extends string> = App extends {
    propDefinitions: Record<string, any>;
} ? PropName extends keyof App['propDefinitions'] ? PropType<App['propDefinitions'][PropName]> : unknown : unknown;
export type DeriveActionInstance<T> = Spread<Omit<T, "props" | "propDefinitions" | "methods"> & (T extends {
    props: Record<string, any>;
} ? {
    [K in keyof T["props"]]: PropType<T["props"][K]>;
} : {}) & (T extends {
    propDefinitions: Record<string, any>;
} ? {
    [K in keyof T["propDefinitions"]]: PropType<T["propDefinitions"][K]>;
} : {}) & (T extends {
    methods: Record<string, any>;
} ? {
    [K in keyof T["methods"]]: T["methods"][K];
} : {})>;
export type ModuleWithThis<T> = T & ThisType<DeriveActionInstance<T>>;
export interface Action<P extends Record<string, any> = Record<string, any>> extends ModuleDefinition {
    type: "action";
    props: P;
    run: (this: DeriveActionInstance<Action<P>>, params: ActionRunOptions) => Promise<unknown>;
}
export interface Signal<P extends Record<string, any> = Record<string, any>> extends ModuleDefinition {
    type: "signal";
    props: P;
    run: (this: DeriveSignalInstance<Signal<P>>, params: SignalRunOptions) => Promise<unknown>;
}
export type ActionInstance<A extends Action> = DeriveActionInstance<A>;
export type SignalInstance<S extends Signal> = DeriveSignalInstance<S>;
export type SignalMethod<S extends Signal> = (this: SignalInstance<S>, params: SignalRunOptions) => Promise<unknown>;
export type ActionMethod<A extends Action> = (this: ActionInstance<A>, params: {
    $: any;
}) => Promise<unknown>;
export type PropStringDefinitionTypes = "text" | "html" | "markdown" | "json" | "xml" | "yaml" | "csv" | "tsv" | "css" | "sql" | "email" | "emailList" | "urlList" | "url" | "base64" | "javascript";
export type PropObjectDefinitionTypes = "json" | "base64";
export type PropFileDefinitionTypes = "url" | "base64";
export type PropDefinitionTypes = "string" | "number" | "boolean" | "integer" | "object" | "array" | "file" | "image" | "video" | "audio" | `object(${PropObjectDefinitionTypes})` | `file(${PropFileDefinitionTypes})` | `string(${PropStringDefinitionTypes})` | `$infer<${string}>` | "$infer" | "app" | `array<${string}>`;
type StringPropDefinition = BasePropDefinition & {
    type: PropDefinitionTypes;
};
type SchemaPropDefinition<TSchema extends z.ZodTypeAny = z.ZodTypeAny> = BasePropDefinition & {
    type: TSchema;
};
export type PropDefinition = StringPropDefinition | SchemaPropDefinition;
export declare function defineApp<const T extends object>(app: T & ThisType<DeriveAppInstance<T>>): T;
export declare function defineAction<const T extends {
    props?: Record<string, unknown>;
} & {
    type: "action";
} & {
    name?: string;
} & {
    description?: string;
} & {
    icon?: ElementIcon;
} & {
    noAuth?: boolean;
} & {
    slots?: ISlotDefinition;
} & {
    methods?: Record<string, (...args: any[]) => any>;
} & {
    hasNew?: boolean;
} & {
    initValue?: any;
}>(action: T & ThisType<DeriveActionInstance<T>>): T;
export declare function defineSignal<const T extends {
    run: (params: SignalRunOptions) => Promise<unknown>;
}>(signal: T & ThisType<DeriveSignalInstance<T>>): T;
export type RunReturn<T> = T extends {
    run: (...args: any[]) => infer R;
} ? Awaited<R> : never;
export { ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS, zodObjectToContainerExportJsonSchema, } from './zod-container-export-json-schema';
export type OnChangeOpts = {
    layoutShift?: boolean;
};
export type ElementUIProps<T> = {
    onChange: (value: T, opts?: OnChangeOpts) => void;
    onBlur: () => void;
    value: T;
    readonly?: boolean;
};
export type WithThis<T> = T extends {
    methods: Record<string, any>;
    props: Record<string, any>;
} ? Omit<T, 'methods'> & {
    methods: {
        [K in keyof T['methods']]: T['methods'][K] extends (...args: infer A) => infer R ? (this: DeriveActionInstance<T>, ...args: A) => R : T['methods'][K];
    };
} : T;
//# sourceMappingURL=index.d.ts.map