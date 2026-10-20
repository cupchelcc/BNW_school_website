import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { Users, User, Mail, Award } from 'lucide-react';

export default async function PublicStaffPage() {
  let staffList: (typeof schema.staff.$inferSelect)[] = [];
  try {
    staffList = await db.select().from(schema.staff).where(eq(schema.staff.isActive, true));
  } catch (err) {
    console.warn('[Staff Page] Failed to query staff list:', err);
  }

  const executive = staffList.filter((s) => s.department === 'executive');
  const academic = staffList.filter((s) => s.department === 'academic');
  const otherStaff = staffList.filter((s) => s.department !== 'executive' && s.department !== 'academic');

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน' }, { label: 'ทำเนียบบุคลากร' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Faculty & Personnel
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ทำเนียบคณะครูและบุคลากรทางการศึกษา
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งมั่นพัฒนาการจัดการศึกษาด้วยจิตวิญญาณแห่งความเป็นครู
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Executives */}
        {executive.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">ผู้บริหารสถานศึกษา</h2>
              <div className="w-12 h-1 bg-brand-gold-500 mx-auto mt-2 rounded-full" />
            </div>

            <div className="flex justify-center">
              {executive.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center max-w-xs w-full">
                  <div className="w-28 h-28 mx-auto rounded-full bg-slate-100 border-2 border-brand-navy-200 overflow-hidden mb-4 flex items-center justify-center">
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-14 h-14 text-slate-300" />
                    )}
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{m.name}</h3>
                  <p className="text-xs font-semibold text-brand-navy-800 mt-1">{m.position}</p>
                  <p className="text-xs text-slate-500 mt-1">{m.qualification}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic & Teachers */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">คณะครูและบุคลากรทางการศึกษา</h2>
            <div className="w-12 h-1 bg-brand-navy-700 mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...academic, ...otherStaff].map((m) => (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden mb-4 flex items-center justify-center">
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{m.name}</h3>
                  <p className="text-xs font-semibold text-brand-navy-700 mt-1">{m.position}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{m.qualification}</p>
                </div>

                {m.email && (
                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{m.email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
