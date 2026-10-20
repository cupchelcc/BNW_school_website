import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { Search, Newspaper, Megaphone, TreePine, Users, FileText, ArrowRight } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const keyword = (q || '').trim().toLowerCase();

  let newsResults: any[] = [];
  let announcementResults: any[] = [];
  let plantResults: any[] = [];
  let staffResults: any[] = [];

  if (keyword) {
    try {
      const [allNews, allAnnouncements, allPlants, allStaff] = await Promise.all([
        db.select().from(schema.news).where(eq(schema.news.status, 'published')),
        db.select().from(schema.announcements).where(eq(schema.announcements.status, 'published')),
        db.select().from(schema.botanicalPlants),
        db.select().from(schema.staff).where(eq(schema.staff.isActive, true)),
      ]);

      newsResults = allNews.filter(
        (n) => n.title.toLowerCase().includes(keyword) || (n.summary && n.summary.toLowerCase().includes(keyword))
      );

      announcementResults = allAnnouncements.filter(
        (a) => a.title.toLowerCase().includes(keyword) || a.content.toLowerCase().includes(keyword)
      );

      plantResults = allPlants.filter(
        (p) =>
          p.thaiName.toLowerCase().includes(keyword) ||
          p.scientificName.toLowerCase().includes(keyword) ||
          p.family.toLowerCase().includes(keyword)
      );

      staffResults = allStaff.filter(
        (s) => s.name.toLowerCase().includes(keyword) || s.position.toLowerCase().includes(keyword)
      );
    } catch (err) {
      console.warn('[Search Page] Failed to execute search queries:', err);
    }
  }

  const totalResults = newsResults.length + announcementResults.length + plantResults.length + staffResults.length;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ค้นหาข้อมูล' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Site Search
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ค้นหาข้อมูลภายในเว็บไซต์
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            ค้นหาข่าวสาร ประกาศ กิจกรรม ทำเนียบบุคลากร และพรรณไม้สวนพฤกษศาสตร์
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Search Bar */}
        <form className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm flex items-center gap-3">
          <div className="pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={keyword}
            placeholder="พิมพ์คำค้นหา เช่น ไหว้ครู, ประกาศ, ราชพฤกษ์, ผู้อำนวยการ..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white text-xs font-semibold"
          >
            ค้นหา
          </button>
        </form>

        {keyword ? (
          <div className="space-y-8">
            <div className="text-xs text-slate-500 font-semibold border-b pb-2">
              ผลการค้นหาสำหรับ <span className="text-brand-navy-900 font-bold">"{keyword}"</span> พบทั้งหมด {totalResults} รายการ
            </div>

            {totalResults === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-sm">
                ไม่พบข้อมูลที่ตรงกับคำค้นหา กรุณาลองใช้คำค้นหาอื่น
              </div>
            ) : (
              <>
                {/* News Results */}
                {newsResults.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-emerald-600" />
                      <span>ข่าวประชาสัมพันธ์ ({newsResults.length})</span>
                    </h2>
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                      {newsResults.map((n) => (
                        <Link
                          key={n.id}
                          href={`/news/${n.slug}`}
                          className="p-4 block hover:bg-slate-50 transition-colors"
                        >
                          <h3 className="font-bold text-sm text-slate-900 hover:text-brand-navy-700">{n.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.summary || n.content}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{formatThaiDate(n.publishedAt || n.createdAt)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Announcement Results */}
                {announcementResults.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-amber-600" />
                      <span>ประกาศของโรงเรียน ({announcementResults.length})</span>
                    </h2>
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                      {announcementResults.map((a) => (
                        <Link
                          key={a.id}
                          href={`/announcements/${a.slug}`}
                          className="p-4 block hover:bg-slate-50 transition-colors"
                        >
                          <h3 className="font-bold text-sm text-slate-900 hover:text-brand-navy-700">{a.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{a.content}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{formatThaiDate(a.publishedAt || a.createdAt)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plants Results */}
                {plantResults.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-emerald-700" />
                      <span>พรรณไม้สวนพฤกษศาสตร์ ({plantResults.length})</span>
                    </h2>
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                      {plantResults.map((p) => (
                        <Link
                          key={p.id}
                          href={`/botanical-garden/${p.id}`}
                          className="p-4 block hover:bg-slate-50 transition-colors"
                        >
                          <h3 className="font-bold text-sm text-slate-900 hover:text-emerald-800">
                            {p.thaiName} <span className="text-xs italic font-serif text-slate-500">({p.scientificName})</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">วงศ์ {p.family} • ตำแหน่ง: {p.locationInSchool}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Staff Results */}
                {staffResults.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>บุคลากร ({staffResults.length})</span>
                    </h2>
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                      {staffResults.map((s) => (
                        <div key={s.id} className="p-4">
                          <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                          <p className="text-xs text-brand-navy-700 font-semibold mt-0.5">{s.position}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            กรอกคำค้นหาด้านบนเพื่อค้นหาข้อมูลทั่วทั้งเว็บไซต์โรงเรียน
          </div>
        )}
      </div>
    </div>
  );
}
