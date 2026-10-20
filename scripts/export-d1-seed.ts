import { db, schema } from '../src/db';
import fs from 'fs';
import path from 'path';

async function exportD1Seed() {
  console.log('[Export D1 Seed] กำลังดึงข้อมูลจาก bnw_school.db...');
  const users = await db.select().from(schema.users);
  const theme = await db.select().from(schema.themeSettings);
  const pages = await db.select().from(schema.pages);
  const news = await db.select().from(schema.news);
  const ann = await db.select().from(schema.announcements);
  const events = await db.select().from(schema.events);
  const staff = await db.select().from(schema.staff);
  const plants = await db.select().from(schema.botanicalPlants);
  const esv = await db.select().from(schema.eServices);
  const docs = await db.select().from(schema.documents);
  const crs = await db.select().from(schema.academicCourses);

  let sql = '-- =========================================================\n';
  sql += '-- Seed Data Script for Cloudflare D1 / SQLite Database\n';
  sql += '-- Generated at: ' + new Date().toISOString() + '\n';
  sql += '-- =========================================================\n\n';

  function escapeSql(val: any): string {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'boolean') return val ? '1' : '0';
    return "'" + String(val).replace(/'/g, "''") + "'";
  }

  for (const u of users) {
    sql += `INSERT OR REPLACE INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at) VALUES (${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.passwordHash)}, ${escapeSql(u.role)}, ${escapeSql(u.isActive)}, ${escapeSql(u.createdAt)}, ${escapeSql(u.updatedAt)});\n`;
  }

  for (const t of theme) {
    sql += `INSERT OR REPLACE INTO theme_settings (id, site_name, site_description, logo_url, favicon_url, primary_color, secondary_color, accent_color, font_family, header_layout, footer_copyright, contact_phone, contact_email, contact_address, facebook_url, line_url, youtube_url, nav_menu_items, updated_at) VALUES (${escapeSql(t.id)}, ${escapeSql(t.siteName)}, ${escapeSql(t.siteDescription)}, ${escapeSql(t.logoUrl)}, ${escapeSql(t.faviconUrl)}, ${escapeSql(t.primaryColor)}, ${escapeSql(t.secondaryColor)}, ${escapeSql(t.accentColor)}, ${escapeSql(t.fontFamily)}, ${escapeSql(t.headerLayout)}, ${escapeSql(t.footerCopyright)}, ${escapeSql(t.contactPhone)}, ${escapeSql(t.contactEmail)}, ${escapeSql(t.contactAddress)}, ${escapeSql(t.facebookUrl)}, ${escapeSql(t.lineUrl)}, ${escapeSql(t.youtubeUrl)}, ${escapeSql(t.navMenuItems)}, ${escapeSql(t.updatedAt)});\n`;
  }

  for (const p of pages) {
    sql += `INSERT OR REPLACE INTO pages (id, slug, title, description, status, content, author_id, published_at, created_at, updated_at) VALUES (${escapeSql(p.id)}, ${escapeSql(p.slug)}, ${escapeSql(p.title)}, ${escapeSql(p.description)}, ${escapeSql(p.status)}, ${escapeSql(p.content)}, ${escapeSql(p.authorId)}, ${escapeSql(p.publishedAt)}, ${escapeSql(p.createdAt)}, ${escapeSql(p.updatedAt)});\n`;
  }

  for (const n of news) {
    sql += `INSERT OR REPLACE INTO news (id, slug, title, summary, content, category, cover_image_url, status, author_id, view_count, published_at, created_at, updated_at) VALUES (${escapeSql(n.id)}, ${escapeSql(n.slug)}, ${escapeSql(n.title)}, ${escapeSql(n.summary)}, ${escapeSql(n.content)}, ${escapeSql(n.category)}, ${escapeSql(n.coverImageUrl)}, ${escapeSql(n.status)}, ${escapeSql(n.authorId)}, ${escapeSql(n.viewCount)}, ${escapeSql(n.publishedAt)}, ${escapeSql(n.createdAt)}, ${escapeSql(n.updatedAt)});\n`;
  }

  for (const a of ann) {
    sql += `INSERT OR REPLACE INTO announcements (id, slug, title, content, type, is_pinned, attachment_url, status, author_id, published_at, created_at, updated_at) VALUES (${escapeSql(a.id)}, ${escapeSql(a.slug)}, ${escapeSql(a.title)}, ${escapeSql(a.content)}, ${escapeSql(a.type)}, ${escapeSql(a.isPinned)}, ${escapeSql(a.attachmentUrl)}, ${escapeSql(a.status)}, ${escapeSql(a.authorId)}, ${escapeSql(a.publishedAt)}, ${escapeSql(a.createdAt)}, ${escapeSql(a.updatedAt)});\n`;
  }

  for (const ev of events) {
    sql += `INSERT OR REPLACE INTO events (id, title, description, start_date, end_date, location, cover_image_url, status, author_id, created_at, updated_at) VALUES (${escapeSql(ev.id)}, ${escapeSql(ev.title)}, ${escapeSql(ev.description)}, ${escapeSql(ev.startDate)}, ${escapeSql(ev.endDate)}, ${escapeSql(ev.location)}, ${escapeSql(ev.coverImageUrl)}, ${escapeSql(ev.status)}, ${escapeSql(ev.authorId)}, ${escapeSql(ev.createdAt)}, ${escapeSql(ev.updatedAt)});\n`;
  }

  for (const s of staff) {
    sql += `INSERT OR REPLACE INTO staff (id, name, position, department, order_index, image_url, qualification, email, is_active, created_at, updated_at) VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.position)}, ${escapeSql(s.department)}, ${escapeSql(s.orderIndex)}, ${escapeSql(s.imageUrl)}, ${escapeSql(s.qualification)}, ${escapeSql(s.email)}, ${escapeSql(s.isActive)}, ${escapeSql(s.createdAt)}, ${escapeSql(s.updatedAt)});\n`;
  }

  for (const pl of plants) {
    sql += `INSERT OR REPLACE INTO botanical_plants (id, thai_name, common_name, scientific_name, family, characteristics, location_in_school, educational_value, image_url, verification_status, qr_code, created_at, updated_at) VALUES (${escapeSql(pl.id)}, ${escapeSql(pl.thaiName)}, ${escapeSql(pl.commonName)}, ${escapeSql(pl.scientificName)}, ${escapeSql(pl.family)}, ${escapeSql(pl.characteristics)}, ${escapeSql(pl.locationInSchool)}, ${escapeSql(pl.educationalValue)}, ${escapeSql(pl.imageUrl)}, ${escapeSql(pl.verificationStatus)}, ${escapeSql(pl.qrCode)}, ${escapeSql(pl.createdAt)}, ${escapeSql(pl.updatedAt)});\n`;
  }

  for (const c of crs) {
    sql += `INSERT OR REPLACE INTO academic_courses (id, level, title, description, learning_areas, order_index, created_at, updated_at) VALUES (${escapeSql(c.id)}, ${escapeSql(c.level)}, ${escapeSql(c.title)}, ${escapeSql(c.description)}, ${escapeSql(c.learningAreas)}, ${escapeSql(c.orderIndex)}, ${escapeSql(c.createdAt)}, ${escapeSql(c.updatedAt)});\n`;
  }

  for (const e of esv) {
    sql += `INSERT OR REPLACE INTO e_services (id, title, description, target_group, icon, url, is_external, order_index, is_active, created_at, updated_at) VALUES (${escapeSql(e.id)}, ${escapeSql(e.title)}, ${escapeSql(e.description)}, ${escapeSql(e.targetGroup)}, ${escapeSql(e.icon)}, ${escapeSql(e.url)}, ${escapeSql(e.isExternal)}, ${escapeSql(e.orderIndex)}, ${escapeSql(e.isActive)}, ${escapeSql(e.createdAt)}, ${escapeSql(e.updatedAt)});\n`;
  }

  for (const d of docs) {
    sql += `INSERT OR REPLACE INTO documents (id, title, description, category, file_url, file_size, file_type, download_count, created_at, updated_at) VALUES (${escapeSql(d.id)}, ${escapeSql(d.title)}, ${escapeSql(d.description)}, ${escapeSql(d.category)}, ${escapeSql(d.fileUrl)}, ${escapeSql(d.fileSize)}, ${escapeSql(d.fileType)}, ${escapeSql(d.downloadCount)}, ${escapeSql(d.createdAt)}, ${escapeSql(d.updatedAt)});\n`;
  }

  const outPath = path.resolve('drizzle', 'seed.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log('[Export D1 Seed] สำเร็จ! ไฟล์ SQL ถูกบันทึกไว้ที่:', outPath);
}

exportD1Seed().catch(console.error);
