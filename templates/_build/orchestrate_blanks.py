"""Build per-subject TOKENISED TEMPLATE blanks from PE blank base.

Substitutes ONLY subject labels (not content). Content stays as {{tokens}} so
the generator can fill them in.
"""
import sys, os, subprocess, zipfile, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import subject_configs as cfg1
import subject_configs_2 as cfg2

BASE = os.path.dirname(os.path.abspath(__file__))
PE_BLANK = os.path.join(BASE, 'build_v11_template.js')

ALL = {}
ALL.update(cfg1.SUBJECTS)
ALL.update(cfg2.SUBJECTS_2)

print("Loaded", len(ALL), "subject configs:", list(ALL.keys()))


def labels_only_subs(c):
    """Return list of (old, new) for SUBJECT-LABEL replacements only.
    Keeps {{tokens}} unchanged.
    """
    subj = c['subject']
    yr = c['year']
    yr_short = c['year_short']
    fname_base = "WPS_" + subj.replace(' ', '_') + "_LessonPlan_TEMPLATE_v11"
    return [
        # File header comment
        ('// WPS_PE_LessonPlan_TEMPLATE_v11.docx',
         '// ' + fname_base + '.docx'),
        # Subject in title block
        ('PE \\u2014 Lesson Plan',
         subj + ' \\u2014 Lesson Plan'),
        # Year level (page 1) — replace the hard-coded "Foundation" only as a label
        ('Year level: Foundation', 'Year level: ' + yr),
        # Equipment header label
        ('cell(headLine("EQUIPMENT")',
         'cell(headLine("' + c['equipment_label'] + '")'),
        # Signal label
        ('T("SIGNAL: ", { bold: true, size: 22 })',
         'T("' + c['signal_label'] + ': ", { bold: true, size: 22 })'),
        # Phase strip labels (1.WARM-UP etc.)
        ('1. WARM-UP', c['phase_1']),
        ('2. EXPLICIT TEACHING', c['phase_2']),
        ('3. PRACTICE (We do)', c['phase_3']),
        ('4. APPLICATION (You do)', c['phase_4']),
        ('5. PACK UP', c['phase_5']),
        # Phase activity row labels
        ('phRow("WARM-UP", "6"', 'phRow("' + c['phase_label_1'] + '", "6"'),
        ('phRow("EXPLICIT TEACHING (I do)", "10"', 'phRow("' + c['phase_label_2'] + '", "10"'),
        ('phRow("PRACTICE (We do)", "15"', 'phRow("' + c['phase_label_3'] + '", "15"'),
        ('phRow("APPLICATION (You do)", "15"', 'phRow("' + c['phase_label_4'] + '", "15"'),
        ('phRow("PACK UP & REFLECT", "4"', 'phRow("' + c['phase_label_5'] + '", "4"'),
        # Page 2/3 banner subject context
        ('PE \\u00b7 Foundation \\u00b7 T2W1', subj + ' \\u00b7 ' + yr + ' \\u00b7 T2W1'),
        # Vocab tier 3 label (PE-specific subject)
        ('Tier 3 (PE):', 'Tier 3 (' + subj + '):'),
        # Doc title
        ('WPS PE Lesson Plan TEMPLATE v11',
         'WPS ' + subj + ' Lesson Plan TEMPLATE v11'),
        # Header label
        ('PE/Foundation/T2W1',  subj + '/' + yr + '/T2W1'),
        # Footer
        ('[School Name] \\u00b7 PE \\u00b7 Foundation T2W1',
         '[School Name] \\u00b7 ' + subj + ' \\u00b7 ' + yr + ' T2W1'),
        # writeFileSync output filename
        ('WPS_PE_LessonPlan_TEMPLATE_v11.docx', fname_base + '.docx'),
        # Replace tier 1/core/tier 3 task labels if present
    ]


def apply_subs(content, subs):
    out = content
    for old, new in subs:
        if old in out:
            out = out.replace(old, new)
        else:
            print("    (skip not-found):", old[:50])
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
    with open(PE_BLANK, 'r', encoding='utf-8') as f:
        base = f.read()

    results = {}
    for key, c in ALL.items():
        subj_safe = c['subject'].replace(' ', '_')
        fname_base = "WPS_" + subj_safe + "_LessonPlan_TEMPLATE_v11"
        js_name = "build_" + key.lower() + "_v11_template.js"
        js_path = os.path.join(BASE, js_name)
        print("\n===", key, "(blank) ===")
        out = apply_subs(base, labels_only_subs(c))
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(out)
        print("  wrote", js_name, "(" + str(len(out)) + " bytes)")

        try:
            r = subprocess.run(['node', js_path], capture_output=True, text=True, timeout=30, cwd=BASE)
            if r.returncode != 0:
                print("  NODE FAIL:", r.stderr[:300])
                results[key] = {'ok': False, 'err': r.stderr[:300]}
                continue
            print("  node:", r.stdout.strip())
        except Exception as e:
            print("  NODE ERR:", str(e))
            results[key] = {'ok': False, 'err': str(e)}
            continue

        docx_path = os.path.join(BASE, fname_base + ".docx")
        fixed_path = os.path.join(BASE, fname_base + "_FIXED.docx")
        try:
            reorder_zip(docx_path, fixed_path)
            sz = os.path.getsize(fixed_path)
            print("  fixed zip:", fname_base + "_FIXED.docx (" + str(sz) + " bytes)")
            results[key] = {'ok': True, 'js': js_name, 'docx': fname_base + "_FIXED.docx", 'size': sz, 'fname': fname_base}
        except Exception as e:
            print("  ZIP ERR:", str(e))
            results[key] = {'ok': False, 'err': str(e)}

    print("\n=== SUMMARY (blanks) ===")
    for k, v in results.items():
        if v.get('ok'):
            print("  OK ", k, ":", v['docx'], "(" + str(v['size']) + " bytes)")
        else:
            print("  FAIL", k, ":", str(v.get('err', '?'))[:200])

    with open(os.path.join(BASE, 'orchestrate_blanks_results.json'), 'w') as f:
        json.dump(results, f, indent=2)
    print("\nResults saved to orchestrate_blanks_results.json")


if __name__ == '__main__':
    main()
