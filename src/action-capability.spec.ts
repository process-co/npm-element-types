import { parseActionCapabilityClaims } from './action-capability';

describe('parseActionCapabilityClaims', () => {
    it('accepts a versioned capability with concrete connection requirements', () => {
        expect(parseActionCapabilityClaims([{
            capability: 'communication.email.send/v1',
            inputContract: 'process.email.compose/v1',
            features: ['html', 'cc', 'bcc'],
            requiredScopes: ['https://www.googleapis.com/auth/gmail.send'],
            identity: {
                kind: 'email-sender',
                addressPath: 'account.email',
                aliasesPath: 'account.aliases',
                organizationPath: 'account.organizationId',
            },
        }])).toEqual([expect.objectContaining({
            capability: 'communication.email.send/v1',
            features: ['html', 'cc', 'bcc'],
        })]);
    });

    it('rejects unversioned and duplicate capability declarations', () => {
        expect(() => parseActionCapabilityClaims([{ capability: 'email.send' }]))
            .toThrow('versioned capability');
        expect(() => parseActionCapabilityClaims([
            { capability: 'communication.email.send/v1' },
            { capability: 'communication.email.send/v1' },
        ])).toThrow('only claim a canonical capability once');
    });

    it('rejects unsafe connection metadata paths', () => {
        expect(() => parseActionCapabilityClaims([{
            capability: 'communication.email.send/v1',
            identity: { kind: 'email-sender', addressPath: '../secrets' },
        }])).toThrow('safe connection metadata path');
    });
});
