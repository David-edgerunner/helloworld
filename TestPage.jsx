// ═══════════════════════════════════════════════════════════════
// TEST SESSION PAGE — The actual CAT question delivery
// ═══════════════════════════════════════════════════════════════
//
// Emotional intention (Website Bible §5.2):
//   "Flow state — focused, not anxious"
//
// Anxiety-reducing design decisions (§2.4):
//   - No timer visible (session times out at 45 min inactivity, never shown)
//   - No question counter ("Q 1 of 40") — replaced by soft progress bar
//   - No CEFR difficulty labels shown during test
//   - Persistent calm phrase: "Take your time. There's no rush."
//   - Single question per screen, no sidebar, no navigation
//   - Large tap targets (44×44px minimum) for mobile
//
// Keyboard navigation:
//   A/B/C/D keys → select option
//   Enter → confirm answer
//
// After confirmation:
//   - Correct answer shown in green
//   - Learner's wrong choice shown dimmed (neutral, no red X)
//   - Brief pause (600ms) then auto-advance to next item

export function TestPage({ t, item, selectedOption, confirmed, onSelect, onConfirm, progress }) {
  if (!item) return null;
  const letters = ["A", "B", "C", "D"];
  
  return (
    <div className="test-page">
      <div className="test-progress-bar">
        <div className="test-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="test-content">
        <div className="question-stem" aria-live="polite" aria-atomic="true">{item.stem}</div>
        <div className="options" role="radiogroup" aria-label="Answer options">
          {item.options.map((opt, i) => {
            let cls = "option-btn";
            if (selectedOption === i) cls += " selected";
            if (confirmed) {
              cls += " confirmed";
              if (i === item.correct_choice) cls += " correct is-correct";
              else if (i === selectedOption && selectedOption !== item.correct_choice) cls += " incorrect";
            }
            return (
              <button
                key={i}
                role="radio"
                aria-checked={selectedOption === i}
                className={cls}
                onClick={() => !confirmed && onSelect(i)}
                aria-label={`Option ${letters[i]}: ${opt}`}
              >
                <span className="option-letter">{letters[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        <button
          className={`confirm-btn ${selectedOption !== null && !confirmed ? 'active' : ''}`}
          onClick={onConfirm}
          aria-disabled={selectedOption === null || confirmed}
        >
          {t.confirmBtn}
        </button>
        <p className="calm-phrase" aria-hidden="true">{t.calmPhrase}</p>
      </div>
    </div>
  );
}

