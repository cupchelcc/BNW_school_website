'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { School, Menu, X, ChevronDown, Search, Shield } from 'lucide-react';

interface HeaderProps {
  theme: {
    siteName: string;
    siteDescription?: string | null;
    logoUrl?: string | null;
    primaryColor: string;
    secondaryColor: string;
    navMenuItems: Array<{
      id: string;
      title: string;
      href: string;
      children?: Array<{ id: string; title: string; href: string }>;
    }>;
  };
}

export const Header: React.FC<HeaderProps> = ({ theme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isClickLocked, setIsClickLocked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ตรวจจับการเลื่อนหน้าจอ (Scroll) เพื่อเพิ่มมิติความคมชัดให้กับ Navbar ด้านบน
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ปิด Dropdown เมื่อคลิกนอกแถบนำทาง หรือกดปุ่ม Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsClickLocked(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsClickLocked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // รองรับการนำเมาส์ไปชี้ (Hover) พร้อมระยะหน่วงป้องกันเมนูหายกระทันหัน
  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (isClickLocked) return; // หากคลิกค้างไว้ จะไม่ปิดเมื่อเมาส์เลื่อนออก
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 280);
  };

  const toggleDropdown = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (activeDropdown === id) {
      setActiveDropdown(null);
      setIsClickLocked(false);
    } else {
      setActiveDropdown(id);
      setIsClickLocked(true); // ล็อคให้แสดงค้างไว้จนกว่าจะคลิกเลือกหรือคลิกข้างนอก
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 w-full max-w-full ${
        isScrolled
          ? 'bg-white/98 shadow-md border-b border-slate-300/80 backdrop-blur-md'
          : 'bg-white/95 shadow-xs border-b border-slate-200/80 backdrop-blur-md'
      }`}
    >
      {/* Top Banner (Affiliation & Search) */}
      <div className="bg-brand-navy-950 text-white text-xs py-2 px-3 sm:px-6 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse shrink-0" />
            <span className="truncate hidden sm:inline text-[11px] sm:text-xs">
              สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร
            </span>
            <span className="truncate sm:hidden text-[11px]">
              สพป.สมุทรสาคร
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs">
            <Link href="/search" className="hover:text-brand-gold-300 flex items-center gap-1 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span>ค้นหา</span>
            </Link>
            <Link
              href="/admin/login"
              className="text-slate-300 hover:text-white flex items-center gap-1 border-l border-white/20 pl-2.5 sm:pl-3 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-brand-gold-400" />
              <span>ระบบผู้ดูแล</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 w-full relative">
        {/* School Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-navy-900 text-brand-gold-400 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform shrink-0">
            <School className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-sm sm:text-base lg:text-lg text-slate-900 group-hover:text-brand-navy-800 leading-tight block truncate">
              {theme.siteName}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block truncate">
              {theme.siteDescription || 'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ'}
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav
          ref={navRef}
          className="hidden lg:flex items-center gap-1 text-sm font-medium shrink-0"
          aria-label="เมนูหลัก"
        >
          {theme.navMenuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = activeDropdown === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => hasChildren && handleMouseEnter(item.id)}
                onMouseLeave={() => hasChildren && handleMouseLeave()}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.id)}
                    className={`px-3.5 py-2 rounded-lg flex items-center gap-1 transition-colors select-none ${
                      isOpen
                        ? 'text-brand-navy-900 bg-slate-100 font-semibold'
                        : 'text-slate-700 hover:text-brand-navy-900 hover:bg-slate-100'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-navy-900' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3.5 py-2 rounded-lg text-slate-700 hover:text-brand-navy-900 hover:bg-slate-100 flex items-center gap-1 transition-colors"
                  >
                    <span>{item.title}</span>
                  </Link>
                )}

                {/* Dropdown Menu พร้อม Invisible Bridge ป้องกันเมาส์หลุดช่องว่าง */}
                {hasChildren && isOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 relative before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                      {item.children!.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          onClick={() => {
                            setActiveDropdown(null);
                            setIsClickLocked(false);
                          }}
                          className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-brand-navy-50 hover:text-brand-navy-900 transition-colors"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="เปิดเมนูนำทาง"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto w-full">
          {theme.navMenuItems.map((item) => (
            <div key={item.id} className="py-1">
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-bold text-slate-900 hover:bg-slate-50 text-sm"
              >
                {item.title}
              </Link>
              {item.children && (
                <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-200 ml-3">
                  {item.children.map((ch) => (
                    <Link
                      key={ch.id}
                      href={ch.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-brand-navy-800"
                    >
                      {ch.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold text-center flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>ค้นหาข้อมูลในเว็บไซต์</span>
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-brand-navy-900 text-white text-xs font-semibold text-center flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-brand-gold-400" />
              <span>เข้าสู่ระบบผู้ดูแลโรงเรียน</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
