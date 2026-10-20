import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { MediaLibraryManager } from '@/components/admin/MediaLibraryManager';

export default async function AdminMediaPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const files = await db.select().from(schema.mediaFiles);
  const canDelete = ROLE_PERMISSIONS[session.role].canDeleteAny || session.role === 'editor';

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <MediaLibraryManager initialFiles={files} canDelete={canDelete} />
    </div>
  );
}
