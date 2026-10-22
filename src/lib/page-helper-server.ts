import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { PageBlock } from '@/types/page-builder';
export { STANDARD_PAGES, getPagePublicUrl, type StandardPageMeta } from './page-helper';

/**
 * ดึงข้อมูลบริบทจากฐานข้อมูลจริงสำหรับ BlockRenderer (Server Only)
 */
export async function getPublicPageContextData() {
  try {
    const [newsList, announcementsList, eventsList, staffList, documentsList, eServicesList] =
      await Promise.all([
        db.select().from(schema.news).where(eq(schema.news.status, 'published')).limit(6),
        db.select().from(schema.announcements).where(eq(schema.announcements.status, 'published')).limit(6),
        db.select().from(schema.events).where(eq(schema.events.status, 'published')).limit(6),
        db.select().from(schema.staff).where(eq(schema.staff.isActive, true)).limit(8),
        db.select().from(schema.documents).limit(6),
        db.select().from(schema.eServices).where(eq(schema.eServices.isActive, true)).limit(6),
      ]);

    return {
      news: newsList,
      announcements: announcementsList,
      events: eventsList,
      staff: staffList,
      documents: documentsList,
      eServices: eServicesList,
    };
  } catch (err) {
    console.warn('[Page Helper] Failed to load context data:', err);
    return {
      news: [],
      announcements: [],
      events: [],
      staff: [],
      documents: [],
      eServices: [],
    };
  }
}

/**
 * ดึงบล็อกของหน้าจากฐานข้อมูล (Server Only)
 */
export async function getPageBySlug(slug: string) {
  try {
    const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);
    if (pageRows.length === 0) return null;

    const page = pageRows[0];
    const blocks: PageBlock[] = JSON.parse(page.content || '[]');
    return {
      ...page,
      blocks,
    };
  } catch (err) {
    console.warn(`[Page Helper] Error fetching page for slug '${slug}':`, err);
    return null;
  }
}
