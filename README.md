# 🍼 Bottle to Bonus - Real-time Bottle Counter System

ระบบนับขวดแบบ Real-time ด้วย Arduino R4, YOLO Detection, และ Firebase

## 📋 ส่วนประกอบของระบบ

### 🌐 **Web Application**
- `ลอง.html` - หน้าแรก (Landing Page)
- `login.html` - หน้าเข้าสู่ระบบ
- `register.html` - หน้าสมัครสมาชิก
- `reset-password.html` - หน้ารีเซ็ตรหัสผ่าน
- `dashboard.html` - หน้า Dashboard แสดงผล Real-time

### 🤖 **Hardware & AI**
- `arduino_firebase.ino` - โค้ด Arduino R4 WiFi
- `yolo_bottle_detection.py` - Python YOLO detection
- Arduino R4 WiFi
- กล้อง USB/IP Camera
- (Optional) Buzzer และ LED

### 📊 **Database**
- Firebase Authentication
- Firebase Realtime Database
- Firebase Firestore

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

### **ขั้นตอนที่ 2: ตั้งค่า Web Application**

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

### **ขั้นตอนที่ 3: ตั้งค่า Python YOLO Detection**

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

### **ขั้นตอนที่ 4: ตั้งค่า Arduino R4**

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

### **ขั้นตอนที่ 5: การเชื่อมต่อ Hardware**

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

### **Data Flow:**
```
1. กล้อง → YOLO Detection → ตรวจจับขวด
2. Python → Serial → ส่งสัญญาณไป Arduino
3. Arduino → WiFi → ส่งข้อมูลไป Firebase
4. Web Dashboard → Firebase → แสดงผล Real-time
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

## 🎯 Features

- ✅ **Real-time Detection** - YOLO AI ตรวจจับขวดแม่นยำ
- ✅ **Live Dashboard** - ดูข้อมูลแบบ Real-time
- ✅ **Multi-platform** - ใช้ได้ทั้ง Web และ Mobile
- ✅ **User Management** - ระบบจัดการผู้ใช้
- ✅ **Data Analytics** - สถิติและกราฟ
- ✅ **Offline Support** - ทำงานได้แม้ไม่มี Internet (บางส่วน)

---

## 📞 การติดต่อและสนับสนุน

หากมีปัญหาหรือข้อสงสัย สามารถติดต่อได้ที่:
- **Email:** [your-email@domain.com]
- **GitHub Issues:** [repository-link]

---

## 📄 License

MIT License - ใช้และแก้ไขได้อย่างอิสระ

---

**🌱 ร่วมกันรักษาสิ่งแวดล้อม หนึ่งขวดที่แยกวันนี้ คือ โลกที่สดใสในวันหน้า 🌍**
