import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

/**
 * สคริปต์สำหรับโอนย้ายฐานข้อมูลท้องถิ่น (bnw_school.db) ขึ้นสู่ Turso Cloud Database (0 THB Free Tier)
 * การใช้งาน:
 * TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npx tsx scripts/sync-to-turso.ts
 */

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  if (!tursoUrl || (!tursoUrl.startsWith('libsql://') && !tursoUrl.startsWith('https://'))) {
    console.log('------------------------------------------------------------');
    console.log('📌 วิธีเชื่อมต่อ Turso Cloud Database ฟรี 100% (0 บาทตลอดชีพ)');
    console.log('เพื่อให้การแก้ไขผ่านหน้าเว็บบน Vercel บันทึกถาวรทันที:');
    console.log('1. สมัครฟรีที่ https://turso.tech (ใช้ GitHub Login ได้)');
    console.log('2. สร้างฐานข้อมูลใหม่: bnw-school');
    console.log('3. คัดลอก Database URL (libsql://...) และ Create Token');
    console.log('4. รันคำสั่งโอนข้อมูล:');
    console.log('   $env:TURSO_DATABASE_URL="libsql://your-db.turso.io"');
    console.log('   $env:TURSO_AUTH_TOKEN="your-token"');
    console.log('   npx tsx scripts/sync-to-turso.ts');
    console.log('5. นำ URL และ Token ไปใส่ใน Vercel > Settings > Environment Variables:');
    console.log('   DATABASE_URL = libsql://your-db.turso.io');
    console.log('   DATABASE_AUTH_TOKEN = your-token');
    console.log('------------------------------------------------------------');
    return;
  }

  console.log(`[Turso Sync] กำลังเชื่อมต่อไปยัง Turso Cloud: ${tursoUrl}`);
  const remoteClient = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });

  const localClient = createClient({
    url: 'file:bnw_school.db',
  });

  console.log('[Turso Sync] กำลังอ่านตารางจากฐานข้อมูลในเครื่อง (bnw_school.db)...');
  const tablesRes = await localClient.execute(
    "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream%';"
  );

  for (const tableRow of tablesRes.rows) {
    const tableName = String(tableRow.name);
    const tableSql = String(tableRow.sql);
    console.log(`[Turso Sync] กำลังสร้างตาราง '${tableName}' บน Turso...`);
    await remoteClient.execute(tableSql);

    const rowsRes = await localClient.execute(`SELECT * FROM ${tableName}`);
    if (rowsRes.rows.length > 0) {
      console.log(`[Turso Sync] ถ่ายโอนข้อมูลในตาราง '${tableName}' (${rowsRes.rows.length} รายการ)...`);
      for (const row of rowsRes.rows) {
        const columns = Object.keys(row);
        const placeholders = columns.map(() => '?').join(', ');
        const values = columns.map((col) => row[col]);

        await remoteClient.execute({
          sql: `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
          args: values as any,
        });
      }
    }
  }

  console.log('[Turso Sync] ✅ ถ่ายโอนข้อมูลทั้งหมดขึ้น Turso Cloud สำเร็จสมบูรณ์ 100%!');
}

main().catch((err) => {
  console.error('[Turso Sync] Error:', err);
  process.exit(1);
});
