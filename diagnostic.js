// ═══════════════════════════════════════════════════════════════
// DIAGNOSTIC ENGINE — Transforms raw CAT data into actionable insight
// ═══════════════════════════════════════════════════════════════
//
// Takes response array from a completed CAT session and produces:
//   1. skillAccuracy    — % correct per skill (Grammar/Vocabulary/Reading)
//   2. subSkillAnalysis — Per sub-skill: accuracy, status, correct/total
//   3. wrongAnswers     — Every incorrect response with full metadata
//   4. wrongBySubSkill  — Wrong answers grouped by sub-skill (most-missed first)
//   5. weaknesses       — Top 3 priority areas ranked by severity
//
// Classification thresholds:
//   ≥ 75% → "Strength" (green)
//   ≥ 50% → "Developing" (amber)  
//   < 50% → "Focus Area" (used sparingly, never during test)
//
// This module is pure computation — no React, no side effects.

export const Diagnostic = {
  analyze(responses, goalType) {
    const skills = {};
    const subSkills = {};
    const wrongAnswers = [];
    
    for (const r of responses) {
      // Skill level
      if (!skills[r.skill]) skills[r.skill] = { correct: 0, total: 0 };
      skills[r.skill].total++;
      if (r.correct) skills[r.skill].correct++;
      
      // Sub-skill level
      const subKey = r.sub_skill;
      if (!subSkills[subKey]) subSkills[subKey] = { correct: 0, total: 0, skill: r.skill, items: [] };
      subSkills[subKey].total++;
      if (r.correct) subSkills[subKey].correct++;
      subSkills[subKey].items.push(r);
      
      if (!r.correct) {
        wrongAnswers.push(r);
      }
    }
    
    // Calculate accuracy percentages
    const skillAccuracy = {};
    for (const [skill, data] of Object.entries(skills)) {
      skillAccuracy[skill] = Math.round((data.correct / data.total) * 100);
    }
    
    const subSkillAnalysis = {};
    for (const [sub, data] of Object.entries(subSkills)) {
      const pct = Math.round((data.correct / data.total) * 100);
      let status;
      if (pct >= 75) status = "Strength";
      else if (pct >= 50) status = "Developing";
      else status = "Focus Area";
      
      subSkillAnalysis[sub] = {
        accuracy: pct,
        status,
        skill: data.skill,
        correct: data.correct,
        total: data.total,
      };
    }
    
    // Sort wrong answers by sub-skill
    const wrongBySubSkill = {};
    for (const w of wrongAnswers) {
      if (!wrongBySubSkill[w.sub_skill]) wrongBySubSkill[w.sub_skill] = [];
      wrongBySubSkill[w.sub_skill].push(w);
    }
    
    // Priority weaknesses (sorted by severity, then relevance to goal)
    const weaknesses = Object.entries(subSkillAnalysis)
      .filter(([, v]) => v.status !== "Strength")
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 3)
      .map(([name, data]) => ({ name, ...data }));
    
    return {
      skillAccuracy,
      subSkillAnalysis,
      wrongAnswers,
      wrongBySubSkill,
      weaknesses,
      totalCorrect: responses.filter(r => r.correct).length,
      totalItems: responses.length,
    };
  }
};

/**
 * buildAIPracticePrompt
 *
 * Builds a Vietnamese prompt for the learner to paste into any AI chatbot.
 * The prompt contains their level, weak skills, wrong answers + explanations,
 * and a clear instruction for the AI to verify and generate practice exercises.
 *
 * @param {Object} params
 * @param {string} params.cefrLevel        - e.g. "B1"
 * @param {string} params.ieltsRange       - e.g. "4.0–5.0"
 * @param {string} params.goalStatement    - e.g. "Đạt B2 và chinh phục IELTS Band 6.0"
 * @param {Array}  params.topWeakSkills    - Array of top 3 sub-skill name strings
 * @param {Array}  params.wrongAnswers     - Array of wrong answer objects
 *
 * @returns {string} - Complete prompt string in Vietnamese
 */
export function buildAIPracticePrompt({
  cefrLevel,
  ieltsRange,
  goalStatement,
  topWeakSkills,
  wrongAnswers,
}) {

  // --- SECTION 1: Learner context header ---
  const header = `Bạn là gia sư tiếng Anh của tôi. Tôi vừa làm bài kiểm tra trình độ tiếng Anh thích ứng và cần bạn giúp tôi học từ những lỗi sai.

--- THÔNG TIN CỦA TÔI ---
Trình độ hiện tại: ${cefrLevel} (ước tính IELTS ${ieltsRange})
Mục tiêu: ${goalStatement}
Điểm yếu chính: ${topWeakSkills.join(", ")}`;

  // --- SECTION 2: Wrong answers grouped by sub-skill ---
  // Group wrong answers by subSkill
  const grouped = wrongAnswers.reduce((acc, item) => {
    if (!acc[item.subSkill]) acc[item.subSkill] = [];
    acc[item.subSkill].push(item);
    return acc;
  }, {});

  const wrongAnswerBlock = Object.entries(grouped)
    .map(([subSkill, items]) => {
      const itemLines = items
        .map((item, index) => {
          return `  Câu ${index + 1}: ${item.stem}
  → Tôi chọn: ${item.learnerChoice}
  → Đáp án đúng: ${item.correctChoice}
  → Giải thích: ${item.explanation}`;
        })
        .join("\n\n");

      return `[${subSkill} — ${items[0].cefrDifficulty}]\n${itemLines}`;
    })
    .join("\n\n---\n\n");

  const wrongAnswerSection = `--- CÁC CÂU TÔI LÀM SAI ---\n${wrongAnswerBlock}`;

  // --- SECTION 3: Instruction to the AI ---
  const instruction = `--- YÊU CẦU ---
Với mỗi nhóm lỗi sai ở trên, hãy thực hiện theo thứ tự sau:

1. Xác nhận giải thích có chính xác không. Nếu có điểm nào cần bổ sung hoặc chỉnh sửa, hãy nêu rõ.
2. Cho tôi 1–2 câu luyện tập ngắn để thực hành ngay điểm ngữ pháp hoặc từ vựng đó.

Lưu ý: Tôi đang ở trình độ ${cefrLevel}, hãy giữ giọng điệu thân thiện, rõ ràng và đơn giản. Không cần giải thích lại từ đầu — chỉ xác nhận và luyện tập thôi.`;

  // --- COMBINE ALL SECTIONS ---
  return `${header}\n\n${wrongAnswerSection}\n\n${instruction}`;
}
