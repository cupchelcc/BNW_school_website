import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { db, schema } from '@/db';
import { Activity, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function AdminAuditLogsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const logs = await db.select().from(schema.auditLogs).limit(50);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security & Audit</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">บันทึกกิจกรรมในระบบ (Audit Trail)</h1>
            <p className="text-xs text-slate-500 mt-1">
              บันทึกทุกการเข้าสู่ระบบ การสร้าง แก้ไข ลบ และเผยแพร่เนื้อหา เพื่อความโปร่งใสและปลอดภัย
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm">รายการบันทึกล่าสุด (50 รายการ)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">วัน-เวลา</th>
                <th className="py-3 px-4 font-bold">การกระทำ (Action)</th>
                <th className="py-3 px-4 font-bold">ประเภทเป้าหมาย</th>
                <th className="py-3 px-4 font-bold">ผู้ดำเนินการ</th>
                <th className="py-3 px-4 font-bold">IP Address</th>
                <th className="py-3 px-4 font-bold">รายละเอียด (Details)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{formatThaiDate(log.createdAt)}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{log.userEmail || '-'}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.ipAddress || 'internal'}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
