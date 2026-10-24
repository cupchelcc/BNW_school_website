import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL || 'file:bnw_school.db';
const client = createClient({
  url: databaseUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export async function runMigrationsAndSeed() {
  console.log(`[DB] กำลังเตรียมและตรวจสอบโครงสร้างตารางฐานข้อมูลที่: ${databaseUrl}`);

  // สร้างตารางทั้งหมด (DDL Statements)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'author',
      avatar_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      user_email TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS theme_settings (
      id TEXT PRIMARY KEY DEFAULT 'current',
      site_name TEXT NOT NULL DEFAULT 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
      site_description TEXT DEFAULT 'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้',
      logo_url TEXT DEFAULT '/images/logo.png',
      favicon_url TEXT DEFAULT '/favicon.ico',
      primary_color TEXT NOT NULL DEFAULT '#0b1f3c',
      secondary_color TEXT NOT NULL DEFAULT '#eab308',
      accent_color TEXT NOT NULL DEFAULT '#1b71c4',
      font_family TEXT NOT NULL DEFAULT 'IBM Plex Sans Thai',
      header_layout TEXT NOT NULL DEFAULT 'standard',
      footer_copyright TEXT DEFAULT '© 2026 โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สงวนลิขสิทธิ์',
      contact_phone TEXT DEFAULT '034-490-XXX (อยู่ระหว่างยืนยันข้อมูล)',
      contact_email TEXT DEFAULT 'contact@bnw.ac.th',
      contact_address TEXT DEFAULT 'เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000',
      facebook_url TEXT DEFAULT 'https://www.facebook.com/bnwschool',
      line_url TEXT,
      youtube_url TEXT,
      nav_menu_items TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      content TEXT NOT NULL DEFAULT '[]',
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      cover_image_url TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      view_count INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'general',
      is_pinned INTEGER NOT NULL DEFAULT 0,
      attachment_url TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      location TEXT,
      cover_image_url TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      department TEXT NOT NULL DEFAULT 'academic',
      order_index INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      qualification TEXT,
      email TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS academic_courses (
      id TEXT PRIMARY KEY,
      level TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      learning_areas TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'general',
      file_url TEXT NOT NULL,
      file_size TEXT,
      file_type TEXT,
      download_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS e_services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      target_group TEXT NOT NULL DEFAULT 'general',
      icon TEXT NOT NULL DEFAULT 'Globe',
      url TEXT NOT NULL,
      is_external INTEGER NOT NULL DEFAULT 1,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS botanical_plants (
      id TEXT PRIMARY KEY,
      thai_name TEXT NOT NULL,
      common_name TEXT,
      scientific_name TEXT NOT NULL,
      family TEXT NOT NULL,
      characteristics TEXT NOT NULL,
      location_in_school TEXT NOT NULL,
      educational_value TEXT,
      image_url TEXT,
      verification_status TEXT NOT NULL DEFAULT 'verified',
      qr_code TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS media_files (
      id TEXT PRIMARY KEY,
      file_name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      url TEXT NOT NULL,
      alt_text TEXT,
      uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL
    );
  `);

  // สร้าง Indexes สำคัญเพื่อความรวดเร็วในการ Query
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);`);
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_botanical_thai_name ON botanical_plants(thai_name);`);

  console.log('[DB] สร้างโครงสร้างตารางและ Indexes สำเร็จเรียบร้อย');

  // ตรวจสอบและลงทะเบียนผู้ใช้เริ่มต้น (Bootstrap Seed)
  const existingUsers = await client.execute('SELECT COUNT(*) as count FROM users');
  const userCount = Number(existingUsers.rows[0].count);

  if (userCount === 0) {
    console.log('[DB] กำลังสร้างบัญชีผู้ใช้งานตั้งต้นที่ปลอดภัย (Super Admin, Editor, Author)...');
    const now = new Date().toISOString();

    const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'Admin@BNW2026!';
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const editorHash = await bcrypt.hash('Editor@BNW2026!', 10);
    const authorHash = await bcrypt.hash('Teacher@BNW2026!', 10);

    await client.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['usr-superadmin-01', 'ผู้ดูแลระบบหลัก (รอดพิทยาคม)', 'admin@bnw.ac.th', adminHash, 'super_admin', now, now],
    });

    await client.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['usr-editor-01', 'ครูบรรณาธิการข่าวสารและประชาสัมพันธ์', 'editor@bnw.ac.th', editorHash, 'editor', now, now],
    });

    await client.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['usr-author-01', 'ครูผู้เขียนเนื้อหากลุ่มสาระ', 'author@bnw.ac.th', authorHash, 'author', now, now],
    });

    console.log('[DB] บัญชีผู้ใช้เริ่มต้นถูกสร้างแล้ว');
  }

  // ตรวจสอบ Theme Settings
  const existingTheme = await client.execute("SELECT COUNT(*) as count FROM theme_settings WHERE id = 'current'");
  if (Number(existingTheme.rows[0].count) === 0) {
    console.log('[DB] กำลังลงทะเบียนการตั้งค่า Theme และ Menu เริ่มต้น...');
    const now = new Date().toISOString();

    const defaultMenus = [
      { id: 'm1', title: 'หน้าแรก', href: '/', order: 1 },
      {
        id: 'm2',
        title: 'ข้อมูลโรงเรียน',
        href: '/about',
        order: 2,
        children: [
          { id: 'm2-1', title: 'ประวัติและข้อมูลทั่วไป', href: '/about/history' },
          { id: 'm2-2', title: 'วิสัยทัศน์ พันธกิจ อัตลักษณ์', href: '/about/vision' },
          { id: 'm2-3', title: 'โครงสร้างการบริหาร', href: '/about/structure' },
          { id: 'm2-4', title: 'ทำเนียบบุคลากร', href: '/about/staff' },
        ],
      },
      {
        id: 'm3',
        title: 'ข่าวสารและประกาศ',
        href: '/news',
        order: 3,
        children: [
          { id: 'm3-1', title: 'ข่าวประชาสัมพันธ์', href: '/news' },
          { id: 'm3-2', title: 'ประกาศของโรงเรียน', href: '/announcements' },
          { id: 'm3-3', title: 'ปฏิทินกิจกรรม', href: '/calendar' },
          { id: 'm3-4', title: 'ภาพกิจกรรมและแกลเลอรี', href: '/gallery' },
        ],
      },
      {
        id: 'm4',
        title: 'วิชาการ',
        href: '/academic',
        order: 4,
        children: [
          { id: 'm4-1', title: 'ข้อมูลหลักสูตรการศึกษา', href: '/academic' },
          { id: 'm4-2', title: 'ผลงานและความสำเร็จ', href: '/achievements' },
          { id: 'm4-3', title: 'เอกสารดาวน์โหลด', href: '/documents' },
        ],
      },
      { id: 'm5', title: 'บริการออนไลน์', href: '/e-service', order: 5 },
      { id: 'm7', title: 'ติดต่อเรา', href: '/contact', order: 6 },
    ];

    await client.execute({
      sql: `INSERT INTO theme_settings (
        id, site_name, site_description, logo_url, favicon_url, primary_color, secondary_color, accent_color,
        font_family, header_layout, footer_copyright, contact_phone, contact_email, contact_address,
        facebook_url, nav_menu_items, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'current',
        'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
        'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้ สังกัด สพป.สมุทรสาคร',
        '/images/logo.png',
        '/favicon.ico',
        '#0b1f3c', // Navy Blue
        '#eab308', // Gold
        '#1b71c4',
        'IBM Plex Sans Thai',
        'standard',
        '© 2026 โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร สงวนลิขสิทธิ์',
        '034-490-XXX (อยู่ระหว่างเตรียมข้อมูลติดต่อ)',
        'contact@bnw.ac.th',
        'เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000',
        'https://www.facebook.com/bnwschool',
        JSON.stringify(defaultMenus),
        now,
      ],
    });
  }

  // ตรวจสอบและใส่ข้อมูลตั้งต้นของโรงเรียน (Seed School Data)
  const existingNews = await client.execute('SELECT COUNT(*) as count FROM news');
  if (Number(existingNews.rows[0].count) === 0) {
    console.log('[DB] กำลังเพิ่มข้อมูลตัวอย่างที่เป็นกลางสำหรับข่าวและกิจกรรม...');
    const now = new Date().toISOString();

    await client.execute({
      sql: `INSERT INTO news (id, slug, title, summary, content, category, status, view_count, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'news-01',
        'wai-kru-ceremony-2569',
        'พิธีไหว้ครู ประจำปีการศึกษา 2569 น้อมจิตวันทา บูชาพระคุณครู',
        'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) จัดกิจกรรมพิธีไหว้ครู เพื่อให้นักเรียนได้แสดงความกตัญญูกตเวทิตาต่อครูอาจารย์',
        'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) ได้จัดพิธีไหว้ครู ประจำปีการศึกษา 2569 เพื่อให้นักเรียนทุกระดับชั้นได้ร่วมแสดงความกตัญญูกตเวทิตาต่อคุณครูผู้ประสิทธิ์ประสาทวิชาความรู้ กิจกรรมประกอบด้วยพิธีทำบุญตักบาตร การประกวดพานไหว้ครูประเภทสวยงามและประเภทความคิดสร้างสรรค์ บรรยากาศเป็นไปด้วยความอบอุ่นและเปี่ยมด้วยความหมาย',
        'activity',
        'published',
        142,
        now,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO news (id, slug, title, summary, content, category, status, view_count, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'news-02',
        'science-week-exhibition-2569',
        'สัปดาห์วิทยาศาสตร์และเทคโนโลยี ส่งเสริมนวัตกรรมเยาวชนคนรุ่นใหม่',
        'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี จัดนิทรรศการและการแข่งขันโครงงานสิ่งประดิษฐ์เพื่อการอนุรักษ์สิ่งแวดล้อม',
        'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) จัดงานสัปดาห์วิทยาศาสตร์ขึ้น ภายในงานมีการจัดแสดงนิทรรศการโครงงานทางวิทยาศาสตร์ โครงงานสำรวจระบบนิเวศป่าชายเลนและสายน้ำบางน้ำวน การแข่งขันจรวดขวดน้ำ และการตอบปัญหาวิทยาศาสตร์ เพื่อกระตุ้นกระบวนการคิดแบบสะเต็มศึกษา (STEM Education) ให้แก่นักเรียน',
        'academic',
        'published',
        98,
        now,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO news (id, slug, title, summary, content, category, status, view_count, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'news-03',
        'academic-award-samut-sakhon-2569',
        'นักเรียนโรงเรียนวัดบางน้ำวน คว้ารางวัลเหรียญทอง การแข่งขันความเป็นเลิศทางวิชาการ',
        'ขอแสดงความยินดีกับตัวแทนนักเรียนที่ได้รับรางวัลจากการแข่งขันระดับเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร',
        'ขอแสดงความชื่นชมและยินดีกับนักเรียนตัวแทนโรงเรียนวัดบางน้ำวน (รอดพิทยาคม) ที่ได้รับรางวัลเหรียญทอง อันดับ 1 ในการแข่งขันตอบปัญหาสุขศึกษาและวิทยาศาสตร์สิ่งแวดล้อม งานมหกรรมวิชาการระดับเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร สร้างความภาคภูมิใจให้แก่คณะครูและชาวบางน้ำวนเป็นอย่างยิ่ง',
        'award',
        'published',
        215,
        now,
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ Announcements
  const existingAnnouncements = await client.execute('SELECT COUNT(*) as count FROM announcements');
  if (Number(existingAnnouncements.rows[0].count) === 0) {
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO announcements (id, slug, title, content, type, is_pinned, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'ann-01',
        'admission-announcement-2569',
        'ประกาศรับสมัครนักเรียนใหม่ ปีการศึกษา 2569 ระดับชั้นอนุบาลและประถมศึกษา',
        'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) เปิดรับสมัครนักเรียนใหม่ ประจำปีการศึกษา 2569 โดยผู้ปกครองสามารถยื่นเอกสารการสมัครได้ที่ห้องธุรการโรงเรียนในวันและเวลาราชการ หรือสมัครผ่านระบบ E-Service ทางเว็บไซต์ของโรงเรียน',
        'admission',
        1,
        'published',
        now,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO announcements (id, slug, title, content, type, is_pinned, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'ann-02',
        'parent-meeting-term-1-2569',
        'กำหนดการประชุมผู้ปกครองภาคเรียนที่ 1 ประจำปีการศึกษา 2569',
        'ขอเชิญผู้ปกครองนักเรียนทุกระดับชั้นเข้าร่วมการประชุมผู้ปกครอง เพื่อรับฟังแนวทางการจัดการเรียนรู้และรับผลการพัฒนาการเรียนรู้ของนักเรียน ณ หอประชุมโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
        'general',
        0,
        'published',
        now,
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ Events
  const existingEvents = await client.execute('SELECT COUNT(*) as count FROM events');
  if (Number(existingEvents.rows[0].count) === 0) {
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO events (id, title, description, start_date, end_date, location, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'evt-01',
        'กิจกรรมเปิดบ้านวิชาการ Open House 2569',
        'เปิดโอกาสให้นักเรียนและผู้ปกครองเข้าชมนิทรรศการผลงานและการจัดการเรียนการสอนของโรงเรียน',
        '2026-11-15T08:30:00Z',
        '2026-11-15T15:30:00Z',
        'อาคารเรียนและหอประชุม โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
        'published',
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO events (id, title, description, start_date, end_date, location, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'evt-02',
        'การแข่งขันกีฬาสีภายใน รอดพิทยาคมเกมส์',
        'ส่งเสริมสุขภาพ พลานามัย ความมีน้ำใจนักกีฬา และความสามัคคีในหมู่คณะ',
        '2026-12-18T08:00:00Z',
        '2026-12-19T16:00:00Z',
        'สนามกีฬาโรงเรียนวัดบางน้ำวน',
        'published',
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ บุคลากร (Staff)
  const existingStaff = await client.execute('SELECT COUNT(*) as count FROM staff');
  if (Number(existingStaff.rows[0].count) === 0) {
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO staff (id, name, position, department, order_index, qualification, email, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'stf-01',
        'ผู้อำนวยการโรงเรียน (ข้อมูลตัวอย่าง)',
        'ผู้อำนวยการชำนาญการพิเศษ',
        'executive',
        1,
        'กศ.ม. การบริหารการศึกษา',
        'director@bnw.ac.th',
        1,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO staff (id, name, position, department, order_index, qualification, email, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'stf-02',
        'ครูหัวหน้าฝ่ายวิชาการ (ข้อมูลตัวอย่าง)',
        'ครูชำนาญการพิเศษ',
        'academic',
        2,
        'ค.บ. มัธยมศึกษา (วิทยาศาสตร์)',
        'academic_head@bnw.ac.th',
        1,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO staff (id, name, position, department, order_index, qualification, email, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'stf-03',
        'ครูหัวหน้าฝ่ายกิจการนักเรียน (ข้อมูลตัวอย่าง)',
        'ครูชำนาญการ',
        'student_affairs',
        3,
        'ศษ.บ. พลศึกษา',
        'student_affairs@bnw.ac.th',
        1,
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ สวนพฤกษศาสตร์โรงเรียน (Botanical Plants)
  const existingPlants = await client.execute('SELECT COUNT(*) as count FROM botanical_plants');
  if (Number(existingPlants.rows[0].count) === 0) {
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO botanical_plants (id, thai_name, common_name, scientific_name, family, characteristics, location_in_school, educational_value, verification_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'plant-01',
        'ราชพฤกษ์ (คูน)',
        'Golden Shower',
        'Cassia fistula L.',
        'Fabaceae (Leguminosae - Caesalpinioideae)',
        'ไม้ยืนต้นขนาดกลาง ผลัดใบ สูงประมาณ 10-15 เมตร ดอกออกเป็นช่อห้อยระย้าสีเหลืองอร่าม ผลเป็นฝักยาวทรงกระบอกสีน้ำตาลเข้มเกือบดำ เมล็ดแบนรูปไข่',
        'บริเวณสวนหย่อมด้านหน้าเสาธงและอาคาร 1',
        'ดอกเป็นดอกไม้ประจำชาติไทย ฝักแก่ใช้เป็นยาระบายและสมุนไพรขับเสมหะ เปลือกต้นมีสารแทนนินใช้ฟอกหนัง',
        'verified',
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO botanical_plants (id, thai_name, common_name, scientific_name, family, characteristics, location_in_school, educational_value, verification_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'plant-02',
        'ทองกวาว (จาน)',
        'Flame of the Forest',
        'Butea monosperma (Lam.) Taub.',
        'Fabaceae',
        'ไม้ยืนต้นขนาดกลาง ลำต้นมักคดงอ ดอกสีส้มแสดหรือแดงคล้ายเปลวเพลิง ออกเป็นช่อยาวตามกิ่งก้าน ใบประกอบแบบขนนกมี 3 ใบย่อย',
        'แปลงพฤกษศาสตร์ข้างสนามกีฬาโรงเรียน',
        'ดอกนำมาต้มย้อมผ้าให้สีส้ม ยางจากลำต้นใช้เป็นยาสมานแผล และเป็นพืชศึกษาการปรับตัวในฤดูแล้ง',
        'verified',
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO botanical_plants (id, thai_name, common_name, scientific_name, family, characteristics, location_in_school, educational_value, verification_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'plant-03',
        'ลีลาวดี (ลั่นทมขาว)',
        'White Frangipani',
        'Plumeria obtusa L.',
        'Apocynaceae',
        'ไม้พุ่มหรือไม้ยืนต้นขนาดเล็ก กิ่งก้านอวบน้ำ มียางสีขาว ใบหนารูปไข่กลับ ดอกสีขาวใจกลางสีเหลือง มีกลิ่นหอมละมุน',
        'บริเวณทางเดินเชื่อมระหว่างอาคารเรียน 1 และ 2',
        'ศึกษาโครงสร้างดอกพืชวงศ์ Apocynaceae การปรับตัวของพืชอวบน้ำ และคุณสมบัติของน้ำมันหอมระเหย',
        'verified',
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ E-Services
  const existingServices = await client.execute('SELECT COUNT(*) as count FROM e_services');
  if (Number(existingServices.rows[0].count) === 0) {
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO e_services (id, title, description, target_group, icon, url, is_external, order_index, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'esv-01',
        'ระบบตรวจสอบผลการเรียน (SGS)',
        'ระบบรายงานและตรวจสอบผลการเรียนออนไลน์สำหรับนักเรียนและผู้ปกครอง',
        'students',
        'GraduationCap',
        'https://sgs.bopp-obec.info',
        1,
        1,
        1,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO e_services (id, title, description, target_group, icon, url, is_external, order_index, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'esv-02',
        'ระบบรับสมัครนักเรียนออนไลน์',
        'กรอกข้อมูลและยื่นเอกสารการสมัครเข้าศึกษาต่อในโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
        'parents',
        'FileText',
        '/e-service/admission',
        0,
        2,
        1,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO e_services (id, title, description, target_group, icon, url, is_external, order_index, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'esv-03',
        'ห้องสมุดดิจิทัลและแหล่งเรียนรู้',
        'คลังหนังสืออิเล็กทรอนิกส์และสื่อการเรียนรู้ทางไกลสำหรับครูและนักเรียน',
        'general',
        'BookOpen',
        'https://www.obec.go.th',
        1,
        3,
        1,
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ Documents
  const existingDocs = await client.execute('SELECT COUNT(*) as count FROM documents');
  if (Number(existingDocs.rows[0].count) === 0) {
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO documents (id, title, description, category, file_url, file_size, file_type, download_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'doc-01',
        'แบบฟอร์มคำร้องขอลาหยุดเรียนสำหรับนักเรียน',
        'เอกสารคำร้องขอลาป่วย/ลากิจ ยื่นต่อครูประจำชั้น',
        'student',
        '/documents/student-leave-form.pdf',
        '185 KB',
        'PDF',
        45,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO documents (id, title, description, category, file_url, file_size, file_type, download_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'doc-02',
        'คู่มือนักเรียนและผู้ปกครอง ประจำปีการศึกษา 2569',
        'ข้อบังคับ ระเบียบวินัย และแนวปฏิบัติของโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
        'general',
        '/documents/student-handbook-2569.pdf',
        '2.4 MB',
        'PDF',
        138,
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ Academic Courses
  const existingCourses = await client.execute('SELECT COUNT(*) as count FROM academic_courses');
  if (Number(existingCourses.rows[0].count) === 0) {
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO academic_courses (id, level, title, description, learning_areas, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'crs-01',
        'primary',
        'หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน ระดับชั้นประถมศึกษา (ป.1 - ป.6)',
        'มุ่งเน้นการเสริมสร้างทักษะพื้นฐานด้านการอ่าน การเขียน การคิดคำนวณ ปลูกฝังคุณธรรม จริยธรรม และกระบวนการคิดตามช่วงวัย',
        JSON.stringify([
          { subject: 'ภาษาไทย', credits: '5 ชั่วโมง/สัปดาห์' },
          { subject: 'คณิตศาสตร์', credits: '5 ชั่วโมง/สัปดาห์' },
          { subject: 'วิทยาศาสตร์และเทคโนโลยี', credits: '3 ชั่วโมง/สัปดาห์' },
          { subject: 'ภาษาอังกฤษ', credits: '3 ชั่วโมง/สัปดาห์' },
          { subject: 'สังคมศึกษา ศาสนา และวัฒนธรรม', credits: '2 ชั่วโมง/สัปดาห์' },
        ]),
        1,
        now,
        now,
      ],
    });

    await client.execute({
      sql: `INSERT INTO academic_courses (id, level, title, description, learning_areas, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'crs-02',
        'lower_secondary',
        'หลักสูตรระดับชั้นมัธยมศึกษาตอนต้น (ม.1 - ม.3)',
        'มุ่งเน้นการสำรวจความถนัด พัฒนาทักษะการเรียนรู้ขั้นสูง การประยุกต์ใช้เทคโนโลยี และเตรียมความพร้อมสู่สายอาชีพหรือสายสามัญ',
        JSON.stringify([
          { subject: 'ภาษาไทยพื้นฐาน', credits: '3 คาบ/สัปดาห์' },
          { subject: 'คณิตศาสตร์เชิงคิดวิเคราะห์', credits: '3 คาบ/สัปดาห์' },
          { subject: 'วิทยาศาสตร์และสะเต็มศึกษา', credits: '3 คาบ/สัปดาห์' },
          { subject: 'ภาษาอังกฤษเพื่อการสื่อสาร', credits: '3 คาบ/สัปดาห์' },
        ]),
        2,
        now,
        now,
      ],
    });
  }

  // ตรวจสอบ Default Home Page สำหรับ Page Builder
  const existingHomePage = await client.execute("SELECT COUNT(*) as count FROM pages WHERE slug = 'home'");
  if (Number(existingHomePage.rows[0].count) === 0) {
    console.log('[DB] กำลังสร้างหน้าแรกเริ่มต้น (Default Home Page) พร้อมบล็อก Page Builder 15 ประเภท...');
    const now = new Date().toISOString();

    const initialBlocks = [
      {
        id: 'blk-hero',
        type: 'hero_banner',
        data: {
          badge: 'ยินดีต้อนรับสู่สถานศึกษาแห่งการเรียนรู้',
          title: 'โรงเรียนวัดบางน้ำวน\n(รอดพิทยาคม)',
          subtitle: 'มุ่งมั่นจัดการศึกษาอย่างมีคุณภาพ ปลูกฝังคุณธรรม นำความรู้ สู่ชุมชนที่ยั่งยืน สังกัด สพป.สมุทรสาคร',
          primaryButtonText: 'ข่าวประชาสัมพันธ์',
          primaryButtonUrl: '/news',
          secondaryButtonText: 'ข้อมูลโรงเรียน',
          secondaryButtonUrl: '/about/history',
          backgroundImageUrl: '',
        },
      },
      {
        id: 'blk-announcements',
        type: 'announcement_list',
        data: {
          title: 'ประกาศด่วนและข่าวสำคัญ',
          limit: 3,
          showBadge: true,
        },
      },
      {
        id: 'blk-text-intro',
        type: 'text_section',
        data: {
          title: 'วิสัยทัศน์สถานศึกษา (Vision)',
          content: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งเน้นการจัดการศึกษาอย่างรอบด้าน เพื่อพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม มีทักษะการเรียนรู้ในศตวรรษที่ 21 อนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อมท้องถิ่น และพร้อมก้าวสู่สังคมแห่งอนาคตอย่างมั่นคงและมีความสุข',
          alignment: 'center',
        },
      },
      {
        id: 'blk-news',
        type: 'news_list',
        data: {
          title: 'ข่าวประชาสัมพันธ์ล่าสุด',
          subtitle: 'ติดตามกิจกรรม การเรียนรู้ และความเคลื่อนไหวภายในโรงเรียน',
          limit: 3,
          showCategoryBadge: true,
        },
      },
      {
        id: 'blk-events',
        type: 'event_list',
        data: {
          title: 'ปฏิทินกิจกรรมโรงเรียน',
          limit: 2,
        },
      },
      {
        id: 'blk-eservices',
        type: 'eservice_links',
        data: {
          title: 'ระบบบริการออนไลน์ (E-Service)',
          subtitle: 'เข้าถึงบริการทางการศึกษาได้อย่างสะดวกรวดเร็ว ทุกที่ทุกเวลา',
        },
      },
      {
        id: 'blk-staff',
        type: 'staff_cards',
        data: {
          title: 'คณะผู้บริหารและบุคลากร',
          department: 'all',
          limit: 3,
        },
      },
      {
        id: 'blk-cta',
        type: 'cta',
        data: {
          title: 'ร่วมเป็นส่วนหนึ่งของครอบครัวรอดพิทยาคม',
          description: 'เปิดรับสมัครนักเรียนใหม่ทุกระดับชั้น พร้อมให้คำปรึกษาด้านการศึกษา',
          buttonText: 'ติดต่อสอบถามเพิ่มเติม',
          buttonUrl: '/contact',
        },
      },
    ];

    await client.execute({
      sql: `INSERT INTO pages (id, slug, title, description, status, content, author_id, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'page-home',
        'home',
        'หน้าแรก - โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
        'เว็บไซต์ทางการ โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร',
        'published',
        JSON.stringify(initialBlocks),
        'usr-superadmin-01',
        now,
        now,
        now,
      ],
    });
  }

  // รายการหน้ามาตรฐานทั้งหมดที่สามารถปรับแต่งได้ผ่าน Visual Page Builder
  const additionalStandardPages = [
    {
      id: 'page-about',
      slug: 'about',
      title: 'ข้อมูลพื้นฐานสถานศึกษา',
      description: 'ศูนย์รวมข้อมูลโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
      blocks: [
        {
          id: 'blk-about-hero',
          type: 'hero_banner',
          data: {
            badge: 'About Wat Bang Nam Won School',
            title: 'ข้อมูลพื้นฐานสถานศึกษา\nโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
            subtitle: 'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้ สังกัด สพป.สมุทรสาคร',
            primaryButtonText: 'ประวัติโรงเรียน',
            primaryButtonUrl: '/about/history',
            secondaryButtonText: 'ติดต่อเรา',
            secondaryButtonUrl: '/contact',
          },
        },
        {
          id: 'blk-about-text',
          type: 'text_section',
          data: {
            title: 'ข้อมูลทั่วไปของสถานศึกษา',
            content: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) ตั้งอยู่เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร รหัสไปรษณีย์ 74000 สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร เปิดสอนตั้งแต่ระดับชั้นอนุบาล 1 ถึงระดับชั้นประถมศึกษาปีที่ 6 จัดการศึกษาเพื่อพัฒนาผู้เรียนอย่างรอบด้าน',
            alignment: 'left',
          },
        },
        {
          id: 'blk-about-staff',
          type: 'staff_cards',
          data: {
            title: 'คณะผู้บริหารสถานศึกษา',
            department: 'management',
            limit: 3,
          },
        },
        {
          id: 'blk-about-cta',
          type: 'cta',
          data: {
            title: 'ต้องการติดต่อหรือสอบถามข้อมูลโรงเรียน',
            description: 'ยินดีต้อนรับผู้ปกครอง ชุมชน และผู้สนใจทุกท่าน สอบถามข้อมูลการศึกษาและการประสานงานราชการ',
            buttonText: 'ติดต่อเรา',
            buttonUrl: '/contact',
          },
        },
      ],
    },
    {
      id: 'page-about-history',
      slug: 'about-history',
      title: 'ประวัติและข้อมูลทั่วไป',
      description: 'ความเป็นมาของสถานศึกษาและที่มาของนาม รอดพิทยาคม',
      blocks: [
        {
          id: 'blk-hist-hero',
          type: 'hero_banner',
          data: {
            badge: 'ประวัติความเป็นมา',
            title: 'ประวัติโรงเรียนวัดบางน้ำวน\n(รอดพิทยาคม)',
            subtitle: 'สถาบันการศึกษาเพื่อชุมชนริมสายน้ำบางน้ำวน สืบสานพระคุณแห่งนาม รอดพิทยาคม',
            primaryButtonText: 'วิสัยทัศน์โรงเรียน',
            primaryButtonUrl: '/about/vision',
          },
        },
        {
          id: 'blk-hist-text-1',
          type: 'text_section',
          data: {
            title: 'ความเป็นมาของสถานศึกษา',
            content: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) ก่อตั้งขึ้นเพื่อขยายโอกาสทางการศึกษาให้แก่เด็กและเยาวชนในชุมชนตำบลบางน้ำวนและพื้นที่ใกล้เคียง โดยได้รับความเมตตาอุปถัมภ์จากวัดบางน้ำวนและผู้นำชุมชน นาม "รอดพิทยาคม" ได้รับการสืบทอดมาจากพระเกจิอาจารย์และผู้ทรงคุณูปการสำคัญของวัดบางน้ำวน เพื่อเป็นอนุสรณ์แห่งความเมตตา การเสียสละ และเป็นสิริมงคลแก่คณะครูและนักเรียน',
            alignment: 'left',
          },
        },
        {
          id: 'blk-hist-text-2',
          type: 'text_section',
          data: {
            title: 'อัตลักษณ์และข้อมูลเชิงสัญลักษณ์',
            content: '• สีประจำโรงเรียน: น้ำเงิน - เหลือง (ความสุขุม มั่นคง และปัญญาอันสว่างไสว)\n• ปรัชญาโรงเรียน: สุวิชาโน ภวํ โหติ (ผู้รู้ดี เป็นผู้เจริญ)\n• คำขวัญโรงเรียน: เรียนดี กีฬาเด่น เน้นคุณธรรม สัมพันธ์ชุมชน\n• เอกลักษณ์: ยิ้มง่าย ไหว้สวย รวยน้ำใจ ใฝ่คุณธรรม',
            alignment: 'left',
          },
        },
        {
          id: 'blk-hist-cta',
          type: 'cta',
          data: {
            title: 'ร่วมสืบสานคุณธรรมและการศึกษาชุมชน',
            description: 'โรงเรียนยินดีต้อนรับศิษย์เก่า ผู้ปกครอง และชุมชนบางน้ำวนทุกท่าน',
            buttonText: 'ติดต่อเรา',
            buttonUrl: '/contact',
          },
        },
      ],
    },
    {
      id: 'page-about-vision',
      slug: 'about-vision',
      title: 'วิสัยทัศน์ พันธกิจ และเป้าประสงค์',
      description: 'ทิศทางการจัดการศึกษาและค่านิยมของสถานศึกษา',
      blocks: [
        {
          id: 'blk-vis-hero',
          type: 'hero_banner',
          data: {
            badge: 'ทิศทางสถานศึกษา',
            title: 'วิสัยทัศน์ พันธกิจ\nและเป้าประสงค์',
            subtitle: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งมั่นสู่ความเป็นเลิศทางการศึกษา พัฒนาคนดีสู่สังคม',
            primaryButtonText: 'โครงสร้างการบริหาร',
            primaryButtonUrl: '/about/structure',
          },
        },
        {
          id: 'blk-vis-text-1',
          type: 'text_section',
          data: {
            title: 'วิสัยทัศน์สถานศึกษา (Vision)',
            content: '"โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งพัฒนาผู้เรียนให้มีคุณภาพตามมาตรฐาน มีทักษะในศตวรรษที่ 21 ควบคู่คุณธรรม จริยธรรม อนุรักษ์สิ่งแวดล้อมและวัฒนธรรมท้องถิ่น น้อมนำหลักปรัชญาของเศรษฐกิจพอเพียง สู่การเติบโตอย่างยั่งยืน"',
            alignment: 'center',
          },
        },
        {
          id: 'blk-vis-text-2',
          type: 'text_section',
          data: {
            title: 'พันธกิจ 5 ประการ (Missions)',
            content: '1. พัฒนาหลักสูตรสถานศึกษาและการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นสำคัญ พัฒนาทักษะแห่งศตวรรษที่ 21\n2. ปลูกฝังคุณธรรม จริยธรรม ค่านิยมที่พึงประสงค์ และความเป็นพลเมืองดีตามวิถีประชาธิปไตย\n3. ส่งเสริมการใช้เทคโนโลยีดิจิทัลและนวัตกรรมเพื่อการเรียนรู้และการบริหารจัดการ\n4. พัฒนาครูและบุคลากรทางการศึกษาให้มีความเชี่ยวชาญตามมาตรฐานวิชาชีพ\n5. สร้างความร่วมมือระหว่างโรงเรียน ครอบครัว ชุมชน และวัดบางน้ำวน ในการจัดการศึกษาอย่างยั่งยืน',
            alignment: 'left',
          },
        },
        {
          id: 'blk-vis-cta',
          type: 'cta',
          data: {
            title: 'ติดตามกิจกรรมและการพัฒนาผู้เรียน',
            description: 'ชมภาพกิจกรรม ข่าวสาร และผลงานของโรงเรียนวัดบางน้ำวน',
            buttonText: 'ข่าวประชาสัมพันธ์',
            buttonUrl: '/news',
          },
        },
      ],
    },
    {
      id: 'page-about-structure',
      slug: 'about-structure',
      title: 'โครงสร้างการบริหารสถานศึกษา',
      description: 'แผนผังและโครงสร้างการบริหารงาน 4 ฝ่าย',
      blocks: [
        {
          id: 'blk-struct-hero',
          type: 'hero_banner',
          data: {
            badge: 'การบริหารจัดการองค์กร',
            title: 'โครงสร้างการบริหารงาน\nสถานศึกษา',
            subtitle: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) บริหารงานตามหลักธรรมาภิบาลและการมีส่วนร่วม',
            primaryButtonText: 'ทำเนียบบุคลากร',
            primaryButtonUrl: '/about/staff',
          },
        },
        {
          id: 'blk-struct-text-1',
          type: 'text_section',
          data: {
            title: 'โครงสร้างการบริหารงาน 4 ฝ่ายหลัก',
            content: '1. ฝ่ายบริหารงานวิชาการ: พัฒนาหลักสูตรสถานศึกษา การจัดกระบวนการเรียนรู้ การวัดและประเมินผล\n2. ฝ่ายบริหารงานบุคคลและกิจการนักเรียน: ส่งเสริมวินัย คุณธรรม ระบบดูแลช่วยเหลือนักเรียน งานสภานักเรียน\n3. ฝ่ายบริหารงานงบประมาณและแผนงาน: แผนปฏิบัติการประจำปี บริหารจัดการงบประมาณและพัสดุ\n4. ฝ่ายบริหารงานทั่วไปและอาคารสถานที่: ดูแลรักษาอาคารสถานที่ สิ่งแวดล้อม ความปลอดภัย และประสานงานชุมชน',
            alignment: 'left',
          },
        },
        {
          id: 'blk-struct-staff',
          type: 'staff_cards',
          data: {
            title: 'คณะผู้บริหารและหัวหน้าฝ่าย',
            department: 'all',
            limit: 4,
          },
        },
        {
          id: 'blk-struct-cta',
          type: 'cta',
          data: {
            title: 'ติดต่อประสานงานฝ่ายบริหาร',
            description: 'สอบถามข้อมูลฝ่ายวิชาการ ธุรการ หรือการเงิน ได้ในวันและเวลาราชการ',
            buttonText: 'ติดต่อเรา',
            buttonUrl: '/contact',
          },
        },
      ],
    },
    {
      id: 'page-academic',
      slug: 'academic',
      title: 'งานวิชาการและหลักสูตรสถานศึกษา',
      description: 'หลักสูตรการศึกษาขั้นพื้นฐาน และระดับชั้นที่เปิดสอน',
      blocks: [
        {
          id: 'blk-acad-hero',
          type: 'hero_banner',
          data: {
            badge: 'Academic Excellence',
            title: 'หลักสูตรและการจัดการเรียนรู้\nโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
            subtitle: 'มุ่งเน้นการจัดการเรียนรู้เชิงรุก (Active Learning) พัฒนาทักษะชีวิต และ 8 กลุ่มสาระการเรียนรู้',
            primaryButtonText: 'ผลงานและความสำเร็จ',
            primaryButtonUrl: '/achievements',
          },
        },
        {
          id: 'blk-acad-text-1',
          type: 'text_section',
          data: {
            title: '8 กลุ่มสาระการเรียนรู้แกนกลาง',
            content: '1. กลุ่มสาระการเรียนรู้ภาษาไทย\n2. กลุ่มสาระการเรียนรู้คณิตศาสตร์\n3. กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี\n4. กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม\n5. กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา\n6. กลุ่มสาระการเรียนรู้ศิลปะ\n7. กลุ่มสาระการเรียนรู้การงานอาชีพ\n8. กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ (ภาษาอังกฤษ)\nพร้อมกิจกรรมพัฒนาผู้เรียน กิจกรรมแนะแนว ลูกเสือ-เนตรนารี และชุมนุมเสริมทักษะ',
            alignment: 'left',
          },
        },
        {
          id: 'blk-acad-text-2',
          type: 'text_section',
          data: {
            title: 'ระดับชั้นที่เปิดสอน',
            content: '• ระดับปฐมวัย: ชั้นอนุบาลปีที่ 1 - 3 (มุ่งพัฒนาการทั้ง 4 ด้าน ร่างกาย อารมณ์ สังคม สติปัญญา)\n• ระดับประถมศึกษา: ชั้นประถมศึกษาปีที่ 1 - 6 (เน้นการอ่านออกเขียนได้ คิดคำนวณ คิดวิเคราะห์ และทักษะศตวรรษที่ 21)',
            alignment: 'left',
          },
        },
        {
          id: 'blk-acad-docs',
          type: 'document_list',
          data: {
            title: 'เอกสารและคู่มือการเรียนรู้',
            category: 'academic',
            limit: 3,
          },
        },
        {
          id: 'blk-acad-cta',
          type: 'cta',
          data: {
            title: 'ระบบตรวจสอบผลการเรียนออนไลน์',
            description: 'นักเรียนและผู้ปกครองสามารถตรวจสอบผลการเรียนผ่านระบบ SGS ได้อย่างสะดวกรวดเร็ว',
            buttonText: 'เข้าสู่ระบบบริการออนไลน์',
            buttonUrl: '/e-service',
          },
        },
      ],
    },
    {
      id: 'page-achievements',
      slug: 'achievements',
      title: 'ผลงานและความภาคภูมิใจ',
      description: 'รางวัลและผลงานดีเด่นของนักเรียนและสถานศึกษา',
      blocks: [
        {
          id: 'blk-ach-hero',
          type: 'hero_banner',
          data: {
            badge: 'Awards & Pride',
            title: 'ผลงานและความภาคภูมิใจ\nโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
            subtitle: 'ความภาคภูมิใจจากความมุ่งมั่น ทุ่มเท ของคณะครู นักเรียน และชุมชนรอดพิทยาคม',
            primaryButtonText: 'ข่าวประชาสัมพันธ์',
            primaryButtonUrl: '/news',
          },
        },
        {
          id: 'blk-ach-text-1',
          type: 'text_section',
          data: {
            title: 'รางวัลและเกียรติยศเด่น',
            content: '• รางวัลเหรียญทอง การแข่งขันความเป็นเลิศทางวิชาการ ระดับเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร (ปีการศึกษา 2569)\n• สถานศึกษาดีเด่นด้านการส่งเสริมคุณธรรมและอัตลักษณ์วิถีพุทธ (ปีการศึกษา 2568)\n• รางวัลชนะเลิศ การประกวดมารยาทไทยและสวดมนต์หมู่สรรเสริญพระรัตนตรัย (ปีการศึกษา 2568)\n• รางวัลรองชนะเลิศอันดับ 1 การแข่งขันกีฬาและกรีฑานักเรียนกลุ่มโรงเรียน (ปีการศึกษา 2568)',
            alignment: 'left',
          },
        },
        {
          id: 'blk-ach-news',
          type: 'news_list',
          data: {
            title: 'ข่าวกิจกรรมและความสำเร็จล่าสุด',
            limit: 3,
            showCategoryBadge: true,
          },
        },
        {
          id: 'blk-ach-cta',
          type: 'cta',
          data: {
            title: 'ร่วมแสดงความยินดีกับตัวแทนนักเรียน',
            description: 'ติดตามข่าวสารความเคลื่อนไหวและภาพบรรยากาศการแข่งขันได้ที่หน้าข่าวสาร',
            buttonText: 'ชมข่าวสารทั้งหมด',
            buttonUrl: '/news',
          },
        },
      ],
    },
    {
      id: 'page-contact',
      slug: 'contact',
      title: 'ติดต่อโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
      description: 'ข้อมูลที่ตั้ง แผนที่ เบอร์โทรศัพท์ และแบบฟอร์มติดต่อ',
      blocks: [
        {
          id: 'blk-con-hero',
          type: 'hero_banner',
          data: {
            badge: 'Contact Information',
            title: 'ติดต่อโรงเรียนวัดบางน้ำวน\n(รอดพิทยาคม)',
            subtitle: 'ยินดีต้อนรับผู้ปกครอง ชุมชน และประชาชนทั่วไป สอบถามข้อมูลการศึกษาและประสานงานราชการ',
            primaryButtonText: 'ส่งข้อความติดต่อ',
            primaryButtonUrl: '#contact-form',
          },
        },
        {
          id: 'blk-con-text',
          type: 'text_section',
          data: {
            title: 'ข้อมูลสถานที่ตั้งและการติดต่อราชการ',
            content: 'ที่อยู่: เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000\nเบอร์โทรศัพท์: 034-490-XXX (วันและเวลาราชการ)\nอีเมล: contact@bnw.ac.th\nเวลาทำการ: วันจันทร์ - ศุกร์ เวลา 08.00 น. - 16.30 น. (ปิดทำการวันเสาร์ วันอาทิตย์ และวันหยุดนักขัตฤกษ์)',
            alignment: 'left',
          },
        },
        {
          id: 'blk-con-cta',
          type: 'cta',
          data: {
            title: 'ระบบบริการออนไลน์และการรับสมัครนักเรียน',
            description: 'สามารถยื่นใบสมัครเข้าศึกษาต่อหรือติดต่อบริการออนไลน์ผ่านหน้า E-Service',
            buttonText: 'บริการออนไลน์',
            buttonUrl: '/e-service',
          },
        },
      ],
    },
    {
      id: 'page-privacy',
      slug: 'privacy',
      title: 'นโยบายความเป็นส่วนตัว (PDPA)',
      description: 'ข้อกำหนดการคุ้มครองข้อมูลส่วนบุคคลตามพระราชบัญญัติ PDPA',
      blocks: [
        {
          id: 'blk-priv-hero',
          type: 'hero_banner',
          data: {
            badge: 'Data Protection & Privacy',
            title: 'นโยบายความเป็นส่วนตัว\n(Privacy Policy)',
            subtitle: 'แนวทางการคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562',
            primaryButtonText: 'กลับหน้าแรก',
            primaryButtonUrl: '/',
          },
        },
        {
          id: 'blk-priv-text',
          type: 'text_section',
          data: {
            title: 'ข้อกำหนดและนโยบายการคุ้มครองข้อมูลส่วนบุคคล',
            content: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) มุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของผู้เรียน ผู้ปกครอง และบุคลากรทางการศึกษา ข้อมูลที่จัดเก็บผ่านเว็บไซต์จะถูกใช้เฉพาะการบริหารจัดการการศึกษาและงานบริการสาธารณะของสถานศึกษาเท่านั้น มีการรักษาความปลอดภัยด้วยการเข้ารหัสข้อมูลและการควบคุมสิทธิ์การเข้าถึงอย่างเคร่งครัด หากมีข้อสอบถามสามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลได้ที่ contact@bnw.ac.th',
            alignment: 'left',
          },
        },
        {
          id: 'blk-priv-cta',
          type: 'cta',
          data: {
            title: 'มีคำถามเพิ่มเติมเกี่ยวกับข้อมูลส่วนบุคคล',
            description: 'ท่านสามารถติดต่อสอบถามเจ้าหน้าที่ของโรงเรียนวัดบางน้ำวนได้ตลอดเวลาทำการ',
            buttonText: 'ติดต่อเรา',
            buttonUrl: '/contact',
          },
        },
      ],
    },
  ];

  const now = new Date().toISOString();
  for (const page of additionalStandardPages) {
    const existing = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM pages WHERE slug = ?',
      args: [page.slug],
    });
    if (Number(existing.rows[0].count) === 0) {
      console.log(`[DB] กำลังลงทะเบียนหน้ามาตรฐาน: ${page.title} (/${page.slug})...`);
      await client.execute({
        sql: `INSERT INTO pages (id, slug, title, description, status, content, author_id, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          page.id,
          page.slug,
          page.title,
          page.description,
          'published',
          JSON.stringify(page.blocks),
          'usr-superadmin-01',
          now,
          now,
          now,
        ],
      });
    }
  }

  console.log('[DB] ระบบฐานข้อมูลและ Seed Data ดำเนินการเสร็จสมบูรณ์ 100%');
}

// เรียกทำงานทันทีเมื่อไฟล์ถูกสั่งรัน
runMigrationsAndSeed()
  .then(() => {
    console.log('Migration & Seed Finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.warn('Migration & Seed Warning (continuing build):', err.message || err);
    process.exit(0);
  });
