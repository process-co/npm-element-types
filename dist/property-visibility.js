"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePropVisibility = evaluatePropVisibility;
/**
 * Select controls can persist numeric option values as strings even when the
 * element definition authored the option and visibility condition as numbers.
 * Treat only that lossless number/string boundary as equivalent; avoid the
 * broader and surprising coercions performed by loose equality.
 */
function visibilityValuesEqual(left, right) {
    if (Object.is(left, right))
        return true;
    if (typeof left === 'number' && typeof right === 'string') {
        return right.trim() !== '' && Number(right) === left;
    }
    if (typeof left === 'string' && typeof right === 'number') {
        return left.trim() !== '' && Number(left) === right;
    }
    return false;
}
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
        if (condition.equals !== undefined && !visibilityValuesEqual(propertyValue, condition.equals))
            return false;
        if (condition.notEquals !== undefined && visibilityValuesEqual(propertyValue, condition.notEquals))
            return false;
        if (condition.in !== undefined) {
            if (!Array.isArray(condition.in) || !condition.in.some((value) => visibilityValuesEqual(propertyValue, value)))
                return false;
        }
        if (condition.notIn !== undefined) {
            if (Array.isArray(condition.notIn) && condition.notIn.some((value) => visibilityValuesEqual(propertyValue, value)))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktdmlzaWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9wZXJ0eS12aXNpYmlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBaUNBLHdEQXFDQztBQTFERDs7Ozs7R0FLRztBQUNILFNBQVMscUJBQXFCLENBQUMsSUFBYSxFQUFFLEtBQWM7SUFDeEQsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUV4QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUN4RCxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQztJQUN6RCxDQUFDO0lBRUQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDeEQsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUM7SUFDeEQsQ0FBQztJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxxRkFBcUY7QUFDckYsU0FBZ0Isc0JBQXNCLENBQ2xDLFdBQW9CLEVBQ3BCLElBQTZCO0lBRTdCLElBQUksQ0FBQyxXQUFXLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUNoRixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsS0FBSyxNQUFNLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUNwRSxJQUFJLENBQUMsWUFBWSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7WUFDbkYsU0FBUztRQUNiLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEMsTUFBTSxTQUFTLEdBQUcsWUFBdUMsQ0FBQztRQUUxRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUM1RyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDakgsSUFBSSxTQUFTLENBQUMsRUFBRSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDakksQ0FBQztRQUNELElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNoQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDckksQ0FBQztRQUNELElBQUksU0FBUyxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN0QyxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsSUFBSSxhQUFhLElBQUksU0FBUyxDQUFDLFdBQVc7Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDbEcsQ0FBQztRQUNELElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNuQyxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsSUFBSSxhQUFhLElBQUksU0FBUyxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDL0YsQ0FBQztRQUNELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxNQUFNLE1BQU0sR0FBRyxhQUFhLEtBQUssU0FBUyxJQUFJLGFBQWEsS0FBSyxJQUFJLENBQUM7WUFDckUsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLE1BQU07Z0JBQUUsT0FBTyxLQUFLLENBQUM7UUFDbEQsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIn0=