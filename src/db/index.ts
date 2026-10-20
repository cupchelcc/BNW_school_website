import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

function getClient() {
  const remoteUrl = process.env.DATABASE_URL;
  if (remoteUrl && (remoteUrl.startsWith('libsql://') || remoteUrl.startsWith('https://') || remoteUrl.startsWith('http://'))) {
    return createClient({
      url: remoteUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }

  // Local / Serverless SQLite database path resolution
  let dbPath = path.resolve(process.cwd(), 'bnw_school.db');

  // In Serverless runtimes (Vercel / AWS Lambda), the deployment root is strictly read-only.
  // SQLite must be writable for sessions, audit logs, and CMS mutations.
  // We copy the seeded bnw_school.db template to /tmp which is fully read-write.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = '/tmp/bnw_school.db';
    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(dbPath)) {
          fs.copyFileSync(dbPath, tmpDbPath);
        }
      }
      dbPath = tmpDbPath;
    } catch (err) {
      console.warn('[DB] Failed to copy database template to /tmp:', err);
    }
  }

  return createClient({
    url: `file:${dbPath}`,
  });
}

const client = getClient();

export const db = drizzle(client, { schema });
export { schema };
