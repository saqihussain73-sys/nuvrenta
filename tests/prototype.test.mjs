import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const workspace=readFileSync(new URL('../workspace.html',import.meta.url),'utf8');
test('homepage has guided setup and visible workspace entry',()=>{
 assert.match(home,/id="start-journey"/);
 assert.match(home,/wizard-step/);
 assert.match(home,/href="\.\/workspace\.html"/);
});
test('workspace prominently warns about browser-only storage',()=>{
 assert.match(workspace,/Guest workspace \(early prototype\)/);
 assert.match(workspace,/no user accounts, cloud backups or secure cross-device sync/i);
 assert.match(workspace,/localStorage\.setItem/);
});
test('workspace includes core customer and document screens',()=>{
 for(const id of ['dashboard','profile','customers','documents','printDocument']) assert.match(workspace,new RegExp('id="'+id+'"'));
 assert.match(workspace,/Save & preview document/);
 assert.match(workspace,/window\.print\(\)/);
});
test('workspace escapes user content in printed document',()=>{
 assert.match(workspace,/const safe=/);
 for(const expression of ['d.customer.name','d.service','d.notes','d.business.businessName']) assert.ok(workspace.includes('safe('+expression+')'),expression);
});
test('do not misrepresent prototype as a production account system',()=>{
 assert.doesNotMatch(workspace,/type="password"/);
 assert.doesNotMatch(workspace,/secure cloud storage is enabled/i);
});
test('site has mobile viewport',()=>{
 for(const page of [home,workspace]) assert.match(page,/name="viewport"/);
});
