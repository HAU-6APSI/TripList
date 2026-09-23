-- TripList schema
-- Run once against your Postgres database:
--   psql "$DATABASE_URL" -f schema.sql
-- (or use `npm run db:init`, see scripts/init-db.js)

create extension if not exists pgcrypto; -- for gen_random_uuid()

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  name text not null,
  notes text not null default '',
  done boolean not null default false,
  status text not null default 'next',
  address text not null default '',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  name text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_destinations_trip_id on destinations(trip_id);
create index if not exists idx_activities_trip_id on activities(trip_id);

alter table destinations add column if not exists status text not null default 'next';
alter table destinations add column if not exists address text not null default '';
alter table destinations add column if not exists latitude double precision;
alter table destinations add column if not exists longitude double precision;
