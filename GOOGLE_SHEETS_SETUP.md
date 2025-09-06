# คู่มือการตั้งค่า Google Sheets Integration

## ขั้นตอนการตั้งค่า Google Apps Script

### 1. สร้าง Google Apps Script Project
1. ไปที่ [Google Apps Script](https://script.google.com/)
2. คลิก "New project"
3. ตั้งชื่อโปรเจค เช่น "Firebase to Sheets Integration"
4. คัดลอกโค้ดจากไฟล์ `google-apps-script.gs` ไปวางในโปรเจค

### 2. สร้าง Google Sheets
1. ไปที่ [Google Sheets](https://sheets.google.com/)
2. สร้าง Spreadsheet ใหม่
3. ตั้งชื่อ เช่น "P2P User Data"
4. คัดลอก **Spreadsheet ID** จาก URL (ส่วนระหว่าง `/d/` และ `/edit`)
   - ตัวอย่าง: `https://docs.google.com/spreadsheets/d/1qemalIVHWjZ_7uTrlyTZ6I1B9MqoD6gyyv9_E5fiOmQ/edit#gid=0`
   - Spreadsheet ID คือ: `1qemalIVHWjZ_7uTrlyTZ6I1B9MqoD6gyyv9_E5fiOmQ`

### 3. แก้ไขโค้ด Google Apps Script
1. ในไฟล์ Google Apps Script ที่สร้างไว้
2. แก้ไขบรรทัดที่มี `SPREADSHEET_ID` ให้เป็น ID ของ Google Sheets ที่สร้างไว้:
   ```javascript
   const SPREADSHEET_ID = '1qemalIVHWjZ_7uTrlyTZ6I1B9MqoD6gyyv9_E5fiOmQ';
   ```

### 4. Deploy Web App
1. ในหน้า Google Apps Script คลิก "Deploy" > "New deployment"
2. เลือก type เป็น "Web app"
3. ตั้งค่า:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. คลิก "Deploy"
5. คัดลอก **Web app URL** ที่ได้

### 5. อัปเดตไฟล์ firebase-to-sheets.js
1. เปิดไฟล์ `firebase-to-sheets.js`
2. แก้ไขบรรทัดที่ 2:
   ```javascript
   const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
   ให้เป็น URL ที่ได้จากขั้นตอนที่ 4

### 6. อัปเดตไฟล์ HTML
✅ **เสร็จสิ้นแล้ว** - ไฟล์ `register.html` และ `login.html` ได้รับการอัปเดตให้ใช้ Spreadsheet ID ของคุณแล้ว

## โครงสร้าง Google Sheets ที่จะถูกสร้างอัตโนมัติ

### Sheet "UserRegistrations"
- Column A: UID
- Column B: Display Name
- Column C: Email
- Column D: Student ID
- Column E: Team Color
- Column F: Provider
- Column G: Created At
- Column H: Timestamp

### Sheet "UserLogins"
- Column A: UID
- Column B: Email
- Column C: Display Name
- Column D: Provider
- Column E: Login Time
- Column F: User Agent
- Column G: Timestamp



### Sheet "BottleCollection"
- Column A: Timestamp
- Column B: Action
- Column C: User ID
- Column D: Display Name
- Column E: Email
- Column F: Bottles Added
- Column G: Total Bottles
- Column H: Today Bottles
- Column I: Weekly Bottles
- Column J: Points
- Column K: Location
- Column L: Device Type



## ฟังก์ชันที่ใช้ส่งข้อมูลไปยัง Google Sheets

### 1. sendUserRegistrationToSheets()
- ใช้ในหน้า `register.html`
- ส่งข้อมูลการลงทะเบียนไปยัง Sheet "UserRegistrations"

### 2. sendUserLoginToSheets()
- ใช้ในหน้า `login.html`
- ส่งข้อมูลการเข้าสู่ระบบไปยัง Sheet "UserLogins"

### 3. sendBottleDataToSheets() (ใหม่)
- ใช้ในหน้า `dashboard.html`
- ส่งข้อมูลการเก็บขวดไปยัง Sheet "BottleCollection"
- ทำงานอัตโนมัติเมื่อมีการเพิ่มขวดในระบบ

## การทดสอบ

1. **ทดสอบการลงทะเบียน**
   - ลองลงทะเบียนผู้ใช้ใหม่ในหน้า `register.html`
   - ตรวจสอบ Console ของเบราว์เซอร์ว่ามีข้อความ "Data sent to Google Sheets successfully"
   - ตรวจสอบ Google Sheets ว่ามีข้อมูลเพิ่มขึ้นใน Sheet "UserRegistrations"

2. **ทดสอบการเข้าสู่ระบบ**
   - ลองเข้าสู่ระบบในหน้า `login.html`
   - ตรวจสอบ Console และ Google Sheets ใน Sheet "UserLogins"

3. **ทดสอบการเก็บขวด (ใหม่)**
   - เข้าสู่ระบบและไปที่หน้า `dashboard.html`
   - รอให้ระบบจำลองการเก็บขวด (ทุก 12 วินาที)
   - ตรวจสอบ Console ว่ามีข้อความ "Bottle data sent to Google Sheets successfully"
   - ตรวจสอบ Google Sheets ว่ามีข้อมูลเพิ่มขึ้นใน Sheet "BottleCollection"

## หมายเหตุ

- ระบบจำลองการเก็บขวดจะทำงานทุก 12 วินาที (สำหรับการทดสอบ)
- ในการใช้งานจริง ควรเชื่อมต่อกับฮาร์ดแวร์จริงแทนการจำลอง
- ข้อมูลที่ส่งไปยัง Google Sheets จะรวมถึง: จำนวนขวดที่เพิ่ม, ขวดรวม, ขวดวันนี้, ขวดสัปดาห์นี้, คะแนน, และข้อมูลผู้ใช้

## การแก้ไขปัญหา

### ถ้าไม่มีข้อมูลใน Google Sheets
1. ตรวจสอบ Console ของเบราว์เซอร์ว่ามี error หรือไม่
2. ตรวจสอบว่า Web App URL ถูกต้อง
3. ตรวจสอบว่า Spreadsheet ID ถูกต้อง
4. ตรวจสอบว่า Google Apps Script มีสิทธิ์เข้าถึง Google Sheets

### ถ้ามี CORS Error
1. ตรวจสอบว่า Deploy Web App แล้วและตั้งค่า "Who has access" เป็น "Anyone"
2. ลองใช้ URL ใหม่จาก deployment ล่าสุด

### ถ้ามี Permission Error
1. ใน Google Apps Script ไปที่ "Executions" เพื่อดู error log
2. อาจต้องให้สิทธิ์เข้าถึง Google Sheets ใหม่

## ฟังก์ชันที่พร้อมใช้งาน

- `sendUserRegistrationToSheets()` - ส่งข้อมูลการลงทะเบียน
- `sendUserLoginToSheets()` - ส่งข้อมูลการเข้าสู่ระบบ
- `sendBottleDataToSheets()` - ส่งข้อมูลการเก็บขวด
- `configureGoogleSheets()` - ตั้งค่า Google Sheets URL และ ID
- `syncFirebaseToSheets()` - ซิงค์ข้อมูลจาก Firebase ทั้งหมด

## หมายเหตุ

- ข้อมูลจะถูกส่งไปยัง Google Sheets ทุกครั้งที่มีการลงทะเบียนหรือเข้าสู่ระบบ
- หากการส่งข้อมูลไป Google Sheets ล้มเหลว ระบบจะยังคงทำงานต่อไปได้ปกติ
- ข้อมูลจะถูกเก็บใน Firebase และ Google Sheets พร้อมกัน