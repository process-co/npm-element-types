/** Primitive shape information shared by schema-backed projection editors. */
export type ObjectProjectionValueType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'unknown';

/** How the possible sources participate in one execution. */
export type ObjectProjectionStrategy = 'selected' | 'concurrent' | 'iterate';

/**
 * Explicitly resolves multiple writes to one canonical destination. The
 * strategy determines which policies are meaningful (for example `append`
 * for iterations and `deepMerge` for concurrent object branches).
 */
export type ObjectProjectionWritePolicy =
  | 'error'
  | 'first'
  | 'last'
  | 'replace'
  | 'deepMerge'
  | 'append'
  | 'keyed';

/** How completely the canonical target schema must be populated. */
export type ObjectProjectionTargetCoverage = 'partial' | 'required' | 'all';

export type ObjectProjectionSource = {
  id: string;
  label: string;
  description?: string;
  /** Portable JSON Schema or another definition-owned schema representation. */
  schema?: unknown;
  optional?: boolean;
};

/**
 * Canonical authoring vocabulary. Persistence adapters may translate these
 * names to older storage contracts, but editors and diagnostics use these
 * unambiguous terms.
 */
export type ObjectProjectionRule = {
  id: string;
  sourceId: string;
  sourceExpression: string;
  destinationPath: string;
  sourceType?: ObjectProjectionValueType;
  destinationType?: ObjectProjectionValueType;
  writePolicy?: ObjectProjectionWritePolicy;
  /** Required when writePolicy is `keyed`. */
  keyExpression?: string;
};

export type ObjectProjectionDocument = {
  version: 1;
  strategy: ObjectProjectionStrategy;
  sources: readonly ObjectProjectionSource[];
  /** The canonical object schema shared by every possible source. */
  targetSchema?: unknown;
  /** Applied when an individual rule does not declare a write policy. */
  defaultWritePolicy?: ObjectProjectionWritePolicy;
  /** Defaults to partial so existing export mappings remain valid. */
  targetCoverage?: ObjectProjectionTargetCoverage;
  rules: readonly ObjectProjectionRule[];
};
