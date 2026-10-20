import { db, schema } from '@/db';

export async function logAudit(params: {
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown> | string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
}) {
  try {
    await db.insert(schema.auditLogs).values({
      userId: params.userId || null,
      userEmail: params.userEmail || null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId || null,
      details: typeof params.details === 'object' ? JSON.stringify(params.details) : params.details || null,
      ipAddress: params.ipAddress || null,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
