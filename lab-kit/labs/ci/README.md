# P10 CI repair lab

`broken/playwright.yml` is inert teaching material. It contains three explicit defects:

1. dependency install is not lockfile-reproducible;
2. the runner never installs a browser;
3. evidence uploads only after success and uses the wrong path.

Do not copy it into `.github/workflows` and trial-and-error random YAML. First fill `labs/qa-templates/CI_TRIAGE.md`, predict the failed stage and decisive log. Compare with `fixed/playwright.yml` only after the timebox.

The active example at `.github/workflows/playwright.yml` is a safe reference workflow. It runs the reference infrastructure suite, not unfinished `tests/work` missions.

Suggested progression:

```bash
npm ci
npx playwright install chromium
npm run check:types
npm run check-kit
npm run status
```

For real CI, Chromium is installed with OS dependencies. A deliberately red run must still publish `playwright-report/` and `test-results/`.
