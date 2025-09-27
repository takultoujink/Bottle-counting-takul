# YOLO Arduino Firebase Bridge v2.0

🎯 **P2P (Plastic to Point) Detection System** - ระบบตรวจจับขวดพลาสติกด้วย YOLO และส่งข้อมูลผ่าน Arduino R4 ไปยัง Firebase

## 📋 ภาพรวมระบบ

```
[กล้อง] → [YOLO Detection] → [Python Script] → [Arduino R4] → [Firebase]
                                     ↓
                              [LED/Buzzer Feedback]
```

## 🎯 วัตถุประสงค์หลัก
- ส่งเสริมการแยกขยะและรีไซเคิลขวดในโรงเรียน
- ติดตามจำนวนขวดที่เก็บได้แบบ Real-time
- สร้างแรงจูงใจผ่านระบบคะแนนสะสม
- เก็บข้อมูลสถิติเพื่อการวิเคราะห์และการแข่งขันระหว่างทีม
- นำเทคโนโลยี AI และ IoT มาใช้แก้ปัญหาสิ่งแวดล้อม

## 🎯 สำหรับนักพัฒนาใหม่ - เริ่มต้นที่นี่!

หากคุณเป็นนักพัฒนาใหม่ที่เข้ามาร่วมโปรเจกต์นี้ ยินดีต้อนรับ! 🎉

### 📚 ขั้นตอนการเริ่มต้น:
1. **อ่านเอกสารใน** `📁 01_Documentation/` - เพื่อทำความเข้าใจโปรเจกต์
2. **ตรวจสอบการตั้งค่าใน** `📁 08_Config/` - เพื่อติดตั้ง Dependencies
3. **ศึกษาโค้ดใน** `📁 02_AI_Detection/` และ `📁 03_Hardware/` - เพื่อเข้าใจระบบ
4. **ทดสอบ Web Dashboard ใน** `📁 04_Web_Dashboard/` - เพื่อดูผลลัพธ์

### ⚡ Quick Start Guide (เริ่มต้นด่วน):

```bash
# 1. ติดตั้ง Python Dependencies
pip install -r 08_Config/requirements.txt

# 2. รันระบบ YOLO Detection
python 02_AI_Detection/yolo_bottle_detection.py

# 3. เปิด Web Dashboard
# เปิดไฟล์ 04_Web_Dashboard/index.html ในเบราว์เซอร์

# 4. อัพโหลด Arduino Code
# เปิด 03_Hardware/arduino_yolo_firebase.ino ใน Arduino IDE
```

### 🎯 เป้าหมายการพัฒนาต่อ:
- 📖 อ่าน `01_Documentation/DEVELOPMENT_ROADMAP_3YEARS.md` สำหรับแผนระยะยาว
- 🔧 ใช้ Scripts ใน `07_Scripts/` สำหรับ Automation
- 🎨 ปรับแต่ง UI/UX ใน `06_Assets/` และ `04_Web_Dashboard/`

### 👥 สำหรับการทำงานเป็นทีม:

#### 🔍 หาไฟล์ที่ต้องการแก้ไข:
- **Frontend/UI** → `📁 04_Web_Dashboard/`
- **AI/Machine Learning** → `📁 02_AI_Detection/`
- **Hardware/IoT** → `📁 03_Hardware/`
- **Database/Backend** → `📁 05_Firebase_Config/`
- **Documentation** → `📁 01_Documentation/`

#### 📝 แนวทางการพัฒนา:
1. **อ่าน README.md ในแต่ละโฟลเดอร์** ก่อนเริ่มแก้ไข
2. **ทดสอบระบบ** ด้วย Scripts ใน `📁 07_Scripts/`
3. **อัปเดตเอกสาร** เมื่อเพิ่มฟีเจอร์ใหม่
4. **ใช้ Config Files** ใน `📁 08_Config/` สำหรับการตั้งค่า

#### ⚠️ ข้อควรระวัง:
- ตรวจสอบ `requirements.txt` ก่อนติดตั้ง Dependencies ใหม่
- ทดสอบ Firebase Connection ก่อน Deploy
- สำรองข้อมูลก่อนแก้ไข Hardware Code

---

## 📁 สารบัญโครงสร้างโปรเจกต์

โปรเจกต์นี้ได้รับการจัดระเบียบเป็นโฟลเดอร์ต่างๆ ตามหน้าที่การทำงาน:

```
📁 01_Documentation/          # เอกสารและคู่มือทั้งหมด
📁 02_AI_Detection/           # ระบบ AI และ YOLO Detection
📁 03_Hardware/               # โค้ด Arduino และฮาร์ดแวร์
📁 04_Web_Dashboard/          # Web Application และ Dashboard
📁 05_Firebase_Config/        # การตั้งค่า Firebase และฐานข้อมูล
📁 06_Assets/                 # ไฟล์สื่อ รูปภาพ และ Fonts
📁 07_Scripts/                # Scripts สำหรับการจัดการระบบ
📁 08_Config/                 # ไฟล์การตั้งค่าและ Dependencies
```

### 🗂️ คู่มือการใช้งานแต่ละโฟลเดอร์:

| โฟลเดอร์ | วัตถุประสงค์ | เริ่มต้นที่ไฟล์ | สำคัญระดับ |
|---------|-------------|----------------|-----------|
| 📚 **01_Documentation** | เอกสาร แผนการพัฒนา คู่มือ | `README.md` | ⭐⭐⭐ |
| 🤖 **02_AI_Detection** | ระบบ YOLO และ AI Detection | `yolo_bottle_detection.py` | ⭐⭐⭐ |
| 🔧 **03_Hardware** | Arduino และ IoT Hardware | `arduino_yolo_firebase.ino` | ⭐⭐⭐ |
| 🌐 **04_Web_Dashboard** | Frontend และ Web Interface | `index.html` | ⭐⭐ |
| 🔥 **05_Firebase_Config** | Database และ Backend Config | `firebase-config.js` | ⭐⭐ |
| 🎨 **06_Assets** | รูปภาพ Fonts และสื่อ | `README.md` | ⭐ |
| 🔧 **07_Scripts** | Automation และ Deployment | `start_system.bat` | ⭐⭐ |
| ⚙️ **08_Config** | Dependencies และ Settings | `requirements.txt` | ⭐⭐⭐ |

### 📋 รายละเอียดแต่ละโฟลเดอร์

#### 📚 **01_Documentation** - เอกสารและคู่มือ
- แผนการพัฒนา 3 ปี และเอกสารเทคนิค
- คู่มือการติดตั้งและแก้ไขปัญหา
- เอกสารการใช้งาน Google Sheets และ Git LFS

#### 🤖 **02_AI_Detection** - ระบบ AI Detection
- `yolo_bottle_detection.py` - ระบบตรวจจับขวดด้วย YOLO AI
- OpenCV และ YOLO v3 model
- ตรวจจับขวดจากกล้อง USB/IP Camera
- ส่งสัญญาณไป Arduino เมื่อพบขวด

#### 🔧 **03_Hardware** - Hardware และ Arduino
- `arduino_firebase.ino` - โค้ด Arduino R4 WiFi
- Arduino R4 WiFi, กล้อง USB/IP Camera
- LED และ Buzzer แจ้งเตือน
- Serial Communication

#### 🌐 **04_Web_Dashboard** - Web Application
- `index.html` - หน้าแรก (Landing Page)
- `login.html` - หน้าเข้าสู่ระบบ
- `register.html` - หน้าสมัครสมาชิก
- `reset-password.html` - หน้ารีเซ็ตรหัสผ่าน
- `dashboard.html` - หน้า Dashboard แสดงผล Real-time
- `form.html` - ฟอร์มเพิ่มเติม

#### 🔥 **05_Firebase_Config** - Firebase และฐานข้อมูล
- Firebase Authentication - จัดการผู้ใช้
- Firebase Realtime Database - เก็บข้อมูล Real-time
- Firebase Firestore - เก็บข้อมูลผู้ใช้และสถิติ
- `firebase-to-sheets.js` - ระบบส่งข้อมูลไป Google Sheets
- `google-apps-script.gs` - Google Apps Script สำหรับรับข้อมูล

#### 🎨 **06_Assets** - ไฟล์สื่อและทรัพยากร
- รูปภาพ, ไอคอน และกราฟิก
- Fonts และ Typography
- ไฟล์เสียงและสื่อมัลติมีเดีย

#### 🔧 **07_Scripts** - Scripts และเครื่องมือ
- `check_firebase_domains.html` - เครื่องมือตรวจสอบ Firebase domains
- `fix_netlify_firebase.bat` - Script แก้ไขปัญหา Netlify deployment
- `setup_git_lfs.bat` - Script ตั้งค่า Git LFS สำหรับไฟล์ขนาดใหญ่
- Scripts สำหรับการจัดการและรันระบบ

#### ⚙️ **08_Config** - การตั้งค่าและ Dependencies
- `requirements.txt` - Python Dependencies
- ไฟล์การตั้งค่า YOLO และ Arduino
- Template การตั้งค่าต่างๆ

---

## 🚀 วิธีติดตั้งและใช้งาน

### **ขั้นตอนที่ 1: ตั้งค่า Firebase**

1. **สร้าง Firebase Project:**
   - ไปที่ [Firebase Console](https://console.firebase.google.com/)
   - สร้าง Project ใหม่
   - เลือก region: `asia-southeast1`

2. **เปิดใช้ Services:**
   ```
   Authentication > Sign-in method > Email/Password ✅
   Realtime Database > Create Database > Test mode ✅
   Firestore Database > Create Database > Test mode ✅
   ```

3. **ได้ Firebase Config:**
   - ไปที่ Project Settings > General
   - เลื่อนลงหา "Your apps" > Web App
   - คัดลอก `firebaseConfig`

### **ขั้นตอนที่ 2: ตั้งค่า Google Sheets Integration**

1. **ตั้งค่า Google Sheets:**
   - ดูคู่มือใน `GOOGLE_SHEETS_SETUP.md`
   - สร้าง Google Apps Script
   - สร้าง Google Sheets สำหรับเก็บข้อมูล
   - Deploy Web App และได้ URL

2. **อัปเดตไฟล์ firebase-to-sheets.js:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
   const DEFAULT_GOOGLE_SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```

### **ขั้นตอนที่ 3: ตั้งค่า Web Application**

1. **อัพเดท Firebase Config** ในไฟล์เหล่านี้:
   ```javascript
   // ในไฟล์ login.html, register.html, reset-password.html, dashboard.html
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     // ... config อื่นๆ
   };
   ```

2. **เปิดใช้ Realtime Database:**
   - เพิ่ม `databaseURL` ใน config:
   ```javascript
   databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app"
   ```

3. **Deploy Web App:**
   - Upload ไฟล์ทั้งหมดไปยัง Web Server
   - หรือใช้ Firebase Hosting

### **ขั้นตอนที่ 4: ตั้งค่า Python YOLO Detection**

1. **ติดตั้ง Dependencies:**
   ```bash
   pip install opencv-python numpy pyserial requests
   ```

2. **Download YOLO Files:**
   - รันโค้ด Python จะดาวน์โหลดอัตโนมัติ
   - หรือดาวน์โหลดด้วยตนเอง:
     - [YOLOv3 Weights](https://pjreddie.com/media/files/yolov3.weights) (247 MB)
     - [YOLOv3 Config](https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3.cfg)
     - [COCO Names](https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names)

3. **แก้ไข Configuration:**
   ```python
   ARDUINO_PORT = 'COM3'  # เปลี่ยนตาม port ของ Arduino
   CAMERA_INDEX = 0       # เปลี่ยนตาม camera
   USER_ID = "takultoujink"  # จาก Firebase Authentication
   ```

### **ขั้นตอนที่ 5: ตั้งค่า Arduino R4**

1. **ติดตั้ง Libraries:**
   ```
   Arduino IDE > Library Manager:
   - WiFi (built-in)
   - ArduinoHttpClient
   - ArduinoJson
   ```

2. **แก้ไข Configuration:**
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* userId = "USER_ID_FROM_WEB";
   ```

3. **อัพโหลดโค้ด:**
   - เชื่อมต่อ Arduino R4 กับ USB
   - อัพโหลดโค้ด `arduino_firebase.ino`

### **ขั้นตอนที่ 6: การเชื่อมต่อ Hardware**

1. **Pin Connections:**
   ```
   Arduino R4:
   - Pin 2: รับสัญญาณจาก YOLO detection
   - Pin LED_BUILTIN: LED แสดงสถานะ
   - Pin 8: Buzzer (optional)
   ```

2. **การเชื่อมต่อ:**
   ```
   Computer (YOLO) → USB/Serial → Arduino R4 → WiFi → Firebase
   ```

---

## 🔄 การทำงานของระบบ

## 🏗️ สถาปัตยกรรมระบบ

### **Data Flow:**
```
1. กล้อง → YOLO Detection → ตรวจจับขวด
2. Python → Serial Communication → ส่งสัญญาณไป Arduino
3. Arduino R4 → WiFi → ส่งข้อมูลไป Firebase
4. Web Dashboard → Firebase → แสดงผล Real-time
5. Firebase → Google Sheets → บันทึกข้อมูลสำหรับวิเคราะห์
```

### **System Architecture:**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Camera    │───▶│ YOLO AI      │───▶│  Arduino R4 │
│             │    │ Detection    │    │    WiFi     │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ Google      │◀───│   Firebase   │◀───│  Web App    │
│ Sheets      │    │   Database   │    │ Dashboard   │
└─────────────┘    └──────────────┘    └─────────────┘
```

### **Database Structure:**
```
Firebase Realtime Database:
/live_count/
  └── {userId}: จำนวนขวดปัจจุบัน

/bottles/
  └── {userId}/
      ├── total: จำนวนขวดทั้งหมด
      ├── today: จำนวนขวดวันนี้
      ├── weekly: จำนวนขวดสัปดาห์นี้
      ├── points: คะแนนสะสม
      ├── lastUpdated: เวลาอัพเดทล่าสุด
      └── history/
          └── {timestamp}/
              ├── count: จำนวนขวดที่เพิ่ม
              ├── points: คะแนนที่ได้
              └── timestamp: เวลา
```

---

## 🛠️ การแก้ไขปัญหา

### **ปัญหาที่อาจพบ:**

1. **Arduino ไม่เชื่อมต่อ WiFi:**
   - ตรวจสอบ SSID และ Password
   - ตรวจสอบ WiFi 2.4GHz (Arduino R4 ไม่รองรับ 5GHz)

2. **YOLO ตรวจจับไม่ได้:**
   - ตรวจสอบ Camera
   - ปรับแสง
   - ตรวจสอบ YOLO files

3. **Firebase Error:**
   - ตรวจสอบ Internet connection
   - ตรวจสอบ Firebase Rules
   - ตรวจสอบ Firebase Config

4. **Serial Communication Error:**
   - ตรวจสอบ COM Port
   - ตรวจสอบ Baud Rate
   - ปิดโปรแกรมอื่นที่ใช้ Serial

---

## 📱 การใช้งาน

### **สำหรับผู้ใช้:**
1. เข้าไปที่เว็บไซต์
2. สมัครสมาชิก/เข้าสู่ระบบ
3. ดู Dashboard จำนวนขวดแบบ Real-time

### **สำหรับผู้ดูแลระบบ:**
1. รัน Python YOLO detection
2. ตรวจสอบ Arduino connection
3. Monitor Firebase Database

---

## 🛠️ เทคโนโลยีที่ใช้

### **Frontend:**
- HTML5, CSS3, JavaScript
- Firebase SDK
- AOS Animation Library
- Responsive Design

### **AI & Computer Vision:**
- Python
- OpenCV
- YOLO v3 (You Only Look Once)
- NumPy

### **Hardware:**
- Arduino R4 WiFi
- USB/IP Camera
- LED, Buzzer
- Serial Communication

### **Backend & Database:**
- Firebase Authentication
- Firebase Realtime Database
- Firebase Firestore
- Google Apps Script
- Google Sheets API

---

## 🎯 Features หลัก

- ✅ **Real-time Detection** - ตรวจจับขวดด้วย AI แม่นยำ
- ✅ **Live Dashboard** - ดูข้อมูลแบบ Real-time
- ✅ **User Management** - ระบบจัดการผู้ใช้
- ✅ **Points System** - ระบบคะแนนสะสม
- ✅ **Team Competition** - แข่งขันระหว่างทีม (สีต่างๆ)
- ✅ **Data Analytics** - สถิติและกราฟ
- ✅ **Google Sheets Integration** - บันทึกข้อมูลอัตโนมัติ
- ✅ **Multi-platform** - ใช้ได้ทั้ง Web และ Mobile
- ✅ **Offline Support** - ทำงานได้แม้ไม่มี Internet (บางส่วน)

---

## 🎯 กลุ่มเป้าหมาย
- นักเรียน นักศึกษา
- โรงเรียน สถาบันการศึกษา
- องค์กรที่ต้องการส่งเสริมการรีไซเคิล
- ชุมชนที่ต้องการแก้ปัญหาขยะพลาสติก

---

## 📊 Google Sheets Integration

### **Sheets ที่ถูกสร้างอัตโนมัติ:**

1. **UserRegistrations Sheet:**
   - UID, Display Name, Email, Student ID
   - Team Color, Provider, Created At

2. **UserLogins Sheet:**
   - UID, Email, Display Name, Provider
   - Login Time, User Agent

3. **BottleCollection Sheet:**
   - Timestamp, Action, User ID, Display Name
   - Bottles Added, Total Bottles, Points
   - Location, Device Type

### **ฟังก์ชันที่พร้อมใช้งาน:**
- `sendUserRegistrationToSheets()` - ส่งข้อมูลการลงทะเบียน
- `sendUserLoginToSheets()` - ส่งข้อมูลการเข้าสู่ระบบ
- `sendBottleDataToSheets()` - ส่งข้อมูลการเก็บขวด
- `configureGoogleSheets()` - ตั้งค่า Google Sheets URL และ ID
- `syncFirebaseToSheets()` - ซิงค์ข้อมูลจาก Firebase ทั้งหมด

---

## 📞 การติดต่อและสนับสนุน

หากมีปัญหาหรือข้อสงสัย สามารถติดต่อได้ที่:
- **Email:** [your-email@domain.com]
- **GitHub Issues:** [repository-link]

---

## 🚀 การแก้ไขปัญหา Netlify Deployment

### ❌ ปัญหา: Firebase Authentication Error บน Netlify
```
Firebase: Error (auth/unauthorized-domain)
```

### ✅ วิธีแก้ไข:

#### 🔧 วิธีที่ 1: ใช้เครื่องมือตรวจสอบอัตโนมัติ
```bash
# เปิด Firebase Domain Checker
fix_netlify_firebase.bat
```

#### 🔧 วิธีที่ 2: แก้ไขด้วยตนเอง
1. **เปิด Firebase Console:**
   - ไปที่ [Firebase Console](https://console.firebase.google.com/project/takultoujink/authentication/settings)
   - เลือกโปรเจค `takultoujink`
   - ไปที่ **Authentication** → **Settings**

2. **เพิ่ม Authorized Domains:**
   ```
   your-app.netlify.app
   localhost
   127.0.0.1
   takultoujink.firebaseapp.com
   ```

3. **รอและทดสอบ:**
   - รอ 5-10 นาที ให้การตั้งค่าอัปเดต
   - รีเฟรชหน้าเว็บ
   - ลองเข้าสู่ระบบใหม่

#### 📚 เอกสารเพิ่มเติม:
- `NETLIFY_FIREBASE_SETUP.md` - คู่มือแก้ไขปัญหาละเอียด
- `TROUBLESHOOTING_FIREBASE.md` - คู่มือแก้ไขปัญหา Firebase ทั่วไป
- `check_firebase_domains.html` - เครื่องมือตรวจสอบ domains

---

## 📦 การแก้ไขปัญหาไฟล์ขนาดใหญ่ (Git LFS)

### ❌ ปัญหา: GitHub Large File Error
```
remote: error: File ssvid.net--Fallout-TV-Show-All-Songs.mp3 is 101.59 MB; this exceeds GitHub's file size limit of 100.00 MB
remote: error: GH001: Large files detected. You may want to try Git Large File Storage
```

### ✅ วิธีแก้ไข:

#### 🔧 วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ)
```bash
# รันสคริปต์แก้ไขปัญหาอัตโนมัติ
setup_git_lfs.bat
```

#### 🔧 วิธีที่ 2: แก้ไขด้วยตนเอง
1. **ติดตั้ง Git LFS:**
   - ดาวน์โหลดจาก [git-lfs.github.com](https://git-lfs.github.com/)
   - รันคำสั่ง: `git lfs install`

2. **ตั้งค่า LFS tracking:**
   ```bash
   git lfs track "*.mp3"
   git lfs track "*.wav"
   git lfs track "*.mp4"
   git add .gitattributes
   ```

3. **Migrate ไฟล์ที่มีอยู่:**
   ```bash
   git lfs migrate import --include="*.mp3" --everything
   git push origin main
   ```

#### 📚 เอกสารเพิ่มเติม:
- `GIT_LFS_GUIDE.md` - คู่มือการใช้งาน Git LFS ละเอียด
- `setup_git_lfs.bat` - Script ตั้งค่าอัตโนมัติ

---

## 📄 License

MIT License - ใช้และแก้ไขได้อย่างอิสระ

---

## 🌱 ผลกระทบเชิงบวก
- ส่งเสริมจิตสำนึกด้านสิ่งแวดล้อม
- ลดขยะพลาสติกในโรงเรียน
- สร้างนิสัยการแยกขยะ
- เพิ่มแรงจูงใจผ่านระบบคะแนน
- สร้างการแข่งขันเชิงบวกระหว่างทีม
- นำเทคโนโลยีมาใช้แก้ปัญหาสิ่งแวดล้อม

---

## 🚀 การพัฒนาต่อยอด
- เพิ่มการตรวจจับขยะประเภทอื่นๆ
- ระบบแลกของรางวัล
- Mobile Application
- Dashboard สำหรับผู้ดูแลระบบ
- การวิเคราะห์ข้อมูลขั้นสูง
- Integration กับระบบโรงเรียน

---

**🌱 ร่วมกันรักษาสิ่งแวดล้อม หนึ่งขวดที่แยกวันนี้ คือ โลกที่สดใสในวันหน้า 🌍**

**P2P - Plastic to Points: เปลี่ยนขยะเป็นคะแนน เปลี่ยนโลกให้สวยงาม** ♻️
