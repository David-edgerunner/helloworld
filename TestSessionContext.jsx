import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IRT } from './irt.js';
import { Diagnostic } from './diagnostic.js';
import { ITEM_BANK } from './itemBank.js';

export const PAGES = {
  LANDING: 0,
  GOAL: 1,
  INTRO: 2,
  TEST: 3,
  PROCESSING: 4,
  RESULTS: 5,
};

const TestSessionContext = createContext(null);

export function useTestSession() {
  return useContext(TestSessionContext);
}

export function TestSessionProvider({ children }) {
  // Load initial state from sessionStorage
  const [session] = useState(() => {
    try {
      const saved = sessionStorage.getItem('cat_test_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [page, setPage] = useState(session?.page ?? PAGES.LANDING);
  const [lang, setLang] = useState(session?.lang ?? "en");
  const [goalType, setGoalType] = useState(session?.goalType ?? "E");
  const [testLength, setTestLength] = useState(session?.testLength ?? null);
  const [fadeClass, setFadeClass] = useState("fade-in");

  const [responses, setResponses] = useState(session?.responses ?? []);
  const [currentItem, setCurrentItem] = useState(session?.currentItem ?? null);
  const [theta, setTheta] = useState(session?.theta ?? 0);
  const [se, setSe] = useState(session?.se ?? 2.0);
  const [usedIds, setUsedIds] = useState(new Set(session?.usedIds ?? []));
  const [selectedOption, setSelectedOption] = useState(session?.selectedOption ?? null);
  const [confirmed, setConfirmed] = useState(session?.confirmed ?? false);
  const [results, setResults] = useState(session?.results ?? null);

  // Sync state to sessionStorage whenever important fields change
  useEffect(() => {
    const dataToSave = {
      page, lang, goalType, testLength,
      responses, currentItem, theta, se,
      usedIds: Array.from(usedIds),
      selectedOption, confirmed, results
    };
    sessionStorage.setItem('cat_test_session', JSON.stringify(dataToSave));
  }, [page, lang, goalType, testLength, responses, currentItem, theta, se, usedIds, selectedOption, confirmed, results]);

  const navigateTo = useCallback((newPage) => {
    setFadeClass("fade-out");
    setTimeout(() => {
      setPage(newPage);
      setFadeClass("fade-in");
      window.scrollTo(0, 0);
    }, 300);
  }, []);

  const startTest = useCallback(() => {
    const b1Items = ITEM_BANK.filter(i => i.cefr_difficulty === "B1");
    if (b1Items.length === 0) return;
    const firstItem = b1Items[Math.floor(Math.random() * b1Items.length)];
    setCurrentItem(firstItem);
    setUsedIds(new Set([firstItem.item_id]));
    setResponses([]);
    setTheta(0);
    setSe(2.0);
    setSelectedOption(null);
    setConfirmed(false);
    navigateTo(PAGES.TEST);
  }, [navigateTo]);

  const resetSession = useCallback(() => {
    setResults(null);
    setTestLength(null);
    setCurrentItem(null);
    setResponses([]);
    setTheta(0);
    setSe(2.0);
    setUsedIds(new Set());
    setSelectedOption(null);
    setConfirmed(false);
    navigateTo(PAGES.LANDING);
    sessionStorage.removeItem('cat_test_session');
  }, [navigateTo]);

  const handleConfirm = useCallback(() => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);

    const item = currentItem;
    const isCorrect = selectedOption === item.correct_choice;

    const newResponse = {
      item_id: item.item_id, stem: item.stem, options: item.options,
      correct_choice: item.correct_choice, learner_choice: selectedOption,
      correct: isCorrect, skill: item.skill, sub_skill: item.sub_skill,
      cefr_difficulty: item.cefr_difficulty, a: item.irt_a_param,
      b: item.irt_b_param, c: item.irt_c_param,
      explanation_text: item.explanation_text, distractor_traps: item.distractor_traps,
    };

    const newResponses = [...responses, newResponse];
    const { theta: newTheta, se: newSe } = IRT.estimateTheta(newResponses);
    setResponses(newResponses);
    setTheta(newTheta);
    setSe(newSe);

    setTimeout(() => {
      if (IRT.shouldStop(newResponses, newSe, testLength || 40)) {
        const score = IRT.thetaToScore(newTheta);
        const cefr = IRT.thetaToCEFR(newTheta);
        const ielts = IRT.cefrToIELTS(cefr, score);
        const diagnosis = Diagnostic.analyze(newResponses, goalType);
        setResults({ theta: newTheta, se: newSe, score, cefr, ielts, diagnosis });
        navigateTo(PAGES.PROCESSING);
      } else {
        const newUsed = new Set([...usedIds, item.item_id]);
        setUsedIds(newUsed);
        const nextItem = IRT.selectNext(newTheta, newUsed, newResponses, ITEM_BANK, testLength || 40);
        if (nextItem) {
          setCurrentItem(nextItem);
          setSelectedOption(null);
          setConfirmed(false);
        } else {
          const score = IRT.thetaToScore(newTheta);
          const cefr = IRT.thetaToCEFR(newTheta);
          const ielts = IRT.cefrToIELTS(cefr, score);
          const diagnosis = Diagnostic.analyze(newResponses, goalType);
          setResults({ theta: newTheta, se: newSe, score, cefr, ielts, diagnosis });
          navigateTo(PAGES.PROCESSING);
        }
      }
    }, 600);
  }, [selectedOption, confirmed, currentItem, responses, usedIds, goalType, testLength, navigateTo]);

  const value = {
    page, lang, setLang, goalType, setGoalType,
    testLength, setTestLength, fadeClass,
    responses, currentItem, theta, se, selectedOption, setSelectedOption,
    confirmed, results, startTest, handleConfirm, navigateTo, resetSession
  };

  return <TestSessionContext.Provider value={value}>{children}</TestSessionContext.Provider>;
}
