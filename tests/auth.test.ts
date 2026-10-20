import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createSessionToken, verifySessionToken, ROLE_PERMISSIONS, AuthSession } from '../src/lib/auth';

describe('ระบบยืนยันตัวตนและสิทธิ์ผู้ใช้ (Authentication & RBAC)', () => {
  test('Bcrypt ควรเข้ารหัสและตรวจสอบรหัสผ่านได้อย่างถูกต้อง', async () => {
    const rawPassword = 'BnwSecurePassword2026!';
    const hash = await bcrypt.hash(rawPassword, 10);

    assert.notEqual(rawPassword, hash);
    const isValid = await bcrypt.compare(rawPassword, hash);
    assert.equal(isValid, true);

    const isInvalid = await bcrypt.compare('WrongPassword', hash);
    assert.equal(isInvalid, false);
  });

  test('JWT Session Token ควรสร้างและถอดรหัสข้อมูลได้อย่างถูกต้อง', async () => {
    const sampleSession: AuthSession = {
      userId: 'usr-test-01',
      name: 'ครูผู้ทดสอบระบบ',
      email: 'tester@bnw.ac.th',
      role: 'editor',
    };

    const token = await createSessionToken(sampleSession);
    assert.ok(token);
    assert.equal(typeof token, 'string');

    const decoded = await verifySessionToken(token);
    assert.ok(decoded);
    assert.equal(decoded?.userId, 'usr-test-01');
    assert.equal(decoded?.email, 'tester@bnw.ac.th');
    assert.equal(decoded?.role, 'editor');
  });

  test('การตรวจสอบสิทธิ์ RBAC ต้องจำกัดสิทธิ์ของแต่ละบทบาทอย่างถูกต้อง', () => {
    // Super Admin ต้องทำได้ทุกอย่าง
    assert.equal(ROLE_PERMISSIONS.super_admin.canManageUsers, true);
    assert.equal(ROLE_PERMISSIONS.super_admin.canEditTheme, true);
    assert.equal(ROLE_PERMISSIONS.super_admin.canPublish, true);
    assert.equal(ROLE_PERMISSIONS.super_admin.canBackup, true);

    // Site Admin
    assert.equal(ROLE_PERMISSIONS.site_admin.canManageUsers, false);
    assert.equal(ROLE_PERMISSIONS.site_admin.canEditTheme, true);
    assert.equal(ROLE_PERMISSIONS.site_admin.canPublish, true);

    // Editor
    assert.equal(ROLE_PERMISSIONS.editor.canManageUsers, false);
    assert.equal(ROLE_PERMISSIONS.editor.canEditTheme, false);
    assert.equal(ROLE_PERMISSIONS.editor.canPublish, true);

    // Author (ผู้เขียนเนื้อหา ห้าม Publish ตรง)
    assert.equal(ROLE_PERMISSIONS.author.canManageUsers, false);
    assert.equal(ROLE_PERMISSIONS.author.canEditTheme, false);
    assert.equal(ROLE_PERMISSIONS.author.canPublish, false);
  });
});
