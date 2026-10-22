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
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold text-xs shadow-xl border border-brand-gold-500/40 hover:border-brand-gold-400 transition-all hover:scale-105 active:scale-95"
        title={`แก้ไขหน้า ${pageTitle || slug} ในระบบ Visual Page Builder`}
      >
        <span className="p-1 rounded-full bg-brand-gold-500 text-brand-navy-950">
          <Edit3 className="w-3.5 h-3.5" />
        </span>
        <span className="text-white font-semibold">
          แก้ไขหน้านี้ <span className="text-brand-gold-400 font-bold">(Page Builder)</span>
        </span>
      </Link>
    </div>
  );
};
