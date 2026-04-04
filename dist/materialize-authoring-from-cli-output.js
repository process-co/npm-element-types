"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProcessActionFern = buildProcessActionFern;
exports.buildProcessSignalFern = buildProcessSignalFern;
exports.materializeAuthoringCatalogFromCliOutput = materializeAuthoringCatalogFromCliOutput;
const materialize_slot_definition_1 = require("./materialize-slot-definition");
function stripNamespacePrefixFromActionKey(namespace, key) {
    const prefix = `${namespace}-`;
    return key.startsWith(prefix) ? key.slice(prefix.length) : key;
}
/**
 * Build registry FERN for an action (**`namespace::action:slug`**), matching common API normalization.
 */
function buildProcessActionFern(namespace, actionKey) {
    const slug = stripNamespacePrefixFromActionKey(namespace, actionKey);
    return `${namespace}::action:${slug}`;
}
/** Build registry FERN for a signal (**`namespace::signal:slug`**). */
function buildProcessSignalFern(namespace, signalKey) {
    const slug = stripNamespacePrefixFromActionKey(namespace, signalKey);
    return `${namespace}::signal:${slug}`;
}
function wireTypeLabel(type) {
    if (type === undefined || type === null) {
        return 'unknown';
    }
    if (typeof type === 'string') {
        return type;
    }
    try {
        return JSON.stringify(type);
    }
    catch {
        return 'unknown';
    }
}
function materializeProp(p) {
    return {
        key: p.key,
        label: p.label,
        description: typeof p.description === 'string' ? p.description : '',
        wireType: wireTypeLabel(p.type),
        required: p.required === true,
        hasJsonType: p.jsonType !== undefined && p.jsonType !== null,
        isFunction: p.isFunction === true,
    };
}
function materializeAction(namespace, a) {
    const fern = buildProcessActionFern(namespace, a.key);
    return {
        kind: 'action',
        fern,
        elementKey: a.key,
        name: a.name,
        description: typeof a.description === 'string' ? a.description : undefined,
        returns: typeof a.returns === 'string' ? a.returns : undefined,
        props: (Array.isArray(a.props) ? a.props : []).map(materializeProp),
        slots: (0, materialize_slot_definition_1.materializeSlotDefinition)(a.slots),
    };
}
function materializeSignal(namespace, s) {
    const fern = buildProcessSignalFern(namespace, s.key);
    return {
        kind: 'signal',
        fern,
        elementKey: s.key,
        name: s.name,
        description: typeof s.description === 'string' ? s.description : undefined,
        returns: typeof s.returns === 'string' ? s.returns : undefined,
        props: (Array.isArray(s.props) ? s.props : []).map(materializeProp),
    };
}
/**
 * Turn the **entire compatibility CLI / `loadElementPointers` JSON** into FERN-keyed authoring material
 * (props + slot paths + returns hints) for codegen or merging into **`@process.co/workflow-sdk`**.
 *
 * @param namespace — FERN namespace segment (e.g. **`process-internal`**). Defaults to **`info.name`** (element app slug).
 */
function materializeAuthoringCatalogFromCliOutput(info, namespace) {
    const ns = namespace ?? info.name;
    const actionsByFern = {};
    const signalsByFern = {};
    for (const a of info.actions) {
        if (a?.type !== 'action' || typeof a.key !== 'string') {
            continue;
        }
        const entry = materializeAction(ns, a);
        actionsByFern[entry.fern] = entry;
    }
    for (const s of info.signals) {
        if (s?.type !== 'signal' || typeof s.key !== 'string') {
            continue;
        }
        const entry = materializeSignal(ns, s);
        signalsByFern[entry.fern] = entry;
    }
    return { namespace: ns, actionsByFern, signalsByFern };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWxpemUtYXV0aG9yaW5nLWZyb20tY2xpLW91dHB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRlcmlhbGl6ZS1hdXRob3JpbmctZnJvbS1jbGktb3V0cHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBdURBLHdEQUdDO0FBR0Qsd0RBR0M7QUFtRUQsNEZBeUJDO0FBNUpELCtFQUEyRztBQStDM0csU0FBUyxpQ0FBaUMsQ0FBQyxTQUFpQixFQUFFLEdBQVc7SUFDdkUsTUFBTSxNQUFNLEdBQUcsR0FBRyxTQUFTLEdBQUcsQ0FBQztJQUMvQixPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDakUsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsU0FBaUIsRUFBRSxTQUFpQjtJQUN6RSxNQUFNLElBQUksR0FBRyxpQ0FBaUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckUsT0FBTyxHQUFHLFNBQVMsWUFBWSxJQUFJLEVBQUUsQ0FBQztBQUN4QyxDQUFDO0FBRUQsdUVBQXVFO0FBQ3ZFLFNBQWdCLHNCQUFzQixDQUFDLFNBQWlCLEVBQUUsU0FBaUI7SUFDekUsTUFBTSxJQUFJLEdBQUcsaUNBQWlDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sR0FBRyxTQUFTLFlBQVksSUFBSSxFQUFFLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQWE7SUFDbEMsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUs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