// ═══════════════════════════════════════════════════════════════
// LANDING PAGE — The first screen the learner sees
// ═══════════════════════════════════════════════════════════════
//
// Emotional intention (Website Bible §5.2):
//   "Curiosity, not anxiety — 'I want to know'"
//
// Key design moment:
//   "Find out exactly where your English is — in 20 minutes."
//
// Copy rules:
//   - Use "find out", "discover" — never "test", "exam", "score"
//   - Show what they'll GAIN, not what they risk losing
//   - Warm, human copy — no exam language
//
// Includes: hero section, feature pills, FAQ accordion, about section

import { useState } from "react";

export function LandingPage({ t, onStart }) {
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

