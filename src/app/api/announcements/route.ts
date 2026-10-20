import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    const list = await db.select().from(schema.announcements);
    return NextResponse.json({ success: true, announcements: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการโหลดประกาศ' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, type, isPinned, status } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกหัวข้อและเนื้อหาประกาศ' }, { status: 400 });
    }

    const timestamp = Date.now();
    const slug = `ann-${timestamp.toString(36)}`;
    const now = new Date().toISOString();

    await db.insert(schema.announcements).values({
      id: slug,
      slug: slug,
      title: title,
      content: content,
      type: type || 'general',
      isPinned: Boolean(isPinned),
      status: status || 'published',
      authorId: session.userId,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await logAudit({
      action: 'CREATE_ANNOUNCEMENT',
      entityType: 'announcement',
      entityId: slug,
      userEmail: session.email,
      userId: session.userId,
      details: { title, isPinned },
    });

    return NextResponse.json({ success: true, id: slug });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการสร้างประกาศ' }, { status: 500 });
  }
}
