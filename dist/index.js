"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuralTypeMergeDiagnosticSchema = exports.StructuralTypeObservationSchema = exports.InterfaceRegistryManifestSchema = exports.InterfaceRegistryManifestSourceSchema = exports.CompiledElementInterfaceOperationSchema = exports.CompiledMappingReferenceSchema = exports.CompiledStructuralTypeArtifactSchema = exports.CompiledInterfaceDefinitionArtifactSchema = exports.CompiledInterfaceDefinitionSchema = exports.CompiledInterfaceCompatibilitySchema = exports.CompiledInterfaceDataClassificationSchema = exports.CompiledInterfaceJsonSchemaSchema = exports.CompiledInterfaceOwnerSchema = exports.CompiledInterfaceDocumentationSchema = exports.CompiledInterfaceAgentDocumentationSchema = exports.CompiledInterfaceHumanDocumentationSchema = exports.CompiledInterfaceExampleSchema = exports.CompiledInterfaceMappingArtifactSchema = exports.CompiledCustomAdapterArtifactSchema = exports.CompiledDeclarativeMappingProgramSchema = exports.CompiledProbabilisticFieldPolicySchema = exports.CompiledInterfaceMappingLimitsSchema = exports.CompiledInterfaceMappingExpressionSchema = exports.CompiledInterfaceMappingDescriptorSchema = exports.defineInterfaceMapping = exports.defineElementInterfaces = exports.parseElementSemanticInterfaceDeclaration = exports.parseSemanticInterfaceTypeId = exports.ElementSemanticInterfaceDeclarationSchema = exports.SemanticInterfaceProjectionDeclarationSchema = exports.SemanticInterfaceMappingReferenceSchema = exports.SemanticInterfaceTypeIdSchema = exports.defineInterfaceType = exports.isKnownExecutionTagKey = exports.SOCKET_STATE_TAG = exports.ELEMENT_AUTHORING_CONTRACT_VERSION = exports.builtinActionSlotsRegistry = exports.containerRuntimeRangeKey = exports.CONTAINER_RUNTIME_ROUTING_SLUG = exports.CallableRecoveryDecisionSchema = exports.CallableSettlementSchema = exports.CallableErrorEnvelopeSchema = exports.CallableInvocationPolicySnapshotSchema = exports.CallableInvocationEnvelopeSchema = exports.CallableInvocationIdentitySchema = exports.CallableInvocationDefinitionSchema = exports.CallableResourceReferenceSchema = exports.CallableVersionSelectorSchema = exports.ObjectProjectionDocumentSchema = exports.evaluatePropVisibility = void 0;
exports.zodObjectToContainerExportJsonSchema = exports.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS = exports.DEFAULT_DEFER_HTTP_RESPONSE_MS = exports.PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = exports.IngressValidateSchemaResolutionError = exports.schemaKeyFromPropertyDescriptor = exports.schemaArtifactsFresh = exports.resolveValidateSchemaKey = exports.resolveIngressInputSchemasFromElementData = exports.resolveIngressInputSchemas = exports.primaryIngressInputSchema = exports.materializeValidationFilter = exports.materializeIngressFilterChain = exports.ingressValidationLevelFromSchema = exports.deriveEdgeValidatorKey = exports.computeSchemaSourceHash = exports.INGRESS_FILTER_TYPES = exports.INGRESS_FILTERS_KEY = exports.REPLAY_META_RANGE = exports.REPLAY_BINDING_RANGE = exports.HTTP_REQUEST_CACHE_POLICY_KEY = exports.isPlatformBoundLoaderType = exports.PLATFORM_BOUND_LOADER_TYPE_PREFIXES = exports.mergeStructuralTypeEvidence = void 0;
exports.resolveHttpInterfaceEmitWireFromAppData = resolveHttpInterfaceEmitWireFromAppData;
exports.resolveSignalHookIsDraft = resolveSignalHookIsDraft;
exports.setSignalEmitValidationHost = setSignalEmitValidationHost;
exports.validateEmitPayload = validateEmitPayload;
exports.defineApp = defineApp;
exports.defineAction = defineAction;
exports.defineSignal = defineSignal;
exports.defineSource = defineSource;
require("./schema-documentation");
var property_visibility_1 = require("./property-visibility");
Object.defineProperty(exports, "evaluatePropVisibility", { enumerable: true, get: function () { return property_visibility_1.evaluatePropVisibility; } });
var callable_resource_1 = require("./callable-resource");
Object.defineProperty(exports, "ObjectProjectionDocumentSchema", { enumerable: true, get: function () { return callable_resource_1.ObjectProjectionDocumentSchema; } });
Object.defineProperty(exports, "CallableVersionSelectorSchema", { enumerable: true, get: function () { return callable_resource_1.CallableVersionSelectorSchema; } });
Object.defineProperty(exports, "CallableResourceReferenceSchema", { enumerable: true, get: function () { return callable_resource_1.CallableResourceReferenceSchema; } });
Object.defineProperty(exports, "CallableInvocationDefinitionSchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationDefinitionSchema; } });
Object.defineProperty(exports, "CallableInvocationIdentitySchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationIdentitySchema; } });
Object.defineProperty(exports, "CallableInvocationEnvelopeSchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationEnvelopeSchema; } });
Object.defineProperty(exports, "CallableInvocationPolicySnapshotSchema", { enumerable: true, get: function () { return callable_resource_1.CallableInvocationPolicySnapshotSchema; } });
Object.defineProperty(exports, "CallableErrorEnvelopeSchema", { enumerable: true, get: function () { return callable_resource_1.CallableErrorEnvelopeSchema; } });
Object.defineProperty(exports, "CallableSettlementSchema", { enumerable: true, get: function () { return callable_resource_1.CallableSettlementSchema; } });
Object.defineProperty(exports, "CallableRecoveryDecisionSchema", { enumerable: true, get: function () { return callable_resource_1.CallableRecoveryDecisionSchema; } });
var container_runtime_routing_1 = require("./container-runtime-routing");
Object.defineProperty(exports, "CONTAINER_RUNTIME_ROUTING_SLUG", { enumerable: true, get: function () { return container_runtime_routing_1.CONTAINER_RUNTIME_ROUTING_SLUG; } });
Object.defineProperty(exports, "containerRuntimeRangeKey", { enumerable: true, get: function () { return container_runtime_routing_1.containerRuntimeRangeKey; } });
var builtin_action_slots_registry_1 = require("./builtin-action-slots-registry");
Object.defineProperty(exports, "builtinActionSlotsRegistry", { enumerable: true, get: function () { return builtin_action_slots_registry_1.builtinActionSlotsRegistry; } });
/** Locked authoring catalog **types** + version (runtime materialize: **`@process.co/compatibility`** **`authoring-spec`**). */
var authoring_contract_types_1 = require("./authoring-contract-types");
Object.defineProperty(exports, "ELEMENT_AUTHORING_CONTRACT_VERSION", { enumerable: true, get: function () { return authoring_contract_types_1.ELEMENT_AUTHORING_CONTRACT_VERSION; } });
var execution_tags_1 = require("./execution-tags");
Object.defineProperty(exports, "SOCKET_STATE_TAG", { enumerable: true, get: function () { return execution_tags_1.SOCKET_STATE_TAG; } });
Object.defineProperty(exports, "isKnownExecutionTagKey", { enumerable: true, get: function () { return execution_tags_1.isKnownExecutionTagKey; } });
var semantic_interface_1 = require("./semantic-interface");
Object.defineProperty(exports, "defineInterfaceType", { enumerable: true, get: function () { return semantic_interface_1.defineInterfaceType; } });
Object.defineProperty(exports, "SemanticInterfaceTypeIdSchema", { enumerable: true, get: function () { return semantic_interface_1.SemanticInterfaceTypeIdSchema; } });
Object.defineProperty(exports, "SemanticInterfaceMappingReferenceSchema", { enumerable: true, get: function () { return semantic_interface_1.SemanticInterfaceMappingReferenceSchema; } });
Object.defineProperty(exports, "SemanticInterfaceProjectionDeclarationSchema", { enumerable: true, get: function () { return semantic_interface_1.SemanticInterfaceProjectionDeclarationSchema; } });
Object.defineProperty(exports, "ElementSemanticInterfaceDeclarationSchema", { enumerable: true, get: function () { return semantic_interface_1.ElementSemanticInterfaceDeclarationSchema; } });
Object.defineProperty(exports, "parseSemanticInterfaceTypeId", { enumerable: true, get: function () { return semantic_interface_1.parseSemanticInterfaceTypeId; } });
Object.defineProperty(exports, "parseElementSemanticInterfaceDeclaration", { enumerable: true, get: function () { return semantic_interface_1.parseElementSemanticInterfaceDeclaration; } });
var interface_authoring_1 = require("./interface-authoring");
Object.defineProperty(exports, "defineElementInterfaces", { enumerable: true, get: function () { return interface_authoring_1.defineElementInterfaces; } });
Object.defineProperty(exports, "defineInterfaceMapping", { enumerable: true, get: function () { return interface_authoring_1.defineInterfaceMapping; } });
var interface_mapping_contract_1 = require("./interface-mapping-contract");
Object.defineProperty(exports, "CompiledInterfaceMappingDescriptorSchema", { enumerable: true, get: function () { return interface_mapping_contract_1.CompiledInterfaceMappingDescriptorSchema; } });
Object.defineProperty(exports, "CompiledInterfaceMappingExpressionSchema", { enumerable: true, get: function () { return interface_mapping_contract_1.CompiledInterfaceMappingExpressionSchema; } });
Object.defineProperty(exports, "CompiledInterfaceMappingLimitsSchema", { enumerable: true, get: function () { return interface_mapping_contract_1.CompiledInterfaceMappingLimitsSchema; } });
Object.defineProperty(exports, "CompiledProbabilisticFieldPolicySchema", { enumerable: true, get: function () { return interface_mapping_contract_1.CompiledProbabilisticFieldPolicySchema; } });
Object.defineProperty(exports, "CompiledDeclarativeMappingProgramSchema", { enumerable: true, get: function () { return interface_mapping_contract_1.CompiledDeclarativeMappingProgramSchema; } });
Object.defineProperty(exports, "CompiledCustomAdapterArtifactSchema", { enumerable: true, get: function () { return interface_mapping_contract_1.CompiledCustomAdapterArtifactSchema; } });
Object.defineProperty(exports, "CompiledInterfaceMappingArtifactSchema", { enumerable: true, get: function () { return interface_mapping_contract_1.CompiledInterfaceMappingArtifactSchema; } });
var interface_registry_contract_1 = require("./interface-registry-contract");
Object.defineProperty(exports, "CompiledInterfaceExampleSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceExampleSchema; } });
Object.defineProperty(exports, "CompiledInterfaceHumanDocumentationSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceHumanDocumentationSchema; } });
Object.defineProperty(exports, "CompiledInterfaceAgentDocumentationSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceAgentDocumentationSchema; } });
Object.defineProperty(exports, "CompiledInterfaceDocumentationSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceDocumentationSchema; } });
Object.defineProperty(exports, "CompiledInterfaceOwnerSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceOwnerSchema; } });
Object.defineProperty(exports, "CompiledInterfaceJsonSchemaSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceJsonSchemaSchema; } });
Object.defineProperty(exports, "CompiledInterfaceDataClassificationSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceDataClassificationSchema; } });
Object.defineProperty(exports, "CompiledInterfaceCompatibilitySchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceCompatibilitySchema; } });
Object.defineProperty(exports, "CompiledInterfaceDefinitionSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceDefinitionSchema; } });
Object.defineProperty(exports, "CompiledInterfaceDefinitionArtifactSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledInterfaceDefinitionArtifactSchema; } });
Object.defineProperty(exports, "CompiledStructuralTypeArtifactSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledStructuralTypeArtifactSchema; } });
Object.defineProperty(exports, "CompiledMappingReferenceSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledMappingReferenceSchema; } });
Object.defineProperty(exports, "CompiledElementInterfaceOperationSchema", { enumerable: true, get: function () { return interface_registry_contract_1.CompiledElementInterfaceOperationSchema; } });
Object.defineProperty(exports, "InterfaceRegistryManifestSourceSchema", { enumerable: true, get: function () { return interface_registry_contract_1.InterfaceRegistryManifestSourceSchema; } });
Object.defineProperty(exports, "InterfaceRegistryManifestSchema", { enumerable: true, get: function () { return interface_registry_contract_1.InterfaceRegistryManifestSchema; } });
Object.defineProperty(exports, "StructuralTypeObservationSchema", { enumerable: true, get: function () { return interface_registry_contract_1.StructuralTypeObservationSchema; } });
Object.defineProperty(exports, "StructuralTypeMergeDiagnosticSchema", { enumerable: true, get: function () { return interface_registry_contract_1.StructuralTypeMergeDiagnosticSchema; } });
var structural_type_merge_1 = require("./structural-type-merge");
Object.defineProperty(exports, "mergeStructuralTypeEvidence", { enumerable: true, get: function () { return structural_type_merge_1.mergeStructuralTypeEvidence; } });
var platform_loader_type_1 = require("./platform-loader-type");
Object.defineProperty(exports, "PLATFORM_BOUND_LOADER_TYPE_PREFIXES", { enumerable: true, get: function () { return platform_loader_type_1.PLATFORM_BOUND_LOADER_TYPE_PREFIXES; } });
Object.defineProperty(exports, "isPlatformBoundLoaderType", { enumerable: true, get: function () { return platform_loader_type_1.isPlatformBoundLoaderType; } });
var http_request_cache_1 = require("./http-request-cache");
Object.defineProperty(exports, "HTTP_REQUEST_CACHE_POLICY_KEY", { enumerable: true, get: function () { return http_request_cache_1.HTTP_REQUEST_CACHE_POLICY_KEY; } });
Object.defineProperty(exports, "REPLAY_BINDING_RANGE", { enumerable: true, get: function () { return http_request_cache_1.REPLAY_BINDING_RANGE; } });
Object.defineProperty(exports, "REPLAY_META_RANGE", { enumerable: true, get: function () { return http_request_cache_1.REPLAY_META_RANGE; } });
var ingress_filters_1 = require("./ingress-filters");
Object.defineProperty(exports, "INGRESS_FILTERS_KEY", { enumerable: true, get: function () { return ingress_filters_1.INGRESS_FILTERS_KEY; } });
Object.defineProperty(exports, "INGRESS_FILTER_TYPES", { enumerable: true, get: function () { return ingress_filters_1.INGRESS_FILTER_TYPES; } });
var ingress_schema_materialize_1 = require("./ingress-schema-materialize");
Object.defineProperty(exports, "computeSchemaSourceHash", { enumerable: true, get: function () { return ingress_schema_materialize_1.computeSchemaSourceHash; } });
Object.defineProperty(exports, "deriveEdgeValidatorKey", { enumerable: true, get: function () { return ingress_schema_materialize_1.deriveEdgeValidatorKey; } });
Object.defineProperty(exports, "ingressValidationLevelFromSchema", { enumerable: true, get: function () { return ingress_schema_materialize_1.ingressValidationLevelFromSchema; } });
Object.defineProperty(exports, "materializeIngressFilterChain", { enumerable: true, get: function () { return ingress_schema_materialize_1.materializeIngressFilterChain; } });
Object.defineProperty(exports, "materializeValidationFilter", { enumerable: true, get: function () { return ingress_schema_materialize_1.materializeValidationFilter; } });
Object.defineProperty(exports, "primaryIngressInputSchema", { enumerable: true, get: function () { return ingress_schema_materialize_1.primaryIngressInputSchema; } });
Object.defineProperty(exports, "resolveIngressInputSchemas", { enumerable: true, get: function () { return ingress_schema_materialize_1.resolveIngressInputSchemas; } });
Object.defineProperty(exports, "resolveIngressInputSchemasFromElementData", { enumerable: true, get: function () { return ingress_schema_materialize_1.resolveIngressInputSchemasFromElementData; } });
Object.defineProperty(exports, "resolveValidateSchemaKey", { enumerable: true, get: function () { return ingress_schema_materialize_1.resolveValidateSchemaKey; } });
Object.defineProperty(exports, "schemaArtifactsFresh", { enumerable: true, get: function () { return ingress_schema_materialize_1.schemaArtifactsFresh; } });
Object.defineProperty(exports, "schemaKeyFromPropertyDescriptor", { enumerable: true, get: function () { return ingress_schema_materialize_1.schemaKeyFromPropertyDescriptor; } });
Object.defineProperty(exports, "IngressValidateSchemaResolutionError", { enumerable: true, get: function () { return ingress_schema_materialize_1.IngressValidateSchemaResolutionError; } });
function schemaPersistenceKeyFromPropInfo(propInfo) {
    const raw = propInfo.typeOptions?.schemaPropertyKey;
    if (typeof raw === 'string' && raw.trim().length > 0)
        return raw.trim();
    const key = propInfo.key;
    return typeof key === 'string' && key.length > 0 ? key : undefined;
}
function validationPersistenceKeyFromPropInfo(propInfo) {
    const raw = propInfo.typeOptions?.validationPropertyKey;
    return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : undefined;
}
/**
 * Resolves the persisted schema wire for the first `$.interface.schema`
 * property on an element instance. This is shared by every signal runtime so
 * editor, Node-transition, and element-host invocations cannot drift on which
 * authored validation policy is active.
 */
function resolveHttpInterfaceEmitWireFromAppData(app, data) {
    if (!app || typeof app !== 'object' || !data || typeof data !== 'object' || Array.isArray(data)) {
        return undefined;
    }
    const instanceData = data;
    for (const metaKey of Object.keys(app)) {
        if (!metaKey.startsWith('&PROC&__'))
            continue;
        const propInfo = app[metaKey];
        if (!propInfo || typeof propInfo !== 'object')
            continue;
        const propRecord = propInfo;
        if (propRecord.type !== '$.interface.schema')
            continue;
        const schemaKey = schemaPersistenceKeyFromPropInfo(propRecord);
        if (!schemaKey)
            continue;
        const blob = instanceData[schemaKey];
        if (!blob || typeof blob !== 'object' || Array.isArray(blob))
            continue;
        const wire = { ...blob };
        const validationKey = validationPersistenceKeyFromPropInfo(propRecord);
        if (validationKey && Object.prototype.hasOwnProperty.call(instanceData, validationKey)) {
            const validation = instanceData[validationKey];
            if (typeof validation === 'boolean')
                wire.validation = validation;
        }
        return wire;
    }
    return undefined;
}
/** Resolve `$.isDraft` for hook invocations (explicit flag wins; else `executionContext === 'editor'`). */
function resolveSignalHookIsDraft(ctx) {
    if (typeof ctx.isDraft === 'boolean') {
        return ctx.isDraft;
    }
    return ctx.executionContext === 'editor';
}
/**
 * Marker on successful `schema.enforce` RPC results from the Process API.
 * Zod-validated HTTP bodies may legally include their own `ok` / `value` fields; this
 * discriminant prevents {@link validateEmitPayload} (and worker RPC unwrap) from
 * confusing user payloads with the host envelope.
 *
 * Keep in sync with `apps/api` `DynamicRunnerService` `schema.enforce` and `runner-host` unwrap.
 */
exports.PROCESS_CO_ENFORCE_SCHEMA_HOST_PAYLOAD_MARKER = 'enforceSchema';
/** Shared across bundled copies of this package in the same JS realm (worker isolate). */
const SIGNAL_EMIT_VALIDATION_HOST = Symbol.for('process.co.signalEmitValidationHost');
function getSignalEmitValidationHostBinding() {
    return globalThis[SIGNAL_EMIT_VALIDATION_HOST];
}
/**
 * Binds the trusted signal host used by {@link validateEmitPayload} for the current
 * invocation. The runner sets this from the RPC/proxy host **outside** element code and
 * clears it when the invocation completes. Uses `globalThis` so a bundled copy of
 * `validateEmitPayload` inside an element module still sees the same binding as the runner.
 */
function setSignalEmitValidationHost(host) {
    const g = globalThis;
    if (host === undefined) {
        delete g[SIGNAL_EMIT_VALIDATION_HOST];
    }
    else {
        g[SIGNAL_EMIT_VALIDATION_HOST] = host;
    }
}
function validationIssuesFromUnknown(e) {
    if (!e || typeof e !== 'object')
        return undefined;
    const issues = e.issues;
    if (!Array.isArray(issues) || issues.length === 0)
        return undefined;
    const out = [];
    for (const row of issues) {
        if (!row || typeof row !== 'object')
            continue;
        const o = row;
        out.push({
            path: typeof o.path === 'string' ? o.path : '(root)',
            message: typeof o.message === 'string' ? o.message : String(o.message ?? ''),
            code: typeof o.code === 'string' ? o.code : 'custom',
        });
    }
    return out.length > 0 ? out : undefined;
}
/**
 * Validation policy: `inputSchema.validation === true` is the sole switch that turns
 * runtime Zod enforcement on. The presence of `compiledValidatorKey` /
 * `exportSchemaSource` is authoring metadata for editor type inference and does not, by
 * itself, cause runtime validation. When validation is on, this awaits the bound host's
 * `enforceSchema` so the API runs the **compiled Zod** validator. Otherwise returns
 * `value` unchanged.
 *
 * On failure, `issues` lists Zod paths/messages when the host provides them (forward into your
 * `http.respond` JSON body alongside any `requestStatus` you use).
 * (see {@link setSignalEmitValidationHost}).
 */
async function validateEmitPayload(inputSchema, value) {
    if (inputSchema?.validation !== true) {
        return { ok: true, value: value };
    }
    const bound = getSignalEmitValidationHostBinding();
    const enforce = bound?.enforceSchema;
    if (typeof enforce !== 'function') {
        return {
            ok: false,
            message: 'Input validation is enabled for this HTTP trigger, but the runtime did not provide enforceSchema. Use `run`/`this.$` from the Process worker (RPC host), and pass the wire from `$.interfaceEmitSchema` as the first argument to `$.enforceSchema`.',
        };
    }
    try {
        const out = await enforce(inputSchema, value);
        if (out && typeof out === 'object' && 'ok' in out) {
            const r = out;
            if (r.ok === false && typeof r.message === 'string') {
                return r.issues?.length
                    ? { ok: false, message: r.message, issues: r.issues }
                    : { ok: false, message: r.message };
            }
            if (r.ok === true && 'value' in r) {
                return { ok: true, value: r.value };
            }
        }
        // Legacy host binding returned bare validated payload (not `EnforceSchemaResult`).
        return { ok: true, value: out };
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const issues = validationIssuesFromUnknown(e);
        return issues?.length ? { ok: false, message, issues } : { ok: false, message };
    }
}
/** Default TTFB deadline (ms) when {@link HttpInterfaceType.deferHttpResponse} omits `timeoutMs`. */
exports.DEFAULT_DEFER_HTTP_RESPONSE_MS = 30_000;
// Helper to provide ThisType context for app definitions
function defineApp(app) {
    return app;
}
function defineAction(action) {
    return action;
}
function defineSignal(signal) {
    return signal;
}
/** Source-specialized alias for signal authoring; sources use the same runtime lifecycle contract. */
function defineSource(source) {
    return source;
}
var zod_container_export_json_schema_1 = require("./zod-container-export-json-schema");
Object.defineProperty(exports, "ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS", { enumerable: true, get: function () { return zod_container_export_json_schema_1.ZOD_CONTAINER_EXPORT_TO_JSON_SCHEMA_PARAMS; } });
Object.defineProperty(exports, "zodObjectToContainerExportJsonSchema", { enumerable: true, get: function () { return zod_container_export_json_schema_1.zodObjectToContainerExportJsonSchema; } });
__exportStar(require("./action-surface"), exports);
__exportStar(require("./action-capability"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOGFBLDBGQW1DQztBQThRRCw0REFLQztBQW1FRCxrRUFTQztBQStCRCxrREFvQ0M7QUF1MUJELDhCQUVDO0FBNktELG9DQWFDO0FBME5ELG9DQVdDO0FBR0Qsb0NBV0M7QUF2bkVELGtDQUFnQztBQW1DaEMsNkRBQStEO0FBQXRELDZIQUFBLHNCQUFzQixPQUFBO0FBd0MvQix5REFXNkI7QUFWM0IsbUlBQUEsOEJBQThCLE9BQUE7QUFDOUIsa0lBQUEsNkJBQTZCLE9BQUE7QUFDN0Isb0lBQUEsK0JBQStCLE9BQUE7QUFDL0IsdUlBQUEsa0NBQWtDLE9BQUE7QUFDbEMscUlBQUEsZ0NBQWdDLE9BQUE7QUFDaEMscUlBQUEsZ0NBQWdDLE9BQUE7QUFDaEMsMklBQUEsc0NBQXNDLE9BQUE7QUFDdEMsZ0lBQUEsMkJBQTJCLE9BQUE7QUFDM0IsNkhBQUEsd0JBQXdCLE9BQUE7QUFDeEIsbUlBQUEsOEJBQThCLE9BQUE7QUFHaEMseUVBR3FDO0FBRm5DLDJJQUFBLDhCQUE4QixPQUFBO0FBQzlCLHFJQUFBLHdCQUF3QixPQUFBO0FBVzFCLGlGQUt5QztBQUpyQywySUFBQSwwQkFBMEIsT0FBQTtBQWM5QixnSUFBZ0k7QUFDaEksdUVBQWdGO0FBQXZFLDhJQUFBLGtDQUFrQyxPQUFBO0FBRTNDLG1EQUcwQjtBQUZ4QixrSEFBQSxnQkFBZ0IsT0FBQTtBQUNoQix3SEFBQSxzQkFBc0IsT0FBQTtBQTBCeEIsMkRBUThCO0FBUDFCLHlIQUFBLG1CQUFtQixPQUFBO0FBQ25CLG1JQUFBLDZCQUE2QixPQUFBO0FBQzdCLDZJQUFBLHVDQUF1QyxPQUFBO0FBQ3ZDLGtKQUFBLDRDQUE0QyxPQUFBO0FBQzVDLCtJQUFBLHlDQUF5QyxPQUFBO0FBQ3pDLGtJQUFBLDRCQUE0QixPQUFBO0FBQzVCLDhJQUFB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