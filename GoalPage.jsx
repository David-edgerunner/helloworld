// ═══════════════════════════════════════════════════════════════
// GOAL QUESTION PAGE — Pre-test intent capture
// ═══════════════════════════════════════════════════════════════
//
// From Website Bible §4.1:
//   "A B1 learner preparing for IELTS and a B1 learner who wants to
//    enjoy English films need completely different roadmaps."
//
// Emotional intention: Agency — "This is about my life, not a test"
//
// Design rules (§4.3):
//   - Large card per option, tap/click to select (not dropdown)
//   - "Skip" always visible — defaults to goal type E
//   - Never uses the word "goal" or "target"
//   - Answer stored client-side only, never tracked
//
// Goal types:
//   A = IELTS / exam prep
//   B = Academic / university
//   C = Professional / work
//   D = Media / culture
//   E = General / curious

import { useState } from "react";

export function GoalPage({ t, onSelect, onSkip }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="goal-page">
      <h1>{t.goalTitle}</h1>
      <p className="subtitle">{t.goalSubtitle}</p>
      <div className="goal-cards">
        {["A", "B", "C", "D", "E"].map(key => (
          <div
            className={`goal-card ${selected === key ? 'selected' : ''}`}
            key={key}
            onClick={() => {
              setSelected(key);
              setTimeout(() => onSelect(key), 400);
            }}
          >
            <span className="icon">{t.goalIcons[key]}</span>
            <span className="label">{t.goals[key]}</span>
          </div>
        ))}
      </div>
      <button className="goal-skip" onClick={onSkip}>{t.goalSkip}</button>
    </div>
  );
}

