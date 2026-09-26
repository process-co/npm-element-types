import { z } from 'zod';
/** Path names the object whose $auth is injected; [] explicitly names the action. */
export declare const ElementCredentialSlotSchema: z.ZodObject<{
    id: z.ZodString;
    providerId: z.ZodString;
    path: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export declare const ElementCredentialSlotsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    providerId: z.ZodString;
    path: z.ZodArray<z.ZodString>;
}, z.core.$strict>>;
/** Logical source requirement -> explicit slot in the verified element build. */
export declare const ElementCredentialRuntimeBindingSchema: z.ZodObject<{
    kind: z.ZodLiteral<"element-auth">;
    slot: z.ZodString;
}, z.core.$strict>;
export type ElementCredentialSlot = z.infer<typeof ElementCredentialSlotSchema>;
export type ElementCredentialSlots = z.infer<typeof ElementCredentialSlotsSchema>;
export type ElementCredentialRuntimeBinding = z.infer<typeof ElementCredentialRuntimeBindingSchema>;
//# sourceMappingURL=credential-runtime-slots.d.ts.map