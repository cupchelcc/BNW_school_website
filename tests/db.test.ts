import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { db, schema } from '../src/db';
import { eq } from 'drizzle-orm';

describe('ระบบฐานข้อมูลและความสัมพันธ์ (Database & ORM Integration)', () => {
  test('ตาราง users ควรมีบัญชีผู้ดูแลเริ่มต้น 3 บทบาท', async () => {
    const userRows = await db.select().from(schema.users);
    assert.ok(userRows.length >= 3);

    const emails = userRows.map((u) => u.email);
    assert.ok(emails.includes('admin@bnw.ac.th'));
    assert.ok(emails.includes('editor@bnw.ac.th'));
    assert.ok(emails.includes('author@bnw.ac.th'));
  });

  test('ตาราง theme_settings ควรมีการตั้งค่าอัตลักษณ์โรงเรียน', async () => {
    const themeRows = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'current'));
    assert.equal(themeRows.length, 1);

    const theme = themeRows[0];
    assert.equal(theme.siteName, 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)');
    assert.equal(theme.primaryColor, '#0b1f3c'); // Navy Blue
    assert.equal(theme.secondaryColor, '#eab308'); // Gold/Yellow
    assert.ok(theme.navMenuItems);
  });

  test('ตาราง pages ต้องมีหน้าแรก (slug: home) พร้อมโครงสร้างบล็อกเริ่มต้น', async () => {
    const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'home'));
    assert.equal(pageRows.length, 1);

    const home = pageRows[0];
    assert.equal(home.status, 'published');
    const blocks = JSON.parse(home.content || '[]');
    assert.ok(Array.isArray(blocks));
    assert.ok(blocks.length >= 5);
  });

  test('ตาราง botanical_plants ควรมีข้อมูลพรรณไม้พร้อมสถานะ verified', async () => {
    const plants = await db.select().from(schema.botanicalPlants);
    assert.ok(plants.length >= 2);

    const plantNames = plants.map((p) => p.thaiName);
    assert.ok(plantNames.some((n) => n.includes('ราชพฤกษ์')));
  });
});
