alter table projects add column if not exists is_public boolean not null default true;

alter table media_folders add column if not exists project_id uuid;

insert into projects (
  id, slug, title, description, short_description, category, location,
  country, status, featured, cover_image, cover_image_alt, is_public,
  created_at, updated_at
)
select
  f.id,
  case when exists (select 1 from projects existing where existing.slug = f.slug)
    then f.slug || '-' || left(replace(f.id::text, '-', ''), 8)
    else f.slug end,
  f.name,
  coalesce(nullif(f.description, ''), f.name),
  left(coalesce(nullif(f.description, ''), f.name), 320),
  'Pending verification',
  'Location pending',
  'India',
  'pending',
  false,
  cover.cloudinary_url,
  cover.alt,
  f.is_public,
  f.created_at,
  f.updated_at
from media_folders f
left join media_photos cover on cover.id = f.cover_photo_id
where f.project_id is null
  and not exists (select 1 from projects existing where existing.id = f.id)
on conflict do nothing;

update media_folders f
set project_id = p.id
from projects p
where f.project_id is null and p.id = f.id;

insert into project_gallery_images (
  id, project_id, src, alt, caption, source, sort_order,
  original_filename, mime_type, bytes, cloudinary_public_id,
  cloudinary_asset_id, media_fingerprint, resource_type, format,
  width, height, source_ref, approved, created_at
)
select
  photo.id, folder.project_id, photo.cloudinary_url, photo.alt, photo.caption,
  photo.source, (row_number() over (partition by folder.project_id order by photo.created_at, photo.id) - 1)::integer,
  photo.original_filename, photo.mime_type, photo.original_bytes,
  photo.cloudinary_public_id, photo.cloudinary_asset_id, photo.media_fingerprint,
  'image', 'webp', photo.width, photo.height, photo.source_ref, true, photo.created_at
from media_photos photo
join media_folders folder on folder.id = photo.folder_id
where folder.project_id is not null
on conflict do nothing;

alter table media_folders drop constraint if exists media_folders_project_id_fkey;

alter table media_folders add constraint media_folders_project_id_fkey
  foreign key (project_id) references projects(id) on delete set null;

create unique index if not exists media_folders_project_id_uidx
  on media_folders (project_id) where project_id is not null;

create index if not exists projects_public_updated_idx
  on projects (is_public, updated_at desc);
