'use client';

import React, { useState } from 'react';
import { Palette, CheckCircle, AlertCircle, Save, School, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  href: string;
  order: number;
}

interface ThemeProps {
  initialTheme: {
    siteName: string;
    siteDescription: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    footerCopyright: string;
    contactPhone: string;
    contactEmail: string;
    contactAddress: string;
    facebookUrl: string;
    lineUrl?: string;
    youtubeUrl?: string;
    navMenuItems: NavItem[];
  };
}

export const ThemeCustomizerEditor: React.FC<ThemeProps> = ({ initialTheme }) => {
  const [formData, setFormData] = useState(initialTheme);
  const [navItems, setNavItems] = useState<NavItem[]>(initialTheme.navMenuItems || []);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNavItemChange = (index: number, field: string, val: string) => {
    const updated = [...navItems];
    updated[index] = { ...updated[index], [field]: val };
    setNavItems(updated);
  };

  const addNavItem = () => {
    const newItem: NavItem = {
      id: `menu-${Date.now()}`,
      title: 'เมนูใหม่',
      href: '/#',
      order: navItems.length + 1,
    };
    setNavItems([...navItems, newItem]);
  };

  const removeNavItem = (index: number) => {
    setNavItems(navItems.filter((_, i) => i !== index));
  };

  const moveMenuUp = (index: number) => {
    if (index === 0) return;
    const updated = [...navItems];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setNavItems(updated);
  };

  const moveMenuDown = (index: number) => {
    if (index === navItems.length - 1) return;
    const updated = [...navItems];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setNavItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          navMenuItems: navItems,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'บันทึกการตั้งค่า Theme สำเร็จ และมีผลต่อหน้าเว็บทันที!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'เกิดข้อผิดพลาดในการบันทึก' });
      }
    } catch {
      setMessage({ type: 'error', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Theme Customizer (ปรับแต่งอัตลักษณ์)</h1>
            <p className="text-xs text-slate-500">ปรับแต่งสี โลโก้ ข้อความ เมนูนำทาง และข้อมูลติดต่อ</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {message && (
            <div
              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-brand-gold-400" />
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าธีม'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          ตัวอย่างการแสดงผลสี (Live Color Preview)
        </h2>
        <div
          className="rounded-xl p-6 text-white transition-colors flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          style={{ backgroundColor: formData.primaryColor }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: formData.secondaryColor, color: formData.primaryColor }}>
              <School className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">{formData.siteName}</h3>
              <p className="text-xs opacity-80">{formData.siteDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-4 py-2 rounded-lg font-bold text-xs shadow transition-transform hover:scale-105 inline-block"
              style={{ backgroundColor: formData.secondaryColor, color: formData.primaryColor }}
            >
              ปุ่มเน้นหลัก (Gold)
            </span>
            <span
              className="px-4 py-2 rounded-lg font-medium text-xs border border-white/30 text-white inline-block"
            >
              ปุ่มรอง
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Colors & Fonts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2">1. โทนสีและแบบอักษร (Design Tokens)</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">สีหลัก (Primary Navy)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">สีรอง (Secondary Gold)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">แบบอักษรหลัก (Font Family)</label>
            <input
              type="text"
              value={formData.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">ฟอนต์มาตรฐาน: IBM Plex Sans Thai</p>
          </div>
        </div>

        {/* Site Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2">2. ข้อมูลอัตลักษณ์สถานศึกษา</h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อเว็บไซต์โรงเรียน</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">คำขวัญ / ปรัชญาสถานศึกษา</label>
            <input
              type="text"
              value={formData.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL โลโก้โรงเรียน</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2">3. ข้อมูลติดต่อและลิขสิทธิ์</h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
            <input
              type="text"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">อีเมลทางการ</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ที่อยู่สถานศึกษา</label>
            <textarea
              rows={2}
              value={formData.contactAddress}
              onChange={(e) => handleChange('contactAddress', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ข้อความลิขสิทธิ์ท้ายเว็บ (Footer Copyright)</label>
            <input
              type="text"
              value={formData.footerCopyright}
              onChange={(e) => handleChange('footerCopyright', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2">4. ช่องทางสื่อสังคมออนไลน์</h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Facebook โรงเรียน</label>
            <input
              type="text"
              value={formData.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">LINE Official</label>
            <input
              type="text"
              value={formData.lineUrl || ''}
              onChange={(e) => handleChange('lineUrl', e.target.value)}
              placeholder="https://line.me/R/ti/p/@..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">YouTube Channel</label>
            <input
              type="text"
              value={formData.youtubeUrl || ''}
              onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              placeholder="https://youtube.com/@..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu Builder */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">5. จัดการเมนูนำทางหลัก (Main Navigation Menus)</h2>
            <p className="text-xs text-slate-500">กำหนดชื่อและลิงก์ของเมนูด้านบนเว็บไซต์ พร้อมสลับลำดับ</p>
          </div>
          <button
            type="button"
            onClick={addNavItem}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มเมนู</span>
          </button>
        </div>

        <div className="space-y-2">
          {navItems.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleNavItemChange(idx, 'title', e.target.value)}
                placeholder="ชื่อเมนู"
                className="flex-1 p-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => handleNavItemChange(idx, 'href', e.target.value)}
                placeholder="URL เช่น /about"
                className="w-64 p-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
              />
              <button
                type="button"
                onClick={() => moveMenuUp(idx)}
                disabled={idx === 0}
                className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-20 text-slate-500"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveMenuDown(idx)}
                disabled={idx === navItems.length - 1}
                className="p-1.5 hover:bg-slate-200 rounded disabled:opacity-20 text-slate-500"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeNavItem(idx)}
                className="p-1.5 hover:bg-red-100 text-red-500 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
