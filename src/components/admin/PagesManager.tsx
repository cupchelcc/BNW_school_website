'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCode,
  Plus,
  ExternalLink,
  Edit3,
  CheckCircle,
  Clock,
  Trash2,
  Search,
  Sparkles,
  Layout,
  Filter,
  AlertCircle,
  School,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';
import { STANDARD_PAGES, StandardPageMeta, getPagePublicUrl } from '@/lib/page-helper';

interface PageItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  content: string;
  updatedAt: string;
  createdAt: string;
}

interface PagesManagerProps {
  initialPages: PageItem[];
  canManage: boolean;
}

export const PagesManager: React.FC<PagesManagerProps> = ({ initialPages, canManage }) => {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTemplate, setNewTemplate] = useState('content');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // รวมรายการหน้ามาตรฐานกับหน้าที่ดึงมาจาก DB
  const mergedPages = STANDARD_PAGES.map((std) => {
    const existing = pages.find((p) => p.slug === std.slug);
    if (existing) {
      return {
        ...existing,
        category: std.category,
        publicUrl: std.publicUrl,
        isStandard: true,
        desc: std.description,
      };
    }
    return {
      id: `std-${std.slug}`,
      slug: std.slug,
      title: std.title,
      description: std.description,
      status: 'published',
      content: '[]',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      category: std.category,
      publicUrl: std.publicUrl,
      isStandard: true,
      desc: std.description,
      isVirtual: true,
    };
  });

  // เพิ่ม Custom Pages ที่ผู้ใช้สร้างขึ้นเอง (ที่ไม่อยู่ใน STANDARD_PAGES)
  const customPages = pages
    .filter((p) => !STANDARD_PAGES.some((std) => std.slug === p.slug))
    .map((p) => ({
      ...p,
      category: 'custom' as const,
      publicUrl: `/p/${p.slug}`,
      isStandard: false,
      desc: p.description || 'หน้าเว็บที่สร้างเพิ่มเติม',
      isVirtual: false,
    }));

  const allDisplayPages = [...mergedPages, ...customPages];

  // คัดกรองตามค้นหาและหมวดหมู่
  const filteredPages = allDisplayPages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (page.desc && page.desc.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'main') return page.category === 'main';
    if (selectedCategory === 'about') return page.category === 'about';
    if (selectedCategory === 'academic') return page.category === 'academic';
    if (selectedCategory === 'service') return page.category === 'service';
    if (selectedCategory === 'custom') return page.category === 'custom';
    return true;
  });

  // สร้างหน้าใหม่
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) {
      setErrorMessage('กรุณากรอกชื่อหน้าเว็บและรหัส URL (Slug)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug: newSlug.trim(),
          template: newTemplate,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ไม่สามารถสร้างหน้าเว็บได้');
      }

      setIsModalOpen(false);
      setNewTitle('');
      setNewSlug('');
      router.push(`/admin/pages/${data.slug}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการสร้างหน้าเว็บ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ลบหน้า Custom
  const handleDeletePage = async (slug: string, title: string) => {
    if (!confirm(`ยืนยันที่จะลบหน้าเว็บ "${title}" (/${slug}) หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      return;
    }

    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'ไม่สามารถลบหน้าเว็บได้');
        return;
      }

      setPages((prev) => prev.filter((p) => p.slug !== slug));
      router.refresh();
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการลบหน้าเว็บ: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            Visual Page Builder CMS
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการหน้าเว็บและโครงสร้างเนื้อหา</h1>
          <p className="text-xs text-slate-500 mt-1">
            ปรับแต่ง เพิ่ม ลบ และจัดวางบล็อกเนื้อหาในทุกหน้าเว็บของโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setErrorMessage(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างหน้าเว็บใหม่</span>
            </button>
            <Link
              href="/admin/pages/home"
              className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-brand-gold-400" />
              <span>แก้ไขหน้าแรก (Home)</span>
            </Link>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตามชื่อหน้าเว็บ หรือรหัส URL (เช่น about, academic, history)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-medium">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-brand-navy-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด ({allDisplayPages.length})
          </button>
          <button
            onClick={() => setSelectedCategory('about')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'about'
                ? 'bg-brand-navy-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ข้อมูลโรงเรียน (4)
          </button>
          <button
            onClick={() => setSelectedCategory('academic')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'academic'
                ? 'bg-brand-navy-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            วิชาการ (2)
          </button>
          <button
            onClick={() => setSelectedCategory('service')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'service'
                ? 'bg-brand-navy-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            บริการ/นโยบาย (2)
          </button>
          {customPages.length > 0 && (
            <button
              onClick={() => setSelectedCategory('custom')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === 'custom'
                  ? 'bg-brand-navy-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              หน้าสร้างเอง ({customPages.length})
            </button>
          )}
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">
            รายการหน้าเว็บ ({filteredPages.length} หน้า)
          </h2>
          <span className="text-[11px] text-slate-400">
            คลิก "เปิด Visual Builder" เพื่อปรับแต่งบล็อกข้อความ รูปภาพ และส่วนประกอบต่าง ๆ
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredPages.map((p: any) => {
            const blocks = JSON.parse(p.content || '[]');
            return (
              <div
                key={p.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      p.slug === 'home'
                        ? 'bg-brand-gold-100 text-brand-navy-950 font-bold'
                        : p.isStandard
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    <FileCode className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{p.title}</h3>

                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        /{p.slug}
                      </span>

                      {p.isStandard && (
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          หน้าหลักระบบ
                        </span>
                      )}

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'published' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{p.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.desc}</p>

                    <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-3">
                      <span>
                        บล็อกในหน้า: <strong className="text-slate-700 font-semibold">{blocks.length || 2} บล็อก</strong>
                      </span>
                      <span>•</span>
                      <span>อัปเดตล่าสุด: {formatThaiDate(p.updatedAt)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/admin/pages/${p.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand-gold-400" />
                    <span>เปิด Visual Builder</span>
                  </Link>

                  <a
                    href={p.publicUrl || getPagePublicUrl(p.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="เปิดดูหน้าเว็บจริงในแท็บใหม่"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {!p.isStandard && canManage && (
                    <button
                      onClick={() => handleDeletePage(p.slug, p.title)}
                      className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="ลบหน้าเว็บนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredPages.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <p className="text-sm font-semibold">ไม่พบหน้าเว็บที่ตรงกับเงื่อนไขการค้นหา</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs text-sky-600 hover:underline"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal สร้างหน้าใหม่ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Plus className="w-5 h-5 text-brand-gold-500" />
                <span>สร้างหน้าเว็บใหม่ (Custom Page)</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreatePage} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อหน้าเว็บ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ศูนย์แนะแนวการศึกษา, โครงการพิเศษ ฯลฯ"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      // auto generate slug suggestion
                      const suggested = e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]/g, '-');
                      if (suggested) setNewSlug(suggested);
                    }
                  }}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รหัส URL (Slug) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                    /p/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="guidance-center"
                    value={newSlug}
                    onChange={(e) =>
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-r-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-navy-800"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  ใช้ภาษาอังกฤษ ตัวพิมพ์เล็ก และขีดกลาง (-) เช่น guidance, student-council
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เทมเพลตเริ่มต้น</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                      newTemplate === 'content'
                        ? 'border-brand-navy-900 bg-brand-navy-50/50 text-brand-navy-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value="content"
                      checked={newTemplate === 'content'}
                      onChange={() => setNewTemplate('content')}
                      className="sr-only"
                    />
                    <span>📄 หน้าเนื้อหาทั่วไป</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      แบนเนอร์หัวเรื่อง + กล่องเนื้อหา + กล่องติดต่อ
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                      newTemplate === 'blank'
                        ? 'border-brand-navy-900 bg-brand-navy-50/50 text-brand-navy-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value="blank"
                      checked={newTemplate === 'blank'}
                      onChange={() => setNewTemplate('blank')}
                      className="sr-only"
                    />
                    <span>✨ หน้าเปล่าเริ่มต้น</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      แบนเนอร์เริ่มต้น พร้อมเริ่มเพิ่มบล็อกเอง
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-brand-navy-900 hover:bg-brand-navy-800 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'กำลังสร้าง...' : 'สร้างหน้าและเปิด Visual Builder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
