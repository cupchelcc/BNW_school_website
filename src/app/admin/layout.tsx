import React from 'react';
import { getCurrentSession } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  // หากยังไม่ได้เข้าสู่ระบบ (เช่น อยู่ที่หน้า /admin/login) ให้เรนเดอร์เฉพาะหน้า children แบบเต็มจอโดยไม่มี Sidebar
  if (!session) {
    return <div className="min-h-screen w-full overflow-x-hidden bg-slate-900">{children}</div>;
  }

  // หากเข้าสู่ระบบแล้ว ให้เรนเดอร์ผ่าน AdminShell ที่รองรับ Responsive สำหรับมือถือ แท็บเล็ต และคอมพิวเตอร์
  return <AdminShell session={session}>{children}</AdminShell>;
}
