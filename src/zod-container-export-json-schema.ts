import { z } from 'zod';

/**
 * Parameters for converting container / HTTP-interface export ZodObject graphs to JSON Schema.
 *
 * - **`reused: 'inline'`** — duplicate sub-schemas stay inlined so `$ref` targets do not fan out
 *   across reusable defs unnecessarily.
 * - **`cycles: 'ref'`** — cyclic graphs break with document-local `$ref` / `$defs` only (no external URLs).
 *
 * Keep in sync with QuickJS finalize snippets that call `toJSONSchema` with the same object.
 */
export const ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = {
  reused: 'inline',
  cycles: 'ref',
} as const;

export function zodObjectToContainerExportJsonSchema(schema: z.ZodObject<any>): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(schema, ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS);
  if (jsonSchema == null || typeof jsonSchema !== 'object' || Array.isArray(jsonSchema)) {
    throw new Error('Container schema did not produce a JSON schema object.');
  }
  return jsonSchema as Record<string, unknown>;
}
