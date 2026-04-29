// WPS_French_Y3_T2W1_v11.docx — VTLM 2.0 fully mandated
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
        P({ children: [T("French \u2014 Lesson Plan", { bold: true, size: 20 })] }),
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
          P({ children: [T("Greetings: bonjour, ça va, comment tu t'appelles?", { bold: true, size: 20 })] }),
          P({ children: [T("VC2LFL3C01 \u00b7 VC2LFL3U01 \u00b7 VC2LFL3M01", { size: 14, color: "888888" })] }),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          bullet("I can greet someone in French (Bonjour / Salut)."),
          bullet("I can ask and answer ça va? (how are you?)."),
          bullet("I can ask and answer comment tu t'appelles? (what's your name?)."),
        ], { width: Math.round(CONTENT_W*0.40) }),
        cell([
          P({ alignment: AlignmentType.CENTER, children: [T("Bonjour", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Ça va?", { bold: true, size: 22, color: "B22222" })] }),
          P({ alignment: AlignmentType.CENTER, children: [T("Je m'appelle…", { bold: true, size: 22, color: "B22222" })] }),
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
        T("1 clap = pencils down, eyes up", { bold: true, size: 22, color: "B22222" }),
        T("    \u00b7    ", { size: 22 }),
        T("2 claps = listen position, hands flat", { bold: true, size: 22, color: "B22222" }),
      ]}),
      P({ alignment: AlignmentType.CENTER, children: [T("Practise the signal x 3 at start. Match teacher\u2019s voice volume.", { italics: true, size: 16 })] }),
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
          bullet("Mini French flag at front"),
          bullet("Greeting flashcards (1 set per pair)"),
          bullet("Audio: native-speaker greetings"),
          bullet("Phrase wall: Bonjour, Salut, Ça va, Je m\u2019appelle"),
          bullet("French journal (1 per student)"),
        ], { width: col3 }),
        cell([
          bullet("Enter with \u201CBonjour Madame!\u201D"),
          bullet("Sit at desks. Pencils ready."),
          bullet("Wait for \u201CBonjour la classe!\u201D before responding."),
        ], { width: col3 }),
        cell([
          bullet("All say \u201CAu revoir!\u201D in chorus."),
          bullet("Journal in tray."),
          bullet("Walk back to class teacher \u2014 use \u201CSalut!\u201D"),
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
        cell(P({ alignment: AlignmentType.CENTER, children: [T("1. BONJOUR RITUAL", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("2. VOCAB + DIALOGUE", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("3. PAIR DIALOGUE", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("4. MINI-CONVERSATION", { bold: true, size: 18 })] }), { width: col5, shading: SHADE_PHASE }),
        cell(P({ alignment: AlignmentType.CENTER, children: [T("5. AU REVOIR + RECAP", { bold: true, size: 18 })] }), { width: CONTENT_W - 4*col5, shading: SHADE_PHASE }),
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
      phRow("BONJOUR", "6", [
        bigBullet("Teacher: \u201CBonjour la classe!\u201D Class: \u201CBonjour Madame!\u201D"),
        bigBullet("Echo Salut! and Bonjour! \u2014 explore difference (formal vs informal)."),
        bigBullet("Each student names a country where French is spoken (cultural element)."),
        sayLine("\u201C\u201CIn France, greeting matters. Today we learn to say hello well.\u201D\u201D")
      ]),
      phRow("VOCAB + DIALOGUE (I do)", "10", [
        bigBullet("Teach 4 phrases: Bonjour / Salut / Ça va? / Je m\u2019appelle\u2026"),
        bigBullet("Echo each 3x. Show non-example: silent entry. Discuss politeness."),
        bigBullet("Demo a 4-line dialogue with a soft toy."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Cue words: ", { bold: true, size: 18 }), T("Bonjour \u00b7 Ça va? \u00b7 Je m\u2019appelle\u2026", { bold: true, size: 18, color: "B22222" })] })
      ]),
      phRow("PAIR DIALOGUE (We do)", "15", [
        bigBullet("Pairs face each other. Practise the 4-line dialogue."),
        bigBullet("Swap roles. Try once silently (mouth shape only) to focus pronunciation."),
        bigBullet("Stop after 2 min. Pick 2 pairs to share. Praise specific pronunciation."),
        sayLine("\u201C\u201CBonjour. Ça va? Je m\u2019appelle\u2026 Et toi?\u201D\u201D")
      ]),
      phRow("MINI-CONVERSATION (You do)", "15", [
        bigBullet("Mingle: greet 4 different students using the dialogue."),
        bigBullet("Tick a box on your journal for each name you learn."),
        bigBullet("Tier choice on dialogue length."),
        P({ spacing: { before: 0, after: 30 }, children: [T("Tier choice: ", { bold: true, size: 18 }), T("Tier 1 (Bonjour + name) \u00b7 Core (4-line dialogue) \u00b7 Tier 3 (add ça va variations: bien / mal / comme ci comme ça)", { italics: true, size: 18 })] })
      ]),
      phRow("AU REVOIR", "4", [
        bigBullet("Sit. Au revoir chorus. Each student says one phrase they learned."),
        bigBullet("Wave bye-bye, French style."),
        sayLine("\u201C\u201CAu revoir la classe! Tomorrow we add comment ça va: bien, mal, comme ci comme ça.\u201D\u201D")
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
          bullet("Clap signal \u2192 calmly name what you saw."),
          bullet("Re-model expectation in French. Restart."),
          bullet("Repeat \u2192 sit out 1 round, observe."),
          bullet("Won\u2019t speak French? Whisper version OK. No mocking allowed."),
        ], { width: col3 }),
        cell([
          bullet("Phrase card on hand"),
          bullet("Whisper version"),
          bullet("Pair with strong speaker"),
        ], { width: col3 }),
        cell([
          bullet("Phrase wall stays on \u2014 next lesson reuses it."),
          bullet("Note any students who avoided speaking."),
          bullet("Two lines, walking back. Walk back to class teacher \u2014 use \u201CSalut!\u201D"),
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
      T("French \u00b7 Year 3 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
      planRow("Lesson focus", [tokenLine("Greetings: bonjour, ça va, comment tu t'appelles?")]),
      planRow("Curriculum (VC2.0)", [
        tokenLine("VC2LFL3C01 \u00b7 VC2LFL3U01 \u00b7 VC2LFL3M01"),
        tokenLine("Greetings \u00b7 Personal information \u00b7 Spoken French \u00b7 Cultural norms", { italics: true })
      ]),
      planRow("Where students are at", [
        bullet("Term 1 introduced French alphabet + numbers 1\u201310."),
        bullet("Most can pronounce vowels, some confuse \u2018u\u2019 sound."),
        bullet("Some have French heritage \u2014 invite to share, don\u2019t single out."),
      ]),
      planRow("Sequence (this term)", [
        tokenLine("W1 (today) \u00b7 W2 ça va variations \u00b7 W3 introduce family words \u00b7 W4 hobbies \u00b7 W5 mini-presentation"),
      ]),
      planRow("Resources prepared", [tokenLine("Flashcards laminated. Audio file queued. Phrase wall up.")]),
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
      planRow("Learning Intention", [tokenLine("We are learning to greet someone, ask how they are, and ask their name in French.", { italics: true, color: "B22222" })]),
      planRow("Success Criteria", [
        tokenLine("SC1  I can greet someone in French (Bonjour / Salut)."),
        tokenLine("SC2  I can ask and answer ça va? (how are you?)."),
        tokenLine("SC3  I can ask and answer comment tu t'appelles? (what's your name?)."),
      ]),
      planRow("Why this matters", [tokenLine("Greetings are the social entry point in any language. With 4 phrases students can hold a polite micro-conversation \u2014 huge motivation for early language learners.", { italics: true })]),
      planRow("Vocabulary (3 tiers)", [
        small("\u2022 Tier 1 (everyday): hello, hi, name, how, you"),
        small("\u2022 Tier 2 (lesson):  Bonjour, Salut, Ça va, Je m\u2019appelle, Comment"),
        small("\u2022 Tier 3 (French):    tu / vous (formal vs informal), francophone, pronunciation"),
      ]),
      planRow("Routines & engagement", [
        bullet("Same entry \u2192 \u201CBonjour la classe\u201D \u2192 desks every lesson."),
        bullet("Repeated chorus builds pronunciation muscle memory."),
      ]),
      planRow("Self-regulation prompts", [
        bullet("\u201C\u201CHow will you ask if you don\u2019t understand a French word?\u201D\u201D"),
        bullet("\u201C\u201CWhich phrase will you try first when you greet a new person?\u201D\u201D"),
        bullet("\u201C\u201CWhat helps you remember new sounds?\u201D\u201D"),
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
      planRow("Focus the learning", [tokenLine("State LI + SC. Show cue words. \u201CToday we greet, ask ça va, ask names.\u201D")]),
      planRow("Explanation & modelling (chunked)", [
        small("Chunk 1: Chunk 1 (3 min): Echo Bonjour x 3 + Salut x 3."),
        small("Chunk 2: Chunk 2 (3 min): Add Ça va? Echo + role-play with soft toy."),
        small("Chunk 3: Chunk 3 (4 min): Add Je m\u2019appelle\u2026 Demo full 4-line dialogue twice."),
      ]),
      planRow("Worked example / modelled exemplar", [
        small("(modelled exemplar: 4-line dialogue script on board with phonetic guide \u2014 teacher demos with soft toy as partner.)"),
        small(""),
        small(""),
      ]),
      planRow("Sentence stems for student response", [
        bullet("\u201C\u201CBonjour, je m\u2019appelle \u2026\u201D\u201D"),
        bullet("\u201C\u201CÇa va? Oui, ça va!\u201D\u201D"),
        bullet("\u201C\u201CEt toi, comment tu t\u2019appelles?\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 1)", [tokenLine("Whisper-only round: every student says \u201CJe m\u2019appelle [name]\u201D once. \u00b7 Thumbs if you can hold the dialogue.")]),
    ]
  }));

  // ===================== PAGE 3 — VTLM 2.0 ELEMENT 4 + REFLECTION + INCLUSIVE + ASSESSMENT =====================
  ch.push(P({ children: [new PageBreak()] }));

  // Page 3 banner
  ch.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [cell(P({ alignment: AlignmentType.CENTER, children: [
      T("VTLM 2.0 SPECIALIST DETAIL \u2014 ", { bold: true, size: 20 }),
      T("French \u00b7 Year 3 \u00b7 T2W1", { italics: true, color: "B22222", size: 18 })
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
        bullet("\u201C\u201CBonjour, je m\u2019appelle \u2026 Ça va?\u201D\u201D"),
        bullet("\u201C\u201COui, ça va. Et toi?\u201D\u201D"),
      ]),
      planRow("Check for understanding (CFU 2)", [tokenLine("Mid-mingle check: tap shoulders \u2014 \u201Chands up if you used all 4 phrases at least once.\u201D")]),
      planRow("Application (You do)", [small("Activity script: see page 1, phase 4 (MINI-CONVERSATION (You do)).", { italics: true })]),
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
          bullet("Just \u201CBonjour\u201D + name"),
          bullet("Phrase card on hand"),
          bullet("Whisper version OK"),
          bullet("Pair with strong speaker for mingle"),
        ], { width: col3 }),
        cell([
          bullet("Full 4-line dialogue"),
          bullet("Greet 4 different classmates"),
          bullet("Use cue phrases without card"),
          bullet("Tick names learned in journal"),
        ], { width: col3 }),
        cell([
          bullet("Add bien / mal / comme ci comme ça"),
          bullet("Switch tu vs vous appropriately"),
          bullet("Greet teacher in French politely"),
          bullet("Translate a peer\u2019s English greeting"),
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
        bullet("SC1 Bonjour / Salut \u2014 thumbs up/middle/down"),
        bullet("SC2 Ça va \u2014 thumbs up/middle/down"),
        bullet("SC3 Je m\u2019appelle \u2014 thumbs up/middle/down"),
      ]),
      planRow("Metacognitive prompts (mandated)", [
        bullet("\u201C\u201CWhich sound was hardest? Why?\u201D\u201D"),
        bullet("\u201C\u201CHow did you remember the phrase order?\u201D\u201D"),
        bullet("\u201C\u201CWhat would help you learn 5 new phrases tomorrow?\u201D\u201D"),
      ]),
      planRow("Retrieval / spaced practice", [tokenLine("Use Bonjour / Ça va / Je m\u2019appelle every lesson entry. Re-test pronunciation W3 + W6.")]),
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
          small("\u2611 Phrase card with phonetic + L1 translation"),
          small("\u2611 Sentence frames pre-shared"),
          small("\u2611 Pair with French-speaking peer if available"),
          small("\u2611 Demonstrate, don\u2019t only describe"),
        ], { width: col4 }),
        cell([
          small("\u2611 Connect to multilingual identity / family"),
          small("\u2611 Yarn circle to share home greetings"),
          small("\u2611 Acknowledge family languages"),
          small("\u2611 Strength-based feedback"),
        ], { width: col4 }),
        cell([
          small("\u2611 Whisper version always OK"),
          small("\u2611 Visual phrase card"),
          small("\u2611 Movement break option"),
          small("\u2611 ISP / IEP adjustments applied"),
        ], { width: col4 }),
        cell([
          small("\u2611 Phrase cards provided"),
          small("\u2611 Free audio resource for home practice"),
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
        cell([tokenLine("(eg) (eg) Lila", { italics: true })], { width: nsCol }),
        cell([tokenLine("Phrase card + whisper round", { italics: true })], { width: nsCol }),
        cell([tokenLine("EA models 1:1 first; student joins mingle round 3", { italics: true })], { width: CONTENT_W - 2*nsCol }),
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
          bullet("Pronounces Bonjour clearly (silent \u2018r\u2019)"),
          bullet("Holds 4-line dialogue without card"),
          bullet("Uses tu / vous appropriately for context"),
        ], { width: col2 }),
        cell([
          bullet("Mixes English in (\u201CBonjour my name is\u2026\u201D) \u2192 model whole-French dialogue again"),
          bullet("Avoids the silent \u2018r\u2019 \u2192 explicit pronunciation drill"),
          bullet("Treats Salut as universal \u2192 explain formal vs informal context"),
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
    title: "WPS French Lesson Plan v11 \u2014 VTLM 2.0 compliant",
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
          T("French/Year 3/T2W1", { italics: true, color: "B22222", size: 14 })
        ]})] })
      },
      footers: {
        default: new Footer({ children: [P({ alignment: AlignmentType.CENTER, children: [
          T("[School Name] \u00b7 French \u00b7 Year 3 T2W1 \u00b7 VC2.0 \u00b7 VTLM 2.0    Page ", { size: 14, italics: true, color: "B22222" }),
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
  fs.writeFileSync(__dirname + "/WPS_French_Y3_T2W1_v11.docx", buf);
  console.log("Wrote v11 ->", buf.length, "bytes");
});
