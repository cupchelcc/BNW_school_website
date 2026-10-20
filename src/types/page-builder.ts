// =============================================================
// ชนิดข้อมูลสำหรับ Visual Page Builder 15 บล็อกมาตรฐาน
// =============================================================

export type BlockType =
  | 'hero_banner'
  | 'text_section'
  | 'image_single'
  | 'image_gallery'
  | 'news_list'
  | 'announcement_list'
  | 'event_list'
  | 'staff_cards'
  | 'document_list'
  | 'cta'
  | 'image_slider'
  | 'divider'
  | 'spacer'
  | 'botanical_highlight'
  | 'eservice_links';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeroBannerBlock extends BaseBlock {
  type: 'hero_banner';
  data: {
    badge?: string;
    title: string;
    subtitle?: string;
    primaryButtonText?: string;
    primaryButtonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    backgroundImageUrl?: string;
  };
}

export interface TextSectionBlock extends BaseBlock {
  type: 'text_section';
  data: {
    title?: string;
    content: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface ImageSingleBlock extends BaseBlock {
  type: 'image_single';
  data: {
    imageUrl: string;
    altText?: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
    maxWidth?: 'sm' | 'md' | 'lg' | 'full';
  };
}

export interface ImageGalleryBlock extends BaseBlock {
  type: 'image_gallery';
  data: {
    title?: string;
    columns?: 2 | 3 | 4;
    images: Array<{
      url: string;
      caption?: string;
      alt?: string;
    }>;
  };
}

export interface NewsListBlock extends BaseBlock {
  type: 'news_list';
  data: {
    title?: string;
    subtitle?: string;
    category?: 'all' | 'general' | 'academic' | 'activity' | 'award';
    limit?: number;
    showCategoryBadge?: boolean;
  };
}

export interface AnnouncementListBlock extends BaseBlock {
  type: 'announcement_list';
  data: {
    title?: string;
    type?: 'all' | 'general' | 'urgent' | 'procurement' | 'admission';
    limit?: number;
    showBadge?: boolean;
  };
}

export interface EventListBlock extends BaseBlock {
  type: 'event_list';
  data: {
    title?: string;
    limit?: number;
  };
}

export interface StaffCardsBlock extends BaseBlock {
  type: 'staff_cards';
  data: {
    title?: string;
    department?: 'all' | 'executive' | 'academic' | 'student_affairs' | 'general_admin';
    limit?: number;
  };
}

export interface DocumentListBlock extends BaseBlock {
  type: 'document_list';
  data: {
    title?: string;
    category?: 'all' | 'student' | 'teacher' | 'procurement' | 'general';
    limit?: number;
  };
}

export interface CtaBlock extends BaseBlock {
  type: 'cta';
  data: {
    title: string;
    description?: string;
    buttonText: string;
    buttonUrl: string;
  };
}

export interface ImageSliderBlock extends BaseBlock {
  type: 'image_slider';
  data: {
    slides: Array<{
      imageUrl: string;
      title?: string;
      caption?: string;
      linkUrl?: string;
    }>;
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  data: {
    style?: 'solid' | 'dashed' | 'dotted';
    spacing?: 'small' | 'medium' | 'large';
  };
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  data: {
    height?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export interface BotanicalHighlightBlock extends BaseBlock {
  type: 'botanical_highlight';
  data: {
    title?: string;
    subtitle?: string;
    limit?: number;
  };
}

export interface EserviceLinksBlock extends BaseBlock {
  type: 'eservice_links';
  data: {
    title?: string;
    subtitle?: string;
    limit?: number;
  };
}

export type PageBlock =
  | HeroBannerBlock
  | TextSectionBlock
  | ImageSingleBlock
  | ImageGalleryBlock
  | NewsListBlock
  | AnnouncementListBlock
  | EventListBlock
  | StaffCardsBlock
  | DocumentListBlock
  | CtaBlock
  | ImageSliderBlock
  | DividerBlock
  | SpacerBlock
  | BotanicalHighlightBlock
  | EserviceLinksBlock;

export interface PageData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  content: PageBlock[];
  authorId?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
