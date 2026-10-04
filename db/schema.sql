create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  short_description text not null,
  category text not null,
  location text not null,
  district text,
  state text,
  country text not null default 'India',
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  year integer,
  start_date date,
  end_date date,
  cover_image text,
  cover_image_alt text,
  status text not null default 'planning',
  featured boolean not null default false,
  beneficiaries text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_objectives (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  objective text not null,
  sort_order integer not null default 0
);

create table if not exists project_impact_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  label text not null,
  value text not null,
  pending boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists project_gallery_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  src text not null,
  alt text not null,
  caption text,
  source text not null default 'local',
  sort_order integer not null default 0,
  original_filename text,
  mime_type text,
  bytes bigint,
  cloudinary_public_id text,
  cloudinary_asset_id text,
  media_fingerprint text,
  resource_type text,
  format text,
  width integer,
  height integer,
  source_ref text,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists google_photos_connections (
  id smallint primary key check (id = 1),
  refresh_token text not null,
  scope text,
  token_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_references (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  label text not null,
  href text not null,
  sort_order integer not null default 0
);

create index if not exists projects_location_idx
  on projects (latitude, longitude);

create index if not exists projects_category_idx
  on projects (category);

create index if not exists projects_year_idx
  on projects (year);

create index if not exists projects_status_idx
  on projects (status);

create unique index if not exists project_gallery_images_fingerprint_uidx
  on project_gallery_images (media_fingerprint) where media_fingerprint is not null;
create unique index if not exists project_gallery_images_source_ref_uidx
  on project_gallery_images (source, source_ref) where source_ref is not null;
create index if not exists project_gallery_images_project_order_idx
  on project_gallery_images (project_id, approved, sort_order, created_at);
