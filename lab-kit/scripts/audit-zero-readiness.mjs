import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const labRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packRoot = dirname(labRoot);

function read(relativePath) {
  return readFileSync(join(packRoot, relativePath), 'utf8');
}

function requireAudit(condition, message) {
  if (!condition) throw new Error(`Zero-readiness audit: ${message}`);
}

function outsideFenceLines(text) {
  let fence = null;
  const result = [];

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    const marker = trimmed.match(/^(`{3,}|~{3,})/)?.[1];
    if (marker) {
      const family = marker[0];
      if (fence === null) fence = family;
      else if (fence === family) fence = null;
      continue;
    }
    if (fence === null) result.push(line);
  }

  return result;
}

function lessonSections(relativePath, expectedIds) {
  const text = read(relativePath);
  const lines = outsideFenceLines(text);
  const sections = new Map();
  let currentId = null;

  for (const line of lines) {
    const heading = line.match(/^#\s+([A-Z]{1,2}\d{1,2})\b/);
    if (heading && expectedIds.includes(heading[1])) {
      currentId = heading[1];
      requireAudit(!sections.has(currentId), `${relativePath} duplicates lesson heading ${currentId}`);
      sections.set(currentId, []);
      continue;
    }
    if (currentId) sections.get(currentId).push(line);
  }

  for (const id of expectedIds) {
    requireAudit(sections.has(id), `${relativePath} misses lesson heading ${id}`);
  }
  return sections;
}

const foundationIds = [
  'QA00',
  ...Array.from({ length: 8 }, (_, index) => `JS${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 4 }, (_, index) => `TS${String(index + 1).padStart(2, '0')}`),
];
const playwrightIds = Array.from({ length: 11 }, (_, index) => `P${String(index + 1).padStart(2, '0')}`);
const jobIds = Array.from({ length: 7 }, (_, index) => `J${String(index + 1).padStart(2, '0')}`);
const springIds = ['J00', ...Array.from({ length: 7 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`)];
const conceptIds = [...foundationIds, ...playwrightIds, ...jobIds, ...springIds];

const lessonSources = [
  ['source/teaching/01_zero_foundation.md', foundationIds],
  ['source/teaching/02_qa_api_sql_ci.md', jobIds],
  ['source/teaching/03_playwright_core.md', playwrightIds],
  ['source/teaching/04_spring_swp_full.md', springIds],
];

const requiredBlocks = [
  ['mental model', heading => heading.startsWith('mental model')],
  ['worked example', heading => heading.startsWith('worked')],
  ['prediction', heading => heading.startsWith('prediction')],
  ['completion', heading => heading.startsWith('completion')],
  ['independent', heading => heading.startsWith('independent')],
  ['failure injection', heading => heading.startsWith('failure injection')],
  ['transfer', heading => heading.startsWith('transfer')],
  ['gate', heading => heading.startsWith('gate')],
];

for (const [relativePath, ids] of lessonSources) {
  const sections = lessonSections(relativePath, ids);
  for (const id of ids) {
    const section = sections.get(id);
    const headings = section
      .map(line => line.match(/^##\s+(.+)$/)?.[1]?.trim().toLowerCase())
      .filter(Boolean);
    for (const [label, matches] of requiredBlocks) {
      requireAudit(headings.some(matches), `${id} misses explicit ${label} block in ${relativePath}`);
    }
    if (foundationIds.includes(id)) {
      requireAudit(section.join('\n').toLowerCase().includes('no-ai'), `${id} misses a No-AI drill`);
    }
  }
}

const hintSections = lessonSections('source/hints_and_rubrics_v4.md', conceptIds);
for (const id of conceptIds) {
  const headings = hintSections.get(id)
    .map(line => line.match(/^##\s+(H[1-5])(?:\s|$)/)?.[1])
    .filter(Boolean);
  for (const level of ['H1', 'H2', 'H3', 'H4', 'H5']) {
    requireAudit(headings.includes(level), `${id} hint ladder misses ${level}`);
  }
}

const manifest = JSON.parse(read('source/lab_contracts_v4.json'));
const contractIds = manifest.modules.map(module => module.id);
const requiredContractIds = [
  ...foundationIds,
  ...playwrightIds,
  ...jobIds,
  ...springIds,
  ...Array.from({ length: 8 }, (_, index) => `W${index + 1}`),
];
for (const id of requiredContractIds) {
  requireAudit(contractIds.includes(id), `lab contract misses individual module ${id}`);
}
for (const grouped of ['S01-S02', 'S03-S04', 'S06-S07']) {
  requireAudit(!contractIds.includes(grouped), `legacy grouped contract remains: ${grouped}`);
}

const packageData = JSON.parse(read('lab-kit/package.json'));
const scripts = packageData.scripts ?? {};
for (const id of [...playwrightIds, 'JS08', 'TS04']) {
  const scriptName = `lab:${id.toLowerCase()}`;
  requireAudit(scriptName in scripts, `${id} focused script is missing`);
  requireAudit(scripts[scriptName].includes('run-focused-work.mjs'), `${id} focused script bypasses skip guard`);
}

const focusedRunner = read('lab-kit/scripts/run-focused-work.mjs');
for (const token of ['fixme|skip', 'process.exit(2)', 'playwright/cli.js']) {
  requireAudit(focusedRunner.includes(token), `focused runner misses ${token}`);
}

function forbid(relativePaths, patterns, label) {
  for (const relativePath of relativePaths) {
    const text = read(relativePath);
    for (const pattern of patterns) {
      requireAudit(!pattern.test(text), `${label}: ${relativePath} leaks ${pattern}`);
    }
  }
}

forbid(
  [
    'lab-kit/foundations/work/js01.mjs',
    'lab-kit/foundations/worked/js01.mjs',
    'lab-kit/foundations/reference/js01.mjs',
  ],
  [/\bif\s*\(/, /\bfor\s*\(/, /\bfunction\b/, /=>/, /\breturn\b/, /\bthrow\b/, /console\.log\s*\(\s*\{/],
  'JS01 prerequisite',
);

forbid(
  [
    'lab-kit/foundations/work/js02.mjs',
    'lab-kit/foundations/worked/js02.mjs',
    'lab-kit/foundations/reference/js02.mjs',
  ],
  [/\bfunction\b/, /=>/, /\breturn\b/, /\bthrow\b/, /\bexport\b/, /\.(map|filter|reduce|find|some|every)\s*\(/],
  'JS02 prerequisite',
);

forbid(
  ['lab-kit/foundations/reference/js03.mjs'],
  [/Object\.entries/, /Object\.keys/, /\bnew\s+Map\b/, /\bnew\s+Set\b/],
  'JS03 prerequisite',
);

forbid(
  ['lab-kit/foundations/reference/js04.mjs'],
  [/\?\?/, /\?\./],
  'JS04 prerequisite',
);

forbid(
  [
    'lab-kit/foundations/work/js05.mjs',
    'lab-kit/foundations/work/js05-monolith.mjs',
    'lab-kit/foundations/reference/js05.mjs',
    'lab-kit/labs/js05/laundry-data-tools/starter/run.mjs',
    'lab-kit/labs/js05/laundry-data-tools/reference/run.mjs',
  ],
  [/\basync\b/, /\bawait\b/, /node:fs\/promises/],
  'JS05 prerequisite',
);

forbid(
  [
    'lab-kit/foundations/work/ts01.ts',
    'lab-kit/foundations/worked/ts01.ts',
    'lab-kit/foundations/reference/ts01.ts',
  ],
  [/\breadonly\b/, /\bReadonly\s*</, /\bany\b/, /@ts-ignore/],
  'TS01 prerequisite',
);

forbid(
  ['lab-kit/foundations/reference/ts03.ts'],
  [/\sas\s+(?:const|[A-Z{(])/, /@ts-ignore/, /\bany\b/],
  'TS03 validation',
);

const allTeaching = [
  read('source/teaching/00_learning_contract.md'),
  ...lessonSources.map(([relativePath]) => read(relativePath)),
].join('\n');
for (const stale of ['lab:js02:predict', 'labs/js02/predict.mjs', 'F00', 'F08']) {
  requireAudit(!allTeaching.includes(stale), `stale teaching alias/path remains: ${stale}`);
}

requireAudit(existsSync(join(packRoot, 'lab-kit/labs/js06/predict.mjs')), 'JS06 prediction sandbox is missing');
requireAudit(!existsSync(join(packRoot, 'lab-kit/labs/js02/predict.mjs')), 'misplaced JS02 async sandbox still exists');
requireAudit(existsSync(join(packRoot, 'lab-kit/foundations/type-tests/ts01.learner-errors.ts')), 'TS01 learner type-test scaffold is missing');
requireAudit(existsSync(join(packRoot, 'lab-kit/foundations/type-tests/ts02.learner-errors.ts')), 'TS02 learner type-test scaffold is missing');
requireAudit(existsSync(join(packRoot, 'lab-kit/foundations/type-tests/ts04.learner-errors.ts')), 'TS04 learner type-test scaffold is missing');

for (const legacy of [
  'lab-kit/labs/spring-reverse/MVC_PRG_TRACE.md',
  'lab-kit/labs/spring-reverse/PERSISTENCE_QUERY_TRACE.md',
  'lab-kit/labs/spring-reverse/SECURITY_TRACE.md',
  'lab-kit/labs/spring-reverse/FULL_VERTICAL_TRACE.md',
]) {
  requireAudit(!existsSync(join(packRoot, legacy)), `legacy shared Spring card remains: ${legacy}`);
}

for (let wave = 1; wave <= 8; wave += 1) {
  const relativePath = `lab-kit/labs/swp-waves/W${wave}_EVIDENCE.md`;
  requireAudit(existsSync(join(packRoot, relativePath)), `missing ${relativePath}`);
  requireAudit(read(relativePath).includes('Status: OPEN'), `${relativePath} must start unearned`);
}

console.log(`PASS: zero-readiness audit (${conceptIds.length} lessons, ${requiredContractIds.length} individual contracts)`);
