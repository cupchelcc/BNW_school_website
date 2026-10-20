import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { GraduationCap, BookOpen } from 'lucide-react';

export default async function AdminAcademicPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const courses = await db.select().from(schema.academicCourses);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Academics & Curriculum</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการข้อมูลด้านวิชาการและหลักสูตร</h1>
          <p className="text-xs text-slate-500 mt-1">หลักสูตรแกนกลาง กลุ่มสาระการเรียนรู้ และโครงสร้างเวลาเรียน</p>
        </div>
      </div>

      <div className="grid gap-6">
        {courses.map((crs) => {
          const subjects = JSON.parse(crs.learningAreas || '[]');
          return (
            <div key={crs.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{crs.title}</h3>
                  <span className="text-xs text-slate-500">ระดับ: {crs.level}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{crs.description}</p>

              {subjects.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">กลุ่มสาระการเรียนรู้และสัดส่วนเวลาเรียน:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {subjects.map((sub: any, i: number) => (
                      <div key={i} className="flex justify-between bg-white p-2 rounded border border-slate-200">
                        <span className="font-medium text-slate-800">{sub.subject}</span>
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
  );
}
