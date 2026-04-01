// ═══════════════════════════════════════════════════════════════
// IRT ENGINE — 3-Parameter Logistic (3PL) Item Response Theory
// ═══════════════════════════════════════════════════════════════
//
// Implements the psychometric core of the Computer Adaptive Test.
// Uses a 3PL IRT model to:
//   1. Estimate learner ability (theta, θ) using Expected A Posteriori (EAP)
//   2. Select the most informative next item (Maximum Fisher Information)
//   3. Convert theta to human-readable scores (0-100, CEFR, IELTS)
//   4. Decide when to stop the test (minimum items + SE threshold)
//
// Key concepts:
//   - 3PL: P(θ) = c + (1-c)/(1+e^(-a(θ-b)))  where:
//       a = discrimination (slope — how well item differentiates)
//       b = difficulty (the θ where P(correct) ≈ 0.5+c/2)
//       c = guessing (lower asymptote, typically 0.20-0.25 for 4-choice)
//   - EAP: integrates over prior via numerical quadrature
//   - Fisher Info: I(θ) = a²·p*²·q / p  — maximised for optimal item selection
//
// This module is pure computation — no React, no side effects, easy to unit test.

import { IRT_CONFIG } from './irt.config.js';

export const IRT = {
  // 3PL probability: P(θ) = c + (1-c) / (1 + exp(-a(θ-b)))
  prob3PL(theta, a, b, c) {
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  },

  // Fisher Information for item selection
  fisherInfo(theta, a, b, c) {
    const p = this.prob3PL(theta, a, b, c);
    const q = 1 - p;
    const pStar = 1 / (1 + Math.exp(-a * (theta - b)));
    if (p === 0 || q === 0) return 0;
    return (a * a * Math.pow(pStar, 2) * q) / p;
  },

  // EAP estimation with normal prior
  estimateTheta(responses) {
    if (responses.length === 0) return { theta: 0, se: IRT_CONFIG.defaultPriorSe };
    
    const quadPoints = [];
    for (let t = IRT_CONFIG.thetaBounds.min; t <= IRT_CONFIG.thetaBounds.max; t += IRT_CONFIG.thetaBounds.step) {
      quadPoints.push(t);
    }
    
    let numerator = 0;
    let denominator = 0;
    let variance = 0;
    
    for (const t of quadPoints) {
      // Prior: N(0, 1)
      const prior = Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI);
      
      // Likelihood
      let logLik = 0;
      for (const r of responses) {
        const p = this.prob3PL(t, r.a, r.b, r.c);
        logLik += r.correct ? Math.log(Math.max(p, 1e-10)) : Math.log(Math.max(1 - p, 1e-10));
      }
      const lik = Math.exp(logLik);
      const posterior = lik * prior;
      
      numerator += t * posterior;
      denominator += posterior;
    }
    
    const theta = denominator > 0 ? numerator / denominator : 0;
    
    // SE computation
    for (const t of quadPoints) {
      const prior = Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI);
      let logLik = 0;
      for (const r of responses) {
        const p = this.prob3PL(t, r.a, r.b, r.c);
        logLik += r.correct ? Math.log(Math.max(p, 1e-10)) : Math.log(Math.max(1 - p, 1e-10));
      }
      const posterior = Math.exp(logLik) * prior;
      variance += Math.pow(t - theta, 2) * posterior;
    }
    
    const se = denominator > 0 ? Math.sqrt(variance / denominator) : IRT_CONFIG.defaultPriorSe;
    return { theta: Math.max(IRT_CONFIG.thetaBounds.min, Math.min(IRT_CONFIG.thetaBounds.max, theta)), se };
  },

  // Select next item: Maximum Fisher Information with content balancing
  selectNext(theta, usedIds, responses, itemBank, maxItems = 40) {
    const skillCounts = {};
    responses.forEach(r => { skillCounts[r.skill] = (skillCounts[r.skill] || 0) + 1; });
    
    const allSkills = new Set(itemBank.map(item => item.skill));
    const totalAnswered = responses.length;
    // Estimate if we are approaching test end based on max configuration
    // (defaults to 'full' maxItems if context is unknown here, but usually passed via test flow)
    const remaining = maxItems - totalAnswered;
    
    // Determine if we need to force a skill based on dynamically gathered available skills
    let forcedSkill = null;
    for (const skill of allSkills) {
      const needed = IRT_CONFIG.minItemsPerSkill - (skillCounts[skill] || 0);
      if (needed > 0 && needed >= remaining) {
        forcedSkill = skill;
        break;
      }
    }
    
    // If getting close to the minimum items and a skill is still underrepresented
    if (!forcedSkill && totalAnswered >= 14) {
      for (const skill of allSkills) {
        if ((skillCounts[skill] || 0) < IRT_CONFIG.minItemsPerSkill) {
          forcedSkill = skill;
          break;
        }
      }
    }
    
    let candidates = itemBank.filter(item => !usedIds.has(item.item_id));
    if (forcedSkill) {
      const forced = candidates.filter(item => item.skill === forcedSkill);
      if (forced.length > 0) candidates = forced;
    }
    
    if (candidates.length === 0) return null;
    
    // Score by Fisher Information
    let best = null;
    let bestInfo = -Infinity;
    
    for (const item of candidates) {
      const info = this.fisherInfo(theta, item.irt_a_param, item.irt_b_param, item.irt_c_param);
      // Add small random noise for exposure control
      const noise = Math.random() * 0.05;
      if (info + noise > bestInfo) {
        bestInfo = info + noise;
        best = item;
      }
    }
    
    return best;
  },

  // Convert theta to 0-100 score
  thetaToScore(theta) {
    return Math.round(Math.max(0, Math.min(100, ((theta + 1.5) / 3.5) * 100)));
  },

  // Convert theta to CEFR level
  thetaToCEFR(theta) {
    const score = this.thetaToScore(theta);
    if (score <= 25) return "A2";
    if (score <= 50) return "B1";
    if (score <= 75) return "B2";
    return "C1";
  },

  // Get IELTS estimate from CEFR
  cefrToIELTS(cefr, score) {
    const map = {
      A2: { low: 3.5, high: 4.0 },
      B1: { low: 4.0, high: 5.0 },
      B2: { low: 5.5, high: 6.5 },
      C1: { low: 7.0, high: 8.0 },
    };
    const range = map[cefr];
    // Interpolate within range
    let rangeScores;
    if (cefr === "A2") rangeScores = [10, 25];
    else if (cefr === "B1") rangeScores = [26, 50];
    else if (cefr === "B2") rangeScores = [51, 75];
    else rangeScores = [76, 100];
    
    const pct = Math.max(0, Math.min(1, (score - rangeScores[0]) / (rangeScores[1] - rangeScores[0])));
    const band = range.low + pct * (range.high - range.low);
    return Math.round(band * 2) / 2; // Round to nearest 0.5
  },

  // Check stopping rule
  shouldStop(responses, se, maxItems = 40) {
    const isQuick = maxItems === IRT_CONFIG.testLengthConstraints.quick.maxItems;
    const config = isQuick ? IRT_CONFIG.testLengthConstraints.quick : IRT_CONFIG.testLengthConstraints.full;
    
    if (responses.length < config.minItems) return false;
    if (se < config.seThreshold) return true;
    if (responses.length >= config.maxItems) return true;
    return false;
  }
};
