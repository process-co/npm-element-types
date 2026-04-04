"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = void 0;
exports.isPlatformBoundLoaderType = isPlatformBoundLoaderType;
/**
 * **`prop.type`** string prefixes that bind to runtime platform implementations
 * (**`$.interface.http`**, **`$.service.db`**, **`$.interface.timer`**, …).
 *
 * Keep in sync with:
 * - **`@process.co/compatibility`** authoring registry (**`excludeFromAuthoringInstanceShape`**)
 * - **`apps/web`** expression validation / console (skip misleading type-mismatch noise)
 */
exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = ['$.interface.', '$.service.'];
function isPlatformBoundLoaderType(type) {
    const t = type.trim();
    return exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES.some((p) => t.startsWith(p));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tbG9hZGVyLXR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGxhdGZvcm0tbG9hZGVyLXR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBVUEsOERBR0M7QUFiRDs7Ozs7OztHQU9HO0FBQ1UsUUFBQSxtQ0FBbUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQVUsQ0FBQztBQUUzRixTQUFnQix5QkFBeUIsQ0FBQyxJQUFZO0lBQ3BELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QixPQUFPLDJDQUFtQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFFLENBQUMifQ==