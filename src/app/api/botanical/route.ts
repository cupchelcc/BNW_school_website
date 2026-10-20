import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { getCurrentSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    const list = await db.select().from(schema.botanicalPlants);
    return NextResponse.json({ success: true, plants: list });
  } catch {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const body = await req.json();
    const { thaiName, commonName, scientificName, family, characteristics, locationInSchool, educationalValue, imageUrl } = body;

    if (!thaiName || !scientificName || !family) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกชื่อไทย ชื่อวิทยาศาสตร์ และวงศ์พืช' }, { status: 400 });
    }

    const plantId = `plant-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    await db.insert(schema.botanicalPlants).values({
      id: plantId,
      thaiName,
      commonName: commonName || null,
      scientificName,
      family,
      characteristics: characteristics || '',
      locationInSchool: locationInSchool || 'บริเวณโรงเรียน',
      educationalValue: educationalValue || null,
      imageUrl: imageUrl || null,
      verificationStatus: 'verified',
      createdAt: now,
      updatedAt: now,
    });

    await logAudit({
      action: 'ADD_BOTANICAL_PLANT',
      entityType: 'botanical',
      entityId: plantId,
      userEmail: session.email,
      userId: session.userId,
      details: { thaiName, scientificName },
    });

    return NextResponse.json({ success: true, plantId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการบันทึกพรรณไม้' }, { status: 500 });
  }
}
