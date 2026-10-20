import fs from 'fs/promises';
import path from 'path';
import { db, schema } from '../src/db';

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  await fs.mkdir(backupDir, { recursive: true });

  console.log(`[Backup] กำลังสำรองข้อมูลระบบ ณ เวลา: ${timestamp}`);

  // 1. สำรองไฟล์ฐานข้อมูล SQLite
  const dbFile = path.join(process.cwd(), 'bnw_school.db');
  const targetDbBackup = path.join(backupDir, `bnw_school_${timestamp}.db`);

  try {
    await fs.copyFile(dbFile, targetDbBackup);
    console.log(`[Backup] สำรองไฟล์ฐานข้อมูลดิบสำเร็จ: ${targetDbBackup}`);
  } catch (err) {
    console.warn(`[Backup] ไม่พบไฟล์ฐานข้อมูลดิบ หรือเปิดใช้งานอยู่:`, err);
  }

  // 2. สำรองข้อมูลแบบตารางแยกเป็น Structured JSON
  const [users, theme, pages, news, announcements, events, staff, botanical, documents, eServices] =
    await Promise.all([
      db.select().from(schema.users),
      db.select().from(schema.themeSettings),
      db.select().from(schema.pages),
      db.select().from(schema.news),
      db.select().from(schema.announcements),
      db.select().from(schema.events),
      db.select().from(schema.staff),
      db.select().from(schema.botanicalPlants),
      db.select().from(schema.documents),
      db.select().from(schema.eServices),
    ]);

  const backupData = {
    version: '2.0.0',
    createdAt: timestamp,
    system: 'BNW-001 V2 Rebuild',
    tables: {
      users: users.map((u) => ({ ...u, passwordHash: '***PROTECTED***' })),
      theme,
      pages,
      news,
      announcements,
      events,
      staff,
      botanical,
      documents,
      eServices,
    },
  };

  const jsonBackupFile = path.join(backupDir, `bnw_data_snapshot_${timestamp}.json`);
  await fs.writeFile(jsonBackupFile, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`[Backup] บันทึก Data Snapshot สำเร็จ: ${jsonBackupFile}`);
  console.log(`[Backup] การสำรองข้อมูลเสร็จสิ้นเรียบร้อย`);
}

runBackup().catch((err) => {
  console.error('[Backup Error]:', err);
  process.exit(1);
});
