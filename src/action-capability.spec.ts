import {
    parseActionCapabilityClaims,
    resolveActionCapabilityEffect,
} from './action-capability';

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

    it('distinguishes provider drafts from committed email sends', () => {
        expect(resolveActionCapabilityEffect({
            capability: 'communication.email.draft.compose/v1',
        })).toEqual({
            disposition: 'provider-draft',
            reversibility: 'reversible',
            settlement: 'provider-acknowledged',
        });
        expect(resolveActionCapabilityEffect({
            capability: 'communication.email.send/v1',
        })).toEqual({
            disposition: 'commit',
            reversibility: 'irreversible',
            settlement: 'externally-observed',
        });
    });

    it('rejects an element that weakens canonical send semantics', () => {
        expect(() => parseActionCapabilityClaims([{
            capability: 'communication.email.send/v1',
            effect: {
                disposition: 'provider-draft',
                reversibility: 'reversible',
                settlement: 'provider-acknowledged',
            },
        }])).toThrow('conflicts with its canonical effect');
    });

    it('keeps calendar reads observational and event creation consequential', () => {
        expect(resolveActionCapabilityEffect({
            capability: 'calendar.events.read/v1',
        })).toEqual({
            disposition: 'observe',
            reversibility: 'not-applicable',
            settlement: 'immediate',
        });
        expect(resolveActionCapabilityEffect({
            capability: 'calendar.availability.compute/v1',
        })).toEqual({
            disposition: 'observe',
            reversibility: 'not-applicable',
            settlement: 'immediate',
        });
        expect(resolveActionCapabilityEffect({
            capability: 'calendar.event.create/v1',
        })).toEqual({
            disposition: 'commit',
            reversibility: 'compensatable',
            settlement: 'provider-acknowledged',
        });
    });

    it('treats an undeclared extension as an irreversible commit', () => {
        expect(resolveActionCapabilityEffect({
            capability: 'vendor.records.mutate/v1',
        })).toEqual({
            disposition: 'commit',
            reversibility: 'irreversible',
            settlement: 'externally-observed',
        });
    });
});
