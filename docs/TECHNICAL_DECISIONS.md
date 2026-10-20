# บันทึกการตัดสินใจทางเทคนิค (Technical Decisions Record - TDR)
## โครงการ BNW-001 V2: โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)

---

### TDR-001: การเปลี่ยนผ่านจาก Astro + Payload CMS (V1) สู่ Unified Next.js 15 Full-Stack (V2)

- **สถานะ:** อนุมัติ (Approved)
- **บริบทเดิม (V1):**
  ใน V1 มีการแยก Codebase เป็น Monorepo ระหว่าง `apps/web` (Astro สำหรับเว็บสาธารณะ) และ `apps/cms` (Payload CMS 3.x บน Next.js) ส่งผลให้:
  1. Payload CMS ต้องการ Node.js Container หรือเซิร์ฟเวอร์แบบ Always-on (Docker/Render/Fly.io) ซึ่งไม่สามารถทำงานบน Cloudflare Pages/Workers แบบ Serverless ได้โดยตรง ส่งผลให้ไม่สามารถบรรลุเป้าหมาย 0 บาท/เดือน
  2. การอัปเดตเนื้อหาใน CMS ไม่สามารถสะท้อนผลมายังหน้าเว็บสาธารณะแบบทันที ต้องอาศัยการ Rebuild เว็บหรือ Webhook
  3. เกิดความซับซ้อนในการประสานงานระหว่างบุคลากรและระบบ
- **การตัดสินใจ (V2):**
  พัฒนาด้วย Next.js 15 (App Router) ในสถาปัตยกรรมแบบ Unified Full-Stack ซึ่งรวมทั้งส่วนเว็บไซต์สาธารณะ ระบบ CMS ระบบ Visual Page Builder และระบบบริหารจัดการเข้าไว้ด้วยกันอย่างเป็นหนึ่งเดียว
- **ผลลัพธ์:**
  - ครูแก้ไขเนื้อหาหรือจัดบล็อกใน Page Builder และเห็นผลการแสดงผลทันทีแบบ Real-time
  - รันได้บน Cloudflare Pages / Workers โดยไม่ต้องใช้เซิร์ฟเวอร์ Docker หรือ VPS
  - ประหยัดงบประมาณเป็น 0 บาทต่อเดือนตามโควตาฟรี

---

### TDR-002: การเลือกฐานข้อมูล Cloudflare D1 ร่วมกับ Drizzle ORM

- **สถานะ:** อนุมัติ (Approved)
- **บริบท:**
  ระบบต้องการฐานข้อมูลที่มีความคงทน (Persistent), มี Schema และ Constraints ที่รัดกุม, รองรับความสัมพันธ์ระหว่างตาราง (Foreign Keys, Indexes), รองรับการค้นหาภาษาไทย และมีค่าใช้จ่ายฟรี
- **ทางเลือกที่พิจารณา:**
  1. *Supabase / Managed PostgreSQL:* มีโควตาฟรีแต่จำกัด และระบบจะหยุดทำงาน (Pause) หากไม่มีการใช้งานติดต่อกัน 7 วัน ซึ่งไม่เหมาะกับเว็บไซต์สถานศึกษา
  2. *Cloudflare D1 (SQLite Edge):* ฐานข้อมูล SQLite ที่ฝังตัวอยู่บน Cloudflare Edge มีโควตาอ่านฟรี 5 ล้านครั้ง/วัน เขียน 100,000 ครั้ง/วัน และไม่เคย Pause
- **การตัดสินใจ:**
  เลือกใช้ Cloudflare D1 ใน Production และใช้ LibSQL/SQLite ในสภาพแวดล้อม Development/Testing ผ่าน Drizzle ORM
- **ผลลัพธ์:**
  - โค้ด Schema และ Queries เป็น TypeScript แบบ Type-safe 100%
  - สภาพแวดล้อม Local และ Production ใช้ภาษา SQL เดียวกัน (SQLite Dialect) ไม่มีความคลาดเคลื่อนของ Schema

---

### TDR-003: สถาปัตยกรรม Visual Page Builder ด้วย 15 Standard Blocks

- **สถานะ:** อนุมัติ (Approved)
- **บริบท:**
  โรงเรียนต้องการระบบ Page Builder ที่ครูและบุคลากรสามารถจัดเรียงและปรับแต่งเนื้อหาได้เองโดยไม่ต้องเขียนโค้ด แต่ต้องไม่ซับซ้อนจนทำให้หน้าเว็บพังหรือเสียรูปแบบอัตลักษณ์ของโรงเรียน
- **การตัดสินใจ:**
  ออกแบบ Page Builder เป็นบล็อกมาตรฐานที่กำหนดคุณสมบัติไว้ล่วงหน้า (Structured Blocks) จำนวน 15 รูปแบบ ครอบคลุมทุกความต้องการของโรงเรียน:
  1. Hero Banner
  2. Text Section
  3. Image Single
  4. Image Gallery
  5. News List
  6. Announcement List
  7. Event List
  8. Staff Cards
  9. Document List
  10. Call to Action (CTA)
  11. Image Slider
  12. Divider
  13. Spacer
  14. Botanical Garden Highlights
  15. E-Service Links
- **ผลลัพธ์:**
  - ป้องกันปัญหา XSS หรือ CSS เพี้ยน เนื่องจากบล็อกถูก Render ผ่าน Components ที่ควบคุมความปลอดภัยแล้ว
  - ข้อมูลจัดเก็บเป็น JSON Schema ที่สามารถขยายและแก้ไขได้ในอนาคต

---

### TDR-004: กลยุทธ์การจัดเก็บไฟล์ (Media Storage)

- **สถานะ:** อนุมัติ (Approved)
- **บริบท:**
  การจัดเก็บภาพกิจกรรมและเอกสารทางการศึกษาต้องการความจุที่เพียงพอ และดาวน์โหลดได้รวดเร็วโดยไม่มีค่า Egress Bandwidth
- **การตัดสินใจ:**
  ใช้ Cloudflare R2 สำหรับระบบ Production โดยมี Local Storage Handler สำหรับโหมด Local Development และเขียน Storage Adapter ให้สลับการทำงานได้อัตโนมัติตามสภาพแวดล้อม
- **ผลลัพธ์:**
  - ไม่เสียค่าแบนด์วิดท์ในการดาวน์โหลดรูปภาพและเอกสารของโรงเรียน
  - การทดสอบในเครื่องไม่ต้องพึ่งพาคีย์ภายนอก
