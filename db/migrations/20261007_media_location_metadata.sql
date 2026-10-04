alter table project_gallery_images add column if not exists location_source text;
alter table project_gallery_images add column if not exists location_precision text not null default 'unknown';
alter table project_gallery_images add column if not exists location_verified boolean not null default false;
alter table project_gallery_images add column if not exists camera_make text;
alter table project_gallery_images add column if not exists camera_model text;
alter table project_gallery_images add column if not exists lens_model text;
alter table project_gallery_images add column if not exists aperture numeric(10, 4);
alter table project_gallery_images add column if not exists exposure_time text;
alter table project_gallery_images add column if not exists iso integer;
alter table project_gallery_images add column if not exists focal_length numeric(10, 4);

alter table project_gallery_images drop constraint if exists project_gallery_images_location_source_check;
alter table project_gallery_images add constraint project_gallery_images_location_source_check
  check (location_source is null or location_source in ('google_photos', 'admin', 'exif', 'project'));

alter table project_gallery_images drop constraint if exists project_gallery_images_location_precision_check;
alter table project_gallery_images add constraint project_gallery_images_location_precision_check
  check (location_precision in ('exact', 'area', 'unknown'));
