import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { PageBuilderEditorWrapper } from '@/components/page-builder/editor/PageBuilderEditorWrapper';
import { getPagePublicUrl, STANDARD_PAGES } from '@/lib/page-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PageBuilderSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const { slug } = await params;

  // โหลดข้อมูลหน้าเว็บ
  let pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);

  // ถ้าเป็นหน้ามาตรฐานของโรงเรียนแต่ยังไม่มีใน DB ให้สร้างขึ้นอัตโนมัติ
  if (pageRows.length === 0) {
    const std = STANDARD_PAGES.find((p) => p.slug === slug);
    if (std) {
      const now = new Date().toISOString();
      const newId = `page-${slug}-${Date.now().toString(36)}`;
      const defaultBlocks = [
        {
          id: `blk-hero-${Date.now()}`,
          type: 'hero_banner',
          data: {
            badge: 'ข้อมูลสถานศึกษา',
            title: std.title,
            subtitle: std.description,
            primaryButtonText: 'กลับหน้าแรก',
            primaryButtonUrl: '/',
          },
        },
        {
          id: `blk-text-${Date.now()}`,
          type: 'text_section',
          data: {
            title: std.title,
            content: std.description,
            alignment: 'left',
          },
        },
      ];

      await db.insert(schema.pages).values({
        id: newId,
        slug: slug,
        title: std.title,
        description: std.description,
        status: 'published',
        content: JSON.stringify(defaultBlocks),
        authorId: session.userId,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      });

      pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);
    } else {
      notFound();
    }
  }

  const page = pageRows[0];
  const initialBlocks = JSON.parse(page.content || '[]');

  // โหลด Context Data สำหรับการ Preview บล็อกข้อมูลโรงเรียน
  const [newsList, announcementsList, eventsList, staffList, documentsList, eServicesList] =
    await Promise.all([
      db.select().from(schema.news).limit(6),
      db.select().from(schema.announcements).limit(6),
      db.select().from(schema.events).limit(6),
      db.select().from(schema.staff).limit(8),
      db.select().from(schema.documents).limit(6),
      db.select().from(schema.eServices).limit(6),
    ]);

  const contextData = {
    news: newsList,
    announcements: announcementsList,
    events: eventsList,
    staff: staffList,
    documents: documentsList,
    eServices: eServicesList,
  };

  const canPublish = ROLE_PERMISSIONS[session.role].canPublish;
  const publicUrl = getPagePublicUrl(page.slug);

  return (
    <div className="h-full flex flex-col">
      <PageBuilderEditorWrapper
        pageId={page.id}
        pageSlug={page.slug}
        pageTitle={page.title}
        pagePublicUrl={publicUrl}
        initialStatus={page.status as 'draft' | 'published' | 'archived'}
        initialBlocks={initialBlocks}
        canPublish={canPublish}
        contextData={contextData}
      />
    </div>
  );
}
