"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCredentialVerificationResult = parseCredentialVerificationResult;
/** Do not infer verification from arbitrary action output or legacy `pass` flags.
 * Provider response content and caller-supplied receipt identities are excluded.
 */
function parseCredentialVerificationResult(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Invalid credential verification result');
    }
    const result = value;
    if (Object.keys(result).length !== 2 ||
        result.contract !== 'credential.connection.verification/v1' ||
        (result.outcome !== 'passed' && result.outcome !== 'failed')) {
        throw new Error('Invalid credential verification result');
    }
    return { contract: result.contract, outcome: result.outcome };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlZGVudGlhbC12ZXJpZmljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY3JlZGVudGlhbC12ZXJpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFZQSw4RUFXQztBQWREOztHQUVHO0FBQ0gsU0FBZ0IsaUNBQWlDLENBQUMsS0FBYztJQUM1RCxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRCxNQUFNLE1BQU0sR0FBRyxLQUFnQyxDQUFDO0lBQ2hELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUNoQyxNQUFNLENBQUMsUUFBUSxLQUFLLHVDQUF1QztRQUMzRCxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUMvRCxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xFLENBQUMifQ==