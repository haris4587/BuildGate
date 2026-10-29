# BuildGate reference project

This is a deliberately scoped documentation fixture, not evidence of runtime success.

## Setup
Install dependencies with npm ci.
Run npm run dev to open the frontend development server.
Upload contracts/build_gate.py into GenLayer Studio and deploy with Normal (Full Consensus).
Copy the finalized contract address into public/deployment.json.

## Scope and limits
The frontend communicates with GenLayer using genlayer-js.
Runtime execution is not independently attested by this document.
No deployment transaction is supplied by this fixture.
A textual address without an authoritative transaction is an unverified claim.
