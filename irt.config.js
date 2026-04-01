// ═══════════════════════════════════════════════════════════════
// IRT CONFIGURATION
// ═══════════════════════════════════════════════════════════════
//
// Centralised configuration for the psychometric engine. Extracting
// this from the core logic allows psychometricians or developers
// to easily adjust the testing parameters as the item bank grows.

export const IRT_CONFIG = {
  // ─── EAP Estimation Parameters ───
  thetaBounds: { min: -3, max: 3, step: 0.1 },
  defaultPriorSe: 2.0,

  // ─── Stopping Rules ───
  // maxItems: absolute ceiling of test length
  // minItems: floor before test is allowed to terminate
  // seThreshold: stop if Standard Error drops below this
  testLengthConstraints: {
    quick: { maxItems: 20, minItems: 16, seThreshold: 0.45 },
    full: { maxItems: 40, minItems: 30, seThreshold: 0.28 }
  },

  // ─── Content Balancing ───
  // Number of items ideally required for every unique skill found
  // in the item bank (dynamically adapts without hardcoding grammar/vocab).
  minItemsPerSkill: 4,
};
