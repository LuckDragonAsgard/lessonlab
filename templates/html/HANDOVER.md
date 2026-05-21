# LessonLab Lesson Plan HTML — Full Handover

**Last updated:** 21 May 2026 (Session 2)
**Session status:** ✅ ALL TASKS COMPLETE — files live on GitHub
**User:** Paddy Gallivan — PE / Specialist Teacher, WPS
**Project:** LessonLab — SaaS AI lesson plan generator for PE/specialist teachers

---

## 🟢 Session 2 Summary (21 May 2026)

### Files pushed to GitHub this session

| GitHub path | Purpose |
|-------------|---------|
| [`templates/html/WPS_LessonPlan_BLANK_TEMPLATE_v12.html`](https://github.com/Luck-Dragon-Pty-Ltd/lessonlab/blob/main/templates/html/WPS_LessonPlan_BLANK_TEMPLATE_v12.html) | **MASTER BLANK TEMPLATE v12** — 125 `data-field` attributes on all contenteditable elements + optional Resources section toggle |
| [`templates/html/WPS_Music_Y34_T2W3_Rhythm_EXAMPLE_v12.html`](https://github.com/Luck-Dragon-Pty-Ltd/lessonlab/blob/main/templates/html/WPS_Music_Y34_T2W3_Rhythm_EXAMPLE_v12.html) | Filled Music example — Year 3/4, Steady Beat & Rhythm Patterns |
| [`templates/html/WPS_Art_Y56_T2W2_ObservationalDrawing_EXAMPLE_v12.html`](https://github.com/Luck-Dragon-Pty-Ltd/lessonlab/blob/main/templates/html/WPS_Art_Y56_T2W2_ObservationalDrawing_EXAMPLE_v12.html) | Filled Visual Art example — Year 5/6, Observational Drawing |
| [`templates/html/WPS_STEM_Y34_T2W4_BridgeChallenge_EXAMPLE_v12.html`](https://github.com/Luck-Dragon-Pty-Ltd/lessonlab/blob/main/templates/html/WPS_STEM_Y34_T2W4_BridgeChallenge_EXAMPLE_v12.html) | Filled STEM/Design example — Year 3/4, Bridge Engineering Challenge |
| [`templates/html/WPS_Italian_Y12_T2W1_Greetings_EXAMPLE_v12.html`](https://github.com/Luck-Dragon-Pty-Ltd/lessonlab/blob/main/templates/html/WPS_Italian_Y12_T2W1_Greetings_EXAMPLE_v12.html) | Filled Italian/Languages example — Year 1/2, Greetings & Introductions |

Also still live from Session 1:
- `WPS_PE_Foundation_T2W1_v11.html` — PE example (chest pass, Foundation)
- `WPS_LessonPlan_BLANK_TEMPLATE_v11.html` — previous blank (superseded by v12)

---

## What Changed in v12

### 1. `data-field` attributes on all contenteditable elements
Every one of the 125 contenteditable areas in the blank template now has a `data-field="..."` attribute. This is the key enabler for AI injection — the Cloudflare Worker can target any field by name.

**Field naming scheme:**
- Shared meta fields (same on all 3 pages): `subject`, `year-level`, `term-week`, `teacher-name`
- Page 1 fields: `p1-open-focus`, `p1-open-step1` … `p1-close-step3`, `resource-1` … `safety-5`, `p1-footer`
- Page 2 fields: `p2-subtitle`, `li-full`, `success-criteria`, `curriculum-links`, `class-profile`, `prior-evidence`, `achievement-label`, `achievement-standard`, `prior-knowledge`, `diff-planning`, `unit-links`, `resources-space`, `p2-open-*`, `p2-teach-*`, `p2-footer`
- Page 3 fields: `p3-wedo-*`, `p3-ydo-*`, `p3-close-*`, `tier1-*`, `tier-core-*`, `tier3-*`, `wellbeing-*`, `incl-*`, `assessment-*`, `reflect-*`, `p3-footer`
- Badge bar: `curriculum-code`, `badge-year-level`, `badge-duration`, `badge-location`, `badge-class-size`

**For AI injection:** Find all elements where `data-field === "subject"` and set `.innerHTML`. Shared fields (subject, year-level, etc.) appear on all 3 pages — setting them once automatically fills all 3.

### 2. Optional Resources & Materials section
Page 1 now has an "👁 Hide/Show resources section" toggle button above the Resources & Safety boxes.
- Click to hide the entire section (useful for subjects with no physical materials)
- Section is hidden using a CSS class (`.res-hidden`) — hidden on print too
- Button disappears on print (`no-print` class)

### 3. Four new example lesson plans
All 4 were built from the v12 blank template using BeautifulSoup substitution. They serve as:
- Reference for teachers creating their own plans
- Training data/reference for AI generation
- Demonstration of the template's cross-subject versatility

| Example | Subject | Year | Topic |
|---------|---------|------|-------|
| Music | Music | 3/4 | Steady Beat & Rhythm Patterns (ta/ti-ti notation) |
| Visual Art | Art | 5/6 | Observational Drawing (contour line & tonal shading) |
| STEM | Technologies/Design | 3/4 | Bridge Engineering Challenge (design-build-test-improve) |
| Italian | LOTE/Italian | 1/2 | Greetings & Introductions (Ciao, Come ti chiami?, Mi chiamo) |

---

## Template Architecture (unchanged from v11)

See Session 1 handover for full details. Brief recap:
- 3 A4 pages: Page 1 = CRT one-pager, Page 2 = VTLM Elements 1–3, Page 3 = VTLM Elements 4–5 + Wellbeing + Assessment + Reflection
- Auto-fit engine: viewport zoom (Layer 1) + content scale (Layer 2)
- Print: 3 pages → 3 A4 sheets, `@page { margin: 0; }`
- All contenteditable areas: `white-space: pre-wrap`, `word-break: break-word`

---

## What's Still To Do

### For LessonLab integration
- [ ] AI content injection: Cloudflare Worker generates content as JSON `{ field: value }`, client-side JS iterates `document.querySelectorAll('[data-field="X"]')` and sets `.innerHTML`
- [ ] Decide: pre-fill server-side (return filled HTML) vs client-side fill (return JSON + blank template)
- [ ] Subject-specific colour theming: currently all examples use the same 5 phase colours (pedagogically accurate — phases are subject-agnostic). If needed, add a `data-theme` attribute to `<body>` and a subject→theme CSS mapping.
- [ ] Conditional sections: add `data-optional="true"` attribute to sections that may not apply (Resources, Tier table, etc.) + JS toggle. Resources section done ✅. Remaining: Tier table (may not suit Maths/Art), Wellbeing (always relevant, keep).
- [ ] `data-field` documentation: maintain a field reference doc so LessonLab AI prompt can reference field names precisely

### Subjects still needing examples
All 5 specialist subjects now have examples ✅ (PE, Music, Art, STEM, Italian)

### How files were pushed
```
POST https://asgard-tools.pgallivan.workers.dev/admin/gh-write
X-Pin: 535554
User-Agent: Mozilla/5.0 (required to pass Cloudflare)
{ repo, path, content_b64, message, branch: "main" }
```

---

## LessonLab Context (same as Session 1)

**Tech stack:** Cloudflare Worker (`lessonlab-api`) + D1 (SQLite) + Anthropic Claude API + GitHub (`Luck-Dragon-Pty-Ltd/lessonlab`)

**How to inject content into the template (recommended client-side approach):**
```javascript
// Worker returns: { fields: { "subject": "Music", "year-level": "3/4", ... } }
// Client-side:
function injectFields(fieldsObj) {
  for (const [field, value] of Object.entries(fieldsObj)) {
    document.querySelectorAll(`[data-field="${field}"]`)
      .forEach(el => el.innerHTML = value);
  }
}
```

This works because shared fields (subject, year-level, etc.) have the same `data-field` on all 3 pages — one injection fills all.
