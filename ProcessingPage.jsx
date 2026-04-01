// ═══════════════════════════════════════════════════════════════
// PROCESSING SCREEN — Warm transition between test and results
// ═══════════════════════════════════════════════════════════════
//
// Emotional intention (Website Bible §5.2):
//   "Anticipation — 'Something good is coming'"
//
// Key design moment:
//   "Building your personal English map." — NOT "Loading..."
//
// Design decisions:
//   - Breathing orb animation (not a loading spinner)
//   - Rotating warm messages: "Building...", "Analysing...", "Creating..."
//   - Minimum 4 seconds display (gives the result emotional weight)
//   - Auto-advances to Results page

import { useState, useEffect } from "react";

export function ProcessingPage({ t }) {
  const [lineIdx, setLineIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setLineIdx(prev => (prev + 1) % t.processingLines.length);
    }, 1300);
    return () => clearInterval(timer);
  }, [t.processingLines.length]);

  return (
    <div className="processing-page">
      <div className="processing-orb"></div>
      <p className="processing-text">{t.processingLines[lineIdx]}</p>
    </div>
  );
}

