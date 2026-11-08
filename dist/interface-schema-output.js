"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceSchemaOutputBindingSchema = void 0;
exports.hasInterfaceSchemaOutputBinding = hasInterfaceSchemaOutputBinding;
exports.projectInterfaceSchemaOutput = projectInterfaceSchemaOutput;
const zod_1 = require("zod");
/** Definition-owned placement of a configured schema within the emitted value. */
exports.InterfaceSchemaOutputBindingSchema = zod_1.z.object({
    path: zod_1.z.array(zod_1.z.string().min(1)).max(16),
    rootWhen: zod_1.z.object({ property: zod_1.z.string().min(1), equals: zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()]) }).optional(),
}).strict();
function record(value) {
    return value != null && typeof value === 'object' && !Array.isArray(value)
        ? value : undefined;
}
function descriptors(properties) {
    return properties.map(value => record(record(value)?.data) ?? record(value));
}
function hasInterfaceSchemaOutputBinding(properties) {
    const property = descriptors(properties).find(prop => prop?.type === '$.interface.schema');
    return exports.InterfaceSchemaOutputBindingSchema.safeParse(record(property?.typeOptions)?.outputBinding).success;
}
// Local pointers are relative to the schema root, which changes when embedded.
// A nested $id establishes its own resource and retains its own reference scope.
function rebaseReferences(value, prefix) {
    if (Array.isArray(value))
        return value.map(item => rebaseReferences(item, prefix));
    const object = record(value);
    if (!object || typeof object.$id === 'string')
        return value;
    return Object.fromEntries(Object.entries(object).map(([key, item]) => {
        if (key === '$ref' && typeof item === 'string' && (item === '#' || item.startsWith('#/'))) {
            return [key, `${prefix}${item.slice(1)}`];
        }
        if (['properties', 'patternProperties', '$defs', 'definitions', 'dependentSchemas', 'dependencies'].includes(key) && record(item)) {
            return [key, Object.fromEntries(Object.entries(item)
                    .map(([name, child]) => [name, rebaseReferences(child, prefix)]))];
        }
        return [key, ['items', 'prefixItems', 'additionalItems', 'additionalProperties', 'unevaluatedProperties',
                'unevaluatedItems', 'contains', 'propertyNames', 'allOf', 'anyOf', 'oneOf', 'not', 'if', 'then', 'else'].includes(key)
                ? rebaseReferences(item, prefix) : item];
    }));
}
function placeSchema(base, path, schema) {
    if (!path.length)
        return schema;
    const [key, ...rest] = path;
    const properties = record(base.properties) ?? {};
    return { ...base, type: 'object',
        properties: { ...properties, [key]: placeSchema(record(properties[key]) ?? {}, rest, schema) },
        required: [...new Set([...(Array.isArray(base.required) ? base.required.filter(key => typeof key === 'string') : []), key])],
    };
}
/** Typing only. This does not change validation scope or validate the envelope. */
function projectInterfaceSchemaOutput(schema, data, properties, nativeSchema = {}) {
    const declared = descriptors(properties);
    const property = declared.find(prop => prop?.type === '$.interface.schema');
    const binding = record(property?.typeOptions)?.outputBinding;
    if (binding === undefined)
        return schema;
    const parsed = exports.InterfaceSchemaOutputBindingSchema.safeParse(binding);
    // Invalid metadata cannot turn a body schema into an unrelated root declaration.
    if (!parsed.success)
        return nativeSchema;
    const { path, rootWhen } = parsed.data;
    const configuration = record(data);
    const selected = rootWhen && (configuration && Object.hasOwn(configuration, rootWhen.property)
        ? configuration[rootWhen.property] : declared.find(prop => prop?.key === rootWhen.property)?.default);
    if (!path.length || rootWhen && selected === rootWhen.equals)
        return schema;
    const prefix = `#${path.map(key => `/properties/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`).join('')}`;
    return placeSchema(nativeSchema, path, rebaseReferences(schema, prefix));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLXNjaGVtYS1vdXRwdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW50ZXJmYWNlLXNjaGVtYS1vdXRwdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBbUJBLDBFQUdDO0FBaUNELG9FQWtCQztBQXpFRCw2QkFBd0I7QUFFeEIsa0ZBQWtGO0FBQ3JFLFFBQUEsa0NBQWtDLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN6RCxJQUFJLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUN4QyxRQUFRLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7Q0FDdkgsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBSVosU0FBUyxNQUFNLENBQUMsS0FBYztJQUM1QixPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDeEUsQ0FBQyxDQUFDLEtBQWdDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUNuRCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsVUFBOEI7SUFDakQsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFB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