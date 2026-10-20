import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { Shield, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

export default async function AdminUsersPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const usersList = await db.select().from(schema.users);
  const isSuperAdmin = session.role === 'super_admin';

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Role-Based Access Control</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">ผู้ใช้งานและระดับสิทธิ์ (RBAC)</h1>
            <p className="text-xs text-slate-500 mt-1">
              จัดการบทบาทผู้ดูแลระบบ 4 ระดับ: ผู้ดูแลระบบสูงสุด, ผู้ดูแลเว็บไซต์, บรรณาธิการ, ผู้เขียนเนื้อหา
            </p>
          </div>
        </div>
      </div>

      {/* Roles Explanations */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-red-700 block mb-1">1. Super Admin</span>
          <p className="text-slate-600">มีสิทธิ์สูงสุด จัดการผู้ใช้ ตั้งค่าระบบ ปรับแต่งธีม สำรองข้อมูล และเผยแพร่เนื้อหาได้ทั้งหมด</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-blue-700 block mb-1">2. Site Admin</span>
          <p className="text-slate-600">จัดการเนื้อหาทั้งหมดในระบบ ใช้งาน Visual Page Builder ปรับแต่งเมนู และเผยแพร่หน้าเว็บ</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-emerald-700 block mb-1">3. Editor</span>
          <p className="text-slate-600">ตรวจทานข่าวสาร ประกาศ กิจกรรม และอนุมัติการเผยแพร่เนื้อหาของโรงเรียน</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-amber-700 block mb-1">4. Author</span>
          <p className="text-slate-600">สร้างและแก้ไขเนื้อหาของตนเองได้ บันทึกเป็นแบบร่าง (Draft) แต่ไม่สามารถกด Publish ตรงได้</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">รายชื่อผู้ดูแลระบบ ({usersList.length} บัญชี)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4 font-bold">อีเมลเข้าสู่ระบบ</th>
                <th className="py-3 px-4 font-bold">บทบาท (Role)</th>
                <th className="py-3 px-4 font-bold">สถานะบัญชี</th>
                <th className="py-3 px-4 font-bold">วันที่สร้าง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === 'super_admin'
                          ? 'bg-red-100 text-red-800'
                          : u.role === 'site_admin'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'editor'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ใช้งานปกติ</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{formatThaiDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
