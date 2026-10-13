import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const schema=readFileSync(new URL('../migrations/0001_initial.sql',import.meta.url),'utf8');
const workspace=readFileSync(new URL('../workspace.html',import.meta.url),'utf8');
test('tenant-owned tables require organisation IDs',()=>{
 for(const table of ['customers','services','documents','payments','audit_events']){
  const match=schema.match(new RegExp('CREATE TABLE IF NOT EXISTS '+table+' \\(([\\s\\S]*?)\\);'));
  assert.ok(match,'Missing table '+table);
  assert.match(match[1],/organisation_id TEXT NOT NULL/);
 }
});
test('document numbers are unique per organisation',()=>assert.match(schema,/UNIQUE\(organisation_id,document_number\)/));
test('financial values use integer minor units',()=>assert.match(schema,/unit_price_minor INTEGER NOT NULL/));
test('guest documents visibly marked demo-only',()=>{
 assert.match(workspace,/DEMO DOCUMENT — NOT FOR BUSINESS USE/);
 assert.match(workspace,/DEMO ONLY — NOT FOR LIVE CUSTOMER RECORDS/);
});
