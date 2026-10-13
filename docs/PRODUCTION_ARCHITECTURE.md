# Nuvrenta production architecture — proposal, not deployed

## Deployment boundary
The existing static pages and browser-local workspace are **demonstrations only**. No real customer data, payment credentials, or business-critical records should be entered.

## Recommended stack
- Existing Cloudflare-hosted frontend remains the public entry point.
- Server-side API in Cloudflare Workers, backed by D1 (or equivalent managed SQL).
- Established identity provider with email verification, secure session cookies, MFA option, recovery flows and abuse protection. Do **not** invent homegrown password authentication.
- Server-generated PDFs using a vetted library; retain immutable issued-document snapshots.
- Durable object storage for generated documents with short-lived, authenticated download access.
- Centralised logs and monitoring that exclude personal data, secrets and document contents.

## Tenant boundaries
Every customer, quote, invoice and job belongs to an organisation. Every API request derives the user from a verified session, checks membership and permissions, and scopes SQL queries to the organisation. The browser must never choose an unrestricted organisation ID. Test cross-tenant reads and writes.

## Minimum relational schema
- users (id, identity_provider_subject, created_at)
- organisations (id, name, trade, region, created_at)
- memberships (user_id, organisation_id, role)
- customers (id, organisation_id, name, email, phone, address, created_at, archived_at)
- services (id, organisation_id, name, unit, unit_price_minor)
- documents (id, organisation_id, customer_id, kind, document_number, currency, status, issued_at, due_at, snapshot_json)
- document_lines (id, document_id, description, quantity_decimal, unit_price_minor, tax_code)
- payments (id, organisation_id, invoice_id, amount_minor, provider_event_id, status)
- audit_events (id, organisation_id, actor_id, action, entity_type, entity_id, timestamp)

Enforce foreign keys, unique (organisation_id, document_number), indexes on organisation_id, and immutable issued-document versions. Model quantities as decimals and money as integer minor units. Do not delete financial history when a customer is archived.

## Mandatory implementation order
1. Provision staging only; verify Cloudflare access, environment separation, secret handling and deployment mechanism.
2. Implement managed authentication and server-enforced tenant isolation.
3. Implement secure CRUD and migration-backed database with audit records.
4. Build and test PDF quote/invoice issuance, unique numbering, tax rules and quote-to-invoice conversion.
5. Add privacy retention, deletion/export procedures, encrypted backups and restore drill.
6. Run integration, adversarial security, accessibility and mobile tests; only then consider production rollout.

## Stop conditions
Do not expose customer registration or accept payments until the launch gate is signed off. A green CI test run only proves the checks ran; it does **not** certify security, compliance or readiness.
