import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { Image as ImageIcon, Camera, Calendar } from 'lucide-react';

export default function GalleryPage() {
  const albums = [
    {
      title: 'ภาพบรรยากาศพิธีไหว้ครู ประจำปีการศึกษา 2569',
      date: 'มิถุนายน 2569',
      photoCount: 16,
      coverUrl: '/images/gallery-wai-kru.jpg',
      category: 'กิจกรรมประเพณี',
    },
    {
      title: 'นิทรรศการและสิ่งประดิษฐ์สัปดาห์วิทยาศาสตร์',
      date: 'สิงหาคม 2569',
      photoCount: 24,
      coverUrl: '/images/gallery-science.jpg',
      category: 'วิชาการ',
    },
    {
      title: 'การสำรวจและเก็บตัวอย่างพรรณไม้สวนพฤกษศาสตร์',
      date: 'กันยายน 2569',
      photoCount: 18,
      coverUrl: '/images/gallery-botanical.jpg',
      category: 'สิ่งแวดล้อม',
    },
    {
      title: 'การแข่งขันกีฬาสีภายใน รอดพิทยาคมเกมส์',
      date: 'ธันวาคม 2568',
      photoCount: 32,
      coverUrl: '/images/gallery-sports.jpg',
      category: 'กีฬา',
    },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'ภาพกิจกรรมและแกลเลอรี' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Photo Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ภาพบรรยากาศและกิจกรรมสถานศึกษา
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            ประมวลภาพรอยยิ้ม ความประทับใจ และการเรียนรู้ของนักเรียนโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-gradient-to-tr from-brand-navy-900 to-brand-navy-700 relative flex items-center justify-center text-white/50 overflow-hidden">
                <ImageIcon className="w-14 h-14 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold backdrop-blur-sm">
                  {album.category}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-brand-gold-500 text-brand-navy-950 text-[10px] font-bold">
                  {album.photoCount} ภาพ
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{album.date}</span>
                </div>
                <h2 className="font-bold text-slate-900 text-sm group-hover:text-brand-navy-700 leading-snug">
                  {album.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
