// WPS_Wellbeing_Y1_T2W1_v11.docx — VTLM 2.0 fully mandated
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
        P({ children: [T("Wellbeing \u2014 Lesson Plan", { bold: true, size: 20 })] }),
      ], { width: Math.round(CONTENT_W*0.55), shading: SHADE_HEAD }),
      cell([
        tokenLine("Year level: Year 1", { bold: true }),
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
          P({ children: [T("Naming feelings using the feelings wheel", { bold: true, size: 20 })] }),
          P({ children: [T("VC2HPER1P01 \u00b7 VC2HPER1P03 \u00b7 VC2HPER1S01", { size: 14, color: "888888" })] }),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          bullet("I can name a feeling using the feelings wheel."),
          bullet("I can describe how that feeling feels in my body."),
          bullet("I can think of one thing that helps me when I feel that way."),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          P({ alignment: AlignmentType.CENTER, children: [T("Name it", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Feel it", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("What helps?", { bold: true, size: 22, color: "B22222" })] }),
        ], { width: CONTENT_W - 2*Math.round(CONTENT_W*0.40) }),
      ]})
    ]
  }));

  // Big SIGNAL banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell([
      P({ alignment: AlignmentType.CENTER, children: [
        T("ATTENTION SIGNAL: ", { bold: true, size: 22 }),
        T("1 chime = stop, soft hands", { bold: true, size: 22, color: "B22222" }),
        T("    \u00b7    ", { size: 22 }),
        T("2 chimes = come to circle, kind face", { bold: true, size: 22, color: "B22222" }),
      ]}),
      P({ alignment: AlignmentType.CENTER, children: [T("Practise the chime x 3 at start. Show me kind face.", { italics: true, size: 16 })] }),
    ], { shading: SHADE_BANNER })]})]
  }));

  // Equipment + Entry + Exit (3 cols)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col3, col3, CONTENT_W - 2*col3],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("RESOURCES"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("ENTRY"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("EXIT"), { width: CONTENT_W - 2*col3, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([
          bullet("Feelings wheel (1 large for board, 1 per student)"),
          bullet("Sticky notes (3 per student)"),
          bullet("Picture cards (5 emotion faces)"),
          bullet("Wellbeing journal (1 per student)"),
          bullet("Calm-corner cushions (back of room)"),
        ], { width: col3 }),
        cell([
          bullet("Enter, sit on carpet in circle."),
          bullet("Hands on knees, kind face."),
          bullet("Wait for chime before check-in."),
        ], { width: col3 }),
        cell([
          bullet("Wheel + sticky note to journal."),
          bullet("Sit back in circle for share."),
          bullet("Walk back to class teacher quietly."),
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
        cell(P({ alignment: AlignmentType.CENTER, children: [T("1. CHECK-IN", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("2. SKILL MODELLED", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("3. PAIR PRACTICE", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("4. APPLICATION SCENARIO", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("5. REFLECTION CIRCLE", { bold: true, size: 18 })] }), { width: CONTENT_W - 4*col5, shading: SHADE_PHASE }),
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
      phRow("CHECK-IN", "6", [
        bigBullet("Each student picks one emotion face card. Holds it up."),
        bigBullet("Teacher names the emotion if student wants help."),
        bigBullet("No \u201Cwhy\u201D today \u2014 just name and notice."),
        sayLine("\u201C\u201CFeelings are not good or bad \u2014 they are messages. Today we learn to name them.\u201D\u201D")
      ]),
      phRow("SKILL MODELLED (I do)", "10", [
        bigBullet("Show big feelings wheel. Centre = 6 main feelings, outer = words."),
        bigBullet("Teacher tells a story (a small one) and lands on a feeling word."),
        bigBullet("Demo: \u201CMy hands felt tight. That\u2019s frustrated.\u201D"),
        P({ spacing: { before: 0, after: 30 }, children: [T("Cue words: ", { bold: true, size: 18 }), T("Name it \u00b7 Feel it \u00b7 What helps?", { bold: true, size: 18, color: "B22222" })] })
      ]),
      phRow("PAIR PRACTICE (We do)", "15", [
        bigBullet("Pairs share one small feeling using the wheel."),
        bigBullet("Listener nods \u2014 no fixing, no judging."),
        bigBullet("Swap. Praise specific kind listening."),
        sayLine("\u201C\u201CName the feeling. Feel where it is. One thing that helps.\u201D\u201D")
      ]),
      phRow("SCENARIO (You do)", "15", [
        bigBullet("Card on the floor: \u201CAt break, I missed catching the ball.\u201D Pairs name a feeling."),
        bigBullet("Write the feeling word on a sticky note. Stick it in your journal."),
        bigBullet("Tier choice on what 2 helps strategies to add."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Tier choice: ", { bold: true, size: 18 }), T("Tier 1 (point to wheel) \u00b7 Core (write word + 1 helper) \u00b7 Tier 3 (write feeling + 2 helpers + body sensation)", { italics: true, size: 18 })] })
      ]),
      phRow("REFLECTION CIRCLE", "4", [
        bigBullet("Sit in circle. Place sticky note on the wheel (anonymous)."),
        bigBullet("Notice the cluster \u2014 where do feelings land for our class?"),
        sayLine("\u201C\u201CFeelings are messages. Today you named them. Tomorrow we learn what helps each one.\u201D\u201D")
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
          bullet("Chime \u2192 calmly name what you saw. Kind voice."),
          bullet("Re-model the safe-space rule. Restart."),
          bullet("Repeat \u2192 calm corner cushion 1 min, then re-join."),
          bullet("Big feelings? Calm corner is OK. Sit beside teacher."),
        ], { width: col3 }),
        cell([
          bullet("Use picture cards instead of wheel words"),
          bullet("Point to feeling instead of saying it"),
          bullet("Adult shares first to model bravery"),
        ], { width: col3 }),
        cell([
          bullet("Wellbeing journals stay in tray."),
          bullet("Note any students who used calm corner."),
          bullet("Two lines, walking back. Walk back to class teacher quietly."),
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
      T("Wellbeing \u00b7 Year 1 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
      planRow("Lesson focus", [tokenLine("Naming feelings using the feelings wheel")]),
      planRow("Curriculum (VC2.0)", [
        tokenLine("VC2HPER1P01 \u00b7 VC2HPER1P03 \u00b7 VC2HPER1S01"),
        tokenLine("Identifying emotions \u00b7 Self-awareness \u00b7 Personal vocabulary", { italics: true })
      ]),
      planRow("Where students are at", [
        bullet("Term 1 covered happy / sad / angry / scared."),
        bullet("Most can name 4-5 feelings."),
        bullet("Some confuse feelings and behaviours \u2014 this lesson clarifies."),
      ]),
      planRow("Sequence (this term)", [
        tokenLine("W1 (today) \u00b7 W2 strategies for big feelings \u00b7 W3 helping a friend \u00b7 W4 our class agreement \u00b7 W5 review"),
      ]),
      planRow("Resources prepared", [tokenLine("Feelings wheels printed. Calm corner set up. Journals at tray.")]),
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
      planRow("Learning Intention", [tokenLine("We are learning to name a feeling using the feelings wheel and notice where it is in our body.", { italics: true, color: "B22222" })]),
      planRow("Success Criteria", [
        tokenLine("SC1  I can name a feeling using the feelings wheel."),
        tokenLine("SC2  I can describe how that feeling feels in my body."),
        tokenLine("SC3  I can think of one thing that helps me when I feel that way."),
      ]),
      planRow("Why this matters", [tokenLine("Naming a feeling is the first step in regulating it. Year 1 is when emotional vocabulary takes off \u2014 this lesson seeds 6 weeks of growth.", { italics: true })]),
      planRow("Vocabulary (3 tiers)", [
        small("\u2022 Tier 1 (everyday): happy, sad, angry, scared, tired"),
        small("\u2022 Tier 2 (lesson):  feeling, calm, frustrated, proud, worried, surprised"),
        small("\u2022 Tier 3 (Wellbeing):    regulation, sensation, message, awareness"),
      ]),
      planRow("Routines & engagement", [
        bullet("Same entry \u2192 circle \u2192 chime \u2192 check-in every lesson."),
        bullet("Predictable structure builds psychological safety."),
      ]),
      planRow("Self-regulation prompts", [
        bullet("\u201C\u201CWhere does this feeling live in your body?\u201D\u201D"),
        bullet("\u201C\u201CWhat helps when this feeling is big?\u201D\u201D"),
        bullet("\u201C\u201CCan you ask for help when you need it?\u201D\u201D"),
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
      planRow("Focus the learning", [tokenLine("State LI + SC. Show cue words. \u201CToday we name feelings using the wheel.\u201D")]),
      planRow("Explanation & modelling (chunked)", [
        small("Chunk 1: Chunk 1 (3 min): Show feelings wheel. Name 6 main feelings."),
        small("Chunk 2: Chunk 2 (3 min): Tell a small story \u2014 land on \u2018frustrated\u2019. Name body sensation."),
        small("Chunk 3: Chunk 3 (4 min): Repeat with another story \u2014 \u2018proud\u2019. Pick 2 students to model."),
      ]),
      planRow("Worked example / modelled exemplar", [
        small("(modelled exemplar: teacher tells a real-but-small story, points to feeling on wheel, points to body part where they felt it.)"),
        small(""),
        small(""),
      ]),
      planRow("Sentence stems for student response", [
        bullet("\u201C\u201CI felt \u2026 because \u2026\u201D\u201D"),
        bullet("\u201C\u201CIt was in my \u2026 (body part).\u201D\u201D"),
        bullet("\u201C\u201CWhat helped was \u2026\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 1)", [tokenLine("Show me a feeling face for: happy / worried / proud. Point to where it lives in your body.")]),
    ]
  }));

  // ===================== PAGE 3 — VTLM 2.0 ELEMENT 4 + REFLECTION + INCLUSIVE + ASSESSMENT =====================
  ch.push(P({ children: [new PageBreak()] }));

  // Page 3 banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ alignment: AlignmentType.CENTER, children: [
      T("VTLM 2.0 SPECIALIST DETAIL \u2014 ", { bold: true, size: 20 }),
      T("Wellbeing \u00b7 Year 1 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
        bullet("\u201C\u201CMy feeling lives in my \u2026\u201D\u201D"),
        bullet("\u201C\u201COne thing that helps me is \u2026\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 2)", [tokenLine("Mid-pair check: thumb-meter on feelings wheel \u2014 do you see your feeling on it? If not, calm-corner.")]),
      planRow("Application (You do)", [small("Activity script: see page 1, phase 4 (SCENARIO (You do)).", { italics: true })]),
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
          bullet("Point to feeling on wheel (no words needed)"),
          bullet("Use picture cards instead"),
          bullet("Adult sits beside"),
          bullet("1 helper strategy is enough"),
        ], { width: col3 }),
        cell([
          bullet("Name feeling using wheel words"),
          bullet("Note body location"),
          bullet("Write 1 helper strategy"),
          bullet("Use cue words during pair share"),
        ], { width: col3 }),
        cell([
          bullet("Use 2-word feelings (e.g. \u201Cfrustrated and proud\u201D)"),
          bullet("Write 2 helper strategies"),
          bullet("Help a peer name their feeling"),
          bullet("Identify the feeling under another feeling"),
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
        bullet("SC1 named a feeling \u2014 thumbs up/middle/down"),
        bullet("SC2 where in body \u2014 thumbs up/middle/down"),
        bullet("SC3 one helper \u2014 thumbs up/middle/down"),
      ]),
      planRow("Metacognitive prompts (mandated)", [
        bullet("\u201C\u201CWhich feeling is hardest to name? Why?\u201D\u201D"),
        bullet("\u201C\u201CWhat happens when you name a feeling?\u201D\u201D"),
        bullet("\u201C\u201CWho can you ask for help if a feeling is big?\u201D\u201D"),
      ]),
      planRow("Retrieval / spaced practice", [tokenLine("Use the feelings wheel at every Term 2 wellbeing check-in. Add 2 new words per week to wall.")]),
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
          small("\u2611 Translated wheel for home language"),
          small("\u2611 Picture cards primary, words secondary"),
          small("\u2611 Pair with bilingual peer"),
          small("\u2611 Demonstrate, don\u2019t only describe"),
        ], { width: col4 }),
        cell([
          small("\u2611 Yarn circle for safe sharing"),
          small("\u2611 Connect to family wellbeing practices"),
          small("\u2611 Acknowledge community / family"),
          small("\u2611 Strength-based feedback"),
        ], { width: col4 }),
        cell([
          small("\u2611 Reduce sensory load (chime softer)"),
          small("\u2611 Visual + tactile wheel"),
          small("\u2611 Calm-corner break any time"),
          small("\u2611 ISP / IEP adjustments applied"),
        ], { width: col4 }),
        cell([
          small("\u2611 Wheel + journal provided"),
          small("\u2611 No-cost calm-corner cushions"),
          small("\u2611 Predictable rhythm = safety"),
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
        cell([tokenLine("(eg) (eg) Charlie", { italics: true })], { width: nsCol }),
        cell([tokenLine("Picture cards + adult close by", { italics: true })], { width: nsCol }),
        cell([tokenLine("EA sits beside; gentle prompts; calm-corner if needed", { italics: true })], { width: CONTENT_W - 2*nsCol }),
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
          bullet("Names a feeling using wheel words"),
          bullet("Identifies a body location for the feeling"),
          bullet("Names a strategy that helps"),
        ], { width: col2 }),
        cell([
          bullet("Confuses feeling with behaviour (\u201Cangry = hit\u201D) \u2192 separate feeling from action"),
          bullet("Says \u2018good/bad\u2019 instead of feeling \u2192 redirect to wheel words"),
          bullet("Avoids \u2018big\u2019 feelings \u2192 normalise + offer calm corner"),
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
    title: "WPS Wellbeing Lesson Plan v11 \u2014 VTLM 2.0 compliant",
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
          T("Wellbeing/Year 1/T2W1", { italics: true, color: "B22222", size: 14 })
        ]})] })
      },
      footers: {
        default: new Footer({ children: [P({ alignment: AlignmentType.CENTER, children: [
          T("[School Name] \u00b7 Wellbeing \u00b7 Year 1 T2W1 \u00b7 VC2.0 \u00b7 VTLM 2.0    Page ", { size: 14, italics: true, color: "B22222" }),
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
  fs.writeFileSync(__dirname + "/WPS_Wellbeing_Y1_T2W1_v11.docx", buf);
  console.log("Wrote v11 ->", buf.length, "bytes");
});
