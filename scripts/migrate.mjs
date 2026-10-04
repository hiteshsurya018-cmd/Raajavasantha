import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const sql = neon(databaseUrl);
const directory = resolve(process.cwd(), "db", "migrations");
const migrations = (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort();

for (const migration of migrations) {
  const source = await readFile(resolve(directory, migration), "utf8");
  const statements = source.split(/;\s*(?:\r?\n|$)/).map((value) => value.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  console.log(`Applied ${migration}`);
}
