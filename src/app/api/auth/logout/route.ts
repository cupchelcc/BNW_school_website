import { NextRequest, NextResponse } from 'next/server';
import { logoutUser, getCurrentSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (session) {
      await logAudit({
        action: 'LOGOUT',
        entityType: 'user',
        entityId: session.userId,
        userEmail: session.email,
        userId: session.userId,
      });
    }

    await logoutUser();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการออกจากระบบ' }, { status: 500 });
  }
}
