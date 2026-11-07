/** Compile-only checks: derived property types must preserve Zod's output. */
import { z } from 'zod';
import { defineAction, type DeriveActionInstance, type JSONValue, type ProcessFunctions } from './index';

const user = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    age: z.number().optional(),
});

const action = defineAction({
    type: 'action',
    key: 'optional-user',
    version: '1.0.0',
    props: { user: { type: user } },
    async run({ $ }) {
        $.export('user', this.user);
        const name: string | undefined = this.user.name;
        const age: number | undefined = this.user.age;
        void [name, age];
    },
});

type User = DeriveActionInstance<typeof action>['user'];
const minimal: User = { name: 'Ada' };
const omitted: User = {};
const explicitUndefined: User = { email: undefined };
const parsed: User = user.parse({ name: 'Ada' });
const serialized: JSONValue = parsed;
// @ts-expect-error Optional numeric fields do not admit strings.
const wrongAge: User = { age: '37' };
// @ts-expect-error Optional fields do not become nullable.
const nullName: User = { name: null };
void [minimal, omitted, explicitUndefined, serialized, wrongAge, nullName];

const profile = z.object({
    id: z.string(),
    user: user.optional(),
    note: z.string().nullable(),
    count: z.number().default(0),
    nested: z.array(z.object({ label: z.string().optional() })),
});
const catchall = z.object({ name: z.string().optional() }).catchall(z.number());
const passthrough = z.object({ id: z.string() }).passthrough();
const composed = defineAction({
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
        const count: number = this.profile.count;
        const extraNumber: number | undefined = this.catchall['extra'];
        const unknownExtra: unknown = this.passthrough['extra'];
        // @ts-expect-error An optional root must be narrowed before export.
        $.export('optionalUser', this.optionalUser);
        if (this.optionalUser !== undefined) $.export('optionalUser', this.optionalUser);
        void [count, extraNumber, unknownExtra];
    },
});

type Composed = DeriveActionInstance<typeof composed>;
type Profile = Composed['profile'];
const validProfile: Profile = { id: '1', note: null, count: 0, nested: [{}] };
// @ts-expect-error Required fields stay required.
const missingId: Profile = { note: null, count: 0, nested: [] };
// @ts-expect-error Nullable fields stay required.
const missingNote: Profile = { id: '1', count: 0, nested: [] };
// @ts-expect-error Zod defaults produce required output values.
const missingDefault: Profile = { id: '1', note: null, nested: [] };
// @ts-expect-error Nested values retain their declared type.
const invalidNested: Profile = { id: '1', note: null, count: 0, nested: [{ label: 1 }] };
void [validProfile, missingId, missingNote, missingDefault, invalidNested];

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2) ? true : false;
const optionalOutputMatches: Equal<User, z.output<typeof user>> = true;
const profileOutputMatches: Equal<Profile, z.output<typeof profile>> = true;
const catchallOutputMatches: Equal<Composed['catchall'], z.output<typeof catchall>> = true;
const passthroughOutputMatches: Equal<Composed['passthrough'], z.output<typeof passthrough>> = true;
void [optionalOutputMatches, profileOutputMatches, catchallOutputMatches, passthroughOutputMatches];

function rejectsNonJsonExports($: ProcessFunctions) {
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
