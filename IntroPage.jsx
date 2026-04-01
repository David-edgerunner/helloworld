// ═══════════════════════════════════════════════════════════════
// TEST INTRODUCTION PAGE — Instructions + test length selection
// ═══════════════════════════════════════════════════════════════
//
// Emotional intention (Website Bible §5.2):
//   "Calm confidence — 'I understand what's happening'"
//
// Key design moment:
//   Explicit explanation of adaptive difficulty: "Hard = good."
//
// This page has two sections:
//   1. Intro points — what to expect (no timer, adaptive, etc.)
//   2. Test length selection — Quick Check (20) vs Deep Dive (40)
//
// The test length choice affects:
//   - CAT stopping rule min items (16 vs 20)
//   - SE threshold (0.45 vs 0.40)
//   - Maximum items (20 vs 40)
//   - Progress bar calculation

import { useState } from "react";

export function IntroPage({ t, onStart, onSelectLength }) {
  const [selectedLength, setSelectedLength] = useState(null);

  const handleStart = () => {
    onSelectLength(selectedLength || 40);
    onStart();
  };

  return (
    <div className="intro-page">
      <div className="intro-card">
        <h1>{t.introTitle}</h1>
        <ul className="intro-points">
          {t.introPoints.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        <div className="test-length-section">
          <h2 className="test-length-title">{t.testLengthTitle}</h2>
          <p className="test-length-sub">{t.testLengthSub}</p>
          <div className="test-length-cards">
            <div
              className={`test-length-card ${selectedLength === 20 ? 'selected' : ''}`}
              onClick={() => setSelectedLength(20)}
            >
              <div className="tlc-icon">⚡</div>
              <div className="tlc-name">{t.testQuick}</div>
              <div className="tlc-desc">{t.testQuickDesc}</div>
              <div className="tlc-note">{t.testQuickNote}</div>
            </div>
            <div
              className={`test-length-card recommended ${selectedLength === 40 ? 'selected' : ''}`}
              onClick={() => setSelectedLength(40)}
            >
              <div className="tlc-recommended-badge">{t.testFullNote.includes('Khuyên') ? 'Khuyên dùng' : 'Recommended'}</div>
              <div className="tlc-icon">🔬</div>
              <div className="tlc-name">{t.testFull}</div>
              <div className="tlc-desc">{t.testFullDesc}</div>
              <div className="tlc-note">{t.testFullNote}</div>
            </div>
          </div>
        </div>

        <button
          className={`intro-start ${selectedLength ? 'active' : 'dimmed'}`}
          onClick={handleStart}
          disabled={!selectedLength}
        >
          {t.introStart}
        </button>
      </div>
    </div>
  );
}

