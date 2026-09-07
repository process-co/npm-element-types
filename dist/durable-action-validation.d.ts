import type { RefinementCtx } from 'zod';
import type { DurableActionDefinitionInput } from './durable-action';
export type DurableActionValidationFacts = {
    stateKeys: Set<string>;
    effectKeys: Set<string>;
    commandKeys: Set<string>;
    resourceKeys: Set<string>;
    machineEvents: Set<string>;
    transitionTargetsByEvent: Map<string, Set<string>>;
};
export declare function validateDurableActionDefinition(definition: DurableActionDefinitionInput, context: RefinementCtx): void;
//# sourceMappingURL=durable-action-validation.d.ts.map