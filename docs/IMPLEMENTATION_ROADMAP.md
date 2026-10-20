# แผนผังการดำเนินงาน (Implementation Roadmap)
## โครงการ BNW-001 V2: โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)

---

### ระยะที่ 0: การสำรวจและออกแบบระบบ (Audit & Design) — [ดำเนินการเสร็จสิ้น]
- [x] ตรวจสอบไดรฟ์ D: สิทธิ์การเขียนไฟล์ และพื้นที่ว่าง (394 GB)
- [x] ตรวจสอบ `D:\BNW Website` พบว่าเป็นโฟลเดอร์ว่าง ปลอดภัย 100%
- [x] ตรวจสอบโปรเจกต์เดิม `C:\Users\cupch\Documents\bnw-school-website` (อ่านข้อมูลอ้างอิงเท่านั้น ไม่แก้ไข/ไม่ลบ)
- [x] ตรวจสอบสภาพแวดล้อม: Node.js v24.21.0, pnpm v11/v12, Git v2.56.0
- [x] ออกแบบสถาปัตยกรรมระบบ Unified Next.js 15 + Drizzle ORM + Cloudflare D1/R2
- [x] จัดทำเอกสารสถาปัตยกรรม การตัดสินใจทางเทคนิค และการวิเคราะห์ค่าใช้จ่ายฟรี

---

### ระยะที่ 1: การวางรากฐานโปรเจกต์และฐานข้อมูล (Infrastructure & Data Foundation) — [กำลังดำเนินการ]
- [x] ติดตั้ง Core Dependencies (Next.js 15, React 19, Tailwind CSS, Lucide React, Drizzle ORM, LibSQL, Jose, Bcryptjs)
- [x] ตั้งค่า TypeScript, Tailwind CSS (Navy/Gold tokens), PostCSS, Next Config, `.env.example`
- [ ] ออกแบบ Database Schema ครอบคลุม: Users, Sessions, Audit Logs, Pages, Theme Settings, News, Announcements, Events, Staff, Academic, Documents, E-Services, Botanical Garden, Media Files
- [ ] สร้าง Database Connection Layer & Migration Script
- [ ] สร้าง Seed Data / Bootstrap Script สำหรับ Admin บัญชีแรกและข้อมูลตั้งต้นที่เป็นกลาง

---

### ระยะที่ 2: ระบบความปลอดภัยและสิทธิ์ผู้ใช้ (Auth & Security Core)
- [ ] พัฒนา Session Management (Secure HTTP-Only Cookie)
- [ ] พัฒนาระบบ Login / Logout API และหน้าจอเข้าสู่ระบบ
- [ ] พัฒนาระบบ Role-Based Access Control (RBAC: Super Admin, Site Admin, Editor, Author)
- [ ] พัฒนา Audit Logging Middleware บันทึกทุกกิจกรรมสำคัญ
- [ ] ติดตั้ง Rate Limiting และ CSRF/XSS Protections

---

### ระยะที่ 3: ระบบจัดการเนื้อหาและคลังสื่อ (CMS Core & Media Library)
- [ ] พัฒนา Dashboard ผู้ดูแลระบบ (ภาพรวมสถิติ, เมนูจัดการ, บันทึกการทำงานล่าสุด)
- [ ] พัฒนาระบบจัดการเนื้อหา (สร้าง, แก้ไข, ลบ, สถานะ Draft, Scheduled, Published, Archived)
- [ ] พัฒนาระบบ Media Library (อัปโหลด, แสดงตัวอย่าง, จัดการ Alt Text, ตรวจสอบการอ้างอิงก่อนลบ)
- [ ] พัฒนา Theme Customizer (ปรับแต่งสี โลโก้ ข้อความหัวเว็บ ท้ายเว็บ โซเชียล และเมนู)

---

### ระยะที่ 4: ระบบ Visual Page Builder
- [ ] พัฒนา Schema และ Registry สำหรับ 15 Standard Blocks
- [ ] พัฒนา Page Builder Canvas พร้อม Drag & Drop / Reordering และ Block Property Inspector
- [ ] พัฒนา Live Preview Mode แสดงผลแบบเสมือนจริงในทันที
- [ ] พัฒนาระบบการบันทึก Draft และการเผยแพร่หน้าเว็บ (Publishing Workflow)
- [ ] พัฒนา Shared Block Renderer ที่แสดงผลตรงกันทั้งในโหมดแก้ไขและหน้าเว็บสาธารณะ

---

### ระยะที่ 5: โมดูลเฉพาะทางของโรงเรียน (School-Specific Modules)
- [ ] โมดูลข่าวประชาสัมพันธ์ (News)
- [ ] โมดูลประกาศโรงเรียน (Announcements)
- [ ] โมดูลปฏิทินกิจกรรม (Events)
- [ ] โมดูลทำเนียบบุคลากร (Staff Directory)
- [ ] โมดูลข้อมูลด้านวิชาการและหลักสูตร (Academic)
- [ ] โมดูลเอกสารดาวน์โหลด (Documents)
- [ ] โมดูลระบบบริการออนไลน์ (E-Service Links)
- [ ] โมดูลฐานข้อมูลสวนพฤกษศาสตร์โรงเรียน (Botanical Garden Database)

---

### ระยะที่ 6: เว็บไซต์สาธารณะ 18 หน้าหลัก (Public Website)
- [ ] พัฒนา Base Layout (Header, Navigation, Breadcrumbs, Footer, Mobile Drawer)
- [ ] พัฒนาทั้ง 18 หน้าตามข้อกำหนด (หน้าแรก, ข้อมูลโรงเรียน, ทำเนียบ, ข่าว, ประกาศ, ปฏิทิน, วิชาการ, ผลงาน, เอกสาร, แกลเลอรี, E-Service, สวนพฤกษศาสตร์, ติดต่อเรา, ค้นหา, นโยบายความเป็นส่วนตัว, 404 ฯลฯ)
- [ ] ปรับแต่ง Responsive Design, Accessibility (WCAG 2.1 AA), Image Optimization, SEO Metadata

---

### ระยะที่ 7: การทดสอบ การสำรองข้อมูล และเตรียมส่งมอบ (QA, Backup & Handover)
- [ ] เขียนและรัน Unit & Integration Tests (Auth, CMS, Page Builder, Schema Validation, API Endpoints)
- [ ] ทดสอบความเข้ากันได้ของการสำรองและกู้คืนฐานข้อมูล (Backup & Restore Script)
- [ ] รัน Typecheck, Lint และ Production Build ตรวจสอบให้ผ่าน 100%
- [ ] จัดทำเอกสารคู่มือภาษาไทยสำหรับครูและผู้ดูแลระบบ (`docs/ADMIN_USER_GUIDE_TH.md`, `docs/PAGE_BUILDER_GUIDE_TH.md`, `docs/FINAL_HANDOVER.md` ฯลฯ)
