import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    const pages = await db.select().from(schema.pages);
    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    console.error('Error listing pages:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการดึงรายการหน้าเว็บ' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, template = 'blank' } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุชื่อหน้าเว็บ' }, { status: 400 });
    }

    if (!slug || !slug.trim()) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุรหัส URL (Slug)' }, { status: 400 });
    }

    // ทำความสะอาด slug
    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanSlug) {
      return NextResponse.json({ success: false, error: 'รหัส URL ไม่ถูกต้อง (ควรเป็นภาษาอังกฤษ ตัวเลข หรือขีดกลาง)' }, { status: 400 });
    }

    // ตรวจสอบว่า slug ซ้ำหรือไม่
    const existing = await db.select().from(schema.pages).where(eq(schema.pages.slug, cleanSlug)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: `รหัส URL '/${cleanSlug}' มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น` }, { status: 400 });
    }

    // บล็อกเริ่มต้นตาม Template ที่เลือก
    const now = new Date().toISOString();
    let initialBlocks: any[] = [];

    if (template === 'content') {
      initialBlocks = [
        {
          id: `blk-hero-${Date.now()}`,
          type: 'hero_banner',
          data: {
            badge: 'ข้อมูลสถานศึกษา',
            title: title.trim(),
            subtitle: 'ข้อมูลและสาระสำคัญของโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
            primaryButtonText: 'กลับหน้าแรก',
            primaryButtonUrl: '/',
          },
        },
        {
          id: `blk-text-${Date.now()}`,
          type: 'text_section',
          data: {
            title: 'เนื้อหาและรายละเอียด',
            content: 'เพิ่มข้อมูลและรายละเอียดเนื้อหาของหน้านี้ได้ตามต้องการผ่านระบบ Page Builder...',
            alignment: 'left',
          },
        },
        {
          id: `blk-cta-${Date.now()}`,
          type: 'cta',
          data: {
            title: 'ติดต่อสอบถามข้อมูลเพิ่มเติม',
            subtitle: 'หากมีข้อสงสัยหรือต้องการติดต่อโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
            buttonText: 'ติดต่อเรา',
            buttonUrl: '/contact',
          },
        },
      ];
    } else {
      // blank template
      initialBlocks = [
        {
          id: `blk-hero-${Date.now()}`,
          type: 'hero_banner',
          data: {
            badge: 'ยินดีต้อนรับ',
            title: title.trim(),
            subtitle: 'คำอธิบายเสริมสำหรับหน้านี้',
            primaryButtonText: 'หน้าหลัก',
            primaryButtonUrl: '/',
          },
        },
        {
          id: `blk-text-${Date.now()}`,
          type: 'text_section',
          data: {
            title: 'เนื้อหาเริ่มต้น',
            content: 'คลิกเพื่อแก้ไขและปรับแต่งเนื้อหาใน Visual Page Builder',
            alignment: 'left',
          },
        },
      ];
    }

    const pageId = `page-${cleanSlug}-${Date.now().toString(36)}`;
    await db.insert(schema.pages).values({
      id: pageId,
      slug: cleanSlug,
      title: title.trim(),
      description: `หน้าเว็บ ${title.trim()} โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)`,
      status: 'draft',
      content: JSON.stringify(initialBlocks),
      authorId: session.userId,
      createdAt: now,
      updatedAt: now,
    });

    await logAudit({
      action: 'CREATE_PAGE',
      entityType: 'page',
      entityId: pageId,
      userEmail: session.email,
      userId: session.userId,
      details: { slug: cleanSlug, title: title.trim() },
    });

    try {
      revalidatePath('/admin/pages');
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      pageId,
      slug: cleanSlug,
      message: 'สร้างหน้าเว็บใหม่สำเร็จ',
    });
  } catch (error: any) {
    console.error('Error creating page:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการสร้างหน้าเว็บ' }, { status: 500 });
  }
}
