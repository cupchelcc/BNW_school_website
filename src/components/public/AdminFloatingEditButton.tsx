'use client';

import React from 'react';

interface Props {
  slug?: string;
  pageTitle?: string;
}

// User specified: Do not show edit button on public website; access via admin panel only.
export const AdminFloatingEditButton: React.FC<Props> = () => {
  return null;
};
