import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { Megaphone, Pin, ArrowRight, FileText } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export const revalidate = 60;

export default async function PublicAnnouncementsPage() {
  const announcementsList = await db
    .select()
    .from(schema.announcements)
    .where(eq(schema.announcements.status, 'published'))
    .orderBy(desc(schema.announcements.isPinned), desc(schema.announcements.createdAt));

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ประกาศของโรงเรียน' }]} />

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-white py-14 sm:py-16 px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Official Announcements
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ประกาศและหนังสือแจ้งจากโรงเรียน
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            ประกาศทางการ ข้อปฏิบัติ การรับสมัครนักเรียน และประกาศจัดซื้อจัดจ้าง
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        {announcementsList.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">ไม่มีประกาศในขณะนี้</p>
          </div>
        ) : (
          announcementsList.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-0.5 ${
                ann.isPinned
                  ? 'border-amber-300/80 bg-amber-50/40 hover:border-amber-400'
                  : 'border-white/80 bg-white/75 hover:border-brand-navy-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl shrink-0 backdrop-blur-md ${
                    ann.isPinned
                      ? 'bg-red-500/15 text-red-600 border border-red-500/20'
                      : 'bg-brand-navy-50/80 text-brand-navy-800 border border-brand-navy-100'
                  }`}
                >
                  {ann.isPinned ? <Pin className="w-5 h-5 fill-red-600" /> : <Megaphone className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {ann.isPinned && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-700 border border-red-500/20">
                        ปักหมุดด่วน
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/80 text-slate-600 border border-slate-200/80">
                      {ann.type === 'admission' ? 'รับสมัครนักเรียน' : ann.type === 'procurement' ? 'จัดซื้อจัดจ้าง' : 'ประกาศทั่วไป'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatThaiDate(ann.publishedAt || ann.createdAt)}
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-base leading-snug">
                    <Link href={`/announcements/${ann.slug}`} className="hover:text-brand-navy-800">
                      {ann.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              </div>

              <Link
                href={`/announcements/${ann.slug}`}
                className="px-4 py-2 rounded-xl bg-white/90 hover:bg-brand-navy-700 hover:text-white border border-slate-200/80 text-brand-navy-900 text-xs font-bold inline-flex items-center gap-1 shrink-0 self-start sm:self-center transition-all shadow-xs"
              >
                <span>อ่านประกาศ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
