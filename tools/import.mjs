#!/usr/bin/env node
// Experimental files-only importer. Not a HarmonyOS registration / execution tool.
import { existsSync, lstatSync, readFileSync, realpathSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, join, relative, sep, isAbsolute } from 'node:path';

function usage() {
  return 'Usage: npm run import -- --skill=<name> --target=<Harmony project> [--dry-run | --files-only]\nExperimental: only copies SKILL.md and scripts/*.ets; never edits module.json5 or registers skill.';
}
function fail(message) { throw new Error(message); }
function parse(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg === '--dry-run' || arg === '--files-only') {
      if (opts[arg]) fail(`Duplicate flag: ${arg}`);
      opts[arg] = true; continue;
    }
    const m = /^--(skill|target)=(.+)$/.exec(arg);
    if (!m) fail(`Invalid argument: ${arg}`);
    if (opts[m[1]]) fail(`Duplicate option: ${m[1]}`);
    opts[m[1]] = m[2];
  }
  if (!opts.skill || !opts.target) fail('Require both --skill and --target');
  if (Boolean(opts['--dry-run']) === Boolean(opts['--files-only'])) fail('Select exactly one: --dry-run or --files-only');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(opts.skill)) fail('Invalid Skill name');
  return opts;
}
function inside(parent, child) {
  const r = relative(parent, child);
  return r === '' || (!r.startsWith('..' + sep) && r !== '..' && !isAbsolute(r));
}
function ensureRegular(path) {
  if (!existsSync(path)) fail(`Missing file: ${path}`);
  const st = lstatSync(path);
  if (!st.isFile() || st.isSymbolicLink()) fail(`Not a regular file: ${path}`);
}
function main() {
  const opts = parse(process.argv.slice(2));
  if (opts.help) { console.log(usage()); return; }
  const root = resolve(import.meta.dirname, '..');
  const source = join(root, 'skills', opts.skill);
  if (!existsSync(source) || !lstatSync(source).isDirectory() || lstatSync(source).isSymbolicLink()) fail('Skill is not published');
  const sourceReal = realpathSync(source);
  if (!inside(realpathSync(join(root, 'skills')), sourceReal)) fail('Skill path escapes repository');
  for (const name of ['SKILL.md', 'README.md', 'SOURCE.md', 'evidence/verification.md']) ensureRegular(join(source, name));
  const scriptsPath = join(source, 'scripts');
  if (!existsSync(scriptsPath) || !lstatSync(scriptsPath).isDirectory() || lstatSync(scriptsPath).isSymbolicLink()) fail('Missing scripts directory');
  const scripts = readdirSync(scriptsPath).filter(x => x.endsWith('.ets')).sort();
  if (!scripts.length) fail('No ArkTS entry scripts found');
  for (const x of readdirSync(scriptsPath)) {
    if (!x.endsWith('.ets')) fail(`Unexpected script file: ${x}`);
    ensureRegular(join(scriptsPath,x));
  }
  const src = ['SKILL.md', ...scripts.map(s => 'scripts/' + s)];
  const target = resolve(opts.target);
  if (!existsSync(target) || !lstatSync(target).isDirectory()) fail('Target project directory not found');
  const targetReal=realpathSync(target);
  if (!existsSync(join(targetReal,'entry')) || !lstatSync(join(targetReal,'entry')).isDirectory()) fail('Target missing entry directory');
  if (inside(root, targetReal) || inside(targetReal,root)) fail('Target must be separate from release repository');
  const destParent = join(targetReal, 'entry','skills');
  // Reject symlinked existing destination ancestors and any overwrite.
  for (const path of [join(targetReal,'entry'),destParent,join(destParent,opts.skill)]) {
    if (existsSync(path) && lstatSync(path).isSymbolicLink()) fail(`Symlink destination rejected: ${path}`);
  }
  const dest=join(destParent,opts.skill);
  if (existsSync(dest)) fail(`Refusing to overwrite existing Skill: ${dest}`);
  console.log(`Source: ${sourceReal}`);
  console.log(`Target: ${dest}`);
  console.log(`Files: ${src.join(', ')}`);
  if (opts['--dry-run']) { console.log('DRY RUN: no files changed; no Skill registration performed.'); return; }
  mkdirSync(dest,{recursive:true});
  for (const item of src) {
    const destination=join(dest,item);
    mkdirSync(resolve(destination,'..'),{recursive:true});
    copyFileSync(join(source,item),destination);
  }
  console.log('FILES ONLY: copied; you must register, build and call manually. Not a verified HarmonyOS Skill import.');
}
try { main(); } catch(e) { console.error(`ERROR: ${e.message}\n${usage()}`); process.exitCode=1; }
