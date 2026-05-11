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
export declare const ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS: {
    readonly reused: "inline";
    readonly cycles: "ref";
};
export declare function zodObjectToContainerExportJsonSchema(schema: z.ZodObject<any>): Record<string, unknown>;
//# sourceMappingURL=zod-container-export-json-schema.d.ts.map