import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { TreePine, Search, ArrowRight, MapPin, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function PublicBotanicalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let plants: (typeof schema.botanicalPlants.$inferSelect)[] = [];
  try {
    plants = await db.select().from(schema.botanicalPlants);
  } catch (err) {
    console.warn('[Botanical Page] Failed to query plants:', err);
  }

  const filtered = q
    ? plants.filter(
        (p) =>
          p.thaiName.includes(q) ||
          p.scientificName.toLowerCase().includes(q.toLowerCase()) ||
          p.family.toLowerCase().includes(q.toLowerCase())
      )
    : plants;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'สวนพฤกษศาสตร์โรงเรียน' }]} />

      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <TreePine className="w-3.5 h-3.5" />
            <span>โครงการอนุรักษ์พันธุกรรมพืชอันเนื่องมาจากพระราชดำริฯ (อพ.สธ.)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ฐานข้อมูลสวนพฤกษศาสตร์โรงเรียน
          </h1>
          <p className="text-sm text-emerald-200/80 mt-3 max-w-2xl mx-auto">
            แหล่งรวบรวมข้อมูลทางพฤกษศาสตร์ พรรณไม้ท้องถิ่น และพืชพรรณภายในโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Search */}
        <form className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-2">
          <div className="pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="ค้นหาชื่อไทย, ชื่อวิทยาศาสตร์, วงศ์พืช..."
            className="flex-1 text-xs outline-none bg-transparent py-1.5"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold"
          >
            ค้นหา
          </button>
        </form>

        {/* Plants Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <TreePine className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">ไม่พบข้อมูลพรรณไม้ตามคำค้นหา</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((plant) => (
              <div
                key={plant.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      วงศ์ {plant.family}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">สถานะ: ยืนยันข้อมูล</span>
                  </div>

                  <h2 className="font-bold text-lg text-slate-900 group-hover:text-emerald-800 mb-1">
                    <Link href={`/botanical-garden/${plant.id}`}>{plant.thaiName}</Link>
                  </h2>
                  <p className="text-xs italic text-slate-500 font-serif mb-3">{plant.scientificName}</p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {plant.characteristics}
                  </p>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 truncate max-w-44">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{plant.locationInSchool}</span>
                  </span>

                  <Link
                    href={`/botanical-garden/${plant.id}`}
                    className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>ข้อมูลพรรณไม้</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
