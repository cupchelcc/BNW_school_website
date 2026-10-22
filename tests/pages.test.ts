import { test, describe } from 'node:test';
import assert from 'node:assert';
import { STANDARD_PAGES, getPagePublicUrl } from '../src/lib/page-helper';
import { db, schema } from '../src/db';
import { eq } from 'drizzle-orm';

describe('ระบบจัดการหน้าเว็บมาตรฐานและ Page Builder (Standard Pages & URLs)', () => {
  test('ควรมีรายการหน้ามาตรฐานครบทั้ง 9 หน้าพร้อม URL ที่ถูกต้อง', () => {
    assert.strictEqual(STANDARD_PAGES.length, 9);

    const slugs = STANDARD_PAGES.map((p) => p.slug);
    assert.ok(slugs.includes('home'));
    assert.ok(slugs.includes('about'));
    assert.ok(slugs.includes('about-history'));
    assert.ok(slugs.includes('about-vision'));
    assert.ok(slugs.includes('about-structure'));
    assert.ok(slugs.includes('academic'));
    assert.ok(slugs.includes('achievements'));
    assert.ok(slugs.includes('contact'));
    assert.ok(slugs.includes('privacy'));
  });

  test('ฟังก์ชัน getPagePublicUrl ควรแปลง slug เป็น URL สาธารณะที่ถูกต้อง', () => {
    assert.strictEqual(getPagePublicUrl('home'), '/');
    assert.strictEqual(getPagePublicUrl('about'), '/about');
    assert.strictEqual(getPagePublicUrl('about-history'), '/about/history');
    assert.strictEqual(getPagePublicUrl('about-vision'), '/about/vision');
    assert.strictEqual(getPagePublicUrl('about-structure'), '/about/structure');
    assert.strictEqual(getPagePublicUrl('academic'), '/academic');
    assert.strictEqual(getPagePublicUrl('achievements'), '/achievements');
    assert.strictEqual(getPagePublicUrl('contact'), '/contact');
    assert.strictEqual(getPagePublicUrl('privacy'), '/privacy');

    // หน้า Custom ที่สร้างเอง
    assert.strictEqual(getPagePublicUrl('guidance-center'), '/p/guidance-center');
  });

  test('ฐานข้อมูล pages ควรมีหน้ามาตรฐานครบ 9 หน้าพร้อมบล็อกเนื้อหา', async () => {
    const allPages = await db.select().from(schema.pages);
    assert.ok(allPages.length >= 9, `ควรมีหน้าเว็บอย่างน้อย 9 หน้า (พบ ${allPages.length})`);

    for (const std of STANDARD_PAGES) {
      const found = allPages.find((p) => p.slug === std.slug);
      assert.ok(found, `หน้า ${std.slug} ควรมีอยู่ในตาราง pages`);
      assert.strictEqual(found.status, 'published');

      const blocks = JSON.parse(found.content || '[]');
      assert.ok(Array.isArray(blocks) && blocks.length > 0, `หน้า ${std.slug} ต้องมีบล็อกอย่างน้อย 1 บล็อก`);
    }
  });
});
