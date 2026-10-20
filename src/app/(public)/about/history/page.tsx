import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { School, MapPin, Award, BookOpen, Clock, HeartHandshake } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน' }, { label: 'ประวัติและข้อมูลทั่วไป' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            ข้อมูลพื้นฐานสถานศึกษา
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ประวัติโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            สถาบันการศึกษาเพื่อชุมชนริมสายน้ำบางน้ำวน สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Story */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <School className="w-6 h-6 text-brand-navy-800" />
            <span>ความเป็นมาของสถานศึกษา</span>
          </h2>
          <p>
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) ตั้งอยู่เลขที่ 40 หมู่ที่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร ก่อตั้งขึ้นเพื่อขยายโอกาสทางการศึกษาให้แก่เด็กและเยาวชนในชุมชนตำบลบางน้ำวนและพื้นที่ใกล้เคียง โดยได้รับความเมตตาอุปถัมภ์จากวัดบางน้ำวนและผู้นำชุมชนในอดีต ซึ่งมุ่งหวังให้บุตรหลานได้รับการศึกษาที่มีคุณภาพและมีคุณธรรม
          </p>
          <p>
            นาม <strong>"รอดพิทยาคม"</strong> ได้รับการสืบทอดมาจากพระเกจิอาจารย์และผู้ทรงคุณูปการสำคัญของวัดบางน้ำวน เพื่อเป็นอนุสรณ์แห่งความเมตตา การเสียสละ และเป็นสิริมงคลแก่คณะครู นักเรียน และบุคลากรทางการศึกษาในการปฏิบัติหน้าที่และใฝ่หาความรู้
          </p>
          <p>
            ปัจจุบัน โรงเรียนจัดการเรียนการสอนตั้งแต่ระดับชั้นปฐมวัย (อนุบาล) ไปจนถึงระดับชั้นการศึกษาขั้นพื้นฐาน โดยมุ่งเน้นการพัฒนาผู้เรียนทั้งทางด้านสติปัญญา คุณธรรม จริยธรรม สุขอนามัย และการอนุรักษ์สิ่งแวดล้อมท้องถิ่น โดยเฉพาะการมีส่วนร่วมในโครงการสวนพฤกษศาสตร์โรงเรียนและการสืบสานวัฒนธรรมชุมชนบางน้ำวน
          </p>
        </div>

        {/* Identity Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-gold-500" />
            <span>อัตลักษณ์และข้อมูลเชิงสัญลักษณ์</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-bold block mb-1">สีประจำโรงเรียน</span>
              <p className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-900 inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block" />
                <span>น้ำเงิน - เหลือง</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">น้ำเงินหมายถึง ความมั่นคง มีวินัย • เหลืองหมายถึง คุณธรรม ความเจริญงอกงาม</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-bold block mb-1">ปรัชญาของโรงเรียน</span>
              <p className="font-bold text-slate-900">"คุณธรรมนำความรู้ มุ่งสู่คุณภาพชีวิตที่ดี"</p>
              <p className="text-xs text-slate-500 mt-1">มุ่งเน้นการสร้างเยาวชนคนดีก่อนคนเก่ง</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-bold block mb-1">เอกลักษณ์ของสถานศึกษา</span>
              <p className="font-bold text-slate-900">"ภูมิทัศน์สะอาด บรรยากาศร่มรื่น มารยาทเด่น"</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-bold block mb-1">สังกัดหน่วยงาน</span>
              <p className="font-bold text-slate-900">สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
