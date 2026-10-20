import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { AnnouncementsManager } from '@/components/admin/AnnouncementsManager';

export default async function AdminAnnouncementsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const list = await db.select().from(schema.announcements);
  const canCreate = ROLE_PERMISSIONS[session.role].canPublish;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <AnnouncementsManager initialList={list} canCreate={canCreate} />
    </div>
  );
}
