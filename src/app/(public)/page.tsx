import React from 'react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // ดึงโครงสร้างหน้าแรกจากตาราง pages
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'home')).limit(1);

  // ดึงข้อมูลบริบทจากฐานข้อมูลจริง
  const contextData = await getPublicPageContextData();

  const blocks: PageBlock[] = pageRows.length > 0 ? JSON.parse(pageRows[0].content || '[]') : [];

  return (
    <div className="flex flex-col relative">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} contextData={contextData} />
      ))}
    </div>
  );
}
