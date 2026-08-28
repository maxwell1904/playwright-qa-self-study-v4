# Playwright + QA + SWP391 v4 runnable lab kit

This is a small deterministic practice system for zero-to-junior QA skills. It gives browser, HTTP/API, auth, shared-state, CI and failure surfaces without pretending to be the canonical Laundry implementation.

The sandbox JSON API is for API practice only. **Do not copy `/api/*`, `/tasks` or `/test-support/*` into Laundry.** Canonical Laundry remains one server-rendered Spring MVC/Thymeleaf application with its approved routes, rules and tables.

## First setup

Requirements:

- Node.js 22 or newer;
- npm;
- Git;
- Chromium installed by Playwright.

From this directory:

```bash
npm ci
npx playwright install chromium
npm run status
npm run check:all
```

`npm ci` uses the lockfile. If it fails, preserve the first meaningful error instead of replacing it with an unpinned install.

## Daily commands

| Command | Purpose |
| --- | --- |
| `npm run status` | show infrastructure and P01-P11 starter state |
| `npm run status:verify` | show status, then run trusted reference infrastructure checks |
| `npm run typecheck` | strict TypeScript check for root Playwright and foundation contracts |
| `npm run check:kit` | verify the sandbox/reference suite; should be green before a mission |
| `npm run foundation:test:reference` | verify all QA00/JS/TS reference contracts |
| `npm run foundation:test:work -- JS03` | run one open foundation starter (red until completed) |
| `npm test` | list/run work specs; unfinished missions are `fixme` |
| `npm run zero:audit` | verify per-lesson blocks, hint ladders, prerequisite order and false-green guards |
| `npm run lab:p03` | run one mission and fail if its starter is still `fixme` |
| `npm run test:ui` | open Playwright UI mode for work specs |
| `npm run show-report` | open the latest HTML report |
| `npm run lab:qa00` ... `npm run lab:ts04` | run the exact current foundation completion contract |
| `npm run lab:js06:predict` | run the async/event-loop prediction sandbox after writing JS06 predictions |
| `npm run lab:p01` ... `npm run lab:p11` | run one Playwright mission; exits non-zero while any target test is still `fixme` |
| `npm run lab:j01` | run the J01 mutation toy baseline |
| `npm run lab:j04` | create a disposable Git repository in the OS temp directory |
| `npm run lab:j06:check` | validate the Compose topology file without starting Docker |

Foundation-specific commands are listed under `foundations/` when that pack is present. Root scripts never infer mastery from a green generated solution.

## How to work a mission

1. Read only the current P-section and its work spec.
2. Copy the relevant file from `labs/qa-templates/`.
3. Write prediction, risk and oracle before running code.
4. Remove `test.fixme` from exactly the test being attempted.
5. Use docs/search for syntax before asking for a full patch.
6. Cause one deliberate failure and preserve the first meaningful error/evidence.
7. Complete an unseen no-AI variation before marking the gate passed.
8. Run focused checks, then proportional regression.

`tests/reference/` protects infrastructure and contains v3 reference behavior. It is H5/reference material, not a file to copy during the first timebox.

## P01-P11 work map

| Mission | Starter | Main skill/evidence |
| --- | --- | --- |
| P01 | `tests/work/p01_anatomy.spec.ts` | Arrange/Act/Assert, behavior name, business oracle |
| P02 | `tests/work/p02_locators.spec.ts` | semantic locator, row scope, strictness |
| P03 | `tests/work/p03_sync.spec.ts` | actionability, PRG, re-render, no sleep |
| P04 | `tests/work/p04_controls.spec.ts` | labelled form controls, select/check/file, invalid case |
| P05 | `tests/work/p05_isolation.spec.ts` | first reproduce deliberate shared-owner pollution, then repair ownership/cleanup |
| P06 | `tests/work/p06_auth.spec.ts` | anonymous/STAFF/MANAGER/CSRF matrix |
| P07 | `tests/work/p07_refactor/` | config, helper, builder and fixture only from real pressure |
| P08 | `tests/work/p08_api.spec.ts` | runtime JSON checks, auth, negative case, UI-API hybrid |
| P09 | `tests/work/p09_seeded_bugs/` | evidence-first diagnosis of four failure classes |
| P10 | `tests/work/p10_ci.spec.ts` | broken/fixed workflow contracts and artifact evidence |
| P11 | `tests/work/p11_capstone.spec.ts` + `labs/p11/` | company-style ticket from risk/data plan through CI evidence |

`tests/work/mission.spec.ts` is preserved from v3 for backward reference. P01-P11 are the v4 path.

## Exact foundation artifacts

Part I completion starters are the files in `foundations/work/`, not implied filenames from an
older draft. QA00 is `foundations/work/qa00.mjs`; JS01 also uses
`foundations/work/js01_service_snapshot.mjs`, while its deliberate failures stay isolated in
`foundations/work/js01_failure_playground.mjs`; JS07 learner assertions live in
`foundations/work/js07.learner.test.mjs`. The real-browser bridges are
`tests/work/foundation/js08_bridge.spec.ts` and `tests/work/foundation/ts04_bridge.spec.ts`.

Run one ID with its `npm run lab:<lowercase-id>` script. The corresponding `reference/` tree is
H5 material and is verified by `npm run foundation:test:reference` plus `npm run check:kit`.

## Browser routes

| Route | Practice surface |
| --- | --- |
| `/services` | semantic service table |
| `/orders`, `/orders?order=desc` | duplicate actions and business-row identity |
| `/rerender` | locator re-resolution after node replacement |
| `/slow-form` | overlay, actionability, POST/303/GET and visible status |
| `/delayed-control` | disabled control becomes enabled without a known delay |
| `/controls` | fill/select/check/file and client-side summary/validation |
| `/customer-state?owner=...` | backend state ownership and UI-API hybrid proof |
| `/login`, `/dashboard`, `/manager` | session role and CSRF boundaries |

Sandbox accounts are `staff` and `manager`; the local-only password is `lab`.

## Practice API contracts

These routes are disposable training infrastructure, not Laundry contracts.

| Route | Contract |
| --- | --- |
| `GET /api/services` | public active service JSON with stable business fields |
| `GET/PUT/DELETE /api/customers/:owner` | owned customer state; requires `Authorization: Bearer lab-api-token` |
| `GET/POST /tasks` | list/create disposable tasks |
| `GET/PATCH/DELETE /tasks/:id` | read, `OPEN → DONE`, cleanup |

Customer phone must be ten digits beginning with `0`. Task title is 3-80 characters, priority is `LOW`, `MEDIUM` or `HIGH`, and duplicate title returns `409`. Tests must create unique data and clean only what they own.

For local experiments:

```bash
LAB_API_TOKEN=lab-api-token npm test
```

Never log a real token/cookie/credential from an internship system.

## Reset boundary

Reference checks reset only state they own. The local test-support route is:

```text
POST /test-support/reset?owner=<owned-id>
```

Omitting `owner` resets all sandbox state and is intended only for manual recovery. Do not copy a global reset route into production Laundry. Use test profiles, migrations/seeds, unique data and controlled cleanup in the real project.

## Debugging

Useful commands:

```bash
npx playwright test tests/work/p03_sync.spec.ts --headed
npx playwright test tests/work/p09_seeded_bugs/missing-await.spec.ts --trace on
npx playwright test --repeat-each=3 --workers=2 tests/work/p05_isolation.spec.ts
npx playwright show-report
```

Start with the first meaningful error, expected/actual, 2-3 falsifiable hypotheses and the cheapest decisive evidence. Use `labs/qa-templates/DEBUG_JOURNAL.md`. Increasing timeout/retry is not a diagnosis.

## CI repair lab

- `labs/ci/broken/playwright.yml` is intentionally broken and inert.
- `labs/ci/fixed/playwright.yml` is the reference after the diagnosis timebox.
- `.github/workflows/playwright.yml` is the active safe example.

The active workflow uses `npm ci`, installs Chromium, typechecks both roots, runs the foundation and browser reference contracts, and uploads report/results with `if: always()`. Unfinished work specs are not a release gate. During P10/J05, the learner temporarily runs one enabled work spec on a disposable branch to prove a red job and artifact retention; that deliberate red experiment is not committed as the pack's active baseline.

## J01-J07 artifacts

- J01: `labs/j01/` contains UC-20/UC-25 design sheets and a runnable mutation toy.
- J02: `labs/j02/HTTP_TRACE_MATRIX.md` pairs with `tests/work/p08_api.spec.ts`.
- J03: `labs/sql/` contains PostgreSQL schema, seed, starter queries and H5 reference queries.
- J04: `labs/git-toy/` safely creates a disposable repository outside this pack.
- J05: `labs/ci/` contains inert broken/fixed workflows; `.github/workflows/` is the active reference baseline.
- J06: `labs/docker/` contains a PostgreSQL-only Compose topology and data-safety notes.
- J07: `labs/j07/` plus `labs/qa-templates/` contains reporting and evidence templates.

## QA and Spring evidence

- `labs/qa-templates/` contains risk, bug, debug, API, CI, evidence and no-AI transfer cards.
- `labs/spring-reverse/` contains one distinct J00/S01-S07 request-flow/disturbance card per lesson.
- `labs/swp-waves/W1_EVIDENCE.md` through `W8_EVIDENCE.md` keep each implementation wave open until
  a real repo/commit, runtime evidence, failure variation and teach-back exist.

The Spring cards do not scaffold a second application. Use them against the real Laundry route → Security → Controller → Service → Repository/JPA → PostgreSQL → view/redirect chain.

## What “green” means

- `check-kit` green: sandbox infrastructure behaves as promised.
- a work spec green: one implementation currently satisfies its assertions.
- a mission passed: the learner can explain it, repair a variation, debug evidence-first and complete an unseen no-AI transfer.

Only the third is evidence of learning.
