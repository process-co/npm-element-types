"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptionsCapabilityClaims = parseOptionsCapabilityClaims;
const action_capability_1 = require("./action-capability");
/** Options use the shared capability contract, independently of the element's run method. */
function parseOptionsCapabilityClaims(value) {
    const claims = (0, action_capability_1.parseActionCapabilityClaims)(value);
    if (!claims.length || claims.some(claim => claim.effect?.disposition !== 'observe')) {
        throw new Error('Options capabilities must explicitly declare observational effects');
    }
    return claims;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy1jYXBhYmlsaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL29wdGlvbnMtY2FwYWJpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG9FQU1DO0FBVEQsMkRBQStGO0FBRS9GLDZGQUE2RjtBQUM3RixTQUFnQiw0QkFBNEIsQ0FBQyxLQUFjO0lBQ3pELE1BQU0sTUFBTSxHQUFHLElBQUEsK0NBQTJCLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxLQUFLLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDcEYsTUFBTSxJQUFJLEtBQUssQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIn0=