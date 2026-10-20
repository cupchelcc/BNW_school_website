import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { School, Target, Network, Users, ArrowRight } from 'lucide-react';

export default function AboutIndexPage() {
  const sections = [
    {
      title: 'ประวัติและข้อมูลทั่วไป',
      desc: 'ความเป็นมาของสถานศึกษา นามรอดพิทยาคม ปรัชญา และอัตลักษณ์',
      href: '/about/history',
      icon: School,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'วิสัยทัศน์ พันธกิจ และอัตลักษณ์',
      desc: 'ทิศทางการจัดการศึกษา เป้าประสงค์ และค่านิยมสถานศึกษา',
      href: '/about/vision',
      icon: Target,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'โครงสร้างการบริหาร',
      desc: 'แผนผังการบริหารงาน 4 ฝ่าย และบทบาทหน้าที่ภายในสถานศึกษา',
      href: '/about/structure',
      icon: Network,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'ทำเนียบบุคลากร',
      desc: 'คณะผู้บริหาร ครู และบุคลากรทางการศึกษาประจำกลุ่มสาระการเรียนรู้',
      href: '/about/staff',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            About Wat Bang Nam Won School
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ข้อมูลพื้นฐานสถานศึกษา
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Link
                key={idx}
                href={sec.href}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-brand-navy-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3 rounded-xl w-fit mb-4 ${sec.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-base text-slate-900 group-hover:text-brand-navy-800 mb-2">
                    {sec.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {sec.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-brand-navy-700 group-hover:text-brand-navy-900 pt-3 border-t border-slate-100">
                  <span>เข้าชมเนื้อหา</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
