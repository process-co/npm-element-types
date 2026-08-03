import { evaluatePropVisibility } from './property-visibility';

describe('evaluatePropVisibility', () => {
    it('supports membership conditions for editor properties', () => {
        const visibleWhen = {
            joinMode: { in: ['minimumSucceeded', 'minimumSettled'] },
        };

        expect(evaluatePropVisibility(visibleWhen, { joinMode: 'minimumSucceeded' })).toBe(true);
        expect(evaluatePropVisibility(visibleWhen, { joinMode: 'minimumSettled' })).toBe(true);
        expect(evaluatePropVisibility(visibleWhen, { joinMode: 'all' })).toBe(false);
    });

    it('requires every referenced property condition to pass', () => {
        expect(evaluatePropVisibility({
            joinMode: { in: ['minimumSucceeded'] },
            enabled: { equals: true },
        }, {
            joinMode: 'minimumSucceeded',
            enabled: false,
        })).toBe(false);
    });
});
