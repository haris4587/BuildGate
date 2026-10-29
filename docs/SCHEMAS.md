# Payload schemas

All keys are strict. Duplicate JSON keys, extra fields, booleans masquerading as integers, path traversal, branch refs, duplicate source paths and oversized source sets are rejected.

## Policy
```json
{"title":"Developer program","criteria":[{"id":"CONTRACT","kind":"ARTIFACT","required":true,"description":"Provide a GenLayer Python contract exposing public write and view methods."}]}
```
Kinds: ARTIFACT, DOCUMENTATION, INTEGRATION, FUNCTIONALITY, DEPLOYMENT. Criterion IDs are unique uppercase identifiers. A policy needs at least one required criterion. Policies are capped at 10KB, eight criteria and 800 characters per description.

## Submission
```json
{"name":"My project","repository":"owner/repository","commit":"0123456789012345678901234567890123456789","sources":[{"path":"contracts/project.py","role":"CODE","sha256":"0123456789012345678901234567890123456789012345678901234567890123","bytes":1234}],"deployment":null}
```
Replace example hashes and byte counts with actual fingerprints. Roles: CODE, DOCS, TEST, RECORD. Each source is 1–24,000 bytes; total at most 64,000 bytes. Sources must belong to the same registered repository/commit. Use a concise evidence artifact if a source is too large; this only attests the submitted artifact, never the completeness of the whole repository.

Optional deployment binding:
```json
{"chain_id":61999,"address":"0x1111111111111111111111111111111111111111","transaction":"0x2222222222222222222222222222222222222222222222222222222222222222","source":0}
```
The source index must refer to CODE. Only initial stable Studionet deployment records are supported in v1. See README for upgrade and authority limitations.

## Audit hashes
JSON is canonicalized using Python `json.dumps(sort_keys=True,separators=(',',':'),ensure_ascii=True)`. Hash bytes are UTF-8 SHA-256. Policy and submission hashes bind normalized payloads, not user JSON whitespace. To verify a decision hash remove `decision_hash`, canonicalize the remaining record and hash it. Each later attempt binds the previous hash. A failed assessment transaction rolls back and adds no record.
