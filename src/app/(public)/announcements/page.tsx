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

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
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
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">ไม่มีประกาศในขณะนี้</p>
          </div>
        ) : (
          announcementsList.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-2xl border transition-all bg-white shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                ann.isPinned ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    ann.isPinned ? 'bg-red-50 text-red-600' : 'bg-brand-navy-50 text-brand-navy-800'
                  }`}
                >
                  {ann.isPinned ? <Pin className="w-5 h-5 fill-red-600" /> : <Megaphone className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {ann.isPinned && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                        ปักหมุดด่วน
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
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
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-navy-50 text-brand-navy-900 text-xs font-bold inline-flex items-center gap-1 shrink-0 self-start sm:self-center"
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
