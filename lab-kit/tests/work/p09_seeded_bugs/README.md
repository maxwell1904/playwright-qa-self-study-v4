# P09 seeded bugs

Each spec is skipped by `test.fixme` so the default work suite remains runnable. Work on one bug at a time:

1. Open the matching pre-created note under `bug-notes/`; each seeded bug has its own evidence record.
2. Remove `fixme` from exactly one test.
3. For the first ten minutes, do not patch. Record expected, actual and 2-3 hypotheses.
4. Use the cheapest decisive evidence: call log, trace DOM/URL/network, owned-state readback or exact environment value.
5. Apply the smallest repair and run focused + proportional regression.
6. Reintroduce the bug once. The repaired regression must fail for the original reason.

Seeded classes:

- `missing-await.spec.ts` - test-code race.
- `duplicate-locator.spec.ts` - ambiguous semantic target.
- `shared-owner.spec.ts` - backend state has no test owner.
- `wrong-environment.spec.ts` - configuration points at an unreachable target.

Do not merge all four diagnoses into one generic note. A root cause is accepted only when
the corresponding note contains decisive evidence and a regression scope.
