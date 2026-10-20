import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { ShieldCheck, Lock, FileText, UserCheck, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'นโยบายความเป็นส่วนตัว' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Data Protection & Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            แนวทางการคุ้มครองข้อมูลส่วนบุคคล โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-700 leading-relaxed text-sm">
        {/* Compliance statement as mandated by Section 15 */}
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
              <Lock className="w-5 h-5 text-brand-navy-800" />
              <span>2. วัตถุประสงค์ในการประมวลผลข้อมูล</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-600">
              <li>เพื่อการบริหารจัดการเนื้อหาบนเว็บไซต์โรงเรียน</li>
              <li>เพื่อการตอบข้อซักถามและการติดต่อประสานงานระหว่างผู้ปกครองกับสถานศึกษา</li>
              <li>เพื่อการรักษาความปลอดภัยของระบบ และตรวจสอบกิจกรรมที่ไม่พึงประสงค์ (Audit Logs)</li>
              <li>โรงเรียนไม่มีนโยบายการจำหน่าย แลกเปลี่ยน หรือส่งต่อข้อมูลส่วนบุคคลไปยังบุคคลภายนอกเชิงพาณิชย์โดยเด็ดขาด</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-navy-800" />
              <span>3. สิทธิของเจ้าของข้อมูลส่วนบุคคล</span>
            </h2>
            <p className="text-xs text-slate-600">
              ท่านในฐานะเจ้าของข้อมูลส่วนบุคคล มีสิทธิตามกฎหมายในการขอเข้าถึง ขอรับสำเนา ขอแก้ไขข้อมูลให้ถูกต้อง ขอให้ลบหรือทำลายข้อมูล และขอคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่าน โดยสามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลของโรงเรียนได้ที่:
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium space-y-1">
              <p><strong>ฝ่ายงานข้อมูลสารสนเทศ โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)</strong></p>
              <p>อีเมล: <span className="font-mono text-brand-navy-700">contact@bnw.ac.th</span></p>
              <p>ที่อยู่: ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
