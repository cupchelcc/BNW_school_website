import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { FileText, Download } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function AdminDocumentsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const docs = await db.select().from(schema.documents);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Official Forms & Documents</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">จัดการเอกสารดาวน์โหลด</h1>
          <p className="text-xs text-slate-500 mt-1">แบบฟอร์มคำร้อง คู่มือนักเรียน และเอกสารราชการ</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {docs.map((doc) => (
          <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{doc.title}</h3>
                <p className="text-xs text-slate-500">{doc.description}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  หมวด: {doc.category} • ขนาด: {doc.fileSize} • อัปเดต: {formatThaiDate(doc.createdAt)}
                </span>
              </div>
            </div>

            <a
              href={doc.fileUrl}
              download
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
            >
              ดาวน์โหลด
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
