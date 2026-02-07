/**
 * Core clinical calculation logic for the dental platform.
 */

/**
 * Calculates the total cost and delta between two treatment plans.
 */
export const calculatePlanDelta = (planA, planB) => {
    const totalA = planA.totalCost || planA.items.reduce((sum, item) => sum + (item.cost || 0), 0);
    const totalB = planB.totalCost || planB.items.reduce((sum, item) => sum + (item.cost || 0), 0);
    return totalA - totalB;
};

/**
 * Evaluates periodontal risk based on BOP positive markers and PD depth.
 * @param {Array} teeth - Array of tooth objects with perio data
 * @returns {String} 'high' | 'medium' | 'low'
 */
export const evaluatePerioRisk = (teeth = []) => {
    let deepPockets = 0;
    let bopPositive = 0;

    teeth.forEach(tooth => {
        if (tooth.bop) bopPositive++;
        if (tooth.pd > 4) deepPockets++;
    });

    if (deepPockets > 6 || bopPositive > 12) return 'high';
    if (deepPockets > 2 || bopPositive > 4) return 'medium';
    return 'low';
};

/**
 * Calculate patient age from ID (Mock logic: P2026001 -> 2026-001 -> implies some age)
 * In real app, DOB would be in patient record.
 * @param {string} id
 */
export const calculateAgeFromId = (id) => {
    // Deterministic mock age for demo consistency
    const suffix = parseInt(id.replace(/[^\d]/g, '').slice(-3));
    return 20 + (suffix % 50); 
};
