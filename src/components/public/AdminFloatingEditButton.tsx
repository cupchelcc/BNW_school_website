'use client';

import React from 'react';
import Link from 'next/link';
import { Edit3 } from 'lucide-react';

interface Props {
  slug: string;
  pageTitle?: string;
}

export const AdminFloatingEditButton: React.FC<Props> = ({ slug, pageTitle }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden">
      <Link
        href={`/admin/pages/${slug}`}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-brand-navy-950/85 hover:bg-brand-navy-900 text-white font-bold text-xs shadow-[0_12px_36px_rgba(11,31,60,0.35)] border border-brand-gold-400/50 hover:border-brand-gold-300 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_40px_rgba(234,179,8,0.3)] active:scale-95"
        title={`แก้ไขหน้า ${pageTitle || slug} ในระบบ Visual Page Builder`}
      >
        <span className="p-1.5 rounded-full bg-gradient-to-tr from-brand-gold-500 to-amber-300 text-brand-navy-950 shadow-xs">
          <Edit3 className="w-3.5 h-3.5" />
        </span>
        <span className="text-white font-medium">
          แก้ไขหน้านี้ <span className="text-brand-gold-400 font-bold">(Page Builder)</span>
        </span>
      </Link>
    </div>
  );
};
