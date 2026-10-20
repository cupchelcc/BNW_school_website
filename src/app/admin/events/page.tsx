import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function AdminEventsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const eventsList = await db.select().from(schema.events);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Events & Calendar</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการปฏิทินกิจกรรมโรงเรียน</h1>
          <p className="text-xs text-slate-500 mt-1">กำหนดการวันสำคัญ กิจกรรมวิชาการ และการแข่งขันกีฬา</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {eventsList.map((ev) => (
          <div key={ev.id} className="p-6 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-purple-50 text-purple-700 rounded-xl shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{ev.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>วันที่: {formatThaiDate(ev.startDate)}</span>
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>สถานที่: {ev.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
