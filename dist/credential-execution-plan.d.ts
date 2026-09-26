import { z } from 'zod';
/** Derived from the exact sealed offer; contains no account selection or credential material. */
export declare const ElementCredentialLayoutSchema: z.ZodObject<{
    slots: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        providerId: z.ZodString;
        path: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
    bindings: z.ZodArray<z.ZodObject<{
        requirementId: z.ZodString;
        slot: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
/** Trusted per-invocation join of the sealed layout and admitted account bindings. */
export declare const ElementCredentialExecutionPlanSchema: z.ZodObject<{
    v: z.ZodLiteral<1>;
    slots: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        providerId: z.ZodString;
        path: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
    bindings: z.ZodArray<z.ZodObject<{
        requirementId: z.ZodString;
        slot: z.ZodString;
        credentialFern: z.ZodString;
        credentialKind: z.ZodEnum<{
            static: "static";
            oauth: "oauth";
        }>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ElementCredentialLayout = z.infer<typeof ElementCredentialLayoutSchema>;
export type ElementCredentialExecutionPlan = z.infer<typeof ElementCredentialExecutionPlanSchema>;
//# sourceMappingURL=credential-execution-plan.d.ts.map