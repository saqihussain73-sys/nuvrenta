# NUVRENTA — LOCKED V1 PRODUCT & IMPLEMENTATION SPECIFICATION
Date: 2026-10-13
Status: Planning baseline COMPLETE for engineering handoff; external verification remains execution work.
Supersedes ambiguous feature assumptions in earlier notes. No public launch authorised.

## 1. Objective and audience
UK-first mobile-first guided startup and operations workspace for sole traders and small trade businesses. Initial industries: domestic/commercial cleaning, gardening, mobile car valeting. Target: novice trader who needs to create a profile, price work, find and manage customers, quote, invoice and track work from a phone. Plain English and progressive disclosure; no Word/Excel dependency. Brand Nuvrenta, tagline “Big ambitions. Better beginnings.” Palette dark teal #142C35, sage #B5D9CE, cream #F5F2E9, gold #D6B780. Branding provisional until clearance.

## 2. V1 included
- Marketing homepage, plain-English explanation, pricing disclaimer, FAQ, contact/support and policies.
- Secure sign-up, verified email, login/logout, passwordless or managed-provider authentication, account recovery, session revocation.
- One owner-managed business organisation per account for MVP; architecture supports future staff/multiple organisations without exposing unimplemented features.
- Six-step onboarding: industry; business name and service area; select services; set own prices; business contact; review and finish. Save/resume; progress indicator; sensible skips. Ask for legal identity/address only when issuing compliant invoices.
- Business profile edit; business contact details; service catalogue; default and custom rates.
- Customer CRUD, search, archive; prevent cross-business access.
- Quotes: create/edit draft, line items, notes, expiry, preview, PDF, issue/send via explicit user action, status draft/sent/accepted/declined/expired; convert accepted quote to draft invoice, preserve source link.
- Invoices: create draft, line items, correct legal fields, tax treatment, preview, PDF, issue with unique numbering, status issued/partially paid/paid/overdue/void or credited per accounting rules. Manual payment recording clearly distinguished from payment-provider confirmation.
- Customer-facing quote/invoice PDF via email only after configured transactional email provider and delivery logging; no unsolicited marketing by default.
- Overview dashboard: setup progress, customer count, outstanding quotes, unpaid invoices, upcoming jobs where supported.
- Basic appointments/jobs: date/time, customer, service, status; no automated reminders until email and privacy requirements satisfied.
- Pricing reference display: clearly labelled indicative ranges, dated source and geographic/unit scope, never mandated; own rate always editable.
- Basic analytics: privacy-aware aggregate page views, signup funnel, onboarding completion, quotes/invoices created; no hidden tracking without applicable consent.
- Guest route: one-off demo with clearly visible demo-only watermark, no real customer information, no false promise of cloud storage; full save/email requires account.

## 3. Explicitly out of scope for V1
- Automatic scraping of personal contact data or automated cold-email blasts.
- Marketplace matching, guaranteed leads, national directory, customer purchasing/booking portal.
- AI-generated outreach sent without human review.
- Subscription billing and real online payments; design extension points, sandbox only.
- International taxes/currencies, payroll, accounting integration, VAT filing, multi-staff permission UI, native iOS/Android apps.
- Claims of real-time verified UK average prices until research pipeline is validated.
- Full CRM marketing automation, SMS campaigns, social integrations, domain/email mailbox resale.
These are roadmap items, not hidden prerequisites for MVP launch.

## 4. Navigation and screen-level requirements
Public: Home > How it works > Pricing guidance > Sign in / Start business > Help > Policies.
Authenticated mobile: Overview, Setup, Customers, Quotes, Invoices, Jobs, Services & prices, Business settings, Help, Sign out. Use bottom nav for most-used areas and More for others; accessible labels, focus states, 44px touch targets, no horizontal scrolling at 320px.
Overview: clear primary next action; counts linked to filtered lists; onboarding resume.
Setup: 6 steps, back/continue, inline validation, auto-save, resume after logout; no dead ends.
Customers: list/search/add/edit/archive, confirm destructive actions, no hard-delete of referenced financial records.
Quotes: list/filter/create/edit/preview/issue/download/convert; show saved state and errors.
Invoices: list/filter/create/edit draft/issue/download/record payment; prohibit changing issued snapshot.
Jobs: list/calendar-lite/create/edit/status; clear timezone Europe/London and daylight-saving handling.
Settings: business identity, address, email, currency GBP, VAT status, export data, request deletion, notification preferences.
Help: contact form or support email, documentation and complaint route.

## 5. Data and security design
Primary preference: existing Cloudflare Worker + D1 + object storage and a reputable managed identity provider compatible with Workers. If provisioning or security limitations force a different stack, record an architecture decision before spending on an alternative. Separate staging and production environments.
Entities: users, organisations, memberships, business_profiles, customers, services, jobs, quotes/invoices, line_items, document_snapshots, document_sequences, payment_records, email_deliveries, audit_events, privacy_requests.
Every tenant-owned record includes organisation_id; server derives identity from validated session, resolves membership from database and scopes every query. Do not trust user/organisation IDs, prices, status or document totals from client. Enforce tenant invariants in transactions and tests. Use parameterised queries, CSRF protections where applicable, strict CORS/origin, CSP, secure HttpOnly SameSite cookies, rate limits, input length and file limits, anti-enumeration errors, dependency scans, secret vault, no secrets in git. Encryption in transit and at rest. Backups with tested restore, retention and deletion rules.
Role: owner only exposed in V1; deny all unimplemented roles by default. Multi-tenant negative tests mandatory.
PII: data minimisation, retention policy, export/deletion workflows, processor inventory and lawful basis. No sensitive data in logs/analytics.

## 6. Financial and legal rules
GBP only. Money represented as integer pence; quantities represented in exact decimal notation; deterministic rounding specified and tested. Never use binary floating point as authority for tax/total calculations.
UK invoices must include all required particulars applicable to issuer and VAT status, verified against current HMRC/GOV.UK guidance before issue. VAT is opt-in only for VAT-registered businesses with valid settings; do not invent a VAT number or imply VAT charged when not registered. Tax rates/exemptions and reverse-charge scenarios require explicit verified treatment; unsupported cases must be blocked or referred to an accountant. Sequential unique invoice numbers allocated atomically per organisation at issue. Issued snapshots immutable; corrections via documented credit/void process with audit trail. Quote validity, payment terms and late-payment wording configurable, not legal advice.
Brand/trademark, company identity, ICO/GDPR, PECR, cookie/analytics consent, terms/privacy and consumer law to be checked by appropriate specialists before production. Do not promise compliance without review.

## 7. Pricing data specification
Catalogue for cleaning, gardening, mobile valeting; service name, description, unit (hour/job/m2/visit), lower/upper indicative range, location scope, source URL/title, date checked, confidence, exclusions and review date. Publish only substantiated ranges. User-entered prices always override suggested ranges. No invented official national standard. Research refresh is a separate verified workflow; until built, mark benchmarks provisional.

## 8. Customer discovery and email
V1 offers ethical guidance, suggested customer categories, search templates and a draft outreach email that user can edit/copy. No autonomous lead scraping, personal-email harvesting or bulk sending. If transactional email is implemented, it is restricted to quotes/invoices and explicit user-initiated actions. Marketing outreach requires separate lawful-basis, PECR and opt-out design and explicit owner authorisation before activation.

## 9. UX and accessibility acceptance
New user can register, verify, complete setup and issue a valid quote on iPhone without desktop. Responsive 320–1440px; WCAG 2.2 AA target; keyboard navigation, labels, focus, contrast, error messaging, reduced motion and screen-reader testing. Forms save/resume, show actionable errors, handle offline/network failure without false success. Test Safari iPhone, Android Chrome, desktop Chrome/Firefox/Safari where available. Test at least 3 representative first-time users before public launch; record observed friction and fixes.

## 10. Analytics and privacy
Track pageview, signup_start, signup_complete, onboarding_step_complete, onboarding_complete, customer_created, quote_issued, invoice_issued, job_created, conversion to paid tier when available. Events contain no names, emails, addresses, invoice content or secret tokens. Choose a privacy-respecting analytics approach; consent and cookie behaviour must follow current UK rules.

## 11. Testing matrix and pass criteria
Automated: unit tests for money, quantity, tax, invoice numbering, state transitions, validation; integration tests for auth, tenant boundaries, customer/doc CRUD, job and email delivery; E2E for onboarding through invoice; accessibility checks; build and deployment smoke tests.
Security negatives: unauthenticated access denied; cross-tenant read/write/delete/list denied; role escalation denied; token expiry/revocation enforced; injection/XSS/CSRF, request size, brute force, duplicate webhooks, IDOR, PDF escaping, rate limiting tested.
Data: transactional issue/number allocation, concurrent requests, retry/idempotency, audit completeness, backup and restore.
No unresolved critical/high security issues; all mandatory CI checks green; all P0 flows pass on mobile; no silent data loss; documented rollback; production deployment smoke tests; legal review sign-off; owner approves activation. Failures block release.

## 12. Delivery phases with exit gates
0. Baseline: inventory code/deploys, reproduce CI, fix broken tests, verify account permissions. Exit: baseline report with links and defects.
1. Staging foundation: Cloudflare staging Worker/D1/storage/secrets, managed auth, schema migrations, audit logging. Exit: secure sign-in and authenticated health/API in staging, cross-account tests pass.
2. Core workspace: profile, onboarding, customers, services, jobs with durable tenant-scoped persistence. Exit: E2E tests pass on staging/mobile.
3. Documents: quotes, invoices, PDFs, conversion, immutable history, tax and numbering. Exit: reviewed UK invoice sample and finance tests pass.
4. Email and pricing: transactional document delivery and verified source-based indicative pricing. Exit: consent/PECR constraints and delivery tests pass.
5. Polish/analytics: navigation, accessibility, privacy-aware analytics, support and policies. Exit: usability and accessibility reviews pass.
6. Hardening: vulnerability scan, backup restore, incident response, independent security/legal review, load tests and staging sign-off. Exit: signed release report.
7. Launch: only with explicit user approval; domain/brand clearance and operational support in place. Payments remain off unless separately approved.

## 13. Operating and cost constraints
Reuse GitHub and existing Cloudflare deployment; no duplicate site-builder or paid backend without justification. Staging only until sign-off. Choose free/low-cost resources where possible but request explicit approval before charges. Document expected recurring costs before creating billable services. Commit in small reviewed changes; don't rewrite functioning screens without evidence. Do not overbuild roadmap features.

## 14. Required handoff output/evidence
For each phase: commit SHA, deployed staging URL (if any), CI result URL, tests run with results, screenshots/mobile QA, security findings, migration status, unresolved blockers and actual spend. Never call a code commit a deployment. If account access is missing, ask only for the exact connection or permission; continue all independent work. Do not claim autonomous work persists after session unless delegated.

## 15. Decisions locked vs conditional
LOCKED: UK first, three initial trades, mobile-first, trader-set prices, guest demo, secure accounts for real records, quotes/invoices, GBP, no real payments at MVP, staged rollout, explicit launch approval.
CONDITIONAL ON EVIDENCE: Cloudflare identity provider choice, PDF generation implementation, email provider, analytics provider, exact HMRC/legal invoice rules, benchmark price figures, brand/domain clearance, production pricing and costs. These are verification/procurement decisions, not open-ended product design.

## 16. Definition of 'planning complete'
The product scope, screens, data model, acceptance criteria, sequencing, launch gates, exclusions and decision policy are documented here. Remaining unknowns require real-world verification or account access and belong in execution. This document does not certify the website secure or ready for public launch.
