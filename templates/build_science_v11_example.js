// WPS_Science_Y5_T2W1_v11.docx — VTLM 2.0 fully mandated
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
        P({ children: [T("Science \u2014 Lesson Plan", { bold: true, size: 20 })] }),
      ], { width: Math.round(CONTENT_W*0.55), shading: SHADE_HEAD }),
      cell([
        tokenLine("Year level: Year 5", { bold: true }),
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
          P({ children: [T("States of matter: solid, liquid, gas", { bold: true, size: 20 })] }),
          P({ children: [T("VC2SCH5C01 \u00b7 VC2SCH5C02 \u00b7 VC2SCH5S03", { size: 14, color: "888888" })] }),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          bullet("I can sort 5 examples into solid, liquid, and gas."),
          bullet("I can describe how particles move in each state."),
          bullet("I can predict what happens when a state changes."),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          P({ alignment: AlignmentType.CENTER, children: [T("Solid / liquid / gas", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Particles move", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Reversible change", { bold: true, size: 22, color: "B22222" })] }),
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
        T("1 bell = hands off, eyes up", { bold: true, size: 22, color: "B22222" }),
        T("    \u00b7    ", { size: 22 }),
        T("2 bells = come to demo bench", { bold: true, size: 22, color: "B22222" }),
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
          bullet("Ice cubes in tray (1 per group)"),
          bullet("Water in jug"),
          bullet("Balloon (sealed gas) per group"),
          bullet("Sort cards (10 examples)"),
          bullet("Lab journal (1 per student)"),
        ], { width: col3 }),
        cell([
          bullet("Enter, sit at lab benches."),
          bullet("Hands flat, materials at centre."),
          bullet("Wait for safety brief before touching."),
        ], { width: col3 }),
        cell([
          bullet("Materials returned to tray."),
          bullet("Hands washed."),
          bullet("Lab journal in tray. Roll to class teacher."),
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
        cell(P({ alignment: AlignmentType.CENTER, children: [T("1. HOOK QUESTION", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("2. EXPLICIT TEACHING", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("3. GUIDED INVESTIGATION", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("4. INDEPENDENT SORT", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
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
      phRow("HOOK", "6", [
        bigBullet("Show ice / water / steam (kettle). \u201CWhat\u2019s the same? Different?\u201D"),
        bigBullet("Pairs whisper hypothesis on whiteboards."),
        bigBullet("Share 2-3. Don\u2019t correct \u2014 say \u201Clet\u2019s investigate\u201D."),
        sayLine("\u201C\u201CScientists ask questions about what they see. Today\u2019s question: how is matter arranged?\u201D\u201D")
      ]),
      phRow("EXPLICIT TEACHING (I do)", "10", [
        bigBullet("Define solid (fixed shape), liquid (takes container shape), gas (fills space)."),
        bigBullet("Draw particle diagram for each. Particles in solid: tight + ordered. Liquid: close + sliding. Gas: spread + fast."),
        bigBullet("Show non-example: \u201Cmist\u201D \u2014 is it gas or liquid? Discuss."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Cue words: ", { bold: true, size: 18 }), T("Solid \u00b7 Liquid \u00b7 Gas \u00b7 Particles move", { bold: true, size: 18, color: "B22222" })] })
      ]),
      phRow("GUIDED INVESTIGATION (We do)", "15", [
        bigBullet("Each group: observe ice cube melt for 5 min. Record temperature + state."),
        bigBullet("Predict: what state will the puddle become if we leave it?"),
        bigBullet("Discuss reversible change. Praise specific observations."),
        sayLine("\u201C\u201CSolid melts to liquid. Liquid evaporates to gas. Reversible change.\u201D\u201D")
      ]),
      phRow("INDEPENDENT SORT (You do)", "15", [
        bigBullet("Sort 10 cards into S/L/G."),
        bigBullet("Tier choice on extension."),
        bigBullet("Teacher confers with 5 priority students."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Tier choice: ", { bold: true, size: 18 }), T("Tier 1 (5 cards into S/L/G) \u00b7 Core (10 cards + draw particle diagram for one) \u00b7 Tier 3 (predict state changes for 3 examples)", { italics: true, size: 18 })] })
      ]),
      phRow("SHARE", "4", [
        bigBullet("Pencils down. 2 students share their hardest sort."),
        bigBullet("Thumbs up/middle/down for each SC."),
        sayLine("\u201C\u201CMatter has 3 states. Particles move differently in each. Tomorrow we explore plasma.\u201D\u201D")
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
          bullet("Signal \u2192 calmly name what you saw. Hands off materials."),
          bullet("Re-model expectation. Restart investigation."),
          bullet("Repeat \u2192 sit out 1 min, observation only."),
          bullet("Mishandling materials? Materials away. Stand back."),
        ], { width: col3 }),
        cell([
          bullet("Use simpler 5-card sort"),
          bullet("Provide labelled diagram"),
          bullet("Pair with strong observer"),
        ], { width: col3 }),
        cell([
          bullet("Materials back to lab cupboard."),
          bullet("Note any students who got <3/5 sorts right."),
          bullet("Two lines, walking back. Lab journal in tray. Roll to class teacher."),
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
      T("Science \u00b7 Year 5 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
      planRow("Lesson focus", [tokenLine("States of matter: solid, liquid, gas")]),
      planRow("Curriculum (VC2.0)", [
        tokenLine("VC2SCH5C01 \u00b7 VC2SCH5C02 \u00b7 VC2SCH5S03"),
        tokenLine("Chemical sciences \u00b7 Particle theory \u00b7 Reversible change", { italics: true })
      ]),
      planRow("Where students are at", [
        bullet("Term 1 covered properties of materials."),
        bullet("Most know solid + liquid; gas less concrete."),
        bullet("Some confuse melting with dissolving \u2014 watch for this."),
      ]),
      planRow("Sequence (this term)", [
        tokenLine("W1 (today) \u00b7 W2 changes of state with heat \u00b7 W3 mass conservation \u00b7 W4 mixtures \u00b7 W5 mini-investigation"),
      ]),
      planRow("Resources prepared", [tokenLine("Ice tray cleared. Sort cards laminated. Demo kettle safe.")]),
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
      planRow("Learning Intention", [tokenLine("We are learning to identify states of matter and how particles move in each.", { italics: true, color: "B22222" })]),
      planRow("Success Criteria", [
        tokenLine("SC1  I can sort 5 examples into solid, liquid, and gas."),
        tokenLine("SC2  I can describe how particles move in each state."),
        tokenLine("SC3  I can predict what happens when a state changes."),
      ]),
      planRow("Why this matters", [tokenLine("States of matter is the gateway to chemistry. Understanding particle behaviour underpins everything from cooking to climate change.", { italics: true })]),
      planRow("Vocabulary (3 tiers)", [
        small("\u2022 Tier 1 (everyday): ice, water, steam, hot, cold"),
        small("\u2022 Tier 2 (lesson):  solid, liquid, gas, particle, state, melt"),
        small("\u2022 Tier 3 (Science):    evaporation, condensation, sublimation, kinetic"),
      ]),
      planRow("Routines & engagement", [
        bullet("Same entry \u2192 lab bench \u2192 hands flat \u2192 brief every lesson."),
        bullet("Predictable safety routine = focus on science."),
      ]),
      planRow("Self-regulation prompts", [
        bullet("\u201C\u201CHow will you check if your sort is right?\u201D\u201D"),
        bullet("\u201C\u201CWhat\u2019s your strategy when you\u2019re unsure?\u201D\u201D"),
        bullet("\u201C\u201CWhy might 2 scientists disagree on a sort?\u201D\u201D"),
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
      planRow("Focus the learning", [tokenLine("State LI + SC. Show cue words. \u201CToday we sort matter into solid, liquid, gas \u2014 and explain why.\u201D")]),
      planRow("Explanation & modelling (chunked)", [
        small("Chunk 1: Chunk 1 (3 min): Define each state. Use ice/water/steam as anchor."),
        small("Chunk 2: Chunk 2 (3 min): Draw particle diagram for each. Discuss arrangement + motion."),
        small("Chunk 3: Chunk 3 (4 min): Non-example \u2014 mist. Class discussion."),
      ]),
      planRow("Worked example / modelled exemplar", [
        small("(modelled exemplar: 3-state particle diagram on board with ice/water/steam beside it. Teacher annotates particle motion.)"),
        small(""),
        small(""),
      ]),
      planRow("Sentence stems for student response", [
        bullet("\u201C\u201CThis is a [state] because particles \u2026\u201D\u201D"),
        bullet("\u201C\u201CWhen heated, this will \u2026\u201D\u201D"),
        bullet("\u201C\u201CI predict \u2026 because \u2026\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 1)", [tokenLine("Whiteboards: draw particles in a solid. \u00b7 Hands up: gas or liquid \u2014 milk?")]),
    ]
  }));

  // ===================== PAGE 3 — VTLM 2.0 ELEMENT 4 + REFLECTION + INCLUSIVE + ASSESSMENT =====================
  ch.push(P({ children: [new PageBreak()] }));

  // Page 3 banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ alignment: AlignmentType.CENTER, children: [
      T("VTLM 2.0 SPECIALIST DETAIL \u2014 ", { bold: true, size: 20 }),
      T("Science \u00b7 Year 5 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
        bullet("\u201C\u201CMy sort says \u2026 because particles \u2026\u201D\u201D"),
        bullet("\u201C\u201CMy partner saw \u2026 \u2014 I\u2019d add \u2026\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 2)", [tokenLine("Mid-investigation freeze: \u201CWhiteboards \u2014 what state is your ice now?\u201D Adjust based on responses.")]),
      planRow("Application (You do)", [small("Activity script: see page 1, phase 4 (INDEPENDENT SORT (You do)).", { italics: true })]),
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
          bullet("5-card sort only"),
          bullet("Labels provided on cards"),
          bullet("Adult close by for verbal sort"),
          bullet("Use diagram instead of writing"),
        ], { width: col3 }),
        cell([
          bullet("10-card sort (S/L/G)"),
          bullet("Draw particle diagram for 1 example"),
          bullet("Use cue words in journal"),
          bullet("Note 1 misconception you avoided"),
        ], { width: col3 }),
        cell([
          bullet("Predict state changes for 3 examples (heated/cooled)"),
          bullet("Sort 3 \u2018trickies\u2019 (jelly, fog, smoke)"),
          bullet("Explain why mass stays the same on state change"),
          bullet("Design a quick test to identify an unknown state"),
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
        bullet("SC1 sort S/L/G \u2014 thumbs up/middle/down"),
        bullet("SC2 particle motion \u2014 thumbs up/middle/down"),
        bullet("SC3 predict change \u2014 thumbs up/middle/down"),
      ]),
      planRow("Metacognitive prompts (mandated)", [
        bullet("\u201C\u201CWhich card was trickiest? What helped you decide?\u201D\u201D"),
        bullet("\u201C\u201CWhat\u2019s the difference between melting and dissolving?\u201D\u201D"),
        bullet("\u201C\u201CHow did the particle diagram help you?\u201D\u201D"),
      ]),
      planRow("Retrieval / spaced practice", [tokenLine("Return to particle motion in every Term 2 science lesson. Re-test sort W3 + W6.")]),
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
          small("\u2611 Bilingual sort cards"),
          small("\u2611 Sentence stems pre-shared"),
          small("\u2611 Pair with bilingual peer"),
          small("\u2611 Demonstrate, don\u2019t only describe"),
        ], { width: col4 }),
        cell([
          small("\u2611 Connect to materials in country (water cycle on river)"),
          small("\u2611 Yarn circle for share-back"),
          small("\u2611 Acknowledge community knowledge"),
          small("\u2611 Strength-based feedback"),
        ], { width: col4 }),
        cell([
          small("\u2611 Reduce sensory load (no kettle for some)"),
          small("\u2611 Magnified sort cards"),
          small("\u2611 Movement break option"),
          small("\u2611 ISP / IEP adjustments applied"),
        ], { width: col4 }),
        cell([
          small("\u2611 All materials provided"),
          small("\u2611 No-cost ice / water demo"),
          small("\u2611 Predictable rhythm"),
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
        cell([tokenLine("(eg) (eg) Hugo", { italics: true })], { width: nsCol }),
        cell([tokenLine("5-card sort + labelled diagram", { italics: true })], { width: nsCol }),
        cell([tokenLine("EA reads cards aloud; student matches with stickers", { italics: true })], { width: CONTENT_W - 2*nsCol }),
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
          bullet("Sorts 4/5 cards correctly"),
          bullet("Particle diagram shows correct arrangement + motion"),
          bullet("Predicts state change with reasoning"),
        ], { width: col2 }),
        cell([
          bullet("Confuses melting with dissolving \u2192 contrast ice melt vs sugar dissolve"),
          bullet("Thinks gas is \u2018nothing\u2019 \u2192 balloon proves gas has mass"),
          bullet("Particles \u2018rest\u2019 in solid \u2192 demo: solid particles vibrate, never still"),
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
    title: "WPS Science Lesson Plan v11 \u2014 VTLM 2.0 compliant",
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
          T("Science/Year 5/T2W1", { italics: true, color: "B22222", size: 14 })
        ]})] })
      },
      footers: {
        default: new Footer({ children: [P({ alignment: AlignmentType.CENTER, children: [
          T("[School Name] \u00b7 Science \u00b7 Year 5 T2W1 \u00b7 VC2.0 \u00b7 VTLM 2.0    Page ", { size: 14, italics: true, color: "B22222" }),
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
  fs.writeFileSync(__dirname + "/WPS_Science_Y5_T2W1_v11.docx", buf);
  console.log("Wrote v11 ->", buf.length, "bytes");
});
