import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  editSlug?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="bg-white/60 backdrop-blur-xl border-b border-white/60 shadow-2xs py-2.5 px-4 sm:px-6 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto min-w-0 flex-1">
          <Link href="/" className="hover:text-brand-navy-900 flex items-center gap-1 shrink-0 font-medium transition-colors">
            <Home className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>หน้าแรก</span>
          </Link>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {isLast || !item.href ? (
                  <span className="font-semibold text-slate-900 truncate">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-brand-navy-900 truncate shrink-0 transition-colors">
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
