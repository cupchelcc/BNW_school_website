# รายการตรวจสอบก่อนการเผยแพร่ระบบ (Deployment Pre-flight Checklist)
## โครงการ BNW-001 V2: โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)

---

### ข้อควรทราบสำคัญ (Critical Governance Notice)
> **[!IMPORTANT]**
> ตามข้อกำหนดของโครงการ BNW-001 V2 ระบบได้รับการเตรียมความพร้อมสำหรับการ Deploy สู่ Cloudflare อย่างสมบูรณ์แล้ว **แต่ห้ามดำเนินการกด Deploy ขึ้นระบบจริง, ห้ามเปลี่ยนค่า DNS ของโรงเรียน, และห้ามสร้างทรัพยากร Cloud ใด ๆ จนกว่าจะได้รับความเห็นชอบและอนุมัติอย่างเป็นทางการจากผู้บริหารสถานศึกษา**

---

### ตารางตรวจสอบความพร้อม (Pre-flight Verification Checklist)

| ลำดับ | รายการตรวจสอบ | สถานะ | รายละเอียดผลการตรวจสอบ |
|:---:|---|:---:|---|
| **1** | **Production Build Compilation** | ✅ ผ่าน 100% | คำสั่ง `pnpm build` สำเร็จ 100% รันได้ครบทั้ง 46 เส้นทาง (Static & Dynamic routes) ขนาด JS แรกเริ่มเพียง 118 kB |
| **2** | **Automated Test Suite** | ✅ ผ่าน 100% | ชุดทดสอบ 11 การทดสอบ ผ่านทั้งหมด (0 ล้มเหลว) ครอบคลุม Auth, RBAC, DB, Page Builder, Security |
| **3** | **Database Migration & Schema** | ✅ พร้อมใช้งาน | โครงสร้างตาราง 14 ตารางพร้อม Indexes และ Foreign Keys ทำงานบน SQLite/D1 โดยสมบูรณ์ |
| **4** | **Bootstrap & Initial Admin User** | ✅ พร้อมใช้งาน | มีระบบ Bootstrap Seed บัญชีผู้ดูแลที่ปลอดภัย รหัสผ่านเข้ารหัสด้วย Bcrypt |
| **5** | **Environment Variables Isolation** | ✅ พร้อมใช้งาน | มีไฟล์ `.env.example` ที่ไม่เปิดเผยข้อมูลความลับ และไฟล์ `.env` ถูกกันไว้ใน `.gitignore` |
| **6** | **RBAC Server-side Enforcement** | ✅ ผ่านการทดสอบ | ทดสอบแล้วว่า Author ไม่สามารถกด Publish ตรงได้ และ Guest เข้าถึงหน้า Admin ไม่ได้ |
| **7** | **Media Storage Handler** | ✅ พร้อมใช้งาน | รองรับ Local Upload สำหรับเครื่องทดสอบ และมีโครงสร้างรองรับ Cloudflare R2 สำหรับ Production |
| **8** | **Backup & Restore Verification** | ✅ ผ่านการทดสอบ | สคริปต์ `backup.ts` และ `restore.ts` ผ่านการรันจริง ข้อมูลถูกกู้คืนในฐานข้อมูลแยกอย่างครบถ้วน |
| **9** | **Domain & HTTPS Readiness** | ⏳ รออนุมัติ | เตรียมผูกโดเมนโรงเรียนกับ Cloudflare Universal SSL/TLS (ฟรีตลอดชีพ) |
| **10** | **Free Tier & Zero-Cost Compliance** | ✅ ตรวจสอบแล้ว | การใช้งานทั้งหมดอยู่ในขอบเขต Free Tier ของ Cloudflare (D1, R2, Pages/Workers) ค่าใช้จ่าย 0 บาท/เดือน |
| **11** | **คู่มือการใช้งานภาษาไทย** | ✅ พร้อมส่งมอบ | จัดทำเอกสารคู่มือครบถ้วนในโฟลเดอร์ `docs/` |

---

### สิ่งที่ต้องดำเนินการเมื่อได้รับอนุญาตให้ขึ้นระบบจริง (Future Deployment Steps)

เมื่อคณะกรรมการสถานศึกษาหรือผู้บริหารโรงเรียนมีมติอนุมัติการขึ้นระบบจริง ให้ปฏิบัติตามลำดับดังนี้:

1. **สร้าง Git Repository:**
   - นำโค้ดใน `D:\BNW Website` ส่งขึ้น GitHub Repository ของโรงเรียน (เช่น `bnw-school-v2`)
2. **สร้าง Cloudflare D1 Database บน Cloudflare Dashboard:**
   ```bash
   npx wrangler d1 create bnw-school-db
   ```
   นำ Database ID ไปใส่ในหน้าการตั้งค่า Cloudflare Pages
3. **รัน Migration ไปยัง Cloudflare D1 Production:**
   ```bash
   npx wrangler d1 execute bnw-school-db --remote --file=./drizzle/schema.sql
   ```
4. **สร้าง Cloudflare R2 Bucket สำหรับรูปภาพ:**
   - สร้าง Bucket ชื่อ `bnw-media` บน Cloudflare Dashboard
5. **เชื่อมต่อ Cloudflare Pages กับ GitHub:**
   - Build Command: `pnpm build`
   - Build Output Directory: `.next` (หรือ `@cloudflare/next-on-pages`)
   - กำหนด Environment Variables: `AUTH_SECRET`, `NODE_VERSION=22.12.0`, `PNPM_VERSION=11.26.0`
6. **ผูกชื่อโดเมนโรงเรียน:**
   - ตั้งค่า Custom Domain ใน Cloudflare Pages ไปยังโดเมนทางการของโรงเรียน (เช่น `www.bnw.ac.th`)
