export const isAddress = v => /^0x[a-fA-F0-9]{40}$/.test(v);
export const isHash = v => /^0x[a-fA-F0-9]{64}$/.test(v);
export function transactionState(tx) {
 const status=String(tx?.statusName??tx?.status??'PENDING').toUpperCase();
 const receipts=tx?.consensus_data?.leader_receipt;
 const leader=Array.isArray(receipts)?receipts.at(-1):receipts;
 const execution=String(tx?.txExecutionResultName??tx?.execution_result??leader?.execution_result??'').toUpperCase();
 if(['CANCELED','CANCELLED','UNDETERMINED','LEADER_TIMEOUT','VALIDATORS_TIMEOUT'].includes(status))return {phase:'failed',status,execution};
 if(['ACCEPTED','FINALIZED'].includes(status)){
  if(!['SUCCESS','FINISHED_WITH_RETURN','RETURN'].includes(execution))return {phase:'failed',status,execution};
  return {phase:status==='FINALIZED'?'success':'accepted',status,execution};
 }
 return {phase:'pending',status,execution};
}
export async function track(client,hash,onUpdate,{interval=4000,attempts=120,wait=ms=>new Promise(r=>setTimeout(r,ms))}={}){
 if(!isHash(hash))throw Error('Invalid transaction hash');
 for(let n=0;n<attempts;n++){
  const receipt=await client.getTransaction({hash});const state=transactionState(receipt);onUpdate({...state,hash});
  if(state.phase==='failed')throw Error(`Execution failed: ${state.status} / ${state.execution||'not proven'}`);
  if(state.phase==='success')return receipt;
  await wait(interval);
 }
 throw Error('Tracking paused. Resume this transaction hash; it may still be pending.');
}
