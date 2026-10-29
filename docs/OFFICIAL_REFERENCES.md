# Official references checked during implementation

- https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio
- https://docs.genlayer.com/developers/intelligent-contracts/deploying
- https://docs.genlayer.com/developers/intelligent-contracts/features/non-determinism
- https://docs.genlayer.com/developers/decentralized-applications/reading-data
- https://docs.genlayer.com/developers/decentralized-applications/writing-data
- https://docs.genlayer.com/api-references/genlayer-js
- GenLayer SDK source: genlayerlabs/genvm, runners/genlayer-py-std/src/genlayer/nondet/web.py
- Stable Studio account flow: genlayerlabs/genlayer-studio, frontend/src/stores/accounts.ts

Implementation intentionally targets stable Studionet, not the release-candidate Studio-dev network. Network definitions, Python runner and client SDK must be migrated together for other environments. Source inspection and live RPC tests confirmed stable Studio's receipt format; leader receipts are selected by mode to ignore idle validator cancellation receipts after quorum.
