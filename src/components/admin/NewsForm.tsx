'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface NewsFormProps {
  canPublish: boolean;
}

export const NewsForm: React.FC<NewsFormProps> = ({ canPublish }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'general' | 'academic' | 'activity' | 'award'>('general');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !content.trim()) {
      setError('กรุณากรอกหัวข้อข่าวและเนื้อหา');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          coverImageUrl,
          status: publish ? 'published' : 'draft',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/news');
        router.refresh();
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการบันทึกข่าว');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/news" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">สร้างข่าวประชาสัมพันธ์ใหม่</h1>
            <p className="text-xs text-slate-500">กรอกข้อมูลและบันทึกเป็นแบบร่างหรือเผยแพร่</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit(false)}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกแบบร่าง (Draft)</span>
          </button>

          {canPublish && (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Globe className="w-4 h-4 text-brand-gold-400" />
              <span>เผยแพร่ทันที (Publish)</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อข่าวประชาสัมพันธ์ *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น กิจกรรมวันสำคัญ หรือผลงานนักเรียน..."
            className="w-full p-3 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-navy-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่ข่าว</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
            >
              <option value="general">ข่าวทั่วไป</option>
              <option value="activity">กิจกรรมโรงเรียน</option>
              <option value="academic">วิชาการและการเรียนรู้</option>
              <option value="award">ผลงานและความสำเร็จ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL รูปภาพหน้าปก (Cover Image)</label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="คัดลอก URL จากคลังสื่อ เช่น /uploads/... หรือ https://..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">สรุปย่อข่าว (Summary)</label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="สรุปสั้น ๆ สำหรับแสดงบนการ์ดข่าวหน้าแรก..."
            className="w-full p-3 border border-slate-300 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">เนื้อหาข่าวฉบับเต็ม *</label>
          <textarea
            rows={10}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="เขียนรายละเอียดเนื้อหาข่าวที่นี่..."
            className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
