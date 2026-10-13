# Nuvrenta — Production launch gate

Status: **NO-GO — development preview only**
Updated: 2026-10-13

## Non-negotiable launch criteria

### 1. Security and privacy
- [ ] Production authentication and email verification implemented
- [ ] Account and organisation separation verified with automated negative access tests
- [ ] Server-side authorization on every record operation (never trust client-supplied owner IDs)
- [ ] Session lifecycle, CSRF protections as appropriate, rate limiting and abuse prevention tested
- [ ] Secrets in platform secret storage; no secrets in browser code or GitHub
- [ ] HTTPS, security headers, dependency vulnerability scanning and penetration/security review
- [ ] Data minimisation, retention and deletion policy; UK GDPR lawful basis and processor contracts
- [ ] Encrypted database, backup schedule and **tested** restore process
- [ ] Email marketing rules (PECR/UK GDPR), suppression and opt-out handling before outreach sends

### 2. Financial and document correctness
- [ ] Quote and invoice totals use integer minor units / decimal-safe arithmetic
- [ ] VAT rules and registration status correctly represented; no false VAT charges
- [ ] UK invoice particulars and unique invoice identifiers verified
- [ ] PDF generation tested on mobile and desktop with long names, special characters and multiple lines
- [ ] Quote-to-invoice conversion preserves immutable history and correct references
- [ ] Payment status reflects real confirmed payments, not button clicks

### 3. Product reliability
- [ ] Create/edit/delete customer, quote and invoice tested end-to-end
- [ ] Concurrent edits and retry/idempotency behaviour tested
- [ ] Database migrations, staging environment, rollback and recovery documented
- [ ] Error reporting, uptime monitoring and alerting configured
- [ ] Automated unit, integration and browser tests pass in CI

### 4. Usability and accessibility
- [ ] Complete new-user journey tested on iPhone Safari, Android Chrome and desktop
- [ ] WCAG 2.2 AA audit and keyboard/screen-reader review
- [ ] Step-by-step onboarding, skip/resume, clear validation and no dead ends
- [ ] Real trader usability sessions completed and feedback incorporated

### 5. Commercial and legal
- [ ] Nuvrenta brand, trademark and domain clearance
- [ ] Privacy notice, cookie consent where required, terms and support process
- [ ] Pricing claims supported by dated evidence and clear geographic/unit scope
- [ ] Checkout, refunds, subscriptions and tax treatment validated before charging
- [ ] Business contact and complaints route published

### 6. Launch approval
- [ ] Staging sign-off and documented release checklist
- [ ] No unresolved critical or high-severity security issues
- [ ] Backup restore drill passed
- [ ] Production smoke tests passed
- [ ] Explicit owner approval to accept live customers or payments

## Current implementation boundaries
- `index.html` is a static preview.
- `workspace.html` stores guest records in local browser storage. This is **not secure cloud storage** and must not be marketed as production-ready.
- No production authentication, account sync, payments or email sending is confirmed.
- UK benchmark price references are provisional, not verified local averages.
- A GitHub commit is not proof of a successful Cloudflare deployment.

## Release sequence
1. Harden prototype and test current flows without real customer data.
2. Design production data model, auth, authorisation and secure storage.
3. Implement document logic, PDF generation and auditability.
4. Add compliant customer acquisition and pricing evidence pipeline.
5. Run automated tests, security review, real-device QA and recovery drill.
6. Launch only after all launch gates are independently checked.
