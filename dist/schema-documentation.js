"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installZodSchemaDocumentation = installZodSchemaDocumentation;
/**
 * Installs Process' small Zod authoring extensions on a Zod namespace.
 *
 * Zod 4 copies enumerable methods from `ZodType.prototype` onto every schema
 * during initialization. Defining the helper there therefore covers new,
 * cloned, refined, and wrapped schemas without replacing Zod internals.
 */
function installZodSchemaDocumentation(zod) {
    const prototype = zod.ZodType.prototype;
    if (typeof prototype.example === 'function')
        return zod;
    Object.defineProperty(prototype, 'example', {
        configurable: true,
        enumerable: true,
        value(value) {
            const metadata = this.meta() ?? {};
            const existing = Array.isArray(metadata.examples) ? metadata.examples : [];
            return this.meta({ ...metadata, examples: [...existing, value] });
        },
    });
    return zod;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWRvY3VtZW50YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2NoZW1hLWRvY3VtZW50YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUEwQ0Esc0VBcUJDO0FBNUJEOzs7Ozs7R0FNRztBQUNILFNBQWdCLDZCQUE2QixDQUFDLEdBQWlCO0lBQzdELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FFN0IsQ0FBQztJQUNGLElBQUksT0FBTyxTQUFTLENBQUMsT0FBTyxLQUFLLFVBQVU7UUFBRSxPQUFPLEdBQUcsQ0FBQztJQUV4RCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7UUFDMUMsWUFBWSxFQUFFLElBQUk7UUFDbEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsS0FBSyxDQUtGLEtBQWM7WUFDZixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQ25DLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDM0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMifQ==