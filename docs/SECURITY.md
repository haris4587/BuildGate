# Security model

- Fixed raw.githubusercontent.com evidence origin, safe relative paths and full 40-hex commits. No user-controlled RPC, redirects in URLs, credentials, query strings or arbitrary URL fetches.
- Independent SHA-256, exact byte size and UTF-8 checks. Any source failure yields an inconclusive result for the whole package.
- Bounded source volume and schema, grounded line references, exact decision-vector validator equivalence and deterministic verdicts. Consensus disagreement does not silently award a verdict.
- All policy and source text is untrusted model data. Instructions in documents cannot change the deterministic deployment adapter or verdict rules.
- Owners can submit/evaluate their own versions. Policies and records are public. Ownership does not authenticate an organizer or verify intellectual property.
- No secrets in committed files. Frontend account material exists only in memory. Signing is client-side; the public site has no shared signer or custodial account.
- Attempts are bounded to three per submission. A conclusive result is sealed. New versions preserve prior evidence.
- A source quote proves grounding, not correctness; models can misinterpret requirements. Narrow policies can receive VERIFIED while omitting important requirements. Review policy scope and provenance.
- FUNCTIONALITY PASS is disabled until independent runtime attestations exist. A README, log file or test name cannot prove a working deployment or user interface.
- Deployment adapter checks original deployment transaction binding only. It cannot rule out upgrades. It trusts the GenLayer-operated Studionet API and cannot preserve evidence after a network reset.

Report security concerns via a GitHub issue with a minimal reproduction, excluding secrets.
