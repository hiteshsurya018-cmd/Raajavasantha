create table if not exists google_photos_connections (
  id smallint primary key check (id = 1),
  refresh_token text not null,
  scope text,
  token_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table project_gallery_images add column if not exists original_filename text;
alter table project_gallery_images add column if not exists mime_type text;
alter table project_gallery_images add column if not exists bytes bigint;
alter table project_gallery_images add column if not exists cloudinary_public_id text;
alter table project_gallery_images add column if not exists cloudinary_asset_id text;
alter table project_gallery_images add column if not exists media_fingerprint text;
alter table project_gallery_images add column if not exists resource_type text;
alter table project_gallery_images add column if not exists format text;
alter table project_gallery_images add column if not exists width integer;
alter table project_gallery_images add column if not exists height integer;
alter table project_gallery_images add column if not exists source_ref text;
alter table project_gallery_images add column if not exists approved boolean not null default true;
alter table project_gallery_images add column if not exists created_at timestamptz not null default now();

create unique index if not exists project_gallery_images_fingerprint_uidx
  on project_gallery_images (media_fingerprint) where media_fingerprint is not null;
create unique index if not exists project_gallery_images_source_ref_uidx
  on project_gallery_images (source, source_ref) where source_ref is not null;
create index if not exists project_gallery_images_project_order_idx
  on project_gallery_images (project_id, approved, sort_order, created_at);
