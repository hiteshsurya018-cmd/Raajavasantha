# Rajavasantha platform

## Structure

```
app/                         Next.js App Router public routes and metadata
components/                  accessible UI components and homepage sections
backend/Rajavasantha.Api/    ASP.NET Core 9 REST API
  Domain/                    normalized domain entity models
  Infrastructure/            EF Core SQL Server context and mappings
docs/                        operational and API documentation
```

## Data model

Every table has a UUID primary key, UTC creation timestamp, soft-delete flag and update timestamp. Unique indexes exist on user email, role name, category slug, project slug, and content `(type, slug)`.

| Domain | Tables |
| --- | --- |
| Identity | Users, Roles, UserRoles, RefreshTokens |
| Programmes | Categories, Projects, ImpactStatistics |
| Fundraising | Donations |
| Community | Volunteers, ContactMessages, Testimonials, Partners, Subscribers |
| Publishing | ContentItems (Blogs, Events, News), Albums, GalleryItems, Documents, Settings |

`ContentItems.Type` separates Blogs, Events and News while retaining one normalised publishing workflow. `Donations` belongs optionally to a Project; a completed payment receives a unique immutable receipt number.

## REST API

| Method | Route | Authorization |
| --- | --- | --- |
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/contact` | Public, rate-limited |
| POST | `/api/v1/volunteers` | Public, rate-limited |
| GET | `/api/v1/projects` | Public |
| GET | `/api/v1/content/{type}` | Public |
| GET | `/api/v1/admin/dashboard` | Admin |
| POST | `/api/v1/admin/projects` | Admin |

Swagger is exposed only in Development at `/swagger`. Production should expose it through a separately authenticated internal route if required.

## Security controls

Access tokens are signed JWTs (15 minutes). Refresh tokens are random, BCrypt-hashed, stored server-side, expiry-bound, and revocable. Enforce HTTPS at the edge, use a Key Vault secret for JWT signing keys and payment secrets, restrict CORS to configured origins, apply the write limiter, validate every DTO, and use HTTP-only same-site cookies if refresh tokens are moved from a native/mobile client to browser flows.

## Deployment

1. Create an Azure SQL database and set `ConnectionStrings__SqlServer` in the API App Service / Container App.
2. Store `Jwt__Key`, Razorpay/Stripe keys, and email provider credentials in Azure Key Vault; reference them from the workload identity.
3. Build and push the `web` and `api` images. Run database migrations as a one-off, versioned release job: `dotnet ef database update`.
4. Put the web and API behind Azure Front Door or an Application Gateway with managed TLS, WAF and a custom domain.
5. Configure `NEXT_PUBLIC_API_URL`, API CORS origins, health probes, Application Insights and alerting.

The frontend supplies SSR/Server Components, Next image optimisation, per-route code splitting, dynamic metadata, OpenGraph defaults, `robots.txt`, and `sitemap.xml`. Set page-level `revalidate` values once editorial publishing cadence is defined.
