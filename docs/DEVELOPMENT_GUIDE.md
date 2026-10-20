# คู่มือนักพัฒนาและการติดตั้งระบบ (Development Guide)
## โครงการ BNW-001 V2: โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)

---

### 1. ความต้องการของระบบ (System Prerequisites)
- **ระบบปฏิบัติการ:** Windows 10/11, macOS, หรือ Linux
- **Node.js:** เวอร์ชัน 20.x, 22.x หรือ 24.x (ทดสอบและคอมไพล์ผ่านบน v24.21.0)
- **Package Manager:** `pnpm` (v11/v12) หรือ `npm`
- **พื้นที่ดิสก์ว่าง:** อย่างน้อย 1 GB

---

### 2. ขั้นตอนการติดตั้งและเริ่มใช้งานในเครื่อง (Local Setup)

1. **เข้าสู่โฟลเดอร์โปรเจกต์:**
   ```bash
   cd "D:\BNW Website"
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   pnpm install
   ```

3. **เตรียม Environment Variables:**
   คัดลอกไฟล์ `.env.example` ไปเป็น `.env`
   ```bash
   cp .env.example .env
   ```

4. **เตรียมและบันทึกฐานข้อมูลตั้งต้น (Database Migration & Seed):**
   ```bash
   pnpm db:seed
   ```
   คำสั่งนี้จะสร้างไฟล์ฐานข้อมูล `bnw_school.db` และลงทะเบียนตาราง, บัญชีผู้ดูแลเริ่มต้น 3 บัญชี, Theme เริ่มต้น, และข้อมูลหน้าแรกพร้อมบล็อก Page Builder 15 ประเภท

5. **รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server):**
   ```bash
   pnpm dev
   ```
   เปิดเบราว์เซอร์ที่: `http://localhost:3000`
   เข้าสู่ระบบผู้ดูแลที่: `http://localhost:3000/admin/login`

---

### 3. บัญชีผู้ใช้งานเริ่มต้นสำหรับทดสอบ (Seed Admin Accounts)

| บทบาท (Role) | อีเมล (Email) | รหัสผ่านเริ่มต้น | ระดับสิทธิ์ |
|---|---|---|---|
| **Super Admin** | `admin@bnw.ac.th` | `BnwAdmin2026!ChangeMe` | จัดการผู้ใช้, ธีม, กู้คืน, เผยแพร่ทั้งหมด |
| **Editor** | `editor@bnw.ac.th` | `BnwEditor2026!ChangeMe` | จัดการข่าว, ประกาศ, เผยแพร่เนื้อหา |
| **Author** | `author@bnw.ac.th` | `BnwAuthor2026!ChangeMe` | สร้าง/แก้ไขแบบร่าง (Draft) ห้ามเผยแพร่ตรง |

---

### 4. คำสั่งสำคัญในโปรเจกต์ (Key Commands)

| คำสั่ง | วัตถุประสงค์ |
|---|---|
| `pnpm dev` | รันเซิร์ฟเวอร์ทดสอบ (Hot Reload) |
| `pnpm build` | คอมไพล์โปรเจกต์เป็น Production Ready |
| `pnpm start` | รันเซิร์ฟเวอร์หลังผ่านการคอมไพล์ |
| `pnpm test` | รันชุดทดสอบอัตโนมัติ (Auth, DB, Builder, Security) |
| `pnpm db:seed` | ตรวจสอบโครงสร้างตารางและใส่ข้อมูลตั้งต้น |
| `pnpm exec tsx scripts/backup.ts` | สำรองไฟล์ฐานข้อมูลและ JSON snapshot |
| `pnpm exec tsx scripts/restore.ts` | ทดสอบกู้คืนข้อมูลในสภาพแวดล้อมแยก |

---

### 5. โครงสร้างโฟลเดอร์หลัก (Project Structure)
```
D:\BNW Website
├── backups/               # ไฟล์สำรองฐานข้อมูล .db และ .json
├── docs/                  # เอกสารคู่มือโครงการทั้งหมด (14 ไฟล์)
├── public/                # ไฟล์สถิต (โลโก้, favicon, uploads)
├── scripts/               # สคริปต์สำรองและกู้คืน (backup.ts, restore.ts)
├── src/
│   ├── app/
│   │   ├── (public)/      # เว็บไซต์สาธารณะ 18 หน้าหลัก
│   │   ├── admin/         # ระบบผู้ดูแล (Dashboard, CMS, Page Builder, Theme)
│   │   ├── api/           # API Endpoints (Auth, Pages, News, Botanical, etc.)
│   │   ├── globals.css    # Tailwind CSS และฟอนต์ภาษาไทย
│   │   └── layout.tsx     # Root Layout
│   ├── components/
│   │   ├── admin/         # UI Components ของฝั่งผู้ดูแล
│   │   ├── page-builder/  # ระบบบล็อก 15 ประเภท (Editor & Renderer)
│   │   └── public/        # Header, Footer, Breadcrumbs, ContactForm
│   ├── db/
│   │   ├── index.ts       # ไคลเอนต์ LibSQL / Drizzle ORM
│   │   ├── schema.ts      # โครงสร้างตารางฐานข้อมูล 14 ตาราง
│   │   └── migrate-and-seed.ts # ตัวติดตั้งฐานข้อมูลและ Seed Data
│   ├── lib/
│   │   ├── auth.ts        # การจัดการเซสชัน, Token และสิทธิ์ RBAC
│   │   ├── audit.ts       # ตัวบันทึก Audit Logs
│   │   ├── storage.ts     # การจัดการอัปโหลดไฟล์ (Local / R2)
│   │   └── utils.ts       # วันที่ไทย, ฟอร์แมตขนาดไฟล์
│   └── types/
│       └── page-builder.ts# ชนิดข้อมูลของ 15 บล็อกมาตรฐาน
└── tests/                 # ชุดทดสอบอัตโนมัติ (Auth, DB, Builder, Security)
```
