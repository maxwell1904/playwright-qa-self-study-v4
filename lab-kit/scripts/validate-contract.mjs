import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const labRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packRoot = dirname(labRoot);
const manifestPath = join(packRoot, 'source/lab_contracts_v4.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const packageData = JSON.parse(readFileSync(join(labRoot, 'package.json'), 'utf8'));

function requireContract(condition, message) {
  if (!condition) throw new Error(`Lab contract: ${message}`);
}

requireContract(manifest.schemaVersion === 1, 'unsupported manifest schema');
const ids = manifest.modules.map(module => module.id);
requireContract(ids.length === new Set(ids).size, 'duplicate module IDs');

for (const module of manifest.modules) {
  const teachingPath = join(packRoot, module.teachingSource);
  requireContract(existsSync(teachingPath), `${module.id} teaching source missing`);
  const teaching = readFileSync(teachingPath, 'utf8');
  requireContract(teaching.includes(module.id), `${module.id} missing from teaching source`);
  for (const mention of module.mentions ?? []) {
    requireContract(teaching.includes(mention), `${module.id} teaching does not mention ${mention}`);
  }
  for (const artifact of module.artifacts ?? []) {
    requireContract(existsSync(join(packRoot, artifact)), `${module.id} artifact missing: ${artifact}`);
  }
  for (const script of module.scripts ?? []) {
    requireContract(script in packageData.scripts, `${module.id} npm script missing: ${script}`);
  }
}

console.log(`PASS: ${manifest.modules.length} teaching-to-lab module contracts`);
