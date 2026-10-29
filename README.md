# BuildGate

**Evidence before approval.** Independent, GenLayer-powered verification of developer project submissions against immutable evaluation policies.

Hackathons and developer programs receive claims about integrations, contracts and deployments. BuildGate makes those claims inspectable: lock criteria, register a repository commit with exact file fingerprints, request independent validator assessment, and publish a version-bound decision history.

BuildGate is an independent technical review tool. It is **not an official GenLayer Project Explorer approval system** and does not grant eligibility or predict points.

## Application

- Website: https://buildgate.keenbasil9.chatgpt.site (publication status in `docs/VERIFICATION.md`)
- Intelligent Contract: [`contracts/build_gate.py`](contracts/build_gate.py)
- Network and verified address: [`public/deployment.json`](public/deployment.json)
- Live evidence: [`docs/VERIFICATION.md`](docs/VERIFICATION.md)

## What is original

BuildGate separates five proof classes: source artifacts, documentation, integration code, runtime functionality and on-chain deployment. A model cannot promote a deployment claim into a verified deployment. The deterministic deployment adapter retrieves the transaction from the fixed authoritative Studionet RPC, requires FINALIZED + successful execution, binds the recipient and transaction type, and compares the original deployed source to the locked CODE artifact byte-for-byte. Unsupported networks abstain at registration; missing/unavailable records remain UNKNOWN.

Runtime functionality cannot currently PASS: self-authored test reports do not prove a test actually ran. This is an intentional security boundary, not a live runtime attestation system. BuildGate can inspect integration source but does not exercise arbitrary submitted websites or run untrusted code.

## Verdict rules

| Verdict | Deterministic rule |
|---|---|
| `VERIFIED` | Every criterion PASS |
| `PARTIALLY_VERIFIED` | All required criteria PASS, at least one optional FAIL, no UNKNOWN |
| `NON_COMPLIANT` | At least one required criterion FAIL, even if other criteria UNKNOWN |
| `INCONCLUSIVE` | No required FAIL, and at least one UNKNOWN or an evidence/model integrity failure |

FAIL requires explicit contrary evidence. Missing evidence is UNKNOWN and prevents a positive certification. A policy can be narrow: VERIFIED means compliance with those exact locked criteria, not universal quality, safety or official acceptance.

## How it works

1. `create_policy(policy_json)` commits 1–8 typed criteria with immutable required/optional flags. Anyone can publish a policy; the recorded creator is not automatically an official organizer. Verify policy provenance separately.
2. `submit_project(policy_id, submission_json, previous_id)` locks a specific Git commit, 1–8 UTF-8 sources (SHA-256 + byte length), and an optional deployment binding. `previous_id=-1` starts a project. Corrections point to an earlier same-owner, same-repository, same-policy submission; old records remain intact. Version histories may branch and are not an assertion that a version is latest.
3. `evaluate(submission_id)` independently fetches and authenticates evidence on leader and validators. Semantic assessment uses `gl.nondet.exec_prompt`; `gl.vm.run_nondet_unsafe` requires exact agreement on every status, deployment finding, verdict and failure reason. Validator retrieval also checks the leader’s stored citations against the actual authenticated lines. Prose equality is not required.
4. The deterministic layer derives the verdict and writes an append-only, domain-separated hash chain binding contract address, owner, policy-bound submission hash, attempt number and previous decision hash. Only the submission owner can assess, with at most three attempts and no reevaluation after a conclusive result.
5. `get_counts`, `get_policy`, `get_submission` expose public finalized records. The frontend exports the full audit JSON.

## Run locally

Requires Node 22+ and Python 3.10+. Python tests use a small GenLayer host stub; they do not emulate GenVM or network consensus.

```sh
npm ci
npm test
npm run dev
npm run build
```

The Python runner is pinned in the contract header to SDK v0.2.16. JS SDK is pinned to `genlayer-js@1.2.0` for stable **Studionet (61999)**. Do not switch to Studio-dev (61997) without migrating SDK/network/fee handling together. No MetaMask dependency.

## Use the website

Public reads do not require a wallet. Connect a disposable Studio sandbox key or create an ephemeral session account. The session account is generated using the same GenLayer SDK mechanism as Studio, but is separate from Studio’s origin-bound account. Keys stay in tab memory, never localStorage, URLs, source control or the backend. Reload/disconnect clears them; export your audit records before ending a session. Do not use funded production keys. Studio’s built-in account was used for the initial contract deployment.

1. Lock a policy or inspect its exact contents and creator.
2. Paste the project’s repository and full commit SHA. Use “Fingerprint a repository file” to fetch and add each evidence file.
3. Register the submission and note the returned ID in the transaction receipt. The dashboard shows global counts; concurrent submissions mean count-minus-one is not a safe ID inference.
4. Assess your submission, wait for FINALIZED **and** execution SUCCESS, then inspect findings. An accepted receipt is still pending finality. Failed execution remains failed even if consensus finalizes.
5. On a tracking timeout, resume the existing transaction hash. Never resubmit blindly. Submit corrected evidence as a new linked version.

See [`docs/SCHEMAS.md`](docs/SCHEMAS.md) for payloads and [`docs/SECURITY.md`](docs/SECURITY.md) for boundaries.

## Deployment and evidence limitations

The deployment adapter currently authenticates the **original deployment transaction**, not later upgrades or the current active code. It proves that source was deployed successfully at that transaction on that chain; it does not prove continued availability, production-chain finality, frontend reachability, or present code after an upgrade. Studionet is a resettable development sandbox operated by GenLayer; its API is an authority dependency, not a cryptographic light client. Old evidence may become unavailable after a reset.

Repository fingerprints provide integrity/version binding, not publisher identity or truth. Organizer policies, source documents and code are untrusted prompt data. Exact citations demonstrate grounding but cannot eliminate semantic errors, malicious comments, colluding validators or flawed evaluation policies. There is no automatic financial award, project approval, token transfer or guarantee of acceptance.

## Development path

Add cryptographic runtime attestations and CI-provider provenance verification, additional network adapters with chain-specific source commitments, organizer policy identity verification, and independent review challenges. These are roadmap items, not implemented capabilities.

MIT license.
