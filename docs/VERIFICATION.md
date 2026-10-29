# Verified execution and limitations

Network: **GenLayer Studionet (61999)**, a development sandbox. No mainnet deployment is claimed.

## Contract provenance

- Contract: `0xF8649AfA845Af7914D367A79AdE69EA8E0F01425`
- Initial deployment: `0xe350cb2ff31d2ed2f4a5f20e96e34e1ade6ec64a5c1997527d80835190b5d500`, FINALIZED / SUCCESS.
- Tested receipt-selection fix: `0xaf3abcf5d2f691523ab465ad3672ffee7b70491c5392018f217affd3810bc346`, FINALIZED / SUCCESS. Same contract address; no duplicate deployment.
- Original deployment code and upgrade code were each compared with the corresponding local source byte-for-byte. Current source SHA-256 is recorded in `public/deployment.json`.
- Deployment and Studio policy/assessment transactions used Studio’s built-in account. Frontend transactions use disposable tab-memory SDK session accounts, distinct from Studio’s origin-bound account. No MetaMask.

## Verified consensus examples

| Submission | Scope | Result |
|---|---|---|
| 0 | Setup documentation and deployment requirement; no deployment supplied | INCONCLUSIVE: PASS / UNKNOWN |
| 1 | Original Studionet deployment source binding only | VERIFIED: authenticated deployment PASS |
| 2 | Concrete setup documentation only | VERIFIED: documentation PASS |
| 3 | Linked revision of submission 2, explicitly lacks setup guide | NON_COMPLIANT: required documentation FAIL |

These are scoped test records. Submission 1 does not certify the entire BuildGate application or its current code after upgrades.

## Automated verification

23 tests pass: 10 Python host-stub unit tests and 13 JavaScript tests covering schemas, path/size attacks, source authentication, owner checks, version linkage, deterministic verdict rules, grounded citations, runtime abstention, deployment bindings, retries, sealed histories, fingerprinting, account validation and the transaction lifecycle.

A regression test covers idle validator cancellation receipts after quorum. Both deployment verification and frontend status tracking select leader receipts by mode. Another test prevents a successful validator receipt from overriding a failed leader execution.

`node scripts/verify-live.mjs` checks deployed source, finalized execution, live histories and decision hash chains against the authoritative API. See `docs/transactions.json` for exact transaction IDs and `docs/live-records.json` for exported evidence.

## Browser coverage

Verified on the preview against live Studionet: wallet session creation, policy creation and returned policy ID, finalized project registration, public record reads, assessment submission, missing-deployment result, source fingerprint helper, and source-bound deployment verification through Studio. Also verified: linked revisions with preserved earlier records; a NON_COMPLIANT revision; audit JSON download parsed and compared; disconnect; and successful/failed transaction resumption without resubmission. The finalized sealed-decision transaction reports ERROR correctly in the frontend. Account-key backup/reimport was also tested without exposing credentials in logs. Public deployment details are recorded on release.

## Material limits

The Python tests mock host functions and are not a GenVM emulator. Live consensus checks supplement them. PARTIALLY_VERIFIED and several adversarial inputs are tested deterministically; no live runtime attestation is provided. FUNCTIONALITY claims cannot PASS in v1. The deployment adapter proves the original deployment transaction, not active code after an upgrade. Authoritative API trust and Studionet resets remain external dependencies. A website screenshot is presentation evidence, not an independent runtime attestation for submitted projects.

The final live verification run checked 14 transaction records (including one expected failed execution), three policies and four submissions. Initial deployment fingerprint and current active source were verified separately against the authoritative API.

## Public release

Public website: https://buildgate.keenbasil9.chatgpt.site/

Sites publication succeeded on 2026-10-29; source commit `ebd29c0ab1000f0a2a1492d7f7cadc707679e83a`. The public site was opened in a fresh origin and successfully read live finalized Studionet counts and submission records. Public screenshot: `docs/public-site.jpg`.

No Project Explorer application or promotional post was submitted automatically.
