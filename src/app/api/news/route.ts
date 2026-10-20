import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    const list = await db.select().from(schema.news);
    return NextResponse.json({ success: true, news: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการโหลดข่าว' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const body = await req.json();
    const { title, summary, content, category, coverImageUrl, status } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกหัวข้อและเนื้อหาข่าว' }, { status: 400 });
    }

    // Role check: Author can only create as 'draft'
    let finalStatus = status || 'draft';
    if (finalStatus === 'published' && !ROLE_PERMISSIONS[session.role].canPublish) {
      finalStatus = 'draft';
    }

    const timestamp = Date.now();
    const slug = `${title.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '-').substring(0, 40)}-${timestamp.toString(36)}`;
    const newsId = `news-${timestamp.toString(36)}`;
    const now = new Date().toISOString();

    await db.insert(schema.news).values({
      id: newsId,
      slug: slug,
      title: title,
      summary: summary || null,
      content: content,
      category: category || 'general',
      coverImageUrl: coverImageUrl || null,
      status: finalStatus,
      authorId: session.userId,
      publishedAt: finalStatus === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    await logAudit({
      action: finalStatus === 'published' ? 'PUBLISH_NEWS' : 'CREATE_NEWS_DRAFT',
      entityType: 'news',
      entityId: newsId,
      userEmail: session.email,
      userId: session.userId,
      details: { title, status: finalStatus, category },
    });

    return NextResponse.json({ success: true, newsId, slug });
  } catch (error: any) {
    console.error('Create news error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการสร้างข่าว' }, { status: 500 });
  }
}
