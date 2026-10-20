import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = body.email || body.username || body.identifier;
    const { password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกชื่อผู้ใช้หรืออีเมลและรหัสผ่าน' }, { status: 400 });
    }

    const result = await loginUser(identifier, password);

    if (!result.success || !result.user) {
      await logAudit({
        action: 'LOGIN_FAILED',
        entityType: 'user',
        details: { attempt: identifier },
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      });
      return NextResponse.json({ success: false, error: result.error || 'การเข้าสู่ระบบไม่ถูกต้อง' }, { status: 401 });
    }

    await logAudit({
      action: 'LOGIN_SUCCESS',
      entityType: 'user',
      entityId: result.user.userId,
      userEmail: result.user.email,
      userId: result.user.userId,
      details: { role: result.user.role },
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({ success: true, user: result.user });
  } catch (error: any) {
    console.error('API Login Error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 });
  }
}
