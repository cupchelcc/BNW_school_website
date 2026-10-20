import fs from 'fs/promises';
import path from 'path';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export async function uploadMediaFile(
  file: File,
  uploadedByUserId?: string,
  altText?: string
): Promise<{ success: boolean; fileUrl?: string; error?: string; mediaId?: string }> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'ขนาดไฟล์เกินกำหนด (จำกัดไม่เกิน 10MB)' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: 'ประเภทไฟล์ไม่รองรับ (อนุญาตเฉพาะรูปภาพและเอกสาร PDF/Word/Excel)' };
    }

    const timestamp = Date.now();
    const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(cleanOriginalName) || '';
    const safeFileName = `${timestamp}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, safeFileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;
    const mediaId = `med-${timestamp}-${Math.random().toString(36).substring(2, 6)}`;

    await db.insert(schema.mediaFiles).values({
      id: mediaId,
      fileName: safeFileName,
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      url: publicUrl,
      altText: altText || file.name,
      uploadedBy: uploadedByUserId || null,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      fileUrl: publicUrl,
      mediaId: mediaId,
    };
  } catch (error) {
    console.error('File upload failed:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกไฟล์' };
  }
}

export async function deleteMediaFile(mediaId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await db.select().from(schema.mediaFiles).where(eq(schema.mediaFiles.id, mediaId)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: 'ไม่พบไฟล์ในระบบ' };
    }

    const media = existing[0];
    const filePath = path.join(process.cwd(), 'public', 'uploads', media.fileName);

    try {
      await fs.unlink(filePath);
    } catch {
      // If file is already gone from disk, proceed to remove DB record
    }

    await db.delete(schema.mediaFiles).where(eq(schema.mediaFiles.id, mediaId));
    return { success: true };
  } catch (error) {
    console.error('File delete failed:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบไฟล์' };
  }
}
