'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, School, Eye, EyeOff } from 'lucide-react';

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      <div className="w-full max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/10 p-2 rounded-3xl flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-md overflow-hidden">
            <img src="/images/logo.png" alt="โลโก้โรงเรียน" className="w-full h-full object-contain drop-shadow" />
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
                  placeholder="กรอกชื่อผู้ใช้ เช่น admin หรืออีเมล"
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
                  placeholder="กรอกรหัสผ่านผู้ดูแล"
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
