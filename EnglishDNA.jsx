// ═══════════════════════════════════════════════════════════════
// ENGLISH DNA — Results fingerprint card
// ═══════════════════════════════════════════════════════════════
//
// WHY THIS COMPONENT EXISTS:
//   This is the emotional core of the results page. It answers:
//   "What does my English actually look like?" in a visual,
//   personal, and forward-looking way.
//
//   It replaces the generic 4-week study plan table with something
//   specific to THIS learner's actual shape — their DNA.
//
// PSYCHOLOGICAL DESIGN RULES (from Website Bible §8.1):
//   - Frame what the learner CAN do, not what they lack
//   - The weak link is framed as opportunity: "fastest route to B2"
//   - The honest timeline is honest — no fake precision
//   - Copy defaults to forward motion: what they can gain
//
// RENDERING ORDER (top to bottom):
//   1. Header      — CEFR badge + headline + capability description
//   2. Radar chart — SVG spider chart of 3 skill axes
//   3. Divider
//   4. Weak link   — The single gap most worth fixing right now
//   5. Unlock      — 3 cards showing what they gain when they fix it
//   6. Divider
//   7. Timeline    — Honest estimate of how long improvement takes
//   8. Actions     — Review wrong answers / Retake the test
//
// PROPS:
//   cefrLevel        — "A2" | "B1" | "B2" | "C1"
//   ieltsRange       — string, e.g. "5.0–6.0"
//   theta            — IRT theta score (float)
//   score            — normalised score 0–100
//   skillAccuracy    — { Grammar: 72, Vocabulary: 45, Reading: 81 }
//   subSkillAccuracy — { "Conditionals": 50, "Collocations": 38, ... }
//   weakLink         — { subSkill, skill, accuracy, ieltsImpact, bandCost }
//   unlockCards      — [{ subSkill, fix, reward }, ...]  (top 3)
//   goalType         — "A"|"B"|"C"|"D"|"E"
//   lang             — "en" | "vi"
//   t                — i18n strings object (i18n[lang])
//   onReviewWrongAnswers — callback: scrolls to WrongAnswerBreakdown
//   onRetake         — callback: resets the test session

import { useState } from "react";

// ─── RadarChart ─────────────────────────────────────────────────
// An inline SVG component — no external library needed.
// Pure geometry: equilateral triangle grid + filled data polygon.
//
// WHY SVG instead of canvas or a chart library?
//   SVG is resolution-independent (crisp on Retina/OLED screens),
//   supports CSS variables natively (so dark mode is automatic),
//   and has no dependencies to install or maintain.
//
// GEOMETRY:
//   Three axes 120° apart, starting at -90° (Grammar at top):
//     Grammar   → -90°  (top center)
//     Reading   →  30°  (bottom right)
//     Vocabulary→ 150°  (bottom left)
//   This creates a natural equilateral triangle.
//   Each vertex is at distance R * (accuracy / 100) from center.
//
function RadarChart({ skillAccuracy }) {
  // Chart dimensions — all coordinates fit inside 200×200 viewBox.
  const cx = 100;  // Center X
  const cy = 100;  // Center Y — slightly off-center visually OK
  const R = 62;    // Outer radius — leaves ~38px padding for labels

  // Convert degrees to radians — standard math for sin/cos
  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  // Get the (x, y) point at a given angle and distance from center
  function pt(angleDeg, radius) {
    return {
      x: cx + radius * Math.cos(toRad(angleDeg)),
      y: cy + radius * Math.sin(toRad(angleDeg)),
    };
  }

  // The three skill axes — equilateral triangle angles
  // Grammar at top (-90°), then 120° clockwise for each
  const angles = {
    Grammar:    -90,   // Top
    Reading:     30,   // Bottom-right
    Vocabulary: 150,   // Bottom-left
  };

  // Normalize: skillAccuracy values are 0–100, convert to 0–1
  // Use || 0 as a safety net if a skill wasn't tested (unlikely but safe)
  const gRatio = (skillAccuracy.Grammar    || 0) / 100;
  const rRatio = (skillAccuracy.Reading    || 0) / 100;
  const vRatio = (skillAccuracy.Vocabulary || 0) / 100;

  // The three data polygon vertices (learner's actual shape)
  const gPt = pt(angles.Grammar,    R * gRatio);
  const rPt = pt(angles.Reading,    R * rRatio);
  const vPt = pt(angles.Vocabulary, R * vRatio);

  // SVG polygon points string: "x1,y1 x2,y2 x3,y3"
  const dataPoints = `${gPt.x.toFixed(1)},${gPt.y.toFixed(1)} ${rPt.x.toFixed(1)},${rPt.y.toFixed(1)} ${vPt.x.toFixed(1)},${vPt.y.toFixed(1)}`;

  // Grid levels — 4 concentric triangles at 25%, 50%, 75%, 100%
  // These serve as visual reference guides (like gridlines on a chart)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Outer vertex positions — where skill name labels go (outside the grid)
  const gOuter = pt(angles.Grammar,    R + 16);
  const rOuter = pt(angles.Reading,    R + 16);
  const vOuter = pt(angles.Vocabulary, R + 16);

  // Percentage label positions — just outside each data dot.
  // Math.max(..., 14) ensures labels don't cluster at the center
  // even when accuracy is very low (0–10%).
  const LABEL_PAD = 10; // px beyond the dot
  const gLabelDist = Math.max(R * gRatio + LABEL_PAD, 14);
  const rLabelDist = Math.max(R * rRatio + LABEL_PAD, 14);
  const vLabelDist = Math.max(R * vRatio + LABEL_PAD, 14);
  const gLabelPt = pt(angles.Grammar,    gLabelDist);
  const rLabelPt = pt(angles.Reading,    rLabelDist);
  const vLabelPt = pt(angles.Vocabulary, vLabelDist);

  return (
    // viewBox makes the chart scale to any container width.
    // max-width + margin: auto centers it on wide screens.
    <svg
      viewBox="0 0 200 200"
      style={{ width: "100%", maxWidth: "240px", display: "block", margin: "0 auto" }}
      aria-label="Skill radar chart showing Grammar, Reading, and Vocabulary accuracy"
      role="img"
    >
      {/* ── Grid triangles (reference lines) ── */}
      {gridLevels.map(level => {
        const g = pt(angles.Grammar,    R * level);
        const r = pt(angles.Reading,    R * level);
        const v = pt(angles.Vocabulary, R * level);
        return (
          <polygon
            key={level}
            points={`${g.x.toFixed(1)},${g.y.toFixed(1)} ${r.x.toFixed(1)},${r.y.toFixed(1)} ${v.x.toFixed(1)},${v.y.toFixed(1)}`}
            fill="none"
            stroke="var(--radar-grid)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* ── Axis lines from center to each outer vertex ── */}
      {Object.values(angles).map(angle => {
        const outer = pt(angle, R);
        return (
          <line
            key={angle}
            x1={cx} y1={cy}
            x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
            stroke="var(--radar-grid)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* ── Filled data polygon (the learner's actual shape) ── */}
      {/* fillOpacity is intentionally low so grid shows through */}
      <polygon
        points={dataPoints}
        fill="var(--teal)"
        fillOpacity="0.13"
        stroke="var(--teal)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ── Coloured dots at each skill vertex ── */}
      {/* Colors: Grammar=teal (brand), Vocab=amber (weak link), Reading=green */}
      <circle cx={gPt.x.toFixed(1)} cy={gPt.y.toFixed(1)} r="3.5" fill="var(--teal)" />
      <circle cx={vPt.x.toFixed(1)} cy={vPt.y.toFixed(1)} r="3.5" fill="var(--developing)" />
      <circle cx={rPt.x.toFixed(1)} cy={rPt.y.toFixed(1)} r="3.5" fill="var(--strength)" />

      {/* ── Skill name labels at outer vertices ── */}
      {/* fontSize="9" keeps labels legible without crowding on mobile */}
      <text x={gOuter.x.toFixed(1)} y={gOuter.y.toFixed(1)}
        textAnchor="middle" dominantBaseline="auto"
        fill="var(--navy)" fontSize="9" fontFamily="var(--font-sans)" fontWeight="500">
        Grammar
      </text>
      <text x={vOuter.x.toFixed(1)} y={vOuter.y.toFixed(1)}
        textAnchor="end" dominantBaseline="middle"
        fill="var(--navy)" fontSize="9" fontFamily="var(--font-sans)" fontWeight="500">
        Vocab
      </text>
      <text x={rOuter.x.toFixed(1)} y={rOuter.y.toFixed(1)}
        textAnchor="start" dominantBaseline="middle"
        fill="var(--navy)" fontSize="9" fontFamily="var(--font-sans)" fontWeight="500">
        Reading
      </text>

      {/* ── Percentage labels near each data dot ── */}
      {/* dominantBaseline centers the text vertically on its y-coordinate */}
      <text x={gLabelPt.x.toFixed(1)} y={(gLabelPt.y - 2).toFixed(1)}
        textAnchor="middle" dominantBaseline="auto"
        fill="var(--teal)" fontSize="8" fontFamily="var(--font-sans)" fontWeight="500">
        {skillAccuracy.Grammar || 0}%
      </text>
      <text x={vLabelPt.x.toFixed(1)} y={vLabelPt.y.toFixed(1)}
        textAnchor="end" dominantBaseline="middle"
        fill="var(--developing)" fontSize="8" fontFamily="var(--font-sans)" fontWeight="500">
        {skillAccuracy.Vocabulary || 0}%
      </text>
      <text x={rLabelPt.x.toFixed(1)} y={rLabelPt.y.toFixed(1)}
        textAnchor="start" dominantBaseline="middle"
        fill="var(--strength)" fontSize="8" fontFamily="var(--font-sans)" fontWeight="500">
        {skillAccuracy.Reading || 0}%
      </text>
    </svg>
  );
}

// ─── ClockIcon ───────────────────────────────────────────────────
// A simple SVG clock face — no emoji, no external icon library.
// WHY: The brief requires SVG icons. Emojis render inconsistently
// across platforms and can't be styled with CSS.
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="var(--slate)" strokeWidth="1.5" strokeLinecap="round"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── EnglishDNA (main export) ────────────────────────────────────
export function EnglishDNA({
  cefrLevel,
  ieltsRange,
  theta,
  score,
  skillAccuracy,
  subSkillAccuracy,
  weakLink,
  unlockCards,
  goalType,
  lang,
  t,
  onReviewWrongAnswers,
  onRetake,
}) {
  // Track which unlock card is "highlighted" (tapped/clicked).
  // null means none are active. This is purely cosmetic emphasis —
  // clicking a card doesn't navigate anywhere.
  const [activeCard, setActiveCard] = useState(null);

  // Toggle: click active card → deselect. Click different card → select.
  function handleCardClick(i) {
    setActiveCard(prev => (prev === i ? null : i));
  }

  // Safe fallback: if cefrDNA copy doesn't exist for this level, use generic text
  const dnaStrings = t.cefrDNA?.[cefrLevel] || {
    headline: `Your English is at ${cefrLevel}`,
    capability: `You are working at the ${cefrLevel} level.`,
  };

  // Timeline copy — keyed by CEFR level
  const timelineStrings = t.honestTimeline?.[cefrLevel] || {
    headline: "Keep practising consistently",
    body: "Consistent daily practice compounds quickly.",
  };

  return (
    <section className="dna-section" aria-label="English DNA — Your results fingerprint">

      {/* ────────────────────────────────────────────────────────
          SECTION 1: Header — CEFR badge + headline + capability
          ──────────────────────────────────────────────────────── */}
      <div className="dna-header">
        {/* Large circular badge showing CEFR level */}
        <div className="dna-badge" aria-label={`CEFR Level ${cefrLevel}`}>
          {cefrLevel}
        </div>
        <div className="dna-header-text">
          {/* Headline: what they CAN do, not what they lack */}
          <h2 className="dna-headline">{dnaStrings.headline}</h2>
          {/* 2-sentence capability description */}
          <p className="dna-capability">{dnaStrings.capability}</p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 2: Radar chart — Your English DNA shape
          ──────────────────────────────────────────────────────── */}
      <div className="dna-radar-section">
        <p className="dna-section-label">Your English DNA</p>
        {/* The SVG chart scales to fit any screen width */}
        <RadarChart skillAccuracy={skillAccuracy} />
        <p className="dna-radar-caption">{t.radarCaption}</p>
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 3: Divider
          ──────────────────────────────────────────────────────── */}
      <div className="dna-divider" role="separator" />

      {/* ────────────────────────────────────────────────────────
          SECTION 4: Weak link card
          Shows the SINGLE most impactful gap with IELTS context.
          Framed as opportunity: "your fastest route to B2 runs
          through here" — never as failure.
          ──────────────────────────────────────────────────────── */}
      {weakLink && (
        <div className="dna-weak-link-section">
          <p className="dna-section-label">{t.yourWeakLink}</p>

          <div className="dna-weak-card">
            {/* Pill tag — sub-skill name + accuracy % */}
            {/* amber/warning colour because this is the focus area */}
            <span className="dna-weak-tag">
              {weakLink.subSkill} · {weakLink.accuracy}%
            </span>

            <h3 className="dna-weak-title">{weakLink.subSkill}</h3>

            {/* WHY this gap costs IELTS points — authored copy from i18n */}
            <p className="dna-weak-body">{weakLink.ieltsImpact}</p>

            {/* The cost expressed as IELTS band impact */}
            <div className="dna-band-cost">
              {/* The forward-looking framing: what they gain, not what they lose */}
              Fixing this is worth {weakLink.bandCost} on IELTS.
              Your fastest route forward runs through here.
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          SECTION 5: What you unlock when you fix these
          3 cards, one per top weakness, showing the GAIN not the gap.
          Cards are clickable for emphasis — they don't navigate.
          ──────────────────────────────────────────────────────── */}
      {unlockCards && unlockCards.length > 0 && (
        <div className="dna-unlock-section">
          <p className="dna-section-label">{t.whatYouUnlock}</p>

          {/* CSS grid: 3 columns on wide screens, 1 column on mobile */}
          <div className="dna-unlock-grid">
            {unlockCards.map((card, i) => (
              // Using <button> so it's keyboard-navigable (accessibility)
              // The active card gets a teal border accent
              <button
                key={i}
                className={`dna-unlock-card ${activeCard === i ? "dna-unlock-card--active" : ""}`}
                onClick={() => handleCardClick(i)}
                // Minimum 44×44px tap target is enforced via CSS
                aria-pressed={activeCard === i}
              >
                <div className="dna-unlock-subskill">{card.subSkill}</div>
                {/* 'fix' completes: "Fix this and [fix]" */}
                <div className="dna-unlock-fix">
                  Fix this and {card.fix}
                </div>
                {/* The approximate IELTS band reward */}
                <div className="dna-unlock-reward">{card.reward}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          SECTION 6: Divider
          ──────────────────────────────────────────────────────── */}
      <div className="dna-divider" role="separator" />

      {/* ────────────────────────────────────────────────────────
          SECTION 7: Honest timeline
          No fake precision. No daily schedules. Just a realistic
          window based on where this learner actually is.
          ──────────────────────────────────────────────────────── */}
      <div className="dna-timeline">
        <ClockIcon />
        <div className="dna-timeline-text">
          <p className="dna-timeline-label">{t.honestTimelineLabel}</p>
          <p className="dna-timeline-headline">{timelineStrings.headline}</p>
          <p className="dna-timeline-body">{timelineStrings.body}</p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 8: Action buttons
          "Review my wrong answers" scrolls down to WrongAnswerBreakdown.
          "Retake the test" resets the entire CAT session.
          ──────────────────────────────────────────────────────── */}
      <div className="dna-actions">
        <button
          className="dna-action-primary"
          onClick={onReviewWrongAnswers}
        >
          {t.reviewWrongAnswers}
        </button>
        <button
          className="dna-action-secondary"
          onClick={onRetake}
        >
          {t.retakeTest}
        </button>
      </div>

    </section>
  );
}
