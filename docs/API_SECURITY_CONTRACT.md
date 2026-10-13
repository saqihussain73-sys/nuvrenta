# API security contract (staging design; not deployed)

## Every request
1. Authenticate through a vetted identity provider and validate signature, issuer, audience and expiry on the server.
2. Resolve membership from database using authenticated identity, never from a browser-supplied user ID.
3. Enforce role-based permission for the requested operation.
4. Filter all reads, writes, joins and deletes by verified organisation membership.
5. Validate and bound request inputs, use parameterised queries, reject unknown fields.
6. Rate-limit mutations and log only redacted metadata.
7. Respond with generic not-found for inaccessible records to avoid cross-tenant enumeration.

## Example access control
`GET /api/customers/:id`: server determines allowed organisation IDs from verified session; SQL filters by customer ID **and** allowed organisation ID. A guessed customer ID must never disclose a record belonging to another organisation.

## Document integrity
- Drafts may be edited; issued documents must retain an immutable snapshot and an auditable correction/void flow.
- Unique invoice number generated transactionally per organisation.
- Monetary calculations use decimal-safe arithmetic; the current browser demo is not the authoritative calculation engine.
- Webhook-driven payment confirmation must validate signatures and be idempotent.
- Never trust a browser-supplied total, payment status or invoice owner.

## Required security tests
- Unauthenticated requests return 401.
- Valid user without organisation membership receives no data.
- Member of organisation A cannot read, edit, delete or enumerate organisation B records.
- Read-only member cannot issue or void documents without permission.
- Duplicate payment events do not duplicate payment records.
- Invalid session tokens and expired sessions are rejected.
- Injection strings and malformed numbers are rejected.
- Logout and account removal revoke access as specified.

## Deployment constraints
No API routes are implemented by this document. Provision staging secrets, auth, D1 and migrations before deploying any route. No live registrations or payment processing until launch approval.
