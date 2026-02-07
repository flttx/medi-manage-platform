import { describe, it, expect } from 'vitest';
import { calculatePlanDelta, evaluatePerioRisk } from './calculations';

describe('Clinical Calculations', () => {
    describe('calculatePlanDelta', () => {
        it('should correctly calculate the difference between two plans', () => {
            const planA = { totalCost: 15000 };
            const planB = { totalCost: 12000 };
            expect(calculatePlanDelta(planA, planB)).toBe(3000);
        });

        it('should sum items if totalCost is missing', () => {
            const planA = { items: [{ cost: 5000 }, { cost: 5000 }] };
            const planB = { items: [{ cost: 8000 }] };
            expect(calculatePlanDelta(planA, planB)).toBe(2000);
        });
    });

    describe('evaluatePerioRisk', () => {
        it('should return high risk for many deep pockets', () => {
            const teeth = Array(7).fill({ pd: 5, bop: false });
            expect(evaluatePerioRisk(teeth)).toBe('high');
        });

        it('should return medium risk for moderate BOP', () => {
            const teeth = Array(5).fill({ pd: 2, bop: true });
            expect(evaluatePerioRisk(teeth)).toBe('medium');
        });

        it('should return low risk for healthy gums', () => {
            const teeth = [
                { pd: 2, bop: false },
                { pd: 3, bop: false }
            ];
            expect(evaluatePerioRisk(teeth)).toBe('low');
        });
    });
});
