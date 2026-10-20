import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { Network, Users, BookOpen, Wallet, Wrench, Shield } from 'lucide-react';

export default function StructurePage() {
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
      <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน' }, { label: 'โครงสร้างการบริหาร' }]} />

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
        {/* Hierarchy Tree Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
            <Network className="w-6 h-6 text-brand-navy-800" />
            <span>แผนผังโครงสร้างการบริหารงาน 4 ฝ่าย</span>
          </h2>

          <div className="flex flex-col items-center">
            {/* Top: Director & Committee */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="px-6 py-4 rounded-xl bg-brand-navy-900 text-white text-center shadow-md">
                <span className="text-xs text-brand-gold-400 font-bold block mb-1">ผู้บริหารสูงสุด</span>
                <span className="font-bold text-sm">ผู้อำนวยการโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)</span>
              </div>
              <div className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-center border border-slate-200 text-xs font-semibold">
                คณะกรรมการสถานศึกษาขั้นพื้นฐาน
              </div>
            </div>

            <div className="w-0.5 h-6 bg-slate-300 mb-6" />

            {/* 4 Departments Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
              {departments.map((dept, idx) => {
                const Icon = dept.icon;
                return (
                  <div key={idx} className={`p-5 rounded-2xl border ${dept.color} flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-sm mb-3">
                        <Icon className="w-4 h-4" />
                        <span>{dept.title}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                        {dept.duties.map((d, i) => (
                          <li key={i} className="leading-snug">{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
