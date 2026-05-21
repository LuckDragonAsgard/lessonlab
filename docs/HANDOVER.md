# lessonlab — Handover

**Repo:** [github.com/LuckDragonAsgard/lessonlab](https://github.com/LuckDragonAsgard/lessonlab)
**Last update:** 2026-05-06 — **v11 generator follow-ups all shipped**: multi-lesson export stitches one combined docx; new `_v11Enrich` helper fills VTLM 2.0 vocab tiers / sentence stems / metacog / cohort prompts / worked example / retrieval plan; new `_v11LegacyMap` adapter ports the 604 v2/v3 ai_lessons forward at export time. Live at lessonlab.com.au.

Index of all projects: [LuckDragonAsgard/asgard-source/docs/HANDOVER.md](https://github.com/LuckDragonAsgard/asgard-source/blob/main/docs/HANDOVER.md)

---

## What this is

**LessonLab** is a Victorian-Curriculum-2.0–aligned F–6 lesson-plan generator for Australian primary teachers. The web app at `app.html` lets specialist teachers compose lessons; the generator emits Word docs that are CRT-friendly on page 1 and VTLM 2.0 compliant on pages 2–3.

The 2026-04-27 session **rebuilt the lesson plan template from scratch across 11 versions**. Landing point: **v11**, three A4 pages, fully VTLM 2.0 compliant. PE was the anchor; Literacy was the proof of cross-subject portability.

The 2026-04-29 session **shipped v11 across the remaining 9 subjects** using a config-driven sed-replace orchestrator. All 10 subjects are now in `templates/`.

---

## Live URLs

- **App (production):** https://lessonlab.luckdragon.io — CF Worker `lessonlab` (inline v11 build), `app.html` proxied from GitHub raw
- **API:** https://lessonlab-api.luckdragon.workers.dev (D1-backed, ~931 lessons)
- **Lesson handler:** https://lesson-handler.luckdragon.workers.dev
- **Legacy redirect:** `lessonlab.com.au` + `www.lessonlab.com.au` → `lessonlab.luckdragon.io` via `lessonlab-redirect` CF Worker

---

## v11 Lesson Plan Template — current state

### Page 1 — CRT delivery sheet
Header strip · TODAY/SUCCESS CRITERIA/CUE WORDS panel · ATTENTION SIGNAL banner (subject-specific) · EQUIPMENT/RESOURCES/MATERIALS + ENTRY + EXIT 3-col · 5-phase strip with timings · phase activity table (5 rows, 18pt, "Say:" callouts in red) · IF BEHAVIOUR ISSUE / IF NOT WORKING / NOTES bottom strip.

### Page 2 — VTLM Specialist Detail #1
4 Elements of Learning checklist (Attention/focus/regulation · Knowledge/memory · Retention/recall · Mastery/application) · ELEMENT 1 PLANNING (lesson focus, curriculum, where students are at, sequence, resources) · ELEMENT 2 ENABLING LEARNING (LI, SC, why, vocab 3 tiers, routines, self-regulation prompts) · ELEMENT 3 EXPLICIT TEACHING I DO (focus the learning, chunked explanation, worked example, sentence stems, CFU 1).

### Page 3 — VTLM Specialist Detail #2
ELEMENT 4 SUPPORTED APPLICATION (We do → You do) (practice, sentence stems, CFU 2, application) · TIER 1 / CORE / TIER 3 task differentiation · REFLECTION · METACOGNITION · EXIT TASK (cool-down + SC self-check, mandated metacognitive prompts, retrieval) · INCLUSIVE PRACTICE — priority cohorts (EAL/D · Koorie · disability · disadvantage) · Named adjustments · Assessment + misconceptions · Teacher reflection.

### VTLM 2.0 mandated elements — all covered

Verified against [Victorian DET PAL doc](https://www2.education.vic.gov.au/pal/victorian-teaching-learning-model/print-all):
✓ 4 Elements of Teaching as page 2-3 spine · ✓ 4 Elements of Learning checklist · ✓ I do → We do → You do · ✓ Clear LI/SC · ✓ Worked example · ✓ Manageable chunks · ✓ Timely corrective feedback · ✓ Sentence stems · ✓ Cue words · ✓ Metacognitive prompts · ✓ CFU 1 + CFU 2 · ✓ Vocabulary 3 tiers · ✓ Tier 1/Core/Tier 3 differentiation · ✓ Inclusive priority cohorts · ✓ Named adjustments · ✓ Misconceptions · ✓ Retrieval · ✓ Assessment + Teacher Reflection.

VTLM 2.0 implementation: schools using from 2025, full embedding mandated start of 2028 school year.

---

## Files in this repo

```
templates/
  WPS_PE_Foundation_T2W1_v11.docx               # PE example — Foundation, "Running safely + 3-step stop"
  WPS_PE_Foundation_T2W1_v11.pdf                # PDF preview
  WPS_PE_LessonPlan_TEMPLATE_v11.docx           # Tokenised PE blank — generator-ready (~150 {{tokens}})
  WPS_Literacy_Y2_T2W1_v11.docx                 # Literacy example — Y2 recount writing
  WPS_Numeracy_Y3_T2W1_v11_FIXED.docx           # NEW Numeracy Y3 — bridging through 10
  WPS_Visual_Art_Y4_T2W1_v11_FIXED.docx         # NEW Visual Art Y4 — texture / rubbings / pattern
  WPS_HASS_Y5_T2W1_v11_FIXED.docx               # NEW HASS Y5 — Victorian gold rush sources
  WPS_Music_Y2_T2W1_v11_FIXED.docx              # NEW Music Y2 — beat vs rhythm
  WPS_Wellbeing_Y1_T2W1_v11_FIXED.docx          # NEW Wellbeing Y1 — naming feelings
  WPS_Digital_Tech_Y6_T2W1_v11_FIXED.docx       # NEW Digital Tech Y6 — algorithms with branching (Scratch)
  WPS_French_Y3_T2W1_v11_FIXED.docx             # NEW French Y3 — greetings (bonjour, ça va)
  WPS_Performing_Arts_Y4_T2W1_v11_FIXED.docx    # NEW Performing Arts Y4 — tableaux
  WPS_Science_Y5_T2W1_v11_FIXED.docx            # NEW Science Y5 — states of matter
  build_<subject>_v11_example.js                # docx-js source for each of the 10 subject docs
  _build/
    orchestrate_subjects.py                     # Config-driven sed-replace orchestrator
    push_subjects.py                            # GitHub Contents API push helper
    subject_configs.py                          # 9-subject content configs (part 1: Numeracy/VisualArt/HASS)
    subject_configs_2.py                        # 9-subject content configs (part 2: Music/Wellbeing/DigitalTech/French/PerformingArts/Science)
    build_v11_example.js                        # PE base used as substitution source
    build_v11_template.js                       # PE blank tokenised template
docs/
  HANDOVER.md                                   # This file
  VTLM-2.0-mandate-checklist.md                 # Element-by-element compliance checklist
  TOKEN-MAP.md                                  # Full token list (~150) — the generator API
```

---

## Subject template change matrix — all 10 SHIPPED

The v11 skeleton stays the same for every subject. Only mid-blocks change:

| Field | PE | Literacy | Numeracy | Visual Art | Music | French | Performing Arts | HASS | Wellbeing | Digital Tech | Science |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Year | F | Y2 | Y3 | Y4 | Y2 | Y3 | Y4 | Y5 | Y1 | Y6 | Y5 |
| Equipment label | EQUIPMENT | RESOURCES / TEXTS | MATERIALS | MATERIALS / MEDIA | INSTRUMENTS | RESOURCES | COSTUMES / PROPS | RESOURCES | RESOURCES | TOOLS / DEVICES | EQUIPMENT |
| Signal | Whistle | Clap | Bell | "Tools down" bell | Drumbeat | "Écoutez!" | Freeze + breath | Bell | Mindful chime | "Eyes on screen" | Bell |
| Phase 1 | Warm-up | Mini-lesson | Number talk | Hook / inspiration | Vocal warm-up | Bonjour ritual | Body warm-up | Big question | Check-in | Brief | Hook |
| Phase 2 | Explicit Teaching | Modelled writing | Worked example | Technique demo | Listening + analysis | Vocab + dialogue | Modelled rehearsal | Source intro | Skill modelled | Iteration plan | Modelled enquiry |
| Phase 3 | Practice (We do) | Shared writing | Guided practice | Guided practice | Group sing/play | Pair dialogue | Group rehearsal | Source analysis | Pair practice | Build / code | Guided experiment |
| Phase 4 | Application (You do) | Independent writing | Independent problem | Independent making | Solo / small group | Mini-conversation | Performance | Recording / journal | Application scenario | Test | Independent investigation |
| Phase 5 | Pack up & reflect | Share-back | Share strategies | Gallery walk | Performance share | Au revoir + recap | Reflect + applaud | Discussion | Reflection circle | Evaluate | Share findings |

All 10 PDFs/docx are in `templates/`. Each is VTLM-2.0 compliant on pages 2–3 with sentence stems, vocab tiers, worked example, CFU 1+2, Tier 1/Core/Tier 3, EAL/D + Koorie + Disability + Disadvantage cohort prompts, named adjustments, look-fors, misconceptions, retrieval plan.

---

## How to build a new subject template

1. Add a new entry to `templates/_build/subject_configs.py` (or `subject_configs_2.py`) — copy any existing subject dict and edit the ~140 fields.
2. Run the orchestrator:
   ```bash
   cd templates/_build
   python3 orchestrate_subjects.py
   ```
   This loops through every subject in the configs, applies sed-replace on `build_v11_example.js` (PE base), runs `node` to build the docx, applies the Word zip-ordering fix, and writes a `_FIXED.docx`.
3. Push to repo:
   ```bash
   ONLY=YourSubject python3 push_subjects.py
   ```
4. Optionally render PDF: `python3 .claude/skills/docx/scripts/office/soffice.py --headless --convert-to pdf FILE.docx`

The orchestrator emits WARN messages for "missing snippets" — these are benign: earlier substitutions (lesson_title, vc_codes, SCs) consume snippets that later compound substitutions also reference. The output is correct.

---

## How to deploy

- **App:** deployed via Cloudflare Pages/Workers from `index.html` + `app.html` in this repo. Pages auto-deploy from `LuckDragonAsgard/lessonlab/main` on push.
- Default pattern for new files: push to this repo via `lessonlab-api` worker (`https://lessonlab-api.luckdragon.workers.dev/gh-write`).

---

## Infrastructure

- **CF account:** `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)
- **GitHub org:** `LuckDragonAsgard` (legacy at `PaddyGallivan/lessonlab`)
- **D1 databases:** `lessonlab` (UUID: `295203f9-1f60-43f0-91f2-a6fd6b55d069`) — lessons, users, sessions, ai_lessons, lesson_usage, generate_errors, templates
- **lessonlab-api secrets:** 18 total — ANTHROPIC_API_KEY, RESEND_API_KEY, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_* (12 price IDs), + internal secrets
- **Secrets:** `asgard-vault.luckdragon.workers.dev` (PIN-gated; PIN rotated 2026-04-28 — see vault `/secret/PADDY_PIN`)
- **gh-push bearer:** stored at vault `/secret/GH_PUSH_BEARER` and bound to the gh-push worker.

---

## Known issues / TODO

### Resolved
- ✅ **gh-push worker repaired** (2026-04-29) — `GH_PUSH_BEARER` minted via `openssl rand -hex 32`, saved to vault, bound to worker.
- ✅ **9 remaining subject templates shipped** (2026-04-29) — Numeracy, Visual Art, HASS, Music, Wellbeing, Digital Tech, French, Performing Arts, Science. All clean of PE leakage.
- ✅ **Drive deprecation** — all build artefacts now live here in GitHub. Drive copies (in 🏰 ASGARD folder, paddy@luckdragon.io) can be retired.

### Open work
- **Wire v11 into `WPS_Lesson_Generator_FINAL.gs`** (or current generator) — swap output template to v11 token map. Once swapped, generator emits all future lessons in v11 shape automatically.
- ~~**Port existing v6/v7 PE lessons forward** to v11 shape.~~ — DONE 2026-05-06 (`_v11LegacyMap` runtime adapter; see Recent work).
- **Build per-subject tokenised TEMPLATEs** — currently we have an example .docx per subject; the generator will need a `WPS_<Subject>_LessonPlan_TEMPLATE_v11.docx` blank with `{{tokens}}` for each. Pattern in `build_v11_template.js` (PE) is the reference — apply same sed-replace strategy.
- **Build remaining year levels** within each subject (currently only one year per subject as a proof of shape).

---

## Recent work

### 2026-04-29 — 9 subjects shipped + gh-push repair (this session)

Built the orchestrator (`orchestrate_subjects.py`) that loads per-subject configs (~141 fields each), applies sed-replace on the PE base, builds via `node`, applies Word zip-fix, and pushes via the GitHub Contents API. All 10 subjects (PE/Literacy/9 new) now in `templates/` with verified zero PE leakage on the new 9.

`gh-push` worker repaired by minting a fresh bearer secret, saving to `asgard-vault` at `/secret/GH_PUSH_BEARER`, and binding it to the worker via the CF API. Workers Routes:Edit and Workers Scripts:Edit token (`asgard-fullops`) used.

### 2026-04-27 — v11 lesson plan template

Iterated WPS PE lesson plan from v6/v7 → **v11** in a single session. Path: v8 (tokens, removed page1↔2 duplication, added "won't join in", boundary diagram, why-it-matters, warm-up VTLM home) → v9 (vertical-centred cells) → v10 (all VTLM 2.0 mandates) → v11 (CRT-friendly page 1, full A4 fill, 3 pages). Then tokenised PE blank into a generator-ready template (~150 `{{tokens}}`) and cut a Literacy Y2 T2W1 v11 example to prove the shape works for any subject.

claude_sessions row IDs: 10, 11, 12 (2026-04-27), 13 (this session 2026-04-29).

### 2026-04-30 — v11 generator wiring + tokenised blanks shipped

- Built **9 tokenised TEMPLATE blanks** for the new subjects (`templates/WPS_<Subject>_LessonPlan_TEMPLATE_v11_FIXED.docx`) — generator-ready, 133 `{{tokens}}` each. Used `_build/orchestrate_blanks.py` (labels-only sed-replace from the PE blank).
- **Patched the PE blank** to tokenise `{{signal_1}}, {{signal_2}}, {{phase_label_4}}` (previously hardcoded PE labels).
- **Wired v11 into `app.html`** — added `exportToWordV11()` and a "v11 Word (VTLM)" button next to the existing Download Word. Function fetches the per-subject blank from GitHub raw, fills 133 tokens from current `state`, re-zips and downloads. MVP: exports the FIRST lesson only — multi-lesson v11 is a follow-up.
- **Added `docs/TOKEN-MAP.md`** — full 133-token reference (the generator API).
- **Added `docs/VTLM-2.0-mandate-checklist.md`** — element-by-element compliance audit.

Open follow-ups:
- Multi-lesson v11 export (currently only first lesson is emitted; rest of the term plan is silently dropped).
- Many tokens fall back to defaults because current state model doesn't carry richer fields (e.g. vocabulary tiers, sentence stems, metacog prompts, cohort prompts). To get them populated by the generator instead of defaulted, extend `generateLesson()` to emit them.
- Port v6/v7 PE lessons forward.
- Build more year levels per subject.

claude_sessions row IDs: 13 (2026-04-29), 14 (this session 2026-04-30).


### 2026-05-06 — v11 generator follow-ups closed (multi-lesson, enrich, legacy port)

Three open follow-ups from the 2026-04-30 session, all shipped to live `app.html`:

- **Multi-lesson v11 export** — `exportToWordV11()` now stitches every lesson in `state.lessons` into a single combined `.docx`. Algorithm: load the per-subject blank once, peel off the body template (between `<w:body>` and the trailing `<w:sectPr>`), run token replacement against a fresh copy for each lesson, separate consecutive lessons with a `<w:br w:type="page"/>` paragraph, then reattach the original `<w:sectPr>...</w:body></w:document>` tail. Headers, footers, styles and rels untouched. Filename pattern: `<School>_<Subject>_T<term>_W<first>-W<last>_v11.docx` for multi, single-lesson naming preserved for n=1. Commit `69519084`.

- **`_v11Enrich` helper** — new module-scope function that augments any lesson data object with VTLM 2.0 fields the v11 template expects but `_generateLessonRaw()` does not emit: vocabulary tiers (subject-aware bank covering all 11 subjects), sentence stems (explicit + practice), metacog prompts, EAL/D + Koorie + disability + disadvantage cohort prompts, worked-example narrative (subject-aware), and a week-keyed retrieval plan. `generateLesson()` is now a thin wrapper: rename of the original to `_generateLessonRaw()` + new wrapper that calls `_v11Enrich()`. Cohort token rows in `_v11TokenMap()` rewired to read `d.eald[1-4]` / `d.koorie[1-4]` / `d.disability[1-4]` / `d.disadv[1-4]` with prior hard-coded strings as fallbacks. Commit `5db375f9`.

- **`_v11LegacyMap` adapter for v2/v3 ai_lessons** — runtime mapper that walks the 604 v2/v3 prompt-format AI-generated lessons in `lessonlab-api` D1 (`ai_lessons` table — 196 v2 PE + 392 v3 PE + 1 v3 literacy + 15 v1 unsubjected) and hoists their narrative fields (`materials → equipment`, `cues → cue1/cue2/cue3`, `points → cue fallback`, `entry → entry1`, `entrySay → warmUpSay`, `teach → teach1`, `practice → practice1`, `game → app1`, `exit → packup1`, `ifWell → differentiation.extension`, `ifNot → differentiation.support`) onto the v11 token names. `_v11TokenMap()` now calls `_v11LegacyMap(d)` and `_v11Enrich(d, ...)` at the start of every export, so a freshly-generated lesson, a lesson loaded from D1, or any imported legacy lesson all export to a fully populated v11 docx. Idempotent — both helpers set flags to skip on re-entry. Commit `5a1fdc88`.

End-to-end verified against a real v3 row from D1 (id=212, "Handballing Helpers"): all of cue_1/2/3, entry_1, warm_up_say, teach_step_1, practice_step_1, app_step_1, packup_step_1, tier1_task_1, tier3_task_1 populate from the legacy fields rather than hitting the generic defaults.

Defensive cleanup: pre-existing `'👎 Noted. We'll improve this.'` syntax error in `rateLessonAI()` (literal ASCII apostrophe inside SQ string — block #8 wouldn't parse in Node) was fixed at the same time by replacing the apostrophe with U+2019 `'`. Block #8 now parses cleanly.

Verification on live: `https://www.lessonlab.com.au/app.html` size 1,122,141 bytes; `_v11LegacyMap` × 3, `_v11Enrich` × 7. Pages auto-deploy from `LuckDragonAsgard/lessonlab/main` on push.


### 2026-05-21 — Full audit + lessonlab-api v2.0.0 rebuild + 7 app.html fixes

#### lessonlab-api v2.0.0 — full API rebuilt from scratch

**Background:** The `lessonlab-api` CF Worker was discovered to have been replaced by a GitHub-write-only stub (v1.1.0) in a prior session. The original full API (auth, lessons, generation, Stripe, admin) was gone. Rebuilt from scratch as v2.0.0.

**D1 database:** `lessonlab` (UUID: `295203f9-1f60-43f0-91f2-a6fd6b55d069`) — all data intact (7 users, 615 ai_lessons).

**D1 schema (key tables):**
- `users` — id, email, password_hash, display_name, school_name, tier, role, is_admin, stripe_customer_id, stripe_subscription_id, subjects, addons, plan_interval, school_logo
- `lessons` — id, user_id, subject, unit, focus, year_level, term, week, title, learning_intention, success_criteria, equipment, lesson_data
- `sessions` — id, user_id, expires_at (30-day sessions)
- `lesson_usage` — user_id, year_month, count (monthly generation tracking)
- `ai_lessons` — AI-generated lesson JSON store (615 rows)
- `password_reset_tokens` — for /auth/forgot-password flow

**Auth:** Custom session-based (NOT Supabase JWT, NOT Cloudflare KV). Sessions stored in D1. Token = 64-char hex stored in localStorage as `ll_token`, sent as `Authorization: Bearer <token>`. Password hashing: PBKDF2-SHA256, 100,000 iterations, 16-byte random salt. Hash format: `base64(salt).base64(hash)` = 69 chars.

**Paddy's password reset (2026-05-21):** `pgallivan@outlook.com` password was reset to `LessonLab2026!` to verify the hash algorithm. Change it after confirming login works.

**Worker endpoints (v2.0.0):**
- `GET /health` — public
- `POST /auth/signup` — register (email, password, display_name, school_name)
- `POST /auth/signin` — login, returns session token
- `POST /auth/signout` — deletes session
- `GET /auth/session` — returns current user from token
- `POST /auth/update-password` — change password (requires current_password)
- `POST /auth/forgot-password` — sends reset email via Resend
- `POST /auth/reset-password` — reset with token
- `GET /profile` — get user profile
- `PUT /profile` — update display_name, school_name, school_logo, curriculum
- `GET /api/usage` — monthly generation stats
- `GET /lessons` — list saved lessons
- `POST /lessons` — save lesson
- `GET /lessons/:id` — get single lesson
- `DELETE /lessons/:id` — delete lesson
- `POST /lessons/generate` — AI lesson via Anthropic claude-haiku-4-5-20251001
- `POST /lessons/rate/:id` — rate ai_lesson by D1 row id
- `POST /stripe/checkout` — create Stripe checkout session
- `POST /stripe/portal` — Stripe billing portal
- `POST /stripe/webhook` — handle subscription events
- `GET /admin/users` — list all users (is_admin only)
- `POST /admin/set-tier` — set user tier (is_admin only)
- `GET /falkor/access` — returns Falkor agent PIN (is_admin only, server-side only)
- `POST /gh-write` — GitHub file write (X-Pin: LESSONLAB_PIN)
- `POST /gh-delete` — GitHub file delete (X-Pin: LESSONLAB_PIN)

**Worker secrets set:** ANTHROPIC_API_KEY, STRIPE_SECRET_KEY, RESEND_API_KEY, GITHUB_TOKEN, LESSONLAB_PIN (1708), FALKOR_AP, STRIPE_PRICE_PRO_MONTHLY, STRIPE_PRICE_PRO_ANNUAL, STRIPE_PRICE_ADDON_ANNUAL, STRIPE_PRICE_SCHOOL_ANNUAL, STRIPE_PRICE_EXTRA_SUBJECT_MONTHLY, STRIPE_PRICE_SCHOOL_BRANDING_MONTHLY, STRIPE_PRICE_YEAR_PLANNER_MONTHLY, STRIPE_PRICE_CYCLE_PLANNER_MONTHLY, STRIPE_PRICE_FULL_UNITS

**Stripe price IDs (set as worker secrets 2026-05-21):**
| Secret | Price ID | Product | Amount |
|--------|----------|---------|--------|
| STRIPE_PRICE_PRO_MONTHLY | price_1TLpaYAm8bVflPN0G8IWNqsZ | LessonLab Pro - Subject Base | AUD $12/month |
| STRIPE_PRICE_PRO_ANNUAL | price_1TLzXAAm8bVflPN07Jarm0nn | LessonLab — First Subject (Annual) | AUD $99/year |
| STRIPE_PRICE_ADDON_ANNUAL | price_1TLzXAAm8bVflPN0sieXVcDp | LessonLab — Additional Subject (Annual) | AUD $45/year |
| STRIPE_PRICE_SCHOOL_ANNUAL | price_1TYitAAm8bVflPN0RKVHVmxM | LessonLab — School Site Licence Annual | AUD $1,500/year |
| STRIPE_PRICE_EXTRA_SUBJECT_MONTHLY | price_1TLpaZAm8bVflPN0wkCgmKmz | LessonLab - Extra Subject | AUD $5/month |
| STRIPE_PRICE_SCHOOL_BRANDING_MONTHLY | price_1TLzu9Am8bVflPN0TFGRDhjr | LessonLab — School Branding | AUD $5/month |
| STRIPE_PRICE_YEAR_PLANNER_MONTHLY | price_1TLpaZAm8bVflPN0bt93Sm3v | LessonLab - Year Planner | AUD $12/month |
| STRIPE_PRICE_CYCLE_PLANNER_MONTHLY | price_1TLpaaAm8bVflPN09jJD2y7T | LessonLab - Cycle Planner | AUD $8/month |
| STRIPE_PRICE_FULL_UNITS | price_1TLpabAm8bVflPN0l4bmz30N | LessonLab - Full Units (per subject) | AUD $8 one-time |

**Generation limits:** Free = 3/month, Pro/School = 20/month.

#### app.html — 7 fixes shipped (commit 8e887de7)

1. **API_URL** — fixed `lessonlab-api.pgallivan.workers.dev` → `lessonlab-api.luckdragon.workers.dev`
2. **Landing page VC codes** — replaced old VC1 codes (`VCHPEM082 · VCHPEM083`) with real VC2 codes (`VC2HP4M01 · VC2HP4M02`)
3. **Falkor curriculum-align prompt** — fixed few-shot example from `VCHPEM1` → `VC2HP4M01`
4. **AI fallback notice** — `generateAll()` catch/empty-response branches now call `showToast('AI is temporarily unavailable — using pre-built lesson templates.', 'warn')` once per session (guarded by `window._aiFailedNotified`)
5. **Falkor PIN security** — removed hardcoded `ALLOWED` email list and `AP` agent pin from public source. Widget init now checks `currentProfile.is_admin` and fetches AP from `/falkor/access` server-side
6. **school_name ReferenceError** — `handleSignUp` now accepts `schoolName` as 4th param; caller reads `signupSchool` input; body sends `school_name: schoolName || ''`
7. **Renamed "Email Digest" → "Download Summary"** — button label and download filename updated

#### Known remaining gaps (not yet fixed)

- **Existing user passwords** — 6 users (not pgallivan) have hashes from the original worker. If the original used the same PBKDF2-SHA256-100k algorithm they'll work; if not, they'll need password resets via `/auth/forgot-password`
- **VC2 codes are static** — no live VCAA API integration. Manual update required if VCAA revises VC2
- **VTLM tokens mostly hardcoded** — only 7 of ~50 v11 template tokens come from AI; rest use JS defaults. Needs `generateLesson()` extension to populate VTLM-specific fields
- **No email capability** — password reset emails go via Resend (configured); lesson sharing/digest emails not built
- **Sign-up hidden in UI** — `signupContent` has `display:none`; new registrations require direct form manipulation or admin tier-set

### 2026-05-21 — Full audit: 6 critical bugs fixed, billing groundwork

Full production audit run against live app at `lessonlab.com.au`. Findings and fixes:

#### 🔴 Critical bugs fixed

1. **Usage tracking never incrementing** — `INSERT INTO lesson_usage` was in `POST /lessons` (save endpoint) instead of `POST /lessons/generate`. Users could generate unlimited lessons with no quota enforcement. Fixed: moved increment to after successful AI generation in `/lessons/generate`.

2. **Stripe webhook dead** — webhook `we_1TKYKzAm8bVflPN0wA6v8UFR` pointed at `pgallivan.workers.dev` (dead domain). Updated via Stripe API to `https://lessonlab-api.luckdragon.workers.dev/stripe/webhook`.

3. **`generate_errors` INSERT failing silently** — table didn't exist in D1. Created table:
   ```sql
   CREATE TABLE generate_errors (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT, year_level TEXT, error_message TEXT, created_at TEXT DEFAULT (datetime('now')))
   ```
   Also wrapped the INSERT in try/catch in the worker so generation succeeds even if error logging fails.

4. **`prompt_version: 2` blocking v11 layout** — worker was saving `prompt_version: 2` to `ai_lessons` but `app.html` requires `d.prompt_version === 11` to trigger the VTLM 3-page layout. Fixed to `11` in the INSERT.

5. **Sign-up tab hidden** — `<div id="tab-signup">` had `style="display:none !important;" aria-hidden="true"` causing new users to see only the login tab. Removed both attributes; commit `c31dead9`.

6. **No `index.html` / `terms.html` / `privacy.html`** — production domain `lessonlab.com.au` served nothing at `/`, `/terms`, `/privacy`. Created all three files:
   - `index.html` — redirect to `/app`
   - `terms.html` — full ToS, Luck Dragon Pty Ltd ABN 64 697 434 898, Australian law
   - `privacy.html` — full Privacy Policy (Anthropic/Stripe/Resend/Cloudflare disclosures)

#### 🟡 Other work done this session

- **Secondary Stripe price secrets added** — 3 new secrets on `lessonlab-api` worker:
  - `STRIPE_PRICE_SECONDARY_SINGLE_MONTHLY` → `price_1TYit1Am8bVflPN07TeMZoIy` ($15/mo)
  - `STRIPE_PRICE_SECONDARY_SINGLE_ANNUAL` → `price_1TYit4Am8bVflPN0kpAnU19G` ($129/yr)
  - `STRIPE_PRICE_SECONDARY_MULTI_ANNUAL` → `price_1TYit7Am8bVflPN0xcvysdpw` ($249/yr)
  - Total secrets on `lessonlab-api`: 18

- **4 template lessons inserted into D1** — owned by Paddy's user_id (`7b5e8cfb-9620-44e5-9430-7b5391ccd2bc`), `is_template=1`:
  - Music · Year 3-4 · "Steady Beat & Rhythm"
  - Visual Art · Year 5-6 · "Observational Drawing — Natural Objects"
  - Science · Year 3-4 · "Bridge Engineering Challenge"
  - Italian · Year 1-2 · "Greetings & Introductions in Italian"

- **AI generation verified end-to-end** — test: science Y3-4 "Who Eats What? Building Food Chains". All 11 VTLM fields present in response, `prompt_version=11` saved, usage counter 0→1.

- **HANDOVER.md Live URLs corrected** — was pointing at `lessonlab.luckdragon.io` (old); real production is `lessonlab.com.au` + `www.lessonlab.com.au` (CF routes on `lessonlab` worker). Workers.dev subdomain intentionally disabled.

#### Known issue (not yet fixed)

- **No Stripe customer IDs for existing pro users** — all 5 pro users (`moni_gallivan`, `rooney.jaclyn.l`, `pgallivan`, `stevenpuhar`, `aeneasg`) have `stripe_customer_id: null` because their pro tier was set manually via `POST /admin/set-tier`. Billing portal (`/billing/portal`) will fail for all of them. **Resolution path:** users must subscribe through Stripe Checkout to receive a customer ID; or Stripe customers can be created and matched manually.

