"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementSemanticInterfaceDeclarationSchema = exports.SemanticInterfaceProjectionDeclarationSchema = exports.SemanticInterfaceMappingReferenceSchema = exports.SemanticInterfaceTypeIdSchema = void 0;
exports.defineInterfaceType = defineInterfaceType;
exports.parseSemanticInterfaceTypeId = parseSemanticInterfaceTypeId;
exports.parseElementSemanticInterfaceDeclaration = parseElementSemanticInterfaceDeclaration;
const zod_1 = require("zod");
/**
 * Preserve an interface identifier and Zod schema as literal types for element authoring.
 * This identity helper performs no registration or side effects.
 */
function defineInterfaceType(definition) {
    return definition;
}
const SEMANTIC_INTERFACE_ID = /^(?:process(?:\.[a-z][a-z0-9-]*)+|org\.[a-z0-9][a-z0-9-]{0,62}(?:\.[a-z][a-z0-9-]*)+)@[1-9]\d*$/;
/** Shared wire validator for semantic identifiers at build, ingestion, and runtime boundaries. */
exports.SemanticInterfaceTypeIdSchema = zod_1.z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(SEMANTIC_INTERFACE_ID);
exports.SemanticInterfaceMappingReferenceSchema = zod_1.z.object({
    mappingId: zod_1.z.string().trim().min(1).max(300),
    revisionId: zod_1.z.string().trim().min(1).max(200),
    kind: zod_1.z.enum(['declarative', 'custom-adapter']),
}).strict();
exports.SemanticInterfaceProjectionDeclarationSchema = zod_1.z.object({
    interfaceType: exports.SemanticInterfaceTypeIdSchema,
    mapping: exports.SemanticInterfaceMappingReferenceSchema,
    lossiness: zod_1.z.enum(['lossless', 'lossy']),
    resolution: zod_1.z.enum(['deterministic', 'probabilistic']).default('deterministic'),
}).strict();
exports.ElementSemanticInterfaceDeclarationSchema = zod_1.z.object({
    native: exports.SemanticInterfaceTypeIdSchema,
    inputs: zod_1.z.array(exports.SemanticInterfaceTypeIdSchema).max(100).default([]),
    outputs: zod_1.z.array(exports.SemanticInterfaceProjectionDeclarationSchema).max(100).default([]),
}).strict();
function record(value, path) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new TypeError(`${path} must be an object`);
    }
    return value;
}
function boundedString(value, path) {
    if (typeof value !== 'string' || value.trim().length === 0 || value.length > 300) {
        throw new TypeError(`${path} must be a non-empty string of at most 300 characters`);
    }
    return value.trim();
}
/** Runtime guard used at build/publication boundaries that receive untyped JSON. */
function parseSemanticInterfaceTypeId(value, path = 'interfaceType') {
    const candidate = boundedString(value, path);
    if (!exports.SemanticInterfaceTypeIdSchema.safeParse(candidate).success) {
        throw new TypeError(`${path} is not a valid semantic interface type identifier`);
    }
    return candidate;
}
/** Normalize and validate a declaration before it enters the versioned authoring catalog. */
function parseElementSemanticInterfaceDeclaration(value) {
    const declaration = record(value, 'interfaces');
    const inputs = declaration.inputs ?? [];
    const outputs = declaration.outputs ?? [];
    if (!Array.isArray(inputs) || inputs.length > 100) {
        throw new TypeError('interfaces.inputs must be an array of at most 100 items');
    }
    if (!Array.isArray(outputs) || outputs.length > 100) {
        throw new TypeError('interfaces.outputs must be an array of at most 100 items');
    }
    return {
        native: parseSemanticInterfaceTypeId(declaration.native, 'interfaces.native'),
        inputs: inputs.map((input, index) => parseSemanticInterfaceTypeId(input, `interfaces.inputs[${index}]`)),
        outputs: outputs.map((output, index) => {
            const projection = record(output, `interfaces.outputs[${index}]`);
            const mapping = record(projection.mapping, `interfaces.outputs[${index}].mapping`);
            const kind = mapping.kind;
            const lossiness = projection.lossiness;
            const resolution = projection.resolution ?? 'deterministic';
            if (kind !== 'declarative' && kind !== 'custom-adapter') {
                throw new TypeError(`interfaces.outputs[${index}].mapping.kind is invalid`);
            }
            if (lossiness !== 'lossless' && lossiness !== 'lossy') {
                throw new TypeError(`interfaces.outputs[${index}].lossiness is invalid`);
            }
            if (resolution !== 'deterministic' && resolution !== 'probabilistic') {
                throw new TypeError(`interfaces.outputs[${index}].resolution is invalid`);
            }
            return {
                interfaceType: parseSemanticInterfaceTypeId(projection.interfaceType, `interfaces.outputs[${index}].interfaceType`),
                mapping: {
                    mappingId: boundedString(mapping.mappingId, `interfaces.outputs[${index}].mapping.mappingId`),
                    revisionId: boundedString(mapping.revisionId, `interfaces.outputs[${index}].mapping.revisionId`),
                    kind,
                },
                lossiness,
                resolution,
            };
        }),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtYW50aWMtaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlbWFudGljLWludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFtRUEsa0RBS0M7QUFpRkQsb0VBU0M7QUFHRCw0RkFvREM7QUF6TkQsNkJBQXdCO0FBK0R4Qjs7O0dBR0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FHakMsVUFBdUQ7SUFDckQsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQztBQW9DRCxNQUFNLHFCQUFxQixHQUN2QixpR0FBaUcsQ0FBQztBQUV0RyxrR0FBa0c7QUFDckYsUUFBQSw2QkFBNkIsR0FBdUMsT0FBQztLQUM3RSxNQUFNLEVBQUU7S0FDUixJQUFJLEVBQUU7S0FDTixHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ04sR0FBRyxDQUFDLEdBQUcsQ0FBQztLQUNSLEtBQUssQ0FBQyxxQkFBcUIsQ0FBdUMsQ0FBQztBQUUzRCxRQUFBLHVDQUF1QyxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDNUQsU0FBUyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUM1QyxVQUFVLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzdDLElBQUksRUFBRSxPQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7Q0FDbEQsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRUMsUUFBQSw0Q0FBNEMsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2pFLGFBQWEsRUFBRSxxQ0FBNkI7SUFDNUMsT0FBTyxFQUFFLCtDQUF1QztJQUNoRCxTQUFTLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4QyxVQUFVLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7Q0FDbEYsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRUMsUUFBQSx5Q0FBeUMsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQzlELE1BQU0sRUFBRSxxQ0FBNkI7SUFDckMsTUFBTSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMscUNBQTZCLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUNuRSxPQUFPLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxvREFBNEMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0NBQ3RGLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVaLFNBQVMsTUFBTSxDQUFDLEtBQWMsRUFBRSxJQUFZO0lBQ3hDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxTQUFTLENBQUMsR0FBRyxJQUFJLG9CQUFvQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELE9BQU8sS0FBZ0MsQ0FBQztBQUM1QyxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBYyxFQUFFLElBQVk7SUFDL0MsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUMvRSxNQUFNLElBQUksU0FBUyxDQUFDLEdBQUcsSUFBSSx1REFBdUQsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFDRCxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4QixDQUFDO0FBRUQsb0ZBQW9GO0FBQ3BGLFNBQWdCLDRCQUE0QixDQUN4QyxLQUFjLEVBQ2QsSUFBSSxHQUFHLGVBQWU7SUFFdEIsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUMscUNBQTZCLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlELE1BQU0sSUFBSSxTQUFTLENBQUMsR0FBRyxJQUFJLG9EQUFvRCxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUNELE9BQU8sU0FBb0MsQ0FBQztBQUNoRCxDQUFDO0FBRUQsNkZBQTZGO0FBQzdGLFNBQWdCLHdDQUF3QyxDQUNwRCxLQUFjO0lBRWQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUN4QyxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2hELE1BQU0sSUFBSSxTQUFTLENBQUMseURBQXlELENBQUMsQ0FBQztJQUNuRixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNsRCxNQUFNLElBQUksU0FBUyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUNELE9BQU87UUFDSCxNQUFNLEVBQUUsNEJBQTRCLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQztRQUM3RSxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUNoQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDdkUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNsRSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsS0FBSyxXQUFXLENBQUMsQ0FBQztZQUNuRixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzFCLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDdkMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsSUFBSSxlQUFlLENBQUM7WUFDNUQsSUFBSSxJQUFJLEtBQUssYUFBYSxJQUFJLElBQUksS0FBSyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN0RCxNQUFNLElBQUksU0FBUyxDQUFDLHNCQUFzQixLQUFLLDJCQUEyQixDQUFDLENBQUM7WUFDaEYsQ0FBQztZQUNELElBQUksU0FBUyxLQUFLLFVBQVUsSUFBSSxTQUFTLEtBQUssT0FBTyxFQUFFLENBQUM7Z0JBQ3BELE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLEtBQUssd0JBQXdCLENBQUMsQ0FBQztZQUM3RSxDQUFDO1lBQ0QsSUFBSSxVQUFVLEtBQUssZUFBZSxJQUFJLFVBQVUsS0FBSyxlQUFlLEVBQUUsQ0FBQztnQkFDbkUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsS0FBSyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzlFLENBQUM7WUFDRCxPQUFPO2dCQUNILGFBQWEsRUFBRSw0QkFBNEIsQ0FDdkMsVUFBVSxDQUFDLGFBQWEsRUFDeEIsc0JBQXNCLEtBQUssaUJBQWlCLENBQy9DO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxTQUFTLEVBQUUsYUFBYSxDQUNwQixPQUFPLENBQUMsU0FBUyxFQUNqQixzQkFBc0IsS0FBSyxxQkFBcUIsQ0FDbkQ7b0JBQ0QsVUFBVSxFQUFFLGFBQWEsQ0FDckIsT0FBTyxDQUFDLFVBQVUsRUFDbEIsc0JBQXNCLEtBQUssc0JBQXNCLENBQ3BEO29CQUNELElBQUk7aUJBQ1A7Z0JBQ0QsU0FBUztnQkFDVCxVQUFVO2FBQ2IsQ0FBQztRQUNOLENBQUMsQ0FBQztLQUNMLENBQUM7QUFDTixDQUFDIn0=