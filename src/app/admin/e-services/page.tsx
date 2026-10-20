import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { Globe, ExternalLink, GraduationCap } from 'lucide-react';

export default async function AdminEServicesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const services = await db.select().from(schema.eServices);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Online E-Services</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการระบบบริการออนไลน์ (E-Service)</h1>
          <p className="text-xs text-slate-500 mt-1">ลิงก์และระบบบริการสำหรับนักเรียน ผู้ปกครอง และครู</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => (
          <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{svc.title}</h3>
                  {svc.isExternal && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">{svc.description}</p>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded mt-2 inline-block">
                  กลุ่ม: {svc.targetGroup}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-slate-400 truncate max-w-44">{svc.url}</span>
              <a href={svc.url} target="_blank" rel="noreferrer" className="text-brand-navy-700 font-bold hover:underline">
                ทดสอบลิงก์ &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
