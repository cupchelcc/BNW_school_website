'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthSession } from '@/lib/auth';
import { LogoutButton } from '@/components/admin/LogoutButton';
import {
  LayoutDashboard,
  FileCode,
  Newspaper,
  Megaphone,
  Calendar,
  Users,
  GraduationCap,
  FileText,
  Globe,
  TreePine,
  Image as ImageIcon,
  Palette,
  Shield,
  Activity,
  ExternalLink,
  School,
  Menu,
  X,
} from 'lucide-react';

interface AdminShellProps {
  session: AuthSession;
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ session, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'ภาพรวมระบบ (Dashboard)', icon: LayoutDashboard, iconColor: 'text-brand-gold-400' },
    { href: '/admin/pages', label: 'Page Builder (จัดหน้าเว็บ)', icon: FileCode, iconColor: 'text-sky-400' },
    { type: 'header', label: 'โมดูลเนื้อหาโรงเรียน' },
    { href: '/admin/news', label: 'ข่าวสารและกิจกรรม', icon: Newspaper, iconColor: 'text-blue-400' },
    { href: '/admin/announcements', label: 'ประกาศสำคัญ', icon: Megaphone, iconColor: 'text-amber-400' },
    { href: '/admin/events', label: 'ปฏิทินกิจกรรม', icon: Calendar, iconColor: 'text-rose-400' },
    { href: '/admin/staff', label: 'ทำเนียบบุคลากร', icon: Users, iconColor: 'text-purple-400' },
    { href: '/admin/academic', label: 'หลักสูตรและวิชาการ', icon: GraduationCap, iconColor: 'text-indigo-400' },
    { href: '/admin/documents', label: 'เอกสารดาวน์โหลด', icon: FileText, iconColor: 'text-emerald-400' },
    { href: '/admin/e-services', label: 'บริการออนไลน์ (E-Service)', icon: Globe, iconColor: 'text-teal-400' },
    { type: 'header', label: 'ระบบและอัตลักษณ์' },
    { href: '/admin/media', label: 'คลังรูปภาพและสื่อ (Media)', icon: ImageIcon, iconColor: 'text-pink-400' },
    { href: '/admin/theme', label: 'Theme Customizer', icon: Palette, iconColor: 'text-brand-gold-400' },
    { href: '/admin/users', label: 'ผู้ใช้งานและสิทธิ์', icon: Shield, iconColor: 'text-red-400' },
    { href: '/admin/audit-logs', label: 'ประวัติกิจกรรม (Audit Log)', icon: Activity, iconColor: 'text-slate-400' },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 sm:p-5 border-b border-brand-navy-900 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-gold-500 text-brand-navy-950 flex items-center justify-center font-bold shrink-0">
            <School className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm tracking-tight text-white leading-tight truncate">
              รอดพิทยาคม CMS
            </h2>
            <span className="text-[11px] text-brand-gold-400 font-medium block">BNW-001 V2 Admin</span>
          </div>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-brand-navy-900"
          aria-label="ปิดเมนู"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Card */}
      <div className="px-4 sm:px-5 py-3 bg-brand-navy-900/60 border-b border-brand-navy-900 flex items-center justify-between">
        <div className="overflow-hidden min-w-0 mr-2">
          <p className="text-xs font-bold text-white truncate">{session.name}</p>
          <span className="inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-semibold bg-brand-gold-500/20 text-brand-gold-300 border border-brand-gold-500/30 truncate">
            {session.role === 'super_admin'
              ? 'ผู้ดูแลระบบสูงสุด'
              : session.role === 'site_admin'
              ? 'ผู้ดูแลเว็บไซต์'
              : session.role === 'editor'
              ? 'บรรณาธิการ'
              : 'ผู้เขียนเนื้อหา'}
          </span>
        </div>
        <LogoutButton />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
        {navItems.map((item, index) => {
          if (item.type === 'header') {
            return (
              <div key={index} className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </div>
            );
          }
          const Icon = item.icon!;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-navy-800 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-brand-navy-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${item.iconColor}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Link to Public Website */}
      <div className="p-3 border-t border-brand-navy-900">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-brand-navy-900/60 hover:bg-brand-navy-900 text-slate-300 text-xs transition-colors"
        >
          <span className="truncate">เปิดหน้าเว็บไซต์สาธารณะ</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-brand-navy-950 text-white px-4 py-3 border-b border-brand-navy-900 flex items-center justify-between sticky top-0 z-30 shadow-sm w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg bg-brand-navy-900 text-slate-200 hover:text-white"
            aria-label="เปิดเมนูผู้ดูแล"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-brand-gold-500 text-brand-navy-950 flex items-center justify-center font-bold shrink-0">
            <School className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm truncate">รอดพิทยาคม CMS</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-300 hidden sm:inline truncate max-w-[120px]">{session.name}</span>
          <LogoutButton />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-brand-navy-950 text-white flex-col shrink-0 border-r border-brand-navy-900 min-h-screen sticky top-0 h-screen">
        {renderNavContent()}
      </aside>

      {/* Mobile Sidebar Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-brand-navy-950 text-white flex flex-col h-full shadow-2xl z-10">
            {renderNavContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
