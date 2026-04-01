import { useState, useEffect, useRef } from "react";
import { buildAIPracticePrompt } from "./diagnostic.js";
import { VI_EXPLANATIONS } from "./viExplanations.js";

export default function AIPracticePanel({ results, t, goalType, lang }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleCopy() {
    const cefr = results.cefr || "B1";
    // If goalStatement is not accessible from results directly, we compute it using t
    const goalStatement = t.goalStatements[goalType]?.[cefr] || t.goalStatements.E[cefr] || "";
    
    const prompt = buildAIPracticePrompt({
      cefrLevel: cefr,
      ieltsRange: results.ielts || "N/A",
      goalStatement: goalStatement,
      topWeakSkills: (results.diagnosis?.weaknesses || []).slice(0, 3).map((w) => w.name),
      wrongAnswers: (results.diagnosis?.wrongAnswers || []).map((item) => ({
        subSkill: item.sub_skill,
        cefrDifficulty: item.cefr_difficulty,
        stem: item.stem,
        learnerChoice: item.options[item.learner_choice],
        correctChoice: item.options[item.correct_choice],
        explanation: VI_EXPLANATIONS[item.item_id] || item.explanation_text,
      })),
    });

    navigator.clipboard.writeText(prompt)
      .then(() => {
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 4000);
      })
      .catch((err) => {
        console.error("Failed to copy prompt to clipboard", err);
      });
  }

  return (
    <div className="ai-practice-panel">
      <div className="ai-practice-card">
        <h3 className="ai-practice-title">
          🤖 {t.aiPractice.panelTitle}
        </h3>
        <p className="ai-practice-description">
          {t.aiPractice.panelDescription}
        </p>
        <ol className="ai-practice-steps">
          <li>{t.aiPractice.step1}</li>
          <li>{t.aiPractice.step2}</li>
          <li>{t.aiPractice.step3}</li>
        </ol>
      </div>
      <button
        className={`ai-practice-button ${copied ? "copied" : ""}`}
        onClick={handleCopy}
      >
        {copied
          ? t.aiPractice.buttonCopied
          : t.aiPractice.buttonDefault}
      </button>
      <div 
        aria-live="polite" 
        style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", whiteSpace: "nowrap" }}
      >
        {copied ? t.aiPractice.buttonCopied : ""}
      </div>
    </div>
  );
}
