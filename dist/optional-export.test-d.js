"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Compile-only checks: derived property types must preserve Zod's output. */
const zod_1 = require("zod");
const index_1 = require("./index");
const user = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.email().optional(),
    age: zod_1.z.number().optional(),
});
const action = (0, index_1.defineAction)({
    type: 'action',
    key: 'optional-user',
    version: '1.0.0',
    props: { user: { type: user } },
    async run({ $ }) {
        $.export('user', this.user);
        const name = this.user.name;
        const age = this.user.age;
        void [name, age];
    },
});
const minimal = { name: 'Ada' };
const omitted = {};
const explicitUndefined = { email: undefined };
const parsed = user.parse({ name: 'Ada' });
const serialized = parsed;
// @ts-expect-error Optional numeric fields do not admit strings.
const wrongAge = { age: '37' };
// @ts-expect-error Optional fields do not become nullable.
const nullName = { name: null };
void [minimal, omitted, explicitUndefined, serialized, wrongAge, nullName];
const profile = zod_1.z.object({
    id: zod_1.z.string(),
    user: user.optional(),
    note: zod_1.z.string().nullable(),
    count: zod_1.z.number().default(0),
    nested: zod_1.z.array(zod_1.z.object({ label: zod_1.z.string().optional() })),
});
const catchall = zod_1.z.object({ name: zod_1.z.string().optional() }).catchall(zod_1.z.number());
const passthrough = zod_1.z.object({ id: zod_1.z.string() }).passthrough();
const composed = (0, index_1.defineAction)({
    type: 'action',
    key: 'composed-user',
    version: '1.0.0',
    props: {
        profile: { type: profile },
        catchall: { type: catchall },
        passthrough: { type: passthrough },
        optionalUser: { type: user.optional() },
    },
    async run({ $ }) {
        $.export('profile', this.profile);
        const count = this.profile.count;
        const extraNumber = this.catchall['extra'];
        const unknownExtra = this.passthrough['extra'];
        // @ts-expect-error An optional root must be narrowed before export.
        $.export('optionalUser', this.optionalUser);
        if (this.optionalUser !== undefined)
            $.export('optionalUser', this.optionalUser);
        void [count, extraNumber, unknownExtra];
    },
});
const validProfile = { id: '1', note: null, count: 0, nested: [{}] };
// @ts-expect-error Required fields stay required.
const missingId = { note: null, count: 0, nested: [] };
// @ts-expect-error Nullable fields stay required.
const missingNote = { id: '1', count: 0, nested: [] };
// @ts-expect-error Zod defaults produce required output values.
const missingDefault = { id: '1', note: null, nested: [] };
// @ts-expect-error Nested values retain their declared type.
const invalidNested = { id: '1', note: null, count: 0, nested: [{ label: 1 }] };
void [validProfile, missingId, missingNote, missingDefault, invalidNested];
const optionalOutputMatches = true;
const profileOutputMatches = true;
const catchallOutputMatches = true;
const passthroughOutputMatches = true;
void [optionalOutputMatches, profileOutputMatches, catchallOutputMatches, passthroughOutputMatches];
function rejectsNonJsonExports($) {
    $.export('null', null);
    $.export('array', [minimal, null]);
    // @ts-expect-error Undefined is not a standalone JSON value.
    $.export('undefined', undefined);
    // @ts-expect-error Undefined array entries are not JSON values.
    $.export('undefined-array', [undefined]);
    // @ts-expect-error Arbitrary required undefined values are not JSON values.
    $.export('undefined-property', { value: undefined });
    // @ts-expect-error Functions cannot be exported.
    $.export('function', () => 'value');
    // @ts-expect-error BigInt cannot be serialized as JSON.
    $.export('bigint', 1n);
    // @ts-expect-error Nested unsupported values remain rejected.
    $.export('nested-function', { nested: { callback: () => 'value' } });
}
void rejectsNonJsonExports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uYWwtZXhwb3J0LnRlc3QtZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9vcHRpb25hbC1leHBvcnQudGVzdC1kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEVBQThFO0FBQzlFLDZCQUF3QjtBQUN4QixtQ0FBeUc7QUFFekcsTUFBTSxJQUFJLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNsQixJQUFJLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUMzQixLQUFLLEVBQUUsT0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUMzQixHQUFHLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtDQUM3QixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDeEIsSUFBSSxFQUFFLFFBQVE7SUFDZCxHQUFHLEVBQUUsZUFBZTtJQUNwQixPQUFPLEVBQUUsT0FBTztJQUNoQixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNYLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixNQUFNLElBQUksR0FBdUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDaEQsTUFBTSxHQUFHLEdBQXVCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQztDQUNKLENBQUMsQ0FBQztBQUdILE1BQU0sT0FBTyxHQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3RDLE1BQU0sT0FBTyxHQUFTLEVBQUUsQ0FBQztBQUN6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