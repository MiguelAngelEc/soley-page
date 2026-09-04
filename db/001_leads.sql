-- Esquema de leads (WA-003).
-- Aplicar una vez sobre la base de Neon/Vercel Postgres:
--   psql "$DATABASE_URL" -f db/001_leads.sql

create table if not exists leads (
  id                  text primary key,
  submission_token    uuid        not null,
  status              text        not null
                        check (status in ('RECEIVED', 'NOTIFIED', 'NOTIFICATION_FAILED')),

  source              text        not null,
  client_type         text        not null,
  query_type          text        not null,

  name                text        not null,
  phone               text        not null,
  email               text,
  company             text,
  ruc                 text,
  industry            text,

  product_ids         text[]      not null default '{}',
  quantity            text,
  message             text,

  whatsapp_opt_in     boolean     not null default false,
  privacy_accepted_at timestamptz not null,
  consent_version     text        not null,

  openwa_message_id   text,
  notification_error  text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Deduplicacion: la clave es el token de la solicitud, nunca datos personales.
create unique index if not exists leads_submission_token_key
  on leads (submission_token);

-- Para la bandeja de trabajo: primero lo mas reciente.
create index if not exists leads_created_at_idx
  on leads (created_at desc);

-- Para localizar lo que quedo sin avisar cuando OpenWA falla.
create index if not exists leads_status_idx
  on leads (status)
  where status <> 'NOTIFIED';
