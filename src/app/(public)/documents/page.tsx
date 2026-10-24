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

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-white py-14 sm:py-16 px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
            <div className="p-1.5 rounded-lg bg-brand-gold-100/80 text-brand-navy-900">
              <Folder className="w-5 h-5 text-brand-gold-600" />
            </div>
            <h2>แบบฟอร์มสำหรับนักเรียนและผู้ปกครอง</h2>
          </div>

          <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-white/80 divide-y divide-slate-100/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {studentDocs.map((doc) => (
              <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-white/90 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-brand-navy-50/80 border border-brand-navy-100 text-brand-navy-800 rounded-xl shrink-0 mt-0.5">
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
                  className="px-4 py-2 rounded-xl bg-brand-navy-900/90 hover:bg-brand-navy-800 text-brand-gold-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm border border-brand-navy-700/60 shrink-0"
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
            <div className="p-1.5 rounded-lg bg-brand-navy-100/80 text-brand-navy-900">
              <Folder className="w-5 h-5 text-brand-navy-800" />
            </div>
            <h2>คู่มือและเอกสารทั่วไป</h2>
          </div>

          <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-white/80 divide-y divide-slate-100/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {generalDocs.map((doc) => (
              <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-white/90 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-100/80 text-slate-700 rounded-xl shrink-0 mt-0.5 border border-slate-200/60">
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
                  className="px-4 py-2 rounded-xl bg-white/90 hover:bg-brand-navy-800 hover:text-white border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
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
