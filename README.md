# Rajavasantha Welfare Trust

Production website and administration system for the Rajavasantha Welfare Trust.

- Production: <https://rajavasanthatrust.org>
- Framework: Next.js 15, React 19, TypeScript and Tailwind CSS
- Database: Neon PostgreSQL
- Media storage: Cloudinary
- Media source: Google Photos Picker API
- Mapping: MapLibre GL with GeoJSON clustering

## Local development

Requirements:

- Node.js 20 or newer
- npm
- A PostgreSQL/Neon database
- Cloudinary credentials
- A Google OAuth client with the Google Photos Picker API enabled

Install and start:

```bash
npm install
npm run db:migrate
npm run dev
```

The application is available at <http://localhost:3000>.

## Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon/PostgreSQL connection string |
| `ADMIN_PASSWORD` | Admin login credential |
| `ADMIN_SESSION_SECRET` | Signs admin sessions |
| `GOOGLE_PHOTOS_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_PHOTOS_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_PHOTOS_REDIRECT_URI` | OAuth callback URL |
| `GOOGLE_PHOTOS_TOKEN_ENCRYPTION_KEY` | Encrypts the stored refresh token |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Server-side Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Server-side Cloudinary API secret |

Production callback:

```text
https://rajavasanthatrust.org/api/google/photos/callback
```

Never commit real credentials or copy server secrets into client components.

## Database migrations

Migrations live in `db/migrations` and are applied in filename order:

```bash
npm run db:migrate
```

The command is intentionally non-destructive. Do not reset the production
database or remove existing project/media records.

The principal production tables are:

- `projects` — the single source of truth for admin and public projects.
- `project_gallery_images` — project media, Cloudinary references,
  fingerprints, source references and optional geographic metadata.
- `google_photos_connections` — the encrypted Google Photos refresh token.
- Project objective, impact metric and reference tables.

Legacy media-folder tables remain for migration compatibility, but public
projects and current Media Studio operations use `projects.id` and
`project_gallery_images.project_id`.

## Admin Media Studio

Protected routes:

- `/admin/login`
- `/admin`
- `/admin/folders/[id]`

The Media Studio supports:

- Creating and editing projects.
- Importing selected photos and videos through Google Photos Picker.
- Project-scoped Cloudinary ingestion.
- Publishing, unpublishing, featuring and deleting projects.
- Selecting, moving and deleting stored project media.
- Editing photo location labels and optional coordinates.
- Controlling location privacy and verification.

Every mutation is authorized at the API route, not only by middleware.
Mutation routes also enforce the existing same-origin checks.

## Google Photos import flow

```text
Admin
  -> authenticated Picker session
  -> Google-hosted Picker
  -> selected mediaItems.list results
  -> authenticated temporary baseUrl download
  -> content/MIME/size validation
  -> SHA-256 fingerprint
  -> optional EXIF extraction
  -> Cloudinary
  -> project_gallery_images
  -> project gallery
```

The application does not iframe, scrape or proxy the Google Photos UI.
Temporary Google `baseUrl` values are never stored as permanent website
media URLs.

### Duplicate semantics

Imports preserve both:

- `source_ref = google-photos:<mediaItemId>`
- SHA-256 `media_fingerprint` calculated from downloaded source bytes

Duplicate responses distinguish:

- `SAME_GOOGLE_ITEM` — the persistent Google media item was imported before.
- `SAME_FILE` — identical downloaded bytes already exist.
- `RACE_CONDITION` — another concurrent request inserted the item first.
- `UNKNOWN_DUPLICATE` — duplicate confirmed without a more specific reason.

The UI reports duplicates as **Already imported**, not as failures and not as
new imports. Existing media is never silently duplicated or moved.

### Google Photos location limitation

The Picker API does not expose the human-readable place shown in the Google
Photos Info panel. Google also documents that the `=d` media download omits
location EXIF.

Consequently:

- GPS and a location label are never required for import.
- Missing or malformed EXIF does not fail an import.
- The application never fabricates coordinates or place names.
- Admins can add a human-readable location label without coordinates.
- Coordinates can be added or cleared later.
- Photo location never overwrites the official project location.

Available non-location EXIF is preserved where present, including capture time,
camera/lens details, aperture, exposure, ISO and focal length.

## Geographic impact map

Public map:

```text
/projects/map
```

GeoJSON endpoint:

```text
/api/projects/map
```

The MapLibre map uses coordinate-level GeoJSON clustering, project/media
filters, viewport summaries and accessible project-list fallbacks.

Location privacy levels:

- `exact`
- `approximate`
- `area`
- `hidden`

Photo coordinates only reach the public map when the media is approved,
coordinates are valid, visibility is not hidden and an administrator has
verified the location. A location label without coordinates remains valid but
is not guessed onto the map.

Supported deep links:

```text
/projects/map?project=<project-id-or-slug>
/projects/map?lat=<latitude>&lng=<longitude>&zoom=<zoom>
```

## Public project system

- `/projects` — search, filters, featured projects and published archive.
- `/projects/[slug]` — project record and approved gallery.
- `/projects/map` — approved geographic project/media data.

Only `projects.is_public = true` records are returned publicly. Gallery
queries additionally require `project_gallery_images.approved = true`.
Admin feature controls update the existing `projects.featured` value used by
the public project listing.

## Media validation and storage

The ingestion pipeline:

- Verifies supported MIME types and actual file signatures.
- Enforces separate image/video size limits.
- Uses bounded streaming reads and download timeouts.
- Uploads to Cloudinary only from authenticated server routes.
- Stores canonical HTTPS Cloudinary URLs and asset identifiers.
- Cleans up Cloudinary uploads if database persistence fails.
- Cleans up race-losing duplicate uploads.
- Keeps Google Photos originals untouched.

Grid thumbnails use responsive optimization. Project lightboxes use the
canonical high-resolution Cloudinary asset rather than upscaling a thumbnail.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run build
npm run start
npm run db:migrate
```

Before deployment:

```bash
npm run lint
npm test
npm run build
git diff --check
```

Existing lint warnings should be investigated, but must not be hidden by
disabling rules globally.

## Deployment

The repository is connected to the existing Vercel project:

```text
rajavasantha-welfare-trust
```

Production domains:

```text
https://rajavasanthatrust.org
https://www.rajavasanthatrust.org
```

Before a production deployment:

1. Apply pending migrations.
2. Confirm all required production environment variables in Vercel.
3. Confirm the Google OAuth client authorizes the production callback.
4. Run lint, tests and the production build.
5. Perform an authenticated Google Photos browser smoke test.

Do not claim the real Picker flow passed unless it was tested with an
authenticated Google account and actual selected media.

## Design system

The site uses the established Rajavasantha visual language:

- Deep forest green, warm gold and ivory.
- Cormorant Garamond display typography.
- Inter UI/body typography.
- Editorial spacing, restrained motion and visible keyboard focus.
- Reduced-motion support and accessible dialogs/lightboxes.

Reuse existing components and tokens rather than introducing a second design
system.

## Security notes

- Admin sessions are signed and stored in secure HttpOnly cookies.
- Secure cookies are enabled in production.
- Sensitive Google Photos and media mutations require server-side admin auth.
- OAuth state is validated using the existing secure flow.
- Google refresh tokens are encrypted at rest.
- OAuth tokens, session secrets, passwords and Cloudinary secrets must never be
  logged or returned to the browser.
- Public project and map queries enforce publication/approval rules.

## Manual production smoke test

After deployment:

1. Open `/admin/login` and authenticate.
2. Open or create a project.
3. Open Google Photos Picker and select real media.
4. Import it into the selected project.
5. Confirm Imported / Already imported / Failed counts.
6. Confirm the permanent Cloudinary-backed gallery item.
7. Import the same item again and confirm `SAME_GOOGLE_ITEM`.
8. Add or clear a location label without coordinates.
9. Verify media remains valid with no location.
10. Add verified coordinates only when they are known and approved.
11. Publish the project and verify `/projects`, its detail page and map.

No fake projects, impact figures, locations or public media should be added for
testing.
