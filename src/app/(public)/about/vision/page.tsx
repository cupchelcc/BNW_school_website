import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { Target, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VisionPage() {
  const missions = [
    'พัฒนาหลักสูตรสถานศึกษาและการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นสำคัญ พัฒนาทักษะแห่งศตวรรษที่ 21',
    'ปลูกฝังคุณธรรม จริยธรรม ค่านิยมที่พึงประสงค์ และความเป็นพลเมืองดีตามวิถีประชาธิปไตย',
    'ส่งเสริมการใช้เทคโนโลยีดิจิทัลและนวัตกรรมเพื่อการเรียนรู้และการบริหารจัดการ',
    'พัฒนาครูและบุคลากรทางการศึกษาให้มีความเชี่ยวชาญตามมาตรฐานวิชาชีพ',
    'สร้างความร่วมมือระหว่างโรงเรียน ครอบครัว ชุมชน และวัดบางน้ำวน ในการจัดการศึกษาอย่างยั่งยืน',
    'ขับเคลื่อนงานสวนพฤกษศาสตร์โรงเรียนเพื่อสร้างจิตสำนึกในการอนุรักษ์พันธุกรรมพืชและทรัพยากรธรรมชาติ',
  ];

  const goals = [
    'ผู้เรียนมีผลสัมฤทธิ์ทางการเรียนตามเกณฑ์มาตรฐาน และมีทักษะการคิดวิเคราะห์',
    'ผู้เรียนมีระเบียบวินัย ซื่อสัตย์สุจริต มีจิตสาธารณะ และดำเนินชีวิตตามหลักปรัชญาของเศรษฐกิจพอเพียง',
    'ครูจัดการเรียนรู้เชิงรุก (Active Learning) และใช้สื่อเทคโนโลยีได้อย่างมีประสิทธิภาพ',
    'โรงเรียนมีระบบการบริหารจัดการที่มีคุณภาพตามมาตรฐานสากลและมีความโปร่งใส',
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ข้อมูลโรงเรียน' }, { label: 'วิสัยทัศน์ พันธกิจ และอัตลักษณ์' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            ทิศทางการพัฒนาสถานศึกษา
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            วิสัยทัศน์ พันธกิจ และเป้าประสงค์
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งมั่นสู่ความเป็นเลิศทางการศึกษา พัฒนาคนดีสู่สังคม
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Vision Card */}
        <div className="bg-gradient-to-br from-brand-navy-900 to-brand-navy-950 text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 text-brand-gold-400 mb-4 font-bold text-sm">
            <Target className="w-5 h-5" />
            <span>วิสัยทัศน์สถานศึกษา (Vision)</span>
          </div>
          <blockquote className="text-xl sm:text-2xl font-bold leading-relaxed text-white">
            "โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งพัฒนาผู้เรียนให้มีคุณภาพตามมาตรฐาน มีทักษะในศตวรรษที่ 21 
            ควบคู่คุณธรรม จริยธรรม อนุรักษ์สิ่งแวดล้อมและวัฒนธรรมท้องถิ่น น้อมนำหลักปรัชญาของเศรษฐกิจพอเพียง สู่การเติบโตอย่างยั่งยืน"
          </blockquote>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 text-brand-navy-800 mb-6 font-bold text-lg">
            <Compass className="w-6 h-6 text-brand-navy-700" />
            <h2>พันธกิจของโรงเรียน (Mission)</h2>
          </div>

          <div className="grid gap-3">
            {missions.map((m, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                <span className="w-6 h-6 rounded-full bg-brand-navy-100 text-brand-navy-900 font-bold flex items-center justify-center shrink-0 text-xs">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 text-brand-navy-800 mb-6 font-bold text-lg">
            <Sparkles className="w-6 h-6 text-brand-gold-500" />
            <h2>เป้าประสงค์ (Goals)</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map((g, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
