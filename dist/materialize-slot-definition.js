"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materializeSlotDefinition = materializeSlotDefinition;
function branchKind(row) {
    return 'type' in row && row.type === 'static' ? 'static' : 'dynamic';
}
function pickBranch(row) {
    const b = { kind: branchKind(row) };
    if (row.id !== undefined)
        b.id = row.id;
    if (row.label !== undefined)
        b.label = row.label;
    if (row.branchValue !== undefined)
        b.branchValue = row.branchValue;
    if (row.path !== undefined)
        b.path = row.path;
    if (row.idPath !== undefined)
        b.idPath = row.idPath;
    if (row.labelPath !== undefined)
        b.labelPath = row.labelPath;
    if (row.enabledPath !== undefined)
        b.enabledPath = row.enabledPath;
    if (row.actionsPath !== undefined)
        b.actionsPath = row.actionsPath;
    if (row.exportsPath !== undefined)
        b.exportsPath = row.exportsPath;
    if (row.hideOnDisable !== undefined)
        b.hideOnDisable = row.hideOnDisable;
    if (row.labelPlaceholderTemplate !== undefined)
        b.labelPlaceholderTemplate = row.labelPlaceholderTemplate;
    if (row.labelPlaceholderValue !== undefined)
        b.labelPlaceholderValue = row.labelPlaceholderValue;
    return b;
}
function pickLayout(def) {
    const layout = {};
    if (def.showBranchLabels !== undefined)
        layout.showBranchLabels = def.showBranchLabels;
    if (def.activeSlotId !== undefined)
        layout.activeSlotId = def.activeSlotId;
    if (def.activeSlotLabel !== undefined)
        layout.activeSlotLabel = def.activeSlotLabel;
    if (def.hideDisabled !== undefined)
        layout.hideDisabled = def.hideDisabled;
    if (def.hideDisabledPath !== undefined)
        layout.hideDisabledPath = def.hideDisabledPath;
    if (def.hideOnDisable !== undefined)
        layout.hideOnDisable = def.hideOnDisable;
    if (def.exportSchemaPath !== undefined)
        layout.exportSchemaPath = def.exportSchemaPath;
    return layout;
}
function isEffectivelyEmpty(def) {
    const rows = def.slots ?? [];
    const layout = pickLayout(def);
    return rows.length === 0 && Object.keys(layout).length === 0;
}
/** Normalize **`ISlotDefinition`** for codegen / workflow inference (JSON-serializable). */
function materializeSlotDefinition(def) {
    if (def == null || isEffectivelyEmpty(def)) {
        return null;
    }
    return {
        layout: pickLayout(def),
        branches: (def.slots ?? []).map(pickBranch),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWxpemUtc2xvdC1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21hdGVyaWFsaXplLXNsb3QtZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQTZFQSw4REFVQztBQWxERCxTQUFTLFVBQVUsQ0FBQyxHQUE0RDtJQUM5RSxPQUFPLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ3ZFLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxHQUE0RDtJQUM5RSxNQUFNLENBQUMsR0FBMkIsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDNUQsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLFNBQVM7UUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDeEMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLFNBQVM7UUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDakQsSUFBSSxHQUFHLENBQUMsV0FBVyxLQUFLLFNBQVM7UUFBRSxDQUFDLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDbkUsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVM7UUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDOUMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLFNBQVM7UUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDcEQsSUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLFNBQVM7UUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7SUFDN0QsSUFBSSxHQUFHLENBQUMsV0FB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