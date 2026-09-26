import { z } from 'zod';

const identifier = z.string().min(1).max(128).regex(/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/);
const property = z.string().min(1).max(128).regex(/^[a-zA-Z_$][a-zA-Z0-9_$-]*$/)
  .refine(value => !['__proto__', 'prototype', 'constructor', '$auth'].includes(value), 'Unsafe credential target path.');

/** Path names the object whose $auth is injected; [] explicitly names the action. */
export const ElementCredentialSlotSchema = z.object({
  id: identifier,
  providerId: identifier,
  path: z.array(property).max(8),
}).strict();
export const ElementCredentialSlotsSchema = z.array(ElementCredentialSlotSchema).max(64).superRefine((slots, ctx) => {
  const ids = new Set<string>(), paths = new Set<string>();
  slots.forEach((slot, index) => {
    const path = JSON.stringify(slot.path);
    if (ids.has(slot.id) || paths.has(path)) ctx.addIssue({
      code: 'custom', path: [index], message: 'Credential slot IDs and target paths must be unique.',
    });
    ids.add(slot.id); paths.add(path);
  });
});

/** Logical source requirement -> explicit slot in the verified element build. */
export const ElementCredentialRuntimeBindingSchema = z.object({
  kind: z.literal('element-auth'), slot: identifier,
}).strict();
export type ElementCredentialSlot = z.infer<typeof ElementCredentialSlotSchema>;
export type ElementCredentialSlots = z.infer<typeof ElementCredentialSlotsSchema>;
export type ElementCredentialRuntimeBinding = z.infer<typeof ElementCredentialRuntimeBindingSchema>;
