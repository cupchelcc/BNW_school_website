import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { ThemeCustomizerEditor } from '@/components/admin/ThemeCustomizerEditor';

export default async function AdminThemePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  if (!ROLE_PERMISSIONS[session.role].canEditTheme) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <h2 className="font-bold text-lg mb-2">ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
          <p className="text-sm">เฉพาะผู้ดูแลระบบหลัก (Super Admin) หรือผู้ดูแลเว็บไซต์ (Site Admin) เท่านั้นที่สามารถปรับแต่ง Theme ได้</p>
        </div>
      </div>
    );
  }

  const rows = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'current')).limit(1);
  const theme = rows[0] || {
    siteName: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
    siteDescription: 'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้',
    logoUrl: '/images/logo-placeholder.svg',
    primaryColor: '#0b1f3c',
    secondaryColor: '#eab308',
    accentColor: '#1b71c4',
    fontFamily: 'IBM Plex Sans Thai',
    footerCopyright: '© 2026 โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สงวนลิขสิทธิ์',
    contactPhone: '034-490-XXX',
    contactEmail: 'contact@bnw.ac.th',
    contactAddress: 'เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000',
    facebookUrl: 'https://www.facebook.com/bnwschool',
    lineUrl: '',
    youtubeUrl: '',
    navMenuItems: '[]',
  };

  const initialTheme = {
    siteName: theme.siteName || 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
    siteDescription: theme.siteDescription || '',
    logoUrl: theme.logoUrl || '/images/logo-placeholder.svg',
    primaryColor: theme.primaryColor || '#0b1f3c',
    secondaryColor: theme.secondaryColor || '#eab308',
    accentColor: theme.accentColor || '#1b71c4',
    fontFamily: theme.fontFamily || 'IBM Plex Sans Thai',
    footerCopyright: theme.footerCopyright || '',
    contactPhone: theme.contactPhone || '',
    contactEmail: theme.contactEmail || '',
    contactAddress: theme.contactAddress || '',
    facebookUrl: theme.facebookUrl || '',
    lineUrl: theme.lineUrl || '',
    youtubeUrl: theme.youtubeUrl || '',
    navMenuItems: JSON.parse(theme.navMenuItems || '[]'),
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <ThemeCustomizerEditor initialTheme={initialTheme} />
    </div>
  );
}
