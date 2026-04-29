// WPS_PE_Foundation_T2W1_v11.docx — VTLM 2.0 fully mandated
// Pages 2-3 reorganised around the FOUR ELEMENTS OF TEACHING:
//   1. Planning · 2. Enabling Learning · 3. Explicit Teaching · 4. Supported Application
// Plus mandated: 4 Elements of Learning, worked example, sentence stems,
// metacognitive prompts, vocabulary tiers, Tier 1/2/3 tasks, inclusive practice.

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageBreak, PageNumber, HeightRule
} = require('docx');

const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 720;
const CONTENT_W = PAGE_W - 2 * MARGIN;

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "888888" };
const ALL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CELL_MARGINS = { top: 70, bottom: 70, left: 100, right: 100 };
const SHADE_HEAD = { fill: "E7E6E6", type: ShadingType.CLEAR, color: "auto" };
const SHADE_BANNER = { fill: "FFF2CC", type: ShadingType.CLEAR, color: "auto" };
const SHADE_PHASE = { fill: "DEEBF7", type: ShadingType.CLEAR, color: "auto" };
const SHADE_VTLM = { fill: "E2EFDA", type: ShadingType.CLEAR, color: "auto" }; // VTLM element headers
const SHADE_CIT = { fill: "FFF2CC", type: ShadingType.CLEAR, color: "auto" }; // checks for understanding

const P = (opts) => new Paragraph({ spacing: { before: 0, after: 20 }, ...opts });
const T = (text, opts = {}) => new TextRun({ text, ...opts });
const headLine = (text) => P({ children: [T(text, { bold: true, size: 18 })] });
const small = (text, opts = {}) => P({ children: [T(text, { size: 16, ...opts })] });
const bullet = (text, opts = {}) => P({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 0, after: 20 },
  children: [T(text, { size: 16, ...opts })]
});

function cell(content, opts = {}) {
  const { width = CONTENT_W, shading, colSpan, rowSpan, valign = VerticalAlign.CENTER, padding } = opts;
  return new TableCell({
    borders: ALL_BORDERS,
    width: { size: width, type: WidthType.DXA },
    shading, columnSpan: colSpan, rowSpan, verticalAlign: valign,
    margins: padding || CELL_MARGINS,
    children: Array.isArray(content) ? content : [content]
  });
}

function tokenLine(text, opts = {}) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  const runs = parts.filter(s => s.length > 0).map(s =>
    /^\{\{.*\}\}$/.test(s)
      ? T(s, { size: 16, italics: true, color: "B22222", ...opts })
      : T(s, { size: 16, ...opts }));
  return P({ children: runs, spacing: { before: 0, after: 20 } });
}

function buildDoc() {
  const ch = [];
  const col2 = Math.floor(CONTENT_W / 2);
  const col3 = Math.floor(CONTENT_W / 3);
  const col4 = Math.floor(CONTENT_W / 4);
  const col5 = Math.floor(CONTENT_W / 5);

  // ===================== PAGE 1 — CRT ONE-PAGER =====================

  // Title block
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [Math.round(CONTENT_W*0.55), Math.round(CONTENT_W*0.45)],
    rows: [new TableRow({ children: [
      cell([
        P({ children: [T("[School Name]", { bold: true, size: 22, italics: true, color: "B22222" })] }),
        P({ children: [T("PE \u2014 Lesson Plan", { bold: true, size: 20 })] }),
      ], { width: Math.round(CONTENT_W*0.55), shading: SHADE_HEAD }),
      cell([
        tokenLine("Year level: Foundation", { bold: true }),
        tokenLine("Term 2 \u00b7 Week 1 \u00b7 Mon 20 April 2026"),
      ], { width: Math.round(CONTENT_W*0.45), shading: SHADE_HEAD })
    ]})]
  }));

  // Banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [
      cell([P({ alignment: AlignmentType.CENTER, children: [
        T("FOR CRT \u2014 READ THIS PAGE ONLY. ", { bold: true, size: 18 }),
        T("Everything you need to deliver this lesson is on this page. The specialist teacher has planned it \u2014 follow each step in order.", { size: 16 })
      ]})], { shading: SHADE_BANNER })
    ]})]
  }));

  // ============ Page 1: simplified for CRT ============

  // Big TODAY panel (3 cols: lesson + SC + cue words)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [Math.round(CONTENT_W*0.40), Math.round(CONTENT_W*0.40), CONTENT_W - 2*Math.round(CONTENT_W*0.40)],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(P({ children: [T("TODAY", { bold: true, size: 22 })] }), { width: Math.round(CONTENT_W*0.40), shading: SHADE_BANNER }),
        cell(P({ children: [T("SUCCESS CRITERIA", { bold: true, size: 22 })] }), { width: Math.round(CONTENT_W*0.40), shading: SHADE_BANNER }),
        cell(P({ children: [T("CUE WORDS", { bold: true, size: 22 })] }), { width: CONTENT_W - 2*Math.round(CONTENT_W*0.40), shading: SHADE_BANNER }),
      ]}),
      new TableRow({ children: [
        cell([
          P({ children: [T("Running safely and stopping on a signal", { bold: true, size: 20 })] }),
          P({ children: [T("VC2HPFM01 \u00b7 VC2HPFM02 \u00b7 VC2HPFP01", { size: 14, color: "888888" })] }),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          bullet("I can run with my eyes up, looking for space."),
          bullet("I can change direction to avoid other students."),
          bullet("I can stop within 3 steps when I hear the signal."),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          P({ alignment: AlignmentType.CENTER, children: [T("Eyes up", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Find space", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("3-step stop", { bold: true, size: 22, color: "B22222" })] }),
        ], { width: CONTENT_W - 2*Math.round(CONTENT_W*0.40) }),
      ]})
    ]
  }));

  // Big SIGNAL banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell([
      P({ alignment: AlignmentType.CENTER, children: [
        T("SIGNAL: ", { bold: true, size: 22 }),
        T("1 whistle = FREEZE", { bold: true, size: 22, color: "B22222" }),
        T("    \u00b7    ", { size: 22 }),
        T("2 whistles = come to teacher", { bold: true, size: 22, color: "B22222" }),
      ]}),
      P({ alignment: AlignmentType.CENTER, children: [T("Practise the signal x 3 in the first 2 minutes.", { italics: true, size: 16 })] }),
    ], { shading: SHADE_BANNER })]})]
  }));

  // Equipment + Entry + Exit (3 cols)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col3, col3, CONTENT_W - 2*col3],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("EQUIPMENT"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("ENTRY"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("EXIT"), { width: CONTENT_W - 2*col3, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([
          bullet("20 witches hats (boundary)"),
          bullet("10 floor spots"),
          bullet("4 coloured bibs"),
          bullet("1 whistle"),
          bullet("1 foam ball (demo)"),
        ], { width: col3 }),
        cell([
          bullet("Two lines outside, roll order."),
          bullet("Call in to floor spots."),
          bullet("Wait for silence before teaching."),
        ], { width: col3 }),
        cell([
          bullet("Whistle stop \u2192 spots to bin."),
          bullet("Two lines, walk back."),
          bullet("Roll stays with class teacher."),
        ], { width: CONTENT_W - 2*col3 }),
      ]})
    ]
  }));

  // Phase strip
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col5, col5, col5, col5, CONTENT_W - 4*col5],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(P({ alignment: AlignmentType.CENTER, children: [T("1. WARM-UP", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("2. EXPLICIT TEACHING", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("3. PRACTICE (We do)", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("4. APPLICATION (You do)", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("5. PACK UP", { bold: true, size: 18 })] }), { width: CONTENT_W - 4*col5, shading: SHADE_PHASE }),
      ]}),
      new TableRow({ children: [
        cell(P({ alignment: AlignmentType.CENTER, children: [T("6 min", { bold: true, color: "B22222", size: 18 })] }), { width: col5 }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("10 min", { bold: true, color: "B22222", size: 18 })] }), { width: col5 }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("15 min", { bold: true, color: "B22222", size: 18 })] }), { width: col5 }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("15 min", { bold: true, color: "B22222", size: 18 })] }), { width: col5 }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("4 min", { bold: true, color: "B22222", size: 18 })] }), { width: CONTENT_W - 4*col5 }),
      ]})
    ]
  }));

  // Phase activity table -- BIGGER fonts, shorter scripts, CRT-readable
  const phLW = Math.floor(CONTENT_W * 0.18), phBW = CONTENT_W - phLW;
  const phRow = (lbl, mins, body) => new TableRow({ children: [
    cell([
      P({ children: [T(lbl, { bold: true, size: 18 })] }),
      P({ children: [T(`${mins} min`, { bold: true, size: 16, color: "B22222" })] })
    ], { width: phLW, shading: SHADE_PHASE }),
    cell(body, { width: phBW })
  ]});
  const bigBullet = (text) => P({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 0, after: 30 },
    children: [T(text, { size: 18 })]
  });
  const sayLine = (text) => P({ spacing: { before: 0, after: 30 }, children: [
    T("Say: ", { bold: true, size: 18 }),
    T(text, { italics: true, size: 18, color: "B22222" })
  ]});
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [phLW, phBW],
    rows: [
      phRow("WARM-UP", "6", [
        bigBullet("On spots. Walk boundary together \u2014 point at each hat."),
        bigBullet("Practise freeze signal x 3. Praise quick responders."),
        bigBullet("Jog on spot 20 sec. Freeze."),
        sayLine("\u201CIn PE we keep eyes up, find our space, stop on the whistle.\u201D")
      ]),
      phRow("EXPLICIT TEACHING (I do)", "10", [
        bigBullet("Demo safe running: eyes up, arms bent, looking for space."),
        bigBullet("Demo UNSAFE running (slow-mo, looking down). Ask: \u201CWhat was wrong?\u201D"),
        bigBullet("Teach 3-step stop: plant \u00b7 bend \u00b7 small step. Pick 2 students to demo."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Cue words: ", { bold: true, size: 18 }), T("Eyes up \u00b7 Find space \u00b7 3-step stop", { bold: true, size: 18, color: "B22222" })] })
      ]),
      phRow("PRACTICE (We do)", "15", [
        bigBullet("All move at the same time inside the boundary."),
        bigBullet("Teacher calls: walk \u2192 skip \u2192 jog \u2192 fast jog. Whistle = FREEZE."),
        bigBullet("Praise 1\u20132 students by name after each freeze."),
        sayLine("\u201CEyes up \u00b7 Find space \u00b7 3-step stop. Show me a great freeze.\u201D")
      ]),
      phRow("APPLICATION (You do)", "15", [
        bigBullet("Traffic Lights \u2014 pick 4 students as colour callers (bibs)."),
        bigBullet("GREEN = jog \u00b7 YELLOW = walk \u00b7 RED = freeze in 3-step stop."),
        bigBullet("Rotate callers every 2 minutes. Swap all at halfway."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Tier choice: ", { bold: true, size: 18 }), T("Tier 1 (walk-only) \u00b7 Core (full game) \u00b7 Tier 3 (be a caller, balance shape)", { italics: true, size: 18 })] })
      ]),
      phRow("PACK UP & REFLECT", "4", [
        bigBullet("Whistle stop. Spots to bin. Sit on centre line."),
        bigBullet("Thumbs up/middle/down for each SC. One student shares a safe choice."),
        sayLine("\u201CYou ran with eyes up and stopped in three steps. Walk back, two lines.\u201D")
      ]),
    ]
  }));

  // If behaviour issue + If not working + Notes (3 cols)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col3, col3, CONTENT_W - 2*col3],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("IF BEHAVIOUR ISSUE"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("IF IT'S NOT WORKING"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("NOTES FOR CLASS TEACHER"), { width: CONTENT_W - 2*col3, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([
          bullet("Whistle \u2192 calmly name what you saw."),
          bullet("Re-model with one student. Restart."),
          bullet("Repeat \u2192 sit out 1 min, re-join."),
          bullet("Refusing? Offer caller/scorer job; if not, sit near teacher."),
        ], { width: col3 }),
        cell([
          bullet("Bigger boundary \u2014 spread apart"),
          bullet("Walking only \u2014 no jogging yet"),
          bullet("Re-demo with 2 students, not whole class"),
        ], { width: col3 }),
        cell([
          bullet("Leave this sheet on PE office desk."),
          bullet("Note any incidents on the back."),
          bullet("Two lines, walking back. Roll stays with class teacher."),
        ], { width: CONTENT_W - 2*col3 }),
      ]})
    ]
  }));


  // ===================== PAGE 2 — VTLM 2.0 ELEMENTS 1, 2, 3 =====================
  ch.push(P({ children: [new PageBreak()] }));

  // Page 2 banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ alignment: AlignmentType.CENTER, children: [
      T("VTLM 2.0 SPECIALIST DETAIL \u2014 ", { bold: true, size: 20 }),
      T("PE \u00b7 Foundation \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
    ]}), { shading: SHADE_HEAD })]})]
  }));

  // 4 Elements of Learning checklist (NEW — VTLM 2.0 mandate)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col4, col4, col4, CONTENT_W - 3*col4],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(P({ alignment: AlignmentType.CENTER, children: [T("4 ELEMENTS OF LEARNING (VTLM 2.0) \u2014 how this lesson activates each", { bold: true, size: 16 })] }), { colSpan: 4, width: CONTENT_W, shading: SHADE_VTLM }),
      ]}),
      new TableRow({ tableHeader: true, children: [
        cell(headLine("Attention, focus & regulation"), { width: col4, shading: SHADE_VTLM }),
        cell(headLine("Knowledge & memory"), { width: col4, shading: SHADE_VTLM }),
        cell(headLine("Retention & recall"), { width: col4, shading: SHADE_VTLM }),
        cell(headLine("Mastery & application"), { width: CONTENT_W - 3*col4, shading: SHADE_VTLM }),
      ]}),
      new TableRow({ children: [
        cell([small("\u2611 Routines (entry, signal, exit)"), small("\u2611 Clear LI/SC visible"), small("\u2611 Distractions minimised")], { width: col4 }),
        cell([small("\u2611 Chunked teaching (max 3 points)"), small("\u2611 Worked example (page 2)"), small("\u2611 Vocabulary tiers pre-taught")], { width: col4 }),
        cell([small("\u2611 Cue words repeated all lesson"), small("\u2611 Practise the freeze x 3"), small("\u2611 Re-test in W3 + W6")], { width: col4 }),
        cell([small("\u2611 Spaced practice in every lesson"), small("\u2611 Game = transfer to open play"), small("\u2611 Tier 1/2/3 task choice")], { width: CONTENT_W - 3*col4 }),
      ]})
    ]
  }));

  // ELEMENT 1 — Planning header
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ children: [T("ELEMENT 1 \u2014 PLANNING", { bold: true, size: 18 })] }), { shading: SHADE_VTLM })]})]
  }));

  const planLW = Math.floor(CONTENT_W * 0.28), planBW = CONTENT_W - planLW;
  const planRow = (lbl, body) => new TableRow({ children: [
    cell(P({ children: [T(lbl, { bold: true, size: 16 })] }), { width: planLW, shading: SHADE_HEAD }),
    cell(body, { width: planBW })
  ]});
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [planLW, planBW],
    rows: [
      planRow("Lesson focus", [tokenLine("Running safely and stopping on a signal")]),
      planRow("Curriculum (VC2.0)", [
        tokenLine("VC2HPFM01 \u00b7 VC2HPFM02 \u00b7 VC2HPFP01"),
        tokenLine("Fundamental movement skills \u00b7 Moving with control \u00b7 Following rules", { italics: true })
      ]),
      planRow("Where students are at", [
        bullet("Term 1 covered moving safely + responding to whistle."),
        bullet("Most can walk and jog inside boundary; some still lose focus."),
        bullet("A small number need extra modelling of the 3-step stop."),
      ]),
      planRow("Sequence (this term)", [
        tokenLine("W1 (today) \u00b7 W2 same focus \u00b7 W3 add direction change \u00b7 W4 add partner \u00b7 W5 small game"),
      ]),
      planRow("Resources prepared", [tokenLine("See page 1 equipment list. Floor spots laid out before students arrive.")]),
    ]
  }));

  // ELEMENT 2 — Enabling Learning header
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ children: [T("ELEMENT 2 \u2014 ENABLING LEARNING", { bold: true, size: 18 })] }), { shading: SHADE_VTLM })]})]
  }));

  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [planLW, planBW],
    rows: [
      planRow("Learning Intention", [tokenLine("We are learning to run with control in shared space and stop safely on a signal.", { italics: true, color: "B22222" })]),
      planRow("Success Criteria", [
        tokenLine("SC1  I can run with my eyes up, looking for space."),
        tokenLine("SC2  I can change direction to avoid other students."),
        tokenLine("SC3  I can stop within 3 steps when I hear the signal."),
      ]),
      planRow("Why this matters", [tokenLine("Foundation students are building running with control. Safe running + reliable freeze = every future PE lesson is safe.", { italics: true })]),
      planRow("Vocabulary (3 tiers)", [
        small("\u2022 Tier 1 (everyday): run, stop, walk, listen, space"),
        small("\u2022 Tier 2 (lesson):  freeze, signal, boundary, control, safe"),
        small("\u2022 Tier 3 (PE):    3-step stop, fundamental movement, spatial awareness"),
      ]),
      planRow("Routines & engagement", [
        bullet("Same entry \u2192 spots \u2192 boundary walk \u2192 signal x 3 every lesson."),
        bullet("Predictable structure reduces cognitive load (4 Elements of Learning \u2014 attention)."),
      ]),
      planRow("Self-regulation prompts", [
        bullet("\u201CWhat will help you remember the 3-step stop?\u201D"),
        bullet("\u201CHow will you know if you're safe in your space?\u201D"),
        bullet("\u201CWhat can you do if your body wants to go faster than your eyes?\u201D"),
      ]),
    ]
  }));

  // ELEMENT 3 — Explicit Teaching (I DO) header
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ children: [T("ELEMENT 3 \u2014 EXPLICIT TEACHING (I DO)", { bold: true, size: 18 })] }), { shading: SHADE_VTLM })]})]
  }));

  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [planLW, planBW],
    rows: [
      planRow("Focus the learning", [tokenLine("State LI + SC. Show cue words on board. \u201CToday we are learning to run with eyes up and stop in 3 steps.\u201D")]),
      planRow("Explanation & modelling (chunked)", [
        small("Chunk 1 (3 min): Demonstrate safe running \u2014 eyes up, arms bent, finding space."),
        small("Chunk 2 (3 min): Demonstrate UNSAFE running (slow-mo). Ask \u201Cwhat was wrong?\u201D"),
        small("Chunk 3 (4 min): Teach 3-step stop \u2014 plant \u00b7 bend \u00b7 small step. Pick 2 students to demo."),
      ]),
      planRow("Worked example / modelled exemplar", [
        small("(image / sketch space \u2014 teacher shows the 3-step stop frame-by-frame, photo or chalk diagram)"),
        small(""),
        small(""),
      ]),
      planRow("Sentence stems for student response", [
        bullet("\u201CI noticed \u2026 because \u2026\u201D"),
        bullet("\u201CA safe runner has \u2026 and \u2026\u201D"),
        bullet("\u201CMy 3-step stop is \u2026 \u00b7 \u2026 \u00b7 \u2026\u201D"),
      ]),
      planRow("Check for understanding (CFU 1)", [tokenLine("\u201CShow me with your feet \u2014 what does a 3-step stop look like?\u201D \u00b7 \u201CThumbs up if you're ready.\u201D")]),
    ]
  }));

  // ===================== PAGE 3 — VTLM 2.0 ELEMENT 4 + REFLECTION + INCLUSIVE + ASSESSMENT =====================
  ch.push(P({ children: [new PageBreak()] }));

  // Page 3 banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ alignment: AlignmentType.CENTER, children: [
      T("VTLM 2.0 SPECIALIST DETAIL \u2014 ", { bold: true, size: 20 }),
      T("PE \u00b7 Foundation \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
    ]}), { shading: SHADE_HEAD })]})]
  }));

  // ELEMENT 4 — Supported Application (We do → You do) header
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ children: [T("ELEMENT 4 \u2014 SUPPORTED APPLICATION (WE DO \u2192 YOU DO)", { bold: true, size: 18 })] }), { shading: SHADE_VTLM })]})]
  }));

  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [planLW, planBW],
    rows: [
      planRow("Practice (We do)", [small("Activity script: see page 1, phase 3.", { italics: true })]),
      planRow("Sentence stems (during practice)", [
        bullet("\u201CI'm freezing in 3 steps because \u2026\u201D"),
        bullet("\u201CMy partner is safe because \u2026\u201D"),
      ]),
      planRow("Check for understanding (CFU 2)", [tokenLine("Mid-practice freeze: \u201CHands up if you stopped in 3 steps. Hands up if you needed more.\u201D Adjust before continuing.")]),
      planRow("Application (You do)", [small("Activity script: see page 1, phase 4 (Traffic Lights).", { italics: true })]),
    ]
  }));

  // Tier 1 / Tier 2 / Tier 3 task differentiation (NEW)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col3, col3, CONTENT_W - 2*col3],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("TIER 1 \u2014 modified task"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("CORE \u2014 main task"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("TIER 3 \u2014 extension task"), { width: CONTENT_W - 2*col3, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([
          bullet("Walk-only Traffic Lights"),
          bullet("Smaller boundary"),
          bullet("Partnered with adult / strong peer"),
          bullet("3-step stop only \u2014 no direction change"),
        ], { width: col3 }),
        cell([
          bullet("Full Traffic Lights as scripted"),
          bullet("Jog \u00b7 walk \u00b7 freeze in 3 steps"),
          bullet("Eyes up + change direction"),
          bullet("Take a turn as caller"),
        ], { width: col3 }),
        cell([
          bullet("Freeze in a balanced shape (one foot, low crouch)"),
          bullet("Lead Traffic Lights as colour caller"),
          bullet("Mirror partner's speed"),
          bullet("Call your own colour before moving"),
        ], { width: CONTENT_W - 2*col3 }),
      ]})
    ]
  }));

  // Reflection / Metacognition / Exit Task
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ children: [T("REFLECTION \u00b7 METACOGNITION \u00b7 EXIT TASK", { bold: true, size: 18 })] }), { shading: SHADE_VTLM })]})]
  }));

  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [planLW, planBW],
    rows: [
      planRow("Cool-down + self-check vs SC", [
        small("See page 1, phase 5. Thumbs up/middle/down for each SC1\u20133."),
        bullet("SC1 eyes up \u2014 thumbs up/middle/down"),
        bullet("SC2 change direction \u2014 thumbs up/middle/down"),
        bullet("SC3 3-step stop \u2014 thumbs up/middle/down"),
      ]),
      planRow("Metacognitive prompts (mandated)", [
        bullet("\u201CWhat helped you most today?\u201D"),
        bullet("\u201CWhat was tricky? What will you try next time?\u201D"),
        bullet("\u201CWhich cue word did you use in your head?\u201D"),
      ]),
      planRow("Retrieval / spaced practice", [tokenLine("Return to 3-step stop cue every Term 2 lesson. Re-test start of W3 + W6.")]),
    ]
  }));

  // Inclusive Practice — priority cohorts (NEW)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ children: [T("INCLUSIVE PRACTICE \u2014 PRIORITY COHORTS", { bold: true, size: 18 })] }), { shading: SHADE_VTLM })]})]
  }));

  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col4, col4, col4, CONTENT_W - 3*col4],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("EAL/D"), { width: col4, shading: SHADE_HEAD }),
        cell(headLine("Koorie students"), { width: col4, shading: SHADE_HEAD }),
        cell(headLine("Students with disability"), { width: col4, shading: SHADE_HEAD }),
        cell(headLine("Students experiencing disadvantage"), { width: CONTENT_W - 3*col4, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([
          small("\u2611 Visual cue cards on belt"),
          small("\u2611 Sentence stems pre-shared"),
          small("\u2611 Pair with bilingual buddy"),
          small("\u2611 Demonstrate, don't only describe"),
        ], { width: col4 }),
        cell([
          small("\u2611 Connect to community/sport"),
          small("\u2611 Yarn circle for reflection"),
          small("\u2611 Acknowledge family knowledge"),
          small("\u2611 Strength-based language"),
        ], { width: col4 }),
        cell([
          small("\u2611 Reduce sensory load (whistle volume)"),
          small("\u2611 Scribed SC self-check"),
          small("\u2611 Movement break option"),
          small("\u2611 ISP / IEP adjustments applied"),
        ], { width: col4 }),
        cell([
          small("\u2611 Equipment provided \u2014 no own kit"),
          small("\u2611 No-cost game variants"),
          small("\u2611 Predictable routine = safety"),
          small("\u2611 Strength noticed and named"),
        ], { width: CONTENT_W - 3*col4 }),
      ]})
    ]
  }));

  // Named Student Adjustments
  const nsCol = Math.floor(CONTENT_W / 3);
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [nsCol, nsCol, CONTENT_W - 2*nsCol],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("Student \u2014 named adjustments"), { width: nsCol, shading: SHADE_HEAD }),
        cell(headLine("Adjustment"), { width: nsCol, shading: SHADE_HEAD }),
        cell(headLine("Support provided"), { width: CONTENT_W - 2*nsCol, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([tokenLine("(eg) Mason", { italics: true })], { width: nsCol }),
        cell([tokenLine("Visual cue card on belt", { italics: true })], { width: nsCol }),
        cell([tokenLine("Laminated 3-step stop pic; teacher checks at each freeze", { italics: true })], { width: CONTENT_W - 2*nsCol }),
      ]}),
      new TableRow({ children: [cell([small(" ")], { width: nsCol }), cell([small(" ")], { width: nsCol }), cell([small(" ")], { width: CONTENT_W - 2*nsCol })]}),
    ]
  }));

  // Assessment & Teacher Reflection
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col2, CONTENT_W - col2],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("ASSESSMENT \u00b7 formative observation"), { width: col2, shading: SHADE_HEAD }),
        cell(headLine("MISCONCEPTIONS TO WATCH FOR"), { width: CONTENT_W - col2, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([
          P({ children: [T("Look-fors:", { bold: true, size: 16 })] }),
          bullet("Eyes up consistently while moving"),
          bullet("Uses 3-step stop (no sliding, no crashing)"),
          bullet("Responds to whistle within 2 seconds"),
        ], { width: col2 }),
        cell([
          bullet("Looking down at feet \u2192 cue \u201Ceyes up\u201D + chest target on far hat"),
          bullet("Sliding stop \u2192 demo plant \u00b7 bend \u00b7 small"),
          bullet("\u201CFreeze\u201D = giggle \u2192 re-set with silent freeze x 3"),
        ], { width: CONTENT_W - col2 }),
      ]})
    ]
  }));

  // Teacher reflection
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [
      new TableRow({ tableHeader: true, children: [cell(headLine("TEACHER REFLECTION \u2014 after the lesson"), { width: CONTENT_W, shading: SHADE_HEAD })]}),
      new TableRow({ children: [cell([
        small("What went well?"),
        small(" "),
        small("What would I adjust next time?"),
        small(" "),
        small("What do students need next?"),
        small(" "),
        small("Follow-up students:"),
      ], { width: CONTENT_W })]})
    ]
  }));

  return new Document({
    creator: "LessonLab",
    title: "WPS PE Lesson Plan v11 \u2014 VTLM 2.0 compliant",
    styles: { default: { document: { run: { font: "Arial", size: 16 } } } },
    numbering: {
      config: [{
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 200 } } } }]
      }]
    },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H, orientation: PageOrientation.PORTRAIT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      headers: {
        default: new Header({ children: [P({ alignment: AlignmentType.RIGHT, children: [
          T("LessonLab \u00b7 v11 \u00b7 VTLM 2.0 \u00b7 ", { size: 14, color: "888888" }),
          T("PE/Foundation/T2W1", { italics: true, color: "B22222", size: 14 })
        ]})] })
      },
      footers: {
        default: new Footer({ children: [P({ alignment: AlignmentType.CENTER, children: [
          T("[School Name] \u00b7 PE \u00b7 Foundation T2W1 \u00b7 VC2.0 \u00b7 VTLM 2.0    Page ", { size: 14, italics: true, color: "B22222" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 14, color: "888888" }),
          T(" of ", { size: 14, color: "888888" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: "888888" })
        ]})] })
      },
      children: ch
    }]
  });
}

const doc = buildDoc();
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(__dirname + "/WPS_PE_Foundation_T2W1_v11.docx", buf);
  console.log("Wrote v11 ->", buf.length, "bytes");
});
