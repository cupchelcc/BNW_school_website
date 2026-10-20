import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { uploadMediaFile } from '@/lib/storage';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบก่อนอัปโหลดไฟล์' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'ไม่พบไฟล์ที่ต้องการอัปโหลด' }, { status: 400 });
    }

    const result = await uploadMediaFile(file, session.userId, altText);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    await logAudit({
      action: 'UPLOAD_MEDIA',
      entityType: 'media',
      entityId: result.mediaId,
      userEmail: session.email,
      userId: session.userId,
      details: { fileName: file.name, fileSize: file.size, fileUrl: result.fileUrl },
    });

    return NextResponse.json({ success: true, fileUrl: result.fileUrl, mediaId: result.mediaId });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' }, { status: 500 });
  }
}
