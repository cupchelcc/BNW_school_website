# คู่มือการสำรองและกู้คืนข้อมูล (Backup and Restore Guide)
## โครงการ BNW-001 V2: โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)

---

### 1. วัตถุประสงค์
เอกสารนี้อธิบายขั้นตอนการสำรองข้อมูล (Backup) และการกู้คืนข้อมูล (Restore) ทั้งไฟล์ฐานข้อมูล SQLite/D1 คลังรูปภาพ และการตั้งค่าระบบ โดยมุ่งเน้นความปลอดภัย ป้องกันข้อมูลสูญหาย และห้ามทำลายข้อมูล Production เดิมโดยเด็ดขาด

---

### 2. นโยบายการสำรองข้อมูล (Backup Strategy)
1. **สำรองไฟล์ฐานข้อมูลดิบ (.db):** คัดลอกฐานข้อมูล SQLite ทั้งก้อน โดยไม่หยุดการทำงานของระบบ
2. **สำรองแบบแยกตาราง (Structured JSON Snapshot):** บันทึกข้อมูลแยกตามตาราง (Users, Theme, Pages, News, Announcements, Botanical Plants, Staff ฯลฯ) พร้อมวันที่และเวลาในรูปแบบ ISO 8601
3. **จัดเก็บในโฟลเดอร์แยก:** บันทึกไว้ในโฟลเดอร์ `backups/` และแนะนำให้ดาวน์โหลดเก็บไว้ในหน่วยความจำสำรองภายนอกโรงเรียนหรือ Google Drive สหกรณ์โรงเรียนทุกสัปดาห์

---

### 3. ขั้นตอนการสำรองข้อมูล (Manual & Automated Backup)

รันคำสั่งสำรองข้อมูลผ่าน Terminal:
```bash
pnpm exec tsx scripts/backup.ts
```

**ผลลัพธ์ที่จะได้:**
- ไฟล์ฐานข้อมูล: `backups/bnw_school_YYYY-MM-DDTHH-mm-ss.db`
- ไฟล์ JSON Snapshot: `backups/bnw_data_snapshot_YYYY-MM-DDTHH-mm-ss.json`

---

### 4. ขั้นตอนการทดสอบกู้คืนข้อมูลในสภาพแวดล้อมแยก (Restore Test Protocol)

ตามกฎความปลอดภัยของระบบ **ห้ามกู้คืนข้อมูลทับ Production โดยตรงเป็นอันขาด** การทดสอบกู้คืนต้องทำในสภาพแวดล้อมแยก (Isolated Environment) เสมอ

รันคำสั่งทดสอบกู้คืน:
```bash
pnpm exec tsx scripts/restore.ts
```

**กระบวนการทำงานของสคริปต์:**
1. ค้นหาไฟล์สำรอง `.db` ล่าสุดในโฟลเดอร์ `backups/`
2. จำลองการกู้คืนลงฐานข้อมูลชั่วคราว `bnw_school_restore_test.db`
3. รันคำสั่ง SQL Query ตรวจสอบความถูกต้องและจำนวนระเบียนของตารางสำคัญ (Users, Pages, News, Botanical Plants)
4. ยืนยันความสมบูรณ์ 100% แล้วล้างไฟล์ทดสอบชั่วคราวออก

---

### 5. แนวทางสำหรับ Cloudflare D1 ในระบบ Production
เมื่อนำขึ้น Cloudflare Pages / Workers:
- ใช้คำสั่ง Cloudflare Wrangler CLI:
  ```bash
  npx wrangler d1 export <DATABASE_NAME> --remote --output=./backups/d1_export.sql
  ```
- ในกรณีต้องการกู้คืน (ต้องได้รับอนุมัติเป็นลายลักษณ์อักษร):
  ```bash
  npx wrangler d1 execute <DATABASE_NAME> --remote --file=./backups/d1_export.sql
  ```
