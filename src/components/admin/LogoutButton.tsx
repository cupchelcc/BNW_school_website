'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm('ยืนยันออกจากระบบหรือไม่?')) return;
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      window.location.href = '/admin/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-brand-navy-950 rounded-lg transition-colors"
      title="ออกจากระบบ"
      aria-label="ออกจากระบบ"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
};
