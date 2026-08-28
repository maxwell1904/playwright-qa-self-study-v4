import { lessons, findLesson } from '../catalog.mjs';

const selected = process.argv[2] ? [findLesson(process.argv[2])] : lessons;

for (const lesson of selected) {
  console.log(`\n=== ${lesson.id}: ${lesson.outcome} ===`);
  await import(new URL(`../worked/${lesson.id.toLowerCase()}.${lesson.extension}`, import.meta.url));
}
