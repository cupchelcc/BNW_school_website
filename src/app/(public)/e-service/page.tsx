import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { Globe, ExternalLink, GraduationCap, Users, BookOpen, AlertCircle, Shield } from 'lucide-react';

export const revalidate = 60;

export default async function PublicEServicePage() {
  let services: (typeof schema.eServices.$inferSelect)[] = [];
  try {
    services = await db.select().from(schema.eServices).where(eq(schema.eServices.isActive, true));
  } catch (err) {
    console.warn('[E-Service Page] Failed to query services:', err);
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'บริการออนไลน์ (E-Service)' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Online Education Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ระบบบริการออนไลน์ทางการศึกษา (E-Service)
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            เข้าถึงระบบตรวจสอบผลการเรียน งานทะเบียน และแหล่งเรียนรู้ของโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Transparency note as mandated by Section 13.6 */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">หมายเหตุการใช้งาน:</span> ลิงก์ที่มีสัญลักษณ์{' '}
            <ExternalLink className="w-3.5 h-3.5 inline text-amber-700" /> เป็นการเชื่อมโยงไปยังระบบบริการภายนอกของกระทรวงศึกษาธิการและสำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.) ซึ่งอาจต้องใช้บัญชีผู้ใช้งานเฉพาะระบบในการเข้าสู่ระบบ
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-brand-navy-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-brand-navy-50 text-brand-navy-800 rounded-xl group-hover:bg-brand-navy-900 group-hover:text-white transition-colors">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {svc.targetGroup === 'students'
                      ? 'สำหรับนักเรียน'
                      : svc.targetGroup === 'parents'
                      ? 'สำหรับผู้ปกครอง'
                      : 'ทั่วไป'}
                  </span>
                </div>

                <h2 className="font-bold text-base text-slate-900 group-hover:text-brand-navy-700 mb-2">
                  {svc.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{svc.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={svc.url}
                  target={svc.isExternal ? '_blank' : '_self'}
                  rel={svc.isExternal ? 'noopener noreferrer' : undefined}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-brand-navy-900 hover:text-white text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>เข้าสู่บริการ</span>
                  {svc.isExternal && <ExternalLink className="w-3.5 h-3.5" />}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
