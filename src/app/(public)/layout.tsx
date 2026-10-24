import React from 'react';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let themeData = {
    siteName: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
    siteDescription: 'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้',
    logoUrl: '/images/logo.png',
    primaryColor: '#0b1f3c',
    secondaryColor: '#eab308',
    footerCopyright: '© 2026 โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สงวนลิขสิทธิ์',
    contactPhone: '034-490-XXX (อยู่ระหว่างเตรียมข้อมูลติดต่อ)',
    contactEmail: 'contact@bnw.ac.th',
    contactAddress: 'เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000',
    facebookUrl: 'https://www.facebook.com/Watbangnamwonschool',
    lineUrl: '',
    youtubeUrl: '',
    navMenuItems: [
      { id: 'm1', title: 'หน้าแรก', href: '/', order: 1 },
      {
        id: 'm2',
        title: 'ข้อมูลโรงเรียน',
        href: '/about',
        order: 2,
        children: [
          { id: 'm2-1', title: 'ประวัติและข้อมูลทั่วไป', href: '/about/history' },
          { id: 'm2-2', title: 'วิสัยทัศน์ พันธกิจ อัตลักษณ์', href: '/about/vision' },
          { id: 'm2-3', title: 'โครงสร้างการบริหาร', href: '/about/structure' },
          { id: 'm2-4', title: 'ทำเนียบบุคลากร', href: '/about/staff' },
        ],
      },
      {
        id: 'm3',
        title: 'ข่าวสารและกิจกรรม',
        href: '/news',
        order: 3,
        children: [
          { id: 'm3-1', title: 'ข่าวประชาสัมพันธ์', href: '/news' },
          { id: 'm3-2', title: 'ประกาศของโรงเรียน', href: '/announcements' },
          { id: 'm3-3', title: 'ปฏิทินกิจกรรม', href: '/calendar' },
          { id: 'm3-4', title: 'ภาพกิจกรรมและแกลเลอรี', href: '/gallery' },
        ],
      },
      {
        id: 'm4',
        title: 'วิชาการ',
        href: '/academic',
        order: 4,
        children: [
          { id: 'm4-1', title: 'ข้อมูลหลักสูตรการศึกษา', href: '/academic' },
          { id: 'm4-2', title: 'ผลงานและความสำเร็จ', href: '/achievements' },
          { id: 'm4-3', title: 'เอกสารดาวน์โหลด', href: '/documents' },
        ],
      },
      { id: 'm5', title: 'บริการออนไลน์', href: '/e-service', order: 5 },
      { id: 'm7', title: 'ติดต่อเรา', href: '/contact', order: 6 },
    ],
  };

  try {
    const rows = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'current')).limit(1);
    if (rows.length > 0) {
      const row = rows[0];
      themeData = {
        siteName: row.siteName || 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
        siteDescription: row.siteDescription || '',
        logoUrl: (row.logoUrl && !row.logoUrl.includes('placeholder')) ? row.logoUrl : '/images/logo.png',
        primaryColor: row.primaryColor || '#0b1f3c',
        secondaryColor: row.secondaryColor || '#eab308',
        footerCopyright: row.footerCopyright || '',
        contactPhone: row.contactPhone || '',
        contactEmail: row.contactEmail || '',
        contactAddress: row.contactAddress || '',
        facebookUrl: (row.facebookUrl && !row.facebookUrl.includes('bnwschool')) ? row.facebookUrl : 'https://www.facebook.com/Watbangnamwonschool',
        lineUrl: row.lineUrl || '',
        youtubeUrl: row.youtubeUrl || '',
        navMenuItems: JSON.parse(row.navMenuItems || '[]'),
      };
    }
  } catch (err) {
    console.error('Failed to load theme settings, using defaults:', err);
  }

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-clip bg-slate-50/80">
      {/* Ambient background light orbs for Modern Glassmorphism depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-brand-gold-400/15 via-amber-300/10 to-transparent blur-3xl animate-ambient" />
        <div className="absolute top-1/3 -left-36 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-brand-navy-600/10 via-blue-400/10 to-transparent blur-3xl animate-ambient [animation-delay:5s]" />
        <div className="absolute bottom-1/4 -right-20 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tl from-amber-400/12 via-yellow-200/10 to-transparent blur-3xl animate-ambient [animation-delay:10s]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header theme={themeData} />
        <main className="flex-1 w-full max-w-full">{children}</main>
        <Footer theme={themeData} />
      </div>
    </div>
  );
}
