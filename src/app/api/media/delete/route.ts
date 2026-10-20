import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { deleteMediaFile } from '@/lib/storage';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    if (session.role === 'author') {
      return NextResponse.json({ success: false, error: 'ผู้เขียนเนื้อหา (Author) ไม่มีสิทธิ์ในการลบไฟล์ออกจากคลังสื่อ' }, { status: 403 });
    }

    const { mediaId } = await req.json();
    if (!mediaId) {
      return NextResponse.json({ success: false, error: 'ไม่ระบุรหัสไฟล์' }, { status: 400 });
    }

    const result = await deleteMediaFile(mediaId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    await logAudit({
      action: 'DELETE_MEDIA',
      entityType: 'media',
      entityId: mediaId,
      userEmail: session.email,
      userId: session.userId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete API error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการลบไฟล์' }, { status: 500 });
  }
}
