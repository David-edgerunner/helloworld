import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// ITEM BANK — 100 items with full IRT parameters
// ═══════════════════════════════════════════════════════════════
const ITEM_BANK = [{"item_id": "39a5364c-c9bf-4b26-910b-b1bf988d98c1", "stem": "She ______ to school every day by bus.", "options": ["go", "goes", "going", "gone"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.8, "irt_c_param": 0.25, "explanation_text": "With 'she' (third person singular), present simple verbs add -s or -es. 'She goes' is correct. Vietnamese doesn't change verb forms for different subjects, so this is a common area to practise.", "distractor_traps": {"0": "L1 transfer: Vietnamese verbs don't conjugate \u2014 'go' feels complete without the -s", "2": "Confuses present simple with present continuous form", "3": "Past participle form \u2014 unrelated to present habitual meaning"}, "goal_tags": ["A", "B", "C", "D", "E"]}, {"item_id": "616ab857-2257-4c14-9239-f4b9f904455e", "stem": "I ______ my homework before dinner yesterday.", "options": ["finish", "finished", "have finished", "am finishing"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "A2", "irt_a_param": 0.9, "irt_b_param": -1.6, "irt_c_param": 0.25, "explanation_text": "'Yesterday' tells us this happened in the past and is complete. Past simple ('finished') is the right choice. 'Have finished' (present perfect) connects past to present, but 'yesterday' anchors this firmly in the past.", "distractor_traps": {"0": "L1 transfer: Vietnamese uses time words instead of verb changes \u2014 'finish' + 'yesterday' feels complete", "2": "Present perfect \u2014 tempting because it involves a completed action, but 'yesterday' blocks it", "3": "Present continuous \u2014 wrong time frame entirely"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "54a8bfc5-fa70-4ed3-9960-d01ffe37551a", "stem": "Look! The children ______ in the park right now.", "options": ["play", "plays", "are playing", "played"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.5, "irt_c_param": 0.22, "explanation_text": "'Look!' and 'right now' signal something happening at this moment. Present continuous (are + verb-ing) describes actions in progress. 'Are playing' matches the ongoing action.", "distractor_traps": {"0": "L1 transfer: Vietnamese uses '\u0111ang' for ongoing actions but the verb itself doesn't change", "1": "Third person -s applied to a plural subject", "3": "Past simple \u2014 contradicts 'right now'"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "2823c03a-e72c-4116-9446-a35a08949fc0", "stem": "I ______ in this company for three years, and I still enjoy the work.", "options": ["work", "worked", "have worked", "had worked"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": -0.4, "irt_c_param": 0.2, "explanation_text": "'For three years' + 'still enjoy' tells us the action started in the past and continues now. Present perfect ('have worked') connects past to present. Past simple would mean you no longer work there.", "distractor_traps": {"0": "L1 transfer: Vietnamese '\u0111\u00e3...\u0111\u01b0\u1ee3c 3 n\u0103m' doesn't require a special verb form", "1": "Past simple \u2014 implies the job ended, which contradicts 'still enjoy'", "3": "Past perfect \u2014 used for an action before another past action, not for a connection to now"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "abe5db8a-a23f-45d1-b299-75cd151870d3", "stem": "When I called her, she said she ______ dinner for her family.", "options": ["cooks", "cooked", "was cooking", "has cooked"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.2, "irt_c_param": 0.2, "explanation_text": "The cooking was in progress at the moment of the phone call. Past continuous ('was cooking') shows an action that was ongoing when another past action interrupted it. 'Cooked' would mean the cooking was already finished.", "distractor_traps": {"0": "Wrong time frame \u2014 present tense inside past reporting", "1": "Past simple \u2014 implies the cooking was complete, losing the 'in progress' meaning", "3": "Present perfect \u2014 can't be used inside past-tense reported speech without shifting to past perfect"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "6c66af79-463f-497a-b01e-8067192ab4ff", "stem": "The train ______ at 6:15 tomorrow morning. Please don't be late.", "options": ["leaves", "will leave", "is leaving", "left"], "correct_choice": 0, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "B1", "irt_a_param": 1.4, "irt_b_param": 0, "irt_c_param": 0.2, "explanation_text": "Scheduled timetable events (trains, flights, classes) use present simple even when they're in the future. 'The train leaves at 6:15' treats the departure as a fixed schedule. 'Will leave' and 'is leaving' are grammatically possible but less natural for timetabled events.", "distractor_traps": {"1": "Logical but less natural: 'will leave' works for predictions, but timetables prefer present simple", "2": "Present continuous for future \u2014 works for personal plans but not fixed schedules", "3": "Past simple \u2014 contradicts 'tomorrow'"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "511261ae-5c7a-40fc-b55a-a8f7a79bf9d7", "stem": "She ______ three different countries before she turned twenty-five.", "options": ["visits", "visited", "has visited", "had visited"], "correct_choice": 3, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.1, "irt_c_param": 0.2, "explanation_text": "Two past events need ordering: visiting countries happened before turning twenty-five. Past perfect ('had visited') marks the earlier event. Both events are complete and in the past, so present perfect doesn't apply here.", "distractor_traps": {"0": "Wrong time frame entirely", "1": "Past simple \u2014 technically communicates the meaning, but misses the 'before another past event' relationship that B1 learners need to master", "2": "Present perfect \u2014 tempting because of 'experience' meaning, but 'before she turned' anchors both events in finished past time"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "3e7a9eb3-ca76-448c-9856-d0b0a86c773e", "stem": "By this time next year, I hope I ______ enough money to travel abroad.", "options": ["save", "saved", "will save", "will have saved"], "correct_choice": 3, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "B1", "irt_a_param": 1.4, "irt_b_param": 0.3, "irt_c_param": 0.18, "explanation_text": "'By this time next year' sets a future deadline. Future perfect ('will have saved') describes something that will be complete before a point in the future. It means: between now and then, the saving will be finished.", "distractor_traps": {"0": "L1 transfer: Vietnamese doesn't mark future completion differently from future action", "1": "Past simple \u2014 wrong time frame", "2": "Future simple \u2014 'will save' talks about the action but doesn't emphasise completion before the deadline"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "36057cbd-3995-40c8-bded-117b4b026b55", "stem": "The scientists announced that they ______ a new species in the Amazon, though peer review of their findings is still ongoing.", "options": ["discover", "discovered", "had discovered", "have discovered"], "correct_choice": 3, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.7, "irt_c_param": 0.18, "explanation_text": "The discovery happened in the past but its relevance continues \u2014 the peer review is 'still ongoing.' Present perfect ('have discovered') connects the past event to its present significance. Past perfect would over-distance the event, and past simple would ignore the ongoing relevance.", "distractor_traps": {"0": "Wrong time frame", "1": "Past simple \u2014 grammatically acceptable but loses the present-relevance connection that 'still ongoing' demands", "2": "Past perfect \u2014 implies the discovery is distanced and complete, which contradicts the active peer review"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "d8aab118-b24f-4334-b0c2-7740bb225b38", "stem": "The committee ______ the proposal for over two hours when the chairperson finally called for a vote.", "options": ["discussed", "was discussing", "had been discussing", "has been discussing"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "B2", "irt_a_param": 1.6, "irt_b_param": 0.9, "irt_c_param": 0.18, "explanation_text": "Past perfect continuous ('had been discussing') shows a prolonged action that was in progress before another past event. The discussion was ongoing for two hours, then the vote happened. This combines duration ('for over two hours') with the before-another-past-event relationship.", "distractor_traps": {"0": "Past simple \u2014 loses the ongoing, prolonged nature of the discussion", "1": "Past continuous \u2014 shows an action in progress but doesn't emphasise the duration or the completed-before-another-event relationship", "3": "Present perfect continuous \u2014 wrong: both events are in the past with no present connection"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "623fda84-083e-43af-93b0-7be0505e5e45", "stem": "The manuscript, which ______ on the editor's desk for six months without comment, was quietly returned to the author.", "options": ["sat", "had sat", "has sat", "had been sitting"], "correct_choice": 3, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.4, "irt_c_param": 0.15, "explanation_text": "Past perfect continuous ('had been sitting') captures both duration ('for six months') and the ongoing nature of the inaction before the return. 'Had sat' is grammatically possible but loses the continuous, neglected quality. The continuous form here carries emotional weight \u2014 it suggests the manuscript was languishing.", "distractor_traps": {"0": "Past simple \u2014 loses the 'before another past event' relationship and the duration emphasis", "1": "Past perfect simple \u2014 grammatically close but loses the continuous, ongoing quality that gives the sentence its tone of neglect", "2": "Present perfect \u2014 the manuscript was returned (past), so present perfect breaks the time frame"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "16a34266-2a5d-4bc4-a4c4-bb7d75886414", "stem": "It is high time the government ______ its approach to renewable energy funding.", "options": ["reconsidered", "reconsiders", "would reconsider", "has reconsidered"], "correct_choice": 0, "skill": "Grammar", "sub_skill": "Verb Tenses", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.6, "irt_c_param": 0.15, "explanation_text": "'It is high time' is a fixed expression that requires past simple \u2014 even though the meaning is about the present or future. This is subjunctive-like usage: the past tense signals unreality or urgency, not past time. Similar to 'I wish I knew' (present meaning, past form).", "distractor_traps": {"1": "Logical but wrong: 'reconsiders' matches the present meaning but violates the 'it's time + past' structure", "2": "'Would reconsider' \u2014 conditional form feels right for expressing desire, but 'it's high time' demands past simple specifically", "3": "Present perfect \u2014 sounds formal enough to be tempting at this level, but doesn't follow the fixed pattern"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "f5068030-da68-470a-93d1-dadf6d86d05b", "stem": "If it ______ tomorrow, we will stay at home.", "options": ["rain", "rains", "will rain", "rained"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.4, "irt_c_param": 0.25, "explanation_text": "In first conditional (if + present simple, will + verb), the 'if' clause uses present simple \u2014 not 'will.' 'If it rains, we will stay' is the pattern. The future meaning is already carried by 'will' in the main clause.", "distractor_traps": {"0": "L1 transfer: no conjugation in Vietnamese \u2014 'rain' without -s feels complete", "2": "Common error: putting 'will' in both clauses because both refer to the future", "3": "Past simple \u2014 would create a second conditional meaning (unlikely/hypothetical)"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "138debbe-ec78-4569-94f2-ede6a523ce75", "stem": "If I ______ more time, I would learn another language.", "options": ["have", "had", "will have", "would have"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.3, "irt_c_param": 0.22, "explanation_text": "Second conditional uses 'if + past simple' to describe an unreal or unlikely present situation. 'If I had more time' doesn't mean past \u2014 it means 'but I don't have enough time right now.' The past form signals imagination, not history.", "distractor_traps": {"0": "First conditional pattern \u2014 would make this a real/likely condition, changing the meaning", "2": "'Will have' mixes first conditional into the if-clause \u2014 grammatically impossible", "3": "'Would have' belongs in third conditional (past unreal), not second"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "194d15f4-e24f-4339-b11d-aa6b5ee5782b", "stem": "If she had studied harder, she ______ the exam.", "options": ["will pass", "would pass", "would have passed", "passed"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0, "irt_c_param": 0.2, "explanation_text": "Third conditional: 'if + had + past participle, would have + past participle.' This describes an unreal past \u2014 she didn't study hard enough, and she didn't pass. Both the condition and the result are imagined alternatives to what actually happened.", "distractor_traps": {"0": "First conditional result \u2014 can't pair with 'had studied' (past unreal condition)", "1": "Second conditional result \u2014 'would pass' is for present unreal, but 'had studied' is past unreal", "3": "Past simple \u2014 states a fact rather than an unreal alternative"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "19fe0a4a-1c41-4ae1-be55-2c883bc877c1", "stem": "I wouldn't have known about the job opening if my friend ______ me.", "options": ["doesn't tell", "didn't tell", "hadn't told", "won't tell"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.2, "irt_c_param": 0.2, "explanation_text": "'Wouldn't have known' is the third conditional result. The matching condition needs 'if + had + past participle' \u2014 'hadn't told.' The friend did tell you (that's why you know), and this sentence imagines the alternative: what if they hadn't?", "distractor_traps": {"0": "Present simple \u2014 wrong time frame for a past unreal condition", "1": "Past simple \u2014 this is the second conditional 'if' pattern, but the result clause ('wouldn't have known') demands third conditional", "3": "Future \u2014 entirely wrong time frame"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "71773c8d-2318-4b30-9292-1564655cb425", "stem": "If the researchers ______ the sample size, the results might have been more reliable \u2014 but the funding had already been cut.", "options": ["increased", "had increased", "would increase", "could increase"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "'Might have been' in the result clause signals third conditional (past unreal). The condition needs 'had + past participle.' The final clause ('the funding had already been cut') confirms this is a past situation that can't be changed \u2014 pure counterfactual.", "distractor_traps": {"0": "Past simple \u2014 tempting because it's past, but it doesn't signal the 'unreal' quality that the counterfactual demands", "2": "'Would increase' \u2014 conditional mood but wrong form for a past counterfactual", "3": "'Could increase' \u2014 expresses ability/possibility but doesn't match the past unreal structure"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "7bead928-f580-48cb-8909-a7029a3e6cb8", "stem": "______ I in your position, I would request a formal review of the decision.", "options": ["Am", "Was", "Were", "Being"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "B2", "irt_a_param": 1.6, "irt_b_param": 1, "irt_c_param": 0.18, "explanation_text": "This is an inverted second conditional: 'Were I in your position' replaces 'If I were in your position.' In formal English, 'were' is used for all subjects in subjunctive/hypothetical constructions \u2014 'were I,' 'were he,' 'were she.' The inversion drops 'if' and moves 'were' to the front.", "distractor_traps": {"0": "'Am' \u2014 real present, but the sentence is hypothetical", "1": "'Was' \u2014 commonly used in informal speech but incorrect in this formal inverted structure, which requires subjunctive 'were'", "3": "'Being' \u2014 present participle doesn't work in conditional inversion"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "2802a054-d2a0-41f5-a24a-4f12fce4a00d", "stem": "But for the timely intervention of the central bank, the currency ______ far more sharply than it did.", "options": ["would depreciate", "had depreciated", "would have depreciated", "deprecated"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.5, "irt_c_param": 0.15, "explanation_text": "'But for' means 'if it were not for' or 'if it had not been for.' Here, 'than it did' confirms this is past. So: 'But for X, Y would have happened' \u2014 third conditional without 'if.' 'Would have depreciated' is the past counterfactual result.", "distractor_traps": {"0": "'Would depreciate' \u2014 second conditional result (present unreal), but 'than it did' makes this past", "1": "'Had depreciated' \u2014 past perfect states a fact rather than a counterfactual", "3": "'Deprecated' \u2014 wrong word entirely (deprecated means outdated/disapproved, not decreased in value)"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "54a57843-895d-4e8b-9590-97eaf9f55b85", "stem": "The project would never have succeeded ______ the team abandoned their original methodology halfway through.", "options": ["if", "had", "unless", "should"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Conditionals", "cefr_difficulty": "C1", "irt_a_param": 1.9, "irt_b_param": 1.7, "irt_c_param": 0.15, "explanation_text": "This is inverted third conditional with an unusual meaning: the project succeeded because they did abandon the old methodology. 'Had the team abandoned' = 'if the team had not abandoned' is wrong \u2014 actually, 'had' here introduces the positive condition. The tricky part: this reads as 'the project succeeded, and the reason is that they changed methodology.' Inversion with 'had' replaces 'if...had.'", "distractor_traps": {"0": "'If' works semantically but requires restructuring: 'if the team had not abandoned' \u2014 the sentence as written uses inversion, which drops 'if'", "2": "'Unless' changes the logical meaning \u2014 'unless they abandoned' means 'if they did not abandon,' which reverses the intended condition", "3": "'Should' is used for future-possibility inversion ('should you need help'), not past counterfactual"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "da96436c-839c-481b-9edb-122966adfc17", "stem": "Can you pass me ______ salt, please?", "options": ["a", "an", "the", "\u2014"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Articles", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.5, "irt_c_param": 0.25, "explanation_text": "'The salt' refers to a specific salt \u2014 the one on the table that both speakers can see. 'The' is used when both people know which specific thing is meant. Vietnamese doesn't have articles, so this is about building a new habit: if both people know which one, use 'the.'", "distractor_traps": {"0": "'A' \u2014 used for non-specific things ('a restaurant'), not when pointing to a specific one", "1": "'An' \u2014 same as 'a' but before vowel sounds; still wrong because the salt is specific", "3": "No article \u2014 Vietnamese doesn't use articles, so dropping them entirely is the strongest L1 transfer error"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "7af55fec-0613-4252-a196-705d76f54c4f", "stem": "My sister is ______ doctor. She works at the city hospital.", "options": ["a", "an", "the", "\u2014"], "correct_choice": 0, "skill": "Grammar", "sub_skill": "Articles", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.3, "irt_c_param": 0.25, "explanation_text": "'A doctor' describes her profession \u2014 she is one of many doctors. We use 'a/an' when introducing what someone is or what something is for the first time. The second sentence uses 'the' because now we're talking about a specific hospital.", "distractor_traps": {"1": "'An' \u2014 wrong because 'doctor' starts with a consonant sound", "2": "'The' \u2014 would mean a specific, unique doctor that both people already know about", "3": "No article \u2014 direct L1 transfer from Vietnamese where 'ch\u1ecb t\u00f4i l\u00e0 b\u00e1c s\u0129' has no article"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "07ef5b17-88b7-4217-b265-fd33b3db734d", "stem": "______ advice she gave me turned out to be very useful.", "options": ["A", "An", "The", "\u2014"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Articles", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.2, "irt_c_param": 0.22, "explanation_text": "'The advice she gave me' is specific \u2014 it's defined by 'she gave me.' When a noun is followed by a phrase that identifies exactly which one we mean, it takes 'the.' Note: 'advice' is uncountable in English, so 'a advice' is impossible.", "distractor_traps": {"0": "'A' \u2014 impossible: 'advice' is uncountable ('a piece of advice' works, but 'a advice' doesn't)", "1": "'An' \u2014 same problem: uncountable noun", "3": "No article \u2014 the defining clause 'she gave me' makes this specific, requiring 'the'"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "ea880fca-8e5d-42dc-9487-2231fd300566", "stem": "______ happiness is something everyone wants, but few people agree on what it means.", "options": ["A", "The", "\u2014", "An"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Articles", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0, "irt_c_param": 0.2, "explanation_text": "Abstract concepts used in a general sense (happiness, love, freedom, education) take no article. 'Happiness is something everyone wants' talks about happiness in general \u2014 not a specific happiness. If we said 'the happiness I felt,' the defining phrase would make it specific.", "distractor_traps": {"0": "'A' \u2014 'happiness' is uncountable and abstract", "1": "'The' \u2014 would make this about a specific instance of happiness, but the sentence discusses the concept generally", "3": "'An' \u2014 uncountable noun, same issue as 'a'"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "d5779125-791a-464b-a217-334448f3c1cb", "stem": "The research examines ______ role of social media in shaping public opinion during election campaigns.", "options": ["a", "the", "\u2014", "an"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Articles", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.6, "irt_c_param": 0.18, "explanation_text": "'The role of X in Y' is a specific construction: the role is defined and limited by 'of social media in shaping public opinion.' Academic English frequently uses 'the' before nouns that are specified by a following 'of' phrase. This is a pattern worth internalising for academic writing.", "distractor_traps": {"0": "'A role' \u2014 implies one of several possible roles, which weakens the academic precision of the sentence", "2": "No article \u2014 in academic writing, 'role of X in Y' nearly always requires 'the' because the 'of' phrase makes it specific", "3": "'An' \u2014 wrong because 'role' starts with a consonant sound"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "0b63ab49-084d-4b61-b527-9c2ff2f8ef22", "stem": "______ elderly are disproportionately affected by cuts to public healthcare funding.", "options": ["An", "The", "\u2014", "Some"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Articles", "cefr_difficulty": "C1", "irt_a_param": 1.6, "irt_b_param": 1.3, "irt_c_param": 0.15, "explanation_text": "'The + adjective' can refer to an entire group of people: the elderly, the homeless, the unemployed, the young. This is formal usage \u2014 it means 'elderly people as a category.' Without 'the,' the adjective has no noun function. This pattern is common in academic and policy writing.", "distractor_traps": {"0": "'An elderly' \u2014 would need a noun after it ('an elderly person'); 'elderly' alone as a noun requires 'the'", "2": "No article \u2014 'elderly' without 'the' is just an adjective floating without a noun", "3": "'Some elderly' \u2014 would need a noun ('some elderly people'); also shifts meaning from the category to an unspecified subset"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "7340ab83-8193-4306-9929-9670f4c3d661", "stem": "The meeting is ______ Monday at 10 o'clock.", "options": ["in", "on", "at", "to"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Prepositions", "cefr_difficulty": "A2", "irt_a_param": 0.9, "irt_b_param": -1.6, "irt_c_param": 0.25, "explanation_text": "Days of the week use 'on': on Monday, on Friday, on Saturday. Times use 'at': at 10 o'clock. Months and years use 'in': in March, in 2026. This on/at/in pattern for time is one of the most useful to memorise.", "distractor_traps": {"0": "'In' \u2014 used for months, years, and longer periods, not specific days", "2": "'At' \u2014 used for clock times and specific points ('at noon'), not days", "3": "'To' \u2014 doesn't indicate time position"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "68e9bacb-448b-417b-ac06-ea654a10978c", "stem": "She has lived in Ho Chi Minh City ______ 2019.", "options": ["for", "since", "from", "during"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Prepositions", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.2, "irt_c_param": 0.22, "explanation_text": "'Since' is used with a specific starting point (2019, Monday, January). 'For' is used with a duration (three years, two weeks). She has lived there since 2019 = from 2019 until now. 'For' would need a time period: 'for five years.'", "distractor_traps": {"0": "'For' \u2014 requires a duration ('for five years'), not a starting point", "2": "'From' \u2014 needs a matching 'to' ('from 2019 to 2024'), and implies the action ended", "3": "'During' \u2014 describes when within a period ('during the summer'), not a starting point"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "2c2112e6-b4d3-45da-be64-5f627398d066", "stem": "The company's success depends ______ the quality of its customer service.", "options": ["in", "on", "for", "with"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Prepositions", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.1, "irt_c_param": 0.2, "explanation_text": "'Depend on' is a fixed verb-preposition combination. English has many of these: rely on, consist of, result in, contribute to. They must be memorised because the preposition choice doesn't follow a logical rule.", "distractor_traps": {"0": "'Depend in' \u2014 L1 transfer from Vietnamese 'ph\u1ee5 thu\u1ed9c v\u00e0o' where 'v\u00e0o' can map to several English prepositions", "2": "'Depend for' \u2014 confused with 'responsible for'", "3": "'Depend with' \u2014 no such combination exists"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "69f9be8a-f70c-40d4-8bdd-ca8918183c5b", "stem": "She apologised ______ being late to the meeting and promised it wouldn't happen again.", "options": ["about", "for", "of", "to"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Prepositions", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": 0.1, "irt_c_param": 0.2, "explanation_text": "'Apologise for' is the correct combination. You apologise for something (the action) and apologise to someone (the person). Here, 'for being late' describes what she apologised about.", "distractor_traps": {"0": "'About' \u2014 commonly used with 'sorry about,' which makes 'apologise about' feel natural, but it's non-standard", "2": "'Of' \u2014 confused with 'accused of' or 'aware of'", "3": "'To' \u2014 'apologise to' takes a person, not an action"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "51e103a7-c5a3-4d51-8499-9ca0f810dd99", "stem": "The report draws attention ______ the gap between policy intention and actual implementation in rural areas.", "options": ["at", "for", "on", "to"], "correct_choice": 3, "skill": "Grammar", "sub_skill": "Prepositions", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.7, "irt_c_param": 0.18, "explanation_text": "'Draw attention to' is a fixed academic collocation meaning to highlight or emphasise something. In academic and professional writing, these fixed phrases ('in accordance with,' 'with regard to,' 'in response to') are essential and must be learned as complete units.", "distractor_traps": {"0": "'Draw attention at' \u2014 confused with 'look at'", "1": "'Draw attention for' \u2014 confused with 'call for attention'", "2": "'Draw attention on' \u2014 confused with 'focus on'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "b30f2e3d-f1d1-4280-b747-c402a7e194ec", "stem": "The policy was implemented ______ the objections of several senior advisors, which later proved to be well-founded.", "options": ["against", "despite", "notwithstanding", "regardless"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Prepositions", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.4, "irt_c_param": 0.15, "explanation_text": "'Notwithstanding' is a formal preposition meaning 'despite' or 'in spite of.' It's followed directly by a noun phrase ('notwithstanding the objections'). 'Despite' also works grammatically, but 'notwithstanding' is specifically tested at C1 for its formal register. 'Regardless' needs 'of' to function as a preposition.", "distractor_traps": {"0": "'Against' \u2014 means in opposition to, but doesn't carry the concessive meaning of 'despite/even though'", "1": "'Despite' \u2014 semantically correct and grammatically fine, but this item specifically tests whether learners recognise 'notwithstanding' as the more formal equivalent in academic/legal writing", "3": "'Regardless' \u2014 needs 'of' ('regardless of the objections') to be grammatically correct as a preposition"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "9bdb8316-46cc-409c-a016-b2fdfd0fe0d4", "stem": "You ______ have told me earlier \u2014 I could have helped you with the project.", "options": ["must", "should", "would", "can"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Modal Verbs", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0, "irt_c_param": 0.2, "explanation_text": "'Should have + past participle' expresses regret or criticism about the past \u2014 something that was the right thing to do but didn't happen. 'You should have told me' means: telling me was the right thing, but you didn't do it. 'Must have' would mean certainty about the past, not regret.", "distractor_traps": {"0": "'Must have told' \u2014 expresses certainty ('I'm sure you told me'), not criticism about a missed action", "2": "'Would have told' \u2014 part of a conditional ('would have told me if...'), not a standalone criticism", "3": "'Can have told' \u2014 not a natural English construction"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "2e23efcc-5a57-4f40-b15c-cd263d829e51", "stem": "The restaurant ______ be good \u2014 there's always a long queue outside.", "options": ["can", "must", "should", "would"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Modal Verbs", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.1, "irt_c_param": 0.22, "explanation_text": "'Must' here expresses logical deduction \u2014 you're drawing a conclusion from evidence (the long queue). 'It must be good' means 'based on what I can see, I'm fairly certain it's good.' This is different from 'must' meaning obligation ('you must arrive by 9').", "distractor_traps": {"0": "'Can be good' \u2014 expresses possibility, not deduction from evidence", "2": "'Should be good' \u2014 expresses expectation, weaker than the certainty the evidence supports", "3": "'Would be good' \u2014 conditional/hypothetical, not a conclusion from evidence"}, "goal_tags": ["A", "C", "D", "E"]}, {"item_id": "ee870495-9023-44cb-969f-cc5f50ecc4ae", "stem": "The results ______ have been affected by the unusually small sample size, though the authors do not acknowledge this limitation.", "options": ["should", "might", "must", "will"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Modal Verbs", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "'Might have been affected' expresses possibility about the past \u2014 the small sample size may or may not have influenced the results. 'Must have' would be too certain (we don't know for sure), and 'should have' implies criticism rather than uncertainty.", "distractor_traps": {"0": "'Should have been affected' \u2014 implies obligation or expectation, not possibility", "2": "'Must have been affected' \u2014 too certain; the sentence hedges with 'though the authors do not acknowledge,' suggesting this is a possibility, not a certainty", "3": "'Will have been affected' \u2014 future perfect, wrong time frame entirely"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "d1d1d7af-43be-4e9f-a7d1-686907faaf27", "stem": "The ambassador's remarks, which ______ have been intended as diplomatic reassurance, were widely interpreted as a veiled threat.", "options": ["may well", "should", "would rather", "had better"], "correct_choice": 0, "skill": "Grammar", "sub_skill": "Modal Verbs", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.5, "irt_c_param": 0.15, "explanation_text": "'May well have been intended' expresses concessive possibility \u2014 it's quite likely the intention was diplomatic, but the effect was the opposite. 'May well' is stronger than 'may' alone and carries a tone of 'even if this is true, it doesn't matter because...' This is sophisticated hedging common in political and academic analysis.", "distractor_traps": {"1": "'Should have been intended' \u2014 implies the remarks failed at their purpose (criticism), but the sentence is analysing perception, not judging intention", "2": "'Would rather have been intended' \u2014 'would rather' expresses preference, not possibility", "3": "'Had better have been intended' \u2014 'had better' is a warning about consequences, not an analysis of possibility"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "10fac7d4-f5bb-4cb4-8d58-6316ef44dae6", "stem": "Not only ______ the deadline, but she also delivered work of exceptional quality.", "options": ["she met", "she did meet", "did she meet", "has she met"], "correct_choice": 2, "skill": "Grammar", "sub_skill": "Sentence Structure", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.2, "irt_c_param": 0.2, "explanation_text": "'Not only' at the start of a clause triggers subject-verb inversion. Normal order: 'She met the deadline.' Inverted: 'Not only did she meet the deadline.' The auxiliary 'did' moves before the subject. This pattern makes sentences more emphatic and is common in formal writing.", "distractor_traps": {"0": "Normal word order \u2014 correct meaning but ignores the inversion required by 'not only' at the start", "1": "Emphatic 'did' but without inversion \u2014 'she did meet' keeps normal subject-verb order", "3": "Present perfect with inversion \u2014 wrong tense for a completed past event paired with 'delivered'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "ed56206b-c925-4c91-85c4-7fd190534c33", "stem": "The proposal, ______ had taken the team six months to develop, was rejected in under five minutes.", "options": ["that", "which", "what", "it"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Sentence Structure", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.6, "irt_c_param": 0.18, "explanation_text": "The clause between the commas is a non-defining relative clause \u2014 it adds extra information about the proposal. Non-defining clauses use 'which,' not 'that.' The commas are the signal: with commas = 'which'; without commas = 'that' or 'which.'", "distractor_traps": {"0": "'That' \u2014 used in defining relative clauses (no commas), not non-defining ones", "2": "'What' \u2014 introduces noun clauses ('what he said'), not relative clauses modifying a named noun", "3": "'It' \u2014 would create a run-on sentence, not a relative clause"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "b9d75a4a-519e-48c2-a878-667e5d1888db", "stem": "______ impressive the initial results appeared, the methodology was later found to contain serious flaws.", "options": ["Despite", "Although", "However", "No matter how"], "correct_choice": 3, "skill": "Grammar", "sub_skill": "Sentence Structure", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.9, "irt_c_param": 0.18, "explanation_text": "'No matter how + adjective + subject + verb' is a concessive structure: 'no matter how impressive the results appeared.' It means 'regardless of how impressive they seemed.' 'Although' would need 'although the results appeared impressive' \u2014 different word order.", "distractor_traps": {"0": "'Despite' \u2014 needs a noun or gerund ('despite the impressive results'), not an adjective clause", "1": "'Although' \u2014 needs normal clause order ('although the results appeared impressive'), not adjective-first", "2": "'However' \u2014 can mean 'no matter how' in formal English ('however impressive'), but in modern usage this is archaic and the more natural construction is 'no matter how'"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "1334812d-d906-41b8-a58b-e924098ac267", "stem": "Rarely ______ a single policy shift generated such widespread public debate across the political spectrum.", "options": ["does", "has", "had", "is"], "correct_choice": 1, "skill": "Grammar", "sub_skill": "Sentence Structure", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.3, "irt_c_param": 0.15, "explanation_text": "Negative adverbs at the start of a sentence (rarely, never, seldom, hardly) trigger inversion. 'Rarely has a single policy shift generated...' = 'A single policy shift has rarely generated...' The present perfect 'has generated' is correct because the debate is ongoing.", "distractor_traps": {"0": "'Does' \u2014 would require base form 'generate' and present simple, which doesn't match the ongoing nature of the debate", "2": "'Had' \u2014 past perfect would imply this is before another past event, but there's no second past reference", "3": "'Is' \u2014 doesn't collocate with 'generated' and would need passive construction"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "86056459-04ba-4f22-a093-65c0a37670f1", "stem": "I need to ______ a decision about which university to attend.", "options": ["do", "make", "take", "have"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.4, "irt_c_param": 0.25, "explanation_text": "'Make a decision' is a fixed collocation. English divides 'do' and 'make' in ways that Vietnamese ('l\u00e0m') doesn't: 'make' is for creating or producing something (make a decision, make a mistake, make progress), while 'do' is for tasks and activities (do homework, do research, do business).", "distractor_traps": {"0": "L1 transfer: Vietnamese 'l\u00e0m' covers both 'do' and 'make'", "2": "'Take a decision' exists in British formal usage but is much less common and not standard for learners", "3": "'Have a decision' \u2014 not a standard English collocation"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "cb887625-845a-45cb-876a-4a7493e2ed1a", "stem": "Could you please ______ me a favour and send this email?", "options": ["make", "do", "give", "take"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.2, "irt_c_param": 0.25, "explanation_text": "'Do someone a favour' is the correct collocation. This is one of the 'do' collocations: do a favour, do your best, do the dishes, do someone a service. These must be memorised as pairs.", "distractor_traps": {"0": "'Make a favour' \u2014 L1 transfer: Vietnamese 'l\u00e0m \u01a1n' maps more naturally to 'make'", "2": "'Give a favour' \u2014 logical but not how English works", "3": "'Take a favour' \u2014 not a standard collocation"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "0be96527-1ac5-45f1-9dd9-52755e46a7c1", "stem": "The new employee made a very good ______ on her first day at the office.", "options": ["impression", "expression", "impact", "opinion"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.2, "irt_c_param": 0.22, "explanation_text": "'Make an impression' is the correct collocation \u2014 it means to create a particular feeling or image in other people's minds. 'Make an impact' exists but means to have a significant effect, which is too strong for a first day at work.", "distractor_traps": {"1": "'Expression' sounds similar to 'impression' \u2014 a common confusion for learners", "2": "'Impact' \u2014 'make an impact' exists but means something much stronger and broader", "3": "'Opinion' \u2014 you 'form' or 'have' an opinion, not 'make' one in this context"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "c17d2a1e-cc01-49da-8097-c7cf83aae747", "stem": "The government plans to ______ measures to reduce air pollution in major cities.", "options": ["do", "implement", "make", "set"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.1, "irt_c_param": 0.2, "explanation_text": "'Implement measures' is the standard formal collocation. 'Implement' means to put a plan or decision into action. In academic and news English, 'implement' pairs with: measures, policies, strategies, changes, reforms.", "distractor_traps": {"0": "'Do measures' \u2014 L1 transfer from Vietnamese 'th\u1ef1c hi\u1ec7n' which could map to 'do'", "2": "'Make measures' \u2014 sounds plausible but 'make' doesn't pair with 'measures' in standard English", "3": "'Set measures' \u2014 'set' pairs with 'standards,' 'goals,' 'targets' \u2014 not 'measures'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "665d8d09-42a2-4227-90b2-2002991daa37", "stem": "We need to ______ advantage of the low prices before they go up again.", "options": ["make", "get", "take", "have"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": 0, "irt_c_param": 0.22, "explanation_text": "'Take advantage of' is a fixed three-word collocation meaning to use an opportunity. The full pattern: take advantage of + noun/gerund. Similar fixed patterns: take part in, take care of, take responsibility for.", "distractor_traps": {"0": "'Make advantage' \u2014 not a standard English collocation", "1": "'Get advantage' \u2014 not standard; confused with 'get ahead' or 'gain an advantage'", "3": "'Have advantage' \u2014 'have an advantage' exists (meaning to possess one), but 'have advantage of' as a phrasal expression doesn't"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "a6e2ee98-fb89-4392-91b9-fe23db6f983d", "stem": "The findings ______ serious doubts about the effectiveness of the current approach to urban planning.", "options": ["make", "give", "raise", "put"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.6, "irt_c_param": 0.18, "explanation_text": "'Raise doubts' is the academic collocation. In formal English, you raise doubts, raise concerns, raise questions, raise awareness, and raise issues. 'Raise' in this sense means to bring something to attention \u2014 not to lift physically.", "distractor_traps": {"0": "'Make doubts' \u2014 not a standard collocation in any register", "1": "'Give doubts' \u2014 informal and non-standard; you can 'give rise to doubts' but not 'give doubts'", "3": "'Put doubts' \u2014 not standard; you can 'cast doubt' but not 'put doubts'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "2a656987-d391-45db-8b8f-1c67dedc2928", "stem": "The study ______ light on why some communities are more resilient to natural disasters than others.", "options": ["throws", "puts", "sheds", "gives"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "'Shed light on' means to make something clearer or easier to understand. This is a very common academic collocation: 'The research sheds light on...' is a standard way to introduce findings. 'Throw light on' exists in British English but is less common.", "distractor_traps": {"0": "'Throws light on' \u2014 exists in British English but is less standard in academic writing than 'sheds'", "1": "'Puts light on' \u2014 not a standard collocation", "3": "'Gives light on' \u2014 not a standard collocation; confused with 'gives insight into'"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "465d3940-b616-409f-979b-89e1922b1fbe", "stem": "The CEO's decision to resign came ______ the wake of a financial scandal that had damaged the company's reputation.", "options": ["on", "at", "in", "by"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.7, "irt_c_param": 0.18, "explanation_text": "'In the wake of' is a fixed expression meaning 'following' or 'as a result of' \u2014 usually something significant or disruptive. Originally nautical (the 'wake' is the trail of water behind a ship), it now means in the aftermath of an event.", "distractor_traps": {"0": "'On the wake' \u2014 not a standard English expression", "1": "'At the wake' \u2014 a 'wake' can be a funeral gathering, creating a confusing alternative meaning", "3": "'By the wake' \u2014 not a standard collocation"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "da1aa99c-b380-4d35-b422-ff9e806073c0", "stem": "The committee reached a decision that, while not universally popular, ______ a reasonable compromise between competing interests.", "options": ["struck", "hit", "made", "found"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.3, "irt_c_param": 0.15, "explanation_text": "'Strike a compromise' is the formal collocation meaning to achieve a balance between opposing positions. You also 'strike a deal,' 'strike a balance,' and 'strike an agreement.' This is distinct from the physical meaning of 'strike.'", "distractor_traps": {"1": "'Hit a compromise' \u2014 'hit' is too informal and aggressive for this context; you can 'hit a snag' but not 'hit a compromise'", "2": "'Made a compromise' \u2014 grammatically possible but less precise; 'made a compromise' is more general, while 'struck a compromise' is the established formal expression", "3": "'Found a compromise' \u2014 acceptable in general English but less idiomatic than 'struck' in formal/academic writing"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "55b1fd7e-0ba3-4b1c-b3b6-3cd133106ddb", "stem": "The evidence presented at the hearing was ______ circumstantial and failed to establish a direct link between the defendant and the crime.", "options": ["deeply", "highly", "purely", "strongly"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Collocations", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.5, "irt_c_param": 0.15, "explanation_text": "'Purely circumstantial' is the standard legal and academic collocation. 'Purely' means entirely or completely, and it collocates with: circumstantial, hypothetical, speculative, academic, coincidental. 'Highly circumstantial' sounds plausible but is non-standard.", "distractor_traps": {"0": "'Deeply circumstantial' \u2014 'deeply' collocates with emotions and qualities (deeply concerned, deeply flawed), not with 'circumstantial'", "1": "'Highly circumstantial' \u2014 'highly' collocates with adjectives like 'unlikely,' 'effective,' 'competitive' \u2014 but not 'circumstantial'", "3": "'Strongly circumstantial' \u2014 'strongly' modifies verbs and some adjectives ('strongly disagree,' 'strongly opposed'), not 'circumstantial'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "ba15d27f-1b69-4e94-8707-0bda62e4e773", "stem": "Please ______ the light. It's too dark in here.", "options": ["turn on", "turn off", "turn up", "turn down"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "A2", "irt_a_param": 0.9, "irt_b_param": -1.5, "irt_c_param": 0.25, "explanation_text": "'Turn on' means to start a device or make something work. 'It's too dark' is the clue \u2014 the light needs to start working. 'Turn off' means stop, 'turn up' means increase, and 'turn down' means decrease.", "distractor_traps": {"1": "'Turn off' \u2014 opposite of what's needed; the darkness means the light is already off", "2": "'Turn up' \u2014 means increase (volume, heat), but a light is either on or off in most contexts", "3": "'Turn down' \u2014 means decrease or reject"}, "goal_tags": ["A", "C", "D", "E"]}, {"item_id": "1482b729-d172-4866-8e47-61635bb4da0f", "stem": "The meeting has been ______ until next Thursday because the director is travelling.", "options": ["put off", "put on", "put up", "put away"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.1, "irt_c_param": 0.22, "explanation_text": "'Put off' means to postpone or delay. 'Until next Thursday' confirms the meeting is being moved to a later date. 'Put on' means to wear or stage an event. 'Put up' means to accommodate someone or display something. 'Put away' means to store.", "distractor_traps": {"1": "'Put on' \u2014 means to organise/stage an event or to wear clothing, not to delay it", "2": "'Put up' \u2014 means to provide accommodation or to erect/display something", "3": "'Put away' \u2014 means to store or tidy, unrelated to scheduling"}, "goal_tags": ["A", "C", "E"]}, {"item_id": "3a36c5e4-2b44-491b-9511-bfc4b85b9f00", "stem": "She promised to ______ the report before Friday so we could review it over the weekend.", "options": ["hand over", "hand in", "hand out", "hand down"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": 0.1, "irt_c_param": 0.22, "explanation_text": "'Hand in' means to submit work to someone in authority \u2014 a report to a boss, homework to a teacher. 'Hand over' means to transfer control. 'Hand out' means to distribute. 'Hand down' means to pass to the next generation.", "distractor_traps": {"0": "'Hand over' \u2014 means to transfer or surrender, not to submit work", "2": "'Hand out' \u2014 means to distribute copies to many people", "3": "'Hand down' \u2014 means to pass traditions, possessions, or legal decisions to the next generation or lower level"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "127e9434-3454-40fd-abee-fc09c64eee6d", "stem": "I was so tired that I ______ asleep during the lecture.", "options": ["fell", "felt", "dropped", "went"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "B1", "irt_a_param": 1.1, "irt_b_param": -0.3, "irt_c_param": 0.22, "explanation_text": "'Fall asleep' is the natural English expression for the moment of going to sleep, especially unintentionally. 'Go to sleep' exists but requires 'to' ('went to sleep'). 'Fell asleep' captures the involuntary, gradual nature of falling into sleep.", "distractor_traps": {"1": "'Felt asleep' \u2014 'felt' (from 'feel') sounds very similar to 'fell' and is a common pronunciation-based error", "2": "'Dropped asleep' \u2014 'dropped off' (to sleep) exists informally, but 'dropped asleep' doesn't", "3": "'Went asleep' \u2014 'went to sleep' works, but 'went asleep' without 'to' is non-standard"}, "goal_tags": ["A", "D", "E"]}, {"item_id": "91c51a53-fd84-43ed-90d3-ef49cbfde861", "stem": "After months of investigation, the police finally ______ the source of the illegal activity.", "options": ["tracked down", "ran down", "broke down", "turned down"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.6, "irt_c_param": 0.18, "explanation_text": "'Track down' means to find something or someone after a thorough search. It implies persistent effort over time \u2014 exactly matching 'after months of investigation.' 'Run down' can mean to review a list or to physically deteriorate. 'Break down' means to analyse or to stop functioning.", "distractor_traps": {"1": "'Ran down' \u2014 can mean 'reviewed' or 'pursued,' which is close enough to be confusing, but doesn't mean 'found after searching'", "2": "'Broke down' \u2014 means to analyse into parts or to stop functioning, not to discover", "3": "'Turned down' \u2014 means to reject or decrease volume"}, "goal_tags": ["A", "C", "D", "E"]}, {"item_id": "db809098-01b7-416c-8c44-c8b635686501", "stem": "The charity's annual report ______ the need for more volunteers in rural healthcare facilities.", "options": ["brought out", "brought up", "brought about", "brought forward"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "'Bring up' means to raise or mention a topic for discussion. In formal contexts, reports and studies 'bring up' issues or concerns. 'Bring about' means to cause something to happen. 'Bring out' means to release or reveal. 'Bring forward' means to reschedule earlier.", "distractor_traps": {"0": "'Brought out' \u2014 means to reveal or release (a product), not to raise a topic", "2": "'Brought about' \u2014 means to cause something, not to mention or highlight it", "3": "'Brought forward' \u2014 means to move a date/event earlier"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "6a4886fc-fa33-4ad9-8460-ee7a8157393d", "stem": "The government's attempt to ______ public criticism by releasing the data selectively only intensified the backlash.", "options": ["fend off", "put off", "call off", "write off"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.3, "irt_c_param": 0.15, "explanation_text": "'Fend off' means to defend against or deflect an attack, criticism, or unwanted attention. It implies active resistance against something threatening. The government tried to deflect criticism, but the attempt backfired. 'Put off' means to delay. 'Call off' means to cancel. 'Write off' means to dismiss as worthless.", "distractor_traps": {"1": "'Put off' \u2014 means to postpone, which doesn't match defending against criticism", "2": "'Call off' \u2014 means to cancel an event or activity, not to deflect criticism", "3": "'Write off' \u2014 means to dismiss something as a loss, which is close but lacks the defensive, active quality of 'fend off'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "2f351160-35cb-4c79-a084-12bece690484", "stem": "The negotiations ______ when both sides refused to make concessions on the territorial dispute.", "options": ["fell through", "fell apart", "fell behind", "fell out"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Phrasal Verbs", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.5, "irt_c_param": 0.15, "explanation_text": "'Fell apart' means to collapse or disintegrate \u2014 used for plans, relationships, negotiations, and structures that completely break down. 'Fell through' is very close in meaning but typically describes plans or deals that fail to materialise rather than active collapse. The key distinction: 'fell apart' suggests disintegration; 'fell through' suggests failure to complete.", "distractor_traps": {"0": "'Fell through' \u2014 means a plan or deal failed to happen, very close but implies passive failure rather than active collapse from conflict", "2": "'Fell behind' \u2014 means to lag or not keep pace, unrelated to collapse", "3": "'Fell out' \u2014 means to quarrel; the people fell out, but the negotiations fell apart"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "0ee11595-81b3-4b70-8682-030dbe906148", "stem": "The film was really ______. I almost fell asleep in the cinema.", "options": ["boring", "bored", "bore", "boredom"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Word Formation", "cefr_difficulty": "A2", "irt_a_param": 1, "irt_b_param": -1.3, "irt_c_param": 0.25, "explanation_text": "'-ing' adjectives describe the thing that causes a feeling: the film was boring (it caused boredom). '-ed' adjectives describe the person feeling it: I was bored. This -ing/-ed distinction doesn't exist in Vietnamese, making it one of the most important patterns to master.", "distractor_traps": {"1": "'Bored' \u2014 describes the person's feeling, not the film's quality; 'the film was bored' would mean the film felt boredom", "2": "'Bore' \u2014 the verb form, not an adjective", "3": "'Boredom' \u2014 a noun; grammatically wrong after 'was really'"}, "goal_tags": ["A", "D", "E"]}, {"item_id": "ef3f5502-1a9d-452a-b88d-829b4c85570e", "stem": "The ______ of the internet has changed the way people communicate around the world.", "options": ["develop", "development", "developing", "developed"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Word Formation", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.2, "irt_c_param": 0.22, "explanation_text": "After 'the,' we need a noun. 'Development' is the noun form of 'develop.' Common noun-forming suffixes: -ment (development, improvement), -tion (education, information), -ness (happiness, darkness), -ity (possibility, electricity).", "distractor_traps": {"0": "'Develop' \u2014 verb form; can't follow 'the' as the subject of a sentence", "2": "'Developing' \u2014 adjective/present participle; 'the developing of the internet' is non-standard (would need 'the developing internet')", "3": "'Developed' \u2014 adjective/past participle; 'the developed' would refer to developed countries/things, not the process"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "b40f0fd6-efd3-4912-95af-e7ff04249ac1", "stem": "It is ______ to compare the two studies directly because they used different methodologies.", "options": ["meaning", "meaningless", "meaningful", "meaningfully"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Word Formation", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": 0.1, "irt_c_param": 0.2, "explanation_text": "'It is + adjective + to' is the pattern. 'Meaningless' (adjective) means without meaning or purpose. The '-less' suffix creates adjectives meaning 'without': meaningless, homeless, careless, hopeless. The sentence says comparison is pointless because the methodologies differ.", "distractor_traps": {"0": "'Meaning' \u2014 noun or verb form, doesn't fit the 'it is ___ to' adjective slot", "2": "'Meaningful' \u2014 opposite meaning: would say the comparison is valuable, contradicting 'different methodologies'", "3": "'Meaningfully' \u2014 adverb form, not an adjective"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "5188cdf2-57df-43d3-9fdc-c4f504752e55", "stem": "The ______ of the witness's account was called into question when contradictory evidence emerged.", "options": ["reliable", "reliability", "reliably", "reliance"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Word Formation", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.6, "irt_c_param": 0.18, "explanation_text": "'The ______ of X' requires a noun. 'Reliability' is the noun form of 'reliable.' The suffix '-ility' (or '-ability') converts adjectives into abstract nouns: reliable \u2192 reliability, available \u2192 availability, possible \u2192 possibility. 'Reliance' is a different noun meaning 'dependence on.'", "distractor_traps": {"0": "'Reliable' \u2014 adjective, can't fill a noun position after 'the'", "2": "'Reliably' \u2014 adverb form", "3": "'Reliance' \u2014 a real noun but wrong meaning: 'reliance' means dependence, not trustworthiness"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "b99fa6b8-159e-45c2-82f8-cb0544669ab9", "stem": "The report's conclusions were ______ optimistic given the limited scope of the data collected.", "options": ["exceed", "exceeding", "exceedingly", "excessive"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Word Formation", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "'Exceedingly' is an adverb modifying the adjective 'optimistic.' Adverbs modify adjectives: exceedingly optimistic, remarkably accurate, deeply concerned. 'Excessive' is an adjective that would need to replace 'optimistic,' not modify it.", "distractor_traps": {"0": "'Exceed' \u2014 verb form, can't modify an adjective", "1": "'Exceeding' \u2014 present participle/adjective; 'exceeding optimistic' is archaic and non-standard in modern English", "3": "'Excessive' \u2014 adjective; 'excessive optimistic' puts two adjectives together without coordination"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "e91b80ab-13b1-48e7-beeb-9ae379255a89", "stem": "The author's ______ of the data was later criticised for omitting key variables that would have altered the conclusions significantly.", "options": ["interpret", "interpretation", "interpretive", "interpretative"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Word Formation", "cefr_difficulty": "C1", "irt_a_param": 1.6, "irt_b_param": 1.2, "irt_c_param": 0.15, "explanation_text": "'The author's ______ of the data' requires a noun (possessive + noun + of). 'Interpretation' is the correct noun. The C1 challenge here is distinguishing between 'interpretive' and 'interpretative' (both adjectives) and 'interpretation' (noun). All three look similar but serve different grammatical functions.", "distractor_traps": {"0": "'Interpret' \u2014 verb form, can't follow a possessive", "2": "'Interpretive' \u2014 adjective ('interpretive dance,' 'interpretive framework'), wrong word class", "3": "'Interpretative' \u2014 adjective variant of 'interpretive,' still wrong word class for this position"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "946bb083-593c-4d44-b483-bfd44e173925", "stem": "The study was ______ to determine whether exercise improves sleep quality in older adults.", "options": ["conducted", "guided", "directed", "managed"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Academic Word List", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": 0, "irt_c_param": 0.22, "explanation_text": "'Conduct a study/research/experiment' is the standard academic collocation. In academic English, studies are 'conducted,' not 'done' or 'made.' This word appears frequently in IELTS reading passages.", "distractor_traps": {"1": "'Guided' \u2014 means to lead or direct a person, not to carry out research", "2": "'Directed' \u2014 means to manage or point towards; you 'direct' a film or a team, not a study", "3": "'Managed' \u2014 means to handle or oversee operations, not to perform research"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "ddfe5eaf-6323-4d1b-a2aa-8867ee7a46c8", "stem": "There is ______ evidence that regular reading improves vocabulary acquisition in second-language learners.", "options": ["considerate", "considerable", "considered", "considering"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Academic Word List", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.2, "irt_c_param": 0.2, "explanation_text": "'Considerable evidence' means a large amount of evidence. 'Considerable' = large in amount or significant. 'Considerate' means thoughtful towards others \u2014 a completely different word. This is a classic confusion pair for learners.", "distractor_traps": {"0": "'Considerate' \u2014 means kind/thoughtful towards people; it describes behaviour, not quantity", "2": "'Considered' \u2014 means carefully thought about ('a considered opinion'), not large in amount", "3": "'Considering' \u2014 a preposition/conjunction ('considering the evidence'), not an adjective modifying 'evidence'"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "fc7982e9-5f53-4cd6-84c2-991ed032e82c", "stem": "The researchers ______ that cultural factors play a more significant role in language acquisition than previously thought.", "options": ["concluded", "resulted", "achieved", "obtained"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Academic Word List", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.5, "irt_c_param": 0.18, "explanation_text": "'Conclude that...' is the standard academic verb for stating a research finding. You 'conclude' a study, 'conclude' that something is the case. 'Result' doesn't take a 'that' clause in standard usage ('resulted in,' not 'resulted that').", "distractor_traps": {"1": "'Resulted' \u2014 requires 'in' + noun, not 'that' + clause; 'resulted that' is non-standard", "2": "'Achieved' \u2014 means to accomplish a goal, not to reach a research conclusion", "3": "'Obtained' \u2014 means to get or acquire something physical or concrete, not to reach an intellectual conclusion"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "e6db1aa6-3643-4a5a-9e29-4262b3a98efe", "stem": "The government has ______ a new set of regulations aimed at reducing carbon emissions by thirty per cent over the next decade.", "options": ["introduced", "produced", "presented", "demonstrated"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Academic Word List", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.7, "irt_c_param": 0.18, "explanation_text": "'Introduce regulations/legislation/policies' is the standard collocation for when a government creates new rules. 'Produce' means to create a physical product. 'Present' means to show or display. 'Demonstrate' means to prove or show through evidence.", "distractor_traps": {"1": "'Produced' \u2014 means to manufacture or create something tangible", "2": "'Presented' \u2014 means to show to an audience; you present findings, not regulations", "3": "'Demonstrated' \u2014 means to prove or show evidence of something"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "81ece695-48c3-4c91-b998-ea0cfa05c083", "stem": "The theory has been largely ______ by recent empirical evidence, though a small number of researchers continue to defend it.", "options": ["discredited", "discarded", "discontinued", "discouraged"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Academic Word List", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.3, "irt_c_param": 0.15, "explanation_text": "'Discredited' means shown to be false or unreliable through evidence. A theory is 'discredited' when evidence undermines it. 'Discarded' means thrown away \u2014 used for objects or ideas that are abandoned, not proven wrong. The distinction matters in academic writing.", "distractor_traps": {"1": "'Discarded' \u2014 means abandoned or thrown away, which is stronger and more final than 'discredited'; also lacks the evidential meaning", "2": "'Discontinued' \u2014 means stopped being produced or available, used for products or services, not theories", "3": "'Discouraged' \u2014 means advised against or disheartened, not shown to be false"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "12be6b94-231c-48ac-a5b7-ca29b63cb796", "stem": "The author ______ a distinction between voluntary migration and forced displacement, arguing that existing policy frameworks conflate the two.", "options": ["makes", "draws", "takes", "pulls"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Academic Word List", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.5, "irt_c_param": 0.15, "explanation_text": "'Draw a distinction' is the precise academic collocation. In scholarly writing, you 'draw' distinctions, parallels, and comparisons. 'Make a distinction' is acceptable in general English but less precise. At C1, the expectation is to know the more academic form.", "distractor_traps": {"0": "'Makes a distinction' \u2014 acceptable in everyday English but less precise in academic register", "2": "'Takes a distinction' \u2014 not a standard English collocation", "3": "'Pulls a distinction' \u2014 not a standard English collocation"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "6502ac0b-67f2-4255-a6bf-866f22fe4da0", "stem": "I haven't made up my ______ yet about which course to take next semester.", "options": ["brain", "head", "mind", "thought"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Idioms", "cefr_difficulty": "B1", "irt_a_param": 1.1, "irt_b_param": -0.2, "irt_c_param": 0.22, "explanation_text": "'Make up your mind' is a common idiom meaning to decide. The full expression is fixed: make up + possessive + mind. You can't substitute 'brain,' 'head,' or 'thought' \u2014 even though they're all related to thinking.", "distractor_traps": {"0": "'Brain' \u2014 related concept but wrong idiom; 'rack your brain' exists but 'make up your brain' doesn't", "1": "'Head' \u2014 'make up your head' is a direct translation error from some L1s", "3": "'Thought' \u2014 'make up your thought' doesn't exist as an idiom"}, "goal_tags": ["A", "D", "E"]}, {"item_id": "4136913f-4d28-4388-a735-2f69e8cafe82", "stem": "Learning a new language is difficult, but don't give ______. You'll get better with practice.", "options": ["out", "away", "in", "up"], "correct_choice": 3, "skill": "Vocabulary", "sub_skill": "Idioms", "cefr_difficulty": "B1", "irt_a_param": 1.1, "irt_b_param": -0.3, "irt_c_param": 0.22, "explanation_text": "'Give up' means to stop trying or to surrender. It's one of the most essential phrasal verb idioms in English. 'Give in' means to surrender to someone's demands. 'Give out' means to distribute or to stop working. 'Give away' means to donate or reveal.", "distractor_traps": {"0": "'Give out' \u2014 means to distribute or exhaust, not to quit trying", "1": "'Give away' \u2014 means to donate or reveal a secret", "2": "'Give in' \u2014 means to yield to pressure from someone else, slightly different from giving up entirely"}, "goal_tags": ["A", "D", "E"]}, {"item_id": "c657141f-8d0f-4a55-9416-bc54758aa017", "stem": "The new regulations are a ______ in the right direction, though much more needs to be done to address the underlying problem.", "options": ["step", "walk", "move", "jump"], "correct_choice": 0, "skill": "Vocabulary", "sub_skill": "Idioms", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.5, "irt_c_param": 0.18, "explanation_text": "'A step in the right direction' is a fixed idiom meaning a positive but small improvement. The idiom implies progress that is welcome but insufficient. 'Move in the right direction' is close but less idiomatic.", "distractor_traps": {"1": "'Walk' \u2014 not part of this fixed expression", "2": "'Move' \u2014 'a move in the right direction' is occasionally used but 'step' is the standard, expected form", "3": "'Jump' \u2014 would imply a large, sudden change, which contradicts 'though much more needs to be done'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "33215de0-c020-4068-a20f-a212e51732a7", "stem": "The company has been ______ hot water with regulators over its failure to comply with data protection laws.", "options": ["under", "on", "in", "at"], "correct_choice": 2, "skill": "Vocabulary", "sub_skill": "Idioms", "cefr_difficulty": "B2", "irt_a_param": 1.4, "irt_b_param": 0.7, "irt_c_param": 0.18, "explanation_text": "'In hot water' is an idiom meaning in trouble or facing criticism. The full expression: 'be in hot water' or 'get into hot water.' It always uses 'in' \u2014 no other preposition works with this idiom.", "distractor_traps": {"0": "'Under hot water' \u2014 logical (under pressure), but not the fixed expression", "1": "'On hot water' \u2014 not a standard idiom", "3": "'At hot water' \u2014 not a standard idiom"}, "goal_tags": ["A", "C", "D", "E"]}, {"item_id": "92857966-cd52-4aad-a99c-5663d3afa2e6", "stem": "The minister's statement was a thinly ______ attempt to shift public attention away from the scandal.", "options": ["covered", "veiled", "hidden", "masked"], "correct_choice": 1, "skill": "Vocabulary", "sub_skill": "Idioms", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.4, "irt_c_param": 0.15, "explanation_text": "'Thinly veiled' is a fixed collocation meaning barely disguised \u2014 the true intention is almost visible beneath the surface. 'Thinly disguised' also exists, but 'thinly veiled' is the most established form in formal English. 'Masked' and 'hidden' don't collocate with 'thinly' in standard usage.", "distractor_traps": {"0": "'Thinly covered' \u2014 not a standard English collocation", "2": "'Thinly hidden' \u2014 not a standard collocation; 'hidden' doesn't naturally pair with 'thinly'", "3": "'Thinly masked' \u2014 rare and non-standard compared to 'thinly veiled'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "673a0953-dfc8-45db-b06b-5ee03a9d347f", "stem": "Read the text and answer the question.\n\n\"The caf\u00e9 was completely empty when we arrived at 3pm. By 3:30, every table was taken and people were waiting at the door.\"\n\nWhat can we understand from this text?", "options": ["The caf\u00e9 is always busy.", "The caf\u00e9 became very popular very quickly that afternoon.", "The caf\u00e9 has bad service.", "The writer didn't enjoy the caf\u00e9."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "A2", "irt_a_param": 0.9, "irt_b_param": -1.4, "irt_c_param": 0.25, "explanation_text": "The text tells us two things: the caf\u00e9 was empty at 3pm, and full by 3:30. The change happened quickly (30 minutes). We can infer it became popular fast that day. We can't say it's 'always' busy \u2014 we only know about one afternoon.", "distractor_traps": {"0": "'Always busy' \u2014 overgeneralises from one instance; we only know about this one visit", "2": "Bad service \u2014 nothing in the text mentions service quality", "3": "Didn't enjoy \u2014 no information about the writer's feelings"}, "goal_tags": ["A", "D", "E"]}, {"item_id": "fe0025f4-a9fa-49e1-9f0f-493e8f9d29d9", "stem": "Read the text and answer the question.\n\n\"My neighbour always smiles and says good morning. Last week, she brought me soup when I was ill. Yesterday, she helped me carry my shopping upstairs.\"\n\nWhat is the writer's neighbour like?", "options": ["She is a doctor.", "She is a kind and helpful person.", "She is the writer's best friend.", "She wants something from the writer."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "A2", "irt_a_param": 0.9, "irt_b_param": -1.5, "irt_c_param": 0.25, "explanation_text": "Three actions \u2014 smiling, bringing soup, carrying shopping \u2014 all point to kindness and helpfulness. We can infer this is the neighbour's character. We can't say she's a doctor (bringing soup doesn't mean medical care) or a best friend (she's described as 'neighbour').", "distractor_traps": {"0": "Bringing soup when someone is ill doesn't make someone a doctor \u2014 it's a common neighbourly act", "2": "'Best friend' \u2014 the text calls her 'my neighbour,' not 'my friend'", "3": "Cynical reading \u2014 nothing in the text suggests ulterior motives"}, "goal_tags": ["A", "D", "E"]}, {"item_id": "601fb885-f355-4bb9-9c7d-d167a206df8e", "stem": "Read the text and answer the question.\n\n\"The company announced record profits for the third consecutive quarter. However, internal documents obtained by journalists revealed that dozens of factory workers had not been paid for overtime during the same period.\"\n\nWhat does the text suggest about the company?", "options": ["The company is very successful and treats its workers well.", "The company's profits may have come partly at the expense of its workers.", "The journalists are trying to damage the company's reputation.", "The factory workers are planning to go on strike."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0, "irt_c_param": 0.2, "explanation_text": "The text creates a contrast: record profits on one side, unpaid overtime on the other. The word 'however' signals this contrast. The inference: the profits may be connected to not paying workers properly. The text doesn't state this directly \u2014 you have to connect the two facts.", "distractor_traps": {"0": "Contradicted by the second sentence \u2014 workers weren't paid for overtime", "2": "The text doesn't evaluate the journalists' motives \u2014 it simply states what they found", "3": "A possible future consequence but nothing in the text mentions or implies a strike"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "87896eef-be14-4760-a841-b91d9f08caf5", "stem": "Read the text and answer the question.\n\n\"After twenty years of teaching, Mr. Nguyen packed his desk, said goodbye to his colleagues, and walked out of the school for the last time. He paused at the gate and looked back at the building where he had spent half his life.\"\n\nHow does Mr. Nguyen most likely feel?", "options": ["He is angry about having to leave the school.", "He is relieved that his career is finally over.", "He feels a mixture of emotions as he leaves something meaningful behind.", "He is worried about finding a new job."], "correct_choice": 2, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.1, "irt_c_param": 0.2, "explanation_text": "'Paused at the gate and looked back' \u2014 this physical action reveals emotion. If he were simply relieved, he would walk away without stopping. If he were angry, he wouldn't look back fondly. The pause and backward glance suggest attachment and reflection. 'Half his life' reinforces how meaningful the place is to him.", "distractor_traps": {"0": "Nothing suggests anger \u2014 packing his desk and saying goodbye suggests a planned, peaceful departure", "1": "'Relieved' contradicts the pause and backward look \u2014 someone relieved doesn't linger", "3": "Nothing in the text mentions future employment or financial concern"}, "goal_tags": ["A", "D", "E"]}, {"item_id": "029be2ea-5806-4e29-9b6b-7221ff7fd7f0", "stem": "Read the text and answer the question.\n\n\"The hotel website showed bright, spacious rooms with ocean views. When the Tran family arrived, they found a small room facing the car park. The bathroom light flickered, and the air conditioning made a constant rattling noise.\"\n\nWhat does the text imply about the hotel?", "options": ["The hotel was recently renovated.", "The hotel's online presentation did not match the reality.", "The Tran family booked the wrong room by mistake.", "The hotel was full, so they were given a different room."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.1, "irt_c_param": 0.22, "explanation_text": "The text contrasts what the website showed (bright, spacious, ocean views) with what the family found (small, car park, broken fixtures). The gap between promise and reality is the core inference. The text doesn't say the family made a mistake or that the hotel was full.", "distractor_traps": {"0": "'Recently renovated' contradicts the flickering light and rattling AC \u2014 these suggest poor maintenance", "2": "The text doesn't suggest a booking error \u2014 it presents the gap as the hotel's misrepresentation", "3": "Possible but not implied \u2014 the text attributes the problem to the hotel's website being misleading, not to capacity issues"}, "goal_tags": ["A", "C", "D", "E"]}, {"item_id": "ae771d78-c2fb-4ee9-bd5f-1b1a6348f677", "stem": "Read the text and answer the question.\n\n\"The university's new admissions policy aims to increase diversity by considering applicants' socioeconomic backgrounds alongside academic performance. Critics argue that this approach undermines meritocracy, while supporters contend that academic performance itself is shaped by socioeconomic factors, making a purely grades-based system inherently biased.\"\n\nWhat position do the supporters of the policy hold?", "options": ["Academic grades are the only fair measure of student ability.", "Socioeconomic background is more important than grades.", "A grades-only system already favours privileged applicants, so additional context is needed.", "The university should eliminate academic requirements entirely."], "correct_choice": 2, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.7, "irt_c_param": 0.18, "explanation_text": "The supporters argue that academic performance is 'shaped by socioeconomic factors,' making a grades-only system 'inherently biased.' This means grades don't reflect pure ability \u2014 they reflect privilege too. Therefore, considering socioeconomic background compensates for an existing bias, not introduces a new one.", "distractor_traps": {"0": "This is the critics' implicit position, not the supporters'", "1": "The supporters don't argue background is 'more important' \u2014 they argue it should be considered 'alongside' grades", "3": "Extreme overinterpretation \u2014 the policy adds a factor, it doesn't eliminate academic requirements"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "ddf63ee4-40b9-4192-a4ad-e3b0a525fe1c", "stem": "Read the text and answer the question.\n\n\"A recent longitudinal study found that children who were read to daily before age five scored significantly higher on reading comprehension tests at age twelve than those who were not. The researchers noted, however, that families who read to their children daily also tended to have higher household incomes and more educated parents.\"\n\nWhat concern does the second sentence raise about the study's findings?", "options": ["The study proves that reading to children guarantees better academic outcomes.", "Higher income might be the real reason for the better test scores, not the reading itself.", "The study was too short to produce meaningful results.", "Parents with higher education are better at choosing books."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "B2", "irt_a_param": 1.6, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "The second sentence introduces a confounding variable: income and parent education correlate with both daily reading AND test scores. This means we can't be certain reading caused the better scores \u2014 the real cause might be the advantages that come with higher income. This is a correlation vs. causation problem.", "distractor_traps": {"0": "The opposite of what the second sentence suggests \u2014 it raises doubt about the causal claim, not confirms it", "2": "'Longitudinal' (tracking subjects over years) means the study was long-term, not short", "3": "Book selection quality isn't mentioned \u2014 the concern is about confounding economic factors"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "a9c43774-f00e-4bf1-99cd-1da2a8e54ab1", "stem": "Read the text and answer the question.\n\n\"The pharmaceutical company published a study showing its new drug reduced symptoms in 70% of patients. However, the study only included patients with mild symptoms, excluded those taking other medications, and was funded entirely by the company itself.\"\n\nWhat is the author's likely purpose in mentioning these details?", "options": ["To celebrate the drug's success rate.", "To suggest the study's conclusions may not be reliable or generalisable.", "To encourage patients to ask their doctors about the drug.", "To explain why pharmaceutical research is so expensive."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "B2", "irt_a_param": 1.6, "irt_b_param": 0.9, "irt_c_param": 0.18, "explanation_text": "The author lists three limitations: narrow patient selection, exclusion criteria, and self-funding. Each one is a reason to question the study's conclusions. The author is not stating the study is wrong \u2014 they're highlighting reasons to be sceptical. 'However' signals that what follows will challenge the initial positive claim.", "distractor_traps": {"0": "The limitations undermine the celebration, not reinforce it", "2": "Nothing in the text encourages patients to take action \u2014 it raises concerns, not recommendations", "3": "Research costs are not mentioned or implied"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "be916062-6816-4714-8827-a95bb3c2d33d", "stem": "Read the text and answer the question.\n\n\"The government's pledge to achieve carbon neutrality by 2050 has been met with cautious optimism by environmental groups. While they welcome the target, several organisations have pointed out that the pledge is accompanied by neither a detailed implementation plan nor legally binding intermediate milestones. One prominent climate scientist described the announcement as 'an excellent destination with no map and no road.'\"\n\nWhat is the climate scientist's view of the government's pledge?", "options": ["The goal is admirable but the lack of concrete planning makes it unlikely to be achieved.", "The government should set a more ambitious target than 2050.", "Environmental groups should be more supportive of the government's efforts.", "Carbon neutrality is not a realistic goal for any government."], "correct_choice": 0, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.3, "irt_c_param": 0.15, "explanation_text": "The metaphor 'an excellent destination with no map and no road' praises the goal ('excellent destination') while criticising the lack of a plan ('no map and no road'). The scientist accepts the ambition but doubts the execution. This is sophisticated hedged criticism \u2014 agreeing with the principle while challenging the practicality.", "distractor_traps": {"1": "The scientist doesn't challenge the target's ambition \u2014 they call it 'excellent'", "2": "The scientist is not commenting on environmental groups' attitudes", "3": "Calling the destination 'excellent' shows the scientist believes the goal is worthy, not unrealistic"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "94bfd67a-f2b9-4394-a6a4-1bfb96bfe91e", "stem": "Read the text and answer the question.\n\n\"The rapid expansion of online education during the pandemic was initially celebrated as a democratisation of knowledge \u2014 anyone with an internet connection could access world-class instruction. Five years on, research consistently shows that online learning outcomes correlate strongly with students' pre-existing digital literacy, access to quiet study spaces, and stable internet connectivity \u2014 all of which are themselves correlated with socioeconomic status.\"\n\nWhat does the passage suggest about the 'democratisation of knowledge' claim?", "options": ["It has been proven correct by five years of evidence.", "It was idealistic \u2014 the same inequalities that exist offline have reproduced themselves online.", "Online education is less effective than in-person education for all students.", "Governments should invest more in internet infrastructure."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Inference", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.5, "irt_c_param": 0.15, "explanation_text": "The passage sets up the initial claim ('democratisation') then undercuts it: success online depends on digital literacy, quiet spaces, and internet quality \u2014 all tied to socioeconomic status. The promise of equal access masks unequal outcomes. The 'democratisation' claim was naive because it assumed equal conditions, which don't exist.", "distractor_traps": {"0": "The research contradicts the claim, not supports it", "2": "The passage doesn't compare online vs. in-person \u2014 it says online outcomes vary by socioeconomic factors", "3": "Infrastructure investment might help but is not what the passage argues \u2014 it focuses on the reproduction of inequality"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "e65e489b-068c-43c7-8da7-9e9388363125", "stem": "Read the text and answer the question.\n\n\"First, preheat the oven to 180\u00b0C. Next, mix the flour and sugar in a large bowl. Then, add the eggs and butter. Finally, pour the mixture into a baking tin and bake for 25 minutes.\"\n\nWhat type of text is this?", "options": ["A news report", "A set of instructions", "A personal letter", "An advertisement"], "correct_choice": 1, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "A2", "irt_a_param": 0.9, "irt_b_param": -1.6, "irt_c_param": 0.25, "explanation_text": "The sequencing words (first, next, then, finally) and imperative verbs (preheat, mix, add, pour, bake) are signals of instructional text. Instructions tell someone how to do something in order. The topic (baking) is secondary \u2014 the structure is the key identifier.", "distractor_traps": {"0": "News reports describe events, not give commands", "2": "Personal letters use 'I/you' and discuss personal topics, not give step-by-step commands", "3": "Advertisements try to persuade you to buy something \u2014 this text simply instructs"}, "goal_tags": ["A", "E"]}, {"item_id": "41b1fe4e-7c1b-4bab-b35b-5dbdee9c02fb", "stem": "Read the text and answer the question.\n\n\"Remote working has become increasingly common since 2020. Supporters argue that it increases productivity and improves work-life balance. Opponents, on the other hand, claim that it leads to isolation and weaker team collaboration. Recent surveys suggest that most employees prefer a hybrid model.\"\n\nHow is this text organised?", "options": ["Problem \u2192 Solution \u2192 Evaluation", "Topic introduction \u2192 Arguments for and against \u2192 Conclusion from evidence", "Chronological order from past to present", "Personal opinion supported by examples"], "correct_choice": 1, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": 0, "irt_c_param": 0.22, "explanation_text": "The text introduces a topic (remote working), presents supporters' views, then opponents' views ('on the other hand'), and concludes with survey evidence. This is a balanced argument structure \u2014 common in IELTS and academic writing. The signal words ('supporters argue,' 'opponents claim,' 'surveys suggest') reveal the structure.", "distractor_traps": {"0": "No problem is presented and no solution is proposed \u2014 it's a balanced discussion, not problem-solution", "2": "While '2020' is mentioned, the text is organised by viewpoints, not by chronological events", "3": "The text presents multiple perspectives, not a personal opinion \u2014 the author doesn't take a side"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "5b294e97-ea01-480d-ac17-5c43da9edd5e", "stem": "Read the text and answer the question.\n\n\"Paragraph 1: Coffee consumption has risen dramatically worldwide over the past two decades.\nParagraph 2: Several studies have linked moderate coffee consumption to health benefits, including reduced risk of certain diseases.\nParagraph 3: However, excessive consumption can lead to anxiety, insomnia, and increased heart rate.\nParagraph 4: Therefore, most health experts recommend limiting intake to three or four cups per day.\"\n\nWhat is the function of Paragraph 3 in the overall text?", "options": ["It provides the main argument of the text.", "It introduces a contrasting perspective to balance the previous paragraph.", "It summarises all the information presented so far.", "It gives a personal opinion about coffee."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.2, "irt_c_param": 0.2, "explanation_text": "'However' at the start of Paragraph 3 is a contrast signal. Paragraph 2 discussed benefits; Paragraph 3 introduces risks. This balances the text before the recommendation in Paragraph 4. Recognising these 'pivot' paragraphs \u2014 where the argument shifts direction \u2014 is essential for IELTS reading.", "distractor_traps": {"0": "Paragraph 3 presents a counterpoint, not the main argument \u2014 the main argument is the overall balanced assessment", "2": "It doesn't summarise \u2014 it introduces new, contrasting information", "3": "It presents factual health risks, not personal opinion"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "64fbfcac-f436-4959-b2cd-272f6f5f6f65", "stem": "Read the text and answer the question.\n\n\"While urbanisation has brought significant economic benefits to developing nations, it has also created unprecedented challenges in housing, sanitation, and public health. This paradox \u2014 growth that simultaneously enriches and endangers \u2014 requires policy solutions that acknowledge both dimensions rather than treating them as separate issues.\"\n\nWhat is the function of the phrase 'This paradox' in the text?", "options": ["It introduces a new topic unrelated to the first sentence.", "It summarises the tension described in the first sentence and sets up the argument that follows.", "It contradicts the idea that urbanisation has economic benefits.", "It provides a definition of urbanisation."], "correct_choice": 1, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.7, "irt_c_param": 0.18, "explanation_text": "'This paradox' is a cohesive device \u2014 it refers back to the tension in the first sentence (benefits vs. challenges) and names it. The dash ('\u2014growth that simultaneously enriches and endangers\u2014') explains the paradox. Then 'requires' launches the author's argument. This kind of summarise-and-pivot structure is common in academic writing.", "distractor_traps": {"0": "It refers directly to the first sentence's content \u2014 it's not a new topic", "2": "It doesn't contradict the benefits \u2014 it names the contradiction between benefits and challenges", "3": "Urbanisation was defined in the first sentence through its effects, not here"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "7b3cd7dd-280c-444c-83f6-c040bb5cae6a", "stem": "Read the text and answer the question.\n\n\"The assumption that technology inevitably improves educational outcomes has driven billions of dollars in investment over the past decade. Schools have purchased tablets, interactive whiteboards, and learning management systems at scale. Yet a growing body of research suggests that the impact of these investments on student achievement is modest at best and, in some cases, negligible.\"\n\nWhat is the author's rhetorical strategy in this passage?", "options": ["Presenting a popular belief, showing its consequences, then challenging it with evidence.", "Comparing two educational systems and recommending one.", "Describing a historical trend and predicting its future development.", "Arguing strongly in favour of technology in education."], "correct_choice": 0, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "B2", "irt_a_param": 1.6, "irt_b_param": 0.9, "irt_c_param": 0.18, "explanation_text": "The passage has three moves: (1) state a widely held assumption ('technology improves outcomes'), (2) show how that assumption led to action ('billions in investment'), (3) undercut the assumption with evidence ('modest at best, negligible'). This setup-and-challenge structure is a classic academic rhetorical strategy.", "distractor_traps": {"1": "No comparison between two systems \u2014 only one approach (technology investment) is discussed", "2": "No prediction is made about the future", "3": "The passage undermines the pro-technology position, not supports it"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "09b53bb9-27b9-4578-bde5-059f10a608bc", "stem": "Read the text and answer the question.\n\n\"It would be premature to conclude that remote work is universally preferable to office-based work. While the productivity data from 2020\u20132023 is broadly encouraging, these findings emerged during extraordinary circumstances \u2014 a global pandemic that eliminated alternatives. Whether similar productivity levels would persist in a context of genuine choice remains an open question.\"\n\nWhat is the author doing in this passage?", "options": ["Arguing that remote work is more productive than office work.", "Presenting evidence that remote work reduces productivity.", "Qualifying an apparently positive finding by questioning the conditions under which it was produced.", "Predicting that remote work will become the standard within ten years."], "correct_choice": 2, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "The author acknowledges positive data ('broadly encouraging') but then questions its validity ('extraordinary circumstances,' 'eliminated alternatives,' 'open question'). This is academic hedging \u2014 accepting evidence while highlighting its limitations. The phrase 'it would be premature to conclude' is a classic hedge that signals careful, qualified reasoning.", "distractor_traps": {"0": "The author explicitly says it's 'premature' to reach this conclusion", "1": "The data is described as 'broadly encouraging,' not negative", "3": "No prediction is made \u2014 the author says the question 'remains open'"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "ae1aba54-ccba-4279-978f-dc2651edbcf0", "stem": "Read the text and answer the question.\n\n\"The notion that economic growth is inherently incompatible with environmental sustainability has gained considerable traction in recent years. Proponents of 'degrowth' argue that finite planetary resources make perpetual expansion impossible. Yet this framing presents a false binary. A more nuanced reading of the evidence suggests that the relationship between growth and sustainability is mediated by institutional design, technological innovation, and \u2014 crucially \u2014 political will.\"\n\nWhat is the author's position relative to the 'degrowth' argument?", "options": ["Full agreement \u2014 the author believes growth must stop.", "Full rejection \u2014 the author believes growth and sustainability are completely compatible.", "Partial critique \u2014 the author accepts the concern but rejects the either/or framing.", "Neutrality \u2014 the author presents both sides without taking a position."], "correct_choice": 2, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.4, "irt_c_param": 0.15, "explanation_text": "The author's position is revealed through precise word choices: 'gained considerable traction' (acknowledges the argument's influence without endorsing it), 'false binary' (rejects the either/or frame), 'more nuanced reading' (signals their own position as more sophisticated). The author doesn't dismiss the concern \u2014 they reject the simplistic framing.", "distractor_traps": {"0": "'False binary' shows the author disagrees with the degrowth framing, not agrees with it", "1": "The author doesn't say growth and sustainability are fully compatible \u2014 they say the relationship is 'mediated' by multiple factors", "3": "'False binary' and 'more nuanced reading' are the author's evaluative judgments, not neutral presentation"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "8de67870-3c8f-465e-b4ae-d07a192b17ee", "stem": "Read the text and answer the question.\n\n\"The increasing reliance on algorithmic decision-making in criminal justice \u2014 from predictive policing to sentencing recommendations \u2014 raises profound questions about accountability. When an algorithm recommends a longer sentence based on statistical patterns, who is responsible for that outcome? The developer who designed the model? The judge who accepted its recommendation? The institution that adopted it? The diffusion of responsibility across human and technical actors is perhaps the most troubling feature of algorithmic governance.\"\n\nWhat rhetorical technique does the author use in the middle of the passage?", "options": ["A series of rhetorical questions to highlight the complexity of assigning blame.", "Statistical evidence to prove that algorithms are biased.", "An anecdote about a specific court case.", "A direct quotation from a legal expert."], "correct_choice": 0, "skill": "Reading", "sub_skill": "Text Structure", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.5, "irt_c_param": 0.15, "explanation_text": "The three questions ('The developer? The judge? The institution?') are rhetorical \u2014 the author isn't expecting answers. Instead, the rapid succession of possible responsible parties illustrates the problem: responsibility is so dispersed that no one party is clearly accountable. This technique makes the abstract concept of 'diffusion of responsibility' concrete and immediate.", "distractor_traps": {"1": "No statistics or data are presented anywhere in the passage", "2": "No specific case is mentioned \u2014 the passage discusses the general pattern", "3": "No quotation from any external source appears in the passage"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "ea8a9c40-6a38-43ad-b4d3-8f8acff1fa78", "stem": "I wanted to go to the beach. ______, it started raining, so we stayed home.", "options": ["Because", "However", "Also", "For example"], "correct_choice": 1, "skill": "Reading", "sub_skill": "Cohesive Devices", "cefr_difficulty": "A2", "irt_a_param": 0.9, "irt_b_param": -1.4, "irt_c_param": 0.25, "explanation_text": "'However' introduces a contrast \u2014 the writer wanted to go (positive), but rain stopped them (negative). 'However' is one of the most important linking words: it signals that the next idea contrasts with the previous one. 'Because' gives a reason, 'also' adds information, and 'for example' gives an illustration.", "distractor_traps": {"0": "'Because' introduces a cause, but the rain is a new contrasting event, not a reason for wanting to go", "2": "'Also' adds similar information \u2014 rain is not similar to wanting to go to the beach", "3": "'For example' introduces an illustration of a previous point \u2014 rain is not an example of wanting to go to the beach"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "9ac74a69-0d18-4684-99be-3ef94d53ce3e", "stem": "The government increased funding for public schools. ______, test scores improved significantly within two years.", "options": ["Nevertheless", "In contrast", "As a result", "Meanwhile"], "correct_choice": 2, "skill": "Reading", "sub_skill": "Cohesive Devices", "cefr_difficulty": "B1", "irt_a_param": 1.2, "irt_b_param": -0.1, "irt_c_param": 0.22, "explanation_text": "'As a result' shows cause and effect: funding went up \u2192 scores improved. This is a consequence connector. 'Nevertheless' would signal an unexpected outcome. 'In contrast' would introduce an opposite situation. 'Meanwhile' would signal events happening at the same time.", "distractor_traps": {"0": "'Nevertheless' signals an outcome that contradicts expectations \u2014 but improved scores are the expected result of more funding", "1": "'In contrast' introduces an opposing idea \u2014 but the second sentence is a consequence, not a contrast", "3": "'Meanwhile' shows simultaneous events \u2014 but the scores improved 'within two years,' showing cause-effect, not simultaneity"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "71c636e9-a3e4-487f-badb-61880ce85f50", "stem": "Many people believe that social media brings people together. ______, research suggests that heavy social media use can actually increase feelings of loneliness.", "options": ["In addition", "On the contrary", "Similarly", "As a result"], "correct_choice": 1, "skill": "Reading", "sub_skill": "Cohesive Devices", "cefr_difficulty": "B1", "irt_a_param": 1.3, "irt_b_param": 0.1, "irt_c_param": 0.2, "explanation_text": "'On the contrary' directly contradicts what came before. People believe social media connects \u2192 research shows it increases loneliness. This is a direct opposition, not just a contrast (which would use 'however'). 'On the contrary' is stronger than 'however' \u2014 it says the opposite is true.", "distractor_traps": {"0": "'In addition' adds a supporting point \u2014 but the second sentence contradicts the first", "2": "'Similarly' shows agreement between two ideas \u2014 the opposite of what's happening here", "3": "'As a result' shows cause-effect \u2014 but loneliness isn't a result of the belief; it contradicts it"}, "goal_tags": ["A", "B", "D", "E"]}, {"item_id": "3c5e5db2-44d1-43c0-b584-e3a7457ab4d8", "stem": "The initial findings were promising. ______, the researchers cautioned that the sample size was too small to draw definitive conclusions.", "options": ["Furthermore", "Likewise", "Nonetheless", "Accordingly"], "correct_choice": 2, "skill": "Reading", "sub_skill": "Cohesive Devices", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.6, "irt_c_param": 0.18, "explanation_text": "'Nonetheless' means 'despite what was just said' \u2014 it's a formal alternative to 'however' or 'even so.' The findings were promising, but the researchers still had concerns. 'Nonetheless' is particularly useful in academic writing for introducing caveats after positive statements.", "distractor_traps": {"0": "'Furthermore' adds supporting information \u2014 but the caution about sample size is a limitation, not additional support", "1": "'Likewise' shows similarity \u2014 the caution is not similar to the promising findings", "3": "'Accordingly' means 'as a logical consequence' \u2014 but the caution is a contrast, not a consequence of the promising results"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "e1c991f1-b2f9-4ddc-9b85-38a8c86a3266", "stem": "Several factors contributed to the project's failure. ______, the budget was cut by forty per cent midway through. ______, key personnel resigned during the critical implementation phase.", "options": ["For instance / Moreover", "However / Therefore", "In contrast / Similarly", "Consequently / Nevertheless"], "correct_choice": 0, "skill": "Reading", "sub_skill": "Cohesive Devices", "cefr_difficulty": "B2", "irt_a_param": 1.5, "irt_b_param": 0.8, "irt_c_param": 0.18, "explanation_text": "'For instance' introduces the first specific example of the 'several factors.' 'Moreover' adds a second contributing factor. The structure is: general claim \u2192 first example \u2192 additional example. In academic writing, 'for instance' and 'moreover' are standard tools for building a detailed argument.", "distractor_traps": {"1": "'However' would signal contrast, but both sentences support the same point (reasons for failure). 'Therefore' shows consequence, but the second factor isn't caused by the first", "2": "'In contrast' would mean the second factor opposes the first. 'Similarly' could work but doesn't fit as well as 'moreover' for adding a distinct additional factor", "3": "'Consequently' would mean the budget cut caused the failure (possible but not the logical structure here). 'Nevertheless' would contradict \u2014 the resignations are not a silver lining"}, "goal_tags": ["A", "B", "C", "E"]}, {"item_id": "335eaa71-e6e1-40e4-8c1e-4d3280766b35", "stem": "The data unequivocally supports the hypothesis that green spaces improve mental health outcomes. ______, this finding should not be taken to mean that urban planners can solve mental health crises through park construction alone.", "options": ["That said", "In other words", "By the same token", "To that end"], "correct_choice": 0, "skill": "Reading", "sub_skill": "Cohesive Devices", "cefr_difficulty": "C1", "irt_a_param": 1.7, "irt_b_param": 1.3, "irt_c_param": 0.15, "explanation_text": "'That said' is an advanced discourse marker meaning 'despite what I just stated, here is a qualification.' It acknowledges the previous point as valid while introducing a limitation. It's more nuanced than 'however' \u2014 it doesn't contradict the previous point, it narrows its implications.", "distractor_traps": {"1": "'In other words' would rephrase the previous idea \u2014 but the second sentence introduces a new, limiting point", "2": "'By the same token' means 'for the same reason' \u2014 it extends an argument, but the second sentence limits it", "3": "'To that end' means 'in order to achieve that goal' \u2014 but the second sentence is a caution, not a purposeful action"}, "goal_tags": ["A", "B", "E"]}, {"item_id": "d924a463-d3b9-4f41-ad74-def7b7c3f783", "stem": "The committee's recommendation was unanimous. ______, not all members were equally enthusiastic \u2014 several expressed reservations during the private deliberations that preceded the public vote.", "options": ["Be that as it may", "In light of this", "As a consequence", "For all intents and purposes"], "correct_choice": 0, "skill": "Reading", "sub_skill": "Cohesive Devices", "cefr_difficulty": "C1", "irt_a_param": 1.8, "irt_b_param": 1.6, "irt_c_param": 0.15, "explanation_text": "'Be that as it may' is a formal concessive marker meaning 'accepting that the previous statement is true, what follows reveals a complication.' It's more sophisticated than 'however' or 'nevertheless' \u2014 it explicitly concedes the previous point before introducing the complication. Used in academic, legal, and diplomatic writing.", "distractor_traps": {"1": "'In light of this' means 'considering what was just said' and would introduce a consequence or action, not a complication", "2": "'As a consequence' shows cause-effect \u2014 but the reservations aren't caused by the unanimity; they complicate it", "3": "'For all intents and purposes' means 'effectively' or 'in practice' \u2014 it's a summing-up phrase, not a concessive marker"}, "goal_tags": ["A", "B", "C", "E"]}];

// ═══════════════════════════════════════════════════════════════
// IRT ENGINE — 3PL Model with EAP Estimation
// ═══════════════════════════════════════════════════════════════
const IRT = {
  // 3PL probability: P(θ) = c + (1-c) / (1 + exp(-a(θ-b)))
  prob3PL(theta, a, b, c) {
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  },

  // Fisher Information for item selection
  fisherInfo(theta, a, b, c) {
    const p = this.prob3PL(theta, a, b, c);
    const q = 1 - p;
    const pStar = 1 / (1 + Math.exp(-a * (theta - b)));
    if (p === 0 || q === 0) return 0;
    return (a * a * Math.pow(pStar, 2) * q) / p;
  },

  // EAP estimation with normal prior
  estimateTheta(responses) {
    if (responses.length === 0) return { theta: 0, se: 2.0 };
    
    const quadPoints = [];
    for (let t = -3; t <= 3; t += 0.1) {
      quadPoints.push(t);
    }
    
    let numerator = 0;
    let denominator = 0;
    let variance = 0;
    
    for (const t of quadPoints) {
      // Prior: N(0, 1)
      const prior = Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI);
      
      // Likelihood
      let logLik = 0;
      for (const r of responses) {
        const p = this.prob3PL(t, r.a, r.b, r.c);
        logLik += r.correct ? Math.log(Math.max(p, 1e-10)) : Math.log(Math.max(1 - p, 1e-10));
      }
      const lik = Math.exp(logLik);
      const posterior = lik * prior;
      
      numerator += t * posterior;
      denominator += posterior;
    }
    
    const theta = denominator > 0 ? numerator / denominator : 0;
    
    // SE computation
    for (const t of quadPoints) {
      const prior = Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI);
      let logLik = 0;
      for (const r of responses) {
        const p = this.prob3PL(t, r.a, r.b, r.c);
        logLik += r.correct ? Math.log(Math.max(p, 1e-10)) : Math.log(Math.max(1 - p, 1e-10));
      }
      const posterior = Math.exp(logLik) * prior;
      variance += Math.pow(t - theta, 2) * posterior;
    }
    
    const se = denominator > 0 ? Math.sqrt(variance / denominator) : 2.0;
    return { theta: Math.max(-3, Math.min(3, theta)), se };
  },

  // Select next item: Maximum Fisher Information with content balancing
  selectNext(theta, usedIds, responses, itemBank) {
    const skillCounts = { Grammar: 0, Vocabulary: 0, Reading: 0 };
    responses.forEach(r => { skillCounts[r.skill] = (skillCounts[r.skill] || 0) + 1; });
    
    const minReqs = { Grammar: 6, Vocabulary: 6, Reading: 4 };
    const totalAnswered = responses.length;
    
    // Determine if we need to force a skill
    let forcedSkill = null;
    const remaining = 40 - totalAnswered;
    for (const [skill, min] of Object.entries(minReqs)) {
      const needed = min - skillCounts[skill];
      if (needed > 0 && needed >= remaining - 2) {
        forcedSkill = skill;
        break;
      }
    }
    
    // If near the minimum items and a skill is underrepresented
    if (!forcedSkill && totalAnswered >= 14) {
      for (const [skill, min] of Object.entries(minReqs)) {
        if (skillCounts[skill] < min) {
          forcedSkill = skill;
          break;
        }
      }
    }
    
    let candidates = itemBank.filter(item => !usedIds.has(item.item_id));
    if (forcedSkill) {
      const forced = candidates.filter(item => item.skill === forcedSkill);
      if (forced.length > 0) candidates = forced;
    }
    
    if (candidates.length === 0) return null;
    
    // Score by Fisher Information
    let best = null;
    let bestInfo = -Infinity;
    
    for (const item of candidates) {
      const info = this.fisherInfo(theta, item.irt_a_param, item.irt_b_param, item.irt_c_param);
      // Add small random noise for exposure control
      const noise = Math.random() * 0.05;
      if (info + noise > bestInfo) {
        bestInfo = info + noise;
        best = item;
      }
    }
    
    return best;
  },

  // Convert theta to 0-100 score
  thetaToScore(theta) {
    return Math.round(Math.max(0, Math.min(100, ((theta + 1.5) / 3.5) * 100)));
  },

  // Convert theta to CEFR level
  thetaToCEFR(theta) {
    const score = this.thetaToScore(theta);
    if (score <= 25) return "A2";
    if (score <= 50) return "B1";
    if (score <= 75) return "B2";
    return "C1";
  },

  // Get IELTS estimate from CEFR
  cefrToIELTS(cefr, score) {
    const map = {
      A2: { low: 3.5, high: 4.0 },
      B1: { low: 4.0, high: 5.0 },
      B2: { low: 5.5, high: 6.5 },
      C1: { low: 7.0, high: 8.0 },
    };
    const range = map[cefr];
    // Interpolate within range
    let rangeScores;
    if (cefr === "A2") rangeScores = [10, 25];
    else if (cefr === "B1") rangeScores = [26, 50];
    else if (cefr === "B2") rangeScores = [51, 75];
    else rangeScores = [76, 100];
    
    const pct = Math.max(0, Math.min(1, (score - rangeScores[0]) / (rangeScores[1] - rangeScores[0])));
    const band = range.low + pct * (range.high - range.low);
    return Math.round(band * 2) / 2; // Round to nearest 0.5
  },

  // Check stopping rule
  shouldStop(responses, se, maxItems = 40) {
    const minItems = maxItems === 20 ? 16 : 20;
    const seThreshold = maxItems === 20 ? 0.45 : 0.40;
    if (responses.length < minItems) return false;
    if (se < seThreshold) return true;
    if (responses.length >= maxItems) return true;
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════
// DIAGNOSTIC ENGINE
// ═══════════════════════════════════════════════════════════════
const Diagnostic = {
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

// ═══════════════════════════════════════════════════════════════
// I18N — Vietnamese / English
// ═══════════════════════════════════════════════════════════════
const i18n = {
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
    youChose: "Bạn chọn:",
    theAnswer: "Đáp án đúng:",
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
  }
};

// ═══════════════════════════════════════════════════════════════
// RESOURCE DATABASE
// ═══════════════════════════════════════════════════════════════
const RESOURCES = {
  "Verb Tenses": [
    { name: "BBC Learning English — Tenses", url: "https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate/unit-1/tab/grammar", tags: ["A", "B", "C", "D", "E"] },
    { name: "English Grammar in Use (Raymond Murphy)", url: "https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition", tags: ["A", "B"] },
    { name: "Perfect English Grammar — Tenses", url: "https://www.perfect-english-grammar.com/verb-tenses.html", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Conditionals": [
    { name: "BBC Learning English — Conditionals", url: "https://www.bbc.co.uk/learningenglish/english/course/upper-intermediate/unit-4/tab/grammar", tags: ["A", "B", "C", "D", "E"] },
    { name: "IELTS Liz — Conditional Sentences", url: "https://ieltsliz.com/conditional-sentences/", tags: ["A"] },
  ],
  "Articles": [
    { name: "BBC Learning English — Articles", url: "https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate/unit-22/tab/grammar", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Prepositions": [
    { name: "English Page — Prepositions", url: "https://www.englishpage.com/prepositions/prepositions.html", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Modal Verbs": [
    { name: "BBC Learning English — Modals", url: "https://www.bbc.co.uk/learningenglish/english/course/intermediate/unit-5/tab/grammar", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Sentence Structure": [
    { name: "British Council — Sentence Structure", url: "https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/complex-sentences", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Collocations": [
    { name: "Oxford Collocations Dictionary Online", url: "https://www.freecollocation.com/", tags: ["A", "B", "C", "D", "E"] },
    { name: "English Collocations in Use", url: "https://www.cambridge.org/us/cambridgeenglish/catalog/vocabulary/english-collocations-use-intermediate-2nd-edition", tags: ["A", "B", "C"] },
  ],
  "Phrasal Verbs": [
    { name: "BBC Learning English — Phrasal Verbs", url: "https://www.bbc.co.uk/learningenglish/english/course/upper-intermediate/unit-4/tab/vocabulary", tags: ["A", "C", "D", "E"] },
    { name: "PHaVE List — Essential Phrasal Verbs", url: "https://www.phrasalverbslist.com/", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Word Formation": [
    { name: "IELTS Liz — Word Formation", url: "https://ieltsliz.com/word-formation/", tags: ["A", "B"] },
    { name: "English Grammar Online — Word Formation", url: "https://www.ego4u.com/en/cram-up/vocabulary/word-formation", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Academic Word List": [
    { name: "AWL Highlighter", url: "https://www.eapfoundation.com/vocab/academic/awlhighlighter/", tags: ["A", "B"] },
    { name: "Quizlet — AWL Sublist 1-10", url: "https://quizlet.com/subject/academic-word-list/", tags: ["A", "B", "E"] },
  ],
  "Idioms": [
    { name: "The Idioms — Largest Idiom Dictionary", url: "https://www.theidioms.com/", tags: ["C", "D", "E"] },
    { name: "BBC Learning English — Idioms", url: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak", tags: ["C", "D", "E"] },
  ],
  "Inference": [
    { name: "British Council — Reading Skills", url: "https://learnenglish.britishcouncil.org/skills/reading", tags: ["A", "B", "C", "D", "E"] },
    { name: "IELTS Liz — Reading Lessons", url: "https://ieltsliz.com/ielts-reading-lessons-information-and-tips/", tags: ["A"] },
  ],
  "Text Structure": [
    { name: "British Council — Reading for Structure", url: "https://learnenglish.britishcouncil.org/skills/reading", tags: ["A", "B", "C", "D", "E"] },
  ],
  "Cohesive Devices": [
    { name: "British Council — Cohesion", url: "https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/linking-words", tags: ["A", "B", "C", "D", "E"] },
    { name: "IELTS Liz — Linking Words", url: "https://ieltsliz.com/linking-words-for-writing/", tags: ["A"] },
  ],
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════
const VI_EXPLANATIONS = {
  "39a5364c-c9bf-4b26-910b-b1bf988d98c1": "Với 'she' (ngôi thứ ba số ít), động từ thì hiện tại đơn phải thêm -s hoặc -es. 'She goes' là đúng. Tiếng Việt không chia động từ theo chủ ngữ, nên đây là điểm cần luyện tập thường xuyên.",
  "616ab857-2257-4c14-9239-f4b9f904455e": "'Yesterday' cho biết sự việc xảy ra trong quá khứ và đã hoàn thành. Thì quá khứ đơn ('finished') là đúng. 'Have finished' (hiện tại hoàn thành) nối quá khứ với hiện tại, nhưng 'yesterday' xác định rõ đây là quá khứ.",
  "54a8bfc5-fa70-4ed3-9960-d01ffe37551a": "'Look!' và 'right now' cho biết hành động đang xảy ra ngay lúc này. Thì hiện tại tiếp diễn (are + verb-ing) mô tả hành động đang diễn ra. Trong tiếng Việt, ta dùng 'đang' nhưng động từ không thay đổi hình thức.",
  "2823c03a-e72c-4116-9446-a35a08949fc0": "'For three years' + 'still enjoy' cho biết hành động bắt đầu trong quá khứ và vẫn tiếp tục đến bây giờ. Thì hiện tại hoàn thành ('have worked') nối quá khứ với hiện tại. Quá khứ đơn sẽ có nghĩa là bạn không còn làm ở đó nữa.",
  "abe5db8a-a23f-45d1-b299-75cd151870d3": "Việc nấu ăn đang diễn ra tại thời điểm gọi điện. Thì quá khứ tiếp diễn ('was cooking') mô tả hành động đang xảy ra khi một hành động khác xen vào. 'Cooked' có nghĩa là việc nấu ăn đã xong rồi.",
  "6c66af79-463f-497a-b01e-8067192ab4ff": "'Departs at 6:15' — thì hiện tại đơn dùng cho lịch trình cố định (tàu, máy bay, sự kiện). Đây không phải hành động thường ngày mà là lịch trình đã định sẵn. Trong tiếng Việt, ta không phân biệt hai cách dùng này.",
  "511261ae-5c7a-40fc-b55a-a8f7a79bf9d7": "'Before she turned twenty' — thì quá khứ hoàn thành ('had visited') diễn tả hành động xảy ra trước một mốc thời gian trong quá khứ. Ba chuyến đi xảy ra trước khi cô ấy 20 tuổi.",
  "3e7a9eb3-ca76-448c-9856-d0b0a86c773e": "'By this time next year' chỉ thời điểm trong tương lai. 'Will have saved' (tương lai hoàn thành) diễn tả hành động sẽ hoàn thành trước một mốc thời gian trong tương lai.",
  "36057cbd-3995-40c8-bded-117b4b026b55": "'Announced' (quá khứ) + 'they ______ a new species' — dùng quá khứ hoàn thành ('had discovered') vì việc phát hiện xảy ra trước việc công bố. Đây là trình tự thời gian: phát hiện trước, công bố sau.",
  "d8aab118-b24f-4334-b0c2-7740bb225b38": "'For over two hours when the chairperson finally called a vote' — quá khứ hoàn thành tiếp diễn ('had been debating') diễn tả hành động kéo dài liên tục trước một sự kiện khác trong quá khứ. Nhấn mạnh thời gian kéo dài (hai giờ).",
  "623fda84-083e-43af-93b0-7be0505e5e45": "'Had been languishing' (quá khứ hoàn thành tiếp diễn) — nhấn mạnh thời gian dài (sáu tháng) và tình trạng bị bỏ quên. 'Languishing' mang sắc thái tiêu cực hơn 'lying' hay 'sitting'. Đây là văn phong C1 — kết hợp ngữ pháp phức tạp với từ vựng chính xác.",
  "16a34266-2a5d-4bc4-a4c4-bb7d75886414": "'It is high time' + quá khứ đơn giả định ('revised'). Cấu trúc này dùng thì quá khứ nhưng nói về hiện tại/tương lai — diễn tả sự cấp bách. Tương tự 'It's time we left' = đã đến lúc phải đi rồi.",
  "f5068030-da68-470a-93d1-dadf6d86d05b": "'If it rains tomorrow' — câu điều kiện loại 1: if + hiện tại đơn, will + động từ nguyên mẫu. Diễn tả tình huống có thể xảy ra trong tương lai. 'Rains' (không phải 'will rain') trong mệnh đề if.",
  "138debbe-ec78-4569-94f2-ede6a523ce75": "'If I had more time' — câu điều kiện loại 2: if + quá khứ đơn, would + động từ nguyên mẫu. Diễn tả tình huống không thật ở hiện tại. 'Had' ở đây không phải quá khứ mà là giả định.",
  "194d15f4-e24f-4339-b11d-aa6b5ee5782b": "'If she had studied harder' — câu điều kiện loại 3: if + quá khứ hoàn thành, would have + quá khứ phân từ. Diễn tả tình huống không thật trong quá khứ. 'Would have passed' = đã đỗ (nhưng thực tế không đỗ).",
  "19fe0a4a-1c41-4ae1-be55-2c883bc877c1": "Câu điều kiện loại 3 hỗn hợp: 'If my friend hadn't told me' (quá khứ hoàn thành) + 'I wouldn't have known'. Cả hai mệnh đề đều nói về quá khứ không thật. Lưu ý: 'hadn't told' = nếu không nói cho tôi biết.",
  "71773c8d-2318-4b30-9292-1564655cb425": "'If the researchers had increased' — câu điều kiện loại 3 với 'might' thay cho 'would'. 'Might have been' diễn tả khả năng trong quá khứ, không chắc chắn bằng 'would have been'.",
  "7bead928-f580-48cb-8909-a7029a3e6cb8": "'Were I in your position' = 'If I were in your position' — đảo ngữ câu điều kiện loại 2. Bỏ 'if' và đưa 'were' lên đầu câu. Văn phong trang trọng, thường gặp trong email công việc và bài viết IELTS.",
  "2802a054-d2a0-41f5-a24a-4f12fce4a00d": "'But for' = 'If it had not been for' (nếu không nhờ có). Cấu trúc C1 trang trọng. 'But for the timely intervention' = nếu không có sự can thiệp kịp thời. 'Would have collapsed' = đã sụp đổ rồi.",
  "54a57843-895d-4e8b-9590-97eaf9f55b85": "'Had the team abandoned' = 'If the team had abandoned' — đảo ngữ câu điều kiện loại 3. Bỏ 'if', đưa 'had' lên đầu. 'The team abandoned their original methodology' là điều kiện, 'would never have succeeded' là kết quả.",
  "da96436c-839c-481b-9edb-122966adfc17": "'The salt' — chỉ lọ muối cụ thể trên bàn mà cả hai người đều nhìn thấy. Dùng 'the' khi cả người nói và người nghe đều biết đang nói về cái gì. Tiếng Việt không có mạo từ, nên đây là thói quen cần xây dựng: nếu cả hai biết cái nào, dùng 'the'.",
  "7af55fec-0613-4252-a196-705d76f54c4f": "'A doctor' — mô tả nghề nghiệp, cô ấy là một trong nhiều bác sĩ. Dùng 'a/an' khi giới thiệu ai đó là gì lần đầu. Câu thứ hai dùng 'the' vì bây giờ nói về bệnh viện cụ thể.",
  "07ef5b17-88b7-4217-b265-fd33b3db734d": "Cần 'the' vì có mệnh đề quan hệ xác định phía sau ('that the government recently approved'). Khi có thông tin cụ thể hóa danh từ, dùng 'the'. Quy tắc: danh từ + mệnh đề quan hệ xác định = dùng 'the'.",
  "ea880fca-8e5d-42dc-9487-2231fd300566": "'The' + tính từ so sánh nhất ('the most challenging'). Đây là quy tắc cố định: luôn dùng 'the' với so sánh nhất. 'Most' không thay thế được 'the most' — hai cấu trúc này khác nghĩa hoàn toàn.",
  "d5779125-791a-464b-a217-334448f3c1cb": "Mạo từ zero (không dùng mạo từ) với danh từ không đếm được ở nghĩa chung. 'Access to education' = quyền tiếp cận giáo dục nói chung. 'The education' sẽ chỉ một hệ thống giáo dục cụ thể.",
  "0b63ab49-084d-4b61-b527-9c2ff2f8ef22": "Bốn mạo từ trong một câu, mỗi cái có lý do riêng: 'a uniquely...' (giới thiệu mới), 'the intersection' (cụ thể hóa bởi 'of'), 'the...' (xác định). Ở trình độ C1, việc hiểu tại sao mỗi mạo từ được chọn là kỹ năng quan trọng.",
  "7340ab83-8193-4306-9929-9670f4c3d661": "'Arrive at' — dùng cho địa điểm cụ thể (nhà ga, sân bay, trường học). 'Arrive in' cho thành phố/quốc gia. 'Arrive to' là lỗi phổ biến do ảnh hưởng từ tiếng Việt ('đến').",
  "68e9bacb-448b-417b-ac06-ea654a10978c": "'Interested in' là cụm giới từ cố định. 'Interested about/for/with' đều sai. Trong tiếng Việt, ta nói 'quan tâm đến' nhưng trong tiếng Anh là 'interested in'. Cần học thuộc các cụm cố định này.",
  "2c2112e6-b4d3-45da-be64-5f627398d066": "'Comply with' = tuân thủ. Giới từ đi kèm một số động từ là cố định và không thể đoán từ nghĩa. 'Comply to/by/for' đều sai. Đây là collocation — cần học thuộc, không thể suy luận.",
  "69f9be8a-f70c-40d4-8bdd-ca8918183c5b": "'Account for' = chiếm (tỷ lệ), giải thích. Đây là phrasal verb hai từ phổ biến trong văn bản học thuật. 'Accounts for 40%' = chiếm 40%. Rất hay gặp trong IELTS Writing Task 1.",
  "51e103a7-c5a3-4d51-8499-9ca0f810dd99": "'At the expense of' = với cái giá phải trả là. Cụm giới từ phức hợp, thường gặp trong bài đọc IELTS. 'For the expense' và 'in the expense' đều không tồn tại trong tiếng Anh chuẩn.",
  "b30f2e3d-f1d1-4280-b747-c402a7e194ec": "'On the grounds that' = với lý do là. Cụm giới từ C1 trang trọng, dùng trong văn bản pháp lý và học thuật. 'On the grounds of' + danh từ cũng đúng. Các cụm giới từ phức hợp là dấu hiệu của trình độ cao.",
  "9bdb8316-46cc-409c-a016-b2fdfd0fe0d4": "'Must' ở đây diễn tả suy luận logic — rút ra kết luận từ bằng chứng (hàng dài người xếp hàng). 'It must be good' = tôi khá chắc là ngon. Khác với 'must' nghĩa bắt buộc ('you must arrive by 9').",
  "2e23efcc-5a57-4f40-b15c-cd263d829e51": "'Should have told' = lẽ ra nên nói. Diễn tả sự hối tiếc hoặc phê bình về việc không làm trong quá khứ. 'Should have + V3' là cấu trúc quan trọng trong giao tiếp — dùng khi muốn nói 'đáng lẽ phải làm mà không làm'.",
  "ee870495-9023-44cb-969f-cc5f50ecc4ae": "'Might have been affected' diễn tả khả năng về quá khứ — mẫu nhỏ có thể đã ảnh hưởng hoặc không. 'Must have' sẽ quá chắc chắn, 'should have' mang nghĩa phê bình thay vì không chắc chắn.",
  "d1d1d7af-43be-4e9f-a7d1-686907faaf27": "'May well have been intended' diễn tả khả năng nhượng bộ — khá có thể ý định là ngoại giao, nhưng hiệu quả lại ngược lại. 'May well' mạnh hơn 'may' đơn thuần. Cấu trúc C1 tinh tế, thường gặp trong bình luận chính trị.",
  "10fac7d4-f5bb-4cb4-8d58-6316ef44dae6": "'Not only... but also...' — cấu trúc song song nhấn mạnh. 'Not only does she speak French' — đảo ngữ với trợ động từ 'does'. Khi 'not only' đứng đầu câu, phải đảo ngữ. Cấu trúc này rất ấn tượng trong bài viết IELTS.",
  "ed56206b-c925-4c91-85c4-7fd190534c33": "'Hardly had... when...' — đảo ngữ với hardly/scarcely. 'Hardly had the CEO finished' = CEO vừa mới kết thúc thì... 'When' (không phải 'than') đi với 'hardly'. 'No sooner... than...' là cặp tương tự.",
  "b9d75a4a-519e-48c2-a878-667e5d1888db": "'It is essential that every student submit' — thức giả định (subjunctive mood). Sau 'essential/important/vital that', dùng dạng nguyên mẫu không chia. 'Submit' (không phải 'submits'). Cấu trúc trang trọng, phổ biến trong văn bản học thuật.",
  "1334812d-d906-41b8-a58b-e924098ac267": "'So entrenched have these practices become that...' — đảo ngữ với 'so... that'. Khi 'so + tính từ' đứng đầu câu, đảo trợ động từ. Đây là văn phong C1 trang trọng, thể hiện sự thành thạo cấu trúc phức tạp.",
  "86056459-04ba-4f22-a093-65c0a37670f1": "'Make a decision' là collocation cố định. Tiếng Anh phân biệt 'make' và 'do': 'make a decision/mistake/progress' nhưng 'do homework/research/exercise'. Không có quy tắc — cần học thuộc từng cặp.",
  "cb887625-845a-45cb-876a-4a7493e2ed1a": "'Heavy rain' (không phải 'strong rain'). Trong tiếng Anh, mưa là 'heavy' (nặng), không phải 'strong' (mạnh). Tiếng Việt nói 'mưa lớn' có thể khiến bạn chọn 'big/strong'. Collocation yêu cầu học thuộc, không suy luận.",
  "0be96527-1ac5-45f1-9dd9-52755e46a7c1": "'Draw a conclusion' = rút ra kết luận. Tiếng Anh dùng 'draw' (vẽ/kéo) với 'conclusion'. 'Make a conclusion' là lỗi phổ biến. Trong IELTS, cụm này rất quan trọng khi viết kết luận bài essay.",
  "c17d2a1e-cc01-49da-8097-c7cf83aae747": "'Commit a crime' = phạm tội. 'Commit' đi với: crime, murder, suicide, mistake, offence. 'Do a crime' là lỗi thường gặp do ảnh hưởng từ tiếng Việt ('làm' = do/make/commit).",
  "665d8d09-42a2-4227-90b2-2002991daa37": "'Raise concerns' = nêu lên mối lo ngại. Trong bối cảnh chuyên nghiệp và học thuật, concerns được 'raised' (nêu lên), 'addressed' (giải quyết), hoặc 'dismissed' (bác bỏ). 'Rise' là tự động từ (tự nó lên).",
  "a6e2ee98-fb89-4392-91b9-fe23db6f983d": "'Bear resemblance' = giống, có nét tương đồng. Cụm này trang trọng hơn 'look like'. 'Bear' ở đây nghĩa là 'mang' — mang sự tương đồng. Trong văn bản học thuật, 'bears little resemblance' = hầu như không giống.",
  "2a656987-d391-45db-8b8f-1c67dedc2928": "'Pose a threat' = đặt ra mối đe dọa. 'Pose' đi với: threat, risk, challenge, danger, question. Trong IELTS, collocation này rất phổ biến trong chủ đề môi trường và công nghệ.",
  "465d3940-b616-409f-979b-89e1922b1fbe": "'Yield results' = mang lại kết quả. 'Yield' là từ trang trọng, thường gặp trong văn bản nghiên cứu. Các động từ đi với 'results': yield, produce, generate, deliver. 'Give results' ít trang trọng hơn.",
  "da1aa99c-b380-4d35-b422-ff9e806073c0": "'Exert influence' = gây ảnh hưởng. Cụm C1 trang trọng. 'Exert' đi với: influence, pressure, control, authority. 'Apply influence' là lỗi phổ biến — 'apply' đi với 'pressure' nhưng không tự nhiên với 'influence'.",
  "55b1fd7e-0ba3-4b1c-b3b6-3cd133106ddb": "'Purely circumstantial' là collocation chuẩn trong ngôn ngữ pháp lý và học thuật. 'Purely' đi với: circumstantial, hypothetical, speculative, academic. 'Highly circumstantial' nghe hợp lý nhưng không phải cách nói chuẩn.",
  "ba15d27f-1b69-4e94-8707-0bda62e4e773": "'Turn on' = bật (thiết bị). 'Too dark' là manh mối — đèn cần được bật. 'Turn off' = tắt, 'turn up' = tăng (âm lượng, nhiệt độ), 'turn down' = giảm hoặc từ chối.",
  "1482b729-d172-4866-8e47-61635bb4da0f": "'Put off' = hoãn lại. 'Until next Thursday' xác nhận cuộc họp bị dời sang ngày khác. 'Put on' = mặc/tổ chức sự kiện. 'Put up' = cho ở nhờ. 'Put away' = cất đi.",
  "3a36c5e4-2b44-491b-9511-bfc4b85b9f00": "'Came across' = tình cờ gặp/tìm thấy. 'By chance' trong câu là manh mối rõ ràng. 'Came up with' = nghĩ ra. 'Came about' = xảy ra. 'Came into' = thừa kế.",
  "127e9434-3454-40fd-abee-fc09c64eee6d": "'Fell asleep' là cách nói tự nhiên cho khoảnh khắc chìm vào giấc ngủ, đặc biệt khi không cố ý. 'Felt asleep' là lỗi phổ biến vì 'felt' và 'fell' phát âm gần giống nhau. 'Go to sleep' cần có 'to'.",
  "91c51a53-fd84-43ed-90d3-ef49cbfde861": "'Tracked down' = tìm ra sau quá trình tìm kiếm kỹ lưỡng. Hàm ý nỗ lực bền bỉ trong thời gian dài — khớp với 'after months of investigation'. 'Ran down' gần nghĩa nhưng thiên về liệt kê hoặc theo đuổi.",
  "db809098-01b7-416c-8c44-c8b635686501": "'Brought up' = nêu lên (vấn đề) để thảo luận. Trong bối cảnh trang trọng, báo cáo 'bring up' vấn đề hoặc nhu cầu. 'Bring about' = gây ra. 'Bring out' = phát hành. 'Bring forward' = đẩy lên sớm hơn.",
  "6a4886fc-fa33-4ad9-8460-ee7a8157393d": "'Fell apart' = sụp đổ, tan vỡ — dùng cho kế hoạch, mối quan hệ, đàm phán bị phá vỡ hoàn toàn. 'Fell through' gần nghĩa nhưng chỉ việc không thành hiện thực một cách thụ động. Phân biệt: 'fell apart' = tan rã chủ động; 'fell through' = không thành.",
  "2f351160-35cb-4c79-a084-12bece690484": "'Glossed over' = lướt qua, không đề cập chi tiết, cố tình tránh né. Mang sắc thái tiêu cực — hàm ý che giấu hoặc không muốn đối mặt. Trong báo chí, 'gloss over' thường đi với các vấn đề gây tranh cãi.",
  "0ee11595-81b3-4b70-8682-030dbe906148": "Tính từ '-ing' mô tả vật/việc gây ra cảm giác: phim 'boring' (gây buồn chán). Tính từ '-ed' mô tả người cảm thấy: 'I was bored' (tôi buồn chán). Sự phân biệt -ing/-ed không có trong tiếng Việt, nên đây là điểm rất quan trọng cần nắm vững.",
  "ef3f5502-1a9d-452a-b88d-829b4c85570e": "Sau 'the', cần danh từ. 'Development' là dạng danh từ của 'develop'. Hậu tố tạo danh từ phổ biến: -ment (development, improvement), -tion (education), -ness (happiness), -ity (possibility).",
  "b40f0fd6-efd3-4912-95af-e7ff04249ac1": "'It is + tính từ + to' là mẫu câu cố định. 'Meaningless' (tính từ) = vô nghĩa. Hậu tố '-less' tạo tính từ nghĩa 'không có': meaningless, homeless, careless, hopeless. Câu nói so sánh là vô nghĩa vì phương pháp khác nhau.",
  "5188cdf2-57df-43d3-9fdc-c4f504752e55": "'The ______ of X' cần danh từ. 'Reliability' là dạng danh từ của 'reliable'. Hậu tố '-ility' (hoặc '-ability') biến tính từ thành danh từ trừu tượng: reliable → reliability, available → availability.",
  "b99fa6b8-159e-45c2-82f8-cb0544669ab9": "Sau sở hữu cách ('author's'), cần danh từ. 'Interpretation' là danh từ đúng. Thử thách C1: phân biệt 'interpretive/interpretative' (tính từ) và 'interpretation' (danh từ) — trông giống nhau nhưng chức năng ngữ pháp khác nhau.",
  "e91b80ab-13b1-48e7-beeb-9ae379255a89": "Sau sở hữu cách ('author's'), cần danh từ. 'Interpretation' là danh từ đúng. Ở trình độ C1, việc nhận diện nhanh loại từ cần thiết (danh từ/tính từ/trạng từ) dựa vào vị trí trong câu là kỹ năng then chốt.",
  "946bb083-593c-4d44-b483-bfd44e173925": "'Conduct a study/research/experiment' là collocation chuẩn trong học thuật. Trong tiếng Anh học thuật, nghiên cứu được 'conducted', không phải 'done' hay 'made'. Từ này xuất hiện rất nhiều trong bài đọc IELTS.",
  "ddfe5eaf-6323-4d1b-a2aa-8867ee7a46c8": "'Considerable evidence' = bằng chứng đáng kể (nhiều). 'Considerable' = lớn về số lượng hoặc quan trọng. 'Considerate' = chu đáo với người khác — hoàn toàn khác nghĩa. Đây là cặp từ dễ nhầm lẫn kinh điển.",
  "fc7982e9-5f53-4cd6-84c2-991ed032e82c": "'Conclude that...' là động từ chuẩn trong học thuật khi trình bày kết quả nghiên cứu. 'Conclude' = kết luận. 'Result' không đi với 'that' — phải dùng 'resulted in' + danh từ.",
  "e6db1aa6-3643-4a5a-9e29-4262b3a98efe": "'Introduce regulations/legislation/policies' — collocation chuẩn khi chính phủ tạo ra quy định mới. 'Produce' = sản xuất sản phẩm vật lý. 'Present' = trình bày. 'Introduce' = đưa ra, ban hành.",
  "81ece695-48c3-4c91-b998-ea0cfa05c083": "'Notwithstanding' = mặc dù, bất chấp. Từ nối trang trọng cấp C1, tương đương 'despite' hoặc 'in spite of'. Thường gặp trong văn bản pháp lý và học thuật. Đặt trước hoặc sau mệnh đề đều được.",
  "12be6b94-231c-48ac-a5b7-ca29b63cb796": "'Inherently' = vốn dĩ, bản chất. Trạng từ C1 diễn tả đặc tính thuộc về bản chất sự vật, không phải do yếu tố bên ngoài. 'Inherently flawed' = có khiếm khuyết từ bản chất.",
  "6502ac0b-67f2-4255-a6bf-866f22fe4da0": "'Costs an arm and a leg' = rất đắt. Thành ngữ phổ biến, nghĩa đen nghe buồn cười nhưng rất tự nhiên trong giao tiếp. Kiểu thành ngữ 'body part' trong tiếng Anh: cold feet (lo lắng), keep an eye on (theo dõi).",
  "4136913f-4d28-4388-a735-2f69e8cafe82": "'Spill the beans' = tiết lộ bí mật. Đặc biệt khi tiết lộ trước thời điểm thích hợp. 'Surprise party' trong câu là manh mối. Thành ngữ này không thể đoán từ nghĩa đen — cần học thuộc.",
  "c657141f-8d0f-4a55-9416-bc54758aa017": "'Turn a blind eye' = cố tình phớt lờ, giả vờ không thấy. Nguồn gốc từ Đô đốc Nelson đưa kính viễn vọng lên mắt mù để không thấy tín hiệu rút lui. Hàm ý tiêu cực — phớt lờ điều sai trái.",
  "33215de0-c020-4068-a20f-a212e51732a7": "'Barking up the wrong tree' = tìm sai hướng, đổ lỗi/nghi ngờ sai người. Hình ảnh: con chó sủa lên cái cây sai (con mồi đã chạy sang cây khác). Thường dùng khi ai đó đang theo đuổi sai mục tiêu.",
  "92857966-cd52-4aad-a99c-5663d3afa2e6": "'Add insult to injury' = thêm dầu vào lửa, làm tình hình vốn đã tệ càng tệ hơn. Trong bối cảnh này: chi phí pháp lý bị từ chối bồi hoàn — đã bị cắt nhân sự, lại còn phải tự trả tiền luật sư.",
  "673a0953-dfc8-45db-b06b-5ee03a9d347f": "Quán cà phê từ trống trơn đến đầy khách trong 30 phút. 'Completely empty' → 'every table was taken' = đông khách rất nhanh. Suy luận: mức độ phổ biến tăng đột ngột trong buổi chiều đó.",
  "fe0025f4-a9fa-49e1-9f0f-493e8f9d29d9": "Luôn mỉm cười + mang súp khi ốm + giúp tưới cây = nhân hậu và hay giúp đỡ. Suy luận = rút ra kết luận từ tổng hợp các bằng chứng. Không phải bác sĩ (không có bằng chứng), không phải bạn thân nhất (chỉ là hàng xóm).",
  "601fb885-f355-4bb9-9c7d-d167a206df8e": "'Record profits' nhưng 'workers not paid for overtime' — từ 'however' tạo sự tương phản. Suy luận: lợi nhuận có thể đến từ việc không trả đủ lương cho công nhân. Bài đọc không nói thẳng — bạn phải nối hai sự kiện lại.",
  "87896eef-be14-4760-a841-b91d9f08caf5": "'Dừng lại ở cổng và nhìn lại' — hành động thể chất tiết lộ cảm xúc. Nếu chỉ nhẹ nhõm, ông sẽ đi thẳng. Nếu giận, sẽ không nhìn lại. Sự dừng lại và nhìn lại gợi ý sự gắn bó và suy tư. 'Nửa cuộc đời' nhấn mạnh ý nghĩa của nơi này.",
  "029be2ea-5806-4e29-9b6b-7221ff7fd7f0": "'Bốn giờ sáng trên một chiếc xe buýt đến sân bay' — chi tiết quan trọng: bốn giờ sáng (rất sớm) + xe buýt (không phải taxi) + nhìn ánh sáng thành phố. Suy luận: cô ấy đang rời đi, có thể cảm thấy bồi hồi.",
  "ae771d78-c2fb-4ee9-bd5f-1b1a6348f677": "Cần suy luận ẩn ý từ tổng thể văn bản. Tìm manh mối trong giọng văn, cấu trúc lập luận, và từ ngữ mang sắc thái. Ở trình độ B2, suy luận đòi hỏi tổng hợp nhiều manh mối thay vì chỉ dựa vào một chi tiết.",
  "ddf63ee4-40b9-4192-a4ad-e3b0a525fe1c": "Suy luận B2 yêu cầu đọc giữa các dòng — hiểu điều tác giả ngụ ý nhưng không nói thẳng. Từ ngữ mang sắc thái ('however', 'despite', 'yet') thường là manh mối quan trọng nhất.",
  "a9c43774-f00e-4bf1-99cd-1da2a8e54ab1": "Ở B2, cần phân biệt giữa điều văn bản nói rõ và điều văn bản gợi ý. Các đáp án sai thường dựa vào thông tin đúng nhưng suy luận sai, hoặc phóng đại từ chi tiết nhỏ.",
  "be916062-6816-4714-8827-a95bb3c2d33d": "Suy luận C1 đòi hỏi hiểu giọng văn tổng thể, thái độ tác giả, và ẩn ý. Cần tổng hợp nhiều đoạn văn và nhận diện lập luận ngầm. Câu hỏi kiểu 'What does the author imply?' là dạng phổ biến nhất.",
  "94bfd67a-f2b9-4394-a6a4-1bfb96bfe91e": "Ở C1, suy luận bao gồm nhận diện mâu thuẫn tinh tế, giọng mỉa mai, và lập trường ngầm của tác giả. Đáp án đúng thường tinh tế và có nuance — đáp án sai thường quá đơn giản hoặc quá cực đoan.",
  "e65e489b-068c-43c7-8da7-9e9388363125": "Mỗi câu trong đoạn văn có vai trò: giới thiệu ý chính, cung cấp ví dụ, so sánh, hoặc kết luận. Ở A2, cần nhận biết mục đích chính của đoạn văn — nó đang cố nói gì?",
  "41b1fe4e-7c1b-4bab-b35b-5dbdee9c02fb": "Tìm câu chủ đề (topic sentence) — thường ở đầu đoạn. Các câu còn lại hỗ trợ, giải thích, hoặc minh họa cho ý chính. Kỹ năng nhận diện cấu trúc giúp đọc nhanh hơn trong IELTS.",
  "5b294e97-ea01-480d-ac17-5c43da9edd5e": "Cấu trúc văn bản B1: nhận biết mẫu tổ chức — so sánh/đối chiếu, nguyên nhân/kết quả, vấn đề/giải pháp, trình tự thời gian. Mỗi mẫu có từ nối đặc trưng.",
  "64fbfcac-f436-4959-b2cd-272f6f5f6f65": "Ở B2, cần hiểu mục đích tu từ — tại sao tác giả sắp xếp thông tin theo cách này? Ví dụ bắt đầu bằng phản biện rồi bác bỏ, hoặc trình bày hai mặt trước khi kết luận.",
  "7b3cd7dd-280c-444c-83f6-c040bb5cae6a": "Nhận diện vai trò của từng đoạn trong bài: mở bài, thân bài (luận điểm 1, 2, 3), phản biện, kết luận. Kỹ năng này giúp trả lời nhanh câu hỏi 'matching headings' trong IELTS.",
  "09b53bb9-27b9-4578-bde5-059f10a608bc": "Cấu trúc lập luận B2: thesis → evidence → counterargument → rebuttal → conclusion. Nhận diện mẫu này giúp dự đoán nội dung tiếp theo và hiểu lập trường tác giả.",
  "ae1aba54-ccba-4279-978f-dc2651edbcf0": "Ở C1, phân tích cấu trúc bao gồm hiểu chiến lược tu từ: concession (nhượng bộ), hedging (nói tránh), qualification (giới hạn phạm vi). Những kỹ thuật này tạo ra văn bản tinh tế hơn.",
  "8de67870-3c8f-465e-b4ae-d07a192b17ee": "Cấu trúc C1 phức tạp: embedded counterarguments, strategic ambiguity, rhetorical questions. Tác giả có thể cố tình để lại khoảng trống cho người đọc tự suy luận.",
  "ea8a9c40-6a38-43ad-b4d3-8f8acff1fa78": "Từ nối (cohesive devices) giúp văn bản mạch lạc. 'However' = tuy nhiên (tương phản). 'Therefore' = do đó (kết quả). 'Moreover' = hơn nữa (bổ sung). Ở A2, cần nhận biết ý nghĩa cơ bản của các từ nối phổ biến.",
  "9ac74a69-0d18-4684-99be-3ef94d53ce3e": "'Nevertheless' = tuy nhiên (mạnh hơn 'however'). Nối hai ý tương phản: ý đầu đưa ra sự thật, ý sau cho thấy kết quả bất ngờ. Dùng 'nevertheless' cho thấy sự tương phản mạnh mẽ hơn.",
  "71c636e9-a3e4-487f-badb-61880ce85f50": "'On the other hand' = mặt khác. Dùng khi trình bày hai mặt của một vấn đề. Khác với 'however': 'however' là tương phản bất ngờ, 'on the other hand' là trình bày góc nhìn khác một cách có chủ đích.",
  "3c5e5db2-44d1-43c0-b584-e3a7457ab4d8": "Từ nối B2: phân biệt nuance giữa 'although/despite/in spite of/notwithstanding'. Tất cả đều diễn tả sự nhượng bộ nhưng cấu trúc ngữ pháp và mức độ trang trọng khác nhau.",
  "e1c991f1-b2f9-4ddc-9b85-38a8c86a3266": "Ở B2, cần hiểu cohesive devices không chỉ nối câu mà còn xây dựng lập luận. 'Consequently' (kết quả), 'conversely' (ngược lại), 'admittedly' (thừa nhận) — mỗi từ định hướng lập luận.",
  "335eaa71-e6e1-40e4-8c1e-4d3280766b35": "Cohesive devices C1: 'insofar as' (trong chừng mực), 'inasmuch as' (bởi vì), 'thereby' (do đó). Những từ nối phức tạp cho thấy mối quan hệ logic tinh tế giữa các ý tưởng.",
  "d924a463-d3b9-4f41-ad74-def7b7c3f783": "Ở C1, cohesive devices bao gồm cả lexical cohesion — sự liên kết qua từ vựng: đồng nghĩa, siêu thuật ngữ (hypernym), và reference chains. Không chỉ dùng từ nối mà còn dùng từ vựng để tạo mạch lạc."
};

const PAGES = { LANDING: 0, GOAL: 1, INTRO: 2, TEST: 3, PROCESSING: 4, RESULTS: 5 };

export default function App() {
  const [page, setPage] = useState(PAGES.LANDING);
  const [lang, setLang] = useState("en");
  const [goalType, setGoalType] = useState("E");
  const [testLength, setTestLength] = useState(null); // 20 or 40
  const [fadeClass, setFadeClass] = useState("fade-in");

  // CAT State
  const [responses, setResponses] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [theta, setTheta] = useState(0);
  const [se, setSe] = useState(2.0);
  const [usedIds, setUsedIds] = useState(new Set());
  const [selectedOption, setSelectedOption] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // Results
  const [results, setResults] = useState(null);

  const t = i18n[lang];

  // Detect Vietnamese browser
  useEffect(() => {
    if (navigator.language?.startsWith("vi")) setLang("vi");
  }, []);

  const navigateTo = useCallback((newPage) => {
    setFadeClass("fade-out");
    setTimeout(() => {
      setPage(newPage);
      setFadeClass("fade-in");
      window.scrollTo(0, 0);
    }, 300);
  }, []);

  // Start test - pick first B1 item
  const startTest = useCallback(() => {
    const b1Items = ITEM_BANK.filter(i => i.cefr_difficulty === "B1");
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

  // Handle answer confirmation
  const handleConfirm = useCallback(() => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);

    const item = currentItem;
    const isCorrect = selectedOption === item.correct_choice;

    const newResponse = {
      item_id: item.item_id,
      stem: item.stem,
      options: item.options,
      correct_choice: item.correct_choice,
      learner_choice: selectedOption,
      correct: isCorrect,
      skill: item.skill,
      sub_skill: item.sub_skill,
      cefr_difficulty: item.cefr_difficulty,
      a: item.irt_a_param,
      b: item.irt_b_param,
      c: item.irt_c_param,
      explanation_text: item.explanation_text,
      distractor_traps: item.distractor_traps,
    };

    const newResponses = [...responses, newResponse];
    const { theta: newTheta, se: newSe } = IRT.estimateTheta(newResponses);
    
    setResponses(newResponses);
    setTheta(newTheta);
    setSe(newSe);

    // Check stopping rule
    setTimeout(() => {
      if (IRT.shouldStop(newResponses, newSe, testLength || 40)) {
        // Finish test
        const score = IRT.thetaToScore(newTheta);
        const cefr = IRT.thetaToCEFR(newTheta);
        const ielts = IRT.cefrToIELTS(cefr, score);
        const diagnosis = Diagnostic.analyze(newResponses, goalType);

        setResults({ theta: newTheta, se: newSe, score, cefr, ielts, diagnosis });
        navigateTo(PAGES.PROCESSING);
      } else {
        // Next item
        const newUsed = new Set([...usedIds, item.item_id]);
        setUsedIds(newUsed);
        const nextItem = IRT.selectNext(newTheta, newUsed, newResponses, ITEM_BANK);
        if (nextItem) {
          setCurrentItem(nextItem);
          setSelectedOption(null);
          setConfirmed(false);
        } else {
          // No more items, finish
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

  // Processing screen auto-advance
  useEffect(() => {
    if (page === PAGES.PROCESSING) {
      const timer = setTimeout(() => navigateTo(PAGES.RESULTS), 4000);
      return () => clearTimeout(timer);
    }
  }, [page, navigateTo]);

  // Keyboard navigation for test
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
  }, [page, confirmed, selectedOption, handleConfirm]);

  const progressPct = useMemo(() => {
    const max = testLength || 40;
    const min = max === 20 ? 16 : 20;
    const count = responses.length;
    const seThreshold = max === 20 ? 0.45 : 0.40;
    if (count < min) return (count / max) * 100;
    const sePct = Math.max(0, 1 - se / seThreshold);
    return Math.min(95, (count / max) * 100 + sePct * 5);
  }, [responses.length, se, testLength]);

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        
        :root {
          --navy: #1A1A2E;
          --teal: #0D7377;
          --teal-dark: #095456;
          --teal-wash: #E8F4F5;
          --teal-wash-2: #d0eced;
          --slate: #4A5568;
          --strength: #1E8449;
          --strength-bg: #e8f5e9;
          --developing: #B7950B;
          --developing-bg: #fef9e7;
          --gap: #922B21;
          --gap-bg: #fdedec;
          --silver: #F7F9FC;
          --gold: #C8972A;
          --white: #FFFFFF;
          --shadow-sm: 0 1px 3px rgba(26,26,46,0.08);
          --shadow-md: 0 4px 16px rgba(26,26,46,0.1);
          --shadow-lg: 0 8px 32px rgba(26,26,46,0.12);
          --radius: 12px;
          --radius-lg: 20px;
          --font-serif: 'Source Serif 4', Georgia, serif;
          --font-sans: 'DM Sans', -apple-system, sans-serif;
          --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          background: var(--silver);
          color: var(--navy);
          font-family: var(--font-sans);
          font-size: 16px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ─── Transitions ─── */
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .fade-out { animation: fadeOut 0.3s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes gentleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes progressPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }

        /* ─── Language Toggle ─── */
        .lang-toggle {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 100;
          background: var(--white);
          border: 1.5px solid var(--teal-wash-2);
          color: var(--teal);
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: var(--transition);
        }
        .lang-toggle:hover { background: var(--teal-wash); }

        /* ─── Landing Page ─── */
        .landing {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 24px;
          text-align: center;
          background: linear-gradient(168deg, #f0fafb 0%, var(--silver) 40%, #fefefe 100%);
          position: relative;
          overflow: hidden;
        }
        .landing::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13,115,119,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .landing::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13,115,119,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .landing-logo {
          font-family: var(--font-serif);
          font-size: 18px;
          font-weight: 600;
          color: var(--teal);
          letter-spacing: 0.03em;
          margin-bottom: 48px;
          animation: slideUp 0.6s ease;
        }

        .landing h1 {
          font-family: var(--font-serif);
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 700;
          color: var(--navy);
          line-height: 1.2;
          max-width: 600px;
          margin-bottom: 16px;
          animation: slideUp 0.6s ease 0.1s both;
        }

        .landing-sub {
          font-size: 15px;
          color: var(--slate);
          max-width: 480px;
          margin-bottom: 40px;
          animation: slideUp 0.6s ease 0.2s both;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--teal);
          color: var(--white);
          font-family: var(--font-sans);
          font-size: 17px;
          font-weight: 600;
          padding: 16px 36px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: var(--transition);
          animation: slideUp 0.6s ease 0.3s both;
          box-shadow: 0 4px 20px rgba(13,115,119,0.25);
        }
        .cta-btn:hover { background: var(--teal-dark); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(13,115,119,0.3); }
        .cta-btn:active { transform: translateY(0); }

        .landing-features {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 56px;
          animation: slideUp 0.6s ease 0.4s both;
        }
        .feature-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--slate);
        }
        .feature-pill .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--teal);
          flex-shrink: 0;
        }

        .landing-about {
          margin-top: 48px;
          padding: 24px;
          max-width: 480px;
          border-top: 1px solid var(--teal-wash-2);
          animation: slideUp 0.6s ease 0.5s both;
        }
        .landing-about h3 {
          font-family: var(--font-serif);
          font-size: 15px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
        }
        .landing-about p {
          font-size: 13px;
          color: var(--slate);
          line-height: 1.6;
        }

        /* ─── FAQ Section on Landing ─── */
        .faq-section {
          width: 100%;
          max-width: 560px;
          margin-top: 40px;
          animation: slideUp 0.6s ease 0.6s both;
        }
        .faq-section h2 {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 16px;
          text-align: center;
        }
        .faq-item {
          background: var(--white);
          border-radius: var(--radius);
          padding: 16px 20px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: var(--transition);
          border: 1px solid transparent;
        }
        .faq-item:hover { border-color: var(--teal-wash-2); }
        .faq-item h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .faq-item p {
          font-size: 13px;
          color: var(--slate);
          margin-top: 8px;
          line-height: 1.6;
        }
        .faq-chevron {
          transition: var(--transition);
          color: var(--slate);
          font-size: 12px;
        }
        .faq-chevron.open { transform: rotate(180deg); }

        /* ─── Goal Page ─── */
        .goal-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 60px 24px 40px;
          background: var(--silver);
        }
        .goal-page h1 {
          font-family: var(--font-serif);
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 600;
          color: var(--navy);
          text-align: center;
          margin-bottom: 8px;
        }
        .goal-page .subtitle {
          font-size: 14px;
          color: var(--slate);
          text-align: center;
          margin-bottom: 32px;
          max-width: 480px;
        }
        .goal-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 520px;
        }
        .goal-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--white);
          border: 2px solid transparent;
          border-radius: var(--radius);
          padding: 20px 24px;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          min-height: 64px;
        }
        .goal-card:hover { border-color: var(--teal-wash-2); transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .goal-card.selected { border-color: var(--teal); background: var(--teal-wash); }
        .goal-card .icon { font-size: 28px; flex-shrink: 0; }
        .goal-card .label { font-size: 15px; font-weight: 500; color: var(--navy); line-height: 1.4; }
        
        .goal-skip {
          margin-top: 24px;
          font-size: 14px;
          color: var(--slate);
          cursor: pointer;
          background: none;
          border: none;
          font-family: var(--font-sans);
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: var(--transition);
        }
        .goal-skip:hover { color: var(--teal); }

        /* ─── Intro Page ─── */
        .intro-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 60px 24px 40px;
          background: var(--silver);
        }
        .intro-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 40px 32px;
          max-width: 560px;
          width: 100%;
          box-shadow: var(--shadow-md);
        }
        .intro-card h1 {
          font-family: var(--font-serif);
          font-size: 24px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 24px;
        }
        .intro-points {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        .intro-points li {
          display: flex;
          gap: 12px;
          font-size: 15px;
          color: var(--navy);
          line-height: 1.5;
        }
        .intro-points li::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--teal);
          flex-shrink: 0;
          margin-top: 7px;
        }
        .intro-start {
          width: 100%;
          padding: 16px;
          background: var(--teal);
          color: var(--white);
          border: none;
          border-radius: 50px;
          font-family: var(--font-sans);
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .intro-start:hover:not(.dimmed) { background: var(--teal-dark); }
        .intro-start.dimmed {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .intro-start.active {
          opacity: 1;
          cursor: pointer;
        }

        /* Test Length Selection */
        .test-length-section {
          margin-bottom: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--teal-wash-2);
        }
        .test-length-title {
          font-family: var(--font-serif);
          font-size: 17px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 6px;
        }
        .test-length-sub {
          font-size: 13px;
          color: var(--slate);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .test-length-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .test-length-card {
          position: relative;
          background: var(--silver);
          border: 2px solid transparent;
          border-radius: var(--radius);
          padding: 20px 16px;
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
        }
        .test-length-card:hover {
          border-color: var(--teal-wash-2);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .test-length-card.selected {
          border-color: var(--teal);
          background: var(--teal-wash);
        }
        .test-length-card .tlc-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .test-length-card .tlc-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 6px;
        }
        .test-length-card .tlc-desc {
          font-size: 12px;
          color: var(--slate);
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .test-length-card .tlc-note {
          font-size: 11px;
          color: var(--teal-dark);
          font-style: italic;
          line-height: 1.4;
        }
        .tlc-recommended-badge {
          position: absolute;
          top: -9px;
          right: 12px;
          background: var(--teal);
          color: var(--white);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 10px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        @media (max-width: 480px) {
          .test-length-cards { grid-template-columns: 1fr; }
        }

        /* ─── Test Session ─── */
        .test-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 24px 16px;
          background: var(--white);
        }
        .test-progress-bar {
          width: 100%;
          max-width: 560px;
          height: 4px;
          background: var(--teal-wash);
          border-radius: 2px;
          margin-bottom: 48px;
          overflow: hidden;
        }
        .test-progress-fill {
          height: 100%;
          background: var(--teal);
          border-radius: 2px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .test-content {
          width: 100%;
          max-width: 560px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .question-stem {
          font-family: var(--font-serif);
          font-size: 18px;
          font-weight: 400;
          color: var(--navy);
          line-height: 1.7;
          margin-bottom: 32px;
          white-space: pre-line;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }

        .option-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: var(--silver);
          border: 2px solid transparent;
          border-radius: var(--radius);
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--navy);
          text-align: left;
          transition: var(--transition);
          min-height: 52px;
          line-height: 1.4;
        }
        .option-btn:hover:not(.confirmed) { border-color: var(--teal-wash-2); background: var(--teal-wash); }
        .option-btn.selected { border-color: var(--teal); background: var(--teal-wash); }
        .option-btn.confirmed.correct { border-color: var(--strength); background: var(--strength-bg); }
        .option-btn.confirmed.incorrect { border-color: var(--gap); background: var(--gap-bg); opacity: 0.7; }
        .option-btn.confirmed.is-correct { border-color: var(--strength); background: var(--strength-bg); }

        .option-letter {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          background: var(--white);
          color: var(--slate);
          flex-shrink: 0;
          transition: var(--transition);
        }
        .option-btn.selected .option-letter { background: var(--teal); color: var(--white); }
        .option-btn.confirmed.correct .option-letter { background: var(--strength); color: var(--white); }

        .confirm-btn {
          width: 100%;
          padding: 16px;
          background: var(--teal);
          color: var(--white);
          border: none;
          border-radius: 50px;
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          opacity: 0.4;
          pointer-events: none;
        }
        .confirm-btn.active { opacity: 1; pointer-events: auto; }
        .confirm-btn.active:hover { background: var(--teal-dark); }

        .calm-phrase {
          text-align: center;
          font-size: 13px;
          color: #a0aec0;
          margin-top: 24px;
          font-style: italic;
        }

        /* ─── Processing Screen ─── */
        .processing-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 24px;
          text-align: center;
          background: linear-gradient(168deg, var(--teal-wash) 0%, var(--silver) 100%);
        }
        .processing-orb {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, var(--teal), var(--teal-dark));
          margin-bottom: 32px;
          animation: breathe 3s ease infinite;
          box-shadow: 0 0 40px rgba(13,115,119,0.2);
        }
        .processing-text {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 400;
          color: var(--navy);
          animation: pulse 2s ease infinite;
        }

        /* ─── Results Page ─── */
        .results-page {
          min-height: 100vh;
          padding: 32px 16px 60px;
          background: var(--silver);
        }
        .results-inner {
          max-width: 640px;
          margin: 0 auto;
        }

        .results-hero {
          background: linear-gradient(135deg, var(--teal-wash) 0%, #f0fafb 100%);
          border-radius: var(--radius-lg);
          padding: 32px 28px;
          text-align: center;
          margin-bottom: 24px;
          box-shadow: var(--shadow-md);
          animation: slideUp 0.6s ease;
        }

        .cefr-badge {
          display: inline-block;
          font-family: var(--font-serif);
          font-size: 48px;
          font-weight: 700;
          color: var(--teal);
          margin-bottom: 4px;
          letter-spacing: -1px;
        }
        .cefr-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 12px;
        }
        .cefr-description {
          font-size: 14px;
          color: var(--slate);
          line-height: 1.6;
          max-width: 480px;
          margin: 0 auto 16px;
        }
        .goal-statement {
          font-family: var(--font-serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--teal-dark);
          padding: 12px 20px;
          background: rgba(255,255,255,0.6);
          border-radius: var(--radius);
          display: inline-block;
        }

        /* Score Section */
        .score-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
          animation: slideUp 0.6s ease 0.1s both;
        }
        .score-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 20px;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        .score-card .label {
          font-size: 12px;
          font-weight: 600;
          color: var(--slate);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .score-card .value {
          font-family: var(--font-serif);
          font-size: 32px;
          font-weight: 700;
          color: var(--navy);
        }
        .score-card .sub {
          font-size: 13px;
          color: var(--slate);
          margin-top: 4px;
        }

        /* Score bar */
        .score-bar-wrap {
          background: var(--white);
          border-radius: var(--radius);
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
          animation: slideUp 0.6s ease 0.15s both;
        }
        .score-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--slate);
          margin-bottom: 8px;
        }
        .score-bar {
          height: 10px;
          background: var(--teal-wash);
          border-radius: 5px;
          overflow: hidden;
          position: relative;
        }
        .score-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--teal), #10a0a5);
          border-radius: 5px;
          transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .score-bar-markers {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          font-size: 10px;
          color: var(--slate);
        }

        /* Skill Breakdown */
        .skill-section {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
          animation: slideUp 0.6s ease 0.2s both;
        }
        .section-title {
          font-family: var(--font-serif);
          font-size: 18px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 20px;
        }
        .skill-bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .skill-bar-name {
          width: 90px;
          font-size: 13px;
          font-weight: 500;
          color: var(--navy);
          flex-shrink: 0;
        }
        .skill-bar-track {
          flex: 1;
          height: 8px;
          background: var(--silver);
          border-radius: 4px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .skill-bar-pct {
          width: 40px;
          font-size: 14px;
          font-weight: 600;
          text-align: right;
        }

        /* Sub-skill heatmap */
        .subskill-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        .subskill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--silver);
        }
        .subskill-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--navy);
          flex: 1;
        }
        .subskill-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 12px;
          margin-left: 8px;
        }
        .badge-strength { background: var(--strength-bg); color: var(--strength); }
        .badge-developing { background: var(--developing-bg); color: var(--developing); }
        .badge-focus { background: var(--gap-bg); color: var(--gap); }

        .subskill-pct {
          font-size: 13px;
          font-weight: 600;
          color: var(--slate);
          margin-left: 12px;
          min-width: 36px;
          text-align: right;
        }

        /* Diagnosis Section */
        .diagnosis-section {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
          animation: slideUp 0.6s ease 0.3s both;
        }
        .wrong-answer-group {
          margin-bottom: 20px;
        }
        .wrong-answer-group h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--teal);
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--teal-wash);
        }
        .wrong-answer-item {
          padding: 16px;
          background: var(--silver);
          border-radius: var(--radius);
          margin-bottom: 10px;
        }
        .wrong-answer-item .wa-stem {
          font-size: 14px;
          color: var(--navy);
          margin-bottom: 10px;
          line-height: 1.5;
          white-space: pre-line;
        }
        .wa-choices {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 10px;
        }
        .wa-choice {
          font-size: 13px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .wa-choice .wa-label {
          font-weight: 500;
          color: var(--slate);
          flex-shrink: 0;
          min-width: 100px;
        }
        .wa-choice.learner-wrong { color: var(--slate); }
        .wa-choice.correct-answer { color: var(--strength); font-weight: 500; }
        .wa-explanation {
          font-size: 13px;
          color: var(--slate);
          line-height: 1.5;
          padding: 10px 12px;
          background: var(--teal-wash);
          border-radius: 8px;
          border-left: 3px solid var(--teal);
        }

        /* Roadmap Section */
        .roadmap-section {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
          animation: slideUp 0.6s ease 0.35s both;
        }
        .priority-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .priority-card {
          padding: 16px 20px;
          border-radius: var(--radius);
          border-left: 4px solid var(--teal);
          background: var(--silver);
        }
        .priority-card h4 {
          font-size: 15px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 4px;
        }
        .priority-card .pc-detail {
          font-size: 13px;
          color: var(--slate);
        }
        .priority-card .pc-resources {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pc-resource-link {
          font-size: 13px;
          color: var(--teal);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pc-resource-link:hover { text-decoration: underline; }

        /* Week plan */
        .week-plan {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .week-row {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 12px;
          padding: 14px 16px;
          background: var(--silver);
          border-radius: var(--radius);
        }
        .week-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--teal);
        }
        .week-content {
          font-size: 13px;
          color: var(--navy);
          line-height: 1.5;
        }
        .week-content .milestone {
          font-size: 12px;
          color: var(--slate);
          margin-top: 4px;
          font-style: italic;
        }

        /* Disclaimer */
        .disclaimer-box {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 14px 16px;
          background: #fef9e7;
          border: 1px solid #f0e4b8;
          border-radius: var(--radius);
          margin-bottom: 20px;
        }
        .disclaimer-box .disclaimer-icon {
          flex-shrink: 0;
          font-size: 16px;
          margin-top: 1px;
        }
        .disclaimer-box p {
          font-size: 12px;
          color: var(--slate);
          line-height: 1.6;
          margin: 0;
        }
        .disclaimer-inline {
          font-size: 11px;
          color: var(--slate);
          line-height: 1.5;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(13,115,119,0.1);
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Actions */
        .actions-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 32px;
          animation: slideUp 0.6s ease 0.4s both;
        }
        .action-btn {
          padding: 14px 28px;
          border-radius: 50px;
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          border: 2px solid var(--teal);
        }
        .action-btn.primary { background: var(--teal); color: var(--white); }
        .action-btn.primary:hover { background: var(--teal-dark); }
        .action-btn.secondary { background: var(--white); color: var(--teal); }
        .action-btn.secondary:hover { background: var(--teal-wash); }

        .retake-note {
          text-align: center;
          font-size: 13px;
          color: var(--slate);
          margin-top: 16px;
          font-style: italic;
        }

        /* Collapsible sections */
        .collapse-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }
        .collapse-chevron {
          font-size: 14px;
          color: var(--slate);
          transition: var(--transition);
        }
        .collapse-chevron.open { transform: rotate(180deg); }

        /* ─── Mobile optimizations ─── */
        @media (max-width: 640px) {
          .score-section { grid-template-columns: 1fr 1fr; }
          .landing h1 { font-size: 26px; }
          .results-hero { padding: 24px 20px; }
          .cefr-badge { font-size: 40px; }
          .skill-section, .diagnosis-section, .roadmap-section { padding: 20px 16px; }
          .test-content { padding: 0 4px; }
          .actions-row { flex-direction: column; }
          .action-btn { width: 100%; text-align: center; }
        }
      `}</style>

      <button className="lang-toggle" onClick={() => setLang(lang === "en" ? "vi" : "en")}>
        {t.langToggle}
      </button>

      <div className={fadeClass}>
        {page === PAGES.LANDING && <LandingPage t={t} onStart={() => navigateTo(PAGES.GOAL)} />}
        {page === PAGES.GOAL && <GoalPage t={t} onSelect={(g) => { setGoalType(g); navigateTo(PAGES.INTRO); }} onSkip={() => { setGoalType("E"); navigateTo(PAGES.INTRO); }} />}
        {page === PAGES.INTRO && <IntroPage t={t} onStart={startTest} onSelectLength={setTestLength} />}
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
        {page === PAGES.PROCESSING && <ProcessingPage t={t} />}
        {page === PAGES.RESULTS && results && (
          <ResultsPage
            t={t}
            results={results}
            goalType={goalType}
            lang={lang}
            onRetake={() => {
              setResults(null);
              setTestLength(null);
              navigateTo(PAGES.LANDING);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════

function LandingPage({ t, onStart }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="landing">
      <div className="landing-logo">{t.siteTitle}</div>
      <h1>{t.tagline}</h1>
      <p className="landing-sub">{t.taglineSub}</p>
      <button className="cta-btn" onClick={onStart}>
        {t.startBtn}
        <span style={{ fontSize: 20 }}>→</span>
      </button>
      <div className="landing-features">
        {["CEFR A2–C1", "IELTS Estimate", "Weakness Diagnosis", "Study Roadmap"].map(f => (
          <div className="feature-pill" key={f}><span className="dot"></span>{f}</div>
        ))}
      </div>
      <div className="landing-about">
        <h3>{t.aboutTitle}</h3>
        <p>{t.aboutText}</p>
      </div>
      <div className="faq-section">
        <h2>{t.faqTitle}</h2>
        {t.faqs.map((faq, i) => (
          <div className="faq-item" key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
            <h4>
              {faq.q}
              <span className={`faq-chevron ${openFaq === i ? 'open' : ''}`}>▼</span>
            </h4>
            {openFaq === i && <p>{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalPage({ t, onSelect, onSkip }) {
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

function IntroPage({ t, onStart, onSelectLength }) {
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

function TestPage({ t, item, selectedOption, confirmed, onSelect, onConfirm, progress }) {
  if (!item) return null;
  const letters = ["A", "B", "C", "D"];
  
  return (
    <div className="test-page">
      <div className="test-progress-bar">
        <div className="test-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="test-content">
        <div className="question-stem">{item.stem}</div>
        <div className="options">
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
        >
          {t.confirmBtn}
        </button>
        <p className="calm-phrase">{t.calmPhrase}</p>
      </div>
    </div>
  );
}

function ProcessingPage({ t }) {
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

function ResultsPage({ t, results, goalType, lang, onRetake }) {
  const { score, cefr, ielts, diagnosis } = results;
  const [showDiagnosis, setShowDiagnosis] = useState(true);
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [scoreAnimated, setScoreAnimated] = useState(0);

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 1500;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScoreAnimated(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const goalStatement = t.goalStatements[goalType]?.[cefr] || t.goalStatements.E[cefr];
  
  const skillColors = {
    Grammar: "#0D7377",
    Vocabulary: "#2D8F70",
    Reading: "#3B7DD8",
  };

  const statusBadgeClass = (status) => {
    if (status === "Strength") return "badge-strength";
    if (status === "Developing") return "badge-developing";
    return "badge-focus";
  };

  const statusLabel = (status) => {
    if (status === "Strength") return t.strength;
    if (status === "Developing") return t.developing;
    return t.focusArea;
  };

  const handleShare = async () => {
    const text = `${t.siteTitle}: ${cefr} (${t.cefrLabels[cefr]}) — ${t.score}: ${score}/100 — IELTS ${t.band} ${ielts}`;
    if (navigator.share) {
      try { await navigator.share({ title: t.siteTitle, text }); } catch {}
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  return (
    <div className="results-page">
      <div className="results-inner">
        {/* Hero */}
        <div className="results-hero">
          <div className="cefr-badge">{cefr}</div>
          <div className="cefr-label">{t.cefrLabels[cefr]}</div>
          <p className="cefr-description">{t.cefrDescriptions[cefr]}</p>
          <div className="goal-statement">{goalStatement}</div>
          <div className="disclaimer-inline">{t.disclaimer}</div>
        </div>

        {/* Score Cards */}
        <div className="score-section">
          <div className="score-card">
            <div className="label">{t.score}</div>
            <div className="value">{scoreAnimated}</div>
            <div className="sub">/ 100</div>
          </div>
          <div className="score-card">
            <div className="label">{t.ieltsEstimate}</div>
            <div className="value">{ielts}</div>
            <div className="sub">{t.band}</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="score-bar-wrap">
          <div className="score-bar-label">
            <span>A2</span>
            <span>B1</span>
            <span>B2</span>
            <span>C1</span>
          </div>
          <div className="score-bar">
            <div className="score-bar-fill" style={{ width: `${score}%` }}></div>
          </div>
          <div className="score-bar-markers">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="skill-section">
          <div className="section-title">{t.skillBreakdown}</div>
          {["Grammar", "Vocabulary", "Reading"].map(skill => {
            const pct = diagnosis.skillAccuracy[skill] || 0;
            const color = skillColors[skill];
            return (
              <div className="skill-bar-row" key={skill}>
                <div className="skill-bar-name">{t[skill.toLowerCase()]}</div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${pct}%`, background: color }}></div>
                </div>
                <div className="skill-bar-pct" style={{ color }}>{pct}%</div>
              </div>
            );
          })}
          
          {/* Sub-skill heatmap */}
          <div className="subskill-grid" style={{ marginTop: 20 }}>
            {Object.entries(diagnosis.subSkillAnalysis)
              .sort((a, b) => a[1].accuracy - b[1].accuracy)
              .map(([name, data]) => (
                <div className="subskill-row" key={name}>
                  <span className="subskill-name">{name}</span>
                  <span className={`subskill-badge ${statusBadgeClass(data.status)}`}>
                    {statusLabel(data.status)}
                  </span>
                  <span className="subskill-pct">{data.accuracy}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Diagnosis — What We Learned */}
        <div className="diagnosis-section">
          <div className="collapse-header" onClick={() => setShowDiagnosis(!showDiagnosis)}>
            <div className="section-title" style={{ marginBottom: 0 }}>{t.diagnosisTitle}</div>
            <span className={`collapse-chevron ${showDiagnosis ? 'open' : ''}`}>▼</span>
          </div>
          {showDiagnosis && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
                {diagnosis.totalCorrect} {t.correct} {t.of} {diagnosis.totalItems} {t.questions}
              </p>
              <div className="disclaimer-box">
                <span className="disclaimer-icon">ℹ️</span>
                <p>{t.disclaimer}</p>
              </div>
              {Object.entries(diagnosis.wrongBySubSkill)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([subSkill, items]) => (
                  <div className="wrong-answer-group" key={subSkill}>
                    <h4>{subSkill} ({items.length})</h4>
                    {items.map((item, idx) => (
                      <div className="wrong-answer-item" key={idx}>
                        <div className="wa-stem">{item.stem}</div>
                        <div className="wa-choices">
                          <div className="wa-choice learner-wrong">
                            <span className="wa-label">{t.youChose}</span>
                            <span>{item.options[item.learner_choice]}</span>
                          </div>
                          <div className="wa-choice correct-answer">
                            <span className="wa-label">{t.theAnswer}</span>
                            <span>{item.options[item.correct_choice]}</span>
                          </div>
                        </div>
                        <div className="wa-explanation">{lang === "vi" && VI_EXPLANATIONS[item.item_id] ? VI_EXPLANATIONS[item.item_id] : item.explanation_text}</div>
                      </div>
                    ))}
                  </div>
                ))}
              {diagnosis.wrongAnswers.length === 0 && (
                <p style={{ color: "var(--strength)", fontWeight: 500, textAlign: "center", padding: 20 }}>
                  {lang === "vi" ? "Hoàn hảo! Bạn đã trả lời đúng tất cả các câu hỏi." : "Perfect! You answered every question correctly."}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Roadmap */}
        <div className="roadmap-section">
          <div className="collapse-header" onClick={() => setShowRoadmap(!showRoadmap)}>
            <div className="section-title" style={{ marginBottom: 0 }}>{t.roadmapTitle}</div>
            <span className={`collapse-chevron ${showRoadmap ? 'open' : ''}`}>▼</span>
          </div>
          {showRoadmap && (
            <div style={{ marginTop: 16 }}>
              {/* Priority Skills */}
              {diagnosis.weaknesses.length > 0 && (
                <>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>{t.prioritySkills}</h3>
                  <div className="priority-cards">
                    {diagnosis.weaknesses.map((w, i) => {
                      const res = RESOURCES[w.name.replace(w.skill + " — ", "")] || RESOURCES[w.name] || [];
                      const filteredRes = res.filter(r => r.tags.includes(goalType)).slice(0, 3);
                      const fallbackRes = res.slice(0, 3);
                      const finalRes = filteredRes.length > 0 ? filteredRes : fallbackRes;
                      
                      return (
                        <div className="priority-card" key={i}>
                          <h4>#{i + 1} — {w.name}</h4>
                          <div className="pc-detail">
                            {w.accuracy}% {t.correct} ({w.correct}/{w.total}) — {statusLabel(w.status)}
                          </div>
                          {finalRes.length > 0 && (
                            <div className="pc-resources">
                              <div style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, marginBottom: 2 }}>{t.resources}</div>
                              {finalRes.map((r, ri) => (
                                <a className="pc-resource-link" href={r.url} target="_blank" rel="noopener noreferrer" key={ri}>
                                  ↗ {r.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* 4-Week Plan */}
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)", marginBottom: 12, marginTop: 24 }}>
                {t.weekPlan} <span style={{ fontSize: 12, color: "var(--slate)", fontWeight: 400 }}>({t.minsPerDay})</span>
              </h3>
              <div className="week-plan">
                {t.weeks.map((week, i) => {
                  // Replace generic focus with actual weakness names
                  const weakness = diagnosis.weaknesses[i] || diagnosis.weaknesses[0];
                  const focusName = weakness ? weakness.name : week.focus;
                  return (
                    <div className="week-row" key={i}>
                      <div className="week-label">{week.title}</div>
                      <div className="week-content">
                        <strong>{i < 3 ? focusName : week.focus}</strong>
                        <br />
                        {week.activity}
                        <div className="milestone">✓ {week.milestone}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="actions-row">
          <button className="action-btn secondary" onClick={handleShare}>{t.shareBtn}</button>
          <button className="action-btn primary" onClick={onRetake}>{t.retakeBtn}</button>
        </div>
        <p className="retake-note">{t.retake}</p>
      </div>
    </div>
  );
}
