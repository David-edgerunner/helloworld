// ═══════════════════════════════════════════════════════════════
// RESULTS PAGE — The highest-value screen in the product
// ═══════════════════════════════════════════════════════════════
//
// From Website Bible §8.1:
//   "It must do three things simultaneously: deliver an emotionally safe
//    result, make the diagnosis genuinely useful, and create immediate
//    forward momentum."
//
// The 60-Second Rule (§8.1):
//   "A learner who lands here and leaves within 60 seconds should have
//    received: what their level is, what they're good at, and what to do next."
//
// Layout (top to bottom):
//   1. Hero zone  — CEFR badge, capability description, goal statement
//   2. Scores     — 0-100 score bar, IELTS estimate, skill radar
//   3. Diagnosis  — Sub-skill heatmap, wrong-answer review (collapsible)
//   4. Roadmap    — Priority skills, 4-week study plan, resources
//   5. Actions    — Share, retake
//
// ALL features are unlocked — no gates, no login required.
//
// Score formula: Score = round(((θ + 1.5) / 3.5) × 100)
// CEFR thresholds: A2=0-25, B1=26-50, B2=51-75, C1=76-100
//
// Copy rules (§2.3 — Motivation Cliff Prevention):
//   - Result named after what learner HAS achieved, not what they haven't
//   - Gap presented as small and crossable (specific 2-3 sub-skills)
//   - Roadmap shown immediately after level (disappointment → agency)
//   - Never: "You only scored...", "You missed...", "You failed to..."

import { useState, useEffect, useRef } from "react";
import { VI_EXPLANATIONS } from "./viExplanations.js";
// RESOURCES removed — the roadmap section that used it has been replaced
// by EnglishDNA + WrongAnswerBreakdown (see below).
import AIPracticePanel from "./AIPracticePanel";
import { EnglishDNA } from "./EnglishDNA";
import { WrongAnswerBreakdown } from "./WrongAnswerBreakdown";
import { computeDiagnosis } from "./diagnosticEngine.js";

export function ResultsPage({ t, results, goalType, lang, onRetake }) {
  const { score, cefr, ielts, diagnosis } = results;
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  const [scoreAnimated, setScoreAnimated] = useState(0);

  // ─── Extended diagnosis for EnglishDNA + WrongAnswerBreakdown ───
  // computeDiagnosis takes the existing diagnosis (from Diagnostic.analyze)
  // and the i18n strings, and builds the richer shape these new components need.
  // We call it here so both child components get the same data object.
  // useMemo would be ideal but useState+computed-once is fine here since
  // results is immutable after the test ends.
  const extendedDiagnosis = computeDiagnosis(diagnosis, t);

  // ─── Ref for scrolling to WrongAnswerBreakdown ──────────────────
  // EnglishDNA has a "Review my wrong answers" button that scrolls
  // to this panel. We use a ref (a direct DOM reference) instead of
  // a state variable because scrolling is a side effect, not a
  // render concern.
  const wabRef = useRef(null);

  function handleReviewWrongAnswers() {
    // scrollIntoView with 'smooth' behaviour animates the scroll
    // instead of jumping — better UX, especially on mobile.
    wabRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 1500;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScoreAnimated(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const goalStatement = t.goalStatements[goalType]?.[cefr] || t.goalStatements.E[cefr];

  const skillColors = {
    Grammar: "#0D7377",
    Vocabulary: "#2D8F70",
    Reading: "#3B7DD8",
  };

  const statusBadgeClass = (status) => {
    if (status === "Strength") return "badge-strength";
    if (status === "Developing") return "badge-developing";
    return "badge-focus";
  };

  const statusLabel = (status) => {
    if (status === "Strength") return t.strength;
    if (status === "Developing") return t.developing;
    return t.focusArea;
  };

  const handleShare = async () => {
    const text = `${t.siteTitle}: ${cefr} (${t.cefrLabels[cefr]}) — ${t.score}: ${score}/100 — IELTS ${t.band} ${ielts}`;
    if (navigator.share) {
      try { await navigator.share({ title: t.siteTitle, text }); } catch { }
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  return (
    <div className="results-page">
      <div className="results-inner">
        {/* Hero */}
        <div className="results-hero">
          <div className="cefr-badge">{cefr}</div>
          <div className="cefr-label">{t.cefrLabels[cefr]}</div>
          <p className="cefr-description">{t.cefrDescriptions[cefr]}</p>
          <div className="goal-statement">{goalStatement}</div>
          <div className="disclaimer-inline">{t.disclaimer}</div>
        </div>

        {/* Score Cards */}
        <div className="score-section">
          <div className="score-card">
            <div className="label">{t.score}</div>
            <div className="value">{scoreAnimated}</div>
            <div className="sub">/ 100</div>
          </div>
          <div className="score-card">
            <div className="label">{t.ieltsEstimate}</div>
            <div className="value">{ielts}</div>
            <div className="sub">{t.band}</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="score-bar-wrap">
          <div className="score-bar-label">
            <span>A2</span>
            <span>B1</span>
            <span>B2</span>
            <span>C1</span>
          </div>
          <div className="score-bar">
            <div className="score-bar-fill" style={{ width: `${score}%` }}></div>
          </div>
          <div className="score-bar-markers">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="skill-section">
          <div className="section-title">{t.skillBreakdown}</div>
          {["Grammar", "Vocabulary", "Reading"].map(skill => {
            const pct = diagnosis.skillAccuracy[skill] || 0;
            const color = skillColors[skill];
            return (
              <div className="skill-bar-row" key={skill}>
                <div className="skill-bar-name">{t[skill.toLowerCase()]}</div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${pct}%`, background: color }}></div>
                </div>
                <div className="skill-bar-pct" style={{ color }}>{pct}%</div>
              </div>
            );
          })}

          {/* Sub-skill heatmap */}
          <div className="subskill-grid" style={{ marginTop: 20 }}>
            {Object.entries(diagnosis.subSkillAnalysis)
              .sort((a, b) => a[1].accuracy - b[1].accuracy)
              .map(([name, data]) => (
                <div className="subskill-row" key={name}>
                  <span className="subskill-name">{name}</span>
                  <span className={`subskill-badge ${statusBadgeClass(data.status)}`}>
                    {statusLabel(data.status)}
                  </span>
                  <span className="subskill-pct">{data.accuracy}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Diagnosis trigger button */}
        <div className="diagnosis-trigger-wrap">
          <button className="diagnosis-trigger-btn" onClick={() => setDiagnosisOpen(true)}>
            <span className="dtb-icon">🔍</span>
            <span>{t.diagnosisTitle}</span>
            <span className="dtb-arrow">→</span>
          </button>
          <p className="dtb-sub">{diagnosis.totalCorrect} {t.correct} {t.of} {diagnosis.totalItems} {t.questions}</p>
        </div>

        {/* Diagnosis modal overlay */}
        {diagnosisOpen && (
          <div className="diagnosis-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDiagnosisOpen(false); }}>
            <div className="diagnosis-modal">
              <div className="diagnosis-modal-header">
                <button className="diagnosis-back-btn" onClick={() => setDiagnosisOpen(false)}>
                  ← {lang === "vi" ? "Quay lại" : "Back"}
                </button>
                <h2 className="diagnosis-modal-title">{t.diagnosisTitle}</h2>
              </div>
              <div className="diagnosis-modal-body">
                <div className="disclaimer-box" style={{ marginBottom: 20 }}>
                  <span className="disclaimer-icon">ℹ️</span>
                  <p>{t.disclaimer}</p>
                </div>
                {Object.entries(diagnosis.wrongBySubSkill)
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([subSkill, items]) => (
                    <div className="wrong-answer-group" key={subSkill}>
                      <h4>{subSkill} ({items.length})</h4>
                      {items.map((item, idx) => (
                        <div className="wrong-answer-item" key={idx}>
                          <div className="wa-stem">{item.stem}</div>
                          <div className="wa-choices">
                            <div className="wa-choice learner-wrong">
                              <span className="wa-label">{t.youChose}</span>
                              <span>{item.options[item.learner_choice]}</span>
                            </div>
                            <div className="wa-choice correct-answer">
                              <span className="wa-label">{t.theAnswer}</span>
                              <span>{item.options[item.correct_choice]}</span>
                            </div>
                          </div>
                          <div className="wa-explanation">{lang === "vi" && VI_EXPLANATIONS[item.item_id] ? VI_EXPLANATIONS[item.item_id] : item.explanation_text}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                {diagnosis.wrongAnswers.length === 0 && (
                  <p style={{ color: "var(--strength)", fontWeight: 500, textAlign: "center", padding: 20 }}>
                    {lang === "vi" ? "Hoàn hảo! Bạn đã trả lời đúng tất cả các câu hỏi." : "Perfect! You answered every question correctly."}
                  </p>
                )}
                {diagnosis.wrongAnswers.length > 0 && (
                  <AIPracticePanel results={results} t={t} goalType={goalType} lang={lang} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── EnglishDNA — Results fingerprint card ── */}
        {/* This replaces the old roadmap/4-week study plan section. */}
        {/* It renders: CEFR header, radar chart, weak link, unlock cards, timeline, action buttons. */}
        <EnglishDNA
          cefrLevel={cefr}
          ieltsRange={ielts}
          theta={results.theta}
          score={score}
          skillAccuracy={extendedDiagnosis.skillAccuracy}
          subSkillAccuracy={extendedDiagnosis.subSkillAccuracy}
          weakLink={extendedDiagnosis.weakLink}
          unlockCards={extendedDiagnosis.unlockCards}
          goalType={goalType}
          lang={lang}
          t={t}
          onReviewWrongAnswers={handleReviewWrongAnswers}
          onRetake={onRetake}
        />

        {/* ── WrongAnswerBreakdown — Diagnostic intelligence panel ── */}
        {/* The ref is attached to the wrapper div so EnglishDNA's */}
        {/* "Review my wrong answers" button can scroll here smoothly. */}
        <div ref={wabRef}>
          <WrongAnswerBreakdown
            wrongAnswers={extendedDiagnosis.wrongAnswers}
            lang={lang}
            subSkillAccuracy={extendedDiagnosis.subSkillAccuracy}
            totalAnswered={diagnosis.totalItems}
            t={t}
          />
        </div>

        {/* Actions */}
        <div className="actions-row">
          <button className="action-btn secondary" onClick={handleShare}>{t.shareBtn}</button>
          <button className="action-btn primary" onClick={onRetake}>{t.retakeBtn}</button>
        </div>
        <p className="retake-note">{t.retake}</p>
      </div>
    </div>
  );
}
