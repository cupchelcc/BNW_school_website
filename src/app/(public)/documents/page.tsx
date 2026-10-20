import React from 'react';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { db, schema } from '@/db';
import { FileText, Download, Folder } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export const revalidate = 60;

export default async function PublicDocumentsPage() {
  let documentsList: (typeof schema.documents.$inferSelect)[] = [];
  try {
    documentsList = await db.select().from(schema.documents);
  } catch (err) {
    console.warn('[Documents Page] Failed to query documents:', err);
  }

  const studentDocs = documentsList.filter((d) => d.category === 'student');
  const generalDocs = documentsList.filter((d) => d.category !== 'student');

  return (
    <div>
      <Breadcrumbs items={[{ label: 'เอกสารดาวน์โหลด' }]} />

      <section className="bg-brand-navy-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider block mb-2">
            Downloads & Forms
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ศูนย์เอกสารและแบบฟอร์มดาวน์โหลด
          </h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl mx-auto">
            แบบฟอร์มคำร้อง คู่มือนักเรียน เอกสารราชการ และใบสมัครทางการศึกษา
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Student Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-brand-navy-900 font-bold text-lg">
            <Folder className="w-5 h-5 text-brand-gold-500" />
            <h2>แบบฟอร์มสำหรับนักเรียนและผู้ปกครอง</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {studentDocs.map((doc) => (
              <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.description}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      รูปแบบ: {doc.fileType} • ขนาด: {doc.fileSize} • ดาวน์โหลด: {doc.downloadCount} ครั้ง
                    </span>
                  </div>
                </div>

                <a
                  href={doc.fileUrl}
                  download
                  className="px-4 py-2 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* General Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-brand-navy-900 font-bold text-lg">
            <Folder className="w-5 h-5 text-brand-navy-700" />
            <h2>คู่มือและเอกสารทั่วไป</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {generalDocs.map((doc) => (
              <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.description}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      รูปแบบ: {doc.fileType} • ขนาด: {doc.fileSize}
                    </span>
                  </div>
                </div>

                <a
                  href={doc.fileUrl}
                  download
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
