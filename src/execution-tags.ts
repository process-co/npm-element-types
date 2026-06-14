/**
 * Execution tags: a first-class, element-emittable annotation channel on a
 * single workflow execution. An element calls `$.tag(key, value)` during `run`
 * to attach a labelled status to its execution; the runtime carries the tags to
 * the edge (batched on the run result as `$tags`, and/or live via the
 * `execution.tag` host-proxy op) and the UI renders them as badges in the
 * execution history.
 *
 * Tags are **orthogonal to the run lifecycle status** (`pending|running|
 * complete|error`): an execution can be `complete` yet tagged
 * `socket.state=disconnected`. They are annotations, not lifecycle transitions.
 *
 * This module is the single cross-runtime source of truth for the **known**
 * (system) tag vocabulary. The Go edge mirrors these exact string literals, the
 * element-host emits them, and the web UI keys dedicated badge styling off them.
 * Author/free tags use any other key with a string value and render generically.
 */

/**
 * Reserved key for the deferred-HTTP held-socket lifecycle state. The edge owns
 * this tag (it is derived from the terminal `http.*` / disconnect / timeout
 * signals the edge already emits), so authors never set it directly — it is part
 * of the known vocabulary so the UI can render it as a first-class badge.
 */
export const SOCKET_STATE_TAG = 'socket.state';

/**
 * Lifecycle of a deferred HTTP held socket:
 * - `open` — held, no terminal op yet.
 * - `completed` — a terminal op (respond/redirect/end) closed the exchange.
 * - `disconnected` — the client socket dropped before a terminal op.
 * - `timeout` — the deferred deadline elapsed with no terminal op.
 * - `aborted` — the exchange was abandoned (server-side teardown).
 */
export type SocketStateTagValue =
  | 'open'
  | 'completed'
  | 'disconnected'
  | 'timeout'
  | 'aborted';

/**
 * Closed registry of known/system execution tags: reserved key → allowed value
 * union. Extend this type (and the mirrors in the edge + web registries) when a
 * new system tag graduates from a free author tag to a first-class badge.
 */
export type KnownExecutionTags = {
  [SOCKET_STATE_TAG]: SocketStateTagValue;
};

/** Reserved key of a known/system execution tag. */
export type KnownExecutionTagKey = keyof KnownExecutionTags;

/** A single tag value on the wire. Known keys narrow this via {@link ExecutionTagFn}. */
export type ExecutionTagValue = string;

/**
 * Aggregated execution tags carried on a run result as `$tags`. Last write per
 * key wins. Stored as a plain string map for transport stability; per-key value
 * typing is enforced at the {@link ExecutionTagFn} call site, not here.
 */
export type ExecutionTags = Record<string, ExecutionTagValue>;

/**
 * `$.tag(key, value)` — attach a tag to the current execution for UI display.
 *
 * Known keys (e.g. {@link SOCKET_STATE_TAG}) get literal-union value typing for
 * autocomplete + safety; any other key accepts a free string for element-defined
 * annotations (e.g. `$.tag('rate.limited', 'true')`).
 */
export interface ExecutionTagFn {
  <K extends KnownExecutionTagKey>(key: K, value: KnownExecutionTags[K]): void;
  (key: string, value: string): void;
}

/** True when `key` is a reserved system tag key. */
export function isKnownExecutionTagKey(key: string): key is KnownExecutionTagKey {
  return key === SOCKET_STATE_TAG;
}
