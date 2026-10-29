import sys, types, importlib.util, unittest, json, base64, hashlib
from unittest.mock import patch
from pathlib import Path
class UserError(Exception): pass
class Map(dict): pass
class Return:
    def __init__(self, x): self.calldata=x
sender=types.SimpleNamespace(sender_address='alice',contract_address='0xcontract')
gl=types.SimpleNamespace(Contract=object, public=types.SimpleNamespace(write=lambda f:f,view=lambda f:f),message=sender,vm=types.SimpleNamespace(UserError=UserError,Return=Return),nondet=types.SimpleNamespace())
def consensus(leader,validator):
    result=leader();assert validator(Return(result));return result
gl.vm.run_nondet_unsafe=consensus
m=types.ModuleType('genlayer');m.gl=gl;m.TreeMap=Map;m.u256=int;m.Address=str
sys.modules['genlayer']=m
spec=importlib.util.spec_from_file_location('contract',Path(__file__).parents[1]/'contracts/build_gate.py');c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
def criterion(kind='DOCUMENTATION',required=True):return {'id':'C1','kind':kind,'required':required,'description':'Provide a clear setup guide.'}
def pol(cs=None):return {'title':'Demo','criteria':cs or [criterion()]}
def sub():return {'name':'Demo','repository':'owner/repo','commit':'a'*40,'sources':[{'path':'README.md','role':'DOCS','sha256':hashlib.sha256(b'Clear setup guide.').hexdigest(),'bytes':18}],'deployment':None}
class ContractTests(unittest.TestCase):
 def setUp(self):
    sender.sender_address='alice';self.b=c.BuildGate()
    for name in ['policies','policy_owners','submissions','owners','histories']:setattr(self.b,name,{})
 def test_verdict_matrix(self):
    self.assertEqual(c.verdict([criterion()],['PASS']),'VERIFIED')
    self.assertEqual(c.verdict([criterion()],['FAIL']),'NON_COMPLIANT')
    self.assertEqual(c.verdict([criterion()],['UNKNOWN']),'INCONCLUSIVE')
    self.assertEqual(c.verdict([criterion(),criterion(required=False)],['PASS','FAIL']),'PARTIALLY_VERIFIED')
    self.assertEqual(c.verdict([criterion(),criterion(required=False)],['FAIL','UNKNOWN']),'NON_COMPLIANT')
 def test_immutable_and_versions(self):
    self.b.create_policy(json.dumps(pol()));self.b.submit_project(0,json.dumps(sub()),-1)
    with self.assertRaises(UserError):self.b.submit_project(0,json.dumps(sub()),0)
    s=sub();s['commit']='b'*40;self.assertEqual(self.b.submit_project(0,json.dumps(s),0),1)
    sender.sender_address='bob'
    with self.assertRaises(UserError):self.b.submit_project(0,json.dumps(s),0)
    with self.assertRaises(UserError):self.b.evaluate(0)
 def test_input_attacks(self):
    for path in ['../secret','a//b','/a','a?x','a/%2e']:
      s=sub();s['sources'][0]['path']=path
      with self.assertRaises(UserError):c.submission(json.dumps(s))
    for value in [True,0,24001]:
      s=sub();s['sources'][0]['bytes']=value
      with self.assertRaises(UserError):c.submission(json.dumps(s))
    with self.assertRaises(UserError):c.policy('{"title":"a","title":"b","criteria":[]}')
    s=sub();s['commit']='main'
    with self.assertRaises(UserError):c.submission(json.dumps(s))
 def test_citations_and_runtime(self):
    d={'checks':[{'id':'C1','status':'PASS','citations':[{'source':0,'line':1}]}]}
    self.assertEqual(c.normalize(d,pol(),sub(),['Clear setup guide.'],'UNKNOWN')['verdict'],'VERIFIED')
    self.assertEqual(c.normalize(d,pol([criterion('FUNCTIONALITY')]),sub(),['Clear setup guide.'],'UNKNOWN')['verdict'],'INCONCLUSIVE')
    with self.assertRaises(UserError):c.normalize(d,pol([criterion('INTEGRATION')]),sub(),['Clear setup guide.'],'UNKNOWN')
    d['checks'][0]['citations'][0]['line']=2
    with self.assertRaises(UserError):c.normalize(d,pol(),sub(),['Clear setup guide.'],'UNKNOWN')
 def test_missing_deployment_never_passes(self):
    d={'checks':[{'id':'C1','status':'PASS','citations':[]}]}
    self.assertEqual(c.normalize(d,pol([criterion('DEPLOYMENT')]),sub(),['text'],'UNKNOWN')['verdict'],'INCONCLUSIVE')
 def test_deployment_binding(self):
    s=sub();s['sources'][0]['role']='CODE';s['deployment']={'chain_id':61999,'address':'0x'+'1'*40,'transaction':'0x'+'2'*64,'source':0}
    tx={'status':'FINALIZED','type':1,'to_address':s['deployment']['address'],'data':{'contract_code':base64.b64encode(b'code').decode()},'consensus_data':{'leader_receipt':[{'mode':'leader','execution_result':'SUCCESS'},{'mode':'validator','vote':'idle','execution_result':'ERROR'}]}}
    with patch.object(c,'rpc',return_value=tx):self.assertEqual(c.deployment_check(s,['code']),'PASS');self.assertEqual(c.deployment_check(s,['other']),'FAIL')
    tx['status']='ACCEPTED'
    with patch.object(c,'rpc',return_value=tx):self.assertEqual(c.deployment_check(s,['code']),'UNKNOWN')
 def test_integrity_failure(self):
    response=types.SimpleNamespace(status=200,body=b'changed')
    with patch.object(gl.nondet,'web',types.SimpleNamespace(get=lambda url:response),create=True):self.assertEqual(c.inspect(pol(),sub())['reason'],'EVIDENCE_UNAVAILABLE_OR_CHANGED')
 def test_consensus_history_and_seal(self):
    self.b.create_policy(json.dumps(pol()));self.b.submit_project(0,json.dumps(sub()),-1)
    result={'states':['PASS'],'deployment':'UNKNOWN','verdict':'VERIFIED','reason':'ASSESSED','findings':[]}
    with patch.object(c,'inspect',return_value=result):self.b.evaluate(0)
    record=json.loads(self.b.get_submission(0))['history'][0];h=record.pop('decision_hash');self.assertEqual(c.digest(c.canonical(record)),h)
    with self.assertRaises(UserError):self.b.evaluate(0)
 def test_retry_bound(self):
    self.b.create_policy(json.dumps(pol()));self.b.submit_project(0,json.dumps(sub()),-1)
    with patch.object(c,'inspect',return_value=c.unknown(pol(),'INVALID_ASSESSMENT')):
      for _ in range(3):self.b.evaluate(0)
      with self.assertRaises(UserError):self.b.evaluate(0)
    h=json.loads(self.b.histories[0]);self.assertEqual(h[2]['previous_hash'],h[1]['decision_hash'])
 def test_disagreement(self):
    a=c.unknown(pol(),'INVALID_ASSESSMENT');b=c.unknown(pol(),'EVIDENCE_UNAVAILABLE_OR_CHANGED');self.assertFalse(c.agrees(a,b))
if __name__=='__main__':unittest.main()
