"""Orchestrate building per-subject v11 docx templates from PE base.

Loads SUBJECTS dicts from subject_configs.py + subject_configs_2.py, applies
string substitutions on build_v11_example.js (PE base), runs node to build the
docx, applies the [Content_Types].xml zip-position-0 fix, and pushes to GitHub.
"""
import sys, os, subprocess, zipfile, json, base64, urllib.request, urllib.error, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import subject_configs as cfg1
import subject_configs_2 as cfg2

BASE = os.path.dirname(os.path.abspath(__file__))
PE_BASE = os.path.join(BASE, 'build_v11_example.js')

# Combined subjects
ALL = {}
ALL.update(cfg1.SUBJECTS)
ALL.update(cfg2.SUBJECTS_2)

print(f"Loaded {len(ALL)} subject configs: {list(ALL.keys())}")

# --- Substitution recipe ---
# Each (find, replace_template) pair. replace_template uses {field} placeholders
# from the subject config dict.

def build_replacements(c):
    """Return list of (old, new) pairs for one subject."""
    subj = c['subject']
    yr = c['year']
    yr_short = c['year_short']
    fname_base = f"WPS_{subj.replace(' ', '_')}_{yr_short}_T2W1_v11"
    return [
        # File header comment
        ('// WPS_PE_Foundation_T2W1_v11.docx — VTLM 2.0 fully mandated',
         f'// {fname_base}.docx — VTLM 2.0 fully mandated'),
        # Title block subject
        ('PE \\u2014 Lesson Plan',
         f'{subj} \\u2014 Lesson Plan'),
        # Year level
        ('Year level: Foundation',
         f'Year level: {yr}'),
        # Lesson title (page 1)
        ('Running safely and stopping on a signal',
         c['lesson_title']),
        # VC codes (page 1)
        ('VC2HPFM01 \\u00b7 VC2HPFM02 \\u00b7 VC2HPFP01',
         c['vc_codes']),
        # SCs (page 1)
        ('I can run with my eyes up, looking for space.',
         c['sc_1']),
        ('I can change direction to avoid other students.',
         c['sc_2']),
        ('I can stop within 3 steps when I hear the signal.',
         c['sc_3']),
        # Cue words (page 1)
        ('Eyes up", { bold: true, size: 22, color: "B22222"',
         f'{c["cue_1"]}", {{ bold: true, size: 22, color: "B22222"'),
        ('Find space", { bold: true, size: 22, color: "B22222"',
         f'{c["cue_2"]}", {{ bold: true, size: 22, color: "B22222"'),
        ('3-step stop", { bold: true, size: 22, color: "B22222"',
         f'{c["cue_3"]}", {{ bold: true, size: 22, color: "B22222"'),
        # Signal banner
        ('T("SIGNAL: ", { bold: true, size: 22 })',
         f'T("{c["signal_label"]}: ", {{ bold: true, size: 22 }})'),
        ('1 whistle = FREEZE',
         c['signal_1']),
        ('2 whistles = come to teacher',
         c['signal_2']),
        ('Practise the signal x 3 in the first 2 minutes.',
         c['signal_practise']),
        # Equipment header
        ('cell(headLine("EQUIPMENT")',
         f'cell(headLine("{c["equipment_label"]}")'),
        # Equipment items
        ('20 witches hats (boundary)', c['equipment_1']),
        ('10 floor spots', c['equipment_2']),
        ('4 coloured bibs', c['equipment_3']),
        ('1 whistle', c['equipment_4']),
        ('1 foam ball (demo)', c['equipment_5']),
        # Entry items
        ('Two lines outside, roll order.', c['entry_1']),
        ('Call in to floor spots.', c['entry_2']),
        ('Wait for silence before teaching.', c['entry_3']),
        # Exit items
        ('Whistle stop \\u2192 spots to bin.', c['exit_1']),
        ('Two lines, walk back.', c['exit_2']),
        ('Roll stays with class teacher.', c['exit_3']),
        # Phase strip labels (1.WARM-UP etc.)
        ('1. WARM-UP', c['phase_1']),
        ('2. EXPLICIT TEACHING', c['phase_2']),
        ('3. PRACTICE (We do)', c['phase_3']),
        ('4. APPLICATION (You do)', c['phase_4']),
        ('5. PACK UP', c['phase_5']),
        # Phase activity row labels
        ('phRow("WARM-UP", "6"', f'phRow("{c["phase_label_1"]}", "6"'),
        ('phRow("EXPLICIT TEACHING (I do)", "10"', f'phRow("{c["phase_label_2"]}", "10"'),
        ('phRow("PRACTICE (We do)", "15"', f'phRow("{c["phase_label_3"]}", "15"'),
        ('phRow("APPLICATION (You do)", "15"', f'phRow("{c["phase_label_4"]}", "15"'),
        ('phRow("PACK UP & REFLECT", "4"', f'phRow("{c["phase_label_5"]}", "4"'),
        # Phase 1 bullets + say
        ('On spots. Walk boundary together \\u2014 point at each hat.', c['p1_1']),
        ('Practise freeze signal x 3. Praise quick responders.', c['p1_2']),
        ('Jog on spot 20 sec. Freeze.', c['p1_3']),
        ('\\u201CIn PE we keep eyes up, find our space, stop on the whistle.\\u201D',
         f'\\u201C{c["p1_say"]}\\u201D'),
        # Phase 2 bullets + cue line
        ('Demo safe running: eyes up, arms bent, looking for space.', c['p2_1']),
        ('Demo UNSAFE running (slow-mo, looking down). Ask: \\u201CWhat was wrong?\\u201D',
         c['p2_2']),
        ('Teach 3-step stop: plant \\u00b7 bend \\u00b7 small step. Pick 2 students to demo.',
         c['p2_3']),
        ('T("Cue words: ", { bold: true, size: 18 })',
         f'T("{c["p2_say_label"]}", {{ bold: true, size: 18 }})'),
        ('T("Eyes up \\u00b7 Find space \\u00b7 3-step stop", { bold: true, size: 18, color: "B22222" })',
         f'T("{c["p2_say"]}", {{ bold: true, size: 18, color: "B22222" }})'),
        # Phase 3 bullets + say
        ('All move at the same time inside the boundary.', c['p3_1']),
        ('Teacher calls: walk \\u2192 skip \\u2192 jog \\u2192 fast jog. Whistle = FREEZE.', c['p3_2']),
        ('Praise 1\\u20132 students by name after each freeze.', c['p3_3']),
        ('\\u201CEyes up \\u00b7 Find space \\u00b7 3-step stop. Show me a great freeze.\\u201D',
         f'\\u201C{c["p3_say"]}\\u201D'),
        # Application reference text (pointer to phase 4)
        ('Activity script: see page 1, phase 4 (Traffic Lights).',
         f'Activity script: see page 1, phase 4 ({c["phase_label_4"]}).'),
        # Phase 4 bullets + tier choice
        ('Traffic Lights \\u2014 pick 4 students as colour callers (bibs).', c['p4_1']),
        ('GREEN = jog \\u00b7 YELLOW = walk \\u00b7 RED = freeze in 3-step stop.', c['p4_2']),
        ('Rotate callers every 2 minutes. Swap all at halfway.', c['p4_3']),
        ('T("Tier choice: ", { bold: true, size: 18 })',
         f'T("{c["p4_summary_label"]}", {{ bold: true, size: 18 }})'),
        ('T("Tier 1 (walk-only) \\u00b7 Core (full game) \\u00b7 Tier 3 (be a caller, balance shape)", { italics: true, size: 18 })',
         f'T("{c["p4_summary"]}", {{ italics: true, size: 18 }})'),
        # Phase 5 bullets + say
        ('Whistle stop. Spots to bin. Sit on centre line.', c['p5_1']),
        ('Thumbs up/middle/down for each SC. One student shares a safe choice.', c['p5_2']),
        ('\\u201CYou ran with eyes up and stopped in three steps. Walk back, two lines.\\u201D',
         f'\\u201C{c["p5_say"]}\\u201D'),
        # Behaviour
        ('Whistle \\u2192 calmly name what you saw.', c['behaviour_1']),
        ('Re-model with one student. Restart.', c['behaviour_2']),
        ('Repeat \\u2192 sit out 1 min, re-join.', c['behaviour_3']),
        ('Refusing? Offer caller/scorer job; if not, sit near teacher.', c['behaviour_4']),
        # Rescue (if not working)
        ('Bigger boundary \\u2014 spread apart', c['rescue_1']),
        ('Walking only \\u2014 no jogging yet', c['rescue_2']),
        ('Re-demo with 2 students, not whole class', c['rescue_3']),
        # Notes for class teacher
        ('Leave this sheet on PE office desk.', c['ct_note_1']),
        ('Note any incidents on the back.', c['ct_note_2']),
        ('Two lines, walking back. Roll stays with class teacher.', c['ct_note_3']),
        # Page 2 banner subject context
        ('PE \\u00b7 Foundation \\u00b7 T2W1', f'{subj} \\u00b7 {yr} \\u00b7 T2W1'),
        # Lesson focus
        ('planRow("Lesson focus", [tokenLine("Running safely and stopping on a signal")])',
         f'planRow("Lesson focus", [tokenLine("{c["lesson_title"]}")])'),
        # Curriculum (Element 1)
        ('tokenLine("VC2HPFM01 \\u00b7 VC2HPFM02 \\u00b7 VC2HPFP01")',
         f'tokenLine("{c["vc_codes"]}")'),
        ('Fundamental movement skills \\u00b7 Moving with control \\u00b7 Following rules',
         c['vc_descriptors']),
        # Where students at
        ('Term 1 covered moving safely + responding to whistle.', c['prior_1']),
        ('Most can walk and jog inside boundary; some still lose focus.', c['prior_2']),
        ('A small number need extra modelling of the 3-step stop.', c['prior_3']),
        # Sequence
        ('W1 (today) \\u00b7 W2 same focus \\u00b7 W3 add direction change \\u00b7 W4 add partner \\u00b7 W5 small game',
         c['sequence_summary']),
        # Resources prepared
        ('See page 1 equipment list. Floor spots laid out before students arrive.',
         c['resources_prepared']),
        # Learning intention
        ('We are learning to run with control in shared space and stop safely on a signal.',
         c['learning_intention']),
        # SC (short, on page 2)
        ('SC1  I can run with my eyes up, looking for space.',
         f'SC1  {c["sc_1_short"]}'),
        ('SC2  I can change direction to avoid other students.',
         f'SC2  {c["sc_2_short"]}'),
        ('SC3  I can stop within 3 steps when I hear the signal.',
         f'SC3  {c["sc_3_short"]}'),
        # Why this matters
        ('Foundation students are building running with control. Safe running + reliable freeze = every future PE lesson is safe.',
         c['why_this_matters']),
        # Vocab tiers
        ('\\u2022 Tier 1 (everyday): run, stop, walk, listen, space',
         f'\\u2022 Tier 1 (everyday): {c["vocab_tier1"]}'),
        ('\\u2022 Tier 2 (lesson):  freeze, signal, boundary, control, safe',
         f'\\u2022 Tier 2 (lesson):  {c["vocab_tier2"]}'),
        ('\\u2022 Tier 3 (PE):    3-step stop, fundamental movement, spatial awareness',
         f'\\u2022 Tier 3 ({subj}):    {c["vocab_tier3"]}'),
        # Routines
        ('Same entry \\u2192 spots \\u2192 boundary walk \\u2192 signal x 3 every lesson.',
         c['routine_1']),
        ('Predictable structure reduces cognitive load (4 Elements of Learning \\u2014 attention).',
         c['routine_2']),
        # Self-regulation prompts
        ('\\u201CWhat will help you remember the 3-step stop?\\u201D',
         f'\\u201C{c["self_reg_1"]}\\u201D'),
        ('\\u201CHow will you know if you\\u2019re safe in your space?\\u201D',
         f'\\u201C{c["self_reg_2"]}\\u201D'),
        ("\\u201CHow will you know if you're safe in your space?\\u201D",
         f'\\u201C{c["self_reg_2"]}\\u201D'),
        ('\\u201CWhat can you do if your body wants to go faster than your eyes?\\u201D',
         f'\\u201C{c["self_reg_3"]}\\u201D'),
        # Focus the learning
        ('State LI + SC. Show cue words on board. \\u201CToday we are learning to run with eyes up and stop in 3 steps.\\u201D',
         c['focus_the_learning']),
        # Teach chunks
        ('Chunk 1 (3 min): Demonstrate safe running \\u2014 eyes up, arms bent, finding space.',
         f'Chunk 1: {c["teach_chunk_1"]}'),
        ('Chunk 2 (3 min): Demonstrate UNSAFE running (slow-mo). Ask \\u201Cwhat was wrong?\\u201D',
         f'Chunk 2: {c["teach_chunk_2"]}'),
        ('Chunk 3 (4 min): Teach 3-step stop \\u2014 plant \\u00b7 bend \\u00b7 small step. Pick 2 students to demo.',
         f'Chunk 3: {c["teach_chunk_3"]}'),
        # Worked example
        ('(image / sketch space \\u2014 teacher shows the 3-step stop frame-by-frame, photo or chalk diagram)',
         c['worked_example']),
        # Sentence stems for student response
        ('\\u201CI noticed \\u2026 because \\u2026\\u201D',
         f'\\u201C{c["stem_1"]}\\u201D'),
        ('\\u201CA safe runner has \\u2026 and \\u2026\\u201D',
         f'\\u201C{c["stem_2"]}\\u201D'),
        ('\\u201CMy 3-step stop is \\u2026 \\u00b7 \\u2026 \\u00b7 \\u2026\\u201D',
         f'\\u201C{c["stem_3"]}\\u201D'),
        # CFU 1
        ('\\u201CShow me with your feet \\u2014 what does a 3-step stop look like?\\u201D \\u00b7 \\u201CThumbs up if you\\u2019re ready.\\u201D',
         c['cfu_1']),
        ("\\u201CShow me with your feet \\u2014 what does a 3-step stop look like?\\u201D \\u00b7 \\u201CThumbs up if you're ready.\\u201D",
         c['cfu_1']),
        # Practice stems
        ('\\u201CI\\u2019m freezing in 3 steps because \\u2026\\u201D',
         f'\\u201C{c["practice_stem_1"]}\\u201D'),
        ("\\u201CI'm freezing in 3 steps because \\u2026\\u201D",
         f'\\u201C{c["practice_stem_1"]}\\u201D'),
        ('\\u201CMy partner is safe because \\u2026\\u201D',
         f'\\u201C{c["practice_stem_2"]}\\u201D'),
        # CFU 2
        ('Mid-practice freeze: \\u201CHands up if you stopped in 3 steps. Hands up if you needed more.\\u201D Adjust before continuing.',
         c['cfu_2']),
        # Tier 1 tasks
        ('Walk-only Traffic Lights', c['tier1_task_1']),
        ('Smaller boundary', c['tier1_task_2']),
        ('Partnered with adult / strong peer', c['tier1_task_3']),
        ('3-step stop only \\u2014 no direction change', c['tier1_task_4']),
        # Core tasks
        ('Full Traffic Lights as scripted', c['core_task_1']),
        ('Jog \\u00b7 walk \\u00b7 freeze in 3 steps', c['core_task_2']),
        ('Eyes up + change direction', c['core_task_3']),
        ('Take a turn as caller', c['core_task_4']),
        # Tier 3 tasks
        ('Freeze in a balanced shape (one foot, low crouch)', c['tier3_task_1']),
        ('Lead Traffic Lights as colour caller', c['tier3_task_2']),
        ("Mirror partner\\u2019s speed", c['tier3_task_3']),
        ("Mirror partner's speed", c['tier3_task_3']),
        ('Call your own colour before moving', c['tier3_task_4']),
        # Cool-down SC labels
        ('SC1 eyes up \\u2014 thumbs up/middle/down',
         f'SC1 {c["sc_1_short"]} \\u2014 thumbs up/middle/down'),
        ('SC2 change direction \\u2014 thumbs up/middle/down',
         f'SC2 {c["sc_2_short"]} \\u2014 thumbs up/middle/down'),
        ('SC3 3-step stop \\u2014 thumbs up/middle/down',
         f'SC3 {c["sc_3_short"]} \\u2014 thumbs up/middle/down'),
        # Metacognitive prompts
        ('\\u201CWhat helped you most today?\\u201D',
         f'\\u201C{c["metacog_1"]}\\u201D'),
        ('\\u201CWhat was tricky? What will you try next time?\\u201D',
         f'\\u201C{c["metacog_2"]}\\u201D'),
        ('\\u201CWhich cue word did you use in your head?\\u201D',
         f'\\u201C{c["metacog_3"]}\\u201D'),
        # Retrieval / spaced practice
        ('Return to 3-step stop cue every Term 2 lesson. Re-test start of W3 + W6.',
         c['retrieval_plan']),
        # EAL/D
        ('\\u2611 Visual cue cards on belt', f'\\u2611 {c["eald_1"]}'),
        ('\\u2611 Sentence stems pre-shared', f'\\u2611 {c["eald_2"]}'),
        ("\\u2611 Pair with bilingual buddy", f'\\u2611 {c["eald_3"]}'),
        ("\\u2611 Demonstrate, don\\u2019t only describe", f'\\u2611 {c["eald_4"]}'),
        ("\\u2611 Demonstrate, don't only describe", f'\\u2611 {c["eald_4"]}'),
        # Koorie
        ('\\u2611 Connect to community/sport', f'\\u2611 {c["koorie_1"]}'),
        ('\\u2611 Yarn circle for reflection', f'\\u2611 {c["koorie_2"]}'),
        ('\\u2611 Acknowledge family knowledge', f'\\u2611 {c["koorie_3"]}'),
        ('\\u2611 Strength-based language', f'\\u2611 {c["koorie_4"]}'),
        # Disability
        ('\\u2611 Reduce sensory load (whistle volume)', f'\\u2611 {c["disability_1"]}'),
        ('\\u2611 Scribed SC self-check', f'\\u2611 {c["disability_2"]}'),
        ('\\u2611 Movement break option', f'\\u2611 {c["disability_3"]}'),
        ('\\u2611 ISP / IEP adjustments applied', f'\\u2611 {c["disability_4"]}'),
        # Disadvantage
        ('\\u2611 Equipment provided \\u2014 no own kit', f'\\u2611 {c["disadv_1"]}'),
        ('\\u2611 No-cost game variants', f'\\u2611 {c["disadv_2"]}'),
        ('\\u2611 Predictable routine = safety', f'\\u2611 {c["disadv_3"]}'),
        ('\\u2611 Strength noticed and named', f'\\u2611 {c["disadv_4"]}'),
        # Named adjustment example
        ('(eg) Mason', f'(eg) {c["student_name_eg"]}'),
        ('Visual cue card on belt', c['adjustment_eg']),
        ('Laminated 3-step stop pic; teacher checks at each freeze', c['support_eg']),
        # Look-fors
        ('Eyes up consistently while moving', c['lookfor_1']),
        ('Uses 3-step stop (no sliding, no crashing)', c['lookfor_2']),
        ('Responds to whistle within 2 seconds', c['lookfor_3']),
        # Misconceptions
        ('Looking down at feet \\u2192 cue \\u201Ceyes up\\u201D + chest target on far hat',
         c['misconception_1']),
        ('Sliding stop \\u2192 demo plant \\u00b7 bend \\u00b7 small', c['misconception_2']),
        ('\\u201CFreeze\\u201D = giggle \\u2192 re-set with silent freeze x 3', c['misconception_3']),
        # Doc title
        ('WPS PE Lesson Plan v11 \\u2014 VTLM 2.0 compliant',
         f'WPS {subj} Lesson Plan v11 \\u2014 VTLM 2.0 compliant'),
        # Header label
        ('PE/Foundation/T2W1', f'{subj}/{yr}/T2W1'),
        # Footer (school + subject + year)
        ('[School Name] \\u00b7 PE \\u00b7 Foundation T2W1',
         f'[School Name] \\u00b7 {subj} \\u00b7 {yr} T2W1'),
        # writeFileSync output filename
        ('WPS_PE_Foundation_T2W1_v11.docx', f'{fname_base}.docx'),
    ]

def apply_subs(content, subs):
    out = content
    for old, new in subs:
        if old not in out:
            print(f"   WARN: missing snippet: {old[:60]!r}")
            continue
        out = out.replace(old, new)
    return out

def reorder_zip(infile, outfile):
    src = zipfile.ZipFile(infile, 'r')
    entries = [(i, src.read(i.filename)) for i in src.infolist() if not i.filename.endswith('/')]
    entries.sort(key=lambda x: (0 if x[0].filename == '[Content_Types].xml' else 1, x[0].filename))
    with zipfile.ZipFile(outfile, 'w', zipfile.ZIP_DEFLATED) as dst:
        for info, data in entries:
            ni = zipfile.ZipInfo(info.filename, date_time=info.date_time)
            ni.compress_type = zipfile.ZIP_DEFLATED
            dst.writestr(ni, data)
    src.close()

def main():
    with open(PE_BASE, 'r', encoding='utf-8') as f:
        base = f.read()

    results = {}
    for key, c in ALL.items():
        subj_safe = c['subject'].replace(' ', '_')
        yr_short = c['year_short']
        fname_base = f"WPS_{subj_safe}_{yr_short}_T2W1_v11"
        js_name = f"build_{key.lower()}_v11_example.js"
        js_path = os.path.join(BASE, js_name)

        print(f"\n=== {key} ({c['subject']} {yr_short}) ===")
        subs = build_replacements(c)
        out = apply_subs(base, subs)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(out)
        print(f"  wrote {js_name} ({len(out)} bytes)")

        # Run node to build the docx
        try:
            r = subprocess.run(['node', js_path], capture_output=True, text=True, timeout=30, cwd=BASE)
            if r.returncode != 0:
                print(f"  NODE FAIL: {r.stderr[:400]}")
                results[key] = {'ok': False, 'err': r.stderr[:400]}
                continue
            print(f"  node: {r.stdout.strip()}")
        except Exception as e:
            print(f"  NODE ERR: {e}")
            results[key] = {'ok': False, 'err': str(e)}
            continue

        docx_path = os.path.join(BASE, f"{fname_base}.docx")
        fixed_path = os.path.join(BASE, f"{fname_base}_FIXED.docx")
        try:
            reorder_zip(docx_path, fixed_path)
            sz = os.path.getsize(fixed_path)
            print(f"  fixed zip: {fname_base}_FIXED.docx ({sz} bytes)")
            results[key] = {'ok': True, 'js': js_name, 'docx': f"{fname_base}_FIXED.docx", 'size': sz, 'fname': fname_base}
        except Exception as e:
            print(f"  ZIP ERR: {e}")
            results[key] = {'ok': False, 'err': str(e)}

    print("\n\n=== SUMMARY ===")
    for k, v in results.items():
        if v.get('ok'):
            print(f"  OK  {k}: {v['docx']} ({v['size']} bytes)")
        else:
            print(f"  FAIL {k}: {v.get('err', '?')[:200]}")

    with open(os.path.join(BASE, 'orchestrate_results.json'), 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to orchestrate_results.json")

if __name__ == '__main__':
    main()
