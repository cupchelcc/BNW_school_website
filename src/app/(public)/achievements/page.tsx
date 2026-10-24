import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { Award, Trophy, Medal, Star, CheckCircle } from 'lucide-react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'achievements')).limit(1);

  if (pageRows.length > 0 && pageRows[0].status === 'published') {
    const blocks: PageBlock[] = JSON.parse(pageRows[0].content || '[]');
    if (blocks.length > 0) {
      const contextData = await getPublicPageContextData();
      return (
        <div className="relative">
          <Breadcrumbs
            items={[{ label: 'วิชาการ', href: '/academic' }, { label: 'ผลงานและความสำเร็จ' }]}
          />
          <div className="flex flex-col">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} contextData={contextData} />
            ))}
          </div>
        </div>
      );
    }
  }

  const achievements = [
    {
      title: 'รางวัลเหรียญทอง การแข่งขันความเป็นเลิศทางวิชาการ ระดับเขตพื้นที่ฯ',
      year: '2569',
      organization: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร',
      description: 'ตัวแทนนักเรียนได้รับรางวัลชนะเลิศการแข่งขันตอบปัญหาสุขศึกษาและวิทยาศาสตร์สิ่งแวดล้อม',
      category: 'วิชาการ',
    },
    {
      title: 'สถานศึกษาดีเด่นด้านการส่งเสริมคุณธรรมและอัตลักษณ์วิถีพุทธ',
      year: '2568',
      organization: 'คณะสงฆ์อำเภอเมืองสมุทรสาคร และสำนักงานพระพุทธศาสนา',
      description: 'ได้รับยกย่องเป็นโรงเรียนวิถีพุทธชั้นนำที่มีการบูรณาการคุณธรรม จริยธรรม ลงสู่การดำเนินชีวิตจริงของนักเรียน',
      category: 'คุณธรรมจริยธรรม',
    },
    {
      title: 'รางวัลชนะเลิศ การประกวดมารยาทไทยและสวดมนต์หมู่สรรเสริญพระรัตนตรัย',
      year: '2568',
      organization: 'คณะสงฆ์อำเภอเมืองสมุทรสาคร และวัดบางน้ำวน',
      description: 'ส่งเสริมคุณธรรม จริยธรรม และการสืบสานประเพณีอันดีงามของเยาวชน',
      category: 'คุณธรรมจริยธรรม',
    },
    {
      title: 'รางวัลรองชนะเลิศอันดับ 1 การแข่งขันกีฬาและกรีฑานักเรียนกลุ่มโรงเรียน',
      year: '2568',
      organization: 'กลุ่มโรงเรียนเมืองสมุทรสาคร 3',
      description: 'นักเรียนตัวแทนโรงเรียนทำผลงานยอดเยี่ยมในการแข่งขันฟุตซอลและกรีฑาระดับเยาวชน',
      category: 'กีฬา',
    },
  ];

  return (
    <div className="relative">
      <Breadcrumbs
        items={[{ label: 'วิชาการ', href: '/academic' }, { label: 'ผลงานและความสำเร็จ' }]}
      />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Awards & Pride
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ผลงานและความสำเร็จของสถานศึกษา
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            ความภาคภูมิใจจากความมุ่งมั่น ทุ่มเท ของคณะครู นักเรียน และชุมชนรอดพิทยาคม
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {achievements.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-brand-gold-50 text-brand-gold-800 text-xs font-bold border border-brand-gold-200">
                    ปีการศึกษา {item.year}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{item.category}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <Trophy className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <span>มอบโดย: {item.organization}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
