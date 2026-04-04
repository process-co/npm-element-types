/**
 * **`prop.type`** string prefixes that bind to runtime platform implementations
 * (**`$.interface.http`**, **`$.service.db`**, **`$.interface.timer`**, …).
 *
 * Keep in sync with:
 * - **`@process.co/compatibility`** authoring registry (**`excludeFromAuthoringInstanceShape`**)
 * - **`apps/web`** expression validation / console (skip misleading type-mismatch noise)
 */
export const PLATFORM_BOUND_LOADER_TYPE_PREFIXES = ['$.interface.', '$.service.'] as const;

export function isPlatformBoundLoaderType(type: string): boolean {
  const t = type.trim();
  return PLATFORM_BOUND_LOADER_TYPE_PREFIXES.some((p) => t.startsWith(p));
}
