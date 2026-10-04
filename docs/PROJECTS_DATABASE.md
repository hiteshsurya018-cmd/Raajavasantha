# Projects data architecture

The public project pages read through `lib/projects.ts`. UI components do not
own project data directly.

Current local source:

```
data/projects.ts
```

Future Neon/PostgreSQL source:

```
DATABASE_URL=postgres://...
```

Do not expose `DATABASE_URL` through `NEXT_PUBLIC_` variables. Project reads
must stay in server components, route handlers or other server-only modules.

## Suggested PostgreSQL schema

```sql
create table projects (
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

create table project_objectives (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  objective text not null,
  sort_order integer not null default 0
);

create table project_impact_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  label text not null,
  value text not null,
  pending boolean not null default false,
  sort_order integer not null default 0
);

create table project_gallery_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  src text not null,
  alt text not null,
  caption text,
  source text not null default 'local',
  sort_order integer not null default 0
);

create table project_references (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  label text not null,
  href text not null,
  sort_order integer not null default 0
);
```

## Gallery source compatibility

The UI expects gallery items with `src`, `alt`, optional `caption`, and
optional `source`. A later adapter can map local files, Cloudinary assets,
Google Photos album exports, or another CDN into that same shape. Keep the
external provider integration in the data layer so gallery components do not
need to change.

## Map data

The map renders markers only for records with verified `latitude` and
`longitude`. Leave coordinates empty until the Trust approves public location
data.
