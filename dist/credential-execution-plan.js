"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementCredentialExecutionPlanSchema = exports.ElementCredentialLayoutSchema = void 0;
const zod_1 = require("zod");
const credential_runtime_slots_1 = require("./credential-runtime-slots");
const requirementId = zod_1.z.string().min(1).max(512).refine(value => value === value.trim(), 'Requirement identities must be canonical.');
const binding = zod_1.z.object({ requirementId, slot: credential_runtime_slots_1.ElementCredentialSlotSchema.shape.id }).strict();
const slots = credential_runtime_slots_1.ElementCredentialSlotsSchema.refine(value => value.length > 0, 'Credential layouts require slots.');
const credentialFern = zod_1.z.string().min(1).max(512).regex(/^[^:\[\]\s]+::credential::\[[^\[\]\s]+\]$/);
/** Derived from the exact sealed offer; contains no account selection or credential material. */
exports.ElementCredentialLayoutSchema = zod_1.z.object({
    slots, bindings: zod_1.z.array(binding).min(1).max(64),
}).strict().superRefine(validateCoverage);
/** Trusted per-invocation join of the sealed layout and admitted account bindings. */
exports.ElementCredentialExecutionPlanSchema = zod_1.z.object({
    v: zod_1.z.literal(1), slots,
    bindings: zod_1.z.array(binding.extend({ credentialFern, credentialKind: zod_1.z.enum(['oauth', 'static']) }).strict()).min(1).max(64),
}).strict().superRefine((plan, context) => {
    validateCoverage(plan, context);
    const kinds = new Map();
    plan.bindings.forEach((value, index) => {
        const previous = kinds.get(value.credentialFern);
        if (previous && previous !== value.credentialKind)
            context.addIssue({
                code: 'custom', path: ['bindings', index], message: 'A shared credential must have one credential kind.',
            });
        kinds.set(value.credentialFern, value.credentialKind);
    });
});
function validateCoverage(value, context) {
    const expected = new Set(value.slots.map(slot => slot.id));
    const requirements = new Set(), covered = new Set();
    value.bindings.forEach((item, index) => {
        if (requirements.has(item.requirementId) || covered.has(item.slot) || !expected.has(item.slot)) {
            context.addIssue({ code: 'custom', path: ['bindings', index], message: 'Credential bindings must uniquely cover declared slots and requirements.' });
        }
        requirements.add(item.requirementId);
        covered.add(item.slot);
    });
    if (value.slots.some(slot => !covered.has(slot.id)))
        context.addIssue({
            code: 'custom', path: ['bindings'], message: 'Every credential slot requires a binding.',
        });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlZGVudGlhbC1leGVjdXRpb24tcGxhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jcmVkZW50aWFsLWV4ZWN1dGlvbi1wbGFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF3QjtBQUN4Qix5RUFBdUc7QUFFdkcsTUFBTSxhQUFhLEdBQUcsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3RJLE1BQU0sT0FBTyxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLHNEQUEyQixDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2pHLE1BQU0sS0FBSyxHQUFHLHVEQUE0QixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7QUFDbEgsTUFBTSxjQUFjLEdBQUcsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7QUFFckcsaUdBQWlHO0FBQ3BGLFFBQUEsNkJBQTZCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNwRCxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Q0FDakQsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcs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