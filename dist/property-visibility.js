"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePropVisibility = evaluatePropVisibility;
/** Evaluates the shared declarative visibility contract used by property editors. */
function evaluatePropVisibility(visibleWhen, data) {
    if (!visibleWhen || typeof visibleWhen !== 'object' || Array.isArray(visibleWhen)) {
        return true;
    }
    for (const [propertyKey, rawCondition] of Object.entries(visibleWhen)) {
        if (!rawCondition || typeof rawCondition !== 'object' || Array.isArray(rawCondition)) {
            continue;
        }
        const propertyValue = data[propertyKey];
        const condition = rawCondition;
        if (condition.equals !== undefined && propertyValue !== condition.equals)
            return false;
        if (condition.notEquals !== undefined && propertyValue === condition.notEquals)
            return false;
        if (condition.in !== undefined) {
            if (!Array.isArray(condition.in) || !condition.in.includes(propertyValue))
                return false;
        }
        if (condition.notIn !== undefined) {
            if (Array.isArray(condition.notIn) && condition.notIn.includes(propertyValue))
                return false;
        }
        if (condition.greaterThan !== undefined) {
            if (typeof propertyValue !== 'number' || propertyValue <= condition.greaterThan)
                return false;
        }
        if (condition.lessThan !== undefined) {
            if (typeof propertyValue !== 'number' || propertyValue >= condition.lessThan)
                return false;
        }
        if (condition.exists !== undefined) {
            const exists = propertyValue !== undefined && propertyValue !== null;
            if (condition.exists !== exists)
                return false;
        }
    }
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktdmlzaWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wZXJ0eS12aXNpYmlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBYUEsd0RBcUNDO0FBdENELHFGQUFxRjtBQUNyRixTQUFnQixzQkFBc0IsQ0FDbEMsV0FBb0IsRUFDcEIsSUFBNkI7SUFFN0IsSUFBSSxDQUFDLFdBQVcsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ2hGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLE1BQU0sQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3BFLElBQUksQ0FBQyxZQUFZLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUNuRixTQUFTO1FBQ2IsQ0FBQztRQUVELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4QyxNQUFNLFNBQVMsR0FBRyxZQUF1QyxDQUFDO1FBRTFELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksYUFBYSxLQUFLLFNBQVMsQ0FBQyxNQUFNO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDdkYsSUFBSSxTQUFTLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxhQUFhLEtBQUssU0FBUyxDQUFDLFNBQVM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUM3RixJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzVGLENBQUM7UUFDRCxJQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDaEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDaEcsQ0FBQztRQUNELElBQUksU0FBUyxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN0QyxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsSUFBSSxhQUFhLElBQUksU0FBUyxDQUFDLFdBQVc7Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDbEcsQ0FBQztRQUNELElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNuQyxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsSUFBSSxhQUFhLElBQUksU0FBUyxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDL0YsQ0FBQztRQUNELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxNQUFNLE1BQU0sR0FBRyxhQUFhLEtBQUssU0FBUyxJQUFJLGFBQWEsS0FBSyxJQUFJLENBQUM7WUFDckUsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLE1BQU07Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDbEQsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIn0=