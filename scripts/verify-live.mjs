import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {transactionState} from '../src/lifecycle.js';
const config=JSON.parse(readFileSync('public/deployment.json','utf8'));
const client=createClient({chain:studionet});
const deployment=await client.getTransaction({hash:config.deploymentTransaction});
assert.equal(transactionState(deployment).phase,'success');
const initial=JSON.parse(readFileSync('fixtures/deployment-submission.json','utf8'));
assert.equal(createHash('sha256').update(Buffer.from(deployment.data.contract_code,'base64')).digest('hex'),initial.sources[0].sha256);
const upgrade=await client.getTransaction({hash:config.upgradeTransaction});
assert.equal(upgrade.statusName,'FINALIZED');
assert.equal(upgrade.consensus_data.upgrade_result,'success');
const code=upgrade.data.new_code;
assert.equal(code,readFileSync('contracts/build_gate.py','utf8'));
assert.equal(await client.getContractCode(config.contractAddress),code,'Current active source must match checkout');
assert.equal(createHash('sha256').update(code).digest('hex'),config.contractSourceSha256);
const ledger=JSON.parse(readFileSync('docs/transactions.json','utf8'));
for(const item of ledger){
 const tx=await client.getTransaction({hash:item.hash});const state=transactionState(tx);
 assert.equal(state.status,'FINALIZED',item.label);
 if(item.upgrade)assert.equal(tx.consensus_data.upgrade_result,'success',item.label);
 else assert.equal(state.phase,item.expectedFailure?'failed':'success',item.label);
 console.log(item.label,state.status,state.execution);
}
const counts=JSON.parse(await client.readContract({address:config.contractAddress,functionName:'get_counts',args:[],transactionHashVariant:'latest-final'}));
const reports=[];
for(let id=0;id<counts.submissions;id++){
 const r=JSON.parse(await client.readContract({address:config.contractAddress,functionName:'get_submission',args:[id],transactionHashVariant:'latest-final'}));
 for(const [n,record]of r.history.entries()){
  assert.equal(record.attempt,n+1);assert.equal(record.previous_hash,n?r.history[n-1].decision_hash:'');
  const {decision_hash,...rest}=record;
  // Reproduce Python ensure_ascii canonicalization, including non-ASCII and surrogate pairs.
  function canonical(x){if(Array.isArray(x))return '['+x.map(canonical).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>canonical(k)+':'+canonical(x[k])).join(',')+'}';return JSON.stringify(x).replace(/[\u007f-\uffff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));}
  assert.equal(createHash('sha256').update(canonical(rest)).digest('hex'),decision_hash);
 }
 reports.push({id,...r});
}
writeFileSync('docs/live-records.json',JSON.stringify(reports,null,2)+'\n');
console.log('Verified original deployment, active source, finalized execution, and decision hash chains. Counts:',counts);
