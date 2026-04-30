# v11 Lesson Plan — TOKEN MAP

Every `{{token}}` in the v11 tokenised TEMPLATE blanks (`templates/WPS_<Subject>_LessonPlan_TEMPLATE_v11.docx`). Total: **133 unique tokens**.

The generator must populate every token before emitting a final lesson docx.

---

## Cover / header
| Token | Type | Example value |
|---|---|---|
| `{{school_name}}` | string | `Williamstown Primary School` |
| `{{subject}}` | string | `PE`, `Numeracy`, `Literacy`, `HASS`, `Visual Art`, `Music`, `French`, `Performing Arts`, `Wellbeing`, `Digital Tech`, `Science` |
| `{{year_level}}` | string | `Foundation`, `Year 2`, `Year 3`, `Year 4`, `Year 5`, `Year 6` |
| `{{term}}` | string | `Term 2`, `Term 3` |
| `{{week}}` | string | `Week 1` |
| `{{lesson_date}}` | string | `Mon 20 April 2026` |

## Page 1 — TODAY panel
| Token | Type | Notes |
|---|---|---|
| `{{lesson_title}}` | string | One-line lesson focus |
| `{{vc_codes}}` | string | VC2.0 codes joined with ` · ` |
| `{{sc_1}}`, `{{sc_2}}`, `{{sc_3}}` | string | "I can..." statements (full) |
| `{{cue_1}}`, `{{cue_2}}`, `{{cue_3}}` | string | Cue words (red, big) |
| `{{cue_words}}` | string | Joined cue words `cue_1 · cue_2 · cue_3` |

## Page 1 — Signal banner
| Token | Type | Example |
|---|---|---|
| `{{signal_1}}` | string | `1 whistle = FREEZE`, `1 clap = stop and look`, `1 drumbeat = freeze, sticks in lap` |
| `{{signal_2}}` | string | `2 whistles = come to teacher`, `2 claps = pencils down, eyes up` |

## Page 1 — Equipment / Entry / Exit
| Token | Type |
|---|---|
| `{{equipment_1}} ... {{equipment_5}}` | string × 5 |
| `{{entry_1}}, {{entry_2}}, {{entry_3}}` | string × 3 |
| `{{exit_1}}, {{exit_2}}, {{exit_3}}` | string × 3 |

## Page 1 — Phase strip timings
| Token | Type | Example |
|---|---|---|
| `{{warm_up_min}}` | int (string) | `6` |
| `{{explicit_min}}` | int (string) | `10` |
| `{{practice_min}}` | int (string) | `15` |
| `{{packup_min}}` | int (string) | `4` |

## Page 1 — Phase activity scripts
| Phase | Tokens |
|---|---|
| Warm-up | `{{warm_up_step_1}}`, `{{warm_up_step_2}}`, `{{warm_up_step_3}}`, `{{warm_up_say}}` |
| Explicit Teaching (I do) | `{{teach_step_1}}`, `{{teach_step_2}}`, `{{teach_step_3}}` |
| Practice (We do) | `{{practice_step_1}}`, `{{practice_step_2}}`, `{{practice_step_3}}`, `{{practice_say}}` |
| Application (You do) | `{{app_step_1}}`, `{{app_step_2}}`, `{{app_step_3}}`, `{{tier_summary}}`, `{{phase_label_4}}` |
| Pack-up & Reflect | `{{packup_step_1}}`, `{{packup_step_2}}`, `{{packup_say}}` |

## Page 1 — Behaviour / Rescue / CT notes
| Token | Type |
|---|---|
| `{{behaviour_1}} ... {{behaviour_4}}` | string × 4 |
| `{{rescue_1}}, {{rescue_2}}, {{rescue_3}}` | string × 3 |
| `{{ct_note_1}}, {{ct_note_2}}, {{ct_note_3}}` | string × 3 |

## Page 2 — Element 1 (Planning)
| Token | Notes |
|---|---|
| `{{vc_descriptors}}` | Plain-language strand descriptions, joined with ` · ` |
| `{{prior_1}}, {{prior_2}}, {{prior_3}}` | Where students are at |
| `{{sequence_summary}}` | One-line sequence summary across the term |
| `{{resources_prepared}}` | Pre-class prep notes |

## Page 2 — Element 2 (Enabling Learning)
| Token | Notes |
|---|---|
| `{{learning_intention}}` | Full LI sentence |
| `{{sc_1_short}}, {{sc_2_short}}, {{sc_3_short}}` | Short SC labels (used for cool-down) |
| `{{why_this_matters}}` | One-paragraph rationale |
| `{{vocab_tier1}}, {{vocab_tier2}}, {{vocab_tier3}}` | Comma-separated vocab |
| `{{routine_1}}, {{routine_2}}` | Routines for engagement |
| `{{self_reg_1}}, {{self_reg_2}}, {{self_reg_3}}` | Self-regulation prompts |

## Page 2 — Element 3 (Explicit Teaching · I do)
| Token | Notes |
|---|---|
| `{{focus_the_learning}}` | LI/SC announcement script |
| `{{teach_chunk_1}}, {{teach_chunk_2}}, {{teach_chunk_3}}` | Chunked explanation |
| `{{worked_example}}` | Worked example / modelled exemplar |
| `{{stem_1}}, {{stem_2}}, {{stem_3}}` | Sentence stems |
| `{{cfu_1}}` | Check for understanding 1 |

## Page 3 — Element 4 (Supported Application · We do → You do)
| Token | Notes |
|---|---|
| `{{practice_stem_1}}, {{practice_stem_2}}` | Sentence stems during practice |
| `{{cfu_2}}` | Check for understanding 2 |

## Page 3 — Tier 1 / Core / Tier 3 differentiation
| Token | Notes |
|---|---|
| `{{tier1_task_1}} ... {{tier1_task_4}}` | Modified task |
| `{{core_task_1}} ... {{core_task_4}}` | Main task |
| `{{tier3_task_1}} ... {{tier3_task_4}}` | Extension task |

## Page 3 — Reflection / Metacognition
| Token | Notes |
|---|---|
| `{{metacog_1}}, {{metacog_2}}, {{metacog_3}}` | Mandated metacognitive prompts |
| `{{retrieval_plan}}` | Retrieval / spaced practice |

## Page 3 — Inclusive priority cohorts
| Cohort | Tokens |
|---|---|
| EAL/D | `{{eald_1}} ... {{eald_4}}` |
| Koorie | `{{koorie_1}} ... {{koorie_4}}` |
| Disability | `{{disability_1}} ... {{disability_4}}` |
| Disadvantage | `{{disadv_1}} ... {{disadv_4}}` |

## Page 3 — Named adjustments + Assessment
| Token | Notes |
|---|---|
| `{{student_name_eg}}` | Example student name |
| `{{adjustment_eg}}` | Adjustment description |
| `{{support_eg}}` | Support detail |
| `{{lookfor_1}}, {{lookfor_2}}, {{lookfor_3}}` | Formative observation look-fors |
| `{{misconception_1}}, {{misconception_2}}, {{misconception_3}}` | Misconceptions to watch for |

---

## Generator API (hint)

The blank docx contains every `{{token}}` rendered in italic red as a placeholder. A generator should:

1. Pick the right blank: `templates/WPS_<Subject>_LessonPlan_TEMPLATE_v11_FIXED.docx`
2. Unzip → read `word/document.xml` → string-replace every `{{token}}` with the real value
3. Re-zip with `[Content_Types].xml` at zip position 0 (Word requires this — see `_build/orchestrate_subjects.py` for the reorder pattern)
4. Emit the filled docx

Token count: **133** — every one must be filled or Word will show the literal `{{token}}` text in red. Use the keys in `_build/subject_configs*.py` for sample values per subject.

## Subject-specific labels (already baked into each blank)

These are NOT tokens — they're hardcoded per blank because they're stable per subject:

- Equipment-section header (`EQUIPMENT` for PE, `MATERIALS` for Numeracy, `INSTRUMENTS` for Music, etc.)
- Signal label (`SIGNAL` vs `ATTENTION SIGNAL`)
- Phase strip names (`1. WARM-UP` vs `1. NUMBER TALK` vs `1. VOCAL WARM-UP`)
- Footer subject reference (e.g. `PE/Foundation/T2W1`)

If you need a generic-subject blank, use `templates/_build/build_v11_template.js` (the PE base) and run `orchestrate_blanks.py` after editing the labels-only substitution recipe.
