import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { Newspaper, Calendar, ArrowRight, Tag } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export const revalidate = 60;

export default async function PublicNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let query = db.select().from(schema.news).where(eq(schema.news.status, 'published')).orderBy(desc(schema.news.publishedAt));

  const allNews = await query;
  const filtered = category && category !== 'all' ? allNews.filter((n) => n.category === category) : allNews;

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'activity', label: 'กิจกรรมโรงเรียน' },
    { id: 'academic', label: 'วิชาการ' },
    { id: 'award', label: 'ผลงานและรางวัล' },
    { id: 'general', label: 'ข่าวทั่วไป' },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ข่าวประชาสัมพันธ์' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            News & Updates
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ข่าวประชาสัมพันธ์และกิจกรรม
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            ติดตามความเคลื่อนไหว กิจกรรมการเรียนรู้ และข่าวสารทางการของโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = (category || 'all') === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/news' : `/news?category=${cat.id}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-navy-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* News Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <Newspaper className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">ไม่พบข่าวในหมวดหมู่นี้</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="h-52 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {item.coverImageUrl ? (
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-brand-navy-900 to-brand-navy-700 flex items-center justify-center text-white/50">
                      <Newspaper className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-navy-950/80 text-white text-[11px] font-semibold backdrop-blur-sm">
                    {item.category === 'activity' ? 'กิจกรรม' : item.category === 'academic' ? 'วิชาการ' : 'ทั่วไป'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatThaiDate(item.publishedAt || item.createdAt)}</span>
                    </div>

                    <h2 className="font-bold text-slate-900 group-hover:text-brand-navy-700 text-base leading-snug line-clamp-2 mb-2">
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {item.summary || item.content}
                    </p>
                  </div>

                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy-700 hover:text-brand-navy-900 pt-3 border-t border-slate-100"
                  >
                    <span>อ่านรายละเอียด</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
