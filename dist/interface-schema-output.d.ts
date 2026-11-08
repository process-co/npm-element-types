import { z } from 'zod';
/** Definition-owned placement of a configured schema within the emitted value. */
export declare const InterfaceSchemaOutputBindingSchema: z.ZodObject<{
    path: z.ZodArray<z.ZodString>;
    rootWhen: z.ZodOptional<z.ZodObject<{
        property: z.ZodString;
        equals: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
    }, z.core.$strip>>;
}, z.core.$strict>;
export type InterfaceSchemaOutputBinding = z.infer<typeof InterfaceSchemaOutputBindingSchema>;
export declare function hasInterfaceSchemaOutputBinding(properties: readonly unknown[]): boolean;
/** Typing only. This does not change validation scope or validate the envelope. */
export declare function projectInterfaceSchemaOutput(schema: Record<string, unknown>, data: unknown, properties: readonly unknown[], nativeSchema?: Record<string, unknown>): Record<string, unknown>;
//# sourceMappingURL=interface-schema-output.d.ts.map