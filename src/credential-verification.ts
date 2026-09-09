/** Provider output from a declared credential.connection.verify/v1 action.
 * This result is not an execution receipt: the application must independently
 * establish real execution, admission ownership and the credential revision.
 */
export type CredentialVerificationResult = {
    contract: 'credential.connection.verification/v1';
    outcome: 'passed' | 'failed';
};

/** Do not infer verification from arbitrary action output or legacy `pass` flags.
 * Provider response content and caller-supplied receipt identities are excluded.
 */
export function parseCredentialVerificationResult(value: unknown): CredentialVerificationResult {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Invalid credential verification result');
    }
    const result = value as Record<string, unknown>;
    if (Object.keys(result).length !== 2 ||
        result.contract !== 'credential.connection.verification/v1' ||
        (result.outcome !== 'passed' && result.outcome !== 'failed')) {
        throw new Error('Invalid credential verification result');
    }
    return { contract: result.contract, outcome: result.outcome };
}
