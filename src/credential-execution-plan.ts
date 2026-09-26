import { z } from 'zod';
import { ElementCredentialSlotSchema, ElementCredentialSlotsSchema } from './credential-runtime-slots';

const requirementId = z.string().min(1).max(512).refine(value => value === value.trim(), 'Requirement identities must be canonical.');
const binding = z.object({ requirementId, slot: ElementCredentialSlotSchema.shape.id }).strict();
const slots = ElementCredentialSlotsSchema.refine(value => value.length > 0, 'Credential layouts require slots.');
const credentialFern = z.string().min(1).max(512).regex(/^[^:\[\]\s]+::credential::\[[^\[\]\s]+\]$/);

/** Derived from the exact sealed offer; contains no account selection or credential material. */
export const ElementCredentialLayoutSchema = z.object({
  slots, bindings: z.array(binding).min(1).max(64),
}).strict().superRefine(validateCoverage);

/** Trusted per-invocation join of the sealed layout and admitted account bindings. */
export const ElementCredentialExecutionPlanSchema = z.object({
  v: z.literal(1), slots,
  bindings: z.array(binding.extend({ credentialFern, credentialKind: z.enum(['oauth', 'static']) }).strict()).min(1).max(64),
}).strict().superRefine((plan, context) => {
  validateCoverage(plan, context);
  const kinds = new Map<string, string>();
  plan.bindings.forEach((value, index) => {
    const previous = kinds.get(value.credentialFern);
    if (previous && previous !== value.credentialKind) context.addIssue({
      code: 'custom', path: ['bindings', index], message: 'A shared credential must have one credential kind.',
    });
    kinds.set(value.credentialFern, value.credentialKind);
  });
});

function validateCoverage(
  value: { slots: Array<{ id: string }>; bindings: Array<{ requirementId: string; slot: string }> },
  context: z.RefinementCtx,
): void {
  const expected = new Set(value.slots.map(slot => slot.id));
  const requirements = new Set<string>(), covered = new Set<string>();
  value.bindings.forEach((item, index) => {
    if (requirements.has(item.requirementId) || covered.has(item.slot) || !expected.has(item.slot)) {
      context.addIssue({ code: 'custom', path: ['bindings', index], message: 'Credential bindings must uniquely cover declared slots and requirements.' });
    }
    requirements.add(item.requirementId); covered.add(item.slot);
  });
  if (value.slots.some(slot => !covered.has(slot.id))) context.addIssue({
    code: 'custom', path: ['bindings'], message: 'Every credential slot requires a binding.',
  });
}

export type ElementCredentialLayout = z.infer<typeof ElementCredentialLayoutSchema>;
export type ElementCredentialExecutionPlan = z.infer<typeof ElementCredentialExecutionPlanSchema>;
