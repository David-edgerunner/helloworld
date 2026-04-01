// ═══════════════════════════════════════════════════════════════
// WRONG ANSWER BREAKDOWN — Diagnostic intelligence panel
// ═══════════════════════════════════════════════════════════════
//
// WHY THIS COMPONENT EXISTS:
//   Wrong answers are the most valuable data in a placement test.
//   Most apps hide them or show them with red ✗ marks and move on.
//   This component treats each wrong answer as a signal — grouped
//   by what it reveals about the learner's pattern, not the order
//   they answered.
//
// PSYCHOLOGICAL DESIGN (non-negotiable, from Website Bible):
//   - Title is ALWAYS "What we learned from your answers"
//     Never "Your mistakes", never "Wrong answers"
//   - Neutral ○ for the learner's choice (not ✗ — that's shame)
//   - Green ✓ for the correct answer (forward-looking)
//   - Groups sorted by sub-skill miss count — the pattern first
//   - Pattern insight footer synthesises, it doesn't shame
//
// RENDERING ORDER (top to bottom):
//   1. Header     — Title + subtitle (always the same authored text)
//   2. Summary    — 3 metric cards (answered / incorrect / patterns)
//   3. Filter     — Tab bar: All | Grammar | Vocabulary | Reading
//   4. Groups     — One section per sub-skill, sorted most-missed first
//   5. Each card  — Collapsed header → expand → choices + explanation
//   6. Footer     — Pattern insight synthesis
//
// PROPS:
//   wrongAnswers     — Array of incorrect response objects (with explanation_vi)
//   lang             — "en" | "vi"
//   subSkillAccuracy — { "Verb Tenses": 60, "Articles": 33, ... } (0–100)
//   totalAnswered    — Total questions answered in this session
//   t                — i18n strings object

import { useState, useMemo } from "react";

// ─── ChevronIcon ─────────────────────────────────────────────────
// The expand/collapse indicator in each card header.
// SVG so it can be rotated with CSS transform (no emoji quirks).
function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{
        // Rotate 180° when the card is open — CSS transition handles the animation
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── NeutralCircleIcon ───────────────────────────────────────────
// Used for "You chose:" — neutral, not accusatory.
// WHY NOT ✗? The Website Bible is explicit: "A red ✗ is the
// language of shame. A neutral ○ is the language of data."
function NeutralCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="var(--slate)" strokeWidth="2"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

// ─── CheckIcon ───────────────────────────────────────────────────
// Used for "The answer was:" — green, clear, forward-looking.
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="var(--strength)" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── InsightIcon ─────────────────────────────────────────────────
// Decorative icon for the pattern insight footer — a simple
// lightbulb-style SVG (no emoji, no external library).
function InsightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="var(--teal)" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      {/* Lightbulb shape */}
      <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
    </svg>
  );
}

// ─── getAccuracyColor ────────────────────────────────────────────
// Maps a sub-skill accuracy % to a semantic colour variable.
// Red = focus needed. Amber = developing. Blue = mostly fine.
// WHY: Even sub-skills in the wrong answers section may have
// ≥75% accuracy (only 1-2 wrong out of many). The colour tells
// the learner how serious the gap actually is.
function getAccuracyColor(accuracy) {
  if (accuracy === undefined || accuracy === null) return "var(--slate)";
  if (accuracy < 50) return "var(--gap)";       // Red — needs focus
  if (accuracy < 75) return "var(--developing)"; // Amber — developing
  return "var(--teal)";                          // Blue — mostly OK
}

// ─── ItemCard ────────────────────────────────────────────────────
// A single collapsed/expanded wrong answer card.
// Accordion: only one card is open at a time (managed by parent).
//
// PROPS:
//   item       — wrong answer object (with all metadata)
//   index      — display number (1-indexed)
//   isOpen     — whether this card is currently expanded
//   onToggle   — callback to open/close this card
//   lang       — "en" | "vi"
//   t          — i18n strings
function ItemCard({ item, index, isOpen, onToggle, lang, t }) {
  // Pick explanation language: Vietnamese if lang=vi AND vi explanation exists
  // Falls back to English explanation_text if no Vietnamese version available
  const explanation =
    lang === "vi" && item.explanation_vi
      ? item.explanation_vi
      : item.explanation_text;

  // Check if there's a distractor trap for the learner's specific wrong choice.
  // distractor_traps is an object keyed by option index as string: { "2": "reason" }
  const distractorTrap = item.distractor_traps?.[String(item.learner_choice)];

  // Truncate the stem for the collapsed header — shows just enough to identify the question.
  // 60 chars is enough to see the beginning without crowding the header row.
  const stemPreview =
    item.stem.length > 65
      ? item.stem.slice(0, 62) + "…"
      : item.stem;

  const bodyId = `wab-item-body-${index}`;

  return (
    <div className={`wab-item-card ${isOpen ? "wab-item-card--open" : ""}`}>

      {/* ── Collapsed header (always visible) ── */}
      {/* Minimum 44px height enforced in CSS for touch targets */}
      <button
        className="wab-item-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={bodyId}
      >
        <span className="wab-item-num">Q{index}</span>
        <span className="wab-item-stem-preview">{stemPreview}</span>
        <ChevronIcon open={isOpen} />
      </button>

      {/* ── Expanded body (revealed on tap/click) ── */}
      {isOpen && (
        <div className="wab-item-body" id={bodyId}>

          {/* Full question stem */}
          <p className="wab-item-stem">{item.stem}</p>

          {/* "You chose" row — neutral ○, never ✗ */}
          <div className="wab-choice wab-choice--learner">
            <NeutralCircleIcon />
            <span className="wab-choice-label">{t.youChose}</span>
            <span className="wab-choice-text">
              {item.options[item.learner_choice]}
            </span>
          </div>

          {/* "The answer was" row — green ✓ */}
          <div className="wab-choice wab-choice--correct">
            <CheckIcon />
            <span className="wab-choice-label">{t.theAnswer}</span>
            <span className="wab-choice-text">
              {item.options[item.correct_choice]}
            </span>
          </div>

          {/* Explanation block — grey background, clear contrast */}
          <div className="wab-explanation">
            <p className="wab-explanation-text">{explanation}</p>

            {/* Distractor trap note — only shown if one exists for this choice */}
            {/* "This answer is tempting because..." — reframes error as pattern */}
            {distractorTrap && (
              <>
                <hr className="wab-explanation-divider" />
                <p className="wab-distractor-note">
                  <em>{t.distractorNote}: </em>
                  {distractorTrap}
                </p>
              </>
            )}
          </div>

          {/* CEFR difficulty tag — sub-skill · level */}
          <div className="wab-item-tag">
            {item.sub_skill} · {item.cefr_difficulty}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WrongAnswerBreakdown (main export) ──────────────────────────
export function WrongAnswerBreakdown({
  wrongAnswers,
  lang,
  subSkillAccuracy,
  totalAnswered,
  t,
}) {
  // ─── Early return: perfect score ─────────────────────────────
  // Shouldn't reach here normally, but safe to handle gracefully
  if (wrongAnswers.length === 0) {
    return (
      <section className="wab-section" aria-label="Answer breakdown">
        <div className="wab-perfect">
          <p style={{ color: "var(--strength)", fontWeight: 500, textAlign: "center", padding: "24px 0" }}>
            {lang === "vi"
              ? "Hoàn hảo! Bạn đã trả lời đúng tất cả các câu hỏi."
              : "Perfect score. You answered every question correctly."}
          </p>
        </div>
      </section>
    );
  }

  // Which filter tab is active: "All" | "Grammar" | "Vocabulary" | "Reading"
  const [activeFilter, setActiveFilter] = useState("All");

  // Which item card is open — only one at a time (accordion).
  // Stored as a unique key: "subSkill-index" to avoid collisions
  // across different sub-skill groups.
  const [openItemKey, setOpenItemKey] = useState(null);

  // ─── Group wrong answers by sub-skill ───────────────────────
  // useMemo caches this calculation — it only re-runs if wrongAnswers changes.
  // That prevents expensive regrouping on every filter tab click.
  const groupedBySubSkill = useMemo(() => {
    // Build a map: { "Verb Tenses": { skill: "Grammar", items: [...] }, ... }
    const map = {};
    for (let i = 0; i < wrongAnswers.length; i++) {
      const item = wrongAnswers[i];
      const key = item.sub_skill;
      if (!map[key]) {
        map[key] = { skill: item.skill, items: [] };
      }
      map[key].items.push({ ...item, originalIndex: i + 1 });
    }

    // Convert to array and sort by miss count (most-missed sub-skill first).
    // This surfaces the most impactful pattern immediately.
    return Object.entries(map)
      .map(([subSkill, data]) => ({
        subSkill,
        skill: data.skill,
        items: data.items,
        count: data.items.length,
        // Accuracy for this sub-skill across ALL attempts (not just wrong ones)
        // If subSkillAccuracy doesn't have this sub-skill, we estimate from wrong answers
        accuracy: subSkillAccuracy?.[subSkill] ?? null,
      }))
      .sort((a, b) => b.count - a.count || a.subSkill.localeCompare(b.subSkill)); // Most missed first
  }, [wrongAnswers, subSkillAccuracy]);

  // ─── Summary metrics ─────────────────────────────────────────
  const totalWrong = wrongAnswers.length;
  // "Patterns found" = distinct sub-skills with at least 1 wrong answer
  const patternsFound = groupedBySubSkill.length;

  // ─── Filter tabs config ───────────────────────────────────────
  // Count wrong answers per skill for tab labels: "Grammar (3)"
  const { skillCounts, skillsWithErrors } = useMemo(() => {
    const counts = {};
    for (const item of wrongAnswers) {
      counts[item.skill] = (counts[item.skill] || 0) + 1;
    }
    return { skillCounts: counts, skillsWithErrors: Object.keys(counts) };
  }, [wrongAnswers]);

  // ─── Filtered groups (for the active tab) ────────────────────
  const visibleGroups = useMemo(() => {
    return activeFilter === "All"
      ? groupedBySubSkill
      : groupedBySubSkill.filter(g => g.skill === activeFilter);
  }, [activeFilter, groupedBySubSkill]);

  // ─── Pattern insight data ─────────────────────────────────────
  // The top sub-skill (most missed) for the footer synthesis
  const topGroup = groupedBySubSkill[0];

  // ─── Toggle accordion ────────────────────────────────────────
  function toggleItem(subSkill, itemIndex) {
    const key = `${subSkill}-${itemIndex}`;
    // If this card is already open, close it. Otherwise open it
    // (and close whatever else was open — accordion behaviour).
    setOpenItemKey(prev => (prev === key ? null : key));
  }

  return (
    <section className="wab-section" aria-label="What we learned from your answers">

      {/* ────────────────────────────────────────────────────────
          SECTION 1: Header
          The exact phrase "What we learned from your answers" is
          non-negotiable — never "Your mistakes" or "Wrong answers".
          ──────────────────────────────────────────────────────── */}
      <div className="wab-header">
        <h2 className="wab-title">{t.whatWeLearnedTitle}</h2>
        <p className="wab-subtitle">{t.whatWeLearnedSubtitle}</p>
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 2: Summary strip — 3 metric cards
          ──────────────────────────────────────────────────────── */}
      <div className="wab-summary">
        <div className="wab-metric">
          <span className="wab-metric-value">{totalAnswered ?? "—"}</span>
          <span className="wab-metric-label">{t.questionsAnswered}</span>
        </div>
        <div className="wab-metric">
          <span className="wab-metric-value">{totalWrong}</span>
          <span className="wab-metric-label">{t.incorrectAnswers}</span>
        </div>
        <div className="wab-metric">
          <span className="wab-metric-value">{patternsFound}</span>
          <span className="wab-metric-label">{t.patternsFound}</span>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 3: Filter tabs
          "All" + one tab per skill that has wrong answers.
          Minimum 44px height enforced in CSS.
          ──────────────────────────────────────────────────────── */}
      <div className="wab-filter-tabs" role="tablist" aria-label="Filter by skill">

        {/* "All" tab — always visible */}
        <button
          id="wab-tab-All"
          className={`wab-tab ${activeFilter === "All" ? "wab-tab--active" : ""}`}
          role="tab"
          aria-selected={activeFilter === "All"}
          aria-controls="wab-tabpanel-All"
          onClick={() => setActiveFilter("All")}
        >
          {t.allFilter} ({totalWrong})
        </button>

        {/* One tab per skill with errors */}
        {skillsWithErrors.map(skill => (
          <button
            key={skill}
            id={`wab-tab-${skill}`}
            className={`wab-tab ${activeFilter === skill ? "wab-tab--active" : ""}`}
            role="tab"
            aria-selected={activeFilter === skill}
            aria-controls={`wab-tabpanel-${skill}`}
            onClick={() => setActiveFilter(skill)}
          >
            {skill} ({skillCounts[skill]})
          </button>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 4 & 5: Skill groups + item cards
          Each group = one sub-skill. Within each group, item cards
          are collapsed by default. Only one can be open at a time.
          ──────────────────────────────────────────────────────── */}
      <div 
        className="wab-groups"
        role="tabpanel"
        id={`wab-tabpanel-${activeFilter}`}
        aria-labelledby={`wab-tab-${activeFilter}`}
      >
        {visibleGroups.map(group => {
          // Dot colour tells the learner how serious this gap is
          const dotColor = getAccuracyColor(group.accuracy);

          return (
            <div key={group.subSkill} className="wab-group">

              {/* ── Group header ── */}
              <div className="wab-group-header">
                {/* Coloured dot — red/amber/blue based on accuracy */}
                <span
                  className="wab-group-dot"
                  style={{ background: dotColor }}
                  aria-hidden="true"
                />

                {/* Sub-skill name */}
                <span className="wab-group-name">{group.subSkill}</span>

                {/* Miss count */}
                <span className="wab-group-missed">
                  {group.count} missed
                </span>

                {/* Accuracy pill — only if we have data for this sub-skill */}
                {group.accuracy !== null && (
                  <span
                    className="wab-accuracy-pill"
                    style={{
                      color: dotColor,
                      borderColor: dotColor,
                    }}
                  >
                    {group.accuracy}%
                  </span>
                )}
              </div>

              {/* ── Item cards (accordion) ── */}
              {group.items.map((item, itemIndex) => {
                const key = `${group.subSkill}-${itemIndex}`;
                return (
                  <ItemCard
                    key={key}
                    item={item}
                    // Display number — globally sequential across all groups
                    index={item.originalIndex}
                    isOpen={openItemKey === key}
                    onToggle={() => toggleItem(group.subSkill, itemIndex)}
                    lang={lang}
                    t={t}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 6: Pattern insight footer
          Synthesises the dominant pattern. Never shames.
          Uses a parameterised i18n function — not AI-generated.
          ──────────────────────────────────────────────────────── */}
      {topGroup && (
        <div className="wab-pattern-footer">
          <InsightIcon />
          <div className="wab-pattern-text">
            <p className="wab-pattern-title">{t.patternTitle}</p>
            {/* patternInsight is a function: (topSubSkill, missCount, totalWrong) → string */}
            <p className="wab-pattern-body">
              {typeof t.patternInsight === "function"
                ? t.patternInsight(topGroup.subSkill, topGroup.count, totalWrong)
                : t.noPatternsFound}
            </p>
          </div>
        </div>
      )}

    </section>
  );
}
