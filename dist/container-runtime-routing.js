"use strict";
/**
 * Resolved container timeout metadata persisted on workflow context rows
 * (`routingInfo` on ContextDataService saves).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTAINER_RUNTIME_ROUTING_SLUG = void 0;
exports.containerRuntimeRangeKey = containerRuntimeRangeKey;
exports.CONTAINER_RUNTIME_ROUTING_SLUG = '$container-runtime';
function containerRuntimeRangeKey(containerFern, slotId) {
    const fern = containerFern.trim();
    const slot = slotId.trim();
    return `$container-runtime#${fern}#${slot}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLXJ1bnRpbWUtcm91dGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250YWluZXItcnVudGltZS1yb3V0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7OztBQXVDSCw0REFJQztBQU5ZLFFBQUEsOEJBQThCLEdBQUcsb0JBQW9CLENBQUM7QUFFbkUsU0FBZ0Isd0JBQXdCLENBQUMsYUFBcUIsRUFBRSxNQUFjO0lBQzVFLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsT0FBTyxzQkFBc0IsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO0FBQzlDLENBQUMifQ==