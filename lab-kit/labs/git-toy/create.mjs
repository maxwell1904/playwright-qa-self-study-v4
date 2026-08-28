import { cp, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const target = await mkdtemp(join(tmpdir(), 'swp391-git-toy-'));
await cp(new URL('./seed/', import.meta.url), target, { recursive: true });
await writeFile(join(target, '.env.example.local'), 'FAKE_TOKEN=training-only-not-a-secret\n');

for (const args of [
  ['init', '-b', 'main'],
  ['config', 'user.name', 'Self Study Learner'],
  ['config', 'user.email', 'learner@example.invalid'],
  ['add', '.gitignore', 'REQUIREMENT.md', 'collection.mjs', 'collection.test.mjs'],
  ['commit', '-m', 'test: establish collection guard baseline'],
]) {
  const result = spawnSync('git', args, { cwd: target, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
}

console.log(target);
console.log('Base created. The fake *.local file is untracked so the staging mistake can be reproduced safely.');
