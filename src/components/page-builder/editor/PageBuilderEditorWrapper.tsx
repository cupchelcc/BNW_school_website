'use client';

import React from 'react';
import { PageBuilderEditor } from './PageBuilderEditor';
import { PageBlock } from '@/types/page-builder';

interface WrapperProps {
  pageId: string;
  pageSlug: string;
  pageTitle: string;
  pagePublicUrl: string;
  initialStatus: 'draft' | 'published' | 'archived';
  initialBlocks: PageBlock[];
  canPublish: boolean;
  contextData: any;
}

export const PageBuilderEditorWrapper: React.FC<WrapperProps> = ({
  pageId,
  pageSlug,
  pageTitle,
  pagePublicUrl,
  initialStatus,
  initialBlocks,
  canPublish,
  contextData,
}) => {
  const handleSave = async (blocks: PageBlock[], status: 'draft' | 'published' | 'archived') => {
    const res = await fetch(`/api/pages/${pageSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocks,
        status,
        title: pageTitle,
      }),
    });

    const data = await res.json();
    return data;
  };

  return (
    <PageBuilderEditor
      pageId={pageId}
      pageSlug={pageSlug}
      pageTitle={pageTitle}
      pagePublicUrl={pagePublicUrl}
      initialStatus={initialStatus}
      initialBlocks={initialBlocks}
      canPublish={canPublish}
      onSave={handleSave}
      contextData={contextData}
    />
  );
};
