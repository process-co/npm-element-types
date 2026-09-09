import { parseActionCapabilityClaims, resolveActionCapabilityEffect } from './action-capability';
import { parseCredentialVerificationResult } from './credential-verification';

const verification = { capability: 'credential.connection.verify/v1', requiredScopes: ['User.Read'] };

describe('credential verification capability', () => {
    it('uses the normal capability declaration with observational semantics', () => {
        const claim = parseActionCapabilityClaims([verification])[0]!;
        expect(claim.requiredScopes).toEqual(['User.Read']);
        expect(resolveActionCapabilityEffect(claim)).toEqual({ disposition: 'observe',
            reversibility: 'not-applicable', settlement: 'immediate' });
    });

    it.each(['communication.email.send/v1', 'communication.email.draft.compose/v1', 'vendor.records.mutate/v1'])(
        'rejects verification combined with consequential operation %s', capability => {
            expect(() => parseActionCapabilityClaims([verification, { capability }]))
                .toThrow('only declare observational capabilities');
        });

    it('permits companion read capabilities and rejects changing verification semantics', () => {
        expect(parseActionCapabilityClaims([verification, { capability: 'calendar.events.read/v1' }])).toHaveLength(2);
        expect(() => parseActionCapabilityClaims([{ ...verification, effect: {
            disposition: 'commit', reversibility: 'irreversible', settlement: 'immediate',
        } }])).toThrow('canonical effect');
    });

    it.each(['passed', 'failed'] as const)('parses explicit %s provider output', outcome => {
        const result = { contract: 'credential.connection.verification/v1', outcome };
        expect(parseCredentialVerificationResult(result)).toEqual(result);
    });

    it.each([null, true, {}, { pass: true }, { outcome: 'passed' },
        { contract: 'credential.connection.verification/v1', outcome: 'passed', data: { token: 'excluded' } },
        { contract: 'credential.connection.verification/v1', outcome: 'passed', credentialId: 'forged' },
        { contract: 'credential.connection.verification/v2', outcome: 'passed' },
    ])('does not turn arbitrary output into verification evidence: %j', value => {
        expect(() => parseCredentialVerificationResult(value)).toThrow('Invalid credential verification result');
    });
});
