import type { RefinementCtx } from 'zod';

import type { DurableActionDefinitionInput } from './durable-action';
import { validateDurableActionPresentations } from './durable-action-presentation-validation';

const TERMINAL_LIFECYCLES = new Set([
  'succeeded',
  'failed',
  'denied',
  'cancelled',
  'expired',
]);

export type DurableActionValidationFacts = {
  stateKeys: Set<string>;
  effectKeys: Set<string>;
  commandKeys: Set<string>;
  resourceKeys: Set<string>;
  machineEvents: Set<string>;
  transitionTargetsByEvent: Map<string, Set<string>>;
};

export function validateDurableActionDefinition(
  definition: DurableActionDefinitionInput,
  context: RefinementCtx,
): void {
  const facts = createValidationFacts(definition);
  validateInitialState(definition, facts, context);
  validateStates(definition, facts, context);
  validateEffects(definition, facts, context);
  validateCommands(definition, facts, context);
  validateTimers(definition, facts, context);
  validateObservations(definition, facts, context);
  validateResourcesAndReconciliation(definition, facts, context);
  validateDurableActionPresentations(definition, facts, context);
}

function createValidationFacts(definition: DurableActionDefinitionInput): DurableActionValidationFacts {
  return {
    stateKeys: new Set(Object.keys(definition.states)),
    effectKeys: new Set(Object.keys(definition.effects)),
    commandKeys: new Set(Object.keys(definition.commands)),
    resourceKeys: new Set(Object.keys(definition.resources)),
    machineEvents: new Set<string>(),
    transitionTargetsByEvent: new Map<string, Set<string>>(),
  };
}

function validateInitialState(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  if (facts.stateKeys.size === 0) {
    context.addIssue({ code: 'custom', message: 'At least one state is required', path: ['states'] });
  }
  if (!facts.stateKeys.has(definition.initial)) {
    context.addIssue({ code: 'custom', message: `Unknown initial state ${definition.initial}`, path: ['initial'] });
  }
}

function validateStates(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  for (const [stateKey, state] of Object.entries(definition.states)) {
    validateStateFinality(stateKey, state, context);
    const stateEvents = new Set<string>();
    state.on.forEach((transition, transitionIndex) => {
      validateTransition(stateKey, transitionIndex, transition, stateEvents, facts, context);
    });
  }
}

function validateStateFinality(
  stateKey: string,
  state: DurableActionDefinitionInput['states'][string],
  context: RefinementCtx,
): void {
  if (state.final !== TERMINAL_LIFECYCLES.has(state.lifecycle)) {
    context.addIssue({
      code: 'custom',
      message: state.final
        ? `Final state ${stateKey} must use a terminal lifecycle`
        : `Terminal lifecycle ${state.lifecycle} must be a final state`,
      path: ['states', stateKey, state.final ? 'lifecycle' : 'final'],
    });
  }
  if (state.final && state.on.length > 0) {
    context.addIssue({
      code: 'custom',
      message: `Final state ${stateKey} cannot declare transitions`,
      path: ['states', stateKey, 'on'],
    });
  }
}

function validateTransition(
  stateKey: string,
  index: number,
  transition: DurableActionDefinitionInput['states'][string]['on'][number],
  stateEvents: Set<string>,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  if (stateEvents.has(transition.event)) {
    context.addIssue({
      code: 'custom',
      message: `State ${stateKey} declares duplicate event ${transition.event}`,
      path: ['states', stateKey, 'on', index, 'event'],
    });
  }
  stateEvents.add(transition.event);
  facts.machineEvents.add(transition.event);
  const targets = facts.transitionTargetsByEvent.get(transition.event) ?? new Set<string>();
  targets.add(transition.target);
  facts.transitionTargetsByEvent.set(transition.event, targets);

  if (!facts.stateKeys.has(transition.target)) {
    context.addIssue({
      code: 'custom',
      message: `Transition targets unknown state ${transition.target}`,
      path: ['states', stateKey, 'on', index, 'target'],
    });
  }
  transition.effects.forEach((effect, effectIndex) => {
    if (facts.effectKeys.has(effect)) return;
    context.addIssue({
      code: 'custom',
      message: `Transition references unknown effect ${effect}`,
      path: ['states', stateKey, 'on', index, 'effects', effectIndex],
    });
  });
}

function validateEffects(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  for (const [effectKey, effect] of Object.entries(definition.effects)) {
    for (const [status, value] of Object.entries(effect.settlementEvents)) {
      settlementEventsFor(value).forEach((event, eventIndex) => {
        if (facts.machineEvents.has(event)) return;
        context.addIssue({
          code: 'custom',
          message: `Effect ${effectKey} ${status} event ${event} has no machine transition`,
          path: Array.isArray(value)
            ? ['effects', effectKey, 'settlementEvents', status, eventIndex]
            : ['effects', effectKey, 'settlementEvents', status],
        });
      });
    }
  }
}

function settlementEventsFor(value: string | string[] | undefined): string[] {
  if (typeof value === 'string') return [value];
  return value ?? [];
}

function validateCommands(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  for (const [commandKey, command] of Object.entries(definition.commands)) {
    validateMachineEvent(command.event, `Command ${commandKey}`, ['commands', commandKey, 'event'], facts, context);
    command.allowedStates.forEach((state, index) => {
      validateCommandState(commandKey, state, index, definition, facts, context);
    });
  }
}

function validateCommandState(
  commandKey: string,
  state: string,
  index: number,
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  const path = ['commands', commandKey, 'allowedStates', index];
  if (!facts.stateKeys.has(state)) {
    context.addIssue({ code: 'custom', message: `Command ${commandKey} references unknown state ${state}`, path });
    return;
  }
  if (definition.states[state]?.final) {
    context.addIssue({ code: 'custom', message: `Command ${commandKey} cannot be allowed in final state ${state}`, path });
    return;
  }
  const event = definition.commands[commandKey]?.event;
  if (!event || definition.states[state]?.on.some((transition) => transition.event === event)) return;
  context.addIssue({
    code: 'custom',
    message: `Command ${commandKey} event ${event} has no transition in state ${state}`,
    path,
  });
}

function validateTimers(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  for (const [timerKey, timer] of Object.entries(definition.timers)) {
    validateMachineEvent(timer.event, `Timer ${timerKey}`, ['timers', timerKey, 'event'], facts, context);
    validateStateReferences(timer.startInStates, ['timers', timerKey, 'startInStates'], facts, context);
    validateStateReferences(timer.cancelInStates, ['timers', timerKey, 'cancelInStates'], facts, context);
  }
}

function validateObservations(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  for (const [key, observation] of Object.entries(definition.observations)) {
    if (!facts.resourceKeys.has(observation.resource)) {
      context.addIssue({
        code: 'custom',
        message: `Observation ${key} references unknown resource ${observation.resource}`,
        path: ['observations', key, 'resource'],
      });
    }
    validateMachineEvent(
      observation.machineEvent,
      `Observation ${key}`,
      ['observations', key, 'machineEvent'],
      facts,
      context,
    );
    validateHintReconciliation(key, observation, definition, context);
    validateHintSettlement(key, observation, definition, facts, context);
  }
}

function validateHintReconciliation(
  key: string,
  observation: DurableActionDefinitionInput['observations'][string],
  definition: DurableActionDefinitionInput,
  context: RefinementCtx,
): void {
  if (observation.evidence !== 'hint' || observation.reconcile === 'never') return;
  const hasReconciler = Object.values(definition.reconciliation).some((reconciliation) => (
    reconciliation.resource === observation.resource
    && reconciliation.triggers.includes('observation')
  ));
  if (hasReconciler) return;
  context.addIssue({
    code: 'custom',
    message: `Hint observation ${key} requires reconciliation`,
    path: ['observations', key, 'reconcile'],
  });
}

function validateHintSettlement(
  key: string,
  observation: DurableActionDefinitionInput['observations'][string],
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  if (observation.evidence !== 'hint') return;
  const targets = facts.transitionTargetsByEvent.get(observation.machineEvent) ?? new Set<string>();
  for (const target of targets) {
    if (!definition.states[target]?.final) continue;
    context.addIssue({
      code: 'custom',
      message: `Hint observation ${key} cannot transition directly to final state ${target}`,
      path: ['observations', key, 'machineEvent'],
    });
  }
}

function validateResourcesAndReconciliation(
  definition: DurableActionDefinitionInput,
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  const reconciledResources = new Set<string>();
  for (const [key, reconciliation] of Object.entries(definition.reconciliation)) {
    if (!facts.resourceKeys.has(reconciliation.resource)) {
      context.addIssue({
        code: 'custom',
        message: `Reconciliation ${key} references unknown resource ${reconciliation.resource}`,
        path: ['reconciliation', key, 'resource'],
      });
    } else {
      reconciledResources.add(reconciliation.resource);
    }
    if (!facts.effectKeys.has(reconciliation.effect)) {
      context.addIssue({
        code: 'custom',
        message: `Reconciliation ${key} references unknown effect ${reconciliation.effect}`,
        path: ['reconciliation', key, 'effect'],
      });
    }
  }
  validateMutableResources(definition, reconciledResources, context);
}

function validateMutableResources(
  definition: DurableActionDefinitionInput,
  reconciledResources: Set<string>,
  context: RefinementCtx,
): void {
  const observed = new Set(
    Object.values(definition.observations)
      .filter((observation) => observation.evidence === 'authoritative')
      .map(({ resource }) => resource),
  );
  for (const [key, resource] of Object.entries(definition.resources)) {
    if (!resource.mutableExternally || observed.has(key) || reconciledResources.has(key)) continue;
    context.addIssue({
      code: 'custom',
      message: `Externally mutable resource ${key} requires observation or reconciliation`,
      path: ['resources', key],
    });
  }
}

function validateMachineEvent(
  event: string,
  subject: string,
  path: (string | number)[],
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  if (facts.machineEvents.has(event)) return;
  context.addIssue({ code: 'custom', message: `${subject} event ${event} has no machine transition`, path });
}

function validateStateReferences(
  states: string[],
  path: (string | number)[],
  facts: DurableActionValidationFacts,
  context: RefinementCtx,
): void {
  states.forEach((state, index) => {
    if (facts.stateKeys.has(state)) return;
    context.addIssue({ code: 'custom', message: `Unknown state ${state}`, path: [...path, index] });
  });
}
