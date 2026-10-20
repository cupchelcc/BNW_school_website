import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    const rows = await db.select().from(schema.themeSettings).where(eq(schema.themeSettings.id, 'current')).limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'ไม่พบข้อมูลการตั้งค่าธีม' }, { status: 404 });
    }

    const theme = rows[0];
    return NextResponse.json({
      success: true,
      theme: {
        ...theme,
        navMenuItems: JSON.parse(theme.navMenuItems || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Failed to get theme:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการโหลดธีม' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    if (!ROLE_PERMISSIONS[session.role].canEditTheme) {
      return NextResponse.json({ success: false, error: 'คุณไม่มีสิทธิ์ในการแก้ไขการตั้งค่าธีมของเว็บไซต์' }, { status: 403 });
    }

    const body = await req.json();
    const {
      siteName,
      siteDescription,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      footerCopyright,
      contactPhone,
      contactEmail,
      contactAddress,
      facebookUrl,
      lineUrl,
      youtubeUrl,
      navMenuItems,
    } = body;

    const now = new Date().toISOString();

    await db
      .update(schema.themeSettings)
      .set({
        siteName: siteName || undefined,
        siteDescription: siteDescription || undefined,
        logoUrl: logoUrl || undefined,
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        accentColor: accentColor || undefined,
        fontFamily: fontFamily || undefined,
        footerCopyright: footerCopyright || undefined,
        contactPhone: contactPhone || undefined,
        contactEmail: contactEmail || undefined,
        contactAddress: contactAddress || undefined,
        facebookUrl: facebookUrl || undefined,
        lineUrl: lineUrl || undefined,
        youtubeUrl: youtubeUrl || undefined,
        navMenuItems: navMenuItems ? JSON.stringify(navMenuItems) : undefined,
        updatedAt: now,
      })
      .where(eq(schema.themeSettings.id, 'current'));

    await logAudit({
      action: 'UPDATE_THEME',
      entityType: 'theme',
      entityId: 'current',
      userEmail: session.email,
      userId: session.userId,
      details: { siteName, primaryColor, secondaryColor },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update theme:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการบันทึกธีม' }, { status: 500 });
  }
}
