import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { School, Award } from 'lucide-react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'about-history')).limit(1);

  if (pageRows.length > 0 && pageRows[0].status === 'published') {
    const blocks: PageBlock[] = JSON.parse(pageRows[0].content || '[]');
    if (blocks.length > 0) {
      const contextData = await getPublicPageContextData();
      return (
        <div>
          <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน', href: '/about' }, { label: 'ประวัติและข้อมูลทั่วไป' }]} />
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
    <div>
      <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน', href: '/about' }, { label: 'ประวัติและข้อมูลทั่วไป' }]} />

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
            ปัจจุบัน โรงเรียนจัดการเรียนการสอนตั้งแต่ระดับชั้นปฐมวัย (อนุบาล) ไปจนถึงระดับชั้นการศึกษาขั้นพื้นฐาน โดยมุ่งเน้นการพัฒนาผู้เรียนทั้งทางด้านสติปัญญา คุณธรรม จริยธรรม สุขอนามัย และการสืบสานวัฒนธรรมชุมชนบางน้ำวน
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
              <span className="font-bold text-slate-900 block mb-1">สีประจำโรงเรียน</span>
              <p className="text-slate-600">น้ำเงิน - เหลือง (ความสุขุม มั่นคง และปัญญาอันสว่างไสว)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">ปรัชญาของโรงเรียน</span>
              <p className="text-slate-600">สุวิชาโน ภวํ โหติ : ผู้รู้ดี เป็นผู้เจริญ</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">คำขวัญโรงเรียน</span>
              <p className="text-slate-600">เรียนดี กีฬาเด่น เน้นคุณธรรม สัมพันธ์ชุมชน</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">สังกัดหน่วยงาน</span>
              <p className="text-slate-600">สพป.สมุทรสาคร (สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
