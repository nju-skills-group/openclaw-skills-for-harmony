import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root=resolve(import.meta.dirname,'..');
const skill=join(root,'skills','fixture-skill');
function run(args) { return spawnSync(process.execPath,[join(root,'tools','import.mjs'),...args],{encoding:'utf8'}); }
function prep(t) {
 const project=mkdtempSync(join(tmpdir(),'harmony-import-'));
 mkdirSync(join(project,'entry'));
 mkdirSync(join(skill,'scripts'),{recursive:true});
 mkdirSync(join(skill,'evidence'),{recursive:true});
 writeFileSync(join(skill,'SKILL.md'),'---\nname: fixture-skill\ndescription: test only\n---\n');
 writeFileSync(join(skill,'README.md'),'test fixture');
 writeFileSync(join(skill,'SOURCE.md'),'test fixture only');
 writeFileSync(join(skill,'evidence','verification.md'),'test fixture only');
 writeFileSync(join(skill,'scripts','Test.ets'),'export default class Test {}');
 t.after(()=>{rmSync(project,{recursive:true,force:true});rmSync(skill,{recursive:true,force:true});});
 return project;
}
test('rejects invalid skill name',()=>{const r=run(['--skill=../bad','--target=/tmp','--dry-run']);assert.notEqual(r.status,0);assert.match(r.stderr,/Invalid Skill name/);});
test('rejects not-yet-published skills',()=>{const project=mkdtempSync(join(tmpdir(),'harmony-import-'));try{mkdirSync(join(project,'entry'));const r=run(['--skill=unpublished','--target='+project,'--dry-run']);assert.notEqual(r.status,0);assert.match(r.stderr,/not published/);} finally{rmSync(project,{recursive:true,force:true});}});
test('dry-run does not copy files',t=>{const project=prep(t);const r=run(['--skill=fixture-skill','--target='+project,'--dry-run']);assert.equal(r.status,0,r.stderr);assert.equal(existsSync(join(project,'entry','skills','fixture-skill')),false);});
test('explicit files-only copies and refuses duplicate import',t=>{const project=prep(t);let r=run(['--skill=fixture-skill','--target='+project,'--files-only']);assert.equal(r.status,0,r.stderr);assert.match(readFileSync(join(project,'entry','skills','fixture-skill','SKILL.md'),'utf8'),/fixture-skill/);r=run(['--skill=fixture-skill','--target='+project,'--files-only']);assert.notEqual(r.status,0);assert.match(r.stderr,/Refusing to overwrite/);});
test('requires explicit mode',t=>{const project=prep(t);const r=run(['--skill=fixture-skill','--target='+project]);assert.notEqual(r.status,0);assert.match(r.stderr,/Select exactly one/);});
