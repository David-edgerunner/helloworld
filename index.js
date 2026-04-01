// ═══════════════════════════════════════════════════════════════
// PAGES — Barrel export for all page-level components
// ═══════════════════════════════════════════════════════════════
//
// Each page corresponds to a step in the emotional arc (§5.2):
//   LandingPage    → Curiosity ("I want to know")
//   GoalPage       → Agency ("This is about my life")
//   IntroPage      → Confidence ("I understand what's happening")
//   TestPage       → Flow state (focused, not anxious)
//   ProcessingPage → Anticipation ("Something good is coming")
//   ResultsPage    → Pride + Direction (capability first, then path forward)
//
// All pages receive `t` (translations) as a prop from App.jsx.
// Pages are pure presentational — state management lives in App.jsx.

export { LandingPage } from "./LandingPage.jsx";
export { GoalPage } from "./GoalPage.jsx";
export { IntroPage } from "./IntroPage.jsx";
export { TestPage } from "./TestPage.jsx";
export { ProcessingPage } from "./ProcessingPage.jsx";
export { ResultsPage } from "./ResultsPage.jsx";
