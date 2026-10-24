import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// -------------------------------------------------------------
// 1. ตารางผู้ใช้งาน (Users Table)
// -------------------------------------------------------------
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['super_admin', 'site_admin', 'editor', 'author'] })
    .notNull()
    .default('author'),
  avatarUrl: text('avatar_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 2. ตารางเซสชัน (Sessions Table)
// -------------------------------------------------------------
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  expiresAt: integer('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// -------------------------------------------------------------
// 3. ตารางบันทึกกิจกรรมระบบ (Audit Logs Table)
// -------------------------------------------------------------
export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  userEmail: text('user_email'),
  action: text('action').notNull(), // 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH'
  entityType: text('entity_type').notNull(), // 'page', 'news', 'theme', 'user', 'media'
  entityId: text('entity_id'),
  details: text('details'), // JSON string
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull(),
});

// -------------------------------------------------------------
// 4. ตารางการตั้งค่ารูปแบบเว็บไซต์ (Theme Settings Table)
// -------------------------------------------------------------
export const themeSettings = sqliteTable('theme_settings', {
  id: text('id').primaryKey().default('current'),
  siteName: text('site_name').notNull().default('โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)'),
  siteDescription: text('site_description').default('สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้'),
  logoUrl: text('logo_url').default('/images/logo.png'),
  faviconUrl: text('favicon_url').default('/favicon.ico'),
  primaryColor: text('primary_color').notNull().default('#0b1f3c'), // Navy Blue
  secondaryColor: text('secondary_color').notNull().default('#eab308'), // Gold/Yellow
  accentColor: text('accent_color').notNull().default('#1b71c4'),
  fontFamily: text('font_family').notNull().default('IBM Plex Sans Thai'),
  headerLayout: text('header_layout').notNull().default('standard'),
  footerCopyright: text('footer_copyright').default('© 2026 โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สังกัด สพป.สมุทรสาคร สงวนลิขสิทธิ์'),
  contactPhone: text('contact_phone').default('034-490-XXX (อยู่ระหว่างยืนยันข้อมูล)'),
  contactEmail: text('contact_email').default('contact@bnw.ac.th'),
  contactAddress: text('contact_address').default('เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000'),
  facebookUrl: text('facebook_url').default('https://www.facebook.com/Watbangnamwonschool'),
  lineUrl: text('line_url'),
  youtubeUrl: text('youtube_url'),
  navMenuItems: text('nav_menu_items').notNull(), // JSON Array
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 5. ตารางหน้าเว็บและ Page Builder (Pages Table)
// -------------------------------------------------------------
export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['draft', 'published', 'archived'] })
    .notNull()
    .default('draft'),
  content: text('content').notNull().default('[]'), // JSON array of 15 standard blocks
  authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 6. ตารางข่าวประชาสัมพันธ์ (News Table)
// -------------------------------------------------------------
export const news = sqliteTable('news', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary'),
  content: text('content').notNull(),
  category: text('category', { enum: ['general', 'academic', 'activity', 'award'] })
    .notNull()
    .default('general'),
  coverImageUrl: text('cover_image_url'),
  status: text('status', { enum: ['draft', 'published', 'scheduled', 'archived'] })
    .notNull()
    .default('draft'),
  authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  viewCount: integer('view_count').notNull().default(0),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 7. ตารางประกาศของโรงเรียน (Announcements Table)
// -------------------------------------------------------------
export const announcements = sqliteTable('announcements', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type', { enum: ['general', 'urgent', 'procurement', 'admission'] })
    .notNull()
    .default('general'),
  isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  attachmentUrl: text('attachment_url'),
  status: text('status', { enum: ['draft', 'published', 'archived'] })
    .notNull()
    .default('published'),
  authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 8. ตารางปฏิทินกิจกรรม (Events Table)
// -------------------------------------------------------------
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  location: text('location'),
  coverImageUrl: text('cover_image_url'),
  status: text('status', { enum: ['draft', 'published', 'archived'] })
    .notNull()
    .default('published'),
  authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 9. ตารางทำเนียบบุคลากร (Staff Table)
// -------------------------------------------------------------
export const staff = sqliteTable('staff', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  position: text('position').notNull(),
  department: text('department', {
    enum: ['executive', 'academic', 'student_affairs', 'general_admin', 'budget'],
  })
    .notNull()
    .default('academic'),
  orderIndex: integer('order_index').notNull().default(0),
  imageUrl: text('image_url'),
  qualification: text('qualification'),
  email: text('email'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 10. ตารางข้อมูลวิชาการและหลักสูตร (Academic Table)
// -------------------------------------------------------------
export const academicCourses = sqliteTable('academic_courses', {
  id: text('id').primaryKey(),
  level: text('level', { enum: ['primary', 'lower_secondary', 'special'] }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  learningAreas: text('learning_areas'), // JSON array of subjects/credits
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 11. ตารางเอกสารดาวน์โหลด (Documents Table)
// -------------------------------------------------------------
export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category', { enum: ['student', 'teacher', 'procurement', 'general'] })
    .notNull()
    .default('general'),
  fileUrl: text('file_url').notNull(),
  fileSize: text('file_size'),
  fileType: text('file_type'),
  downloadCount: integer('download_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 12. ตารางระบบบริการออนไลน์ (E-Services Table)
// -------------------------------------------------------------
export const eServices = sqliteTable('e_services', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  targetGroup: text('target_group', {
    enum: ['students', 'parents', 'teachers', 'general'],
  })
    .notNull()
    .default('general'),
  icon: text('icon').notNull().default('Globe'),
  url: text('url').notNull(),
  isExternal: integer('is_external', { mode: 'boolean' }).notNull().default(true),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 13. ตารางสวนพฤกษศาสตร์โรงเรียน (Botanical Plants Table)
// -------------------------------------------------------------
export const botanicalPlants = sqliteTable('botanical_plants', {
  id: text('id').primaryKey(),
  thaiName: text('thai_name').notNull(),
  commonName: text('common_name'),
  scientificName: text('scientific_name').notNull(),
  family: text('family').notNull(),
  characteristics: text('characteristics').notNull(),
  locationInSchool: text('location_in_school').notNull(),
  educationalValue: text('educational_value'),
  imageUrl: text('image_url'),
  verificationStatus: text('verification_status', {
    enum: ['verified', 'pending_verification'],
  })
    .notNull()
    .default('verified'),
  qrCode: text('qr_code'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// -------------------------------------------------------------
// 14. ตารางคลังสื่อและรูปภาพ (Media Files Table)
// -------------------------------------------------------------
export const mediaFiles = sqliteTable('media_files', {
  id: text('id').primaryKey(),
  fileName: text('file_name').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  url: text('url').notNull(),
  altText: text('alt_text'),
  uploadedBy: text('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: text('created_at').notNull(),
});
