/**
 * Execution tags: a first-class annotation channel on a single workflow
 * execution. An element calls `$.tag(key, value)` during `run` for author tags;
 * owning runtimes emit reserved system tags. The runtime carries tags to the
 * edge (batched on the run result as `$tags`, and/or live via the
 * `execution.tag` activity channel) and the UI renders them as badges in the
 * execution history.
 *
 * Tags are **orthogonal to the run lifecycle status** (`pending|running|
 * complete|error`): an execution can be `complete` yet tagged
 * `socket.state=disconnected`. They are annotations, not lifecycle transitions.
 *
 * This module is the single cross-runtime source of truth for the **known**
 * (system) tag vocabulary. The Go edge mirrors these exact string literals, the
 * element-host enforces them, and the web UI imports the registry for dedicated
 * badge styling. Author/free tags use any other key with a string value and
 * render generically. Reserved system keys are emitted only by the owning
 * runtime boundary; author code cannot set them through `$.tag`.
 */
/**
 * Reserved key for the deferred-HTTP held-socket lifecycle state. The edge owns
 * this tag (it is derived from the terminal `http.*` / disconnect / timeout
 * signals the edge already emits), so authors never set it directly — it is part
 * of the known vocabulary so the UI can render it as a first-class badge.
 */
export declare const SOCKET_STATE_TAG = "socket.state";
/**
 * Lifecycle of a deferred HTTP held socket:
 * - `open` — held, no terminal op yet.
 * - `completed` — a terminal op (respond/redirect/end) closed the exchange.
 * - `disconnected` — the client socket dropped before a terminal op.
 * - `timeout` — the deferred deadline elapsed with no terminal op.
 * - `aborted` — the exchange was abandoned (server-side teardown).
 */
export type SocketStateTagValue = 'open' | 'completed' | 'disconnected' | 'timeout' | 'aborted';
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
/** Author-declared custom tag key → allowed string value union. */
export type AuthorExecutionTags = Record<string, string>;
/**
 * A tag function narrowed to one author-declared registry. Use the original
 * {@link ExecutionTagFn} for intentionally free-form keys outside this scope.
 */
export interface DeclaredExecutionTagFn<Declared extends AuthorExecutionTags> {
    <K extends keyof Declared & string>(key: K extends KnownExecutionTagKey ? never : K, value: Declared[K]): void;
}
/**
 * `$.tag(key, value)` — attach a tag to the current execution for UI display.
 *
 * Reserved system keys (for example {@link SOCKET_STATE_TAG}) are intentionally
 * rejected here because their owning runtime is the source of truth. Any other
 * key accepts a free string for element-defined annotations (for example
 * `$.tag('rate.limited', 'true')`). Runtime boundaries repeat this check because
 * dynamically-computed strings cannot be excluded completely by TypeScript.
 */
export interface ExecutionTagFn {
    <K extends string>(key: K extends KnownExecutionTagKey ? never : K, value: string): void;
    /**
     * Narrow this function to an element-owned key/value registry. This is a
     * type-only authoring boundary: at runtime it returns the same tag emitter.
     *
     * @example
     * const tag = $.tag.typed<{
     *   'retry.state': 'scheduled' | 'exhausted';
     * }>();
     * tag('retry.state', 'scheduled');
     */
    typed<Declared extends AuthorExecutionTags>(): DeclaredExecutionTagFn<Declared>;
}
/** True when `key` is a reserved system tag key. */
export declare function isKnownExecutionTagKey(key: string): key is KnownExecutionTagKey;
//# sourceMappingURL=execution-tags.d.ts.map