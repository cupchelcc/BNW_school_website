import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { Calendar, ArrowLeft, Megaphone, Download } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const items = await db.select().from(schema.announcements).where(eq(schema.announcements.slug, slug)).limit(1);

  if (items.length === 0) {
    notFound();
  }

  const ann = items[0];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'ประกาศของโรงเรียน', href: '/announcements' },
          { label: ann.title },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <div className="flex items-center gap-3 text-xs mb-3">
            <span className="px-3 py-1 rounded-full font-bold bg-amber-100 text-amber-900">
              {ann.type === 'admission' ? 'รับสมัครนักเรียน' : ann.type === 'procurement' ? 'จัดซื้อจัดจ้าง' : 'ประกาศทั่วไป'}
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatThaiDate(ann.publishedAt || ann.createdAt)}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-[1.4] sm:leading-[1.45]">
            {ann.title}
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-slate-700 leading-[1.85] sm:leading-[1.9] text-base whitespace-pre-line">
          {ann.content}
        </div>

        {ann.attachmentUrl && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-800 block">เอกสารแนบท้ายประกาศ</span>
              <span className="text-[11px] text-slate-500">คลิกเพื่อดาวน์โหลดเอกสารฉบับทางการ</span>
            </div>
            <a
              href={ann.attachmentUrl}
              download
              className="px-4 py-2 rounded-lg bg-brand-navy-900 text-white text-xs font-semibold hover:bg-brand-navy-800 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดเอกสาร</span>
            </a>
          </div>
        )}

        <div className="pt-6 border-t border-slate-200">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้ารวมประกาศ</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
