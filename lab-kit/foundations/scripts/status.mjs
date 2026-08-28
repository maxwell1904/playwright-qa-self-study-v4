import { readFile } from 'node:fs/promises';
import { lessons } from '../catalog.mjs';

let open = 0;

console.log('Foundation lab status');
console.log('ID    worked  work  reference  tests  TODOs');

for (const lesson of lessons) {
  const base = lesson.id.toLowerCase();
  const ext = lesson.extension;
  const paths = {
    worked: new URL(`../worked/${base}.${ext}`, import.meta.url),
    work: new URL(`../work/${base}.${ext}`, import.meta.url),
    reference: new URL(`../reference/${base}.${ext}`, import.meta.url),
    tests: new URL(`../tests/${base}.test.${ext === 'ts' ? 'ts' : 'mjs'}`, import.meta.url)
  };

  const companionUrls = (lesson.companions ?? []).map(name => new URL(`../work/${name}`, import.meta.url));

  const contents = {};
  for (const [kind, url] of Object.entries(paths)) {
    try {
      contents[kind] = await readFile(url, 'utf8');
    } catch {
      contents[kind] = null;
    }
  }

  const companionContents = [];
  for (const url of companionUrls) {
    try {
      companionContents.push(await readFile(url, 'utf8'));
    } catch {
      companionContents.push('TODO MISSING_COMPANION');
    }
  }
  const todos = ([contents.work, ...companionContents].filter(Boolean).join('\n').match(/TODO/g) ?? []).length;
  open += todos;
  const marker = kind => contents[kind] === null ? 'MISS' : 'yes ';
  console.log(
    `${lesson.id.padEnd(5)} ${marker('worked').padEnd(7)} ${marker('work').padEnd(5)} ${marker('reference').padEnd(10)} ${marker('tests').padEnd(6)} ${todos}`
  );
}

console.log(`\nOpen TODO markers: ${open}`);
console.log('A zero TODO count is not a gate; run work tests and the no-AI transfer.');
