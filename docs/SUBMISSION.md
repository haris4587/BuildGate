# Project Explorer submission draft

## Project name
BuildGate

## One-line summary
Independent verification of developer submissions against locked requirements using authenticated repository evidence and GenLayer consensus.

## Description
Hackathons and developer programs receive project claims that are hard to verify consistently. BuildGate locks an evaluation policy and an immutable, commit-pinned evidence package, then asks GenLayer validators to independently authenticate the evidence and assess every criterion.

The Intelligent Contract distinguishes source artifacts, documentation, integration code, runtime claims and deployment records. A README address cannot earn deployment verification: a deterministic adapter retrieves the authoritative Studionet transaction, checks finalized successful execution, and binds the original deployed source to the locked artifact. Missing or unverifiable evidence prevents VERIFIED. Self-reported runtime claims remain UNKNOWN.

Users publish requirements, register project versions, request assessments, inspect exact source-line findings and export auditable histories. Corrections link to previous submissions without overwriting them. Four deterministic verdicts—VERIFIED, PARTIALLY_VERIFIED, NON_COMPLIANT and INCONCLUSIVE—make the scope and uncertainty explicit.

BuildGate is an independent technical review tool, not an official GenLayer Project Explorer approval system. Initial deployment verification does not attest current code after upgrades or continued website operation. Studionet is a development sandbox.

## Why GenLayer is central
The main workflow is executed in the Intelligent Contract. Validators independently retrieve authenticated evidence, run semantic assessment, check leader citations and agree on every decision-critical finding before deterministic verdict calculation and storage. The website directly submits writes and reads finalized contract records; it is not a frontend-only AI review form.

## Links
- Source: https://github.com/haris4587/BuildGate
- Live website: https://buildgate.keenbasil9.chatgpt.site
- Contract: https://explorer-studio.genlayer.com/address/0xF8649AfA845Af7914D367A79AdE69EA8E0F01425
- Deployment: https://explorer-studio.genlayer.com/transactions/0xe350cb2ff31d2ed2f4a5f20e96e34e1ade6ec64a5c1997527d80835190b5d500
- Deployment configuration and source fingerprints: public/deployment.json
- Transactions and verified test coverage: docs/VERIFICATION.md and docs/transactions.json
- Logo: public/logo.png (512 × 512 PNG)

## Demo walkthrough
1. Open the live website and select “Assess & inspect.”
2. Read submission 0: documentation PASS and deployment UNKNOWN yield INCONCLUSIVE.
3. Read submission 1: the policy checks only original deployment binding; inspect the authoritative source-bound deployment result.
4. Inspect policy contents before interpreting any verdict. A narrow policy does not certify an entire project.
5. Connect a disposable session account, lock requirements and register a project commit. Use the file fingerprint helper to add exact sources.
6. Watch pending, accepted and finalized states. Finality plus execution success is required. Resume a hash without resubmitting.
7. Export an audit record. Submit a correction as a new linked version.

## Suggested category
Developer Tools / Infrastructure; precise portal tags depend on the options shown at submission time.

## Scope of readiness
Review docs/VERIFICATION.md for verified coverage and material limits. No Project Explorer submission has been sent automatically. No GLP, approval or reward outcome is promised.
