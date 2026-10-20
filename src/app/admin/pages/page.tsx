import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { FileCode, Plus, ExternalLink, Edit3, CheckCircle, Clock } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function AdminPagesIndexPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const pageList = await db.select().from(schema.pages);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Visual Page Builder</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการหน้าเว็บและโครงสร้างบล็อก</h1>
          <p className="text-xs text-slate-500 mt-1">
            ปรับแต่ง เพิ่ม ลบ และจัดลำดับบล็อกเนื้อหาทั้ง 15 รูปแบบในแต่ละหน้าเว็บได้อย่างอิสระ
          </p>
        </div>

        <Link
          href="/admin/pages/home"
          className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
        >
          <Edit3 className="w-4 h-4 text-brand-gold-400" />
          <span>แก้ไขหน้าแรก (Home Page)</span>
        </Link>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">รายการหน้าเว็บทั้งหมด ({pageList.length})</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {pageList.map((p) => {
            const blocks = JSON.parse(p.content || '[]');
            return (
              <div key={p.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        /{p.slug}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{p.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง (Draft)'}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      จำนวนบล็อก: <span className="font-semibold text-slate-800">{blocks.length} บล็อก</span> • อัปเดตล่าสุด: {formatThaiDate(p.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/pages/${p.slug}`}
                    className="px-4 py-2 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-brand-gold-400" />
                    <span>เปิด Visual Builder</span>
                  </Link>

                  <Link
                    href={p.slug === 'home' ? '/' : `/${p.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    title="เปิดดูหน้าสาธารณะ"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
