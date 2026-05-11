"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = void 0;
exports.zodObjectToContainerExportJsonSchema = zodObjectToContainerExportJsonSchema;
const zod_1 = require("zod");
/**
 * Parameters for converting container / HTTP-interface export ZodObject graphs to JSON Schema.
 *
 * - **`reused: 'inline'`** — duplicate sub-schemas stay inlined so `$ref` targets do not fan out
 *   across reusable defs unnecessarily.
 * - **`cycles: 'ref'`** — cyclic graphs break with document-local `$ref` / `$defs` only (no external URLs).
 *
 * Keep in sync with QuickJS finalize snippets that call `toJSONSchema` with the same object.
 */
exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = {
    reused: 'inline',
    cycles: 'ref',
};
function zodObjectToContainerExportJsonSchema(schema) {
    const jsonSchema = zod_1.z.toJSONSchema(schema, exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS);
    if (jsonSchema == null || typeof jsonSchema !== 'object' || Array.isArray(jsonSchema)) {
        throw new Error('Container schema did not produce a JSON schema object.');
    }
    return jsonSchema;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9kLWNvbnRhaW5lci1leHBvcnQtanNvbi1zY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvem9kLWNvbnRhaW5lci1leHBvcnQtanNvbi1zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZ0JBLG9GQU1DO0FBdEJELDZCQUF3QjtBQUV4Qjs7Ozs7Ozs7R0FRRztBQUNVLFFBQUEsMENBQTBDLEdBQUc7SUFDeEQsTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFBTSxFQUFFLEtBQUs7Q0FDTCxDQUFDO0FBRVgsU0FBZ0Isb0NBQW9DLENBQUMsTUFBd0I7SUFDM0UsTUFBTSxVQUFVLEdBQUcsT0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0RBQTBDLENBQUMsQ0FBQztJQUN0RixJQUFJLFVBQVUsSUFBSSxJQUFJLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN0RixNQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNELE9BQU8sVUFBcUMsQ0FBQztBQUMvQyxDQUFDIn0=