# LessonLab — Full Project Handover

**Last updated:** 21 May 2026
**Project:** LessonLab — SaaS AI lesson plan generator for specialist teachers
**Owner:** Paddy Gallivan — PE / Specialist Teacher, Westbourne Park School (WPS), Adelaide SA
**Website:** https://lessonlab.com.au (live, currently hidden during rebuild)
**GitHub:** https://github.com/Luck-Dragon-Pty-Ltd/lessonlab

---

## Architectural Rules (non-negotiable)

1. **Every project has its own dedicated Cloudflare Worker** — no cross-project worker sharing
2. **Every project has its own GitHub fine-grained PAT** — scoped only to that project's repo
3. **Rotate one project's token → only that project is affected**
4. Secrets live in Cloudflare Worker secret bindings only — never hardcoded, never in GitHub

---

## Infrastructure

### Cloudflare Account
- Account subdomain: `luckdragon.workers.dev`
- All workers live at `*.luckdragon.workers.dev`

### LessonLab Worker: `lessonlab-api`
| Property | Value |
|----------|-------|
| URL | `https://lessonlab-api.luckdragon.workers.dev` |
| Version | 1.1.0 |
| Secret: GITHUB_TOKEN | Fine-grained PAT — write access to `Luck-Dragon-Pty-Ltd/lessonlab` only |
| Secret: LESSONLAB_PIN | Stored in CF secrets — required as `X-Pin` header on all write calls |
| Auth header | `X-Pin: <LESSONLAB_PIN>` |

### Worker Endpoints
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/health` | GET | None | Liveness check |
| `/gh-write` | POST | X-Pin | Create or update a file in the lessonlab GitHub repo |
| `/gh-delete` | POST | X-Pin | Delete a file from the lessonlab GitHub repo |

### `/gh-write` request body
```json
{
  "path": "templates/html/filename.html",
  "content_b64": "<base64 encoded file content>",
  "message": "commit message",
  "branch": "main"
}
```

### `/gh-delete` request body
```json
{
  "path": "templates/html/filename.html",
  "message": "commit message",
  "branch": "main"
}
```

### GitHub Repository
- Org: `Luck-Dragon-Pty-Ltd`
- Repo: `lessonlab`
- Branch: `main`
- Templates live at: `templates/html/`
- Cloudflare Pages auto-deploys on every push to main

### Deploying Worker Updates
Worker is deployed via `asgard-tools` (one-time bootstrap only — not an ongoing dependency):
```
POST https://asgard-tools.luckdragon.workers.dev/admin/deploy
X-Pin: <PADDY_PIN>
{ "worker_name": "lessonlab-api", "code_b64": "<base64>", "main_module": "worker.js" }
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | lessonlab.com.au (Cloudflare Pages) |
| API Worker | `lessonlab-api` (Cloudflare Worker) |
| Database | Cloudflare D1 (SQLite) — stores teacher accounts + saved lesson plans as JSON |
| AI Generation | Anthropic Claude API |
| Template files | Self-contained HTML, stored in GitHub, served via CF Pages |
| File management | `lessonlab-api` /gh-write + /gh-delete |

---

## Template Files (current)

All at `templates/html/` in the GitHub repo:

| File | Purpose |
|------|---------|
| `WPS_LessonPlan_BLANK_TEMPLATE_v12.html` | **Master blank template** — all 125 fields are generic `[placeholders]`, ready for AI injection |
| `WPS_Music_Y34_T2W3_Rhythm_EXAMPLE_v12.html` | Filled example — Music, Year 3/4, Steady Beat & Rhythm |
| `WPS_Art_Y56_T2W2_ObservationalDrawing_EXAMPLE_v12.html` | Filled example — Visual Art, Year 5/6, Observational Drawing |
| `WPS_STEM_Y34_T2W4_BridgeChallenge_EXAMPLE_v12.html` | Filled example — STEM/Design, Year 3/4, Bridge Engineering |
| `WPS_Italian_Y12_T2W1_Greetings_EXAMPLE_v12.html` | Filled example — Italian (LOTE), Year 1/2, Greetings & Introductions |
| `HANDOVER.md` | This file |

**Naming convention:** `WPS_[Subject]_[YearLevel]_[TermWeek]_[Topic]_[EXAMPLE|BLANK]_v[N].html`

---

## Three-Page Template Structure

Every lesson plan is exactly 3 A4 pages. All three are in one HTML file.

### Page 1 — CRT Quick Reference (One-Pager)
Designed for a relief/casual teacher to run the entire lesson from a single page. Must be scannable in 30 seconds.

Contains:
- Header: subject, school, year level, term/week, teacher name
- Badge row: curriculum code, year level, duration, location/room, class size
- CRT overview table: Focus/Topic | Resources | Room Setup | Learning Intention
- Learning Intention & Success Criteria (combined box)
- **5 teaching phases** — each with numbered steps, NOTE box, CFU box, transition line
- Resources & Materials list (optional — can be hidden with toggle)
- Safety & Wellbeing notes
- Page footer: `[Subject] | [Year Level] | [Term Week] | [Topic] — Page 1 of 3 — CRT Reference`

**Phase structure on Page 1 (each phase has):**
- Phase title + sidebar colour strip
- Italic focus/strategy description
- Steps ①②③ (3 steps)
- NOTE box (blue) — teacher watch-fors, modifications
- CFU (yellow) — check for understanding signal
- Transition line (green italic) — script to move to next phase

### Page 2 — VTLM Full Detail (Elements 1, 2, 3)
Full lesson planning detail for the teacher who wrote it. Not for CRTs.

Contains:
- Header: "Full Detail" subtitle
- Learning Intention (full version)
- Success Criteria (full version)
- Victorian Curriculum Links (codes + strand descriptions)
- Class Profile / Context (EAL/D, IEPs, group dynamics)
- Evidence from Last Lesson (prior assessment observations)
- Victorian Curriculum 2.0 Achievement Standard (pasted from VC2 website)
- **Element 1 — Planning for Learning:** Prior Knowledge/Pre-Assessment, Differentiation Planning (Tier 1/Core/Tier 3), Unit Links
- Resources space
- **Element 2 — Enabling Learning (Opening/Activation):** Full phase with focus, 3 steps, teaching notes, CFU, transition
- **Element 3 — Explicit Teaching (I Do):** Full phase with focus, 4 steps, teaching notes, CFU, transition
- Page footer: `[Subject] | [Year Level] | [Term Week] | [Topic] — Page 2 of 3 — Full Detail`

### Page 3 — VTLM Elements 4 & 5 + Wellbeing + Assessment + Reflection
Contains:
- Header: "Elements 4 & 5 | Differentiation | Wellbeing | Assessment & Reflection"
- **Element 4 — Supported Application:**
  - We Do (Guided Practice): focus, steps, transition
  - Differentiated Station Tasks table (3 columns: Tier 1 Supported / Core Task / Tier 3 Extension) — each with task description + teacher action
  - You Do (Independent Practice): focus, steps, transition
- **Element 5 — Reflection on Learning (Closure):** focus, steps
- Wellbeing & SEL (3 columns: Wellbeing Focus / Social Skill Target / Emotional Regulation)
- Inclusive Practice & Adjustments (2×2 grid: EAL/D Students / Learning & Physical Support / Extension & Gifted / Medical & Withdrawal Notes)
- Assessment & Evidence (2 columns: Assessment Strategy / VC2.0 Links & Documentation)
- Teacher Reflection — 4 boxes filled AFTER the lesson: What Worked Well / What Would I Change / Student Data & Patterns Observed / Adjustments for Next Lesson
- Page footer: `[Subject] | [Year Level] | [Term Week] | [Topic] | VTLM 2.0 — Page 3 of 3`

---

## VTLM 2.0 — Victorian Teaching and Learning Model

The template is built around VTLM 2.0, the South Australian / Victorian pedagogical framework used in WPS and similar schools.

### The 5 Elements

| # | Element | What it is | Template section |
|---|---------|-----------|-----------------|
| 1 | **Planning for Learning** | Prior knowledge, differentiation planning, unit context | Page 2 — top section |
| 2 | **Enabling Learning** | Opening/Activation phase — hook, prior knowledge activation, engagement | Page 2 — Opening phase |
| 3 | **Explicit Teaching** | I Do — direct instruction, modelling, think-aloud | Page 2 — Explicit Teaching phase |
| 4 | **Supported Application** | We Do + You Do — guided then independent practice with tiered differentiation | Page 3 — We Do + Tier table + You Do |
| 5 | **Reflection on Learning** | Closure — consolidation, metacognition, exit | Page 3 — Closure phase |

### Phase Names in Template (subject-agnostic)
The template uses generic phase names that apply across all specialist subjects:

| Phase | Sidebar colour | VTLM element | Notes |
|-------|---------------|-------------|-------|
| Opening / Activation | Blue `#1565C0` | Element 2 | Not "Warm Up" — not all subjects have physical warm-ups |
| Explicit Teaching | Purple `#6A1B9A` | Element 3 | I Do — model/demonstrate |
| We Do — Guided Practice | Green `#2E7D32` | Element 4 | Teacher-supported attempt |
| You Do — Independent Practice | Burnt orange `#BF360C` | Element 4 | Student applies independently |
| Closure & Reflection | Slate `#455A64` | Element 5 | Not "Pack Up" — cross-subject |

### Differentiation Tiers
All lesson plans use a 3-tier model on Page 3:
- **Tier 1 — Supported** (red header `#C62828`): Reduced complexity, scaffolding, buddy support
- **Core Task** (blue header `#1565C0`): Standard task as planned for the majority
- **Tier 3 — Extension** (green header `#2E7D32`): Higher complexity, deeper thinking, leadership

---

## Victorian Curriculum 2.0 (VC2)

All curriculum codes follow the VC2 format. Examples by subject:

| Subject | Example code | Strand |
|---------|-------------|--------|
| PE / HPE | `VC2HPFM01` | Movement & Physical Activity |
| Music | `VC2MUSC2301` | Elements of Music |
| Visual Art | `VC2VSAR2501` | Explore & Express Arts |
| Technologies / STEM | `VC2TDE2301` | Technologies Design |
| Italian (LOTE) | `VC2LOIT0101` | Communicating in Italian |

**Achievement Standards** are pasted directly from the VC2 website into the template. They sit in the green-bordered box on Page 2 labelled "Victorian Curriculum 2.0 Achievement Standard — [Year Level] [Subject]".

**Code format:** `VC2` + subject abbreviation + year level + strand number

---

## Colour Palette

```
Navy header:           #1F3864
VC2 green (banners):   #1B6B2A
Element banners bg:    #D5F5E3

Phase sidebar colours:
  Opening/Activation:    #1565C0  (blue)
  Explicit Teaching:     #6A1B9A  (purple)
  We Do:                 #2E7D32  (green)
  You Do:                #BF360C  (burnt orange)
  Closure:               #455A64  (slate)

Content boxes:
  Note box bg:           #EBF4FB  (light blue)
  CFU box bg:            #FFFDE7  (light yellow)
  Transition text:       #1B5E20  (dark green italic)

Differentiation table:
  Tier 1 header:         #C62828  bg: #FFEBEE
  Core header:           #1565C0  bg: #EBF5FB
  Tier 3 header:         #2E7D32  bg: #EAFAF1

Page 3 sections:
  Wellbeing:             #FCE4EC  (pink)
  Inclusive Practice:    #E8EAF6  (indigo tint)
  Assessment:            #FFF8E1  (amber tint)
  Reflection:            #E0F7FA  (cyan tint)

Badge row colours (pill-shaped):
  Curriculum code:       #1B6B2A (dark green)
  Year level:            #1565C0 (blue)
  Duration:              #BF360C (burnt orange)
  Location/Room:         #E65100 (deep orange)
  Class size:            #455A64 (slate)
```

---

## Auto-Fit JavaScript Engine

Every template page has two layers of auto-fitting JS that run on DOMContentLoaded:

**Layer 1 — Viewport zoom (`zoom` on `.page`)**
- Measures viewport width vs A4 (210mm)
- If viewport < A4, applies CSS `zoom` to scale the entire page down
- Uses `zoom` not `transform` — zoom changes layout, transform only changes appearance

**Layer 2 — Content scale (`transform: scale()` on `.page-inner`)**
- `wrapInners()` wraps each page's content in a `.page-inner` div
- `fitContent()` measures `scrollHeight` vs `clientHeight`
- If content overflows A4 height, scales inner content DOWN to fit
- Width compensated: `width = (100/scale)%` so content still fills the full page width
- MutationObserver re-runs on every contenteditable edit (debounced 280ms)
- Re-runs on window resize and before print

**Print:**
```css
@media print {
  .page { zoom: 1 !important; height: 297mm; overflow: hidden; }
  .no-print { display: none !important; }
}
```
Three pages print on exactly 3 A4 sheets. `page-break-after: always` on each `.page`.

---

## Data-Field System (AI Injection)

Every contenteditable element in the template has a `data-field="fieldname"` attribute.
Total: **125 fields** across all 3 pages.

### How AI injection works
```javascript
function injectFields(fieldsObj) {
  for (const [field, value] of Object.entries(fieldsObj)) {
    document.querySelectorAll(`[data-field="${field}"]`)
      .forEach(el => el.innerHTML = value);
  }
}
```
Shared meta fields (e.g. `subject`, `year-level`) appear on all 3 pages — one injection fills all instances.

### Complete Field Reference

**Shared meta (appear on all 3 pages)**
| Field | Location |
|-------|---------|
| `subject` | Header on all 3 pages |
| `year-level` | Header on all 3 pages |
| `term-week` | Header on all 3 pages |
| `teacher-name` | Header on all 3 pages |

**Page 1 — CRT Quick Reference**
| Field | Description |
|-------|------------|
| `curriculum-code` | Badge: e.g. "VC2MUSC2301 — Elements of Music" |
| `badge-year-level` | Badge: e.g. "Year 3/4" |
| `badge-duration` | Badge: e.g. "45 min" |
| `badge-location` | Badge: e.g. "Music Room" |
| `badge-class-size` | Badge: e.g. "26 students" |
| `p1-focus` | CRT table: Focus/Topic |
| `p1-resources` | CRT table: Key resources |
| `p1-room` | CRT table: Room/Setup |
| `p1-li-short` | CRT table: Short learning intention |
| `li-sc` | Full LI + SC box (shared p1+p2) |
| `p1-open-focus` | Opening phase: italic focus line |
| `p1-open-step1/2/3` | Opening phase: 3 steps |
| `p1-open-note` | Opening phase: NOTE box |
| `p1-open-cfu` | Opening phase: CFU box |
| `p1-open-trans` | Opening phase: transition line |
| `p1-teach-focus` | Explicit Teaching: italic focus line |
| `p1-teach-step1/2/3` | Explicit Teaching: 3 steps |
| `p1-teach-note` | Explicit Teaching: NOTE box |
| `p1-teach-cfu` | Explicit Teaching: CFU box |
| `p1-teach-trans` | Explicit Teaching: transition line |
| `p1-wedo-focus` | We Do: italic focus line |
| `p1-wedo-step1/2/3` | We Do: 3 steps |
| `p1-wedo-note` | We Do: NOTE box |
| `p1-wedo-cfu` | We Do: CFU box |
| `p1-wedo-trans` | We Do: transition line |
| `p1-ydo-focus` | You Do: italic focus line |
| `p1-ydo-step1/2/3` | You Do: 3 steps |
| `p1-ydo-note` | You Do: NOTE box |
| `p1-ydo-cfu` | You Do: CFU box |
| `p1-ydo-trans` | You Do: transition line |
| `p1-close-focus` | Closure: italic focus line |
| `p1-close-step1/2/3` | Closure: 3 steps |
| `p1-close-note` | Closure: NOTE box |
| `p1-close-cfu` | Closure: CFU box |
| `p1-close-trans` | Closure: transition line |
| `resource-1` through `resource-5` | Resources list items |
| `safety-1` through `safety-5` | Safety notes list items |
| `p1-footer` | Page 1 footer text |

**Page 2 — Full Detail (Elements 1–3)**
| Field | Description |
|-------|------------|
| `p2-subtitle` | Page 2 subheader line |
| `li-full` | Learning Intention (full) |
| `success-criteria` | Success Criteria (full) |
| `curriculum-links` | Victorian Curriculum codes + descriptions |
| `class-profile` | Class size, EAL/D, IEPs, dynamics |
| `prior-evidence` | Evidence from last lesson |
| `achievement-label` | Achievement standard label |
| `achievement-standard` | Pasted VC2 achievement standard text |
| `prior-knowledge` | Element 1: prior knowledge/pre-assessment |
| `diff-planning` | Element 1: differentiation planning |
| `unit-links` | Element 1: unit context, lesson number |
| `resources-space` | Element 1: additional resources |
| `p2-open-focus` | Element 2 Opening: italic focus |
| `p2-open-step1/2/3` | Element 2 Opening: 3 steps |
| `p2-open-note` | Element 2 Opening: teaching notes |
| `p2-open-cfu` | Element 2 Opening: CFU |
| `p2-open-trans` | Element 2 Opening: transition |
| `p2-teach-focus` | Element 3 Explicit Teaching: italic focus |
| `p2-teach-step1/2/3/4` | Element 3: 4 steps |
| `p2-teach-notes` | Element 3: teaching notes |
| `p2-teach-cfu` | Element 3: CFU |
| `p2-teach-trans` | Element 3: transition |
| `p2-footer` | Page 2 footer text |

**Page 3 — Elements 4 & 5 + Wellbeing + Assessment + Reflection**
| Field | Description |
|-------|------------|
| `p3-wedo-focus` | Element 4 We Do: italic focus |
| `p3-wedo-step1/2/3` | Element 4 We Do: 3 steps |
| `p3-wedo-trans` | Element 4 We Do: transition |
| `tier1-diff-desc` | Tier 1 description (teacher action) |
| `tier-core-diff-desc` | Core task description |
| `tier3-diff-desc` | Tier 3 description |
| `tier1-task` | Tier 1 student task |
| `tier-core-task` | Core student task |
| `tier3-task` | Tier 3 student task |
| `p3-ydo-focus` | You Do: italic focus |
| `p3-ydo-step1/2/3` | You Do: 3 steps |
| `p3-ydo-trans` | You Do: transition |
| `p3-close-focus` | Closure: italic focus |
| `p3-close-step1/2/3` | Closure: 3 steps |
| `wellbeing-focus` | Wellbeing: focus area |
| `wellbeing-social` | Wellbeing: social skill target |
| `wellbeing-regulation` | Wellbeing: emotional regulation strategy |
| `incl-eald` | Inclusive: EAL/D adjustments |
| `incl-learning-support` | Inclusive: learning/physical support |
| `incl-extension` | Inclusive: extension/gifted pathway |
| `incl-medical` | Inclusive: medical/withdrawal notes |
| `assessment-strategy` | Assessment: strategy description |
| `assessment-docs` | Assessment: VC2 links & documentation |
| `reflect-worked` | Post-lesson: what worked well |
| `reflect-change` | Post-lesson: what to change |
| `reflect-data` | Post-lesson: student data/patterns |
| `reflect-next` | Post-lesson: adjustments for next lesson |
| `p3-footer` | Page 3 footer text |

---

## Optional Resources Section (Page 1)

The Resources & Safety section on Page 1 can be hidden/shown via a toggle button:
- Button: `👁 Hide resources section` / `👁 Show resources section`
- Button is in a `.no-print` div (doesn't appear in PDF)
- Section has `id="res-safety-section"` and toggles class `res-hidden`
- Hidden on print regardless: `@media print { .no-print { display: none !important; } }`

Use case: subjects with no physical materials (e.g. some Maths or English lessons) can hide this section entirely.

---

## Lesson Plan Content Rules (for AI generation)

When generating content for any field, follow these rules:

### General
- Page 1 is for CRTs — keep language direct, scannable, practical. No jargon.
- Page 2 is for the planning teacher — can be more detailed and pedagogical
- Page 3 is the deep dive — full differentiation, wellbeing, evidence
- All three pages must be internally consistent (same lesson, same LI, same content)

### Learning Intention & Success Criteria
- LI format: "We are learning to [verb] [concept/skill]"
- SC format: "I can: (1) [observable action], (2) [observable action], (3) [observable action]"
- LI on page 1 is a short version; page 2 has the full version
- SC on page 1 is inline with LI; page 2 has it in its own box

### Phase Steps
- Page 1: 3 steps per phase (concise, action-oriented)
- Page 2 Opening: 3 steps
- Page 2 Explicit Teaching: 4 steps (more detail needed for modelling)
- Page 3 We Do: 3 steps
- Page 3 You Do: 3 steps
- Page 3 Closure: 3 steps
- Each step should start with a **bold action label** e.g. `<strong>Show the card:</strong> ...`

### NOTE boxes
- Teacher watch-fors, not instructions
- What to look for, who to target, common errors, management tips
- Always starts with what to observe: "Watch for...", "Look for...", "Students who..."

### CFU (Check for Understanding)
- A specific, quick signal the teacher can use
- E.g. "Thumbs signal: ...", "Exit clap: ...", "Show me: ..."
- Must be fast (under 60 seconds)

### Transition lines
- Italic script — what the teacher literally says to move to the next phase
- Quoted or near-quoted speech: e.g. → *"Now we're going to..."*

### Differentiation tiers
- Tier 1 (Supported): reduce complexity, add scaffolding, alternative format. Not easier content — same concept, more support.
- Core: the lesson as planned for most students
- Tier 3 (Extension): same concept, higher complexity, metacognitive demand, peer teaching, additional output

### Wellbeing
- Focus on real wellbeing goals relevant to the lesson context
- Social skill target should be observable during the lesson
- Emotional regulation: specific strategy for dysregulation (not generic)

### Inclusive Practice
- EAL/D: language support strategies (visuals, buddy, gesture, first language validation)
- Learning support: IEP-aware adjustments (motor, cognitive, attention)
- Extension: named pathway (not just "finish early tasks")
- Medical: specific and practical (named conditions/risks where relevant)

---

## Subject-Specific Notes

### PE / HPE
- Opening = physical warm-up game with tactical/spatial awareness
- Explicit Teaching uses cue model (e.g. READY → STEP → PUSH → FOLLOW)
- We Do = partner/group drill with circulation
- You Do = game or station rotation
- Resources = equipment list (balls, cones, markers, hoops etc)

### Music
- Opening = listening activity, rhythm exercise, call-and-response
- Explicit Teaching = notation, listening analysis, or technique demonstration
- Curriculum strand: Elements of Music (VC2MUSC)
- Room setup: usually circle on mat → instrument stations

### Visual Art
- Opening = Look & Think & Wonder — observation before making
- Explicit Teaching = technique demonstration (contour line, tone, colour mixing etc)
- Curriculum strand: Explore & Express Arts (VC2VSAR)
- Resources = art materials (pencils, paper, medium)

### STEM / Technologies Design
- Follows design process: Plan → Build → Test → Improve
- Explicit Teaching = engineering/design constraints and process
- Curriculum strand: Technologies Design (VC2TDE)
- Materials constraint is a key teaching tool (limited resources forces creative thinking)

### Languages (Italian / LOTE)
- Opening = song, gesture game, or familiar phrase warmup
- Explicit Teaching = modelling target language with puppets, cards, gesture
- Curriculum strand: Communicating in [Language] (VC2LOIT for Italian)
- `[name]` in content is intentional — it's the fill-in-the-blank teaching notation (not an unfilled placeholder)
- Cultural connections are important — acknowledge heritage speakers as "language experts"

---

## BeautifulSoup Injection (Python — for building examples)

When building filled example files from the blank template using Python:

```python
from bs4 import BeautifulSoup
import copy

with open('WPS_LessonPlan_BLANK_TEMPLATE_v12.html') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

FIELDS = {
    'subject': 'Music',
    'year-level': 'Year 3/4',
    # ... etc
}

for field, value in FIELDS.items():
    elements = soup.find_all(attrs={'data-field': field})
    for el in elements:
        el.clear()
        frag = BeautifulSoup(value, 'html.parser')
        for child in frag.contents:
            el.append(copy.deepcopy(child))

# Fix &nbsp; — BeautifulSoup converts &nbsp; to \xa0
html_out = str(soup).replace('\xa0', '&nbsp;')

with open('output.html', 'w', encoding='utf-8') as f:
    f.write(html_out)
```

**Known gotcha:** BeautifulSoup parses `&nbsp;` to Unicode `\xa0` — always do `.replace('\xa0', '&nbsp;')` on output.

---

## Pushing Files to GitHub (via lessonlab-api)

```python
import urllib.request, json, base64

with open('myfile.html', 'rb') as f:
    content = f.read()

payload = json.dumps({
    'path': 'templates/html/myfile.html',
    'content_b64': base64.b64encode(content).decode(),
    'message': 'Add/update myfile.html',
    'branch': 'main'
}).encode()

req = urllib.request.Request(
    'https://lessonlab-api.luckdragon.workers.dev/gh-write',
    data=payload,
    headers={
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'X-Pin': '<LESSONLAB_PIN>'   # stored in CF secrets
    },
    method='POST'
)
with urllib.request.urlopen(req) as r:
    result = json.loads(r.read())
# result = { ok: true, path, sha, commit, html_url }
```

---

## Account Storage (Lesson Plans in D1)

Lesson plans are stored as **JSON field values**, not full HTML.

**Storage pattern:**
```json
{
  "id": "uuid",
  "teacher_id": "uuid",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "template_version": "v12",
  "fields": {
    "subject": "Music",
    "year-level": "Year 3/4",
    "term-week": "T2W3",
    "p1-open-step1": "Begin a 4-beat steady clap...",
    "..."  : "..."
  }
}
```

**Reconstitution:** Load the blank template HTML, call `injectFields(plan.fields)`, display. Instant.

**Why JSON not HTML:** Tiny storage footprint, version-safe (can re-inject old JSON into new template version), easy to diff/edit server-side.

---

## What's Built

- [x] Blank template v12 with 125 data-field attributes
- [x] Optional Resources section toggle on Page 1
- [x] 4 filled subject examples (Music, Art, STEM, Italian)
- [x] Dedicated `lessonlab-api` Cloudflare Worker (own token, own PIN)
- [x] `/gh-write` and `/gh-delete` endpoints tested and live
- [x] All 5 files visually verified in Chrome (all 3 pages each)
- [x] Blank template fully generic — no subject-specific content leaked in

## What's Next

- [ ] Build the AI generation endpoint (`/generate`) on lessonlab-api — takes subject/year/topic/class profile → calls Claude → returns filled fields JSON
- [ ] Wire up lessonlab.com.au frontend to call the API and render the template
- [ ] D1 schema for teacher accounts + saved lesson plans
- [ ] Auth (teacher login/signup)
- [ ] Save/load lesson plan from account
- [ ] PE example (Foundation, Chest Pass) — still on v11, needs v12 rebuild
- [ ] Export to PDF workflow (already built into template — Print button)

---

## Previous Sessions

- **Session 1 (May 2026):** Built initial HTML template (v11), PE Foundation example, established 3-page structure, auto-fit JS engine
- **Session 2 (May 2026):** Added 125 data-field attributes to blank template v12, optional Resources toggle, built Music/Art/STEM/Italian examples, fixed BeautifulSoup &nbsp; bug, fixed PE content leaking into blank template, set up lessonlab-api worker on luckdragon.workers.dev, renamed CF account subdomain pgallivan → luckdragon, verified all files in Chrome
