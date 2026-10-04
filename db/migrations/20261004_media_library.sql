create table if not exists media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cover_photo_id uuid,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media_photos (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references media_folders(id) on delete cascade,
  original_filename text not null,
  mime_type text not null,
  original_bytes bigint not null,
  width integer,
  height integer,
  cloudinary_public_id text not null,
  cloudinary_asset_id text,
  cloudinary_url text not null,
  thumbnail_public_id text not null,
  thumbnail_url text not null,
  media_fingerprint text not null,
  source text not null,
  source_ref text,
  alt text not null,
  caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table media_folders drop constraint if exists media_folders_cover_photo_id_fkey;
alter table media_folders add constraint media_folders_cover_photo_id_fkey
  foreign key (cover_photo_id) references media_photos(id) on delete set null;

create index if not exists media_folders_public_updated_idx
  on media_folders (is_public, updated_at desc);
create index if not exists media_photos_folder_created_idx
  on media_photos (folder_id, created_at desc);
create unique index if not exists media_photos_fingerprint_uidx
  on media_photos (media_fingerprint);
create unique index if not exists media_photos_source_ref_uidx
  on media_photos (source, source_ref) where source_ref is not null;
