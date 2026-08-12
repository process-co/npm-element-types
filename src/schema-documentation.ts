import type { $input, input as ZodInput } from 'zod';

type ZodNamespace = typeof import('zod').z;

/**
 * Documentation keywords supported by Process schema projections.
 *
 * Zod's global metadata is copied into the JSON Schema produced by
 * `z.toJSONSchema()`. Declaring the keywords here makes them discoverable in
 * Monaco and, through Zod's `$replace` handling, types values against the
 * input accepted by the schema being documented.
 */
declare module 'zod/v4/core' {
  interface GlobalMeta {
    /** Example values accepted by this schema. */
    examples?: $input[];
    /** Default value advertised to documentation and client generators. */
    default?: $input;
    /** Marks a property as response-only in generated interface documents. */
    readOnly?: boolean;
    /** Marks a property as request-only in generated interface documents. */
    writeOnly?: boolean;
  }
}

declare module 'zod' {
  interface ZodType<Output, Input, Internals> {
    /**
     * Adds a typed example to this schema's documentation metadata.
     * Repeated calls append examples and survive JSON Schema projection.
     */
    example(value: ZodInput<this>): this;
  }
}

/**
 * Installs Process' small Zod authoring extensions on a Zod namespace.
 *
 * Zod 4 copies enumerable methods from `ZodType.prototype` onto every schema
 * during initialization. Defining the helper there therefore covers new,
 * cloned, refined, and wrapped schemas without replacing Zod internals.
 */
export function installZodSchemaDocumentation(zod: ZodNamespace): ZodNamespace {
  const prototype = zod.ZodType.prototype as typeof zod.ZodType.prototype & {
    example?: (value: unknown) => unknown;
  };
  if (typeof prototype.example === 'function') return zod;

  Object.defineProperty(prototype, 'example', {
    configurable: true,
    enumerable: true,
    value(this: {
      meta: {
        (): Record<string, unknown> | undefined;
        (metadata: Record<string, unknown>): unknown;
      };
    }, value: unknown) {
      const metadata = this.meta() ?? {};
      const existing = Array.isArray(metadata.examples) ? metadata.examples : [];
      return this.meta({ ...metadata, examples: [...existing, value] });
    },
  });
  return zod;
}

export {};
