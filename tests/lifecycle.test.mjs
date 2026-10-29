import {test} from 'node:test';import assert from 'node:assert/strict';import {transactionState,track,isHash,isAddress} from '../src/lifecycle.js';
const hash='0x'+'a'.repeat(64);
test('accepted is not finalized',()=>assert.equal(transactionState({statusName:'ACCEPTED',consensus_data:{leader_receipt:[{execution_result:'SUCCESS'}]}}).phase,'accepted'));
test('finality cannot hide execution failure',()=>assert.equal(transactionState({statusName:'FINALIZED',consensus_data:{leader_receipt:[{execution_result:'ERROR'}]}}).phase,'failed'));
test('missing execution proof fails closed',()=>assert.equal(transactionState({statusName:'FINALIZED'}).phase,'failed'));
test('cancelled fails',()=>assert.equal(transactionState({statusName:'CANCELED'}).phase,'failed'));
test('full lifecycle',async()=>{let n=0;const phases=[];await track({getTransaction:async()=>({statusName:['PENDING','ACCEPTED','FINALIZED'][n++],execution_result:'SUCCESS'})},hash,s=>phases.push(s.phase),{wait:async()=>{}});assert.deepEqual(phases,['pending','accepted','success']);});
test('timeout permits resume without resubmission',async()=>await assert.rejects(track({getTransaction:async()=>({statusName:'PENDING'})},hash,()=>{},{attempts:1,wait:async()=>{}}),/Resume/));
test('malformed identifiers',()=>{assert.ok(isHash(hash));assert.ok(!isHash('0x123'));assert.ok(isAddress('0x'+'1'.repeat(40)));});
