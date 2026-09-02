import type {
    StructuralTypeMergeDiagnostic,
    StructuralTypeObservation,
} from './interface-registry-contract';

type JsonSchema = Record<string, unknown>;

export type MergeStructuralTypeEvidenceInput = {
    buildRunId: string;
    structuralArtifactId: string;
    declaredSchema: JsonSchema;
    observations: readonly StructuralTypeObservation[];
};

export type MergedStructuralType = {
    jsonSchema: JsonSchema;
    observationIds: string[];
    diagnostics: StructuralTypeMergeDiagnostic[];
};

/**
 * Merge editor/test evidence into one build-scoped structural view.
 * Declared structure wins every conflict; observation-only fields remain
 * optional and may widen to explicit variants.
 */
export function mergeStructuralTypeEvidence(
    input: MergeStructuralTypeEvidenceInput,
): MergedStructuralType {
    assertObservationScope(input);
    const effective = structuredClone(input.declaredSchema);
    const diagnostics: StructuralTypeMergeDiagnostic[] = [];
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

function assertObservationScope(input: MergeStructuralTypeEvidenceInput) {
    for (const observation of input.observations) {
        if (observation.buildRunId !== input.buildRunId) {
            throw new TypeError(
                `Observation ${observation.observationId} belongs to build ${observation.buildRunId}, not ${input.buildRunId}.`,
            );
        }
        if (observation.structuralArtifactId !== input.structuralArtifactId) {
            throw new TypeError(
                `Observation ${observation.observationId} belongs to structural artifact ${observation.structuralArtifactId}, not ${input.structuralArtifactId}.`,
            );
        }
    }
}

function mergeNode(input: {
    effective: JsonSchema;
    declared: JsonSchema | undefined;
    observed: JsonSchema;
    path: string;
    observationId: string;
    diagnostics: StructuralTypeMergeDiagnostic[];
}) {
    const declaredType = schemaType(input.declared);
    const effectiveType = schemaType(input.effective);
    const observedType = schemaType(input.observed);
    if (effectiveType && observedType && !compatibleTypes(effectiveType, observedType)) {
        if (declaredType) {
            addDiagnostic(input, 'type-conflict',
                `Observed type ${observedType} conflicts with declared type ${declaredType}; declared type retained.`);
            return;
        }
        widenObservationOnlySchema(input.effective, input.observed);
        addDiagnostic(input, 'observation-widened',
            `Observation-only field widened from ${effectiveType} to include ${observedType}.`);
        return;
    }

    mergeFormat(input);
    if (effectiveType === 'object' && observedType === 'object') mergeObject(input);
    if (effectiveType === 'array' && observedType === 'array') mergeArray(input);
}

function mergeObject(input: Parameters<typeof mergeNode>[0]) {
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
    if (!input.declared) delete input.effective.required;
}

function mergeArray(input: Parameters<typeof mergeNode>[0]) {
    const observedItems = schemaRecord(input.observed.items);
    if (!observedItems) return;
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

function mergeFormat(input: Parameters<typeof mergeNode>[0]) {
    const observedFormat = typeof input.observed.format === 'string'
        ? input.observed.format
        : undefined;
    if (!observedFormat) return;
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
    if (effectiveFormat === observedFormat) return;
    if (declaredFormat) {
        addDiagnostic(input, 'format-conflict',
            `Observed format ${observedFormat} conflicts with declared format ${declaredFormat}; declared format retained.`);
    } else {
        delete input.effective.format;
        addDiagnostic(input, 'observation-widened',
            `Conflicting observed formats ${effectiveFormat} and ${observedFormat} were widened to an unformatted string.`);
    }
}

function widenObservationOnlySchema(effective: JsonSchema, observed: JsonSchema) {
    const variants = Array.isArray(effective.anyOf)
        ? [...effective.anyOf]
        : [structuredClone(effective)];
    delete (variants[0] as JsonSchema).anyOf;
    const candidate = structuredClone(observed);
    const signatures = new Set(variants.map(canonicalJson));
    if (!signatures.has(canonicalJson(candidate))) variants.push(candidate);
    for (const key of Object.keys(effective)) delete effective[key];
    effective.anyOf = variants;
}

function properties(schema: JsonSchema | undefined, create: boolean): Record<string, JsonSchema> {
    const existing = schemaRecord(schema?.properties);
    if (existing) return existing as Record<string, JsonSchema>;
    if (schema && create) {
        const created: Record<string, JsonSchema> = {};
        schema.properties = created;
        return created;
    }
    return {};
}

function schemaRecord(value: unknown): JsonSchema | undefined {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? value as JsonSchema
        : undefined;
}

function schemaType(schema: JsonSchema | undefined): string | undefined {
    return typeof schema?.type === 'string' ? schema.type : undefined;
}

function compatibleTypes(left: string, right: string) {
    return left === right || (left === 'number' && right === 'integer');
}

function addDiagnostic(
    input: Parameters<typeof mergeNode>[0],
    code: StructuralTypeMergeDiagnostic['code'],
    message: string,
) {
    const existing = input.diagnostics.find(
        (diagnostic) => diagnostic.path === input.path
            && diagnostic.code === code
            && diagnostic.message === message,
    );
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

function canonicalJson(value: unknown): string {
    if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
    if (value !== null && typeof value === 'object') {
        return `{${Object.entries(value as Record<string, unknown>)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
            .join(',')}}`;
    }
    return JSON.stringify(value);
}
