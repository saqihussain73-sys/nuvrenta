-- Nuvrenta staging schema — NOT deployed.
-- Authenticated identity must be established by a trusted identity provider.
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, identity_subject TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS organisations (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, trade TEXT NOT NULL, region TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS memberships (
 user_id TEXT NOT NULL REFERENCES users(id), organisation_id TEXT NOT NULL REFERENCES organisations(id),
 role TEXT NOT NULL CHECK(role IN ('owner','admin','member')),
 PRIMARY KEY(user_id,organisation_id)
);
CREATE TABLE IF NOT EXISTS customers (
 id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL REFERENCES organisations(id),
 name TEXT NOT NULL, email TEXT, phone TEXT, address TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, archived_at TEXT
);
CREATE INDEX IF NOT EXISTS customers_by_org ON customers(organisation_id,created_at);
CREATE TABLE IF NOT EXISTS services (
 id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL REFERENCES organisations(id),
 name TEXT NOT NULL, unit TEXT NOT NULL DEFAULT 'each', unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor>=0)
);
CREATE INDEX IF NOT EXISTS services_by_org ON services(organisation_id);
CREATE TABLE IF NOT EXISTS documents (
 id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL REFERENCES organisations(id),
 customer_id TEXT NOT NULL REFERENCES customers(id),
 kind TEXT NOT NULL CHECK(kind IN ('quote','invoice')),
 document_number TEXT NOT NULL,
 currency TEXT NOT NULL DEFAULT 'GBP' CHECK(currency='GBP'),
 status TEXT NOT NULL CHECK(status IN ('draft','issued','void','paid')),
 issued_at TEXT, due_at TEXT, snapshot_json TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(organisation_id,document_number)
);
CREATE INDEX IF NOT EXISTS documents_by_org ON documents(organisation_id,created_at);
CREATE TABLE IF NOT EXISTS document_lines (
 id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES documents(id),
 description TEXT NOT NULL, quantity_decimal TEXT NOT NULL,
 unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor>=0),
 tax_code TEXT NOT NULL DEFAULT 'unspecified'
);
CREATE TABLE IF NOT EXISTS payments (
 id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL REFERENCES organisations(id),
 invoice_id TEXT NOT NULL REFERENCES documents(id),
 amount_minor INTEGER NOT NULL CHECK(amount_minor>0),
 provider_event_id TEXT UNIQUE,
 status TEXT NOT NULL CHECK(status IN ('pending','confirmed','failed','refunded'))
);
CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL REFERENCES organisations(id),
 actor_id TEXT REFERENCES users(id), action TEXT NOT NULL,
 entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
 timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
