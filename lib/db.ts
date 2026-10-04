import "server-only";

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not configured. Run `vercel env pull .env.local` and restart the development server.",
  );
}

export const sql = neon(databaseUrl);