import React from 'react';
import { notFound } from 'next/navigation';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function DynamicCustomPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);

  if (pageRows.length === 0) {
    notFound();
  }

  const page = pageRows[0];
  if (page.status !== 'published') {
    notFound();
  }

  const contextData = await getPublicPageContextData();
  const blocks: PageBlock[] = JSON.parse(page.content || '[]');

  return (
    <div>
      <Breadcrumbs items={[{ label: page.title }]} />
      <div className="flex flex-col">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} contextData={contextData} />
        ))}
      </div>
    </div>
  );
}
