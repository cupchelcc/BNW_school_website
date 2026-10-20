'use client';

import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, CheckCircle, AlertCircle, Pin } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

interface AnnouncementItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: string;
  isPinned: boolean;
  status: string;
  createdAt: string;
}

export const AnnouncementsManager: React.FC<{ initialList: AnnouncementItem[]; canCreate: boolean }> = ({
  initialList,
  canCreate,
}) => {
  const [list, setList] = useState<AnnouncementItem[]>(initialList);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type, isPinned }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const newItem: AnnouncementItem = {
          id: data.id,
          slug: data.id,
          title,
          content,
          type,
          isPinned,
          status: 'published',
          createdAt: new Date().toISOString(),
        };
        setList([newItem, ...list]);
        setShowModal(false);
        setTitle('');
        setContent('');
      } else {
        alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันลบประกาศนี้หรือไม่?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(list.filter((a) => a.id !== id));
      } else {
        alert('ไม่สามารถลบประกาศได้');
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Official Announcements</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการประกาศของโรงเรียน</h1>
          <p className="text-xs text-slate-500 mt-1">
            ลงประกาศด่วน ข่าวสารเร่งด่วน และประกาศจัดซื้อจัดจ้าง พร้อมระบบปักหมุด
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-brand-gold-400" />
            <span>+ สร้างประกาศใหม่</span>
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">สร้างประกาศโรงเรียน</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อประกาศ *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น ประกาศรับสมัครนักเรียน, แจ้งหยุดเรียนกรณีพิเศษ..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทประกาศ</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="general">ประกาศทั่วไป</option>
                  <option value="urgent">ประกาศด่วน / สำคัญมาก</option>
                  <option value="admission">การรับสมัครนักเรียน</option>
                  <option value="procurement">จัดซื้อจัดจ้าง / พัสดุ</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-brand-navy-900 focus:ring-brand-navy-900 w-4 h-4"
                />
                <label htmlFor="pinned" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  ปักหมุดประกาศนี้ไว้ด้านบนสุด (Pinned Announcement)
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เนื้อหาประกาศ *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="พิมพ์ข้อความประกาศที่นี่..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-brand-navy-900 text-white text-xs font-semibold hover:bg-brand-navy-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกและประกาศ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {list.map((ann) => (
          <div key={ann.id} className="p-6 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${ann.isPinned ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                {ann.isPinned ? <Pin className="w-5 h-5 fill-red-600" /> : <Megaphone className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                  {ann.isPinned && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">ปักหมุด</span>
                  )}
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    {ann.type}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                <span className="text-[11px] text-slate-400 mt-2 block">{formatThaiDate(ann.createdAt)}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(ann.id)}
              className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
              title="ลบประกาศ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
