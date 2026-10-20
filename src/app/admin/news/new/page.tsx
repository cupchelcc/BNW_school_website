import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { NewsForm } from '@/components/admin/NewsForm';

export default async function NewNewsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const canPublish = ROLE_PERMISSIONS[session.role].canPublish;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <NewsForm canPublish={canPublish} />
    </div>
  );
}
