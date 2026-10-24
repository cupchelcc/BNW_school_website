import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq, asc } from 'drizzle-orm';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export const revalidate = 60;

export default async function PublicCalendarPage() {
  const eventsList = await db
    .select()
    .from(schema.events)
    .where(eq(schema.events.status, 'published'))
    .orderBy(asc(schema.events.startDate));

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ปฏิทินกิจกรรม' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            School Calendar
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-[1.4] sm:leading-[1.45]">
            ปฏิทินกิจกรรมและกำหนดการศึกษา
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            กำหนดการวันสำคัญ กิจกรรมวิชาการ การสอบ และกิจกรรมพัฒนาผู้เรียนประจำปีการศึกษา 2569
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        {eventsList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">ไม่มีกิจกรรมในปฏิทินขณะนี้</p>
          </div>
        ) : (
          eventsList.map((ev) => {
            const dateObj = new Date(ev.startDate);
            const day = dateObj.getDate() || 1;
            const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
            const monthText = months[dateObj.getMonth()] || 'ต.ค.';

            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex items-start gap-5"
              >
                <div className="p-3 bg-brand-navy-50 border border-brand-navy-100 text-brand-navy-950 rounded-xl text-center min-w-20 shrink-0">
                  <span className="block text-2xl font-extrabold leading-none">{day}</span>
                  <span className="text-xs font-bold text-brand-gold-600 block mt-1">{monthText}</span>
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-slate-900 text-base mb-1">{ev.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-navy-600" />
                      <span>{formatThaiDate(ev.startDate)}</span>
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
            );
          })
        )}
      </div>
    </div>
  );
}
