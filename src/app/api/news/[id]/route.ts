import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, summary, content, category, coverImageUrl, status } = body;

    const existing = await db.select().from(schema.news).where(eq(schema.news.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: 'ไม่พบข่าวที่ต้องการแก้ไข' }, { status: 404 });
    }

    // Role check: Author can only edit their own draft, and cannot publish directly
    if (session.role === 'author') {
      if (existing[0].authorId !== session.userId) {
        return NextResponse.json({ success: false, error: 'คุณไม่มีสิทธิ์แก้ไขข่าวของผู้เขียนท่านอื่น' }, { status: 403 });
      }
      if (status === 'published') {
        return NextResponse.json({ success: false, error: 'ผู้เขียนไม่มีสิทธิ์กด Publish โดยตรง' }, { status: 403 });
      }
    }

    const now = new Date().toISOString();
    await db
      .update(schema.news)
      .set({
        title: title || existing[0].title,
        summary: summary !== undefined ? summary : existing[0].summary,
        content: content || existing[0].content,
        category: category || existing[0].category,
        coverImageUrl: coverImageUrl !== undefined ? coverImageUrl : existing[0].coverImageUrl,
        status: status || existing[0].status,
        publishedAt: status === 'published' ? now : existing[0].publishedAt,
        updatedAt: now,
      })
      .where(eq(schema.news.id, id));

    await logAudit({
      action: status === 'published' ? 'PUBLISH_NEWS' : 'UPDATE_NEWS',
      entityType: 'news',
      entityId: id,
      userEmail: session.email,
      userId: session.userId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update news error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการบันทึกข่าว' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    if (session.role === 'author') {
      return NextResponse.json({ success: false, error: 'ผู้เขียนไม่มีสิทธิ์ลบข่าว' }, { status: 403 });
    }

    const { id } = await params;
    await db.delete(schema.news).where(eq(schema.news.id, id));

    await logAudit({
      action: 'DELETE_NEWS',
      entityType: 'news',
      entityId: id,
      userEmail: session.email,
      userId: session.userId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete news error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการลบข่าว' }, { status: 500 });
  }
}
