import React from 'react';
import Link from 'next/link';
import { School, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 text-brand-gold-500 border border-brand-gold-200 flex items-center justify-center font-extrabold text-3xl shadow-inner">
          404
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">ไม่พบหน้าที่ท่านต้องการ</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            หน้าที่ท่านกำลังพยายามเข้าถึงอาจถูกย้าย ลบออกไป หรือสะกดที่อยู่ URL ไม่ถูกต้อง
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Home className="w-4 h-4 text-brand-gold-400" />
            <span>กลับสู่หน้าแรก</span>
          </Link>

          <Link
            href="/search"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>ค้นหาข้อมูล</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400">
          โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) • BNW-001 V2
        </div>
      </div>
    </div>
  );
}
