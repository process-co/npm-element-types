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

export type ElementIcon = { type: "FontAwesome" | "MaterialIcons" | "ProcessIcons" | "RemoteImage"; icon: string | ['far' | 'fas' | 'fab' | 'fal' | 'fad', string] } | string;

// Base types for module definitions
export type ModuleDefinition = {
    type: string;
    app: string;
    propDefinitions: Record<string, unknown>;
    methods: Record<string, (params: any) => Promise<unknown>>;
};

export type SignalEventShape = {
    method: string;
    path: string;
    query: {
        [key: string]: string;
    };
    headers: {
        [key: string]: string;
    };
    bodyRaw: string;
    body: {
        [key: string]: JSONValue;
    };
};

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

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue; };

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

export interface ActionRunOptions {
    $: ProcessFunctions;
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
    $emit: (event: JSONValue, metadata?: EmitMetadata) => Promise<void>;
};

type IdEmitFunction = {
    $emit: (event: JSONValue, metadata: IdEmitMetadata) => Promise<void>;
};

// Utility type for transforming prop definitions to their runtime types
export type PropType<T> =
    // 1. If T is an app definition, derive its instance type
    T extends { props: Record<string, any>; methods: Record<string, any> }
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
    // 4. Built-in types
    : T extends { type: "http_request" }
    ? { execute: () => Promise<{ headers?: Record<string, string>;[key: string]: any }> }
    : T extends { type: "string" } ? string
    : T extends { type: "object" } ? Record<string, unknown>
    : T extends { type: "number" } ? number
    : T extends { type: "boolean" } ? boolean
    : T extends { type: "integer" } ? number
    : T extends { type: "$.interface.http" } ? {
        respond: (response: HTTPResponse) => Promise<any> | void;
        flow: FlowFunctions;
        execute: () => Promise<{ headers?: Record<string, string>;[key: string]: any }>
    }
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

export type DeriveSignalInstance<T> =
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

// In your element-types
export type PropDefinitionType<App, PropName extends string> =
    App extends { propDefinitions: Record<string, any> }
    ? PropName extends keyof App['propDefinitions']
    ? PropType<App['propDefinitions'][PropName]>
    : unknown
    : unknown;

// --- Add this helper above DeriveActionInstance ---

// Enhanced action instance type
export type DeriveActionInstance<T> =
    Spread<
        Omit<T, "props" | "propDefinitions" | "methods"> &
        (T extends { props: Record<string, any> }
            ? { [K in keyof T["props"]]: PropType<T["props"][K]> }
            : {}) &
        (T extends { propDefinitions: Record<string, any> }
            ? { [K in keyof T["propDefinitions"]]: PropType<T["propDefinitions"][K]> }
            : {}) &
        (T extends { methods: Record<string, any> }
            ? { [K in keyof T["methods"]]: T["methods"][K] }
            : {})
    >;

// Helper type to create a module with proper this context
export type ModuleWithThis<T> = T & ThisType<DeriveActionInstance<T>>;

// Action-specific types
export interface Action<P extends Record<string, any> = Record<string, any>> extends ModuleDefinition {
    type: "action";
    props: P;
    run: (this: DeriveActionInstance<Action<P>>, params: { $: any }) => Promise<unknown>;
}

export interface Signal<P extends Record<string, any> = Record<string, any>> extends ModuleDefinition {
    type: "signal";
    props: P;
    run: (this: DeriveSignalInstance<Signal<P>>, params: { event: SignalEventShape }) => Promise<unknown>;
}

type SignalRun<T> = (this: DeriveSignalInstance<T>, event: SignalEventShape) => Promise<void>;


export type ActionInstance<A extends Action> = DeriveActionInstance<A>;
export type SignalInstance<S extends Signal> = DeriveSignalInstance<S>;

export type SignalMethod<S extends Signal> = (this: SignalInstance<S>, params: SignalEventShape) => Promise<unknown>;
export type ActionMethod<A extends Action> = (this: ActionInstance<A>, params: { $: any }) => Promise<unknown>;

// Prop definition type
export type PropDefinition = {
    label: string;
    description: string;
    type: string;
    ui?: any;
};

// Helper to provide ThisType context for app definitions
export function defineApp<T extends object>(app: T & ThisType<DeriveAppInstance<T>>): T {
    return app;
}

// Helper to provide ThisType context for action definitions
export function defineAction<T extends object>(action: T & ThisType<DeriveActionInstance<T>>): T {
    return action;
}

export function defineSignal<T extends { run: (event: SignalEventShape) => Promise<void> }>(signal: T & ThisType<DeriveSignalInstance<T>>): T {
    return signal;
}  
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