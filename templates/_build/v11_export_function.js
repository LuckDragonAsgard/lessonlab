// ============================================================================
// v11 EXPORT — VTLM 2.0 compliant lesson plans
// Fetches per-subject tokenised TEMPLATE blank from GitHub, fills 133 tokens
// from current state, re-zips and downloads.
// ----------------------------------------------------------------------------
// Each subject has its own blank with subject-specific labels (EQUIPMENT vs
// MATERIALS vs INSTRUMENTS, etc.) so the file is correct regardless of subject.
// Tokens we don't have state data for fall back to sensible defaults.
// ============================================================================

const _v11SubjectMap = {
  // canonical subject name -> blank filename slug (matches what's in templates/)
  'PE': 'PE',
  'Physical Education': 'PE',
  'Health and PE': 'PE',
  'Literacy': 'Literacy',
  'English': 'Literacy',
  'Numeracy': 'Numeracy',
  'Mathematics': 'Numeracy',
  'Maths': 'Numeracy',
  'Visual Art': 'Visual_Art',
  'Visual Arts': 'Visual_Art',
  'Art': 'Visual_Art',
  'HASS': 'HASS',
  'Humanities': 'HASS',
  'History': 'HASS',
  'Geography': 'HASS',
  'Music': 'Music',
  'Wellbeing': 'Wellbeing',
  'Health': 'Wellbeing',
  'Digital Tech': 'Digital_Tech',
  'Digital Technologies': 'Digital_Tech',
  'Tech': 'Digital_Tech',
  'French': 'French',
  'LOTE': 'French',
  'Languages': 'French',
  'Performing Arts': 'Performing_Arts',
  'Drama': 'Performing_Arts',
  'Dance': 'Performing_Arts',
  'Science': 'Science'
};

function _v11SubjectSlug(subj) {
  if (!subj) return 'PE';
  return _v11SubjectMap[subj] || _v11SubjectMap[subj.trim()] || 'PE';
}

function _v11TokenMap(d, cfg) {
  // Build a {tokenName -> value} map from a lesson data object.
  // Falls back to sensible defaults for tokens not derivable from current state.
  var sc = Array.isArray(d.sc) ? d.sc : (d.sc || '').split('\n').filter(function(s){return s.trim();});
  var eq = (d.equipment || '').split(/\s*[·•·]\s*/).filter(function(s){return s.trim();});
  while (eq.length < 5) eq.push('—');
  var phases = cfg.phases || ['Warm-up','Explicit Teaching','Practice','Application','Pack up'];
  var times = cfg.times || ['6 min','10 min','15 min','15 min','4 min'];

  function n(arr, i, def) { return (arr[i] != null ? arr[i] : def) || '—'; }
  function timeNum(t) { return ((t||'').match(/\d+/) || ['—'])[0]; }

  return {
    school_name: state.school || d.school || '[School Name]',
    subject: d.subject || cfg.name || 'Subject',
    year_level: d.year || '',
    term: 'Term ' + (state.term || d.term || 1),
    week: 'Week ' + (d.week || 1),
    lesson_date: d.date || '',

    lesson_title: d.title || d.li || 'Lesson',
    vc_codes: d.vcCodes || d.context || '',
    sc_1: n(sc, 0, 'I can —'),
    sc_2: n(sc, 1, 'I can —'),
    sc_3: n(sc, 2, 'I can —'),
    sc_1_short: (n(sc, 0, '').slice(0, 30) || '—'),
    sc_2_short: (n(sc, 1, '').slice(0, 30) || '—'),
    sc_3_short: (n(sc, 2, '').slice(0, 30) || '—'),

    cue_1: d.cue1 || 'Listen', cue_2: d.cue2 || 'Try', cue_3: d.cue3 || 'Reflect',
    cue_words: (d.cue1||'Listen') + ' · ' + (d.cue2||'Try') + ' · ' + (d.cue3||'Reflect'),

    signal_1: d.signal1 || '1 clap = stop and look',
    signal_2: d.signal2 || '2 claps = pencils down, eyes up',

    equipment_1: eq[0], equipment_2: eq[1], equipment_3: eq[2], equipment_4: eq[3], equipment_5: eq[4],

    entry_1: d.entry1 || 'Enter quietly to allocated spots.',
    entry_2: d.entry2 || 'Materials in front, hands ready.',
    entry_3: d.entry3 || 'Wait for silence before teaching.',
    exit_1: d.exit1 || 'Materials away. Tidy desk.',
    exit_2: d.exit2 || 'Stand quietly when called.',
    exit_3: d.exit3 || 'Walk back in two lines.',

    warm_up_min: timeNum(times[0]),
    explicit_min: timeNum(times[1]),
    practice_min: timeNum(times[2]),
    packup_min: timeNum(times[4]),

    warm_up_step_1: d.warmUp1 || (d.flow && d.flow[0] && d.flow[0].steps && d.flow[0].steps[0]) || 'Settle and review prior cue words.',
    warm_up_step_2: d.warmUp2 || 'Practise the attention signal x 3.',
    warm_up_step_3: d.warmUp3 || 'Remind students of routine.',
    warm_up_say: d.warmUpSay || 'Today we are learning ' + (d.li || 'something new') + '.',

    teach_step_1: d.teach1 || 'Chunk 1: explain the concept clearly.',
    teach_step_2: d.teach2 || 'Chunk 2: model with a worked example.',
    teach_step_3: d.teach3 || 'Chunk 3: pick 2 students to demo back.',

    practice_step_1: d.practice1 || 'Whole-class guided practice — same task together.',
    practice_step_2: d.practice2 || 'Pairs/small groups — repeat with feedback.',
    practice_step_3: d.practice3 || 'Praise 1-2 students by name after each round.',
    practice_say: d.practiceSay || 'Show me a great ' + (d.cue1 || 'try') + '.',

    app_step_1: d.app1 || 'Independent task — your turn.',
    app_step_2: d.app2 || 'Move around to support; ask probing questions.',
    app_step_3: d.app3 || 'Halfway: pause, share-back, adjust.',
    tier_summary: d.tierSummary || 'Tier 1 (modified) · Core (full task) · Tier 3 (extension)',
    phase_label_4: phases[3] || 'Application',

    packup_step_1: d.packup1 || 'Materials away. Sit ready for share-back.',
    packup_step_2: d.packup2 || 'Thumbs up/middle/down for each SC.',
    packup_say: d.packupSay || 'You worked hard today. Walk back, two lines.',

    behaviour_1: d.behaviour1 || 'Calmly name what you saw.',
    behaviour_2: d.behaviour2 || 'Re-model with one student. Restart.',
    behaviour_3: d.behaviour3 || 'Repeat → 1 min sit out, re-join.',
    behaviour_4: d.behaviour4 || 'Refusing? Offer alternative role; if not, sit near teacher.',

    rescue_1: d.rescue1 || 'Smaller group / smaller task',
    rescue_2: d.rescue2 || 'Walk through with one example',
    rescue_3: d.rescue3 || 'Re-demo with 2 students, not whole class',

    ct_note_1: d.ctNote1 || 'Leave this sheet on classroom desk.',
    ct_note_2: d.ctNote2 || 'Note any incidents on the back.',
    ct_note_3: d.ctNote3 || 'Roll stays with class teacher.',

    vc_descriptors: d.vcDescriptors || '',
    prior_1: d.prior1 || 'Builds on prior learning from last week.',
    prior_2: d.prior2 || 'Most students ready; some need extra modelling.',
    prior_3: d.prior3 || 'A few need a Tier 1 modified task.',
    sequence_summary: d.sequenceSummary || 'W1 (today) · W2 same focus · W3 extend · W4 apply',
    resources_prepared: d.resourcesPrepared || 'See page 1 equipment list. Set up before students arrive.',

    learning_intention: 'We are learning to ' + (d.li || ''),
    why_this_matters: d.whyMatters || 'This skill builds the foundation for ' + (d.subject || 'further') + ' learning across the term.',
    vocab_tier1: d.vocabTier1 || '(everyday vocabulary)',
    vocab_tier2: d.vocabTier2 || '(lesson-specific vocabulary)',
    vocab_tier3: d.vocabTier3 || '(subject-specific vocabulary)',
    routine_1: d.routine1 || 'Same entry → settle → signal x 3 every lesson.',
    routine_2: d.routine2 || 'Predictable structure reduces cognitive load.',
    self_reg_1: d.selfReg1 || 'What will help you remember today’s focus?',
    self_reg_2: d.selfReg2 || 'How will you know if you’re on track?',
    self_reg_3: d.selfReg3 || 'What do you do if you get stuck?',

    focus_the_learning: d.focusLearning || 'State LI + SC. Show cue words. “Today we are learning ' + (d.li||'') + '.”',
    teach_chunk_1: d.teachChunk1 || 'Chunk 1: introduce the concept (3 min).',
    teach_chunk_2: d.teachChunk2 || 'Chunk 2: worked example (3 min).',
    teach_chunk_3: d.teachChunk3 || 'Chunk 3: demo + check (4 min).',
    worked_example: d.workedExample || '(image / sketch space — teacher shows the worked example step by step)',
    stem_1: d.stem1 || 'I noticed … because …',
    stem_2: d.stem2 || 'A good answer has … and …',
    stem_3: d.stem3 || 'My strategy is … · … · …',
    cfu_1: d.cfu1 || 'Show me — thumbs up if you’re ready.',

    practice_stem_1: d.practiceStem1 || 'I’m doing this because …',
    practice_stem_2: d.practiceStem2 || 'My partner is on track because …',
    cfu_2: d.cfu2 || 'Mid-practice: thumbs up/down. Adjust before continuing.',

    tier1_task_1: (d.differentiation && d.differentiation.support) || 'Modified task: with adult/peer support',
    tier1_task_2: 'Smaller task scope',
    tier1_task_3: 'Visual scaffold provided',
    tier1_task_4: 'Pre-teach key vocab',
    core_task_1: 'Full task as scripted',
    core_task_2: 'Independent or paired',
    core_task_3: 'All 3 success criteria',
    core_task_4: 'Self-check before share',
    tier3_task_1: (d.differentiation && d.differentiation.extension) || 'Extension: deeper challenge',
    tier3_task_2: 'Lead a small group',
    tier3_task_3: 'Mentor a peer',
    tier3_task_4: 'Apply to a new context',

    metacog_1: d.metacog1 || 'What helped you most today?',
    metacog_2: d.metacog2 || 'What was tricky? What will you try next time?',
    metacog_3: d.metacog3 || 'Which cue word did you use in your head?',
    retrieval_plan: d.retrievalPlan || 'Return to today’s cue every lesson this term. Re-test in W3 + W6.',

    eald_1: 'Visual cue cards / pictures',
    eald_2: 'Sentence stems pre-shared',
    eald_3: 'Pair with bilingual buddy',
    eald_4: 'Demonstrate, don’t only describe',
    koorie_1: 'Connect to community/culture',
    koorie_2: 'Yarn circle for reflection',
    koorie_3: 'Acknowledge family knowledge',
    koorie_4: 'Strength-based language',
    disability_1: 'Reduce sensory load',
    disability_2: 'Scribed SC self-check',
    disability_3: 'Movement / break option',
    disability_4: 'ISP / IEP adjustments applied',
    disadv_1: 'Equipment provided — no own kit',
    disadv_2: 'No-cost variants',
    disadv_3: 'Predictable routine = safety',
    disadv_4: 'Strength noticed and named',

    student_name_eg: '(eg) Alex',
    adjustment_eg: 'Visual cue card on desk',
    support_eg: 'Laminated SC; teacher checks at each phase',

    lookfor_1: d.lookfor1 || 'On-task with eyes up',
    lookfor_2: d.lookfor2 || 'Uses the modelled strategy',
    lookfor_3: d.lookfor3 || 'Responds to the signal within 2 seconds',

    misconception_1: d.misconception1 || 'Common error 1 → cue / re-model',
    misconception_2: d.misconception2 || 'Common error 2 → cue / re-model',
    misconception_3: d.misconception3 || 'Common error 3 → cue / re-model'
  };
}

async function exportToWordV11() {
  if (!state.lessons || state.lessons.length === 0) {
    alert('No lessons to export. Generate lessons first.');
    return;
  }
  if (typeof JSZip === 'undefined') {
    alert('JSZip not loaded — please refresh the page and try again.');
    return;
  }

  var btn = document.getElementById('exportWordV11Btn');
  if (btn) { btn.textContent = 'Building v11...'; btn.disabled = true; }

  try {
    var cfg = state.subjectCfg || {};
    var subjectName = cfg.name || (state.lessons[0] && state.lessons[0].data && state.lessons[0].data.subject) || 'PE';
    var slug = _v11SubjectSlug(subjectName);
    // Picks the per-subject blank that ships in the repo
    var fname = slug === 'PE'
      ? 'WPS_PE_LessonPlan_TEMPLATE_v11.docx'
      : 'WPS_' + slug + '_LessonPlan_TEMPLATE_v11_FIXED.docx';
    var blankUrl = 'https://raw.githubusercontent.com/LuckDragonAsgard/lessonlab/main/templates/' + fname;

    var resp = await fetch(blankUrl, { cache: 'no-cache' });
    if (!resp.ok) throw new Error('Could not fetch v11 blank for ' + subjectName + ' (' + resp.status + ')');
    var blob = await resp.blob();

    // For multi-lesson exports we concatenate by re-using the blank for each
    // and stitching document.xml bodies. MVP: export the FIRST lesson only.
    // Multi-lesson v11 export is a follow-up.
    var d = state.lessons[0].data;
    d.school = d.school || state.school;
    var tokens = _v11TokenMap(d, cfg);

    var jszip = await JSZip.loadAsync(blob);
    var docXml = await jszip.file('word/document.xml').async('string');
    Object.keys(tokens).forEach(function(k){
      var re = new RegExp('\\{\\{' + k + '\\}\\}', 'g');
      docXml = docXml.replace(re, _xesc(String(tokens[k] == null ? '' : tokens[k])));
    });
    jszip.file('word/document.xml', docXml);

    var outBlob = await jszip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    var school = (state.school || 'LessonLab').replace(/[^a-zA-Z0-9]/g, '_');
    var subjSafe = (subjectName || 'Lesson').replace(/[^a-zA-Z0-9]/g, '_');
    var weekN = (d.week || 1);
    var filename = school + '_' + subjSafe + '_T' + (state.term||1) + 'W' + weekN + '_v11.docx';
    var url = URL.createObjectURL(outBlob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);

    if (btn) { btn.textContent = '✅ v11 downloaded'; setTimeout(function(){ btn.textContent='📄 v11 Word (VTLM)'; btn.disabled = false; }, 2500); }
  } catch (e) {
    console.error('v11 export failed', e);
    alert('v11 export failed: ' + e.message);
    if (btn) { btn.textContent = '📄 v11 Word (VTLM)'; btn.disabled = false; }
  }
}
