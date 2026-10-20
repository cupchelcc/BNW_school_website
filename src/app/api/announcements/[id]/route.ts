import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getCurrentSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    if (session.role === 'author') {
      return NextResponse.json({ success: false, error: 'ผู้เขียนไม่มีสิทธิ์ลบประกาศ' }, { status: 403 });
    }

    const { id } = await params;
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));

    await logAudit({
      action: 'DELETE_ANNOUNCEMENT',
      entityType: 'announcement',
      entityId: id,
      userEmail: session.email,
      userId: session.userId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการลบประกาศ' }, { status: 500 });
  }
}
