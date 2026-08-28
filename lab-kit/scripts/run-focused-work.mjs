import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rawArgs = process.argv.slice(2);
const foundationArg = rawArgs.find(argument => argument.startsWith('--foundation='));
const foundationId = foundationArg?.slice('--foundation='.length).toUpperCase();
const targets = rawArgs.filter(argument => !argument.startsWith('--foundation='));

if (targets.length === 0) {
  console.error('Usage: node scripts/run-focused-work.mjs [--foundation=LESSON] <spec-or-folder> [...]');
  process.exit(2);
}

function collectSpecs(path) {
  if (!existsSync(path)) {
    console.error(`Focused lab target does not exist: ${path}`);
    process.exit(2);
  }

  if (!statSync(path).isDirectory()) return path.endsWith('.ts') ? [path] : [];

  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const child = `${path}/${entry.name}`;
    if (entry.isDirectory()) return collectSpecs(child);
    return child.endsWith('.ts') ? [child] : [];
  });
}

const specFiles = targets.flatMap(collectSpecs);
if (specFiles.length === 0) {
  console.error(`No TypeScript spec found under: ${targets.join(', ')}`);
  process.exit(2);
}

const blocked = specFiles.filter(path =>
  /\btest(?:\.describe)?\.(?:fixme|skip)\s*\(/.test(readFileSync(path, 'utf8'))
);
if (blocked.length > 0) {
  console.error('FOCUSED LAB BLOCKED: target tests are still marked fixme/skip.');
  console.error('After making a real attempt, replace the marker with an active test(...) in:');
  for (const path of blocked) console.error(`- ${path}`);
  console.error('The command exits non-zero so skipped tests can never count as completion.');
  process.exit(2);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (foundationId) {
  run(process.execPath, ['foundations/scripts/run-suite.mjs', 'work', foundationId]);
  if (foundationId.startsWith('TS')) {
    const tsc = fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url));
    run(process.execPath, [tsc, '-p', 'foundations/tsconfig.json', '--noEmit']);
  }
}

const playwrightCli = fileURLToPath(new URL('../node_modules/playwright/cli.js', import.meta.url));
run(process.execPath, [playwrightCli, 'test', ...targets]);
