import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { GraduationCap, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function PublicAcademicPage() {
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
    <div>
      <Breadcrumbs items={[{ label: 'วิชาการ', href: '/academic' }, { label: 'ข้อมูลหลักสูตรการศึกษา' }]} />

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

        {/* Courses from DB */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-navy-800" />
            <span>โครงสร้างหลักสูตรแต่ละระดับชั้น</span>
          </h2>

          <div className="grid gap-6">
            {courses.map((crs) => {
              const subjects = JSON.parse(crs.learningAreas || '[]');
              return (
                <div key={crs.id} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
                  <div>
                    <span className="text-xs font-bold text-brand-gold-600 uppercase tracking-wider block">
                      ระดับการศึกษา: {crs.level === 'primary' ? 'ประถมศึกษา' : 'มัธยมศึกษา'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{crs.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{crs.description}</p>

                  {subjects.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-700 mb-3">รายวิชาและสัดส่วนเวลาเรียนโดยสังเขป:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {subjects.map((sub: any, i: number) => (
                          <div key={i} className="flex justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-800">{sub.subject}</span>
                            <span className="text-slate-500">{sub.credits}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
