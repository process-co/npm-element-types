import type { z } from 'zod';
import type { CompiledInterfaceMappingExpression } from './interface-mapping-contract';
import type { SemanticInterfaceTypeDefinition, SemanticInterfaceTypeId } from './semantic-interface';
/** A published ID or a local definition whose schema remains visible to TypeScript. */
export type SemanticInterfaceReference = SemanticInterfaceTypeId | SemanticInterfaceTypeDefinition;
export type SemanticInterfaceIdOf<Reference extends SemanticInterfaceReference> = Reference extends SemanticInterfaceTypeDefinition<infer Id> ? Id : Reference;
export type SemanticInterfaceValueOf<Reference extends SemanticInterfaceReference> = Reference extends SemanticInterfaceTypeDefinition<SemanticInterfaceTypeId, infer Schema> ? z.output<Schema> : unknown;
export type AuthoredInterfaceMappingLimits = {
    readonly maxOperations?: number;
    readonly maxDepth?: number;
    readonly maxArrayItems?: number;
    readonly maxOutputBytes?: number;
    readonly maxResolverFields?: number;
    readonly maxEvidenceBytes?: number;
};
export type AuthoredProbabilisticFieldPolicy = {
    readonly targetPointer: string;
    readonly resolverRevisionId: string;
    readonly evidence: readonly {
        readonly name: string;
        readonly expression: CompiledInterfaceMappingExpression;
    }[];
    readonly minConfidence: number;
    readonly whenPresent: 'accept-deterministic' | 'reject';
    readonly onAbstain: 'omit' | 'review' | 'reject' | 'fallback';
    readonly onLowConfidence: 'omit' | 'review' | 'reject' | 'fallback';
    readonly fallback?: CompiledInterfaceMappingExpression;
};
type AuthoredInterfaceMappingBase<Source extends SemanticInterfaceReference, Target extends SemanticInterfaceReference> = {
    readonly mappingId: string;
    /** Optional immutable revision label. The compiler derives one from content when omitted. */
    readonly revisionId?: string;
    readonly source: Source;
    readonly target: Target;
    readonly lossiness: 'lossless' | 'lossy';
    readonly resolution?: 'deterministic' | 'probabilistic';
    readonly status?: 'draft' | 'published' | 'deprecated';
};
export type AuthoredDeclarativeInterfaceMapping<Source extends SemanticInterfaceReference = SemanticInterfaceReference, Target extends SemanticInterfaceReference = SemanticInterfaceReference> = AuthoredInterfaceMappingBase<Source, Target> & {
    readonly kind: 'declarative';
    readonly root: CompiledInterfaceMappingExpression;
    readonly limits?: AuthoredInterfaceMappingLimits;
    readonly probabilisticFields?: readonly AuthoredProbabilisticFieldPolicy[];
};
export type AuthoredCustomInterfaceMapping<Source extends SemanticInterfaceReference = SemanticInterfaceReference, Target extends SemanticInterfaceReference = SemanticInterfaceReference> = AuthoredInterfaceMappingBase<Source, Target> & {
    readonly kind: 'custom-adapter';
    /**
     * Type-checking witness for the named export. It is removed from registry JSON; the build
     * artifact is addressed by `adapter.artifactPath` and `adapter.exportName`.
     */
    readonly convert: (value: SemanticInterfaceValueOf<Source>) => SemanticInterfaceValueOf<Target> | Promise<SemanticInterfaceValueOf<Target>>;
    readonly adapter: {
        readonly runtime: 'nodejs' | 'quickjs';
        readonly artifactPath: string;
        readonly exportName: string;
    };
};
export type AuthoredInterfaceMapping<Source extends SemanticInterfaceReference = SemanticInterfaceReference, Target extends SemanticInterfaceReference = SemanticInterfaceReference> = AuthoredDeclarativeInterfaceMapping<Source, Target> | AuthoredCustomInterfaceMapping<Source, Target>;
/** Variance-safe runtime view used by operation declarations after helper inference has completed. */
export type AnyAuthoredInterfaceMapping = AuthoredDeclarativeInterfaceMapping<any, any> | (Omit<AuthoredCustomInterfaceMapping<any, any>, 'convert'> & {
    readonly convert: (value: any) => any;
});
/** Preserve source/target schema inference and literal mapping identities. */
export declare function defineInterfaceMapping<const Source extends SemanticInterfaceReference, const Target extends SemanticInterfaceReference>(mapping: AuthoredDeclarativeInterfaceMapping<Source, Target>): AuthoredDeclarativeInterfaceMapping<Source, Target>;
export declare function defineInterfaceMapping<const Source extends SemanticInterfaceReference, const Target extends SemanticInterfaceReference>(mapping: AuthoredCustomInterfaceMapping<Source, Target>): AuthoredCustomInterfaceMapping<Source, Target>;
/**
 * Build-time operation declaration. `accepts` and `emits` are deliberately directional:
 * accepted values map into native; emitted values map out of native. Reverse mappings are separate.
 */
export type AuthoredElementSemanticInterfaceDeclaration<Native extends SemanticInterfaceReference = SemanticInterfaceReference> = {
    readonly version: 2;
    readonly native: Native;
    readonly accepts?: readonly AnyAuthoredInterfaceMapping[];
    readonly emits?: readonly AnyAuthoredInterfaceMapping[];
};
/** Preserve the native schema and converter types on an action, signal, or source declaration. */
export declare function defineElementInterfaces<const Native extends SemanticInterfaceReference, const Declaration extends AuthoredElementSemanticInterfaceDeclaration<Native>>(declaration: Declaration): Declaration;
export {};
//# sourceMappingURL=interface-authoring.d.ts.map