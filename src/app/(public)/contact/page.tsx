import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ContactForm } from '@/components/public/ContactForm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function PublicContactPage() {
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'contact')).limit(1);

  if (pageRows.length > 0 && pageRows[0].status === 'published') {
    const blocks: PageBlock[] = JSON.parse(pageRows[0].content || '[]');
    if (blocks.length > 0) {
      const contextData = await getPublicPageContextData();
      return (
        <div className="relative">
          <Breadcrumbs items={[{ label: 'ติดต่อเรา' }]} />
          <div className="flex flex-col">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} contextData={contextData} />
            ))}
          </div>
        </div>
      );
    }
  }

  let theme: Partial<typeof schema.themeSettings.$inferSelect> = {};
  try {
    const themeRows = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'current')).limit(1);
    if (themeRows[0]) theme = themeRows[0];
  } catch (err) {
    console.warn('[Contact Page] Failed to query theme settings:', err);
  }

  return (
    <div className="relative">
      <Breadcrumbs items={[{ label: 'ติดต่อเรา' }]} />

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-white py-14 sm:py-16 px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
            <div className="bg-white/75 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">ข้อมูลการติดต่อราชการ</h2>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-brand-navy-50/80 text-brand-navy-900 border border-brand-navy-100 shrink-0 mt-0.5">
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
                <div className="p-2.5 rounded-xl bg-brand-gold-50/80 text-brand-navy-950 border border-brand-gold-200/80 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase">เบอร์โทรศัพท์ติดต่อ</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {theme.contactPhone || '034-490-XXX (วันและเวลาราชการ)'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-50/80 text-sky-700 border border-sky-100 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase">อีเมลทางการ</h3>
                  <p className="text-xs text-slate-600 mt-1 font-mono">
                    {theme.contactEmail || 'contact@bnw.ac.th'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50/80 text-emerald-700 border border-emerald-100 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase">วันและเวลาเปิดทำการ</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    จันทร์ - ศุกร์: 08.00 น. - 16.30 น.<br />
                    (ปิดทำการในวันเสาร์ วันอาทิตย์ และวันหยุดนักขัตฤกษ์)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/75 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 mb-2">ส่งข้อความติดต่อฝ่ายธุรการ</h2>
            <p className="text-xs text-slate-500 mb-6">
              กรอกข้อมูลเพื่อส่งข้อความหรือสอบถามเรื่องการศึกษา เจ้าหน้าที่จะตอบกลับโดยเร็วที่สุด
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
