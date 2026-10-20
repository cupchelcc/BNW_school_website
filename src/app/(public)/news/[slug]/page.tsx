import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { Calendar, Eye, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const items = await db.select().from(schema.news).where(eq(schema.news.slug, slug)).limit(1);

  if (items.length === 0) {
    notFound();
  }

  const news = items[0];

  // Increment view count
  try {
    await db
      .update(schema.news)
      .set({ viewCount: news.viewCount + 1 })
      .where(eq(schema.news.id, news.id));
  } catch {
    // Ignore view increment error
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'ข่าวประชาสัมพันธ์', href: '/news' },
          { label: news.title },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
            <span className="px-3 py-1 rounded-full font-bold bg-brand-navy-100 text-brand-navy-900">
              {news.category === 'activity' ? 'กิจกรรมโรงเรียน' : news.category === 'academic' ? 'วิชาการ' : 'ข่าวทั่วไป'}
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatThaiDate(news.publishedAt || news.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              <span>เข้าชม {news.viewCount + 1} ครั้ง</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {news.title}
          </h1>

          {news.summary && (
            <p className="text-base text-slate-600 mt-4 font-medium border-l-4 border-brand-gold-500 pl-4 py-1 leading-relaxed">
              {news.summary}
            </p>
          )}
        </div>

        {news.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-md">
            <img src={news.coverImageUrl} alt={news.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        {/* Content Body */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-slate-700 leading-relaxed text-base whitespace-pre-line space-y-4">
          {news.content}
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้ารวมข่าวประชาสัมพันธ์</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
