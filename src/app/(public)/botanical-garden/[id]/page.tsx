import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { TreePine, MapPin, ArrowLeft, BookOpen, Sparkles, CheckCircle } from 'lucide-react';

export default async function BotanicalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await db.select().from(schema.botanicalPlants).where(eq(schema.botanicalPlants.id, id)).limit(1);

  if (items.length === 0) {
    notFound();
  }

  const plant = items[0];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'สวนพฤกษศาสตร์โรงเรียน', href: '/botanical-garden' },
          { label: plant.thaiName },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              วงศ์ {plant.family}
            </span>
            {plant.commonName && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                ชื่อสามัญ: {plant.commonName}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>ยืนยันข้อมูลแล้ว</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {plant.thaiName}
          </h1>
          <p className="text-base sm:text-lg italic text-slate-600 font-serif mt-2">
            {plant.scientificName}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
              <TreePine className="w-4 h-4" />
              <span>ลักษณะเด่นทางพฤกษศาสตร์</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {plant.characteristics}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>ตำแหน่งที่พบในบริเวณโรงเรียน</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                {plant.locationInSchool}
              </p>
            </div>

            {plant.educationalValue && (
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>ประโยชน์และคุณค่าเพื่อการเรียนรู้</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {plant.educationalValue}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <Link
            href="/botanical-garden"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่ฐานข้อมูลสวนพฤกษศาสตร์โรงเรียน</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
