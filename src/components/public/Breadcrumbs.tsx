import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Edit3 } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  editSlug?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, editSlug }) => {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-100/80 border-b border-slate-200/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto min-w-0 flex-1">
          <Link href="/" className="hover:text-brand-navy-900 flex items-center gap-1 shrink-0">
            <Home className="w-3.5 h-3.5" />
            <span>หน้าแรก</span>
          </Link>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {isLast || !item.href ? (
                  <span className="font-semibold text-slate-800 truncate">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-brand-navy-900 truncate shrink-0">
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {editSlug && (
          <Link
            href={`/admin/pages/${editSlug}`}
            className="shrink-0 px-3 py-1 rounded-lg bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95"
            title="เปิดแก้ไขหน้านี้ในระบบ Visual Page Builder"
          >
            <Edit3 className="w-3.5 h-3.5 text-brand-gold-400" />
            <span className="hidden sm:inline">แก้ไขหน้านี้ (Page Builder)</span>
            <span className="sm:hidden">แก้ไข</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
