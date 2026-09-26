"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDeclaredInterfaceSchema = resolveDeclaredInterfaceSchema;
exports.declaredInterfaceOutputSchema = declaredInterfaceOutputSchema;
const ingress_schema_materialize_1 = require("./ingress-schema-materialize");
function record(value) {
    return value != null && typeof value === 'object' && !Array.isArray(value)
        ? value : undefined;
}
/** Select only the first schema property declared by the exact element definition. */
function resolveDeclaredInterfaceSchema(data, properties) {
    const instance = record(data);
    if (!instance)
        return undefined;
    for (const value of properties) {
        const outer = record(value);
        const property = record(outer?.data) ?? outer;
        if (property?.type !== '$.interface.schema')
            continue;
        const propertyKey = (0, ingress_schema_materialize_1.schemaKeyFromPropertyDescriptor)(property);
        if (!propertyKey)
            return undefined;
        const wire = record(instance[propertyKey]);
        return wire ? { propertyKey, wire: wire } : undefined;
    }
    return undefined;
}
/** Authoring preview only: matching source proves freshness, not execution authority. */
function declaredInterfaceOutputSchema(data, properties) {
    const wire = resolveDeclaredInterfaceSchema(data, properties)?.wire;
    const source = typeof wire?.exportSchemaSource === 'string' ? wire.exportSchemaSource.trim() : '';
    if (!source || wire?.sourceHash !== (0, ingress_schema_materialize_1.computeSchemaSourceHash)(source))
        return undefined;
    return record(wire.exportSchema);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyZWQtaW50ZXJmYWNlLXNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWNsYXJlZC1pbnRlcmZhY2Utc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsd0VBYUM7QUFHRCxzRUFLQztBQTdCRCw2RUFBcUk7QUFFckksU0FBUyxNQUFNLENBQUMsS0FBYztJQUM1QixPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDeEUsQ0FBQyxDQUFDLEtBQWdDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUNuRCxDQUFDO0FBRUQsc0ZBQXNGO0FBQ3RGLFNBQWdCLDhCQUE4QixDQUFDLElBQWEsRUFBRSxVQUE4QjtJQUMxRixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLFFBQVE7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNoQyxLQUFLLE1BQU0sS0FBSyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQy9CLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQztRQUM5QyxJQUFJLFFBQVEsRUFBRSxJQUFJLEtBQUssb0JBQW9CO1lBQUUsU0FBUztRQUN0RCxNQUFNLFdBQVcsR0FBRyxJQUFBLDREQUErQixFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxXQUFXO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDbkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBOEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDbEYsQ0FBQztJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCx5RkFBeUY7QUFDekYsU0FBZ0IsNkJBQTZCLENBQUMsSUFBYSxFQUFFLFVBQThCO0lBQ3pGLE1BQU0sSUFBSSxHQUFHLDhCQUE4QixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDcEUsTUFBTSxNQUFNLEdBQUcsT0FBTyxJQUFJLEVBQUUsa0JBQWtCLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxVQUFVLEtBQUssSUFBQSxvREFBdUIsRUFBQyxNQUFNLENBQUM7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUN0RixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkMsQ0FBQyJ9