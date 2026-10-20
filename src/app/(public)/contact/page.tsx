import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { MapPin, Phone, Mail, Clock, Send, School } from 'lucide-react';
import { ContactForm } from '@/components/public/ContactForm';

export default async function PublicContactPage() {
  const themeRows = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'current')).limit(1);
  const theme = themeRows[0] || {};

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ติดต่อเรา' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Contact Information
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ติดต่อโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            ยินดีต้อนรับผู้ปกครอง ชุมชน และประชาชนทั่วไป สอบถามข้อมูลการศึกษาและประสานงานราชการ
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-3">ข้อมูลการติดต่อราชการ</h2>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-brand-navy-50 text-brand-navy-900 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase">ที่อยู่สถานศึกษา</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {theme.contactAddress || 'เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-brand-navy-50 text-brand-navy-900 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase">เบอร์โทรศัพท์</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {theme.contactPhone || '034-490-XXX (อยู่ระหว่างเตรียมข้อมูลติดต่อ)'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-brand-navy-50 text-brand-navy-900 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase">อีเมลติดต่อ</h3>
                  <p className="text-xs text-slate-600 mt-1 font-mono">
                    {theme.contactEmail || 'contact@bnw.ac.th'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-brand-navy-50 text-brand-navy-900 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase">เวลาทำการ</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    วันจันทร์ - วันศุกร์ เวลา 08:00 - 16:30 น. (เว้นวันหยุดราชการ)
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Directions Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 leading-relaxed space-y-2">
              <span className="font-bold block text-sm">การเดินทางมายังโรงเรียน:</span>
              <p>
                ตั้งอยู่ติดกับบริเวณวัดบางน้ำวน ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร สามารถเดินทางจากถนนพระราม 2 เข้าสู่ถนนสายสมุทรสาคร-บางน้ำวน โดยมีป้ายบอกทางชัดเจน
              </p>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">ส่งข้อความติดต่อสอบถาม</h2>
            <p className="text-xs text-slate-500 mb-6">
              กรอกแบบฟอร์มเพื่อส่งข้อความหรือข้อเสนอแนะถึงฝ่ายธุรการโรงเรียน
            </p>

            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
