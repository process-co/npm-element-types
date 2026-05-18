/**
 * HTTP response replay cache — policy at save, vary key at runtime.
 */

export type HttpRequestCacheMode = 'cache-only' | 'stale-while-revalidate';

/** Materialized at save → elementData.$httpRequestCachePolicy */
export type HttpRequestCachePolicy = {
    mode: HttpRequestCacheMode;
    ttlSeconds: number;
    refreshAfterSeconds?: number;
    vary: HttpRequestCacheVary;
    /** When true, webhook loads trigger so author can call setRequestVaryKey. */
    needsRuntimeVaryKey?: boolean;
};

export type HttpRequestCacheVary = {
    headers?: Array<{ name: string; lowerCase?: boolean }>;
    clientIp?: boolean;
    pathTemplate?: string;
    query?: string[];
    body?: BodyVaryProjection;
};

/** Boolean leaves select fields; nested objects recurse. */
export type BodyVaryProjection = {
    [key: string]: boolean | BodyVaryProjection;
};

/** Editor wire for $.interface.cacheVaryInfo */
export type CacheVaryInfoWire = {
    headers?: Array<{ name: string }>;
    query?: string[];
    clientIp?: boolean;
    pathTemplate?: string;
    bodyPaths?: BodyVaryProjection;
    customRuntimeKey?: boolean;
};

/** Seconds (TTL). $.interface.duration */
export type DurationWire = number;

/** Save-only: hooks.save → $.http.configureResponseCaching */
export type ConfigureResponseCachingOptions = {
    maxAge: number;
    varyBy: HttpRequestCacheVary | CacheVaryInfoWire | '*' | string[];
    mode?: HttpRequestCacheMode;
    refreshAfterSeconds?: number;
    needsRuntimeVaryKey?: boolean;
};

export const HTTP_REQUEST_CACHE_POLICY_KEY = '$httpRequestCachePolicy' as const;

export const REPLAY_BINDING_RANGE = '$replayBinding' as const;

export const REPLAY_META_RANGE = '$replayMeta' as const;
