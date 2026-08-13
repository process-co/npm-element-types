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

    it('matches numeric select values persisted as strings', () => {
        expect(evaluatePropVisibility({
            resStatusCode: { equals: 200 },
        }, {
            resStatusCode: '200',
        })).toBe(true);

        expect(evaluatePropVisibility({
            resStatusCode: { in: [200, 201] },
        }, {
            resStatusCode: '201',
        })).toBe(true);

        expect(evaluatePropVisibility({
            resStatusCode: { notEquals: 200 },
        }, {
            resStatusCode: '200',
        })).toBe(false);

        expect(evaluatePropVisibility({
            resStatusCode: { notIn: [200, 201] },
        }, {
            resStatusCode: '201',
        })).toBe(false);
    });

    it('does not apply broad loose-equality coercion', () => {
        expect(evaluatePropVisibility({ enabled: { equals: true } }, { enabled: 'true' })).toBe(false);
        expect(evaluatePropVisibility({ count: { equals: 0 } }, { count: '' })).toBe(false);
        expect(evaluatePropVisibility({ count: { equals: 1 } }, { count: '1 item' })).toBe(false);
    });
});
