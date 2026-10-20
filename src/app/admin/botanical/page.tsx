import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession, ROLE_PERMISSIONS } from '@/lib/auth';
import { db, schema } from '@/db';
import { BotanicalManager } from '@/components/admin/BotanicalManager';

export default async function AdminBotanicalPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login');

  const plants = await db.select().from(schema.botanicalPlants);
  const canManage = session.role !== 'author';

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <BotanicalManager initialList={plants} canManage={canManage} />
    </div>
  );
}
