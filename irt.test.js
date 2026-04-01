import { describe, it, expect } from 'vitest';
import { IRT } from './irt.js';
import { IRT_CONFIG } from './irt.config.js';

describe('IRT Engine Engine Math', () => {

  it('3PL probability calculation bounds', () => {
    // P(θ) = c + (1-c) / (1 + exp(-a(θ-b)))
    // For a=1, b=0, c=0.25
    // Theta = 0 (at difficulty) => P(0) = 0.25 + 0.75 * 0.5 = 0.625
    const p1 = IRT.prob3PL(0, 1, 0, 0.25);
    expect(p1).toBeCloseTo(0.625, 3);
    
    // Very high theta -> P approaches 1
    const p2 = IRT.prob3PL(10, 1, 0, 0.25);
    expect(p2).toBeGreaterThan(0.99);

    // Very low theta -> P approaches c (guessing parameter)
    const p3 = IRT.prob3PL(-10, 1, 0, 0.25);
    expect(p3).toBeCloseTo(0.25, 3);
  });

  it('EAP Theta estimation shifts appropriately based on correctness', () => {
    const neutralResponses = [];
    const res1 = IRT.estimateTheta(neutralResponses);
    expect(res1.theta).toBe(0);
    expect(res1.se).toBe(IRT_CONFIG.defaultPriorSe);

    const goodResponses = [
      { a: 1.0, b: 0.0, c: 0.2, correct: true },
      { a: 1.2, b: 1.0, c: 0.2, correct: true }
    ];
    const res2 = IRT.estimateTheta(goodResponses);
    // Should be strictly positive since student got average and hard questions correct
    expect(res2.theta).toBeGreaterThan(0);
    expect(res2.se).toBeLessThan(IRT_CONFIG.defaultPriorSe);

    const badResponses = [
      { a: 1.0, b: 0.0, c: 0.2, correct: false },
      { a: 1.2, b: -1.0, c: 0.2, correct: false }
    ];
    const res3 = IRT.estimateTheta(badResponses);
    // Strictly negative since student failed average and easy questions
    expect(res3.theta).toBeLessThan(0);
  });

  it('Selects the next item maximizing Fisher Information', () => {
    // Theta = 0, we want an item closest to b=0 with high discrimination (a)
    const theta = 0;
    const itemBank = [
      { item_id: '1', skill: 'Grammar', irt_a_param: 0.5, irt_b_param: 0.0, irt_c_param: 0.2 },
      { item_id: '2', skill: 'Grammar', irt_a_param: 2.0, irt_b_param: 0.0, irt_c_param: 0.2 }, // Highly informative at 0
      { item_id: '3', skill: 'Grammar', irt_a_param: 2.0, irt_b_param: 3.0, irt_c_param: 0.2 }, // Way too hard
    ];

    const nextItem = IRT.selectNext(theta, new Set(), [], itemBank);
    // Since item 2 has highest 'a' and 'b' matches theta, it should yield max fisher info
    expect(nextItem.item_id).toBe('2');
  });

  it('Stopping rules honor max configuration', () => {
    const seConfig = IRT_CONFIG.testLengthConstraints.quick;
    const responses = new Array(seConfig.maxItems).fill({});
    // Even if SE is high, should stop because max items reached
    const shouldStop = IRT.shouldStop(responses, 2.0, seConfig.maxItems);
    expect(shouldStop).toBe(true);

    const fewResponses = new Array(seConfig.minItems - 1).fill({});
    // Even with perfect precision, should NOT stop if under minimum items
    const shouldStopEarly = IRT.shouldStop(fewResponses, 0.0, seConfig.maxItems);
    expect(shouldStopEarly).toBe(false);
  });

});
