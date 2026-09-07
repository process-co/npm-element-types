"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDurableActionDefinition = validateDurableActionDefinition;
const durable_action_presentation_validation_1 = require("./durable-action-presentation-validation");
const TERMINAL_LIFECYCLES = new Set([
    'succeeded',
    'failed',
    'denied',
    'cancelled',
    'expired',
]);
function validateDurableActionDefinition(definition, context) {
    const facts = createValidationFacts(definition);
    validateInitialState(definition, facts, context);
    validateStates(definition, facts, context);
    validateEffects(definition, facts, context);
    validateCommands(definition, facts, context);
    validateTimers(definition, facts, context);
    validateObservations(definition, facts, context);
    validateResourcesAndReconciliation(definition, facts, context);
    (0, durable_action_presentation_validation_1.validateDurableActionPresentations)(definition, facts, context);
}
function createValidationFacts(definition) {
    return {
        stateKeys: new Set(Object.keys(definition.states)),
        effectKeys: new Set(Object.keys(definition.effects)),
        commandKeys: new Set(Object.keys(definition.commands)),
        resourceKeys: new Set(Object.keys(definition.resources)),
        machineEvents: new Set(),
        transitionTargetsByEvent: new Map(),
    };
}
function validateInitialState(definition, facts, context) {
    if (facts.stateKeys.size === 0) {
        context.addIssue({ code: 'custom', message: 'At least one state is required', path: ['states'] });
    }
    if (!facts.stateKeys.has(definition.initial)) {
        context.addIssue({ code: 'custom', message: `Unknown initial state ${definition.initial}`, path: ['initial'] });
    }
}
function validateStates(definition, facts, context) {
    for (const [stateKey, state] of Object.entries(definition.states)) {
        validateStateFinality(stateKey, state, context);
        const stateEvents = new Set();
        state.on.forEach((transition, transitionIndex) => {
            validateTransition(stateKey, transitionIndex, transition, stateEvents, facts, context);
        });
    }
}
function validateStateFinality(stateKey, state, context) {
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
function validateTransition(stateKey, index, transition, stateEvents, facts, context) {
    if (stateEvents.has(transition.event)) {
        context.addIssue({
            code: 'custom',
            message: `State ${stateKey} declares duplicate event ${transition.event}`,
            path: ['states', stateKey, 'on', index, 'event'],
        });
    }
    stateEvents.add(transition.event);
    facts.machineEvents.add(transition.event);
    const targets = facts.transitionTargetsByEvent.get(transition.event) ?? new Set();
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
        if (facts.effectKeys.has(effect))
            return;
        context.addIssue({
            code: 'custom',
            message: `Transition references unknown effect ${effect}`,
            path: ['states', stateKey, 'on', index, 'effects', effectIndex],
        });
    });
}
function validateEffects(definition, facts, context) {
    for (const [effectKey, effect] of Object.entries(definition.effects)) {
        for (const [status, value] of Object.entries(effect.settlementEvents)) {
            settlementEventsFor(value).forEach((event, eventIndex) => {
                if (facts.machineEvents.has(event))
                    return;
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
function settlementEventsFor(value) {
    if (typeof value === 'string')
        return [value];
    return value ?? [];
}
function validateCommands(definition, facts, context) {
    for (const [commandKey, command] of Object.entries(definition.commands)) {
        validateMachineEvent(command.event, `Command ${commandKey}`, ['commands', commandKey, 'event'], facts, context);
        command.allowedStates.forEach((state, index) => {
            validateCommandState(commandKey, state, index, definition, facts, context);
        });
    }
}
function validateCommandState(commandKey, state, index, definition, facts, context) {
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
    if (!event || definition.states[state]?.on.some((transition) => transition.event === event))
        return;
    context.addIssue({
        code: 'custom',
        message: `Command ${commandKey} event ${event} has no transition in state ${state}`,
        path,
    });
}
function validateTimers(definition, facts, context) {
    for (const [timerKey, timer] of Object.entries(definition.timers)) {
        validateMachineEvent(timer.event, `Timer ${timerKey}`, ['timers', timerKey, 'event'], facts, context);
        validateStateReferences(timer.startInStates, ['timers', timerKey, 'startInStates'], facts, context);
        validateStateReferences(timer.cancelInStates, ['timers', timerKey, 'cancelInStates'], facts, context);
    }
}
function validateObservations(definition, facts, context) {
    for (const [key, observation] of Object.entries(definition.observations)) {
        if (!facts.resourceKeys.has(observation.resource)) {
            context.addIssue({
                code: 'custom',
                message: `Observation ${key} references unknown resource ${observation.resource}`,
                path: ['observations', key, 'resource'],
            });
        }
        validateMachineEvent(observation.machineEvent, `Observation ${key}`, ['observations', key, 'machineEvent'], facts, context);
        validateHintReconciliation(key, observation, definition, context);
        validateHintSettlement(key, observation, definition, facts, context);
    }
}
function validateHintReconciliation(key, observation, definition, context) {
    if (observation.evidence !== 'hint' || observation.reconcile === 'never')
        return;
    const hasReconciler = Object.values(definition.reconciliation).some((reconciliation) => (reconciliation.resource === observation.resource
        && reconciliation.triggers.includes('observation')));
    if (hasReconciler)
        return;
    context.addIssue({
        code: 'custom',
        message: `Hint observation ${key} requires reconciliation`,
        path: ['observations', key, 'reconcile'],
    });
}
function validateHintSettlement(key, observation, definition, facts, context) {
    if (observation.evidence !== 'hint')
        return;
    const targets = facts.transitionTargetsByEvent.get(observation.machineEvent) ?? new Set();
    for (const target of targets) {
        if (!definition.states[target]?.final)
            continue;
        context.addIssue({
            code: 'custom',
            message: `Hint observation ${key} cannot transition directly to final state ${target}`,
            path: ['observations', key, 'machineEvent'],
        });
    }
}
function validateResourcesAndReconciliation(definition, facts, context) {
    const reconciledResources = new Set();
    for (const [key, reconciliation] of Object.entries(definition.reconciliation)) {
        if (!facts.resourceKeys.has(reconciliation.resource)) {
            context.addIssue({
                code: 'custom',
                message: `Reconciliation ${key} references unknown resource ${reconciliation.resource}`,
                path: ['reconciliation', key, 'resource'],
            });
        }
        else {
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
function validateMutableResources(definition, reconciledResources, context) {
    const observed = new Set(Object.values(definition.observations)
        .filter((observation) => observation.evidence === 'authoritative')
        .map(({ resource }) => resource));
    for (const [key, resource] of Object.entries(definition.resources)) {
        if (!resource.mutableExternally || observed.has(key) || reconciledResources.has(key))
            continue;
        context.addIssue({
            code: 'custom',
            message: `Externally mutable resource ${key} requires observation or reconciliation`,
            path: ['resources', key],
        });
    }
}
function validateMachineEvent(event, subject, path, facts, context) {
    if (facts.machineEvents.has(event))
        return;
    context.addIssue({ code: 'custom', message: `${subject} event ${event} has no machine transition`, path });
}
function validateStateReferences(states, path, facts, context) {
    states.forEach((state, index) => {
        if (facts.stateKeys.has(state))
            return;
        context.addIssue({ code: 'custom', message: `Unknown state ${state}`, path: [...path, index] });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYWJsZS1hY3Rpb24tdmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kdXJhYmxlLWFjdGlvbi12YWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBc0JBLDBFQWFDO0FBaENELHFHQUE4RjtBQUU5RixNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDO0lBQ2xDLFdBQVc7SUFDWCxRQUFRO0lBQ1IsUUFBUTtJQUNSLFdBQVc7SUFDWCxTQUFTO0NBQ1YsQ0FBQyxDQUFDO0FBV0gsU0FBZ0IsK0JBQStCLENBQzdDLFVBQXdDLEVBQ3hDLE9BQXNCO0lBRXRCLE1BQU0sS0FBSyxHQUFHLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELG9CQUFvQixDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakQsY0FBYyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0MsZUFBZSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3QyxjQUFjLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELGtDQUFrQyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0QsSUFBQSwyRUFBa0MsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLFVBQXdDO0lBQ3JFLE9BQU87UUFDTCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxD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