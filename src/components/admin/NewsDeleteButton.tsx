'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export const NewsDeleteButton: React.FC<{ newsId: string }> = ({ newsId }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('ยืนยันที่จะลบข่าวนี้ออกจากระบบหรือไม่?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/news/${newsId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('ไม่สามารถลบข่าวได้');
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
      title="ลบข่าว"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};
