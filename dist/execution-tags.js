"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_STATE_TAG = void 0;
exports.isKnownExecutionTagKey = isKnownExecutionTagKey;
/**
 * Reserved key for the deferred-HTTP held-socket lifecycle state. The edge owns
 * this tag (it is derived from the terminal `http.*` / disconnect / timeout
 * signals the edge already emits), so authors never set it directly — it is part
 * of the known vocabulary so the UI can render it as a first-class badge.
 */
exports.SOCKET_STATE_TAG = 'socket.state';
/** True when `key` is a reserved system tag key. */
function isKnownExecutionTagKey(key) {
    return key === exports.SOCKET_STATE_TAG;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0aW9uLXRhZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZXhlY3V0aW9uLXRhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7OztBQTRGSCx3REFFQztBQTVGRDs7Ozs7R0FLRztBQUNVLFFBQUEsZ0JBQWdCLEdBQUcsY0FBYyxDQUFDO0FBbUYvQyxvREFBb0Q7QUFDcEQsU0FBZ0Isc0JBQXNCLENBQUMsR0FBVztJQUNoRCxPQUFPLEdBQUcsS0FBSyx3QkFBZ0IsQ0FBQztBQUNsQyxDQUFDIn0=