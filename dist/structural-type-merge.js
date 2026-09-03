"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeStructuralTypeEvidence = mergeStructuralTypeEvidence;
/**
 * Merge editor/test evidence into one build-scoped structural view.
 * Declared structure wins every conflict; observation-only fields remain
 * optional and may widen to explicit variants.
 */
function mergeStructuralTypeEvidence(input) {
    assertObservationScope(input);
    const effective = structuredClone(input.declaredSchema);
    const diagnostics = [];
    const observationIds = input.observations.map(({ observationId }) => observationId);
    input.observations.forEach((observation) => {
        mergeNode({
            effective,
            declared: input.declaredSchema,
            observed: observation.jsonSchema,
            path: '$',
            observationId: observation.observationId,
            diagnostics,
        });
    });
    return { jsonSchema: effective, observationIds, diagnostics };
}
function assertObservationScope(input) {
    for (const observation of input.observations) {
        if (observation.buildRunId !== input.buildRunId) {
            throw new TypeError(`Observation ${observation.observationId} belongs to build ${observation.buildRunId}, not ${input.buildRunId}.`);
        }
        if (observation.structuralArtifactId !== input.structuralArtifactId) {
            throw new TypeError(`Observation ${observation.observationId} belongs to structural artifact ${observation.structuralArtifactId}, not ${input.structuralArtifactId}.`);
        }
    }
}
function mergeNode(input) {
    const declaredType = schemaType(input.declared);
    const effectiveType = schemaType(input.effective);
    const observedType = schemaType(input.observed);
    if (!effectiveType && observedType && !declaredType) {
        for (const key of Object.keys(input.effective))
            delete input.effective[key];
        Object.assign(input.effective, structuredClone(input.observed));
        // Continue through the normal object recursion so observed requiredness
        // is removed while its structural information remains available.
    }
    const mergedEffectiveType = schemaType(input.effective);
    if (mergedEffectiveType && observedType && !compatibleTypes(mergedEffectiveType, observedType)) {
        if (declaredType) {
            addDiagnostic(input, 'type-conflict', `Observed type ${observedType} conflicts with declared type ${declaredType}; declared type retained.`);
            return;
        }
        widenObservationOnlySchema(input.effective, input.observed);
        addDiagnostic(input, 'observation-widened', `Observation-only field widened from ${effectiveType} to include ${observedType}.`);
        return;
    }
    mergeFormat(input);
    if (mergedEffectiveType === 'object' && observedType === 'object')
        mergeObject(input);
    if (mergedEffectiveType === 'array' && observedType === 'array')
        mergeArray(input);
}
function mergeObject(input) {
    const effectiveProperties = properties(input.effective, true);
    const declaredProperties = properties(input.declared, false);
    const observedProperties = properties(input.observed, false);
    for (const [key, observedProperty] of Object.entries(observedProperties)) {
        const childPath = `${input.path}.${key}`;
        const current = effectiveProperties[key];
        const declared = declaredProperties[key];
        if (!current) {
            effectiveProperties[key] = structuredClone(observedProperty);
            continue;
        }
        mergeNode({
            effective: current,
            declared,
            observed: observedProperty,
            path: childPath,
            observationId: input.observationId,
            diagnostics: input.diagnostics,
        });
    }
    // Requiredness comes only from the declaration. Observation-only fields
    // are deliberately optional even when every sample happened to contain them.
    if (Array.isArray(input.declared?.required)) {
        input.effective.required = structuredClone(input.declared.required);
    }
    else {
        delete input.effective.required;
    }
}
function mergeArray(input) {
    const observedItems = schemaRecord(input.observed.items);
    if (!observedItems)
        return;
    const effectiveItems = schemaRecord(input.effective.items);
    const declaredItems = schemaRecord(input.declared?.items);
    if (!effectiveItems) {
        input.effective.items = structuredClone(observedItems);
        return;
    }
    mergeNode({
        effective: effectiveItems,
        declared: declaredItems,
        observed: observedItems,
        path: `${input.path}[]`,
        observationId: input.observationId,
        diagnostics: input.diagnostics,
    });
}
function mergeFormat(input) {
    const observedFormat = typeof input.observed.format === 'string'
        ? input.observed.format
        : undefined;
    if (!observedFormat)
        return;
    const effectiveFormat = typeof input.effective.format === 'string'
        ? input.effective.format
        : undefined;
    const declaredFormat = typeof input.declared?.format === 'string'
        ? input.declared.format
        : undefined;
    if (!effectiveFormat) {
        input.effective.format = observedFormat;
        return;
    }
    if (effectiveFormat === observedFormat)
        return;
    if (declaredFormat) {
        addDiagnostic(input, 'format-conflict', `Observed format ${observedFormat} conflicts with declared format ${declaredFormat}; declared format retained.`);
    }
    else {
        delete input.effective.format;
        addDiagnostic(input, 'observation-widened', `Conflicting observed formats ${effectiveFormat} and ${observedFormat} were widened to an unformatted string.`);
    }
}
function widenObservationOnlySchema(effective, observed) {
    const variants = Array.isArray(effective.anyOf)
        ? [...effective.anyOf]
        : [structuredClone(effective)];
    delete variants[0].anyOf;
    const candidate = structuredClone(observed);
    const signatures = new Set(variants.map(canonicalJson));
    if (!signatures.has(canonicalJson(candidate)))
        variants.push(candidate);
    for (const key of Object.keys(effective))
        delete effective[key];
    effective.anyOf = variants;
}
function properties(schema, create) {
    const existing = schemaRecord(schema?.properties);
    if (existing)
        return existing;
    if (schema && create) {
        const created = {};
        schema.properties = created;
        return created;
    }
    return {};
}
function schemaRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? value
        : undefined;
}
function schemaType(schema) {
    return typeof schema?.type === 'string' ? schema.type : undefined;
}
function compatibleTypes(left, right) {
    return left === right || (left === 'number' && right === 'integer');
}
function addDiagnostic(input, code, message) {
    const existing = input.diagnostics.find((diagnostic) => diagnostic.path === input.path
        && diagnostic.code === code
        && diagnostic.message === message);
    if (existing) {
        if (!existing.observationIds.includes(input.observationId)) {
            existing.observationIds.push(input.observationId);
        }
        return;
    }
    input.diagnostics.push({
        path: input.path,
        code,
        message,
        observationIds: [input.observationId],
    });
}
function canonicalJson(value) {
    if (Array.isArray(value))
        return `[${value.map(canonicalJson).join(',')}]`;
    if (value !== null && typeof value === 'object') {
        return `{${Object.entries(value)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
            .join(',')}}`;
    }
    return JSON.stringify(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJhbC10eXBlLW1lcmdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N0cnVjdHVyYWwtdHlwZS1tZXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQXlCQSxrRUFvQkM7QUF6QkQ7Ozs7R0FJRztBQUNILFNBQWdCLDJCQUEyQixDQUN2QyxLQUF1QztJQUV2QyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sV0FBVyxHQUFvQyxFQUFFLENBQUM7SUFDeEQsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUVwRixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3ZDLFNBQVMsQ0FBQztZQUNOLFNBQVM7WUFDVCxRQUFRLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDOUIsUUFBUSxFQUFFLFdBQVcsQ0FBQyxVQUFVO1lBQ2hDLElBQUksRUFBRSxHQUFHO1lBQ1QsYUFBYSxFQUFFLFdBQVcsQ0FBQyxhQUFhO1lBQ3hDLFdBQVc7U0FDZCxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsQ0FBQztBQUNsRSxDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxLQUF1QztJQUNuRSxLQUFLLE1BQU0sV0FBVyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMzQyxJQUFJLFdBQVcsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzlDLE1BQU0sSUFBSSxTQUFTLENBQ2YsZUFBZSxXQUFXLENBQUMs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