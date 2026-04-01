import React, { Suspense, useEffect, useMemo } from "react";
import { i18n } from "./i18n.js";
import { TestSessionProvider, useTestSession, PAGES } from "./TestSessionContext.jsx";
import "./index.css";

// ─── Code Splitting & Lazy Loading ───
// These heavy pages are only loaded when required, rapidly speeding up initial load time.
const LandingPage = React.lazy(() => import("./LandingPage.jsx").then(m => ({ default: m.LandingPage })));
const GoalPage = React.lazy(() => import("./GoalPage.jsx").then(m => ({ default: m.GoalPage })));
const IntroPage = React.lazy(() => import("./IntroPage.jsx").then(m => ({ default: m.IntroPage })));
const TestPage = React.lazy(() => import("./TestPage.jsx").then(m => ({ default: m.TestPage })));
const ProcessingPage = React.lazy(() => import("./ProcessingPage.jsx").then(m => ({ default: m.ProcessingPage })));
const ResultsPage = React.lazy(() => import("./ResultsPage.jsx").then(m => ({ default: m.ResultsPage })));

function AppContent() {
  const {
    page, lang, setLang, goalType, setGoalType,
    testLength, setTestLength, fadeClass,
    responses, currentItem, se, selectedOption, setSelectedOption,
    confirmed, results, startTest, handleConfirm, navigateTo, resetSession
  } = useTestSession();

  const t = i18n[lang];

  // Progress bar percentage — soft fill, no numbers shown
  const progressPct = useMemo(() => {
    const max = testLength || 40;
    const min = max === 20 ? 16 : 30;
    const count = responses.length;
    const seThreshold = max === 20 ? 0.45 : 0.28;
    if (count < min) return (count / max) * 100;
    const sePct = Math.max(0, 1 - se / seThreshold);
    return Math.min(95, (count / max) * 100 + sePct * 5);
  }, [responses.length, se, testLength]);

  // Auto-detect Vietnamese browser locale
  useEffect(() => {
    if (navigator.language?.startsWith("vi")) setLang("vi");
  }, [setLang]);

  // Auto-advance from Processing → Results after 4 seconds
  useEffect(() => {
    if (page === PAGES.PROCESSING) {
      const timer = setTimeout(() => navigateTo(PAGES.RESULTS), 4000);
      return () => clearTimeout(timer);
    }
  }, [page, navigateTo]);

  // Keyboard navigation during test
  useEffect(() => {
    if (page !== PAGES.TEST) return;
    const handler = (e) => {
      if (confirmed) return;
      const keyMap = { a: 0, b: 1, c: 2, d: 3 };
      if (e.key.toLowerCase() in keyMap) {
        setSelectedOption(keyMap[e.key.toLowerCase()]);
      }
      if (e.key === "Enter" && selectedOption !== null) {
        handleConfirm();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [page, confirmed, selectedOption, handleConfirm, setSelectedOption]);

  return (
    <div className="app">
      {/* Language toggle */}
      <button className="lang-toggle" onClick={() => setLang(lang === "en" ? "vi" : "en")}>
        {t.langToggle}
      </button>

      <div className={fadeClass}>
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          {page === PAGES.LANDING && (
            <LandingPage t={t} onStart={() => navigateTo(PAGES.GOAL)} />
          )}

          {page === PAGES.GOAL && (
            <GoalPage
              t={t}
              onSelect={(g) => { setGoalType(g); navigateTo(PAGES.INTRO); }}
              onSkip={() => { setGoalType("E"); navigateTo(PAGES.INTRO); }}
            />
          )}

          {page === PAGES.INTRO && (
            <IntroPage t={t} onStart={startTest} onSelectLength={setTestLength} />
          )}

          {page === PAGES.TEST && (
            <TestPage
              t={t}
              item={currentItem}
              selectedOption={selectedOption}
              confirmed={confirmed}
              onSelect={setSelectedOption}
              onConfirm={handleConfirm}
              progress={progressPct}
            />
          )}

          {page === PAGES.PROCESSING && (
            <ProcessingPage t={t} />
          )}

          {page === PAGES.RESULTS && results && (
            <ResultsPage
              t={t}
              results={results}
              goalType={goalType}
              lang={lang}
              onRetake={resetSession}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  return (
    <TestSessionProvider>
      <AppContent />
    </TestSessionProvider>
  );
}
