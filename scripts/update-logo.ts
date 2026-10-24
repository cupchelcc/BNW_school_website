import { createClient } from '@libsql/client';
import fs from 'fs';

function loadEnv() {
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
}

async function main() {
  loadEnv();
  console.log('[Logo Update] Starting database logo update...');

  // 1. Local SQLite
  try {
    const local = createClient({ url: 'file:bnw_school.db' });
    await local.execute("UPDATE theme_settings SET logo_url = '/images/logo.png' WHERE id = 'current'");
    console.log('[Logo Update] ✅ Local DB updated logo_url to /images/logo.png');
  } catch (err) {
    console.error('[Logo Update] ⚠️ Local DB update failed:', err);
  }

  // 2. Turso Cloud DB
  const tursoUrl = process.env.DATABASE_URL;
  const tursoToken = process.env.DATABASE_AUTH_TOKEN;

  if (tursoUrl && tursoUrl.startsWith('libsql://')) {
    try {
      console.log(`[Logo Update] Updating Turso Cloud DB at ${tursoUrl}...`);
      const remote = createClient({
        url: tursoUrl,
        authToken: tursoToken,
      });
      await remote.execute("UPDATE theme_settings SET logo_url = '/images/logo.png' WHERE id = 'current'");
      console.log('[Logo Update] ✅ Turso Cloud DB updated logo_url to /images/logo.png');
    } catch (err) {
      console.error('[Logo Update] ⚠️ Turso Cloud update failed:', err);
    }
  } else {
    console.log('[Logo Update] ℹ️ No Turso Cloud URL detected.');
  }

  console.log('[Logo Update] Finished successfully.');
}

main().catch((err) => {
  console.error('[Logo Update] Fatal error:', err);
  process.exit(1);
});
