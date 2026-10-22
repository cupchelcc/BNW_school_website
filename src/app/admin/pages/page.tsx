import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { PagesManager } from '@/components/admin/PagesManager';

export const dynamic = 'force-dynamic';

export default async function AdminPagesIndexPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const pageList = await db.select().from(schema.pages);
  const canManage = ROLE_PERMISSIONS[session.role].canPublish;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <PagesManager initialPages={pageList} canManage={canManage} />
    </div>
  );
}
