import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { ShieldCheck, Lock, FileText, UserCheck, AlertCircle } from 'lucide-react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'privacy')).limit(1);

  if (pageRows.length > 0 && pageRows[0].status === 'published') {
    const blocks: PageBlock[] = JSON.parse(pageRows[0].content || '[]');
    if (blocks.length > 0) {
      const contextData = await getPublicPageContextData();
      return (
        <div className="relative">
          <Breadcrumbs items={[{ label: 'นโยบายความเป็นส่วนตัว' }]} />
          <div className="flex flex-col">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} contextData={contextData} />
            ))}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="relative">
      <Breadcrumbs items={[{ label: 'นโยบายความเป็นส่วนตัว' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Data Protection & Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-[1.4] sm:leading-[1.45]">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            แนวทางการคุ้มครองข้อมูลส่วนบุคคล โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-700 leading-relaxed text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-xs text-blue-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">คำชี้แจงความโปร่งใส:</span>
            เอกสารฉบับนี้จัดทำขึ้นเพื่อแสดงเจตนารมณ์และแนวทางปฏิบัติในการรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) โดยโรงเรียนมุ่งมั่นปกป้องสิทธิของผู้เรียน ผู้ปกครอง และบุคลากรอย่างดีที่สุด
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-navy-800" />
              <span>1. ข้อมูลส่วนบุคคลที่เราจัดเก็บ</span>
            </h2>
            <p>
              เว็บไซต์โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มีการจัดเก็บข้อมูลส่วนบุคคลเฉพาะที่จำเป็นต่อการให้บริการทางการศึกษาและประสานงานราชการเท่านั้น ได้แก่:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-600">
              <li><strong>ข้อมูลผู้ดูแลระบบ:</strong> ชื่อ-นามสกุล, อีเมลทางการ, รหัสผ่านที่ผ่านการแฮชด้วยกรรมวิธีทางคณิตศาสตร์ที่ไม่สามารถย้อนกลับได้ (Bcrypt)</li>
              <li><strong>ข้อมูลการติดต่อผ่านฟอร์ม:</strong> ชื่อ, เบอร์โทรศัพท์, อีเมล และข้อความที่ผู้ใช้กรอกเพื่อสอบถามข้อมูล</li>
              <li><strong>คุกกี้ที่จำเป็น (Strictly Necessary Cookies):</strong> คุกกี้สำหรับรักษาเซสชันความปลอดภัยในการเข้าสู่ระบบของผู้ดูแลโรงเรียน</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-gold-500" />
              <span>2. วัตถุประสงค์ในการประมวลผลข้อมูล</span>
            </h2>
            <p>
              ข้อมูลทั้งหมดจะถูกใช้เพื่อการบริหารจัดการการศึกษา การประชาสัมพันธ์ข่าวสารโรงเรียน และการให้บริการระบบธุรกรรมอิเล็กทรอนิกส์ (E-Service) ตามอำนาจหน้าที่ของสถานศึกษาเท่านั้น จะไม่มีการนำข้อมูลส่วนบุคคลไปจำหน่ายหรือเผยแพร่แก่บุคคลภายนอกโดยมิชอบ
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>3. การรักษาความมั่นคงปลอดภัย</span>
            </h2>
            <p>
              โรงเรียนกำหนดมาตรการทางเทคนิคและการบริหารจัดการเพื่อป้องกันการเข้าถึงข้อมูลโดยมิได้รับอนุญาต การสูญหาย หรือการทำลายข้อมูล โดยใช้ระบบการยืนยันตัวตนด้วยรหัสผ่านที่มีความซับซ้อนและการเข้ารหัสช่องทางการสื่อสารผ่านโพรโทคอล HTTPS (SSL/TLS)
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-600" />
              <span>4. สิทธิของเจ้าของข้อมูลส่วนบุคคล</span>
            </h2>
            <p>
              ท่านมีสิทธิ์ในการขอเข้าถึง ขอรับสำเนา ขอแก้ไข หรือขอลบข้อมูลส่วนบุคคลของท่านได้ตามที่กฎหมายกำหนด โดยสามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของโรงเรียนวัดบางน้ำวน (รอดพิทยาคม) ได้ที่อีเมล: <code className="text-slate-800 font-mono bg-slate-100 px-1 py-0.5 rounded">contact@bnw.ac.th</code>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
