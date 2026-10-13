import test from 'node:test';import assert from 'node:assert/strict';import {resolveMembership,authorize,parseMoneyMinor,calculateLineTotalMinor,validateText} from '../src/security.mjs';
const members=[{user_id:'u1',organisation_id:'o1',role:'owner'},{user_id:'u2',organisation_id:'o2',role:'member'}];
test('cross-tenant membership is denied',()=>{assert.equal(resolveMembership(members,'u1','o2'),null);assert.equal(authorize(members,'u1','o2'),false);assert.equal(authorize(members,'u1','o1'),true)});
test('role restrictions enforced',()=>{assert.equal(authorize(members,'u2','o2',['owner','admin']),false);assert.equal(authorize(members,'u1','o1',['owner']),true)});
test('money conversion is exact',()=>{assert.equal(parseMoneyMinor('19.99'),1999);assert.equal(parseMoneyMinor('0.01'),1);assert.equal(parseMoneyMinor('20'),2000)});
test('invalid money rejected',()=>{for(const x of ['-1','1.234','1e3','NaN','1,000',''])assert.throws(()=>parseMoneyMinor(x))});
test('fractional quantities rounded in minor units',()=>{assert.equal(calculateLineTotalMinor(1999,1500),2999);assert.equal(calculateLineTotalMinor(100,250),25)});
test('bad quantities rejected',()=>assert.throws(()=>calculateLineTotalMinor(100,-1)));
test('text validation rejects empty and overly long values',()=>{assert.equal(validateText('  Garden  '),'Garden');assert.throws(()=>validateText(''));assert.throws(()=>validateText('x'.repeat(161)))});
