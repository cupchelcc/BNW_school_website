import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { Target, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function VisionPage() {
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'about-vision')).limit(1);

  if (pageRows.length > 0 && pageRows[0].status === 'published') {
    const blocks: PageBlock[] = JSON.parse(pageRows[0].content || '[]');
    if (blocks.length > 0) {
      const contextData = await getPublicPageContextData();
      return (
        <div className="relative">
          <Breadcrumbs
            items={[{ label: 'ข้อมูลโรงเรียน', href: '/about' }, { label: 'วิสัยทัศน์ พันธกิจ และอัตลักษณ์' }]}
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

  const missions = [
    'พัฒนาหลักสูตรสถานศึกษาและการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นสำคัญ พัฒนาทักษะแห่งศตวรรษที่ 21',
    'ปลูกฝังคุณธรรม จริยธรรม ค่านิยมที่พึงประสงค์ และความเป็นพลเมืองดีตามวิถีประชาธิปไตย',
    'ส่งเสริมการใช้เทคโนโลยีดิจิทัลและนวัตกรรมเพื่อการเรียนรู้และการบริหารจัดการ',
    'พัฒนาครูและบุคลากรทางการศึกษาให้มีความเชี่ยวชาญตามมาตรฐานวิชาชีพ',
    'สร้างความร่วมมือระหว่างโรงเรียน ครอบครัว ชุมชน และวัดบางน้ำวน ในการจัดการศึกษาอย่างยั่งยืน',
  ];

  const goals = [
    'ผู้เรียนมีผลสัมฤทธิ์ทางการเรียนตามเกณฑ์มาตรฐาน และมีทักษะการคิดวิเคราะห์',
    'ผู้เรียนมีระเบียบวินัย ซื่อสัตย์สุจริต มีจิตสาธารณะ และดำเนินชีวิตตามหลักปรัชญาของเศรษฐกิจพอเพียง',
    'ครูจัดการเรียนรู้เชิงรุก (Active Learning) และใช้สื่อเทคโนโลยีได้อย่างมีประสิทธิภาพ',
    'โรงเรียนมีระบบการบริหารจัดการที่มีคุณภาพตามมาตรฐานสากลและมีความโปร่งใส',
  ];

  return (
    <div className="relative">
      <Breadcrumbs
        items={[{ label: 'ข้อมูลโรงเรียน', href: '/about' }, { label: 'วิสัยทัศน์ พันธกิจ และอัตลักษณ์' }]}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-white py-14 sm:py-16 px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            ทิศทางการพัฒนาสถานศึกษา
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-[1.4] sm:leading-[1.45]">
            วิสัยทัศน์ พันธกิจ และเป้าประสงค์
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งมั่นสู่ความเป็นเลิศทางการศึกษา พัฒนาคนดีสู่สังคม
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Vision Card */}
        <div className="relative bg-brand-navy-950/90 backdrop-blur-2xl border border-white/15 text-white rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-brand-gold-400/10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 text-brand-gold-400 mb-4 font-bold text-sm">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-brand-gold-400">
              <Target className="w-5 h-5" />
            </div>
            <span>วิสัยทัศน์สถานศึกษา (Vision)</span>
          </div>
          <blockquote className="text-xl sm:text-2xl font-bold leading-relaxed text-white">
            "โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งพัฒนาผู้เรียนให้มีคุณภาพตามมาตรฐาน มีทักษะในศตวรรษที่ 21 
            ควบคู่คุณธรรม จริยธรรม อนุรักษ์สิ่งแวดล้อมและวัฒนธรรมท้องถิ่น น้อมนำหลักปรัชญาของเศรษฐกิจพอเพียง สู่การเติบโตอย่างยั่งยืน"
          </blockquote>
        </div>

        {/* Mission & Goals */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Mission */}
          <div className="bg-white/75 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <div className="p-2 bg-brand-navy-50 text-brand-navy-800 rounded-xl border border-brand-navy-100">
                <Compass className="w-5 h-5" />
              </div>
              <span>พันธกิจ (Mission)</span>
            </h2>
            <ul className="space-y-4">
              {missions.map((m, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Goals */}
          <div className="bg-white/75 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <div className="p-2 bg-brand-gold-50 text-brand-gold-700 rounded-xl border border-brand-gold-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <span>เป้าประสงค์ (Goals)</span>
            </h2>
            <ul className="space-y-4">
              {goals.map((g, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-brand-gold-100 text-brand-navy-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
