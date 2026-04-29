# lessonlab — Handover

**Repo:** [github.com/LuckDragonAsgard/lessonlab](https://github.com/LuckDragonAsgard/lessonlab)
**Last update:** 2026-04-29 — **v11 template shipped across 10 subjects** (PE + Literacy + 9 new). VTLM 2.0 compliant on every subject. `gh-push` worker repaired.

Index of all projects: [LuckDragonAsgard/asgard-source/docs/HANDOVER.md](https://github.com/LuckDragonAsgard/asgard-source/blob/main/docs/HANDOVER.md)

---

## What this is

**LessonLab** is a Victorian-Curriculum-2.0–aligned F–6 lesson-plan generator for Australian primary teachers. The web app at `app.html` lets specialist teachers compose lessons; the generator emits Word docs that are CRT-friendly on page 1 and VTLM 2.0 compliant on pages 2–3.

The 2026-04-27 session **rebuilt the lesson plan template from scratch across 11 versions**. Landing point: **v11**, three A4 pages, fully VTLM 2.0 compliant. PE was the anchor; Literacy was the proof of cross-subject portability.

The 2026-04-29 session **shipped v11 across the remaining 9 subjects** using a config-driven sed-replace orchestrator. All 10 subjects are now in `templates/`.

---

## Live URLs

- **App (production):** https://lessonlab.com.au — uses `app.html` from this repo
- **API:** https://lessonlab-api.pgallivan.workers.dev (D1-backed, ~931 lessons across 9 subjects pre-Science)
- **Lesson handler:** https://lesson-handler.pgallivan.workers.dev
- **Marketing index:** `index.html` → `https://www.lessonlab.com.au/`

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

- App: deployed via Vercel from `index.html` + `app.html` in this repo (vercel.json present).
- Default pattern for new files: push to this repo via `gh-push.pgallivan.workers.dev` (now repaired, see below).

---

## Infrastructure

- **CF account:** `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)
- **GitHub org:** `LuckDragonAsgard` (legacy at `PaddyGallivan/lessonlab`)
- **D1 databases:** lesson content via `lessonlab-api` worker; session log in `asgard-prod` (host worker `asgard-brain`)
- **Secrets:** `asgard-vault.pgallivan.workers.dev` (PIN-gated; PIN rotated 2026-04-28 — see vault `/secret/PADDY_PIN`)
- **gh-push bearer:** stored at vault `/secret/GH_PUSH_BEARER` and bound to the gh-push worker.

---

## Known issues / TODO

### Resolved
- ✅ **gh-push worker repaired** (2026-04-29) — `GH_PUSH_BEARER` minted via `openssl rand -hex 32`, saved to vault, bound to worker.
- ✅ **9 remaining subject templates shipped** (2026-04-29) — Numeracy, Visual Art, HASS, Music, Wellbeing, Digital Tech, French, Performing Arts, Science. All clean of PE leakage.
- ✅ **Drive deprecation** — all build artefacts now live here in GitHub. Drive copies (in 🏰 ASGARD folder, paddy@luckdragon.io) can be retired.

### Open work
- **Wire v11 into `WPS_Lesson_Generator_FINAL.gs`** (or current generator) — swap output template to v11 token map. Once swapped, generator emits all future lessons in v11 shape automatically.
- **Port existing v6/v7 PE lessons forward** to v11 shape.
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
