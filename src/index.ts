// Element types
export type ElementString = { type: "string"; label?: string; description?: string };
export type ElementObject = { type: "object"; label?: string; description?: string };
export type ElementNumber = { type: "number"; label?: string; description?: string };
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

// Utility type for transforming prop definitions to their runtime types
export type PropType<T> =
  T extends { props: Record<string, any>; methods: Record<string, any> }
  ? DeriveAppInstance<T>
  : T extends { propDefinition: readonly [infer App, infer PropName] }
  ? App extends { props: Record<string, any> }
    ? PropName extends keyof App["props"]
      ? PropType<App["props"][PropName]>
      : unknown
    : unknown
  : T extends { type: "http_request" }
  ? { execute: () => Promise<{ headers?: Record<string, string>; [key: string]: any }> }
  : T extends { type: "string" } ? string
  : T extends { type: "object" } ? Record<string, unknown>
  : T extends { type: "number" } ? number
  : T extends { type: "boolean" } ? boolean
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
    (T extends { methods: Record<string, any> }
      ? { [K in keyof T["methods"]]: T["methods"][K] }
      : {})
  >;

// In your element-types
export type PropDefinitionType<App, PropName extends string> =
  App extends { propDefinitions: Record<string, any> }
    ? PropName extends keyof App['propDefinitions']
      ? PropType<App['propDefinitions'][PropName]>
      : unknown
    : unknown;

// --- Add this helper above DeriveActionInstance ---

type InferProp<P> =
  // 1. propDefinition support (new)
  P extends { propDefinition: readonly [infer App, infer PropName] }
    ? App extends { propDefinitions: Record<string, any> }
      ? PropName extends keyof App['propDefinitions']
        ? PropType<App['propDefinitions'][PropName]>
        : unknown
      : App extends { props: Record<string, any> }
        ? PropName extends keyof App['props']
          ? PropType<App['props'][PropName]>
          : unknown
        : unknown
  // 2. type: string, object, number, boolean, http_request, etc.
  : P extends { type: string }
    ? PropType<P>
  // 3. Nested objects (recursion)
  : P extends { props: Record<string, any> }
    ? { [K in keyof P['props']]: InferProp<P['props'][K]> }
  // 4. App with methods
  : P extends { type: "app"; methods: Record<string, any> }
    ? { [M in keyof P["methods"]]: P["methods"][M] }
  // 5. Fallback
  : P;

// Enhanced action instance type
export type DeriveActionInstance<T> =
  T extends { methods: Record<string, any>; props: Record<string, any> }
    ? Spread<
        Omit<T, "props" | "methods"> &
        { [K in keyof T["props"]]: InferProp<T["props"][K]> } &
        { [K in keyof T["methods"]]: T["methods"][K] }
      >
    : never;

// Helper type to create a module with proper this context
export type ModuleWithThis<T> = T & ThisType<DeriveActionInstance<T>>;

// Action-specific types
export interface Action<P extends Record<string, any> = Record<string, any>> extends ModuleDefinition {
  type: "action";
  props: P;
  run: (this: DeriveActionInstance<Action<P>>, params: { $: any }) => Promise<unknown>;
}

export type ActionInstance<A extends Action> = DeriveActionInstance<A>;

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