# LessonLab Lesson Plan HTML — Full Handover

**Last updated:** May 2026  
**Picking up from:** Previous Cowork session (context ran out)  
**User:** Paddy Gallivan — PE / Specialist Teacher, WPS  
**Project:** LessonLab — SaaS AI lesson plan generator for PE/specialist teachers

---

## What Was Built

Two self-contained HTML lesson plan files — editable in browser, print-to-PDF quality, designed to match the "v5 PDF" reference design Paddy provided.

### Files (in outputs folder)

| File | Purpose |
|------|---------|
| `WPS_PE_Foundation_T2W1_v11.html` | Completed EXAMPLE — Foundation PE, Chest Pass lesson. Fully filled in. Use to show Paddy what the finished product looks like. |
| `WPS_LessonPlan_BLANK_TEMPLATE_v11.html` | **BLANK TEMPLATE** — all content replaced with `[placeholder]` text. Subject-agnostic. This is the master template for all subjects. |

Both files are self-contained (no external dependencies) and work by opening in Chrome.

---

## Design Reference

The visual style target was `WPS_PE_Y34_T2W3_ChestPass_v5.pdf` (Google Drive: `1WrA7fNu7bVdAoTKyInixewkQkMzc4PqR`).

Key visual elements matched:
- Navy header `#1F3864`
- Coloured phase sidebar strips (left edge of each phase block)
- Circled number steps ①②③④⑤
- Light blue teacher note boxes, yellow CFU boxes, green italic transition lines
- Badge/chip row for curriculum codes, year level, duration, location
- 3-column tier differentiation table (Red/Blue/Green)
- Wellbeing & SEL 3-column section
- Inclusive Practice 2×2 grid
- VTLM 2.0 element banners (green, numbered ①–⑤)

---

## Three-Page Structure

### Page 1 — CRT One-Pager
- Compact, designed for a relief teacher to run the lesson without any other info
- All 5 phases fit on ONE A4 page
- Sidebar colour strips per phase
- Numbered steps 1–3 per phase
- NOTE boxes (blue), CFU boxes (yellow), transition lines (green italic)
- Equipment & Safety boxes at bottom
- **Phase names (generic in template):**
  - ① OPENING / ACTIVATION
  - ② EXPLICIT TEACHING
  - ③ GUIDED PRACTICE — WE DO
  - ④ INDEPENDENT PRACTICE — YOU DO
  - ⑤ CLOSURE & REFLECTION

### Page 2 — VTLM Elements 1, 2, 3
- Full detail version: Learning Intention, Success Criteria, Curriculum Links, Class Profile, Evidence from Last Lesson
- Achievement Standard (paste from VC 2.0 website)
- Element 1 — Planning: Prior Knowledge, Differentiation Plan, Unit Links, Resources
- Element 2 — Enabling Learning: Full Warm Up/Opening phase with 4 steps + teacher notes + CFU + transition
- Element 3 — Explicit Teaching: Full I-Do sequence with 4 steps + teaching notes + CFU + transition

### Page 3 — VTLM Elements 4, 5 + Rest
- Element 4 — Supported Application: We Do (guided) + **Tier Differentiation Table** (3 cols: Supported / Core / Extension) + You Do (independent)
- Element 5 — Reflection: Pack Up / Closure phase
- Wellbeing & SEL (3 columns)
- Inclusive Practice (2×2 grid: EAL/D / Learning & Physical Support / Extension / Medical)
- Assessment & Evidence (2 columns)
- Teacher Reflection — 4 boxes to fill AFTER lesson: What worked / What to change / Data observed / Adjustments for next lesson

---

## Technical Architecture

### Auto-Fit Engine (JavaScript — at bottom of each file)

**Layer 1 — Viewport fit:** CSS `zoom` on `.page`
- Measures the viewport width vs A4 width (210mm in px)
- If viewport < A4, applies `zoom: X` to `.page` — this changes layout AND visual size (unlike transform which only changes visual)
- Result: page centres correctly, no left-side clipping

**Layer 2 — Content fit:** `transform: scale()` on `.page-inner`
- JS wraps all page content (except footer) in a `.page-inner` div on load
- Measures `inner.scrollHeight` vs `page.clientHeight`
- If content overflows A4 height, scales the inner content DOWN to fit
- Width compensated: `inner.style.width = (100/scale)%` so scaled content still fills full page width
- MutationObserver watches all contenteditable changes, re-fits on every edit (debounced 280ms)
- Re-fits on window resize and before print

**Fill-page (CSS flexbox):**
- `.page` is a flex column
- `.page-inner` has `flex: 1` — fills remaining height
- On page 1: `.phase-strip` has `flex: 1 1 0` — all 5 phases grow equally to fill the page
- On pages 2–3: `.full-phase` has `flex: 1 1 0` — phase blocks grow to fill
- `.field-box` and `.wellbeing-col` and `.incl-cell` all `flex: 1` with `flex-direction: column`

**Text wrapping:**
- All `[contenteditable]` elements have `white-space: pre-wrap`, `word-break: break-word`, `overflow-wrap: break-word`
- This means text wraps at word boundaries AND breaks mid-word if needed (no horizontal overflow)

**Print:**
- `@media print { .page { zoom: 1 !important; height: 297mm; overflow: hidden; } }`
- Three pages print on exactly 3 A4 sheets
- `page-break-after: always` on each `.page`
- Print bar hidden on print

---

## Colour Palette

```
Navy header:       #1F3864
VC2 green:         #1B6B2A
Opening/Warm Up:   #1565C0  (blue)
Explicit Teaching: #6A1B9A  (purple)
We Do:             #2E7D32  (green)
You Do:            #BF360C  (burnt orange)
Closure/Pack Up:   #455A64  (slate)
Note box bg:       #EBF4FB
CFU box bg:        #FFFDE7
Trans green:       #1B5E20
Tier 1 bg:         #FFEBEE  / header #C62828
Core bg:           #EBF5FB  / header #1565C0
Tier 3 bg:         #EAFAF1  / header #2E7D32
Element banner:    #D5F5E3
Wellbeing:         #FCE4EC
Inclusive:         #E8EAF6
Assessment:        #FFF8E1
Reflection:        #E0F7FA
```

---

## Content Decisions (from audit)

### Cue model — standardised to 4 cues
READY → STEP → PUSH → FOLLOW (not 3 cues — original had inconsistency)

### Equipment count
2× target hoops (not 1 — original was inconsistent between pages)

### Phase naming (cross-subject template)
- "Warm Up" → "Opening / Activation" (not all subjects warm up physically)
- "Pack Up" → "Closure & Reflection"
- Equipment → Resources & Materials (relevant to all subjects)
- Space → Room / Setup

### What "Warm Up" means per subject
Not all subjects have a physical warm-up. The Opening/Activation phase is:
- PE: physical game to raise heart rate + spatial awareness
- Music: listening activity, rhythm exercise, call-and-response
- Art: look/think/wonder, mood board, technique warm-up
- Maths: mental warm-up, number talk, estimation task
- English: word work, text preview, discussion prompt

The template uses "Opening / Activation" and the placeholder text guides the teacher.

---

## What's Still To Do

### For the blank template
- [ ] The template currently still has one `[Subject]` span inside an H1 that is NOT contenteditable — needs to be wrapped in `<span contenteditable="true">` on the page 2 and 3 headers (already done on page 1)
- [ ] Consider whether "Equipment / Resources" section on page 1 should be optional (some subjects have no materials at all — could add a comment in the HTML)

### For LessonLab integration
- [ ] The AI-generated lesson content from LessonLab (Cloudflare Worker + D1) needs to be injected into this template
- [ ] Decide: does the AI generate the raw content and the teacher receives this HTML pre-filled? Or does the teacher receive the blank template and the AI fills it?
- [ ] The contenteditable areas map to specific fields — these need to be given `data-field` attributes so the AI can target them precisely
- [ ] Subject-specific colour theming: the current phase colours work well for PE. For other subjects, phase colours may need to change (e.g., Music might use different colour scheme)
- [ ] Consider: some subjects don't need ALL sections. E.g., a Maths lesson might not need a Tier differentiation table in the same format. Could add CSS classes to make sections conditionally hidden.

### Subjects that need their own examples (like the PE one)
- Music
- Visual Art
- STEM / Design
- Languages

---

## LessonLab Context

**What LessonLab is:** AI lesson plan generator for PE/specialist teachers. Paddy's SaaS product.

**Tech stack:**
- Cloudflare Worker (API backend) — `lessonlab-api`
- Cloudflare D1 (SQLite database)
- Anthropic Claude API for AI generation
- GitHub: `Luck-Dragon-Pty-Ltd/lessonlab`
- GitHub: `PaddyGallivan/lessonlab` (older repo, has been updated with deletion support via falkor-github)

**Audit items (all completed as of this session):**
- Free-tier fix (3 free AI generations server-side, not just client-side)
- Server-side free generation counter
- 50/day rate limit
- `test.txt` deleted from PaddyGallivan/lessonlab repo
- falkor-github updated with deletion support

**Existing DOCX template system (in GitHub repo):**
- `lessonlab/templates/` — 11 subject templates
- Each has a blank DOCX, filled example DOCX, `build_[subject]_v11_template.js`, `build_[subject]_v11_example.js`
- These were built with Node.js `docx` npm package
- The HTML approach was chosen INSTEAD of DOCX because: better layout control, no page overflow issues, contenteditable for teacher edits, print-to-PDF in browser

---

## Notes on Opening Files

Open in **Chrome** (not Safari or Edge) for best zoom/print behaviour.

The files live in Paddy's outputs folder. To share with teachers:
1. Open the blank template in Chrome
2. Fill in subject, year level, term/week, teacher name in the header fields
3. Fill in all `[placeholder]` content areas
4. Hit **Print / Save as PDF** to export
5. Can also copy-paste into Google Docs or Word if preferred

---

## Key Conversation Context

Paddy is building LessonLab as a product for teachers. The lesson plan HTML is meant to be the OUTPUT format that teachers receive from LessonLab — either AI-pre-filled or as a blank they fill themselves. The design goal is: "looks as good as the v5 PDF Paddy made manually, but editable and scalable."

The v5 PDF reference was: `WPS_PE_Y34_T2W3_ChestPass_v5.pdf` — a manually designed lesson plan that Paddy showed as the gold standard.
