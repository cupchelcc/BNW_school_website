'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, School, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'การเข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (userVal: string, passVal: string) => {
    setIdentifier(userVal);
    setPassword(passVal);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      <div className="w-full max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-brand-gold-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-gold-500/20 text-brand-navy-950">
            <School className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            ระบบบริหารจัดการเว็บไซต์และเนื้อหา (BNW-001 V2 CMS)
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <div className="mb-5 sm:mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">เข้าสู่ระบบผู้ดูแล</h2>
              <p className="text-xs text-slate-500">สำหรับครูและบุคลากรที่ได้รับอนุญาต</p>
            </div>
            <div className="p-2 bg-brand-navy-50 text-brand-navy-800 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="identifier">
                ชื่อผู้ใช้ หรือ อีเมลประจำตัว
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  placeholder="เช่น admin หรือ admin@bnw.ac.th"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy-600 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="password">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="รหัสผ่านผู้ดูแล"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-navy-600 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="แสดง/ซ่อนรหัสผ่าน"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-fill buttons for instant testing */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 mb-2.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-gold-500" />
              <span>คลิกเพื่อกรอกบัญชีทดสอบอัตโนมัติ:</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'Admin@BNW2026!')}
                className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold text-center transition-colors"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('editor', 'Editor@BNW2026!')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center transition-colors"
              >
                ✏️ Editor
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('teacher', 'Teacher@BNW2026!')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold text-center transition-colors"
              >
                📝 ครู / Author
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              รองรับทั้งการพิมพ์ <code className="text-slate-600 font-semibold">admin</code> หรือ <code className="text-slate-600 font-semibold">admin@bnw.ac.th</code>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            &larr; กลับสู่หน้าเว็บไซต์สาธารณะ
          </a>
        </div>
      </div>
    </div>
  );
}
