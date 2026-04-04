/**
 * **`prop.type`** string prefixes that bind to runtime platform implementations
 * (**`$.interface.http`**, **`$.service.db`**, **`$.interface.timer`**, …).
 *
 * Keep in sync with:
 * - **`@process.co/compatibility`** authoring registry (**`excludeFromAuthoringInstanceShape`**)
 * - **`apps/web`** expression validation / console (skip misleading type-mismatch noise)
 */
export declare const PLATFORM_BOUND_LOADER_TYPE_PREFIXES: readonly ["$.interface.", "$.service."];
export declare function isPlatformBoundLoaderType(type: string): boolean;
//# sourceMappingURL=platform-loader-type.d.ts.map