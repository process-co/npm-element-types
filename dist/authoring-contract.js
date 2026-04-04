"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELEMENT_AUTHORING_CONTRACT_VERSION = void 0;
exports.toAuthoringCatalogContract = toAuthoringCatalogContract;
exports.authoringCatalogContractFromCliOutput = authoringCatalogContractFromCliOutput;
const materialize_authoring_from_cli_output_1 = require("./materialize-authoring-from-cli-output");
/**
 * Bump when this contract changes — regenerate workflow-sdk / codegen consumers.
 * Raw CLI JSON does not carry this; the **contract** is the stable TS surface.
 */
exports.ELEMENT_AUTHORING_CONTRACT_VERSION = 1;
// --- Normalization: materialized → contract ---------------------------------------------------
function normalizeWireKind(wireType) {
    const t = wireType.trim().toLowerCase();
    if (t === 'string' || t === 'number' || t === 'boolean' || t === 'integer') {
        return t;
    }
    if (t === 'object' || t.startsWith('object(')) {
        return 'object';
    }
    if (t === 'array' || t.startsWith('array<')) {
        return 'array';
    }
    return 'unknown';
}
function inferBranchExportsProperty(branch) {
    const e = branch.exportsPath;
    if (e === undefined) {
        return undefined;
    }
    if (e.endsWith('.export') || e.includes('.export.')) {
        return 'export';
    }
    if (e.endsWith('.exports') || e.includes('.exports.')) {
        return 'exports';
    }
    return undefined;
}
function branchToContract(branch) {
    const exportsProp = inferBranchExportsProperty(branch);
    return {
        kind: branch.kind,
        slotRowId: branch.id,
        paths: {
            row: branch.path,
            id: branch.idPath,
            label: branch.labelPath,
            enabled: branch.enabledPath,
            actions: branch.actionsPath,
            exports: branch.exportsPath,
        },
        childStepsProperty: 'actions',
        ...(exportsProp !== undefined ? { branchExportsProperty: exportsProp } : {}),
    };
}
function slotsToContract(slots) {
    if (slots === null) {
        return null;
    }
    return {
        layout: { ...slots.layout },
        branches: slots.branches.map(branchToContract),
    };
}
function propToContract(p) {
    return {
        key: p.key,
        label: p.label,
        wireKind: normalizeWireKind(p.wireType),
        required: p.required,
    };
}
function actionToContract(a) {
    return {
        fern: a.fern,
        elementKey: a.elementKey,
        name: a.name,
        returnsTypeName: a.returns,
        props: a.props.map(propToContract),
        slots: slotsToContract(a.slots),
    };
}
function signalToContract(s) {
    return {
        fern: s.fern,
        elementKey: s.elementKey,
        name: s.name,
        returnsTypeName: s.returns,
        props: s.props.map(propToContract),
    };
}
/**
 * Map **loose materialized catalog** (from CLI JSON) into the **locked `ElementAuthoringCatalogContract`**.
 */
function toAuthoringCatalogContract(cat) {
    const actions = {};
    const signals = {};
    for (const [fern, a] of Object.entries(cat.actionsByFern)) {
        actions[fern] = actionToContract(a);
    }
    for (const [fern, s] of Object.entries(cat.signalsByFern)) {
        signals[fern] = signalToContract(s);
    }
    return {
        version: exports.ELEMENT_AUTHORING_CONTRACT_VERSION,
        namespace: cat.namespace,
        actions,
        signals,
    };
}
/** One-shot: **`process-element` JSON shape** → locked contract. */
function authoringCatalogContractFromCliOutput(info, namespace) {
    return toAuthoringCatalogContract((0, materialize_authoring_from_cli_output_1.materializeAuthoringCatalogFromCliOutput)(info, namespace));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaW5nLWNvbnRyYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2F1dGhvcmluZy1jb250cmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUE4TUEsZ0VBZUM7QUFHRCxzRkFLQztBQTlORCxtR0FBbUc7QUFFbkc7OztHQUdHO0FBQ1UsUUFBQSxrQ0FBa0MsR0FBRyxDQUFVLENBQUM7QUFzRzdELGlHQUFpRztBQUVqRyxTQUFTLGlCQUFpQixDQUFDLFFBQWdCO0lBQ3pDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QyxJQUFJLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUMzRSxPQUFPLENBQTBCLENBQUM7SUFDcEMsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDOUMsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDNUMsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxTQUFTLDBCQUEwQixDQUFDLE1BQThCO0lBQ2hFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDN0IsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDcEIsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7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