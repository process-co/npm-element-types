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
export type ElementBoolean = {
    type: "boolean";
    label?: string;
    description?: string;
};
export type ElementApp<T> = {
    type: "app";
    app: T;
};
export type ModuleDefinition = {
    type: string;
    app: string;
    propDefinitions: Record<string, unknown>;
    methods: Record<string, (params: any) => Promise<unknown>>;
};
export type PropType<T> = T extends {
    props: Record<string, any>;
    methods: Record<string, any>;
} ? DeriveAppInstance<T> : T extends {
    type: "string";
} ? string : T extends {
    type: "object";
} ? Record<string, unknown> : T extends {
    type: "number";
} ? number : T extends {
    type: "boolean";
} ? boolean : unknown;
export type ModuleShape = {
    type: string;
    props: Record<string, any>;
    methods: Record<string, any>;
};
export type Spread<T> = {
    [K in keyof T]: T[K];
};
export type DeriveAppInstance<T> = T extends {
    methods: Record<string, any>;
    props: Record<string, any>;
} ? Spread<Omit<T, "props" | "methods"> & {
    [K in keyof T["props"]]: PropType<T["props"][K]>;
} & {
    [K in keyof T["methods"]]: T["methods"][K];
}> : never;
export type DeriveActionInstance<T> = T extends {
    methods: Record<string, any>;
    props: Record<string, any>;
} ? Spread<Omit<T, "props" | "methods"> & {
    [K in keyof T["props"]]: T["props"][K] extends {
        type: string;
    } ? PropType<T["props"][K]> : T["props"][K] extends {
        type: "app";
        methods: Record<string, any>;
    } ? {
        [M in keyof T["props"][K]["methods"]]: T["props"][K]["methods"][M];
    } : T["props"][K] extends {
        methods: Record<string, any>;
        props: Record<string, any>;
    } ? DeriveActionInstance<T["props"][K]> : T["props"][K];
} & {
    [K in keyof T["methods"]]: T["methods"][K];
}> : never;
export type ModuleWithThis<T> = T & ThisType<DeriveActionInstance<T>>;
export interface Action<P extends Record<string, any> = Record<string, any>> extends ModuleDefinition {
    type: "action";
    props: P;
    run: (this: DeriveActionInstance<Action<P>>, params: {
        $: any;
    }) => Promise<unknown>;
}
export type ActionInstance<A extends Action> = DeriveActionInstance<A>;
export type ActionMethod<A extends Action> = (this: ActionInstance<A>, params: {
    $: any;
}) => Promise<unknown>;
export type PropDefinition = {
    label: string;
    description: string;
    type: string;
    ui?: any;
};
export declare function defineApp<T extends object>(app: T & ThisType<DeriveAppInstance<T>>): T;
export declare function defineAction<T extends object>(action: T & ThisType<DeriveActionInstance<T>>): T;
export type WithThis<T> = T extends {
    methods: Record<string, any>;
    props: Record<string, any>;
} ? Omit<T, 'methods'> & {
    methods: {
        [K in keyof T['methods']]: T['methods'][K] extends (...args: infer A) => infer R ? (this: DeriveActionInstance<T>, ...args: A) => R : T['methods'][K];
    };
} : T;
//# sourceMappingURL=index.d.ts.map