import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const pageRows = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);

    if (pageRows.length === 0) {
      return NextResponse.json({ success: false, error: 'ไม่พบหน้าเว็บที่ต้องการ' }, { status: 404 });
    }

    const page = pageRows[0];
    return NextResponse.json({
      success: true,
      page: {
        ...page,
        content: JSON.parse(page.content || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการโหลดหน้าเว็บ' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const { blocks, status, title } = body;

    // ตรวจสอบสิทธิ์การเผยแพร่ (Author cannot publish directly)
    if (status === 'published' && !ROLE_PERMISSIONS[session.role].canPublish) {
      return NextResponse.json(
        { success: false, error: 'บทบาทของคุณ (Author) ไม่มีสิทธิ์ในการเผยแพร่หน้าเว็บโดยตรง กรุณาบันทึกเป็นแบบร่าง (Draft)' },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();
    const contentString = JSON.stringify(blocks || []);

    const existing = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1);

    if (existing.length === 0) {
      // สร้างหน้าใหม่
      const pageId = `page-${slug}-${Date.now().toString(36)}`;
      await db.insert(schema.pages).values({
        id: pageId,
        slug: slug,
        title: title || slug,
        status: status || 'draft',
        content: contentString,
        authorId: session.userId,
        publishedAt: status === 'published' ? now : null,
        createdAt: now,
        updatedAt: now,
      });

      await logAudit({
        action: 'CREATE_PAGE',
        entityType: 'page',
        entityId: pageId,
        userEmail: session.email,
        userId: session.userId,
        details: { slug, status, blockCount: blocks?.length },
      });
    } else {
      // แก้ไขหน้าเดิม
      await db
        .update(schema.pages)
        .set({
          content: contentString,
          status: status || existing[0].status,
          title: title || existing[0].title,
          updatedAt: now,
          publishedAt: status === 'published' ? now : existing[0].publishedAt,
        })
        .where(eq(schema.pages.slug, slug));

      await logAudit({
        action: status === 'published' ? 'PUBLISH_PAGE' : 'UPDATE_PAGE_DRAFT',
        entityType: 'page',
        entityId: existing[0].id,
        userEmail: session.email,
        userId: session.userId,
        details: { slug, status, blockCount: blocks?.length },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving page:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการบันทึกหน้าเว็บ' }, { status: 500 });
  }
}
