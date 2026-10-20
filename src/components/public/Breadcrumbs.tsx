import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-100/80 border-b border-slate-200/80 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-navy-900 flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>หน้าแรก</span>
        </Link>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-800 truncate">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-brand-navy-900 truncate">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
