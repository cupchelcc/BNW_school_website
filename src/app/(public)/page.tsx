import React from 'react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { PageBlock } from '@/types/page-builder';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // ดึงโครงสร้างหน้าแรกจากตาราง pages
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'home')).limit(1);

  // ดึงข้อมูลบริบทจากฐานข้อมูลจริง
  const [newsList, announcementsList, eventsList, staffList, documentsList, plantsList, eServicesList] =
    await Promise.all([
      db.select().from(schema.news).where(eq(schema.news.status, 'published')).limit(6),
      db.select().from(schema.announcements).where(eq(schema.announcements.status, 'published')).limit(6),
      db.select().from(schema.events).where(eq(schema.events.status, 'published')).limit(6),
      db.select().from(schema.staff).where(eq(schema.staff.isActive, true)).limit(8),
      db.select().from(schema.documents).limit(6),
      db.select().from(schema.botanicalPlants).limit(6),
      db.select().from(schema.eServices).where(eq(schema.eServices.isActive, true)).limit(6),
    ]);

  const contextData = {
    news: newsList,
    announcements: announcementsList,
    events: eventsList,
    staff: staffList,
    documents: documentsList,
    plants: plantsList,
    eServices: eServicesList,
  };

  const blocks: PageBlock[] = pageRows.length > 0 ? JSON.parse(pageRows[0].content || '[]') : [];

  return (
    <div className="flex flex-col">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} contextData={contextData} />
      ))}
    </div>
  );
}
