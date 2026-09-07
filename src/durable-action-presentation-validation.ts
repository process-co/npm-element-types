import type { RefinementCtx } from 'zod';

import type { DurableActionDefinitionInput } from './durable-action';
import type { DurableActionValidationFacts } from './durable-action-validation';

export function validateDurableActionPresentations(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  const presentedStates = new Set<string>();
  for (const [key, presentation] of Object.entries(definition.presentations)) {
    presentation.states.forEach((state, index) => {
      validatePresentationState(
        key,
        state,
        index,
        presentation.mode,
        definition,
        facts,
        presentedStates,
        context,
      );
    });
    presentation.commands.forEach((command, index) => {
      validatePresentationCommand(key, command, index, presentation.mode, facts, context);
    });
  }
}

function validatePresentationState(
  key: string,
  state: string,
  index: number,
  mode: 'proposal' | 'receipt',
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  presentedStates: Set<string>,
  context: RefinementCtx,
): void {
  const path = ['presentations', key, 'states', index];
  if (!facts.stateKeys.has(state)) {
    context.addIssue({
      code: 'custom',
      message: `Presentation ${key} references unknown state ${state}`,
      path,
    });
  }
  if (presentedStates.has(state)) {
    context.addIssue({
      code: 'custom',
      message: `State ${state} has more than one presentation`,
      path,
    });
  }
  presentedStates.add(state);

  const final = definition.states[state]?.final;
  if (mode === 'receipt' && !final) {
    context.addIssue({
      code: 'custom',
      message: `Receipt presentation ${key} requires final states`,
      path,
    });
  }
  if (mode === 'proposal' && final) {
    context.addIssue({
      code: 'custom',
      message: `Proposal presentation ${key} cannot render final state ${state}`,
      path,
    });
  }
}

function validatePresentationCommand(
  key: string,
  command: string,
  index: number,
  mode: 'proposal' | 'receipt',
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  const path = ['presentations', key, 'commands', index];
  if (!facts.commandKeys.has(command)) {
    context.addIssue({
      code: 'custom',
      message: `Presentation ${key} references unknown command ${command}`,
      path,
    });
  }
  if (mode === 'receipt') {
    context.addIssue({
      code: 'custom',
      message: `Receipt presentation ${key} cannot expose commands`,
      path,
    });
  }
}
