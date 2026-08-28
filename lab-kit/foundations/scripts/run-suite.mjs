import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { lessons, findLesson } from '../catalog.mjs';

const requestedTarget = process.argv[2] ?? 'work';
if (!['work', 'reference'].includes(requestedTarget)) {
  console.error('Usage: node foundations/scripts/run-suite.mjs <work|reference> [LESSON_ID]');
  process.exit(2);
}

const selected = process.argv[3] ? [findLesson(process.argv[3])] : lessons;
const testFiles = selected.map(lesson =>
  fileURLToPath(new URL(`../tests/${lesson.id.toLowerCase()}.test.${lesson.extension === 'ts' ? 'ts' : 'mjs'}`, import.meta.url))
);

console.log(`Foundation target: ${requestedTarget}`);
console.log(`Lessons: ${selected.map(lesson => lesson.id).join(', ')}`);

const result = spawnSync(
  process.execPath,
  ['--test', '--test-concurrency=1', ...testFiles],
  {
    env: { ...process.env, FOUNDATION_TARGET: requestedTarget },
    stdio: 'inherit'
  }
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
