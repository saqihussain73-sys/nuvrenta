# Nuvrenta GitHub → Cloudflare staging deployment

## Current status
This is an implementation plan, not an active deployment. Existing Cloudflare Worker configuration and account are not yet inventoried. Never point automation at the current public Worker or overwrite its routes without verifying ownership and rollback.

## Credential setup (performed by account owner)
1. In Cloudflare, create a restricted API token using the **Edit Cloudflare Workers** template or minimum permissions required for staging Workers Scripts, and D1 only when migrations are needed. Restrict the token to the Nuvrenta account. Avoid global API keys.
2. In GitHub repository Settings → Secrets and variables → Actions, add **CLOUDFLARE_API_TOKEN** as a repository secret and **CLOUDFLARE_ACCOUNT_ID** as a repository variable (or secret if preferred). Never paste tokens in chat, code, issue comments or screenshots.
3. Prefer a GitHub Environment named **staging** with deployment protection and environment-scoped secrets. Production must use separate credentials and explicit approval.
4. If Cloudflare staging has not been provisioned, create a staging Worker and D1 database with distinct names and no production routes. Record binding names and database IDs securely.

## Deployment guardrails
- CI tests run on pushes and pull requests.
- Staging deployment must be **manual** until the Worker entrypoint, wrangler configuration, identity provider and D1 bindings are implemented and reviewed.
- The deployment workflow must use `environment: staging`, require successful tests, use a pinned Wrangler version and Cloudflare API token stored in Actions secrets.
- Never deploy the browser-local guest workspace as a secure production workspace. No live registration, customer records, marketing email or payments.
- Never run D1 production migrations automatically. Staging migrations require review, backups and idempotent scripts.
- Verify post-deploy HTTP status, expected staging-only health marker, authentication rejection and tenant-boundary tests. Capture workflow and deployment URLs.

## Remaining engineering work
- Identify Cloudflare account, existing Worker name and deployment path without assuming automatic GitHub sync.
- Create a separate staging Worker entrypoint and wrangler staging configuration with D1 binding.
- Integrate real managed authentication, database migrations and server-side API.
- Add manual GitHub Actions staging deployment workflow after configuration is validated.
- Run the complete test matrix and document rollback.

## What can proceed without Cloudflare browser sign-in
GitHub source changes, unit tests, CI repairs, staging Worker source and configuration templates, review and GitHub Actions workflow authoring.

## What still requires account access
Creating Cloudflare API token and choosing an account, provisioning D1 resources and setting encrypted GitHub secrets; these are one-time setup steps. Never ask the user to reveal token values.
