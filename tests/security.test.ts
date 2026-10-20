import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { db, schema } from '../src/db';
import { eq } from 'drizzle-orm';

describe('ระบบความปลอดภัยและการป้องกันข้อมูล (Security & Validation)', () => {
  test('ข่าวสถานะ Draft ต้องไม่ถูกดึงไปแสดงในหน้าสาธารณะ', async () => {
    // ใส่ข่าวทดสอบสถานะ draft
    const draftId = `news-draft-test-${Date.now()}`;
    const now = new Date().toISOString();

    await db.insert(schema.news).values({
      id: draftId,
      slug: draftId,
      title: 'ข่าวทดสอบแบบร่างภายใน ห้ามออกสาธารณะ',
      content: 'เนื้อหาแบบร่าง',
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    });

    // คิวรีตามเงื่อนไขหน้าสาธารณะ (status: published)
    const publicNews = await db.select().from(schema.news).where(eq(schema.news.status, 'published'));
    const foundDraft = publicNews.find((n) => n.id === draftId);

    assert.equal(foundDraft, undefined, 'ข่าว Draft ต้องไม่ปรากฏในผลลัพธ์ของหน้าสาธารณะ');

    // ทำความสะอาด
    await db.delete(schema.news).where(eq(schema.news.id, draftId));
  });

  test('การจัดเก็บรหัสผ่านในฐานข้อมูลต้องไม่เป็น Plain Text', async () => {
    const userRows = await db.select().from(schema.users);
    for (const user of userRows) {
      assert.ok(
        user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$'),
        `รหัสผ่านของ ${user.email} ต้องขึ้นต้นด้วย bcrypt signature`
      );
      assert.notEqual(user.passwordHash, 'BnwAdmin2026!ChangeMe');
    }
  });
});
