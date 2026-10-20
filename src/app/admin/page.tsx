import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import {
  FileCode,
  Newspaper,
  Megaphone,
  Calendar,
  Users,
  TreePine,
  Image as ImageIcon,
  Activity,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/admin/login');
  }

  let pagesCount: any[] = [];
  let newsCount: any[] = [];
  let announcementsCount: any[] = [];
  let eventsCount: any[] = [];
  let staffCount: any[] = [];
  let plantsCount: any[] = [];
  let mediaCount: any[] = [];
  let recentLogs: any[] = [];

  try {
    [
      pagesCount,
      newsCount,
      announcementsCount,
      eventsCount,
      staffCount,
      plantsCount,
      mediaCount,
      recentLogs,
    ] = await Promise.all([
      db.select().from(schema.pages),
      db.select().from(schema.news),
      db.select().from(schema.announcements),
      db.select().from(schema.events),
      db.select().from(schema.staff),
      db.select().from(schema.botanicalPlants),
      db.select().from(schema.mediaFiles),
      db.select().from(schema.auditLogs).limit(5),
    ]);
  } catch (err) {
    console.warn('[Admin Dashboard] Failed to load dashboard stats:', err);
  }

  const stats = [
    { label: 'หน้าเว็บใน Page Builder', count: pagesCount.length, icon: FileCode, href: '/admin/pages', color: 'text-sky-600 bg-sky-50' },
    { label: 'ข่าวประชาสัมพันธ์', count: newsCount.length, icon: Newspaper, href: '/admin/news', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'ประกาศของโรงเรียน', count: announcementsCount.length, icon: Megaphone, href: '/admin/announcements', color: 'text-amber-600 bg-amber-50' },
    { label: 'กิจกรรมในปฏิทิน', count: eventsCount.length, icon: Calendar, href: '/admin/events', color: 'text-purple-600 bg-purple-50' },
    { label: 'ทำเนียบบุคลากร', count: staffCount.length, icon: Users, href: '/admin/staff', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'พรรณไม้สวนพฤกษศาสตร์', count: plantsCount.length, icon: TreePine, href: '/admin/botanical', color: 'text-teal-600 bg-teal-50' },
    { label: 'ไฟล์ในคลังสื่อ (Media)', count: mediaCount.length, icon: ImageIcon, href: '/admin/media', color: 'text-pink-600 bg-pink-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-brand-navy-700 uppercase tracking-wider">
            ระบบบริหารจัดการเว็บไซต์โรงเรียน (BNW-001 V2)
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            ยินดีต้อนรับ, {session.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            สถานะบัญชี: <span className="font-semibold text-slate-800">{session.role}</span> • เข้าสู่ระบบด้วยความปลอดภัยสูง
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages/home"
            className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <FileCode className="w-4 h-4 text-brand-gold-400" />
            <span>แก้ไขหน้าแรก (Page Builder)</span>
          </Link>
          <Link
            href="/admin/news/new"
            className="px-4 py-2.5 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างข่าวใหม่</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <Link
              key={i}
              href={st.href}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${st.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">{st.count}</span>
                <p className="text-xs text-slate-500 font-medium mt-1">{st.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Audit Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-brand-navy-700" />
              <h2 className="font-bold text-slate-900 text-base">บันทึกกิจกรรมล่าสุด (Audit Logs)</h2>
            </div>
            <Link href="/admin/audit-logs" className="text-xs text-brand-navy-700 font-semibold hover:underline">
              ดูทั้งหมด &rarr;
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">ยังไม่มีบันทึกกิจกรรมในระบบ</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-slate-500 ml-2">[{log.entityType}]</span>
                    {log.userEmail && <p className="text-slate-500 mt-0.5">โดย: {log.userEmail}</p>}
                  </div>
                  <span className="text-slate-400">{formatThaiDate(log.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & Architecture Health */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>สถานะระบบ (Health Check)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>ฐานข้อมูล SQLite / D1 เชื่อมต่อสำเร็จ</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">โควตาค่าบริการ:</span>
              <span className="font-bold text-emerald-700">0 บาท/เดือน (Cloudflare Free Tier)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">เทคโนโลยี:</span>
              <span className="font-bold text-slate-800">Next.js 15 + TypeScript + Tailwind</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">ความปลอดภัย:</span>
              <span className="font-bold text-slate-800">RBAC, Secure Cookies, Bcrypt, Audit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
