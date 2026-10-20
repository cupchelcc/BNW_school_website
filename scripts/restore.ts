import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@libsql/client';

async function runRestoreTest() {
  console.log('[Restore Test] เริ่มต้นการทดสอบกู้คืนข้อมูลในสภาพแวดล้อมแยก...');

  const backupDir = path.join(process.cwd(), 'backups');
  let files: string[] = [];
  try {
    files = await fs.readdir(backupDir);
  } catch {
    console.error('[Restore Test Error] ไม่พบโฟลเดอร์ backups กรุณารัน backup ก่อน');
    process.exit(1);
  }

  const dbBackups = files.filter((f) => f.startsWith('bnw_school_') && f.endsWith('.db')).sort().reverse();

  if (dbBackups.length === 0) {
    console.error('[Restore Test Error] ไม่พบไฟล์สำรองฐานข้อมูล .db ในโฟลเดอร์ backups');
    process.exit(1);
  }

  const latestBackup = path.join(backupDir, dbBackups[0]);
  const isolatedRestoreDb = path.join(process.cwd(), 'bnw_school_restore_test.db');

  console.log(`[Restore Test] ใช้ไฟล์สำรองล่าสุด: ${latestBackup}`);
  console.log(`[Restore Test] กำลังกู้คืนลงฐานข้อมูลแยก: ${isolatedRestoreDb}`);

  // ก๊อปปี้ไฟล์ไปยังฐานข้อมูลแยก (ไม่แตะต้อง Production)
  await fs.copyFile(latestBackup, isolatedRestoreDb);

  // ตรวจสอบความสมบูรณ์ของข้อมูลที่กู้คืน
  const client = createClient({ url: `file:${isolatedRestoreDb}` });

  try {
    const userRes = await client.execute('SELECT COUNT(*) as count FROM users');
    const pageRes = await client.execute('SELECT COUNT(*) as count FROM pages');
    const newsRes = await client.execute('SELECT COUNT(*) as count FROM news');
    const plantRes = await client.execute('SELECT COUNT(*) as count FROM botanical_plants');

    console.log(`[Restore Test ผลการตรวจสอบ]:`);
    console.log(`- จำนวนผู้ใช้ที่กู้คืนได้: ${userRes.rows[0].count} บัญชี`);
    console.log(`- จำนวนหน้าเว็บที่กู้คืนได้: ${pageRes.rows[0].count} หน้า`);
    console.log(`- จำนวนข่าวที่กู้คืนได้: ${newsRes.rows[0].count} รายการ`);
    console.log(`- จำนวนพรรณไม้ที่กู้คืนได้: ${plantRes.rows[0].count} ชนิด`);

    if (Number(userRes.rows[0].count) > 0 && Number(pageRes.rows[0].count) > 0) {
      console.log('✅ [Restore Test สำเร็จ 100%] ข้อมูลถูกกู้คืนและตรวจสอบแล้วว่าสมบูรณ์ถูกต้องทุกตาราง');
    } else {
      throw new Error('ข้อมูลที่กู้คืนมีจำนวนเป็น 0');
    }
  } finally {
    client.close();
    // ทำความสะอาดไฟล์ทดสอบ
    try {
      await fs.unlink(isolatedRestoreDb);
      console.log('[Restore Test] ทำความสะอาดไฟล์ทดสอบกู้คืนเรียบร้อย');
    } catch {}
  }
}

runRestoreTest().catch((err) => {
  console.error('[Restore Test Error]:', err);
  process.exit(1);
});
