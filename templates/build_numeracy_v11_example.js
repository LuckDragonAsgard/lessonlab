// WPS_Numeracy_Y3_T2W1_v11.docx — VTLM 2.0 fully mandated
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
        P({ children: [T("Numeracy \u2014 Lesson Plan", { bold: true, size: 20 })] }),
      ], { width: Math.round(CONTENT_W*0.55), shading: SHADE_HEAD }),
      cell([
        tokenLine("Year level: Year 3", { bold: true }),
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
          P({ children: [T("Adding 2-digit numbers using bridging through 10", { bold: true, size: 20 })] }),
          P({ children: [T("VC2M3N03 \u00b7 VC2M3N04 \u00b7 VC2M3N06", { size: 14, color: "888888" })] }),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          bullet("I can add 2-digit numbers using bridging through 10."),
          bullet("I can record my strategy clearly with numbers and a number line."),
          bullet("I can check my answer using a different strategy."),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          P({ alignment: AlignmentType.CENTER, children: [T("Bridge to 10", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Tens + ones", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Check it", { bold: true, size: 22, color: "B22222" })] }),
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
        T("1 bell = pencils down, eyes up", { bold: true, size: 22, color: "B22222" }),
        T("    \u00b7    ", { size: 22 }),
        T("2 bells = whiteboards on knee, listen", { bold: true, size: 22, color: "B22222" }),
      ]}),
      P({ alignment: AlignmentType.CENTER, children: [T("Practise the signal x 3 at start. Match teacher\u2019s pace.", { italics: true, size: 16 })] }),
    ], { shading: SHADE_BANNER })]})]
  }));

  // Equipment + Entry + Exit (3 cols)
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [col3, col3, CONTENT_W - 2*col3],
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell(headLine("MATERIALS"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("ENTRY"), { width: col3, shading: SHADE_HEAD }),
        cell(headLine("EXIT"), { width: CONTENT_W - 2*col3, shading: SHADE_HEAD }),
      ]}),
      new TableRow({ children: [
        cell([
          bullet("Whiteboards + markers (1 per pair)"),
          bullet("MAB blocks (tens + ones, 1 set per pair)"),
          bullet("Number line strip (0\u2013100, laminated)"),
          bullet("Place value chart on board"),
          bullet("Exit ticket sheet (1 per student)"),
        ], { width: col3 }),
        cell([
          bullet("Enter, sit at desks. Whiteboards out."),
          bullet("Pencils down, eyes up."),
          bullet("Wait for silence before number talk."),
        ], { width: col3 }),
        cell([
          bullet("Whiteboards to bin. MAB to tray."),
          bullet("Exit ticket on teacher\u2019s desk on the way out."),
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
        cell(P({ alignment: AlignmentType.CENTER, children: [T("1. NUMBER TALK", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("2. WORKED EXAMPLE", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("3. GUIDED PRACTICE", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("4. INDEPENDENT PROBLEM", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("5. SHARE STRATEGIES", { bold: true, size: 18 })] }), { width: CONTENT_W - 4*col5, shading: SHADE_PHASE }),
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
      phRow("NUMBER TALK", "6", [
        bigBullet("Show 28 + 7. Pairs whisper a strategy on whiteboards."),
        bigBullet("Choose 2 students to share. Annotate strategies on board."),
        bigBullet("Highlight bridging through 10 if it appears. If not, model it."),
        sayLine("\u201C\u201CMathematicians use strategies. Today\u2019s strategy: bridging through 10.\u201D\u201D")
      ]),
      phRow("WORKED EXAMPLE (I do)", "10", [
        bigBullet("Demo 47 + 26. Step 1: split 26 into 3 + 23 (so 47 + 3 = 50). Step 2: 50 + 23 = 73."),
        bigBullet("Show NON-example: lining up + carrying without place-value language. Discuss."),
        bigBullet("Repeat with 38 + 25 \u2014 think aloud the bridge."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Cue words: ", { bold: true, size: 18 }), T("Bridge to 10 \u00b7 Tens + ones \u00b7 Check it", { bold: true, size: 18, color: "B22222" })] })
      ]),
      phRow("GUIDED PRACTICE (We do)", "15", [
        bigBullet("Together: 56 + 28. Pairs talk first, share strategy. Teacher scribes."),
        bigBullet("Try 39 + 47. Stop midway \u2014 \u201Cwhat\u2019s our bridge?\u201D Adjust."),
        bigBullet("Praise specific strategy choices by name."),
        sayLine("\u201C\u201CBridge to 10. Tens + ones. Check it.\u201D\u201D")
      ]),
      phRow("INDEPENDENT PROBLEM (You do)", "15", [
        bigBullet("Solve 4 problems on the worksheet. Show your strategy with a number line."),
        bigBullet("Tier 1 / Core / Tier 3 (see page 3)."),
        bigBullet("Teacher confers with 5 priority students."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Tier choice: ", { bold: true, size: 18 }), T("Tier 1 (single-digit + 2-digit) \u00b7 Core (2-digit + 2-digit no carry beyond 100) \u00b7 Tier 3 (3-step with checking)", { italics: true, size: 18 })] })
      ]),
      phRow("SHARE STRATEGIES", "4", [
        bigBullet("Pencils down. 2 students share their strategy on the board."),
        bigBullet("Thumbs up/middle/down for each SC."),
        sayLine("\u201C\u201CYou used bridging through 10 today. Tomorrow we add 3-digit numbers using the same idea.\u201D\u201D")
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
          bullet("Signal \u2192 calmly name what you saw."),
          bullet("Re-model expectation. Restart problem."),
          bullet("Repeat \u2192 sit out 1 min, re-join."),
          bullet("Refusing to write? Verbalise + adult scribes."),
        ], { width: col3 }),
        cell([
          bullet("Reduce to 1 problem with MAB blocks shown"),
          bullet("Provide a worked example card"),
          bullet("Pair with strong peer for talk-aloud"),
        ], { width: col3 }),
        cell([
          bullet("Leave sheet on classroom teacher\u2019s desk."),
          bullet("Note any students who got <2/4 on exit ticket."),
          bullet("Whiteboards + MAB returned to maths corner."),
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
      T("Numeracy \u00b7 Year 3 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
      planRow("Lesson focus", [tokenLine("Adding 2-digit numbers using bridging through 10")]),
      planRow("Curriculum (VC2.0)", [
        tokenLine("VC2M3N03 \u00b7 VC2M3N04 \u00b7 VC2M3N06"),
        tokenLine("Number \u00b7 Place value \u00b7 Mental strategies \u00b7 Multi-step problems", { italics: true })
      ]),
      planRow("Where students are at", [
        bullet("Term 1 covered 2-digit + 1-digit no regrouping."),
        bullet("Most can add to 100 with concrete supports."),
        bullet("Some still rely on counting on \u2014 need bridging strategy."),
      ]),
      planRow("Sequence (this term)", [
        tokenLine("W1 (today) \u00b7 W2 same with subtraction \u00b7 W3 3-digit + 2-digit \u00b7 W4 word problems \u00b7 W5 mixed review"),
      ]),
      planRow("Resources prepared", [tokenLine("MAB sets at each table. Worksheet printed + differentiated by tier. Number line strip on each desk.")]),
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
      planRow("Learning Intention", [tokenLine("We are learning to add 2-digit numbers using bridging through 10.", { italics: true, color: "B22222" })]),
      planRow("Success Criteria", [
        tokenLine("SC1  I can add 2-digit numbers using bridging through 10."),
        tokenLine("SC2  I can record my strategy clearly with numbers and a number line."),
        tokenLine("SC3  I can check my answer using a different strategy."),
      ]),
      planRow("Why this matters", [tokenLine("Bridging through 10 is a foundational mental-strategy that scales to all multi-digit addition. Without it, students rely on slow counting or rote algorithms with no understanding.", { italics: true })]),
      planRow("Vocabulary (3 tiers)", [
        small("\u2022 Tier 1 (everyday): add, take, count, more, less"),
        small("\u2022 Tier 2 (lesson):  sum, equals, regroup, bridge, jump, strategy"),
        small("\u2022 Tier 3 (Numeracy):    place value, partition, decompose, commutative property"),
      ]),
      planRow("Routines & engagement", [
        bullet("Same entry \u2192 desks \u2192 whiteboards \u2192 number talk every lesson."),
        bullet("Predictable structure reduces cognitive load (4 Elements of Learning \u2014 attention)."),
      ]),
      planRow("Self-regulation prompts", [
        bullet("\u201C\u201CWhich number is closer to a tens number? Use that one to bridge.\u201D\u201D"),
        bullet("\u201C\u201CHow will you check if your answer is reasonable?\u201D\u201D"),
        bullet("\u201C\u201CWhat will you try if your first strategy doesn\u2019t work?\u201D\u201D"),
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
      planRow("Focus the learning", [tokenLine("State LI + SC. Show cue words on board. \u201CToday we use the bridge-to-10 strategy to add 2-digit numbers.\u201D")]),
      planRow("Explanation & modelling (chunked)", [
        small("Chunk 1: Chunk 1 (3 min): Demo 47 + 26 \u2014 split 26 into 3 + 23, so 47 + 3 = 50, then 50 + 23 = 73."),
        small("Chunk 2: Chunk 2 (3 min): Show non-example without place-value language. Ask \u201Cwhat\u2019s missing?\u201D"),
        small("Chunk 3: Chunk 3 (4 min): Repeat with 38 + 25, then 56 + 27. Pick 2 students to demo their bridge."),
      ]),
      planRow("Worked example / modelled exemplar", [
        small("(modelled exemplar: 47 + 26 = 73 with number-line jumps drawn — teacher annotates each step. Photo of board.)"),
        small(""),
        small(""),
      ]),
      planRow("Sentence stems for student response", [
        bullet("\u201C\u201CI bridged at \u2026 because \u2026\u201D\u201D"),
        bullet("\u201C\u201CMy tens are \u2026 and my ones are \u2026\u201D\u201D"),
        bullet("\u201C\u201CI checked by \u2026\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 1)", [tokenLine("\u201CWhiteboards: show me how you\u2019d split 26 to bridge to 10 from 47.\u201D \u00b7 \u201CThumbs if you\u2019re ready.\u201D")]),
    ]
  }));

  // ===================== PAGE 3 — VTLM 2.0 ELEMENT 4 + REFLECTION + INCLUSIVE + ASSESSMENT =====================
  ch.push(P({ children: [new PageBreak()] }));

  // Page 3 banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ alignment: AlignmentType.CENTER, children: [
      T("VTLM 2.0 SPECIALIST DETAIL \u2014 ", { bold: true, size: 20 }),
      T("Numeracy \u00b7 Year 3 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
        bullet("\u201C\u201CI bridged at \u2026 because that gets me to a tens number.\u201D\u201D"),
        bullet("\u201C\u201CMy strategy was \u2026 and I checked by \u2026\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 2)", [tokenLine("Mid-practice freeze: \u201CWhiteboards \u2014 show me your bridge for 39 + 47.\u201D Adjust based on responses.")]),
      planRow("Application (You do)", [small("Activity script: see page 1, phase 4 (INDEPENDENT PROBLEM (You do)).", { italics: true })]),
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
          bullet("1-digit + 2-digit (e.g. 8 + 24)"),
          bullet("MAB blocks visible at desk"),
          bullet("Worked example card on hand"),
          bullet("Verbal answers OK \u2014 adult scribes"),
        ], { width: col3 }),
        cell([
          bullet("4 problems: 2-digit + 2-digit, sums under 100"),
          bullet("Show strategy with number line"),
          bullet("Check at least one with a different method"),
          bullet("Stuck? Use cue words on the board."),
        ], { width: col3 }),
        cell([
          bullet("Sums over 100 (e.g. 67 + 58)"),
          bullet("Word problems requiring 2 steps"),
          bullet("Find an error in a peer\u2019s work and explain the fix"),
          bullet("Write your own bridging problem for the class"),
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
        bullet("SC1 bridging through 10 \u2014 thumbs up/middle/down"),
        bullet("SC2 showing my strategy \u2014 thumbs up/middle/down"),
        bullet("SC3 checking with a different way \u2014 thumbs up/middle/down"),
      ]),
      planRow("Metacognitive prompts (mandated)", [
        bullet("\u201C\u201CWhich part was hardest \u2014 the bridge or the check?\u201D\u201D"),
        bullet("\u201C\u201CWhat made bridging easier today than counting on?\u201D\u201D"),
        bullet("\u201C\u201CWhich cue did you say in your head as you worked?\u201D\u201D"),
      ]),
      planRow("Retrieval / spaced practice", [tokenLine("Return to bridging through 10 in every Term 2 lesson. Re-test on exit ticket W3 + W6.")]),
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
          small("\u2611 Number cards + visual on desk"),
          small("\u2611 Sentence frames pre-shared"),
          small("\u2611 Pair with bilingual peer"),
          small("\u2611 Demonstrate, don\u2019t only describe"),
        ], { width: col4 }),
        cell([
          small("\u2611 Connect to family counting / yarning"),
          small("\u2611 Yarn circle for share-back"),
          small("\u2611 Acknowledge family knowledge"),
          small("\u2611 Strength-based feedback"),
        ], { width: col4 }),
        cell([
          small("\u2611 Reduce visual clutter on board"),
          small("\u2611 Scribed by adult / typed"),
          small("\u2611 Movement break option"),
          small("\u2611 ISP / IEP adjustments applied"),
        ], { width: col4 }),
        cell([
          small("\u2611 Whiteboard + pencil provided"),
          small("\u2611 No-cost manipulatives"),
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
        cell([tokenLine("(eg) (eg) Tariq", { italics: true })], { width: nsCol }),
        cell([tokenLine("MAB blocks + worked-example card", { italics: true })], { width: nsCol }),
        cell([tokenLine("Adult scribes for first 2 problems; checks at midway", { italics: true })], { width: CONTENT_W - 2*nsCol }),
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
          bullet("Bridges through 10 explicitly named"),
          bullet("Records strategy on number line"),
          bullet("Uses \u2018check it\u2019 cue (different method)"),
        ], { width: col2 }),
        cell([
          bullet("Stuck in counting-on \u2192 model 2 bridges side-by-side; show speed difference"),
          bullet("Splits incorrectly (e.g. 26 \u2192 5 + 21) \u2192 ask \u201Cwhat takes 47 to a tens number?\u201D"),
          bullet("Doesn\u2019t check \u2192 add \u201Ccheck it\u201D as a 4th cue word"),
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
    title: "WPS Numeracy Lesson Plan v11 \u2014 VTLM 2.0 compliant",
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
          T("Numeracy/Year 3/T2W1", { italics: true, color: "B22222", size: 14 })
        ]})] })
      },
      footers: {
        default: new Footer({ children: [P({ alignment: AlignmentType.CENTER, children: [
          T("[School Name] \u00b7 Numeracy \u00b7 Year 3 T2W1 \u00b7 VC2.0 \u00b7 VTLM 2.0    Page ", { size: 14, italics: true, color: "B22222" }),
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
  fs.writeFileSync(__dirname + "/WPS_Numeracy_Y3_T2W1_v11.docx", buf);
  console.log("Wrote v11 ->", buf.length, "bytes");
});
