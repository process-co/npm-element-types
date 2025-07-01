// Element types
export type ElementString = { type: "string"; label?: string; description?: string };
export type ElementObject = { type: "object"; label?: string; description?: string };
export type ElementNumber = { type: "number"; label?: string; description?: string };
export type ElementBoolean = { type: "boolean"; label?: string; description?: string };
export type ElementApp<T> = { type: "app"; app: T };

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
export type DeriveAppInstance<T> =
  T extends { methods: Record<string, any>; props: Record<string, any> }
  ? Spread<
    Omit<T, "props" | "methods"> &
    { [K in keyof T["props"]]: PropType<T["props"][K]> } &
    { [K in keyof T["methods"]]: T["methods"][K] }
  >
  : never;

// Helper type to derive instance type from action/source definition, fully flattened
export type DeriveActionInstance<T> =
  T extends { methods: Record<string, any>; props: Record<string, any> }
  ? Spread<
    Omit<T, "props" | "methods"> &
    { [K in keyof T["props"]]: T["props"][K] extends { type: string }
      ? PropType<T["props"][K]>
      : T["props"][K] extends { type: "app"; methods: Record<string, any> }
      ? { [M in keyof T["props"][K]["methods"]]: T["props"][K]["methods"][M] }
      : T["props"][K] extends { methods: Record<string, any>; props: Record<string, any> }
      ? DeriveActionInstance<T["props"][K]>
      : T["props"][K]
    } &
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