# LessonLab — Resume Here

**Platform handover (read first):** https://raw.githubusercontent.com/LuckDragonAsgard/asgard-source/main/docs/HANDOVER.md
**PIN:** get from Mona/Paddy verbally → use for vault at asgard-vault.pgallivan.workers.dev
**CF account:** a6f47c17811ee2f8b6caeb8f38768c20 (Luck Dragon Main)

---

## What this is
LessonLab — AI lesson planning tool for F–6 Victorian Curriculum 2.0 teachers.
Subscription SaaS. Subjects: Literacy, Numeracy, Science, Health & PE, Visual Arts, Music, Performing Arts, French, Digital Tech, HASS, Wellbeing (11 total).

**Live URLs:**
- Marketing: https://www.lessonlab.com.au
- App: https://www.lessonlab.com.au/app
- API: https://lessonlab-api.pgallivan.workers.dev

---

## Architecture

| Layer | What | Where |
|---|---|---|
| Frontend | index.html (marketing) + app.html (app) | CF Pages `lessonlab` project |
| API | lessonlab-api CF Worker | pgallivan.workers.dev |
| Auth + DB | Supabase | lessonlab project |
| Payments | Stripe | dashboard.stripe.com |
| Templates | /templates/*.docx | This repo |
| Domain | www.lessonlab.com.au | CF Pages custom domain |
| Apex redirect | lessonlab.com.au → www | CF zone 3353e2f276434918c4f0056d2ef7be4a (pending activation as of 2026-05-01) |

---

## Current state (2026-05-01)

### ✅ Done
- All 11 subjects in SUBJ_CFG, UNITS, SCAFFOLDS in app.html
- All 11 template .docx files + build scripts in /templates
- VALID_SUBJECTS in lessonlab-api includes all 11 subjects
- Stripe price env vars set for all subjects (monthly + annual)
- Marketing page: 11 subjects, correct chips, correct count
- Apex redirect rule deployed (CF zone pending → will auto-activate)
- Legal pages live: /privacy, /terms, /refund
- ABN 64 697 434 898 on all pages
- Footer links to all legal pages

### ⏳ Pending (no code work needed)
- CF zone lessonlab.com.au activation (nameservers propagated, CF self-activates ~1hr)

### 🔴 Action required (Paddy/Mona)
- Get Professional Indemnity + Cyber Liability insurance quotes (BizCover)
- ✅ GST registered (23 April 2026)
- Trademark "LessonLab" on IP Australia (~$250, class 41)
- See [docs/legal-compliance.md](docs/legal-compliance.md) for full checklist

---

## Key files
- `index.html` — marketing page
- `app.html` — full app (auth, lesson gen, export, Stripe checkout)
- `templates/` — v11 .docx blanks + build scripts (one per subject)
- `docs/legal-compliance.md` — legal & insurance checklist
- `vercel.json` — routing config (also used by CF Pages)
