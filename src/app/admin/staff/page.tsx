import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { Users, User, Plus, Mail } from 'lucide-react';

export default async function AdminStaffPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const staffList = await db.select().from(schema.staff);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Faculty & Staff</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการทำเนียบบุคลากร</h1>
          <p className="text-xs text-slate-500 mt-1">รายชื่อผู้บริหาร คณะครู และบุคลากรทางการศึกษา</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {staffList.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center flex flex-col justify-between">
            <div>
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 border-2 border-brand-navy-100 overflow-hidden mb-3 flex items-center justify-center">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900">{member.name}</h3>
              <p className="text-xs text-brand-navy-700 font-semibold mt-0.5">{member.position}</p>
              <p className="text-[11px] text-slate-400 mt-1">{member.qualification}</p>
            </div>
            {member.email && (
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <Mail className="w-3.5 h-3.5" />
                <span>{member.email}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
