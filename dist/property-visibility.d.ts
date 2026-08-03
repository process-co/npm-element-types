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
export declare function evaluatePropVisibility(visibleWhen: unknown, data: Record<string, unknown>): boolean;
//# sourceMappingURL=property-visibility.d.ts.map