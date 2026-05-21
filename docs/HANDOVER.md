# lessonlab — Handover

## ⚡ New session quick-start

Paste this into a new chat to restore full context immediately.

**Step 1 — read this doc**
https://github.com/Luck-Dragon-Pty-Ltd/lessonlab/blob/main/docs/HANDOVER.md

**Step 2 — fetch credentials from vault (PIN: 535554)**
```bash
# CF deploy token
curl -s -H "X-Pin: 535554" https://asgard-vault.luckdragon.workers.dev/secret/CF_API_TOKEN_FULLOPS

# GitHub token (repo: Luck-Dragon-Pty-Ltd/lessonlab)
curl -s -H "X-Pin: 535554" https://asgard-vault.luckdragon.workers.dev/secret/GITHUB_TOKEN_LESSONLAB
```

**Step 3 — key facts**
| Item | Value |
|---|---|
| CF account ID | `a6f47c17811ee2f8b6caeb8f38768c20` |
| D1 database | `lessonlab` — UUID `295203f9-1f60-43f0-91f2-a6fd6b55d069` |
| Worker (API) | `lessonlab-api` — 23 endpoints, v2.0.0 |
| Worker (frontend) | `lessonlab` — proxy → GitHub raw app.html |
| GitHub repo | `Luck-Dragon-Pty-Ltd/lessonlab` |

**CRITICAL deploy rule** — every CF worker deploy must include D1 binding in metadata or the DB gets wiped:
```json
{"bindings":[{"type":"d1","name":"DB","id":"295203f9-1f60-43f0-91f2-a6fd6b55d069"}]}
```

**Step 4 — next priorities**
1. Add Y7-8 / Y9-10 to year picker in app.html
2. Add secondary subjects to subject picker in app.html
3. Welcome email on signup — Resend already wired, just add call in `POST /auth/signup`
4. Upgrade AI to Sonnet for pro tier
5. More template lessons (secondary)

---



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

- **App (production):** https://www.lessonlab.com.au — CF Worker `lessonlab` proxies `app.html` from GitHub raw; routes `lessonlab.com.au/*` and `www.lessonlab.com.au/*`
- **API:** https://lessonlab-api.luckdragon.workers.dev — CF Worker `lessonlab-api` v2.0.0 (D1-backed)
- **Workers.dev subdomain:** intentionally disabled

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
- **D1 databases:** `lessonlab` (UUID: `295203f9-1f60-43f0-91f2-a6fd6b55d069`) — users, sessions, lessons, ai_lessons, lesson_usage, generate_errors, password_reset_tokens, content_reviews
- **lessonlab-api secrets:** 19 total — ANTHROPIC_API_KEY, RESEND_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, LESSONLAB_PIN, GITHUB_TOKEN, FALKOR_AP + 12 STRIPE_PRICE_* IDs. (No JWT_SECRET — auth is session-based via D1)
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

### 2026-05-21 — Secondary AI prompt fix + full system wrap-up

#### Fix: AI generation now year-level aware (primary vs secondary)

`generateLesson()` in `lessonlab-api` previously hardcoded `"You are an expert Australian primary school teacher"` regardless of the `year_level` field. Secondary subscribers (Years 7–8) were receiving primary-pitched content — concrete scaffolding, simple vocabulary, Foundation-level framing.

**Fix deployed (etag `e04e24e9`):** Worker now detects school stage at runtime:

```javascript
const isSecondary = /year[s]?\s*(7|8|9|10|11|12)|y(7|8|9|10|11|12)/.test(yrStr);
```

- **Primary (F–6):** persona = "expert Australian primary school teacher… concrete language, scaffolded tasks, explicit instruction"
- **Secondary (Y7–12):** persona = "expert Australian secondary school teacher… adolescent learners: abstract reasoning, discipline-specific literacy, higher-order thinking"

SC guide also switches: primary uses plain success criteria; secondary uses "I can [verb] (knowledge/skill / application / analysis or evaluation)" framing.

**Tested live:**
- Y3–4 Science "Animal Adaptations" → concrete vocab (body parts / adaptation / inherited trait), simple sentence stems, picture-based worked example ✅
- Y7–8 English "Persuasive Writing" → Tier 3 vocab (rhetorical strategy / warrant / concession / refutation), SC demanding evaluation, extension probing logical fallacies, exit ticket requiring reasoning ✅

No app.html changes needed — purely server-side prompt logic.

---

#### Full system status — 2026-05-21 wrap-up

All known bugs resolved across 5 full-stack audit cycles. System is production-ready.

**`lessonlab-api` v2.0.0 — etag `e04e24e9` — 23 endpoints**

| Endpoint | Status |
|---|---|
| Auth (signup/signin/signout/session/profile/update-password/forgot/reset) | ✅ |
| Lessons (list/create/get/update/delete) | ✅ |
| `POST /lessons/generate` | ✅ Year-level aware, VTLM 2.0, 19 fields |
| `POST /lessons/rate/:id` | ✅ |
| `GET /api/usage` | ✅ |
| `POST /stripe/checkout` | ✅ success_url → `?upgrade=success&type=pro` |
| `POST /stripe/portal` | ✅ All 5 pro users have Stripe customer IDs |
| `POST /stripe/webhook` | ✅ HMAC-verified, handles subscription lifecycle |
| Admin + Falkor + GitHub helpers | ✅ |

**D1 `lessonlab` (`295203f9-1f60-43f0-91f2-a6fd6b55d069`)**
- 5 real users, all `tier=pro`, all with `stripe_customer_id`
- 4 template lessons in Paddy's library (music, visual-art, science, italian)
- All test users and expired sessions cleared

**Stripe**
- 20 active prices across all products
- Webhook `we_1TZT2YAm8bVflPN0k2qiq6EB` → correct URL, HMAC verified
- Pro users: `pgallivan` / `moni_gallivan` / `rooney.jaclyn.l` / `stevenpuhar` / `aeneasg` — all have Stripe customers, billing portal works

**app.html (GitHub `main`, ~1.15 MB)**
- API_URL correct, upgrade handler wired, rate limit opens pricing modal
- PUT `/lessons/:id` present, VTLM v11 export (multi-lesson), Falkor widget (admin only)

**Known ongoing (by design, not bugs)**
- Pro users have Stripe customers but no active subscriptions — manually granted tier. Portal shows empty account; resolves when they subscribe through Checkout
- Templates in D1 owned by Paddy's user_id — visible only in his library; template gallery for other users uses GitHub-hosted files (working correctly)
- Secondary school subjects (Y7–8): Stripe prices exist and generation now works correctly; app year-level picker currently only shows F–6 options — a UI update would be needed to surface Y7–8 in the dropdown

### 2026-05-21 — Audits #2–5 + 8 more bugs fixed + billing groundwork complete

Four full-stack audit cycles run against live production (`lessonlab.com.au`). All bugs found, fixed, and verified. DB cleaned up.

#### 🔴 Critical bugs fixed

1. **`GET /lessons` returned object, not array — library always empty** — worker was returning `{ lessons: [] }` but `app.html` expected a bare array and bailed on the `!Array.isArray(data)` guard. Every user's lesson library showed empty. Fixed: changed handler to `return json(rows.results || [])`. (Audit #3)

2. **Stripe webhook silently dropped all events** — `STRIPE_WEBHOOK_SECRET` env var was unset; the guard `if (env.STRIPE_WEBHOOK_SECRET)` returned false and the handler returned `{ok:true}` before parsing anything. No subscription upgrades/downgrades were ever processed. Fix: rolled a new webhook (`we_1TZT2YAm8bVflPN0k2qiq6EB`), set secret `whsec_QV6BsEUUado5yBanN2sQXveUxMGebcpq` as `STRIPE_WEBHOOK_SECRET` on the worker, rewrote handler with full HMAC-SHA256 verification and handlers for `checkout.session.completed`, `customer.subscription.updated/created/deleted`, `invoice.payment_failed`. (Audit #3)

3. **`PUT /lessons/:id` missing — lesson edits always returned 404** — worker had GET/POST/DELETE on lessons but no PUT. Any lesson edit in the app silently failed. Added full PUT handler with field allowlist (`subject, unit, focus, year_level, term, week, title, learning_intention, success_criteria, equipment, lesson_data`). (Audit #4)

4. **Checkout `success_url` mismatch — post-payment tier upgrade never fired** — worker sent user to `?checkout=success` but `app.html` checks `params.get('upgrade')`, so the `initAuth()` re-fetch that picks up the new tier never ran. Fixed `success_url` to `https://www.lessonlab.com.au/app?upgrade=success&type=pro`. (Audit #4)

5. **3 Stripe prices inactive** — Pro Monthly (`price_1TLpaYAm...`), Cycle Planner (`price_1TLpaaAm...`), Extra Subject (`price_1TLpaZAm...`) were set to `active: false`. Any checkout attempt for those plans would fail at the Stripe API level. Reactivated all 3 via `POST /v1/prices/{id}` with `active=true`. (Audit #4)

6. **D1 binding stripped on redeploy** — CF Workers API redeploy wiped the D1 binding when metadata didn't include it. Worker returned 1101 on all DB-touching endpoints. Fixed: always include `"bindings":[{"type":"d1","name":"DB","id":"295203f9-1f60-43f0-91f2-a6fd6b55d069"}]` in the metadata JSON on every deploy. (Audit #4 — deployment procedure note)

7. **5 pro users with `stripe_customer_id = NULL` — billing portal errored** — all 5 manually-granted pro users had no Stripe customer record. `POST /stripe/portal` returned `{"error":"No Stripe customer found"}` for all of them. Fixed: created Stripe customers for all 5 and updated D1:
   - `pgallivan@outlook.com` → `cus_UYak9bpA16uTT3`
   - `moni_gallivan@hotmail.com` → `cus_UYakjL8v52FZST`
   - `rooney.jaclyn.l@gmail.com` → `cus_UYakp44r27tyCO`
   - `stevenpuhar@yahoo.com.au` → `cus_UYaknPw1XmP5RJ`
   - `aeneasg@hotmail.com` → `cus_UYakvEHMJ9Qfgi`
   Billing portal now generates a valid Stripe session for all 5. (Audit #5)

#### 🟡 Other fixes

8. **Rate limit 429 showed wrong message** — app hit the `res.error` branch on limit but showed a generic AI-unavailable toast instead of opening the pricing modal. Added `res.error.toLowerCase().includes('limit')` check to call `openPricingModal(true)` on 429s. Two dead `monthly_limit_reached` checks also removed from save endpoints. (Audit #2)

9. **35 stale password reset tokens cleaned up** — all expired, unused tokens deleted from D1. (Audit #3)

#### Current state (post Audit #5 — all clean)

**Worker `lessonlab-api` v2.0.0** — deployed, etag `b02ee9eb`
- 23 endpoints, all smoke-tested and passing
- 19 secrets: `ANTHROPIC_API_KEY, STRIPE_SECRET_KEY, RESEND_API_KEY, LESSONLAB_PIN, GITHUB_TOKEN, FALKOR_AP, STRIPE_WEBHOOK_SECRET` + 12 price IDs
- D1 binding: `DB` → `295203f9-1f60-43f0-91f2-a6fd6b55d069`
- ⚠️ **Always include D1 binding in metadata on redeploy** (see note above)

**D1 Database** — clean
- 5 real users, all `tier=pro`, all with `stripe_customer_id`
- 4 template lessons (`is_template=1`) in Paddy's library (music, visual-art, science, italian)
- All test users cleared after each audit cycle
- `generate_errors`: 10 historical rows from prior worker's validation logic — not indicative of current bugs (current worker has no such validation)

**app.html** (GitHub `main`, ~1.15 MB)
- API_URL: `https://lessonlab-api.luckdragon.workers.dev` ✅
- `?upgrade=success` handler → re-fetches profile via `initAuth()` after 2s delay ✅
- Rate limit 429 → opens pricing modal ✅
- PUT `/lessons/:id` call present ✅
- VTLM v11 enrich + legacy map: 46 refs ✅
- Export: multi-lesson docx stitch ✅

**Stripe**
- 20 active prices (all products live)
- Webhook `we_1TZT2YAm8bVflPN0k2qiq6EB` → `https://lessonlab-api.luckdragon.workers.dev/stripe/webhook` (HMAC-verified)
- Checkout success URL: `https://www.lessonlab.com.au/app?upgrade=success&type=pro`
- All 5 pro users have Stripe customers; portal works

**Known ongoing**
- Pro users' Stripe customers have no subscription attached (manually granted tier). Portal shows empty account. Resolves naturally if they subscribe through Checkout.
- Templates in D1 are owned by Paddy's user_id — visible only in his library. Template gallery for other users uses GitHub-hosted files (separate flow, works correctly).

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

- ~~**No Stripe customer IDs for existing pro users**~~ — FIXED 2026-05-21: Stripe customers created for all 5 pro users, D1 updated. Billing portal works.

---

## Next steps & roadmap

*Last reviewed: 2026-05-21. All critical bugs resolved. System is production-ready.*

### 🔴 High priority — affects paying users now

**1. Add secondary year levels to the UI picker**
The backend (`lessonlab-api`) now generates correctly for Y7–12 (secondary persona, discipline-specific vocab, higher-order SC). But the app year-level selector only shows Foundation / Y1-2 / Y3-4 / Y5-6. Secondary subscribers have to use the API directly or can't select their year at all.
Fix: add "Years 7-8" and "Years 9-10" options to the year level picker in `app.html`. One small UI change, backend is ready.

**2. Add secondary subjects to the subject picker**
Current subject list is primary: literacy, numeracy, pe, visual-art, french, music, drama, science, digital_tech, hass, wellbeing. Secondary teachers need: English, Maths, Biology, Chemistry, Physics, History, Geography, Health & PE, Visual Arts, etc.
Fix: extend the subject cards/list in `app.html` with secondary subjects. VC2 curriculum codes are already in the `CD` object for secondary strands.

**3. Welcome email on signup**
Resend is configured and password reset emails work. But new users get no welcome email — no confirmation, no "here's how to get started", no link to the app. Drop-off risk.
Fix: add a `sendWelcomeEmail()` call in `POST /auth/signup` in the worker, same pattern as the reset email.

---

### 🟡 Medium priority — product quality

**4. Upgrade AI model for better output**
Currently using `claude-haiku-4-5-20251001` (fast, cheap). Upgrading to `claude-sonnet-4-6` would give meaningfully richer lesson content — better worked examples, more nuanced differentiation, stronger metacognitive prompts. Cost increases but quality is noticeably better for a paid product. Could be tier-gated: Haiku for free, Sonnet for pro.

**5. More template lessons — especially secondary**
Only 4 templates in D1, all primary (music, visual art, science, Italian). Secondary has none. Teachers browsing before signing up want to see what output looks like for their context.
Add: 2-4 secondary templates (e.g. Y7-8 English, Y7-8 Maths) and more primary variety (literacy, numeracy, PE, HASS).

**6. School account management UI**
School Site Licence ($1,500/yr) exists as a Stripe product. But there's no school admin UI — no way to manage seats, add/remove teachers, set school branding, or view usage by school. The `school_logo` and `school_name` fields exist in the DB but the UI for it is minimal.
Minimum viable: a school admin view showing enrolled teachers + usage counts.

**7. Admin dashboard — usage & health metrics**
Current admin panel shows raw user list and a tier-setter. Useful additions:
- Generation count by user/month (already in `lesson_usage` table)
- Error rate from `generate_errors` table
- Subject distribution (what are people generating most?)
- Revenue snapshot (pull from Stripe)
These are all one-query reads from existing tables.

---

### 🟢 Lower priority — nice to have

**8. VC2 codes are static**
Curriculum codes are hardcoded in `app.html`. If VCAA updates VC2 (they will), the codes go stale silently. Long-term: serve codes from a D1 table seeded from VCAA, with an admin refresh endpoint. Near-term: at least document the update process.

**9. Onboarding flow**
`app.html` has ~38 references to onboarding logic but it's unclear how complete it is in production. A proper first-run flow (select subjects → select year levels → see a sample lesson) would reduce time-to-value for new signups.

**10. Lesson sharing / collaboration**
~21 share-related refs in `app.html` but no server-side sharing endpoint exists. Teachers want to share good lessons with colleagues.
Minimum: a `GET /lessons/:id/public` endpoint that returns a lesson without auth, and a share URL the teacher can copy.

**11. PDF export**
Current export is Word (.docx). Many teachers want PDF for printing or sharing. Could be done client-side (browser print-to-PDF) or server-side (Puppeteer on a CF Worker). A "Print PDF" button that opens a clean print view would handle 80% of the need.

**12. Convert the 5 manually-granted pro users**
pgallivan, moni_gallivan, rooney.jaclyn.l, stevenpuhar, aeneasg are all `tier=pro` with Stripe customers but no active subscriptions. They're getting pro features for free. Decide: gift them permanently (add a `is_gifted` flag), ask them to subscribe, or set an expiry. Currently they'll stay pro forever unless manually changed.

---

### Infrastructure notes for future sessions

- **Always include D1 binding in CF Worker deploy metadata** — omitting it wipes the binding and crashes all DB endpoints. Required JSON: `{"type":"d1","name":"DB","id":"295203f9-1f60-43f0-91f2-a6fd6b55d069"}`
- **Worker file**: work from the deployed version fetched via CF API, not a local copy — local copies can get truncated by the Edit tool
- **Stripe prices**: 20 active. All active as of 2026-05-21. Check with `GET /v1/prices?active=false` before any billing work
- **lessonlab-monitor** worker exists in the CF account — purpose unclear, worth auditing before it causes confusion
- **Secondary year level detection regex**: `/year[s]?\s*(7|8|9|10|11|12)|y(7|8|9|10|11|12)/` — extend if Years 11-12 subjects are added
