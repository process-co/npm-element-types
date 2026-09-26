"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementCredentialRuntimeBindingSchema = exports.ElementCredentialSlotsSchema = exports.ElementCredentialSlotSchema = void 0;
const zod_1 = require("zod");
const identifier = zod_1.z.string().min(1).max(128).regex(/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/);
const property = zod_1.z.string().min(1).max(128).regex(/^[a-zA-Z_$][a-zA-Z0-9_$-]*$/)
    .refine(value => !['__proto__', 'prototype', 'constructor', '$auth'].includes(value), 'Unsafe credential target path.');
/** Path names the object whose $auth is injected; [] explicitly names the action. */
exports.ElementCredentialSlotSchema = zod_1.z.object({
    id: identifier,
    providerId: identifier,
    path: zod_1.z.array(property).max(8),
}).strict();
exports.ElementCredentialSlotsSchema = zod_1.z.array(exports.ElementCredentialSlotSchema).max(64).superRefine((slots, ctx) => {
    const ids = new Set(), paths = new Set();
    slots.forEach((slot, index) => {
        const path = JSON.stringify(slot.path);
        if (ids.has(slot.id) || paths.has(path))
            ctx.addIssue({
                code: 'custom', path: [index], message: 'Credential slot IDs and target paths must be unique.',
            });
        ids.add(slot.id);
        paths.add(path);
    });
});
/** Logical source requirement -> explicit slot in the verified element build. */
exports.ElementCredentialRuntimeBindingSchema = zod_1.z.object({
    kind: zod_1.z.literal('element-auth'), slot: identifier,
}).strict();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlZGVudGlhbC1ydW50aW1lLXNsb3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NyZWRlbnRpYWwtcnVudGltZS1zbG90cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBd0I7QUFFeEIsTUFBTSxVQUFVLEdBQUcsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDckYsTUFBTSxRQUFRLEdBQUcsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDO0tBQzdFLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUUxSCxxRkFBcUY7QUFDeEUsUUFBQSwyQkFBMkIsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2xELEVBQUUsRUFBRSxVQUFVO0lBQ2QsVUFBVSxFQUFFLFVBQVU7SUFDdEIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztDQUMvQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDQyxRQUFBLDRCQUE0QixHQUFHLE9BQUMsQ0FBQyxLQUFLLENBQUMsbUNBQTJCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ2xILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFVLEVBQUUsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFDekQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUM1QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDcEQsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsc0RBQXNEO2FBQy9GLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsaUZBQWlGO0FBQ3BFLFFBQUEscUNBQXFDLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM1RCxJQUFJLEVBQUUsT0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVTtDQUNsRCxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMifQ==