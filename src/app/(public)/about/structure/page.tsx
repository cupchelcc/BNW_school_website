import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { BookOpen, Users, Wallet, Wrench, Shield } from 'lucide-react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { BlockRenderer } from '@/components/page-builder/renderer/BlockRenderer';
import { getPublicPageContextData } from '@/lib/page-helper-server';
import { PageBlock } from '@/types/page-builder';

export const dynamic = 'force-dynamic';

export default async function StructurePage() {
  const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, 'about-structure')).limit(1);

  if (pageRows.length > 0 && pageRows[0].status === 'published') {
    const blocks: PageBlock[] = JSON.parse(pageRows[0].content || '[]');
    if (blocks.length > 0) {
      const contextData = await getPublicPageContextData();
      return (
        <div>
          <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน', href: '/about' }, { label: 'โครงสร้างการบริหาร' }]} />
          <div className="flex flex-col">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} contextData={contextData} />
            ))}
          </div>
        </div>
      );
    }
  }

  const departments = [
    {
      title: '1. ฝ่ายบริหารงานวิชาการ',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      duties: ['พัฒนาหลักสูตรสถานศึกษา', 'การจัดกระบวนการเรียนรู้และสื่อการสอน', 'การวัดผลและประเมินผลการเรียน', 'งานทะเบียนและวัดผลนักเรียน', 'งานวิจัยเพื่อพัฒนาคุณภาพการศึกษา'],
    },
    {
      title: '2. ฝ่ายบริหารงานบุคคลและกิจการนักเรียน',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      duties: ['ส่งเสริมระเบียบวินัยและคุณธรรมนักเรียน', 'ระบบดูแลช่วยเหลือนักเรียน', 'งานสภานักเรียนและกิจกรรมส่งเสริมประชาธิปไตย', 'งานพัฒนาวินัยและความประพฤติ'],
    },
    {
      title: '3. ฝ่ายบริหารงานงบประมาณและแผนงาน',
      icon: Wallet,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      duties: ['การจัดทำแผนปฏิบัติการประจำปี', 'การบริหารจัดการงบประมาณและพัสดุ', 'การตรวจสอบและควบคุมภายใน', 'งานระดมทรัพยากรเพื่อการศึกษา'],
    },
    {
      title: '4. ฝ่ายบริหารงานทั่วไปและอาคารสถานที่',
      icon: Wrench,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      duties: ['การดูแลรักษาอาคารสถานที่และสิ่งแวดล้อม', 'งานยานพาหนะและโภชนาการโรงเรียน', 'งานความปลอดภัยและอนามัยโรงเรียน', 'งานประสานงานชุมชนและวัดบางน้ำวน'],
    },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน', href: '/about' }, { label: 'โครงสร้างการบริหาร' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            การบริหารจัดการองค์กร
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            โครงสร้างการบริหารงานสถานศึกษา
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) บริหารงานตามหลักธรรมาภิบาลและการมีส่วนร่วม
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Leadership Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-brand-navy-900 text-brand-gold-400 flex items-center justify-center mx-auto mb-4 font-bold">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-brand-gold-600 uppercase tracking-wider">ผู้บริหารสถานศึกษา</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">ผู้อำนวยการโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)</h2>
          <p className="text-xs text-slate-500 mt-2">
            กำหนดนโยบาย วางแผนยุทธศาสตร์ และกำกับดูแลการดำเนินงานของ 4 ฝ่ายบริหาร
          </p>
        </div>

        {/* 4 Departments Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${dept.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{dept.title}</h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {dept.duties.map((duty, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                      <span>{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
