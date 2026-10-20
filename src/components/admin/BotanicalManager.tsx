'use client';

import React, { useState } from 'react';
import { TreePine, Plus, Trash2, CheckCircle, Search } from 'lucide-react';

interface PlantItem {
  id: string;
  thaiName: string;
  commonName?: string | null;
  scientificName: string;
  family: string;
  characteristics: string;
  locationInSchool: string;
  educationalValue?: string | null;
  imageUrl?: string | null;
}

export const BotanicalManager: React.FC<{ initialList: PlantItem[]; canManage: boolean }> = ({
  initialList,
  canManage,
}) => {
  const [list, setList] = useState<PlantItem[]>(initialList);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [thaiName, setThaiName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [family, setFamily] = useState('');
  const [commonName, setCommonName] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [locationInSchool, setLocationInSchool] = useState('');
  const [educationalValue, setEducationalValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = list.filter(
    (p) =>
      p.thaiName.includes(search) ||
      p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      p.family.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/botanical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thaiName,
          scientificName,
          family,
          commonName,
          characteristics,
          locationInSchool,
          educationalValue,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const newItem: PlantItem = {
          id: data.plantId,
          thaiName,
          scientificName,
          family,
          commonName,
          characteristics,
          locationInSchool,
          educationalValue,
          imageUrl,
        };
        setList([newItem, ...list]);
        setShowModal(false);
        setThaiName('');
        setScientificName('');
        setFamily('');
        setCharacteristics('');
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
    if (!confirm('ยืนยันลบข้อมูลพรรณไม้นี้หรือไม่?')) return;
    try {
      const res = await fetch(`/api/botanical/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(list.filter((p) => p.id !== id));
      } else {
        alert('ไม่สามารถลบได้');
      }
    } catch {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Botanical Garden</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">สวนพฤกษศาสตร์โรงเรียน</h1>
          <p className="text-xs text-slate-500 mt-1">
            ฐานข้อมูลทะเบียนพรรณไม้ ชื่อวิทยาศาสตร์ วงศ์พืช ลักษณะเด่น และพิกัดตำแหน่งในโรงเรียน
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-brand-gold-400" />
            <span>+ เพิ่มพรรณไม้ใหม่</span>
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="ค้นหาชื่อไทย, ชื่อวิทยาศาสตร์, วงศ์พืช..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-bold text-slate-900">เพิ่มข้อมูลพรรณไม้สวนพฤกษศาสตร์</h2>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อภาษาไทย *</label>
                  <input
                    type="text"
                    required
                    value={thaiName}
                    onChange={(e) => setThaiName(e.target.value)}
                    placeholder="เช่น ราชพฤกษ์"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อสามัญ (Common Name)</label>
                  <input
                    type="text"
                    value={commonName}
                    onChange={(e) => setCommonName(e.target.value)}
                    placeholder="เช่น Golden Shower"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อวิทยาศาสตร์ (Scientific Name) *</label>
                  <input
                    type="text"
                    required
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    placeholder="เช่น Cassia fistula L."
                    className="w-full p-2.5 border border-slate-300 rounded-xl italic font-serif"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">วงศ์ (Family) *</label>
                  <input
                    type="text"
                    required
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    placeholder="เช่น Fabaceae"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ตำแหน่งที่พบในโรงเรียน</label>
                <input
                  type="text"
                  value={locationInSchool}
                  onChange={(e) => setLocationInSchool(e.target.value)}
                  placeholder="เช่น สวนหย่อมหน้าเสาธง, ข้างสนามกีฬา"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ลักษณะเด่นทางพฤกษศาสตร์</label>
                <textarea
                  rows={3}
                  value={characteristics}
                  onChange={(e) => setCharacteristics(e.target.value)}
                  placeholder="ไม้ยืนต้น ลำต้น ดอก ใบ ผล..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ประโยชน์และคุณค่าเพื่อการเรียนรู้</label>
                <textarea
                  rows={2}
                  value={educationalValue}
                  onChange={(e) => setEducationalValue(e.target.value)}
                  placeholder="สรรพคุณทางยา ประโยชน์การใช้สอย..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-brand-navy-900 text-white font-semibold hover:bg-brand-navy-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกพรรณไม้'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plants Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((plant) => (
          <div key={plant.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {plant.family}
                </span>
                {canManage && (
                  <button
                    onClick={() => handleDelete(plant.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{plant.thaiName}</h3>
              <p className="text-xs italic text-slate-500 font-serif mb-2">{plant.scientificName}</p>
              <p className="text-xs text-slate-600 line-clamp-3">{plant.characteristics}</p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500">
              📍 ตำแหน่ง: {plant.locationInSchool}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
