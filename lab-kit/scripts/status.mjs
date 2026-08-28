import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const missions = [
  ['P01', 'tests/work/p01_anatomy.spec.ts', false],
  ['P02', 'tests/work/p02_locators.spec.ts', true],
  ['P03', 'tests/work/p03_sync.spec.ts', false],
  ['P04', 'tests/work/p04_controls.spec.ts', false],
  ['P05', 'tests/work/p05_isolation.spec.ts', true],
  ['P06', 'tests/work/p06_auth.spec.ts', false],
  ['P07', 'tests/work/p07_refactor/refactor.spec.ts', true],
  ['P08', 'tests/work/p08_api.spec.ts', false],
  ['P09', 'tests/work/p09_seeded_bugs', true],
  ['P10', 'tests/work/p10_ci.spec.ts', false],
  ['P11', 'tests/work/p11_capstone.spec.ts', false],
];

const requiredInfrastructure = [
  'src/server.mjs',
  'playwright.config.ts',
  'tests/reference/core.spec.ts',
  'tests/reference/auth.spec.ts',
  'tests/reference/v4-infrastructure.spec.ts',
  'labs/qa-templates/DEBUG_JOURNAL.md',
  'labs/ci/broken/playwright.yml',
  'labs/ci/fixed/playwright.yml',
  '.github/workflows/playwright.yml',
];

function filesBelow(path) {
  if (!existsSync(path)) return [];
  const entry = readdirSync(path, { withFileTypes: true });
  return entry.flatMap(item => {
    const child = join(path, item.name);
    return item.isDirectory() ? filesBelow(child) : [child];
  });
}

function sourceFiles(relativePath) {
  const absolute = join(root, relativePath);
  if (!existsSync(absolute)) return [];
  return filesBelow(absolute).filter(path => path.endsWith('.ts'));
}

function missionState(relativePath, fixmeIsTheTask) {
  const files = relativePath.endsWith('.ts')
    ? [join(root, relativePath)].filter(existsSync)
    : sourceFiles(relativePath);
  if (files.length === 0) return { label: 'missing', tests: 0, fixme: 0, todos: 0 };

  const source = files.map(file => readFileSync(file, 'utf8')).join('\n');
  const fixme = (source.match(/\btest\.fixme\s*\(/g) ?? []).length;
  const skipped = (source.match(/\btest\.skip\s*\(/g) ?? []).length;
  const active = (source.match(/\btest\s*\(/g) ?? []).length;
  const tests = fixme + skipped + active;
  const todos = (source.match(/\bTODO\b/g) ?? []).length;

  let label = 'not-started';
  if (tests === 0) label = 'no-tests';
  else if (fixme + skipped === 0 && todos === 0) label = 'candidate-gate';
  else if (fixme + skipped === tests && todos === 0 && fixmeIsTheTask) label = 'seed-ready';
  else if (active > 0 || fixme < tests) label = 'in-progress';
  return { label, tests, fixme: fixme + skipped, todos };
}

const missing = requiredInfrastructure.filter(path => !existsSync(join(root, path)));
const dependenciesInstalled = existsSync(join(root, 'node_modules', '@playwright', 'test'));
const foundationFiles = filesBelow(join(root, 'foundations')).filter(path => !path.endsWith('.DS_Store'));

process.stdout.write('Self-study lab-kit status\n');
process.stdout.write(`Root: ${root}\n`);
process.stdout.write(`Dependencies: ${dependenciesInstalled ? 'installed' : 'missing — run npm ci'}\n`);
process.stdout.write(`Infrastructure: ${missing.length === 0 ? 'complete' : `missing ${missing.length}`}\n`);
for (const path of missing) process.stdout.write(`  - ${path}\n`);

process.stdout.write('\nPlaywright missions\n');
for (const [id, path, fixmeIsTheTask] of missions) {
  const state = missionState(path, fixmeIsTheTask);
  process.stdout.write(
    `${id.padEnd(4)} ${state.label.padEnd(14)} tests=${String(state.tests).padEnd(2)} fixme/skip=${String(state.fixme).padEnd(2)} TODO=${state.todos}\n`,
  );
}

process.stdout.write(`\nFoundation assets: ${foundationFiles.length === 0 ? 'pending/not present' : `${foundationFiles.length} file(s)`}\n`);
if (foundationFiles.length > 0) {
  const topLevel = [...new Set(foundationFiles.map(path => relative(join(root, 'foundations'), path).split('/')[0]))];
  process.stdout.write(`Foundation groups: ${topLevel.join(', ')}\n`);
}

process.stdout.write('\nLegend: seed-ready means the executable diagnosis/refactor starter is intentionally fixme without placeholder TODOs.\n');
process.stdout.write('Status is inferred from markers; it is not a mastery claim.\n');
process.stdout.write('A mission passes only after its no-AI transfer gate and evidence review.\n');

if (process.argv.includes('--run-reference')) {
  if (!dependenciesInstalled) {
    process.stderr.write('\nCannot run reference checks: dependencies are missing. Run npm ci first.\n');
    process.exitCode = 2;
  } else {
    process.stdout.write('\nRunning reference infrastructure checks...\n');
    const result = spawnSync('npm', ['run', 'check-kit'], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    process.exitCode = result.status ?? 1;
  }
}
