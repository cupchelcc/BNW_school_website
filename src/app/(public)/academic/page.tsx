import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { GraduationCap, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';
import { AdminFloatingEditButton } from '@/components/public/AdminFloatingEditButton';

export const dynamic = 'force-dynamic';

export default async function PublicAcademicPage() {
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'academic')).limit(1);

  if (pageRows.length > 0 && pageRows[0].status === 'published') {
    const blocks: PageBlock[] = JSON.parse(pageRows[0].content || '[]');
    if (blocks.length > 0) {
      const contextData = await getPublicPageContextData();
      return (
        <div className="relative">
          <Breadcrumbs
            items={[{ label: 'วิชาการ', href: '/academic' }, { label: 'ข้อมูลหลักสูตรการศึกษา' }]}
            editSlug="academic"
          />
          <AdminFloatingEditButton slug="academic" pageTitle="งานวิชาการและหลักสูตร" />
          <div className="flex flex-col">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} contextData={contextData} />
            ))}
          </div>
        </div>
      );
    }
  }

  let courses: (typeof schema.academicCourses.$inferSelect)[] = [];
  try {
    courses = await db.select().from(schema.academicCourses);
  } catch (err) {
    console.warn('[Academic Page] Failed to query courses:', err);
  }

  const learningAreas = [
    'กลุ่มสาระการเรียนรู้ภาษาไทย',
    'กลุ่มสาระการเรียนรู้คณิตศาสตร์',
    'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
    'กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม',
    'กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา',
    'กลุ่มสาระการเรียนรู้ศิลปะ',
    'กลุ่มสาระการเรียนรู้การงานอาชีพ',
    'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ (ภาษาอังกฤษ)',
  ];

  return (
    <div className="relative">
      <Breadcrumbs
        items={[{ label: 'วิชาการ', href: '/academic' }, { label: 'ข้อมูลหลักสูตรการศึกษา' }]}
        editSlug="academic"
      />
      <AdminFloatingEditButton slug="academic" pageTitle="งานวิชาการและหลักสูตร" />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Academic Excellence
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            หลักสูตรและการจัดการเรียนรู้
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งเน้นการจัดการเรียนรู้เชิงรุก (Active Learning) และพัฒนาทักษะชีวิต
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* 8 Learning Areas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-brand-navy-50 text-brand-navy-900 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">8 กลุ่มสาระการเรียนรู้แกนกลาง</h2>
              <p className="text-xs text-slate-500">ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พุทธศักราช 2551 (ฉบับปรับปรุง)</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {learningAreas.map((area, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Levels Offered */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">ระดับชั้นและแผนการศึกษาที่เปิดสอน</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ระดับปฐมวัย</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">ระดับชั้นอนุบาลปีที่ 1 - 3</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                มุ่งเน้นการเตรียมความพร้อมทั้งด้านร่างกาย อารมณ์ สังคม และสติปัญญา ผ่านการจัดกิจกรรมการเรียนรู้แบบบูรณาการและการเล่นอย่างมีความหมาย (Play-based Learning)
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>ระดับประถมศึกษา</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">ระดับชั้นประถมศึกษาปีที่ 1 - 6</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                พัฒนาทักษะการอ่านออกเขียนได้ คิดเลขเป็น ปลูกฝังกระบวนการคิดวิเคราะห์ ทักษะการแก้ปัญหา การใช้เทคโนโลยีดิจิทัล และคุณธรรมจริยธรรมตามวิถีชาวพุทธ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
