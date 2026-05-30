/**
 * translate-missing.mjs
 *
 * Reads lib/translations.js, finds any EN keys missing from ES or PT,
 * translates them via DeepL free API, and writes the completed file back.
 *
 * Usage:
 *   node scripts/translate-missing.mjs
 *
 * Requires DEEPL_API_KEY in frontend/.env.local or as an env var.
 * Free tier key ends with :fx  →  uses api-free.deepl.com
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load .env.local so you can run without setting env vars manually ──────────
function loadEnv() {
  try {
    const env = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
    for (const line of env.split('\n')) {
      const [k, ...rest] = line.split('=');
      if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
    }
  } catch {
    // .env.local missing is fine — key may already be in env
  }
}
loadEnv();

const DEEPL_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_KEY) {
  console.error('✗  DEEPL_API_KEY not set. Add it to frontend/.env.local or export it.');
  process.exit(1);
}

const DEEPL_URL = DEEPL_KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

// ── Import the existing translations ─────────────────────────────────────────
const { en, es, pt } = await import('../lib/translations.js');

// ── Flatten a nested object to { 'a.b.c': 'value' } ─────────────────────────
function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = String(v ?? '');
    }
  }
  return out;
}

// ── Set a nested value by dot-path ───────────────────────────────────────────
function setDeep(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]]) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

// ── Deep-clone ────────────────────────────────────────────────────────────────
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ── Find keys in `source` missing from `target` ──────────────────────────────
function missingKeys(source, target) {
  const flat = flatten(source);
  const flatTarget = flatten(target);
  return Object.entries(flat).filter(([k]) => !(k in flatTarget));
}

// ── Call DeepL — batch up to 50 texts per request ────────────────────────────
// Uses header-based auth (DeepL v2 API, November 2025+ requirement)
async function translateBatch(texts, targetLang) {
  if (!texts.length) return [];

  const res = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      target_lang: targetLang,
      source_lang: 'EN',
      preserve_formatting: true,
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`DeepL error ${res.status}: ${msg}`);
  }

  const json = await res.json();
  return json.translations.map(t => t.text);
}

// ── Translate in chunks of 50 to stay under DeepL's per-request limit ────────
async function translateAll(pairs, targetLang) {
  const CHUNK = 50;
  const results = [];
  for (let i = 0; i < pairs.length; i += CHUNK) {
    const chunk = pairs.slice(i, i + CHUNK);
    const translated = await translateBatch(chunk.map(([, v]) => v), targetLang);
    results.push(...chunk.map(([k], j) => [k, translated[j]]));
  }
  return results;
}

// ── Serialise a JS object in the style of translations.js ────────────────────
function serialise(obj, indent = 2) {
  const sp = ' '.repeat(indent);
  const lines = [];

  function walk(o, depth) {
    const pad = ' '.repeat(depth * indent);
    lines.push('{');
    const entries = Object.entries(o);
    entries.forEach(([k, v], i) => {
      const comma = i < entries.length - 1 ? ',' : '';
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        lines.push(`${pad}  ${key}: `);
        const prev = lines.pop();           // inline opening brace
        const inner = [];
        const saved = lines.splice(0);
        walk(v, depth + 1);
        const block = lines.splice(0).join('\n');
        lines.push(...saved);
        lines[lines.length - 1] = prev + block.trimStart() + comma;
      } else {
        const safe = String(v)
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'");
        lines.push(`${pad}  ${key}: '${safe}'${comma}`);
      }
    });
    lines.push(`${pad}}`);
  }

  walk(obj, 0);
  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔍  Scanning for missing translations…\n');

  const esMissing = missingKeys(en, es);
  const ptMissing = missingKeys(en, pt);

  console.log(`  ES missing: ${esMissing.length} keys`);
  console.log(`  PT missing: ${ptMissing.length} keys\n`);

  if (!esMissing.length && !ptMissing.length) {
    console.log('✅  All translations are complete — nothing to do.');
    return;
  }

  // Clone existing objects so we only add, never remove
  const newEs = clone(es);
  const newPt = clone(pt);

  // Translate ES
  if (esMissing.length) {
    console.log(`⟳  Translating ${esMissing.length} keys → ES via DeepL…`);
    const translated = await translateAll(esMissing, 'ES');
    for (const [key, value] of translated) {
      setDeep(newEs, key, value);
      console.log(`   ✓ es.${key} = "${value.slice(0, 60)}${value.length > 60 ? '…' : ''}"`);
    }
    console.log();
  }

  // Translate PT
  if (ptMissing.length) {
    console.log(`⟳  Translating ${ptMissing.length} keys → PT-BR via DeepL…`);
    const translated = await translateAll(ptMissing, 'PT-BR');
    for (const [key, value] of translated) {
      setDeep(newPt, key, value);
      console.log(`   ✓ pt.${key} = "${value.slice(0, 60)}${value.length > 60 ? '…' : ''}"`);
    }
    console.log();
  }

  // ── Rebuild translations.js ─────────────────────────────────────────────────
  const outPath = resolve(ROOT, 'lib/translations.js');

  const output = [
    `// English translations`,
    `export const en = ${serialise(en)};\n`,
    `// Spanish translations`,
    `export const es = ${serialise(newEs)};\n`,
    `// Portuguese (Brazil) translations`,
    `export const pt = ${serialise(newPt)};\n`,
  ].join('\n');

  writeFileSync(outPath, output, 'utf8');
  console.log(`✅  Written ${outPath}`);
  console.log(`    ES: +${esMissing.length} keys   PT: +${ptMissing.length} keys`);
}

main().catch(err => {
  console.error('✗  Failed:', err.message);
  process.exit(1);
});
