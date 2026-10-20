import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { PageBuilderEditorWrapper } from '@/components/page-builder/editor/PageBuilderEditorWrapper';

export default async function PageBuilderSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const { slug } = await params;

  // โหลดข้อมูลหน้าเว็บ
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);

  if (pageRows.length === 0) {
    notFound();
  }

  const page = pageRows[0];
  const initialBlocks = JSON.parse(page.content || '[]');

  // โหลด Context Data สำหรับการ Preview บล็อกข้อมูลโรงเรียน
  const [newsList, announcementsList, eventsList, staffList, documentsList, plantsList, eServicesList] =
    await Promise.all([
      db.select().from(schema.news).limit(6),
      db.select().from(schema.announcements).limit(6),
      db.select().from(schema.events).limit(6),
      db.select().from(schema.staff).limit(8),
      db.select().from(schema.documents).limit(6),
      db.select().from(schema.botanicalPlants).limit(6),
      db.select().from(schema.eServices).limit(6),
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

  const canPublish = ROLE_PERMISSIONS[session.role].canPublish;

  return (
    <div className="h-full flex flex-col">
      <PageBuilderEditorWrapper
        pageId={page.id}
        pageSlug={page.slug}
        pageTitle={page.title}
        initialStatus={page.status as 'draft' | 'published' | 'archived'}
        initialBlocks={initialBlocks}
        canPublish={canPublish}
        contextData={contextData}
      />
    </div>
  );
}
