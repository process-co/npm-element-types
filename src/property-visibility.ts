export type PropVisibilityCondition = {
    equals?: unknown;
    notEquals?: unknown;
    in?: readonly unknown[];
    notIn?: readonly unknown[];
    greaterThan?: number;
    lessThan?: number;
    exists?: boolean;
};

export type PropVisibilityDefinition = Record<string, PropVisibilityCondition>;

/** Evaluates the shared declarative visibility contract used by property editors. */
export function evaluatePropVisibility(
    visibleWhen: unknown,
    data: Record<string, unknown>,
): boolean {
    if (!visibleWhen || typeof visibleWhen !== 'object' || Array.isArray(visibleWhen)) {
        return true;
    }

    for (const [propertyKey, rawCondition] of Object.entries(visibleWhen)) {
        if (!rawCondition || typeof rawCondition !== 'object' || Array.isArray(rawCondition)) {
            continue;
        }

        const propertyValue = data[propertyKey];
        const condition = rawCondition as PropVisibilityCondition;

        if (condition.equals !== undefined && propertyValue !== condition.equals) return false;
        if (condition.notEquals !== undefined && propertyValue === condition.notEquals) return false;
        if (condition.in !== undefined) {
            if (!Array.isArray(condition.in) || !condition.in.includes(propertyValue)) return false;
        }
        if (condition.notIn !== undefined) {
            if (Array.isArray(condition.notIn) && condition.notIn.includes(propertyValue)) return false;
        }
        if (condition.greaterThan !== undefined) {
            if (typeof propertyValue !== 'number' || propertyValue <= condition.greaterThan) return false;
        }
        if (condition.lessThan !== undefined) {
            if (typeof propertyValue !== 'number' || propertyValue >= condition.lessThan) return false;
        }
        if (condition.exists !== undefined) {
            const exists = propertyValue !== undefined && propertyValue !== null;
            if (condition.exists !== exists) return false;
        }
    }

    return true;
}
