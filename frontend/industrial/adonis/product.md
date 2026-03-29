---
name: adoniz-product
description: Complete product knowledge for Adoniz — the AI Voice of Customer platform. Use this skill when writing copy, building features, creating marketing content, or making any product decision for Adoniz. Covers what the product does, who it's for, the problem it solves, features, competitive positioning, messaging pillars, tone, and landing page content structure.
---

# Adoniz — Product Knowledge

This skill defines WHAT Adoniz is and WHAT to say about it. It is the single source of truth for all product messaging, copy, and content decisions.

---

## 1. What Adoniz Is

**One-liner**: Adoniz is the AI brain that sits on top of all your customer conversations and tells you exactly what your users need — before you have to ask.

Adoniz is an AI-native Voice of Customer (VoC) platform that turns messy, scattered customer conversations into actionable product intelligence.

It ingests data from support channels (Intercom, Slack, email, call transcripts, Mixpanel) — automatically sanitizes it for PII — and uses AI to categorize, analyze sentiment, extract recurring themes, and summarize everything. The PM then interacts with their data through a conversational interface — asking questions in plain English and getting concrete, data-backed answers.

### Tagline Options (for landing page)
- "Your customers are talking. Adoniz is listening."
- "From noise to North Star — AI-powered customer intelligence."
- "Stop reading tickets. Start reading signals."
- "Every customer conversation holds a signal. Adoniz finds it."

---

## 2. The Problem

### The reality for PMs today

- **80% of conversations are invisible.** Hundreds of support chats per day across Intercom, Zendesk, Freshdesk — but only ~20% get escalated as tickets. The other 80% contain buried gold: feature requests, pain points, sentiment shifts, churn signals. Nobody mines them.
- **Support agents solve-and-move-on.** They close the ticket and move to the next one. The insight dies with the chat.
- **Monthly insight extraction is brutal.** A real PM described their process: hit Intercom API via Postman — run through middleware to strip PII — dump into Google Sheets — manually review — feed to ChatGPT for sentiment analysis. An entire day, once a month. The rest of the month, they're blind to 80% of conversations.
- **Dashboards give graphs, not answers.** When a PM logs in, they have a specific question: "Is sentiment trending negative?" or "What are merchants complaining about most?" They don't want to click through 15 charts to reverse-engineer an answer.
- **Data security is a real blocker.** Before feeding any conversation to AI, sensitive data (store URLs, emails, subscription IDs) must be stripped. Currently done manually. Slow, error-prone, doesn't scale.

### The cost of this problem
- Wrong product decisions — building on gut feel or the loudest customer, not signal.
- Missed churn signals — negative sentiment brews unnoticed until the customer leaves.
- Wasted PM time — a full day per month on manual data wrangling.
- Lost feature requests — buried in chat transcripts, never surfacing to the product team.

---

## 3. Who It's For

### Primary: Product Managers at SaaS Companies
- PMs at product-led SaaS (B2B or B2C).
- Lean teams where PM wears multiple hats (PM + co-founder, PM + some QA, PM + support oversight).
- Companies with active support channels generating significant chat volume.
- Using Intercom, Slack, Zendesk, Freshdesk for customer communication.

### Sweet Spot (Initial Target)
- **Shopify app developers / plugin companies** — Shopify merchants as customers, heavy Intercom usage, active support, North Star tied to merchant success.
- **B2B SaaS with 100–10,000 customers** — enough volume that manual breaks down, not so massive they have enterprise tooling.
- **Startups/scale-ups with 1–5 PMs** — no dedicated data analysts or UX researchers.

### Secondary Users
- Customer Success Managers — understanding account health.
- Support Team Leads — identifying systemic issues.
- Founders/CXOs — pulse on customer sentiment.

---

## 4. How It Works (User Flow)

**Step 1: Ingest Data**
Upload or connect customer conversations. MVP: manual upload (CSV, JSON, TXT, PDF) or paste raw text. Select source type (Intercom, Slack, Email, Call Transcript, Mixpanel, Other). Future: direct API integrations for automatic continuous ingestion.

**Step 2: Automatic PII Sanitization**
Adoniz strips PII automatically — email addresses, URLs, customer names, store names, subscription IDs, phone numbers. Combination of regex pattern matching and context-aware AI. PM never manually scrubs again.

**Step 3: AI Analysis (automatic on ingestion)**
Every conversation processed through:
- **Sentiment Analysis** — Positive / Neutral / Negative with confidence scores.
- **Categorization** — Error/Bug, Feature Request, Escalation, Billing Issue, Onboarding Question, General Inquiry.
- **Theme Extraction** — recurring topics and patterns across conversations.
- **Summarization** — one-line per conversation + aggregate summaries per category and time period.

**Step 4: Dashboard**
At-a-glance analytics: sentiment distribution, category breakdown, trending issues, volume over time, key highlight cards (top 3 issues, top feature requests, sentiment trend).

**Step 5: Conversational Q&A (the crown jewel)**
Chat panel where user asks natural language questions:
- "What are the top 5 recurring issues this month?"
- "What % of chats had negative sentiment in the last 30 days?"
- "Show me all feature requests related to checkout"
- "What are customers saying about the subscription widget?"
- "Are there emerging issues this week vs last?"
- "Summarize the escalations from last week"

Adoniz responds with concrete, data-backed text answers with numbers, specifics, and citations to source conversations.

---

## 5. Key Features (MVP)

| Feature | Description |
|---------|-------------|
| Multi-source ingestion | Conversations from Intercom, Slack, Email, Call Transcripts, Mixpanel. CSV, JSON, TXT, PDF. |
| Auto PII sanitization | AI + regex stripping of sensitive data. No manual scrubbing. |
| Sentiment analysis | Every conversation scored pos/neutral/neg with confidence. Aggregate on dashboard. |
| Smart categorization | Auto-classify: Error, Feature Request, Escalation, Billing, Onboarding, General. |
| Theme extraction | AI identifies recurring patterns — surfaces what customers repeatedly talk about. |
| One-line summaries | Each conversation summarized. Category-level and time-period summaries too. |
| Analytics dashboard | Sentiment distribution, category breakdown, volume trends, highlight cards. |
| Conversational Q&A | Ask natural language questions. Get answers, not graphs. |
| Structured storage | All conversations indexed, searchable. Nothing lost, everything queryable. |

---

## 6. Competitive Positioning

### vs. Reading tickets manually
Adoniz processes 100% of conversations, not just the 20% that become tickets.

### vs. Monthly ChatGPT dump
Adoniz automates the full pipeline: ingestion → sanitization → analysis → querying. A full day per month becomes always-on.

### vs. Dashboards (Mixpanel, GA, Amplitude)
Those track events and funnels (quantitative "what"). Adoniz understands conversations (qualitative "why"). And answers questions directly instead of making you interpret graphs.

### vs. Dovetail
Strong UX research tool, but heavyweight, expensive, designed for research teams. Repository-first, not intelligence-first.

### vs. Hey Marvin
Research repo focus. Good for organizing, less for real-time support analysis.

### vs. SentiSum
Closest competitor. Good at ticket analytics. Adoniz differentiates with conversational Q&A (ask questions, get answers) and built-in PII sanitization pipeline.

**Adoniz positioning**: Not a research repository. Not another dashboard. An AI analyst that lives on top of your customer conversations and gives you answers when you ask.

---

## 7. Messaging & Tone

### Brand Personality
- **Intelligent but not cold** — smart, speaks plainly.
- **Confident, not arrogant** — knows it solves a real problem.
- **Builder-focused** — built by product builders, for product builders.
- **No-BS** — no fluff. Specific thing, done well.
- **Modern, clean, premium** — high-quality tool, not cheap SaaS template.

### Messaging Pillars

1. **"Hear what your customers aren't telling you"** — 80% of conversations never become tickets. The insight is there. You're just not capturing it.
2. **"Ask questions, get answers"** — Not another dashboard. A conversational interface that treats customer data like a queryable knowledge base.
3. **"Security-first by design"** — Auto PII sanitization. Data protected before any AI touches it. No manual scrubbing.
4. **"From a full day to always-on"** — Painful monthly exercise becomes continuous, automatic intelligence.
5. **"Built for PMs who ship"** — Not a heavyweight research tool. A lean, fast intelligence layer for teams that move fast.

### Tone Rules
- Direct, conversational, slightly bold.
- Show the problem viscerally ("the PM drowning in tickets, the brutal monthly exercise").
- Show the solution clearly ("here's exactly what Adoniz does").
- Use real-ish scenarios ("Imagine 300 support chats from last week...").
- **Avoid**: "leverage", "synergy", "revolutionize", "cutting-edge", "game-changer", "empower", "unlock potential."
- **Embrace**: "actually", "concretely", "specifically", "here's what happens."

---

## 8. Landing Page Content Structure

### Section 1: Hero
- Bold headline (one of the taglines or variation).
- Sub-headline explaining the core value prop in one sentence.
- CTA: "Join the Waitlist" or "Get Early Access."
- Visual: stylized screenshot of the conversational interface or dashboard.

### Section 2: Problem Statement
Paint the pain. Be visceral, specific, relatable.
- The 80% of chats nobody reads.
- The monthly day-long manual exercise.
- The dashboards full of graphs that don't answer questions.
- Use real numbers and scenarios.

### Section 3: How It Works
4-step visual flow:
1. **Ingest** — Connect your support channels (Intercom, Slack, email, calls).
2. **Sanitize** — PII automatically stripped. Zero manual scrubbing.
3. **Analyze** — AI categorizes, scores sentiment, extracts themes, summarizes.
4. **Ask** — Query your data in plain English. Get answers, not graphs.

### Section 4: Key Features
6 features presented as bento cards or split sections (not uniform grid):
- Multi-source ingestion
- Auto PII sanitization
- Sentiment analysis + smart categorization
- Recurring theme extraction
- One-line conversation summaries
- Analytics dashboard

### Section 5: The "Ask Your Data" Showcase
This is THE differentiator. Dedicate a full section to it.
- Mock chat interface showing example queries and AI responses.
- 3-4 real example questions with realistic answers.
- Make it feel interactive or show a product mockup.

### Section 6: Who It's For
PM personas, founders, CS teams at SaaS companies.
Brief cards or short descriptions for each persona.

### Section 7: Security & Privacy
Emphasize auto PII sanitization.
- "Your data is protected before any AI touches it."
- Describe what gets stripped (emails, URLs, names, IDs).
- Position as a real blocker solved.

### Section 8: Why Not Just...
Competitive differentiation (keep it classy, not attack-y):
- "Why not just use ChatGPT?" — No automation, no sanitization, monthly manual effort.
- "Why not spreadsheets?" — Doesn't scale past 50 conversations.
- "Why not Dovetail?" — Heavyweight, expensive, designed for research teams.

### Section 9: Final CTA
- Dark section, bold headline, email capture / waitlist form.
- Reinforce the core promise.

---

## 9. Copy Voice Examples

### Headlines (Good)
- "Stop reading tickets. Start reading signals."
- "300 support chats from last week. One question away from knowing exactly what your users need."
- "Your customers told you what to build next. It's buried in 2,000 support chats."
- "What if you could ask your customer data a question — and actually get an answer?"

### Headlines (Bad — never write like this)
- "Revolutionize your customer feedback workflow"
- "The all-in-one platform for leveraging customer insights"
- "Unlock the power of your customer conversations"
- "Empower your product team with cutting-edge AI"

### Body Copy (Good)
"Right now, 80% of your customer conversations disappear the moment a support agent hits 'resolved.' The feature requests, the frustration patterns, the churn signals — they're all there. You're just not seeing them. Adoniz changes that."

### Body Copy (Bad)
"In today's fast-paced business environment, leveraging customer insights is more important than ever. Our cutting-edge AI platform empowers product teams to unlock the full potential of their customer feedback data."

---

## 10. Technical Facts (for credibility claims)

- **Stack**: Next.js + Supabase (PostgreSQL + pgvector) + OpenAI + Vercel.
- **AI models**: GPT-4o-mini for bulk processing, GPT-4o for conversational Q&A, text-embedding-3-small for semantic search.
- **How Q&A works**: Question → embedded → vector similarity finds relevant conversations → fed as context to AI → grounded, data-backed answer. Stats questions query structured DB directly. Lightweight router chooses the path.
- **PII stripping**: Regex + context-aware AI combination. Handles emails, URLs, names, store names, subscription IDs, phone numbers.
- **Supported sources**: Intercom, Slack, Email, Call Transcripts, Mixpanel. Formats: CSV, JSON, TXT, PDF.

---

## 11. What Visitors Need to Understand in 30 Seconds

1. Adoniz ingests your customer conversations from multiple channels.
2. It automatically sanitizes and analyzes them (sentiment, categories, themes).
3. You ask it questions in plain English and get concrete answers.
4. It replaces your monthly manual data-wrangling with always-on intelligence.

## 12. What Makes Them Sign Up

- **Recognition**: "Oh, this is exactly my problem."
- **Clarity**: "I understand exactly what this does."
- **The Q&A concept**: "I can just ASK my data questions?"
- **The security angle**: "It handles PII automatically? That's huge."
