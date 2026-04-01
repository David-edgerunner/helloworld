// ═══════════════════════════════════════════════════════════════
// INTERNATIONALISATION — English & Vietnamese UI strings
// ═══════════════════════════════════════════════════════════════
//
// Bilingual interface: EN/VI. Test items always in English.
// Vietnamese is default for users with Vietnamese browser locale.
//
// Tone guidelines (§3):
//   Landing: "Find out", "discover" — never "test", "exam"
//   During:  "Take your time" — no evaluation language
//   Results: "You can now..." — never "only", "just", "but"

export const i18n = {
  en: {
    siteTitle: "English Level Map",
    tagline: "Find out exactly where your English is — in 20 minutes.",
    taglineSub: "Free. No login. No limits. Everything unlocked.",
    startBtn: "Find My Level",
    goalTitle: "What's bringing you here today?",
    goalSubtitle: "Choose the one that fits best — this helps us personalise your roadmap.",
    goalSkip: "Skip — just show me my level",
    goals: {
      A: "I'm preparing for IELTS or another English exam",
      B: "I need English for university or academic work",
      C: "I need English for work or professional communication",
      D: "I want to understand English media — films, music, podcasts",
      E: "I'm just curious about my level",
    },
    goalIcons: { A: "🎯", B: "🎓", C: "💼", D: "🎬", E: "🌟" },
    introTitle: "Before we begin",
    introPoints: [
      "This test adapts to you. It gets harder as it learns more about your level.",
      "Harder questions are a good sign — it means the test thinks you can handle them.",
      "There's no timer. Take your time with each question.",
      "You'll answer 20–40 questions. It takes about 15–20 minutes.",
      "At the end, you'll get your full CEFR level, IELTS estimate, weakness diagnosis, and a personalised study plan — all free, immediately.",
    ],
    introStart: "I'm Ready",
    testLengthTitle: "How thorough would you like the test to be?",
    testLengthSub: "Both options give you a CEFR level, IELTS estimate, and full diagnosis.",
    testQuick: "Quick Check",
    testQuickDesc: "~10 minutes · 20 questions · Fast and accurate",
    testFull: "Deep Dive",
    testFullDesc: "~20 minutes · Up to 40 questions · Maximum precision & richer diagnosis",
    testQuickNote: "Great if you want a quick snapshot of your level.",
    testFullNote: "Recommended if you're preparing for IELTS or need a detailed weakness map.",
    calmPhrase: "Take your time. There's no rush.",
    confirmBtn: "Confirm",
    processingLines: [
      "Building your personal English map…",
      "Analysing your strengths and patterns…",
      "Creating your personalised roadmap…",
    ],
    resultsTitle: "Your English Map",
    cefrLabels: {
      A2: "Elementary — Building Foundations",
      B1: "Pre-Intermediate — Everyday Communication",
      B2: "Upper-Intermediate — Academic & Professional Fluency",
      C1: "Advanced — Full Professional Proficiency",
    },
    cefrDescriptions: {
      A2: "You can understand and use familiar everyday expressions. You can introduce yourself, ask and answer questions about personal details, and interact in simple ways when the other person speaks slowly.",
      B1: "You can handle real-world English in everyday situations. You can deal with most situations likely to arise while travelling, describe experiences and events, and give reasons and explanations for opinions and plans.",
      B2: "You can interact with a degree of fluency that makes regular interaction with native speakers quite possible. You can understand the main ideas of complex texts and produce clear, detailed text on a wide range of subjects.",
      C1: "You can express yourself fluently and spontaneously without much obvious searching for expressions. You can use language flexibly and effectively for social, academic, and professional purposes.",
    },
    score: "Score",
    ieltsEstimate: "IELTS Estimate",
    band: "Band",
    skillBreakdown: "Skill Breakdown",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    reading: "Reading",
    diagnosisTitle: "What We Learned From Your Answers",
    strength: "Strength",
    developing: "Developing",
    focusArea: "Focus Area",
    youChose: "You chose:",
    theAnswer: "The answer was:",
    roadmapTitle: "Your Roadmap",
    goalStatements: {
      A: { A2: "Reach B1 and build the foundation for IELTS Band 4.5.", B1: "Reach B2 and target IELTS Band 6.0.", B2: "Reach C1 and target IELTS Band 7.0+.", C1: "Reach C2 and achieve IELTS Band 8.0." },
      B: { A2: "Reach B1 and begin handling basic academic texts.", B1: "Reach B2 and meet most university English requirements.", B2: "Reach C1 and meet top university language requirements.", C1: "Reach C2 and publish academic work indistinguishable from native speakers." },
      C: { A2: "Reach B1 and handle basic workplace communication.", B1: "Reach B2 and communicate professionally in meetings and emails.", B2: "Reach C1 and present, negotiate, and write at a professional native level.", C1: "Reach C2 and lead at the highest level in any English-language environment." },
      D: { A2: "Reach B1 and follow English shows with subtitles.", B1: "Reach B2 and watch English films without needing subtitles.", B2: "Reach C1 and appreciate humour, nuance, and subtext in English media.", C1: "Reach C2 and lose yourself entirely in English-language content." },
      E: { A2: "Reach B1 and expand your everyday English confidence.", B1: "Reach B2 and unlock academic and professional fluency.", B2: "Reach C1 and achieve full professional proficiency.", C1: "Reach C2 and master English at the highest level." },
    },
    weekPlan: "4-Week Study Plan",
    weeks: [
      { title: "Week 1", focus: "Priority Weakness #1", activity: "Study the skill focus. Complete 10 practice questions from linked resources.", milestone: "Score ≥ 60% on 10 practice items" },
      { title: "Week 2", focus: "Priority Weakness #2", activity: "Study the skill focus. Complete 10 practice questions from linked resources.", milestone: "Score ≥ 60% on 10 practice items" },
      { title: "Week 3", focus: "Review + Weakness #3", activity: "Revisit modules 1 & 2. Study module #3. Take a 20-item mixed practice test.", milestone: "≥ 65% on mixed test" },
      { title: "Week 4", focus: "Full Revision", activity: "Redo a full practice test. Review remaining weak areas. Retake placement test.", milestone: "Measurably higher score on retake" },
    ],
    retake: "Retake in 4 weeks to see how much you've improved",
    disclaimer: "This is an educational placement tool, not a certified assessment. Your CEFR level and IELTS band estimate are approximations based on a limited sample of grammar, vocabulary, and reading skills. They do not replace official IELTS, Cambridge, or other certified test results. For official certification, please take the corresponding standardised exam.",
    shareBtn: "Share My Results",
    retakeBtn: "Start Over",
    langToggle: "Tiếng Việt",
    faqTitle: "Common Questions",
    faqs: [
      { q: "How accurate is this test?", a: "This test uses the same Computer Adaptive Testing (CAT) and Item Response Theory (IRT) models used in major standardised tests. It adapts to your level in real-time, which makes it significantly more accurate than fixed-length tests. Your CEFR level is estimated to be accurate within one band for 90%+ of test-takers." },
      { q: "Why is this free?", a: "Because a login wall is a barrier, and withholding results is unfair. You did the work — you deserve the full insight. This platform is sustained by an open-source community and voluntary contributions." },
      { q: "Why do the questions get harder?", a: "That's the adaptive engine at work. When you answer correctly, the test gives you a harder question to learn more about your upper limit. Harder questions are a good sign — they mean the test thinks you can handle them." },
      { q: "Can I retake the test?", a: "Yes. We recommend waiting at least 4 weeks and following your study plan before retaking, so your retake score reflects genuine improvement." },
    ],
    heroWhy: "Why this level?",
    correct: "correct",
    of: "of",
    questions: "questions",
    prioritySkills: "Priority Skills to Focus On",
    resources: "Recommended Resources",
    minsPerDay: "20–30 min/day",
    aboutTitle: "Built for learners, not for business.",
    aboutText: "No ads. No data collection. No upsells. Just your English level, explained honestly, with a clear path forward.",
    aiPractice: {
      panelTitle: "Verify & Practice with Your AI",
      panelDescription: "Use ChatGPT, Gemini, or any AI chatbot to verify these explanations and start practising today.",
      howItWorksTitle: "How it works:",
      step1: "Click the button below to copy",
      step2: "Open any AI chatbot you use (ChatGPT, Gemini, ...)",
      step3: "Paste and send — the AI does the rest",
      buttonDefault: "📋 Copy prompt",
      buttonCopied: "✅ Copied! Open your AI and paste",
    },

    // ─── English DNA: CEFR level headlines + capability descriptions ───
    // These replace the generic cefrDescriptions on the results page.
    // Each is authored to frame what the learner CAN do, not what they lack.
    cefrDNA: {
      A2: {
        headline: "You're building your English foundation confidently",
        capability: "At A2, you can handle simple everyday conversations, understand familiar topics, and write basic messages. This is real, usable English — IELTS 3.5–4.0 territory.",
      },
      B1: {
        headline: "You handle everyday English with real confidence",
        capability: "At B1, you can follow complex arguments, write structured emails, and hold your own in most conversations. This is a genuine milestone — IELTS 4.5–5.0 territory.",
      },
      B2: {
        headline: "You operate at an academic and professional level",
        capability: "At B2, you can understand nuanced texts, argue a position in writing, and communicate fluently in most professional settings. IELTS 5.5–6.5 territory.",
      },
      C1: {
        headline: "You use English with near-native fluency",
        capability: "At C1, you can understand implicit meaning, write with precision and style, and handle complex professional communication. IELTS 7.0–8.0 territory.",
      },
    },

    // ─── Honest Timeline copy, keyed by CEFR level ───
    // These are genuine estimates — no fake precision, no daily schedules.
    honestTimeline: {
      A2: {
        headline: "10–14 weeks of consistent practice",
        body: "Learners at A2 who focus on their top 2 sub-skills typically reach B1 in this window. That's 20–30 minutes a day — not hours.",
      },
      B1: {
        headline: "6–10 weeks of consistent practice",
        body: "Learners at B1 who address their key gaps typically reach B2 in this window. That's 20–30 minutes a day, not hours.",
      },
      B2: {
        headline: "8–12 weeks of focused practice",
        body: "B2→C1 is the hardest jump in the CEFR scale. Learners who close their top 2 gaps typically get there in this window with 30 minutes of daily focused work.",
      },
      C1: {
        headline: "You're in the advanced zone",
        body: "At C1, gains come from exposure and production — reading widely, writing regularly, and pushing yourself into unfamiliar registers.",
      },
    },

    // ─── Weak Link IELTS Impact Copy ───
    // Keyed by sub_skill name — must match item bank sub_skill values exactly.
    // Explains WHY this specific gap costs IELTS points. Authored, not AI-generated.
    weakLinkImpact: {
      "Collocations": "IELTS examiners notice immediately when word combinations feel unnatural. 'Do a decision' instead of 'make a decision' — these mark you as below B2 even when your grammar is solid.",
      "Phrasal Verbs": "IELTS Listening Parts 3 and 4 use natural spoken English, which is dense with phrasal verbs. Missing these means missing gist — and losing marks you'd otherwise have.",
      "Conditionals": "Conditional structures are the backbone of IELTS Writing Task 2 arguments. Without them, your arguments sound tentative and incomplete to an examiner.",
      "Verb Tenses": "Tense control is one of the four scoring criteria in IELTS Writing. Errors here directly reduce your Grammatical Range and Accuracy band score.",
      "Articles": "English articles (a/an/the) don't exist in Vietnamese — making this the most common Vietnamese learner error in IELTS Writing. Even one-band candidates lose points here.",
      "Modal Verbs": "Modals control nuance and register in academic writing. Without them, your writing sounds either too certain or too vague for IELTS Task 2.",
      "Inference": "IELTS Reading is 60% inference — the answer is never stated directly. If you read for explicit information only, you are structurally disadvantaged on this paper.",
      "Text Structure": "Understanding how a text is organised lets you skim efficiently — critical for IELTS Reading's tight time pressure.",
      "Academic Word List": "The Academic Word List covers approximately 10% of all academic text. Gaps here compound across all four IELTS papers.",
      "Word Formation": "IELTS often tests whether you can change word form (decide → decision → decisive). Missing this costs points in both Reading and Writing.",
      "Prepositions": "Preposition errors are among the most persistent in Vietnamese learner writing. They signal lower proficiency to examiners even in otherwise strong writing.",
      "Sentence Structure": "IELTS Writing rewards syntactic range — varying your sentence structure. Relying on simple sentences limits your Grammatical Range score ceiling.",
      "Idioms": "Idiomatic language signals high-level fluency. Misusing idioms — or avoiding them entirely — marks a clear ceiling for Lexical Resource in Speaking and Writing.",
      "Cohesive Devices": "IELTS Writing marks Coherence and Cohesion as a separate criterion. Misused linking words — 'furthermore' placed incorrectly — actively lower this sub-score.",
      "Reading Inference": "IELTS Reading is 60% inference — the answer is never stated directly. If you read for explicit information only, you are structurally disadvantaged on this paper.",
      "Academic Vocabulary": "The Academic Word List covers approximately 10% of all academic text. Gaps here compound across all four IELTS papers.",
      "Passive Voice": "Passive voice is an essential structure in academic English. Misusing or avoiding it limits your grammatical range score in IELTS Writing.",
      "Subject-Verb Agreement": "Subject-verb agreement is a fundamental grammar rule that IELTS examiners notice immediately. Errors here directly lower your Grammatical Accuracy score.",
    },

    // ─── Sub-skill Unlock Data ───
    // What the learner gains when they fix each sub-skill.
    // 'fix'     → completes: "Fix this and [fix]"
    // 'reward'  → the approximate IELTS band improvement
    // 'bandCost'→ how much this gap is currently costing them
    subSkillUnlock: {
      "Collocations": { fix: "your Writing descriptions sound natural to IELTS examiners", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Phrasal Verbs": { fix: "Listening Parts 3 & 4 become significantly clearer", reward: "+0.5 IELTS Listening", bandCost: "~0.5 band" },
      "Conditionals": { fix: "your Writing Task 2 arguments become complete and convincing", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Verb Tenses": { fix: "your Grammatical Range and Accuracy score improves directly", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Articles": { fix: "the most common Vietnamese learner error disappears from your writing", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Modal Verbs": { fix: "your academic writing gains the nuance IELTS examiners reward", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Inference": { fix: "60% of IELTS Reading questions become answerable on comprehension alone", reward: "+1 IELTS Reading", bandCost: "~1 band" },
      "Text Structure": { fix: "you can skim passages efficiently under time pressure", reward: "+0.5 IELTS Reading", bandCost: "~0.5 band" },
      "Academic Word List": { fix: "vocabulary gaps stop costing you points across all four IELTS papers", reward: "+0.5 IELTS overall", bandCost: "~0.5 band" },
      "Word Formation": { fix: "gap-fill and Writing vocabulary errors disappear", reward: "+0.5 IELTS", bandCost: "~0.5 band" },
      "Prepositions": { fix: "a persistent surface-level error that examiners flag disappears", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Sentence Structure": { fix: "your Grammatical Range score reaches the next ceiling", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Idioms": { fix: "your Lexical Resource band moves into the 7+ range", reward: "+0.5 IELTS Speaking", bandCost: "~0.5 band" },
      "Cohesive Devices": { fix: "your Coherence and Cohesion sub-score rises noticeably", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Reading Inference": { fix: "60% of IELTS Reading questions become answerable on comprehension alone", reward: "+1 IELTS Reading", bandCost: "~1 band" },
      "Academic Vocabulary": { fix: "vocabulary gaps stop costing you points across all four IELTS papers", reward: "+0.5 IELTS overall", bandCost: "~0.5 band" },
      "Passive Voice": { fix: "your writing achieves the objective tone required for academic tasks", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
      "Subject-Verb Agreement": { fix: "you remove a basic error that strictly caps your grammar score", reward: "+0.5 IELTS Writing", bandCost: "~0.5 band" },
    },

    // ─── Pattern Insight — parameterised copy ───
    // This is a FUNCTION, not a string. It generates the summary sentence at the
    // bottom of WrongAnswerBreakdown from real data, so the number is never fake.
    patternInsight: (topSubSkill, missCount, totalWrong) =>
      `${missCount} of your ${totalWrong} mistakes connect to the same gap: ${topSubSkill}. ` +
      `This isn't a random scatter — it's a pattern. Fixing this one area removes more errors ` +
      `than anything else you could study right now.`,

    // ─── Wrong Answer Breakdown UI strings ───
    whatWeLearnedTitle: "What we learned from your answers",
    whatWeLearnedSubtitle: "Every mistake is a signal. Here's what your pattern of errors is telling us — grouped by what they reveal, not the order you answered them.",
    patternTitle: "The pattern your mistakes reveal",
    distractorNote: "This answer is tempting because",
    questionsAnswered: "Questions answered",
    incorrectAnswers: "Incorrect answers",
    patternsFound: "Patterns found",
    reviewWrongAnswers: "Review my wrong answers",
    retakeTest: "Retake the test",
    yourWeakLink: "Your weak link right now",
    whatYouUnlock: "What you unlock when you fix these",
    honestTimelineLabel: "The honest timeline",
    noPatternsFound: "Not enough data to identify a clear pattern yet.",
    allFilter: "All",
    radarCaption: "No two learners have the same shape. This one is yours.",
  },
  vi: {
    siteTitle: "Bản Đồ Tiếng Anh",
    tagline: "Khám phá trình độ tiếng Anh của bạn — chỉ trong 20 phút.",
    taglineSub: "Miễn phí. Không cần đăng nhập. Không giới hạn.",
    startBtn: "Bắt Đầu Ngay",
    goalTitle: "Điều gì đưa bạn đến đây hôm nay?",
    goalSubtitle: "Chọn mục tiêu phù hợp nhất — giúp chúng tôi cá nhân hoá lộ trình học cho bạn.",
    goalSkip: "Bỏ qua — chỉ cho tôi xem trình độ",
    goals: {
      A: "Tôi đang chuẩn bị cho kỳ thi IELTS hoặc bài kiểm tra tiếng Anh",
      B: "Tôi cần tiếng Anh cho việc học đại học hoặc nghiên cứu",
      C: "Tôi cần tiếng Anh cho công việc và giao tiếp chuyên nghiệp",
      D: "Tôi muốn hiểu phim, nhạc và podcast tiếng Anh",
      E: "Tôi chỉ tò mò về trình độ của mình",
    },
    goalIcons: { A: "🎯", B: "🎓", C: "💼", D: "🎬", E: "🌟" },
    introTitle: "Trước khi bắt đầu",
    introPoints: [
      "Bài kiểm tra này thích ứng với bạn. Câu hỏi sẽ khó hơn khi nó hiểu thêm về trình độ của bạn.",
      "Câu hỏi khó hơn là dấu hiệu tốt — nghĩa là bài kiểm tra tin bạn có thể làm được.",
      "Không có giới hạn thời gian. Hãy từ từ với mỗi câu hỏi.",
      "Bạn sẽ trả lời 20–40 câu hỏi, mất khoảng 15–20 phút.",
      "Kết thúc, bạn sẽ nhận được trình độ CEFR, ước tính IELTS, phân tích điểm yếu và lộ trình học — tất cả miễn phí, ngay lập tức.",
    ],
    introStart: "Tôi Đã Sẵn Sàng",
    testLengthTitle: "Bạn muốn bài kiểm tra chi tiết đến mức nào?",
    testLengthSub: "Cả hai đều cho bạn trình độ CEFR, ước tính IELTS, và phân tích đầy đủ.",
    testQuick: "Kiểm Tra Nhanh",
    testQuickDesc: "~10 phút · 20 câu hỏi · Nhanh và chính xác",
    testFull: "Phân Tích Sâu",
    testFullDesc: "~20 phút · Tối đa 40 câu hỏi · Độ chính xác tối đa & phân tích chi tiết hơn",
    testQuickNote: "Phù hợp nếu bạn muốn xem nhanh trình độ của mình.",
    testFullNote: "Khuyên dùng nếu bạn đang chuẩn bị cho IELTS hoặc cần bản đồ điểm yếu chi tiết.",
    calmPhrase: "Hãy từ từ. Không cần vội.",
    confirmBtn: "Xác Nhận",
    processingLines: [
      "Đang xây dựng bản đồ tiếng Anh của bạn…",
      "Phân tích điểm mạnh và mô hình của bạn…",
      "Tạo lộ trình cá nhân hoá…",
    ],
    resultsTitle: "Bản Đồ Tiếng Anh Của Bạn",
    cefrLabels: {
      A2: "Sơ cấp — Xây Dựng Nền Tảng",
      B1: "Trung cấp — Giao Tiếp Hàng Ngày",
      B2: "Trung cấp cao — Thành Thạo Học Thuật & Chuyên Nghiệp",
      C1: "Nâng cao — Thành Thạo Chuyên Nghiệp Toàn Diện",
    },
    cefrDescriptions: {
      A2: "Bạn có thể hiểu và sử dụng các cụm từ quen thuộc hàng ngày. Bạn có thể tự giới thiệu, hỏi và trả lời về thông tin cá nhân, và tương tác đơn giản khi người khác nói chậm.",
      B1: "Bạn có thể xử lý tiếng Anh trong các tình huống hàng ngày. Bạn có thể giải quyết hầu hết các tình huống khi đi du lịch, mô tả trải nghiệm, và đưa ra lý do cho ý kiến của mình.",
      B2: "Bạn có thể giao tiếp khá trôi chảy với người bản xứ. Bạn hiểu được ý chính của các văn bản phức tạp và có thể viết rõ ràng, chi tiết về nhiều chủ đề.",
      C1: "Bạn có thể diễn đạt trôi chảy và tự nhiên. Bạn sử dụng ngôn ngữ linh hoạt và hiệu quả cho mục đích xã hội, học thuật và chuyên nghiệp.",
    },
    score: "Điểm",
    ieltsEstimate: "Ước tính IELTS",
    band: "Band",
    skillBreakdown: "Phân Tích Kỹ Năng",
    grammar: "Ngữ pháp",
    vocabulary: "Từ vựng",
    reading: "Đọc hiểu",
    diagnosisTitle: "Những Gì Chúng Tôi Học Được Từ Câu Trả Lời Của Bạn",
    strength: "Điểm mạnh",
    developing: "Đang phát triển",
    focusArea: "Cần tập trung",
    youChose: "Bạn đã chọn:",
    theAnswer: "Đáp án đúng là:",
    roadmapTitle: "Lộ Trình Của Bạn",
    goalStatements: {
      A: { A2: "Đạt B1 và xây dựng nền tảng cho IELTS Band 4.5.", B1: "Đạt B2 và hướng đến IELTS Band 6.0.", B2: "Đạt C1 và hướng đến IELTS Band 7.0+.", C1: "Đạt C2 và đạt IELTS Band 8.0." },
      B: { A2: "Đạt B1 và bắt đầu đọc hiểu văn bản học thuật cơ bản.", B1: "Đạt B2 và đáp ứng yêu cầu tiếng Anh đại học.", B2: "Đạt C1 và đạt yêu cầu ngôn ngữ của các trường hàng đầu.", C1: "Đạt C2 và viết học thuật như người bản xứ." },
      C: { A2: "Đạt B1 và xử lý giao tiếp công việc cơ bản.", B1: "Đạt B2 và giao tiếp chuyên nghiệp trong họp và email.", B2: "Đạt C1 và thuyết trình, đàm phán ở mức chuyên nghiệp.", C1: "Đạt C2 và lãnh đạo ở mức cao nhất trong môi trường tiếng Anh." },
      D: { A2: "Đạt B1 và theo dõi chương trình tiếng Anh có phụ đề.", B1: "Đạt B2 và xem phim tiếng Anh không cần phụ đề.", B2: "Đạt C1 và cảm nhận sự hài hước, tinh tế trong nội dung tiếng Anh.", C1: "Đạt C2 và hoàn toàn đắm chìm trong nội dung tiếng Anh." },
      E: { A2: "Đạt B1 và mở rộng sự tự tin tiếng Anh hàng ngày.", B1: "Đạt B2 và mở khóa khả năng học thuật và chuyên nghiệp.", B2: "Đạt C1 và đạt thành thạo chuyên nghiệp toàn diện.", C1: "Đạt C2 và làm chủ tiếng Anh ở mức cao nhất." },
    },
    weekPlan: "Kế Hoạch Học 4 Tuần",
    weeks: [
      { title: "Tuần 1", focus: "Điểm yếu ưu tiên #1", activity: "Học module kỹ năng. Hoàn thành 10 câu hỏi luyện tập.", milestone: "Đạt ≥ 60% trên 10 câu" },
      { title: "Tuần 2", focus: "Điểm yếu ưu tiên #2", activity: "Học module kỹ năng. Hoàn thành 10 câu hỏi luyện tập.", milestone: "Đạt ≥ 60% trên 10 câu" },
      { title: "Tuần 3", focus: "Ôn tập + Điểm yếu #3", activity: "Ôn lại module 1 & 2. Học module #3. Làm bài tổng hợp 20 câu.", milestone: "≥ 65% bài tổng hợp" },
      { title: "Tuần 4", focus: "Ôn tập toàn diện", activity: "Làm lại bài kiểm tra. Ôn tập các kỹ năng còn yếu. Làm lại bài placement.", milestone: "Điểm cao hơn rõ rệt" },
    ],
    retake: "Làm lại sau 4 tuần để xem bạn tiến bộ bao nhiêu",
    disclaimer: "Đây là công cụ đánh giá trình độ mang tính giáo dục, không phải bài kiểm tra chính thức. Trình độ CEFR và band IELTS ước tính là kết quả xấp xỉ dựa trên mẫu giới hạn về ngữ pháp, từ vựng và đọc hiểu. Kết quả này không thay thế cho chứng chỉ IELTS, Cambridge, hoặc các kỳ thi chuẩn hoá chính thức. Để có chứng chỉ chính thức, vui lòng thi các bài thi chuẩn hoá tương ứng.",
    shareBtn: "Chia Sẻ Kết Quả",
    retakeBtn: "Làm Lại",
    langToggle: "English",
    faqTitle: "Câu Hỏi Thường Gặp",
    faqs: [
      { q: "Bài kiểm tra này chính xác đến mức nào?", a: "Bài kiểm tra sử dụng mô hình Computer Adaptive Testing (CAT) và Item Response Theory (IRT) — cùng loại mô hình được dùng trong các bài thi chuẩn hoá lớn. Nó thích ứng với trình độ của bạn theo thời gian thực, chính xác hơn nhiều so với bài kiểm tra có độ dài cố định." },
      { q: "Tại sao miễn phí?", a: "Vì yêu cầu đăng nhập là rào cản, và giữ lại kết quả là không công bằng. Bạn đã làm bài — bạn xứng đáng nhận được đầy đủ thông tin. Nền tảng này được duy trì bởi cộng đồng mã nguồn mở." },
      { q: "Tại sao câu hỏi ngày càng khó hơn?", a: "Đó là engine thích ứng đang hoạt động. Khi bạn trả lời đúng, bài kiểm tra đưa ra câu khó hơn để tìm hiểu giới hạn trên của bạn. Câu hỏi khó hơn là dấu hiệu tốt." },
      { q: "Tôi có thể làm lại không?", a: "Có. Chúng tôi khuyên bạn nên đợi ít nhất 4 tuần và làm theo kế hoạch học tập trước khi làm lại, để điểm mới phản ánh sự tiến bộ thực sự." },
    ],
    heroWhy: "Tại sao trình độ này?",
    correct: "đúng",
    of: "trên",
    questions: "câu hỏi",
    prioritySkills: "Kỹ Năng Ưu Tiên Cần Tập Trung",
    resources: "Tài Nguyên Đề Xuất",
    minsPerDay: "20–30 phút/ngày",
    aboutTitle: "Được xây dựng cho người học, không phải cho doanh nghiệp.",
    aboutText: "Không quảng cáo. Không thu thập dữ liệu. Không bán thêm. Chỉ trình độ tiếng Anh của bạn, giải thích trung thực, với con đường rõ ràng phía trước.",
    aiPractice: {
      panelTitle: "Kiểm tra & Luyện tập với AI của bạn",
      panelDescription: "Dùng ChatGPT, Gemini, hoặc bất kỳ AI nào để kiểm tra lại giải thích và luyện tập ngay.",
      howItWorksTitle: "Cách thực hiện:",
      step1: "Nhấn nút bên dưới để sao chép",
      step2: "Mở AI chatbot bạn thường dùng (ChatGPT, Gemini, ...)",
      step3: "Dán vào và gửi — AI sẽ làm phần còn lại",
      buttonDefault: "📋 Sao chép prompt",
      buttonCopied: "✅ Đã sao chép! Mở AI và dán vào nhé",
    },

    // ─── English DNA: CEFR level headlines + capability descriptions ───
    cefrDNA: {
      A2: {
        headline: "Bạn đang xây dựng nền tảng tiếng Anh vững chắc",
        capability: "Ở trình độ A2, bạn có thể giao tiếp trong các tình huống quen thuộc hàng ngày, hiểu các chủ đề cơ bản và viết tin nhắn đơn giản. Đây là tiếng Anh thực tế — tương đương IELTS 3.5–4.0.",
      },
      B1: {
        headline: "Bạn tự tin xử lý tiếng Anh hàng ngày",
        capability: "Ở trình độ B1, bạn có thể theo dõi các lập luận phức tạp, viết email có cấu trúc và giao tiếp tốt trong hầu hết các tình huống. Đây là cột mốc thực sự — tương đương IELTS 4.5–5.0.",
      },
      B2: {
        headline: "Bạn giao tiếp ở trình độ học thuật và chuyên nghiệp",
        capability: "Ở trình độ B2, bạn có thể hiểu các văn bản sắc thái, lập luận bằng văn bản và giao tiếp trôi chảy trong môi trường chuyên nghiệp. Tương đương IELTS 5.5–6.5.",
      },
      C1: {
        headline: "Bạn sử dụng tiếng Anh gần như người bản ngữ",
        capability: "Ở trình độ C1, bạn có thể hiểu ý nghĩa ngầm, viết chính xác và xử lý giao tiếp chuyên nghiệp phức tạp. Tương đương IELTS 7.0–8.0.",
      },
    },

    // ─── Honest timeline — keyed by CEFR level ───
    honestTimeline: {
      A2: {
        headline: "10–14 tuần luyện tập đều đặn",
        body: "Người học ở A2 tập trung vào 2 kỹ năng yếu nhất thường đạt B1 trong khoảng thời gian này. Chỉ cần 20–30 phút mỗi ngày — không phải nhiều giờ.",
      },
      B1: {
        headline: "6–10 tuần luyện tập đều đặn",
        body: "Người học ở B1 tập trung vào các điểm yếu chính thường đạt B2 trong khoảng thời gian này. Chỉ cần 20–30 phút mỗi ngày, không phải nhiều giờ.",
      },
      B2: {
        headline: "8–12 tuần luyện tập tập trung",
        body: "B2 lên C1 là bước nhảy khó nhất trong thang CEFR. Người học khắc phục 2 điểm yếu hàng đầu thường đạt được trong khoảng thời gian này với 30 phút luyện tập mỗi ngày.",
      },
      C1: {
        headline: "Bạn đang ở vùng nâng cao",
        body: "Ở C1, tiến bộ đến từ tiếp xúc và sản xuất ngôn ngữ — đọc rộng, viết thường xuyên và đẩy mình vào các văn phong không quen thuộc.",
      },
    },

    // ─── Weak link IELTS impact copy — keyed by sub_skill name ───
    weakLinkImpact: {
      "Collocations": "Giám khảo IELTS nhận ra ngay khi cách kết hợp từ nghe không tự nhiên. 'Do a decision' thay vì 'make a decision', 'strong rain' thay vì 'heavy rain' — những lỗi này đánh dấu bạn dưới B2 dù ngữ pháp tốt.",
      "Phrasal Verbs": "IELTS Listening Part 3 và 4 dùng tiếng Anh tự nhiên, đậm đặc phrasal verbs. Bỏ qua chúng đồng nghĩa với mất ý chính — và mất điểm đáng lẽ bạn có thể có.",
      "Conditionals": "Câu điều kiện là xương sống của lập luận IELTS Writing Task 2. Không có chúng, bài viết của bạn nghe không hoàn chỉnh và thiếu thuyết phục với giám khảo.",
      "Verb Tenses": "Kiểm soát thì là một trong bốn tiêu chí chấm điểm IELTS Writing. Lỗi ở đây trực tiếp làm giảm điểm Grammatical Range and Accuracy.",
      "Articles": "Mạo từ tiếng Anh (a/an/the) không tồn tại trong tiếng Việt — đây là lỗi phổ biến nhất của người học Việt trong IELTS Writing. Ngay cả thí sinh band cao cũng mất điểm ở đây.",
      "Modal Verbs": "Động từ khiếm khuyết kiểm soát sắc thái và văn phong trong văn viết học thuật. Thiếu chúng, bài viết của bạn nghe quá chắc chắn hoặc quá mơ hồ cho IELTS Task 2.",
      "Reading Inference": "IELTS Reading là 60% suy luận — câu trả lời không bao giờ được nêu trực tiếp. Nếu bạn chỉ đọc để tìm thông tin hiển thị, bạn đang bất lợi có hệ thống trong bài thi này.",
      "Inference": "Câu hỏi suy luận xuất hiện trong cả IELTS Reading lẫn Listening. Đây là kỹ năng không thể đạt điểm cao nếu chỉ đọc/nghe theo nghĩa đen.",
      "Text Structure": "Hiểu cách tổ chức văn bản giúp bạn đọc lướt hiệu quả — rất quan trọng khi IELTS Reading có áp lực thời gian lớn.",
      "Academic Word List": "Academic Word List chiếm khoảng 10% tất cả văn bản học thuật. Lỗ hổng ở đây ảnh hưởng cả bốn kỹ năng IELTS.",
      "Academic Vocabulary": "Academic Word List chiếm khoảng 10% tất cả văn bản học thuật. Lỗ hổng ở đây ảnh hưởng cả bốn kỹ năng IELTS.",
      "Word Formation": "IELTS thường kiểm tra khả năng thay đổi dạng từ (decide → decision → decisive). Bỏ lỡ điều này làm mất điểm cả Reading lẫn Writing.",
      "Passive Voice": "Bị động là cấu trúc thiết yếu trong tiếng Anh học thuật và chuyên nghiệp. Dùng sai hoặc tránh né bị động làm bài IELTS Writing mất tính đa dạng ngữ pháp.",
      "Sentence Structure": "Cấu trúc câu đa dạng là tiêu chí chấm điểm trực tiếp trong IELTS Writing. Chỉ dùng câu đơn giản giới hạn band điểm của bạn ở mức tối đa 5.0.",
      "Cohesive Devices": "Từ nối và thiết bị liên kết được đánh giá trực tiếp trong IELTS Writing Task 1 và 2 dưới tiêu chí Coherence and Cohesion — một trong bốn tiêu chí ngang nhau.",
      "Prepositions": "Giới từ tiếng Anh không theo quy tắc logic và không có hệ thống tương đương trong tiếng Việt. Lỗi giới từ xuất hiện trong cả Writing lẫn Reading của IELTS.",
      "Subject-Verb Agreement": "Hòa hợp chủ ngữ-động từ là lỗi cơ bản mà giám khảo IELTS chú ý ngay. Lỗi này ảnh hưởng trực tiếp đến điểm Grammatical Accuracy trong Writing.",
      "Idioms": "Ngôn ngữ thành ngữ báo hiệu trình độ cao. Dùng sai thành ngữ — hoặc tránh hoàn toàn — đánh dấu rõ ràng giới hạn trần cho Lexical Resource trong Speaking và Writing.",
    },

    // ─── Sub-skill unlock cards — what the learner GAINS when they fix it ───
    subSkillUnlock: {
      "Collocations": { fix: "bài mô tả Writing Task 1 nghe tự nhiên với người bản ngữ", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Phrasal Verbs": { fix: "bạn theo được tiếng Anh tự nhiên trong Listening Part 3–4", reward: "+0.5 điểm IELTS Listening", bandCost: "~0.5 band" },
      "Conditionals": { fix: "lập luận Writing Task 2 của bạn trở nên hoàn chỉnh và thuyết phục", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Verb Tenses": { fix: "điểm Grammatical Range and Accuracy trong Writing tăng lên", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Articles": { fix: "lỗi phổ biến nhất của người học Việt biến mất khỏi bài viết", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Modal Verbs": { fix: "văn phong học thuật trong Writing trở nên chính xác và thuyết phục", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Reading Inference": { fix: "bạn trả lời được câu hỏi suy luận mà không cần tìm từ ngữ trực tiếp", reward: "+1 điểm IELTS Reading", bandCost: "~1 band" },
      "Inference": { fix: "bạn trả lời được câu hỏi suy luận trong cả Reading lẫn Listening", reward: "+1 điểm IELTS", bandCost: "~1 band" },
      "Text Structure": { fix: "bạn đọc lướt văn bản IELTS nhanh và chính xác hơn", reward: "+0.5 điểm IELTS Reading", bandCost: "~0.5 band" },
      "Academic Word List": { fix: "bạn hiểu và sử dụng được từ vựng học thuật trong cả 4 kỹ năng", reward: "+0.5 điểm IELTS", bandCost: "~0.5 band" },
      "Academic Vocabulary": { fix: "bạn hiểu và sử dụng được từ vựng học thuật trong cả 4 kỹ năng", reward: "+0.5 điểm IELTS", bandCost: "~0.5 band" },
      "Word Formation": { fix: "lỗi điền từ trong Reading và Writing biến mất", reward: "+0.5 điểm IELTS", bandCost: "~0.5 band" },
      "Passive Voice": { fix: "bài Writing của bạn đạt đa dạng ngữ pháp mà giám khảo tìm kiếm", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Sentence Structure": { fix: "bài Writing của bạn vượt qua giới hạn band 5.0 về cú pháp", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Cohesive Devices": { fix: "điểm Coherence and Cohesion trong Writing tăng trực tiếp", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Prepositions": { fix: "lỗi giới từ biến mất khỏi cả Writing lẫn Reading của bạn", reward: "+0.5 điểm IELTS", bandCost: "~0.5 band" },
      "Subject-Verb Agreement": { fix: "lỗi ngữ pháp cơ bản không còn kéo điểm Writing của bạn xuống", reward: "+0.5 điểm IELTS Writing", bandCost: "~0.5 band" },
      "Idioms": { fix: "band Lexical Resource của bạn tiến vào phạm vi 7+", reward: "+0.5 điểm IELTS Speaking", bandCost: "~0.5 band" },
    },

    // ─── Pattern insight — parameterised function ───
    patternInsight: (topSubSkill, missCount, totalWrong) =>
      `${missCount} trong số ${totalWrong} lỗi sai của bạn kết nối với cùng một điểm yếu: ${topSubSkill}. ` +
      `Đây không phải ngẫu nhiên — đây là một mô hình. Khắc phục khu vực này loại bỏ nhiều lỗi hơn bất cứ thứ gì khác bạn có thể học ngay bây giờ.`,

    // ─── Wrong Answer Breakdown UI strings ───
    whatWeLearnedTitle: "Những gì chúng tôi học được từ câu trả lời của bạn",
    whatWeLearnedSubtitle: "Mỗi sai lầm là một tín hiệu. Đây là những gì mô hình lỗi của bạn đang cho chúng tôi biết — được nhóm theo những gì chúng tiết lộ, không theo thứ tự bạn trả lời.",
    patternTitle: "Mô hình mà những câu trả lời của bạn tiết lộ",
    distractorNote: "Đáp án này dễ nhầm vì",
    questionsAnswered: "Câu hỏi đã trả lời",
    incorrectAnswers: "Câu trả lời chưa đúng",
    patternsFound: "Điểm yếu tìm thấy",
    reviewWrongAnswers: "Xem lại câu trả lời của tôi",
    retakeTest: "Làm lại bài kiểm tra",
    yourWeakLink: "Điểm yếu quan trọng nhất của bạn",
    whatYouUnlock: "Những gì bạn đạt được khi khắc phục",
    honestTimelineLabel: "Lộ trình thực tế",
    noPatternsFound: "Chưa đủ dữ liệu để xác định mô hình rõ ràng.",
    allFilter: "Tất cả",
    radarCaption: "Không có hai người học nào có cùng hình dạng. Đây là của bạn.",
  }
};
