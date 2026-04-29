# lessonlab — Handover

**Repo:** [github.com/LuckDragonAsgard/lessonlab](https://github.com/LuckDragonAsgard/lessonlab)
**Last update:** 2026-04-27 — v11 lesson plan template locked, VTLM 2.0 compliant. Filled in by Mona's previous session.

Index of all projects: [PaddyGallivan/asgard-handovers/INDEX.md](https://github.com/PaddyGallivan/asgard-handovers/blob/main/INDEX.md)

---

## What this is

**LessonLab** is a Victorian-Curriculum-2.0–aligned F–6 lesson-plan generator for Australian primary teachers. The web app at `app.html` lets specialist teachers compose lessons; the generator emits Word docs that are CRT-friendly on page 1 and VTLM 2.0 compliant on pages 2–3.

This session (2026-04-27) **rebuilt the lesson plan template from scratch across 11 versions**. Landing point: **v11**, three A4 pages, fully VTLM 2.0 compliant. PE is the anchor subject; Literacy is the proof of cross-subject portability.

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

## Files in this repo (post-2026-04-27 push)

```
templates/
  WPS_PE_Foundation_T2W1_v11.docx          # PE example — Foundation, "Running safely + 3-step stop"
  WPS_PE_Foundation_T2W1_v11.pdf           # PDF preview
  WPS_PE_LessonPlan_TEMPLATE_v11.docx      # Tokenised PE blank — generator-ready (~150 {{tokens}})
  WPS_Literacy_Y2_T2W1_v11.docx            # Literacy example — Year 2 recount writing
  build_v11_example.js                     # docx-js source for the PE example
  build_v11_template.js                    # docx-js source for the PE blank
  build_literacy_v11_example.js            # docx-js source for the Literacy example
docs/
  HANDOVER.md                              # This file
  VTLM-2.0-mandate-checklist.md            # Element-by-element compliance checklist
  TOKEN-MAP.md                             # Full token list (~150) — the generator API
```

---

## Subject template change matrix

The v11 skeleton stays the same for every subject. Only mid-blocks change:

| Field | PE (anchor) | Literacy (done) | Numeracy (next) | Visual Art | Music | French | Performing Arts | HASS | Wellbeing | Digital Tech |
|---|---|---|---|---|---|---|---|---|---|---|
| Equipment label | EQUIPMENT | RESOURCES / TEXTS | MATERIALS | MATERIALS / MEDIA | INSTRUMENTS | RESOURCES | COSTUMES / PROPS | RESOURCES | RESOURCES | TOOLS / DEVICES |
| Signal | Whistle | Clap | Bell | "Tools down" bell | Conductor cue | "Écoutez!" | Freeze + breath | Bell | Mindful chime | "Eyes on screen" |
| Phase 1 | Warm-up | Mini-lesson | Number talk | Hook / inspiration | Vocal warm-up | Bonjour ritual | Body warm-up | Big question | Check-in | Brief |
| Phase 2 | Explicit Teaching | Modelled writing | Worked example | Technique demo | Listening + analysis | Vocab + dialogue | Modelled rehearsal | Source intro | Skill modelled | Iteration plan |
| Phase 3 | Practice (We do) | Shared writing | Guided practice | Guided practice | Group sing/play | Pair dialogue | Group rehearsal | Source analysis | Pair practice | Build / code |
| Phase 4 | Application (You do) | Independent writing | Independent problem | Independent making | Solo / small group | Mini-conversation | Performance | Recording / journal | Application scenario | Test |
| Phase 5 | Pack up & reflect | Share-back | Share strategies | Gallery walk | Performance share | Au revoir + recap | Reflect + applaud | Discussion | Reflection circle | Evaluate |

**Recommended subject order by lesson volume:** Numeracy → Visual Art → HASS → Music → Wellbeing → Digital Tech → French → Performing Arts.

---

## How to build a new subject template

1. `cp templates/build_literacy_v11_example.js templates/build_<subject>_v11_example.js` (Literacy is the cleanest non-PE pattern)
2. Walk through the python sed-replace block at the top of the script — swap PE/Literacy content for your subject. Use the matrix above for label changes.
3. Build:
   ```bash
   cd /tmp && mkdir -p ll && cd ll
   npm init -y && npm install docx
   # paste the build script here
   node build_<subject>_v11_example.js
   ```
4. Validate: `python3 .claude/skills/docx/scripts/office/validate.py FILE.docx`
5. **Word zip-ordering fix** (mandatory — Word refuses files where `[Content_Types].xml` isn't at zip position 0):
   ```python
   import zipfile
   def reorder(infile, outfile):
       src = zipfile.ZipFile(infile,'r')
       entries = [(i, src.read(i.filename)) for i in src.infolist() if not i.filename.endswith('/')]
       entries.sort(key=lambda x: (0 if x[0].filename=='[Content_Types].xml' else 1, x[0].filename))
       with zipfile.ZipFile(outfile,'w',zipfile.ZIP_DEFLATED) as dst:
           for info, data in entries:
               ni = zipfile.ZipInfo(info.filename, date_time=info.date_time)
               ni.compress_type = zipfile.ZIP_DEFLATED
               dst.writestr(ni, data)
   ```
6. Render PDF for review: `python3 .claude/skills/docx/scripts/office/soffice.py --headless --convert-to pdf FILE.docx`
7. Push to this repo via `gh-push.pgallivan.workers.dev` once it's repaired (currently broken — see Known Issues).

---

## How to deploy

- App: deployed via Vercel from `index.html` + `app.html` in this repo (vercel.json present).
- Default pattern for new files: push to this repo via `gh-push.pgallivan.workers.dev`. **As of 2026-04-29 the worker is broken** (`GH_PUSH_BEARER secret not set on worker`). Until repaired, push manually via git or GitHub web UI.

---

## Infrastructure

- **CF account:** `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)
- **GitHub org:** `LuckDragonAsgard` (legacy at `PaddyGallivan/lessonlab`)
- **D1 databases:** lesson content via `lessonlab-api` worker; session log in `asgard-prod` (host worker `asgard-brain`)
- **Secrets:** `asgard-vault.pgallivan.workers.dev` (PIN-gated; PIN rotated 2026-04-28 — see vault `/secret/PADDY_PIN`)

---

## Known issues / TODO

### Blockers
- ⚠️ **`gh-push` worker is broken** as of 2026-04-29 — every endpoint returns `500 {"error":"GH_PUSH_BEARER secret not set on worker"}`. Need to set the bearer secret on the worker before any new files can be pushed via the worker. Workaround: push via git CLI or GitHub web UI.
- ⚠️ **PIN rotated 2026-04-28** — old `2967` was leaked in public source. Any handover doc referencing `2967` is stale. New PIN at vault `/secret/PADDY_PIN`. (Earlier handovers in Drive contained the old PIN — those should be considered compromised.)

### Open work
- Cut **7 remaining subject templates** (Numeracy → Visual Art → HASS → Music → Wellbeing → Digital Tech → French → Performing Arts) using the `build_literacy_v11_example.js` pattern.
- **Wire v11 into `WPS_Lesson_Generator_FINAL.gs`** (or whichever generator script is current) — swap the existing output template for the v11 token map. Once swapped, the generator emits all future lessons in v11 shape automatically. ~252 Science lessons are queued behind this.
- **Port existing v6/v7 PE lessons forward** to v11 shape.
- **Migrate v11 source out of Drive** — the previous session pushed everything to paddy@luckdragon.io's Drive (🏰 ASGARD folder, file IDs in earlier handovers v1–v4). Per the new GitHub-first storage rule (`memory/github_first_storage.md`), all those files should now live here in this repo and the Drive copies retired.

---

## Recent work

### 2026-04-27 — v11 lesson plan template

Mona iterated the WPS PE lesson plan from v6/v7 (pre-session anchor) through to **v11** in a single session. Path: v8 (tokens, removed page1↔2 duplication, added "won't join in", boundary diagram, why-it-matters, warm-up VTLM home) → v9 (vertical-centred cells) → v10 (all VTLM 2.0 mandates) → v11 (CRT-friendly page 1, full A4 fill, 3 pages).

Then while Mona was AFK she returned and asked me to keep going: I tokenised the PE blank into a generator-ready template (~150 `{{tokens}}`) and cut a Literacy Y2 T2W1 v11 example to prove the shape works for any subject.

**Earlier session output was uploaded to Drive (now deprecated).** Drive file IDs from previous handover (only relevant if Mona pulls them off Drive before the migration completes):

- v11 PE example: `1W9lpJFThu5XILuRp6bH-H6tcZui4oAzY`
- v11 PE blank tokenised: `1G5Mbx5Fc9cl60Ip9EH1Q42HXEVckwvH4`
- v11 Literacy example: `12HU3iokEFwzKpa4k-3oPO_8-ZjdX87r7`
- Build scripts: `1EbnSWDUIcKfu2r1a3TP_CPVuXBDSaAdN` (PE example), `1OP-9cTDWLstaHZr_058tSKypnsnoKxAB` (PE blank), `1W_0DQ76i7wLnQTgibEAAtqal9HlN0y0j` (Literacy)
- Earlier handover docs: `1ldsmIxYrDXV...` (v1), `15um8dTW...` (v2), `1HdSmcRpu...` (v3), v4 was prepared but failed to upload due to PIN rotation
- claude_sessions row IDs: 10, 11, 12

These Drive files contain the **old leaked PIN `2967`** in references — when migrating, redact that.

### 2026-04-29 — Migration audit (this session)

Found `LuckDragonAsgard/lessonlab` repo exists with stub HANDOVER.md. This update fills it in with v11 state. The actual `templates/*.docx` + `templates/build_*.js` artefacts still need to be pushed to the repo — blocked on `gh-push` repair (see Blockers).
