import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { Newspaper, Plus, Eye, Clock, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';
import { NewsDeleteButton } from '@/components/admin/NewsDeleteButton';

export default async function AdminNewsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const newsList = await db.select().from(schema.news);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">News & Activities</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการข่าวประชาสัมพันธ์</h1>
          <p className="text-xs text-slate-500 mt-1">
            สร้าง แก้ไข เผยแพร่ และจัดหมวดหมู่ข่าวสารกิจกรรมของโรงเรียน
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 text-brand-gold-400" />
          <span>+ สร้างข่าวใหม่</span>
        </Link>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">ข่าวทั้งหมดในระบบ ({newsList.length})</h2>
        </div>

        {newsList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">ยังไม่มีข่าวในระบบ</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {newsList.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                    {item.coverImageUrl ? (
                      <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <Newspaper className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{item.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง (Draft)'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                        หมวด: {item.category}
                      </span>
                      <span>วันที่: {formatThaiDate(item.publishedAt || item.createdAt)}</span>
                      <span>ยอดเข้าชม: {item.viewCount} ครั้ง</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/news/${item.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    title="เปิดดูหน้าสาธารณะ"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {session.role !== 'author' && (
                    <NewsDeleteButton newsId={item.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
