import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL || 'file:bnw_school.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

// LibSQL Client initialization (Compatible with SQLite local file, Turso, and D1 SQLite dialect)
const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
export { schema };
