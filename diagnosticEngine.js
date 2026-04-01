// ═══════════════════════════════════════════════════════════════
// DIAGNOSTIC ENGINE — Extends raw CAT output into richer insight
// ═══════════════════════════════════════════════════════════════
//
// WHY THIS FILE EXISTS:
//   The existing diagnostic.js does the number crunching (accuracy
//   per skill, per sub-skill, which answers were wrong).
//   This file takes that output one step further: it builds the
//   human-readable story — the "weak link", the unlock cards,
//   the IELTS impact — by combining the computed data with the
//   i18n copy strings.
//
// DESIGN PRINCIPLE: Pure JS only. No React, no side effects.
//   This means: no useState, no useEffect, no JSX. It's just a
//   function that takes data in and returns data out. Easy to
//   test, easy to reason about.
//
// HOW IT FITS INTO THE APP:
//   TestSessionContext.jsx → Diagnostic.analyze() → results.diagnosis
//   ResultsPage.jsx → computeDiagnosis(results.diagnosis, t)
//                  → { skillAccuracy, subSkillAccuracy, weakLink,
//                       unlockCards, wrongAnswers }
//   EnglishDNA + WrongAnswerBreakdown consume this output.

import { VI_EXPLANATIONS } from "./viExplanations.js";

// ─── computeDiagnosis ───────────────────────────────────────────
//
// Takes the existing diagnosis object (from Diagnostic.analyze in
// diagnostic.js) and the i18n strings, and produces the extended
// shape that EnglishDNA and WrongAnswerBreakdown need.
//
// @param {Object} diagnosis  - output of Diagnostic.analyze()
// @param {Object} t          - i18n strings for the active language
// @returns {Object}          - extended diagnosis object
//
export function computeDiagnosis(diagnosis, t) {
  const {
    skillAccuracy,      // { Grammar: 72, Vocabulary: 45, Reading: 81 }
    subSkillAnalysis,   // { "Verb Tenses": { accuracy, status, skill, correct, total } }
    wrongAnswers,       // Array of incorrect response objects
    weaknesses,         // Top 3 sub-skills sorted worst-first
  } = diagnosis;

  // ─── 1. subSkillAccuracy ─────────────────────────────────────
  // The subSkillAnalysis already has accuracy per sub-skill, but
  // it's nested inside objects. We flatten it into a simple map:
  //   { "Verb Tenses": 60, "Articles": 33, ... }
  // This is easier to look up in the UI components.
  const subSkillAccuracy = {};
  for (const [name, data] of Object.entries(subSkillAnalysis)) {
    subSkillAccuracy[name] = data.accuracy;
  }

  // ─── 2. weakLink ─────────────────────────────────────────────
  // The single most important thing to work on right now.
  // We pick weaknesses[0] — already sorted worst-first by
  // Diagnostic.analyze(). Only count sub-skills with ≥ 2 items
  // answered, because 1/1 = 0% is statistically meaningless.
  //
  // Shape: { subSkill, skill, accuracy, ieltsImpact, bandCost }
  const weakLinkData = weaknesses.find(w => {
    // Find the corresponding subSkillAnalysis entry to check total
    const analysis = subSkillAnalysis[w.name];
    return analysis && analysis.total >= 2;
  }) || weaknesses[0]; // Fall back to worst sub-skill if none has 2+ items

  let weakLink = null;
  if (weakLinkData) {
    // t.weakLinkImpact is keyed by sub-skill name (e.g. "Verb Tenses").
    // It explains WHY this gap costs IELTS points — authored copy,
    // not AI-generated. Falls back to a generic sentence if not found.
    const ieltsImpact =
      t.weakLinkImpact?.[weakLinkData.name] ||
      `This gap directly affects your IELTS ${weakLinkData.skill} performance.`;

    // t.subSkillUnlock has bandCost per sub-skill — e.g. "~0.5 band"
    const bandCost = t.subSkillUnlock?.[weakLinkData.name]?.bandCost || "~0.5 band";

    weakLink = {
      subSkill: weakLinkData.name,
      skill: weakLinkData.skill,
      accuracy: weakLinkData.accuracy,
      ieltsImpact,
      bandCost,
    };
  }

  // ─── 3. unlockCards ──────────────────────────────────────────
  // Top 3 weaknesses, each showing what the learner GAINS when
  // they fix it. Forward-looking framing — not "you struggle with X"
  // but "fix this and your Writing Task 2 arguments become complete."
  //
  // Shape per card: { subSkill, fix, reward }
  const unlockCards = weaknesses.slice(0, 3).map(w => {
    const unlock = t.subSkillUnlock?.[w.name];
    return {
      subSkill: w.name,
      // 'fix' completes the sentence "Fix this and ___"
      fix: unlock?.fix || "your accuracy in this area improves",
      // 'reward' is the approximate IELTS band gain
      reward: unlock?.reward || "+0.5 IELTS",
    };
  });

  // ─── 4. wrongAnswers with VI explanations ────────────────────
  // The wrongAnswers array from Diagnostic.analyze() contains
  // explanation_text (English), but not explanation_vi (Vietnamese).
  // We merge in the Vietnamese explanation here so WrongAnswerBreakdown
  // doesn't need to import viExplanations itself.
  //
  // VI_EXPLANATIONS is keyed by item_id (a UUID string).
  const enrichedWrongAnswers = wrongAnswers.map(item => ({
    ...item,
    // Add Vietnamese explanation if available, otherwise null
    explanation_vi: VI_EXPLANATIONS[item.item_id] || null,
  }));

  // ─── Return the full extended diagnosis object ────────────────
  return {
    skillAccuracy,          // Unchanged from Diagnostic.analyze()
    subSkillAccuracy,       // Flattened: { "Verb Tenses": 60, ... }
    weakLink,               // The single worst sub-skill with IELTS context
    unlockCards,            // Top 3 forward-looking opportunity cards
    wrongAnswers: enrichedWrongAnswers, // With explanation_vi added
  };
}
