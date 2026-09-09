# @process.co/element-types

[<img src="https://img.shields.io/npm/v/%40process.co%2Felement-types" />](https://www.npmjs.com/package/@process.co/element-types)
[<img src="https://img.shields.io/github/v/release/process-co/npm-element-types" />](https://github.com/process-co/npm-element-types/releases/latest)
[<img alt="GitHub package.json version (branch)" src="https://img.shields.io/github/package-json/v/process-co/npm-element-types/main?color=%23AA00AA" />
](https://github.com/process-co/npm-element-types#main)

TypeScript types and authoring helpers for **Process.co element modules** (apps, actions, signals). Use this package when defining element source in TypeScript so `this`, props, hooks, and host `params.$` surfaces are checked at compile time.

Runtime loaders, FERN merge output, and compatibility shims live in other packages (for example **`@process.co/compatibility`**, **`@process.co/elements`**).

## Installation

```bash
npm install @process.co/element-types
```

### Pinned version (GitHub)

```bash
npm install git+https://github.com/process-co/npm-element-types.git#v0.0.1
```

### Latest from `main` (GitHub)

```bash
npm install git+https://github.com/process-co/npm-element-types.git#main
```

## Element modules

### App (`defineApp`)

```typescript
import { defineApp, type DeriveAppInstance } from '@process.co/element-types';

const exampleApp = defineApp({
  type: 'app',
  app: 'example_app',
  props: {
    apiKey: {
      label: 'API Key',
      type: 'string',
    },
  } as const,
  methods: {
    async ping(this: DeriveAppInstance<typeof exampleApp>) {
      return { ok: true };
    },
  },
});

export type ExampleApp = typeof exampleApp;
export default exampleApp;
```

### Action (`defineAction`)

```typescript
import {
  defineAction,
  type ActionReentryOptions,
  type DeriveActionInstance,
} from '@process.co/element-types';

export const sendMessage = defineAction({
  type: 'action',
  app: 'example_app',
  key: 'send_message',
  props: { /* … */ } as const,
  methods: {
    async run(this: DeriveActionInstance<typeof sendMessage>, params) {
      // params.$ — FlowFunctions, send, stash, etc.
      const approval = await params.$.continuation('onApproval', {
        ttlSeconds: 15 * 60,
        channel: 'email',
      });
      // Send approval.url; approval.urlFor({ channel: 'sms' }) reuses the key.
      return {};
    },
  },
  reentry: {
    async onApproval({ $, input }: ActionReentryOptions<{ approvedBy: string }>) {
      $.export('approvedBy', input.approvedBy);
    },
  },
});
```

`reentry` is the dedicated bag for named continuation callbacks. Each callback
receives the normal trusted host as `$` and its external callback payload as
`input`; annotate `ActionReentryOptions<YourPayload>` (or
`SignalReentryOptions<YourPayload>`) to make that payload explicit. Unknown
callback names fail at runtime rather than falling back to `run`.

### Signal (`defineSignal`)

Signals handle inbound events (webhooks, etc.) via **`run`**. Optional **`hooks`** run on publish/save and lifecycle transitions.

```typescript
import { defineSignal } from '@process.co/element-types';

export const inboundWebhook = defineSignal({
  type: 'signal',
  app: 'example_app',
  key: 'inbound_webhook',
  ingress: {
    filters: [{ type: 'http_new_requests' }],
  },
  props: {
    httpInterface: { type: '$.interface.http' },
    cacheMaxAge: { type: '$.interface.duration', default: 86_400 },
  } as const,
  hooks: {
    async save({ $ }) {
      if ($.isDraft) return;
      await $.http.configureResponseCaching({
        maxAge: this.cacheMaxAge,
        varyBy: '*',
      });
    },
    async activate({ $ }) {
      $.export('lifecycle', 'activated');
    },
  },
  methods: {
    async run({ $, event }) {
      const parsed = await $.enforceSchema($.interfaceEmitSchema, event.body);
      if (!parsed.ok) throw new Error(parsed.message);
      await this.httpInterface.respond({ status: 200, body: { ok: true } });
    },
  },
});
```

Top-level `run` is still accepted for older definitions; runtime normalizes either shape via `restructureElement` in `@process.co/compatibility`.

Hook names accept both modern (`save`, `activate`, `deactivate`) and legacy (`onSave`, `onActivate`, `onDeactivate`) aliases.

`ingress.filters` is a static edge-ingress declaration. Save/publish materializes it to the reserved row field `$ingressFilters`. A `hooks.save` body can call `$.http.configureIngressFilters(...)` to replace the static default completely.

## Signal host surfaces

Host capabilities are **split by hook** so TypeScript prevents calling the wrong API:

| Surface | When | `params.$` type | Typical capabilities |
|--------|------|-----------------|----------------------|
| **`run`** | Live webhook / test execution | `SignalRunHostServices` | `enforceSchema`, `export`, `$transitionToSlot`, `interfaceEmitSchema` |
| **`hooks.save`** | Publish / save materialization | `SignalSaveHookHostServices` | `isDraft`, `http.configureResponseCaching`, `http.configureIngressFilters` |
| **`hooks.activate` / `hooks.deactivate`** | Lifecycle | `SignalLifecycleHookHostServices` | `isDraft`, `export` |

`this` in hooks is **`DeriveSignalHookInstance`** (props plus static metadata such as `ingress`, but no live `$emit` or HTTP interface methods). `this` in **`run`** is **`DeriveSignalInstance`** (includes runtime helpers such as HTTP interface methods).

### Draft vs production (`$.isDraft`)

`SignalHookHostContext.isDraft` is `true` during draft/editor materialization and `false` on publish/production hook runs.

The API runner resolves this with **`resolveSignalHookIsDraft`**:

```typescript
import { resolveSignalHookIsDraft } from '@process.co/element-types';

resolveSignalHookIsDraft({ isDraft: true }); // explicit flag wins
resolveSignalHookIsDraft({ executionContext: 'editor' }); // true
resolveSignalHookIsDraft({ executionContext: 'production' }); // false
```

## HTTP interface schema validation

Design-time schema blobs on `$.interface.schema` are described by **`HttpInterfaceSchemaWire`**. When **`validation`** is enabled, the runtime loads the compiled Zod ESM at **`compiledValidatorKey`** and validates through the host — not by parsing `exportSchema` JSON alone.

In element code:

- **`await $.enforceSchema(schema, value)`** — full Zod parse via the Process API (in **`run`**).
- **`validateEmitPayload`** / **`setSignalEmitValidationHost`** — shared emit validation when a host binding is installed (worker / bundled copies).

See JSDoc on **`HttpInterfaceSchemaWire`**, **`EnforceSchemaResult`**, and **`PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER`** for RPC envelope details.

## Durable Action definitions

`parseDurableActionDefinitions` validates element-authored, provider-neutral
lifecycles for actions that remain actionable or observable after one atomic
call. Definitions compose existing local actions, authored callable FERN selectors,
or explicitly pinned callables
with commands, timers, external-resource identity, normalized observations,
reconciliation, and existing action surfaces.

The authoring contract contains no credentials or inline provider code. Build
admission must resolve local references and authored selectors into exact versions
and physical builds before runtime execution. An `authored-callable` binding
contains a `definitionFern`; it is not an executable `CallableResourceReference`.
Resolution and runtime ingestion are separate work, not implemented by this parser. Externally mutable
resources must declare observation or reconciliation, hint observations cannot
settle a final state directly, and receipt projections cannot expose commands.

See the monorepo
[Durable Actions architecture](../../docs/durable-actions/ARCHITECTURE.md) for
the runtime, Event Client, tracked-resource, and card-projection boundaries.

## Type helpers

| Export | Purpose |
|--------|---------|
| `DeriveAppInstance<T>` | `this` for app methods |
| `DeriveActionInstance<T>` | `this` for action methods |
| `DeriveSignalInstance<T>` | `this` for signal **`run`** |
| `DeriveSignalHookInstance<T>` | `this` for signal hooks |
| `PropType<T>`, `PropDefinitionType<…>` | Prop value types from definitions |
| `SignalEventShape`, `SignalRunOptions` | Inbound event + run parameters |
| `RunReturn<T>` | Awaited return type of a module’s `run` |
| `DurableActionDefinition`, `DurableActionDefinitions` | Versioned state/effect/resource/observation/reconciliation/presentation authoring contract |
| `parseDurableActionDefinitions` | Validates Durable Action definitions plus references to local actions and action surfaces |

## Semantic interface authoring

Use `defineInterfaceType` to retain a literal, versioned interface identifier
and infer values from its Zod schema. Actions, signals, and sources can declare
`interfaces.native`, semantic `inputs`, and explicit projected `outputs`.
Every projection pins a mapping ID and revision. Properties can independently
add `interfaceType`; their structural `type` still controls editor rendering.

```ts
const EmailMessage = defineInterfaceType({
  id: 'process.email.message@1',
  title: 'Email message',
  description: 'A hydrated Internet email message.',
  schema: emailMessageSchema,
});

export default defineSource({
  type: 'source',
  interfaces: {
    native: 'process.smtp.inbound-message@1',
    outputs: [{
      interfaceType: EmailMessage.id,
      mapping: {
        mappingId: 'smtp-to-email',
        revisionId: 'mapping_rev_1',
        kind: 'declarative',
      },
      lossiness: 'lossless',
    }],
  },
  methods: { async run() {} },
});
```

Build and publish tooling materializes this static metadata into authoring
contract version 3. The compatibility source extractor reads TypeScript syntax
without evaluating author modules and rejects dynamic semantic declarations.

## Other exports

- **Slots** — `ISlotDefinition`, builtin action slot registry types.
- **Authoring contract** — `ELEMENT_AUTHORING_CONTRACT_VERSION`, `*AuthoringContract` wire types (runtime materialization: **`@process.co/compatibility`** `authoring-spec`).
- **CLI wire types** — `ProcessElementCliOutputWire` and related shapes from **`process-element`** output.
- **HTTP cache policy** — `ConfigureResponseCachingOptions`, `HTTP_REQUEST_CACHE_POLICY_KEY`, replay/vary wire types.
- **Zod → JSON Schema** — `zodObjectToContainerExportJsonSchema` for container export tooling.
- **Platform loader** — `isPlatformBoundLoaderType`, `PLATFORM_BOUND_LOADER_TYPE_PREFIXES`.

## Development (monorepo)

```bash
pnpm --filter @process.co/element-types build
pnpm --filter @process.co/element-types test
```

To publish to npm, prune/build/sync from the monorepo root — see root **`AGENTS.md`** and **`.cursor/skills/process-publishing-workflow`**.

## License

ISC


### Dynamic options capability declarations

Actions and signals may declare `optionsCapabilityClaims` separately from their
`capabilityClaims`. Options claims describe the permissions needed to populate
editor choices; execution claims describe the action or signal itself. A send
action can therefore use a read capability for its recipient lookup.

```ts
optionsCapabilityClaims: [{
  capability: 'calendar.events.read/v1',
  requiredScopes: ['Calendars.Read'],
  effect: {
    disposition: 'observe',
    reversibility: 'not-applicable',
    settlement: 'immediate',
  },
}]
```

When supplied, this list must be nonempty and every claim must explicitly declare
an observational effect. The build registry preserves these claims independently;
it does not infer options authority from execution claims. Omitting the field
keeps older packages loadable but does not establish authority for admitted options
execution. Claims describe requirements; runtime authorization must still check
the caller, selected connection, policy, and current execution ownership.

### Credential verification actions

A dedicated action can declare `credential.connection.verify/v1` in its normal
`capabilityClaims`, with the provider scopes needed for its read-only check. This
capability has canonical observational semantics. Its action must not also claim
any consequential operation. The existing build metadata and policy path carry
this declaration; no separate provider test registry is required.

The action returns the explicit `CredentialVerificationResult` contract:

```ts
{ contract: 'credential.connection.verification/v1', outcome: 'passed' }
```

Use `outcome: 'failed'` for a completed negative check. Transport failures and
unfinished execution are not completed verification results. The result contains
no provider response content, credential identity or execution identity.
`parseCredentialVerificationResult` rejects legacy `pass` objects and additional
fields. The application must bind a result to a real admitted execution, its
physical build, organization, credential and configuration revision before
writing a verification receipt. Fixture output is not provider verification.
A passing check establishes only the declared check; it cannot confer additional
scopes or reactivate revoked OAuth consent. The generic element `test` command
is not a substitute for this capability.

This SDK contract does not itself enable the application verification service;
providers and the admitted completion writer must be wired before verification
can be offered in Connections.
