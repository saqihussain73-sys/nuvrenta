# Nuvrenta — Work handoff, 13 October 2026

## Mission
Complete and verify a secure UK-first, mobile-first guided business startup platform for cleaning, gardening and mobile car valeting. Do not activate real registrations, collect live customer data, send outbound emails or accept payments until explicit owner approval after launch gates pass.

## Repository and current environment
- GitHub: https://github.com/saqihussain73-sys/nuvrenta (default branch main)
- Existing Cloudflare preview: https://nuvrenta.storiessaqib.workers.dev
- Static homepage: index.html; guest workspace: workspace.html
- Cloudflare deployment and current live revision **not verified**. GitHub commits do not prove deployment.
- Existing localStorage prototype is **not** secure storage.
- Tests: npm test (Node >=20), GitHub Actions .github/workflows/prototype-checks.yml; CI status **not verified**.
- Source documents: LAUNCH_READINESS.md, docs/PRODUCTION_ARCHITECTURE.md, docs/API_SECURITY_CONTRACT.md, docs/EXECUTION_STATUS.md
- Staging SQL draft: migrations/0001_initial.sql
- Server domain helpers: src/security.mjs; customer API factory: src/api.mjs; tests under tests/.
- API factory is NOT wired into a Cloudflare Worker; no production auth, D1 binding, secrets, or server deployment configured.

## Important known issues to investigate first
1. src/api.mjs has no request-size limit, schema validator, trusted auth implementation or pagination cursor. It is **not production-ready**.
2. Current API uses user_id from an injected authenticate() function; verify identity provider integration and server-side issuer/audience/signature/expiry validation.
3. Database migration is a draft; ensure all tenant references are enforced, including that a document's customer belongs to the same organisation. SQLite FK alone does not enforce this cross-table tenant invariant.
4. Monetary helpers are prototypes: define rounding, VAT, precision and tax treatment; never trust browser totals.
5. Current quote/invoice demo has no compliant invoice numbering, editing, tax rules or durable PDFs. Demo watermark must remain until validated.
6. Prototype stores contact details in localStorage; do not import them into production without consent and validation.
7. Price benchmarks and claims are provisional; validate primary sources, date, unit and geographic scope.
8. UK GDPR, PECR, accessibility, legal invoice requirements, trademark/domain clearance and payment regulations need specialist review.
9. Confirm tests actually pass before making readiness claims. Existing tests mainly check static strings, not live security.
10. Ensure the onboarding wizard flows into secure workspace only after auth and privacy notices.

## Work execution order
Phase 0 — Inspect repo, GitHub Actions and Cloudflare preview. Fix failing tests. Confirm available Cloudflare account access and whether it can provision staging D1/Workers/secrets. Keep production isolated.
Phase 1 — Provision isolated staging only. Set up managed authentication (no custom passwords), secret handling, migrations, secure sessions and strict origin controls. Require permission if connector/browser cannot access account.
Phase 2 — Implement and test tenant-scoped CRUD for business profile, customers and services. Deny cross-tenant access on **all** endpoints. Include negative tests, validation, pagination, audit logging, backup/restore.
Phase 3 — Implement quote and invoice lifecycle, decimal-safe calculations, immutable issued snapshots, unique transactional numbering, legally reviewed UK invoice particulars and PDFs. Test Safari/Android printing and exports.
Phase 4 — Integrate guided onboarding and responsive dashboard; accessibility WCAG 2.2 AA checks, usability, mobile testing.
Phase 5 — Validate pricing evidence; implement compliant, opt-out-aware outreach only after legal review and explicit sending approval.
Phase 6 — Payment integration in sandbox only, verified webhooks, idempotency and refund paths. Do not switch to live payments.
Phase 7 — Run end-to-end tests, security review, dependency scanning, restore drill, incident runbook, privacy and legal review. Document unresolved risks and signoff criteria.

## Stop and ask owner only for
- Plugin/account connection or permissions not available to agent
- New paid subscription, paid resource or charge
- Sensitive legal/business details the owner must supply
- Production activation, public registration, outbound email, live payments or use of real customer data
- High-risk destructive action or architectural decision with material cost

## Evidence required after each phase
Record exact commit SHAs, actual staging URLs, CI run links/results, test command output, migration status, auth and tenant-isolation test results, and remaining blockers. Do not equate code commits with deployed functionality. If blocked, provide the exact permission needed and continue independent tasks where possible.

## Acceptance definition
A new UK trader can register and verify email, complete guided setup, securely manage only their own customers, generate accurate quotes and legally compliant invoices, retain data across devices, download PDFs, track statuses, recover from errors, and delete/export data in accordance with policy. Cross-account tests, backups, mobile QA, accessibility and security review all pass. Production launch still requires explicit approval.

## Efficiency rules
- Read existing files before rewriting.
- Reuse existing GitHub and Cloudflare rather than provisioning duplicate providers.
- Prefer small commits with tests; fix existing defects before expanding features.
- Do not install unnecessary plugins.
- Do not ask for routine approvals or repeat background explanations.
- Never claim work continues after the active session unless an actual scheduled or delegated workflow is running.
