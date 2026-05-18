import { resolveSignalHookIsDraft } from './index';

describe('resolveSignalHookIsDraft', () => {
    it('uses explicit isDraft when set', () => {
        expect(resolveSignalHookIsDraft({ isDraft: true, executionContext: 'production' })).toBe(true);
        expect(resolveSignalHookIsDraft({ isDraft: false, executionContext: 'editor' })).toBe(false);
    });

    it('falls back to executionContext editor', () => {
        expect(resolveSignalHookIsDraft({ executionContext: 'editor' })).toBe(true);
        expect(resolveSignalHookIsDraft({ executionContext: 'production' })).toBe(false);
    });
});
