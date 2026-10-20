import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { Award, Trophy, Medal, Star, CheckCircle } from 'lucide-react';

export default function AchievementsPage() {
  const achievements = [
    {
      title: 'รางวัลเหรียญทอง การแข่งขันความเป็นเลิศทางวิชาการ ระดับเขตพื้นที่ฯ',
      year: '2569',
      organization: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร',
      description: 'ตัวแทนนักเรียนได้รับรางวัลชนะเลิศการแข่งขันตอบปัญหาสุขศึกษาและวิทยาศาสตร์สิ่งแวดล้อม',
      category: 'วิชาการ',
    },
    {
      title: 'สถานศึกษาดีเด่นด้านการอนุรักษ์พันธุกรรมพืชและสวนพฤกษศาสตร์โรงเรียน',
      year: '2568',
      organization: 'โครงการอนุรักษ์พันธุกรรมพืชอันเนื่องมาจากพระราชดำริฯ',
      description: 'ได้รับเกียรติบัตรการดำเนินงานสวนพฤกษศาสตร์โรงเรียนยอดเยี่ยมประจำจังหวัดสมุทรสาคร',
      category: 'สิ่งแวดล้อม',
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
    <div>
      <Breadcrumbs items={[{ label: 'วิชาการ' }, { label: 'ผลงานและความสำเร็จ' }]} />

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="grid gap-6">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow flex items-start gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    ปีการศึกษา {item.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">{item.title}</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>

                <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
                  หน่วยงานมอบรางวัล: <span className="font-medium text-slate-600">{item.organization}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
