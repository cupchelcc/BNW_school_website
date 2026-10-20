import fs from 'fs/promises';
import path from 'path';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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

// Cloudflare R2 Client configuration (if environment variables are present)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'bnw-media';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxxx.r2.dev or custom domain

const isR2Configured = Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);

function getR2Client(): S3Client | null {
  if (!isR2Configured) return null;
  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

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
    const mediaId = `med-${timestamp}-${Math.random().toString(36).substring(2, 6)}`;

    let publicUrl = '';
    const buffer = Buffer.from(await file.arrayBuffer());
    const r2 = getR2Client();

    if (r2) {
      // Upload directly to Cloudflare R2
      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: safeFileName,
          Body: buffer,
          ContentType: file.type,
        })
      );
      publicUrl = R2_PUBLIC_URL
        ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${safeFileName}`
        : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${safeFileName}`;
    } else {
      // Local fallback for offline/development mode
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, safeFileName);
      await fs.writeFile(filePath, buffer);
      publicUrl = `/uploads/${safeFileName}`;
    }

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
    const r2 = getR2Client();

    if (r2) {
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: media.fileName,
          })
        );
      } catch (r2Error) {
        console.warn('Failed to delete from Cloudflare R2:', r2Error);
      }
    } else {
      const filePath = path.join(process.cwd(), 'public', 'uploads', media.fileName);
      try {
        await fs.unlink(filePath);
      } catch {
        // If file is already gone from disk, proceed to remove DB record
      }
    }

    await db.delete(schema.mediaFiles).where(eq(schema.mediaFiles.id, mediaId));
    return { success: true };
  } catch (error) {
    console.error('File delete failed:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบไฟล์' };
  }
}
