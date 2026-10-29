import {createClient,createAccount} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
export const reader=createClient({chain:studionet});
export function connect(key){
 if(!key)return createClient({chain:studionet,account:createAccount()});
 if(!/^0x[a-fA-F0-9]{64}$/.test(key))throw Error('Enter a disposable Studio sandbox private key.');
 return createClient({chain:studionet,account:createAccount(key)});
}
export async function read(address,functionName,args=[]){return reader.readContract({address,functionName,args,transactionHashVariant:'latest-final'});}
export async function fingerprint(repository,commit,path,role){
 if(!/^[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+$/.test(repository)||!/^[0-9a-f]{40}$/.test(commit)||!/^[A-Za-z0-9_./-]+$/.test(path)||path.split('/').some(p=>['','.','..'].includes(p)))throw Error('Use owner/repository, full commit SHA and a safe file path.');
 const response=await fetch(`https://raw.githubusercontent.com/${repository}/${commit}/${path}`);if(!response.ok)throw Error(`Source fetch failed: ${response.status}`);
 const bytes=await response.arrayBuffer();if(!bytes.byteLength||bytes.byteLength>24000)throw Error('Evidence must be 1–24,000 bytes.');
 new TextDecoder('utf-8',{fatal:true}).decode(bytes);
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 return {path,role,bytes:bytes.byteLength,sha256:Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')};
}
