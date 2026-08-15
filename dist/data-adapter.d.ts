export type DataAdapterRefreshDefinition = {
    mode: 'full' | 'incremental';
    /** Table-adapter operation used to read authoritative rows after an event. */
    operation?: string;
    /** Optional JSONPath selecting provider keys from the normalized event. */
    sourceKeysPath?: string;
};
export type DataAdapterConfigurationProjection = {
    from: 'instanceProp';
    key?: string;
} | {
    from: 'credential';
} | {
    value: unknown;
};
/**
 * References the same reusable signal definition that can be placed directly
 * on a workflow. The Data Source uses it as a refresh notification instead.
 */
export type DataAdapterChangeNotification = {
    eventClientKey: string;
    configuration?: Record<string, DataAdapterConfigurationProjection>;
    refresh: DataAdapterRefreshDefinition;
};
export type TableAdapterDefinition = {
    credentials?: unknown[];
    operations?: Record<string, unknown>;
    changeNotifications?: Record<string, DataAdapterChangeNotification>;
    /** @deprecated Use changeNotifications with an eventClientKey. */
    webhooks?: Record<string, unknown>;
    fileName?: string;
};
//# sourceMappingURL=data-adapter.d.ts.map