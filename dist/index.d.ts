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
/** Full **`process-element` CLI** JSON shape + materializer for FERN-keyed props/slots (workflow-sdk / codegen). */
export type { ProcessElementPropCliWire, ProcessElementActionCliWire, ProcessElementSignalCliWire, ProcessElementCliOutputWire, } from './process-element-cli-output';
export type { MaterializedSlotBranch, MaterializedSlotLayout, MaterializedSlotDefinition, } from './materialize-slot-definition';
export { materializeSlotDefinition } from './materialize-slot-definition';
export type { MaterializedPropAuthoring, MaterializedActionAuthoringEntry, MaterializedSignalAuthoringEntry, MaterializedAuthoringCatalog, } from './materialize-authoring-from-cli-output';
export { buildProcessActionFern, buildProcessSignalFern, materializeAuthoringCatalogFromCliOutput, } from './materialize-authoring-from-cli-output';
/** Locked authoring catalog + helpers for FERN / slot / prop inference (not raw CLI JSON). */
export { ELEMENT_AUTHORING_CONTRACT_VERSION, toAuthoringCatalogContract, authoringCatalogContractFromCliOutput, } from './authoring-contract';
export type { AuthoringPropWireKind, AuthoringPropContract, SlotBranchAuthoringContract, SlotsAuthoringContract, ActionAuthoringContract, SignalAuthoringContract, ElementAuthoringCatalogContract, ChildStepsPropertyForBranch, ActionPropKeys, ActionContractByFern, FernAuthoringShardFileV1, } from './authoring-contract';
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
type StringToType<S extends string> = S extends "string" ? string : S extends "string(text)" ? string : S extends "string(html)" ? string : S extends "string(markdown)" ? string : S extends "string(json)" ? string : S extends "string(xml)" ? string : S extends "string(yaml)" ? string : S extends "string(csv)" ? string : S extends "string(tsv)" ? string : S extends "string(css)" ? string : S extends "string(sql)" ? string : S extends "string(email)" ? string : S extends "string(emailList)" ? string : S extends "string(urlList)" ? string : S extends "string(url)" ? string : S extends "number" ? number : S extends "boolean" ? boolean : S extends "null" ? null : S extends "undefined" ? undefined : S extends "object" ? object : S extends "any" ? any : S extends "unknown" ? unknown : S extends "never" ? never : S extends "void" ? void : never;
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
type PropTypeFromTypeValue<U, T = unknown> = U extends z.ZodObject<any, any> ? InferZodObjectShape<U> : U extends z.ZodArray<infer Item> ? Expand<Array<InferZodOutput<Item>>> : U extends z.ZodTypeAny ? Expand<InferZodOutput<U>> : U extends "http_request" ? {
    execute: () => Promise<{
        headers?: Record<string, string>;
        [key: string]: any;
    }>;
} : U extends "string" ? [PropOptionsValue<T>] extends [never] ? string : PropOptionsValue<T> : U extends "string(html)" ? string : U extends "string(markdown)" ? string : U extends "string(json)" ? string : U extends "string(xml)" ? string : U extends "string(yaml)" ? string : U extends "string(base64)" ? string : U extends "string(csv)" ? string : U extends "string(tsv)" ? string : U extends "string(css)" ? string : U extends "string(sql)" ? string : U extends "string(email)" ? string : U extends "string(emailList)" ? string[] : U extends "string(urlList)" ? string[] : U extends "string(url)" ? string : U extends `$infer<${string}>` ? InferType<U> : U extends "$infer" ? any : U extends "object" ? Record<string, unknown> : U extends `object(${PropObjectDefinitionTypes})` ? any : U extends `file(${PropFileDefinitionTypes})` ? IFile : U extends "number" ? number : U extends "boolean" ? boolean : U extends "integer" ? number : U extends "$.interface.http" ? {
    respond: (response: HTTPResponse) => Promise<any> | void;
    authenticate: (authType: HTTPAuthenticationType, options?: {
        token?: string;
    }) => Promise<any> | void;
    flow: FlowFunctions;
    end: () => void;
    execute: () => Promise<{
        headers?: Record<string, string>;
        [key: string]: any;
    }>;
} : unknown;
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
    run: (this: DeriveSignalInstance<Signal<P>>, params: {
        event: SignalEventShape;
    }) => Promise<unknown>;
}
export type ActionInstance<A extends Action> = DeriveActionInstance<A>;
export type SignalInstance<S extends Signal> = DeriveSignalInstance<S>;
export type SignalMethod<S extends Signal> = (this: SignalInstance<S>, params: SignalEventShape) => Promise<unknown>;
export type ActionMethod<A extends Action> = (this: ActionInstance<A>, params: {
    $: any;
}) => Promise<unknown>;
export type PropStringDefinitionTypes = "text" | "html" | "markdown" | "json" | "xml" | "yaml" | "csv" | "tsv" | "css" | "sql" | "email" | "emailList" | "urlList" | "url" | "base64";
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
    run: (event: SignalEventShape) => Promise<void>;
}>(signal: T & ThisType<DeriveSignalInstance<T>>): T;
export type RunReturn<T> = T extends {
    run: (...args: any[]) => infer R;
} ? Awaited<R> : never;
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