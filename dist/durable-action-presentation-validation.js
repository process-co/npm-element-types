"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDurableActionPresentations = validateDurableActionPresentations;
function validateDurableActionPresentations(definition, facts, context) {
    const presentedStates = new Set();
    for (const [key, presentation] of Object.entries(definition.presentations)) {
        presentation.states.forEach((state, index) => {
            validatePresentationState(key, state, index, presentation.mode, definition, facts, presentedStates, context);
        });
        presentation.commands.forEach((command, index) => {
            validatePresentationCommand(key, command, index, presentation.mode, facts, context);
        });
    }
}
function validatePresentationState(key, state, index, mode, definition, facts, presentedStates, context) {
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
function validatePresentationCommand(key, command, index, mode, facts, context) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYWJsZS1hY3Rpb24tcHJlc2VudGF0aW9uLXZhbGlkYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZHVyYWJsZS1hY3Rpb24tcHJlc2VudGF0aW9uLXZhbGlkYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxnRkF1QkM7QUF2QkQsU0FBZ0Isa0NBQWtDLENBQ2hELFVBQXdDLEVBQ3hDLEtBQW1DLEVBQ25DLE9BQXNCO0lBRXRCLE1BQU0sZUFBZSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFDMUMsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7UUFDM0UsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDM0MseUJBQXlCLENBQ3ZCLEdBQUcsRUFDSCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFlBQVksQ0FBQyxJQUFJLEVBQ2pCLFVBQVUsRUFDVixLQUFLLEVBQ0wsZUFBZSxFQUNmLE9BQU8sQ0FDUixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSCxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQywyQkFBMkIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyx5QkFBeUIsQ0FDaEMsR0FBVyxFQUNYLEtBQWEsRUFDYixLQUFhLEVBQ2IsSUFBNEIsRUFDNUIsVUFBd0MsRUFDeEMsS0FBbUMsRUFDbkMsZUFBNEIsRUFDNUIsT0FBc0I7SUFFdEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNoQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsZ0JBQWdCLEdBQUcsNkJBQTZCLEtBQUssRUFBRTtZQUNoRSxJQUFJO1NBQ0wsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDZixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTLEtBQUssaUNBQWlDO1lBQ3hELElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUUzQixNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQztJQUM5QyxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsd0JBQXdCLEdBQUcsd0JBQXdCO1lBQzVELElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsSUFBSSxJQUFJLEtBQUssVUFBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDZixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSx5QkFBeUIsR0FBRyw4QkFBOEIsS0FBSyxFQUFFO1lBQzFFLElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsMkJBQTJCLENBQ2xDLEdBQVcsRUFDWCxPQUFlLEVBQ2YsS0FBYSxFQUNiLElBQTRCLEVBQzVCLEtBQW1DLEVBQ25DLE9BQXNCO0lBRXRCLE1BQU0sSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDcEMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNmLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLGdCQUFnQixHQUFHLCtCQUErQixPQUFPLEVBQUU7WUFDcEUsSUFBSTtTQUNMLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsd0JBQXdCLEdBQUcseUJBQXlCO1lBQzdELElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyJ9