# YOLOv11 Arduino Firebase Bridge v3.0

🎯 **P2P (Plastic to Point) Detection System** - ระบบตรวจจับขวดพลาสติกด้วย YOLOv11 เชื่อมต่อ Arduino และ Firebase

## 📋 สารบัญ

- [ภาพรวมระบบ](#ภาพรวมระบบ)
- [ความต้องการของระบบ](#ความต้องการของระบบ)
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า](#การตั้งค่า)
- [การใช้งาน](#การใช้งาน)
- [ไฟล์ในระบบ](#ไฟล์ในระบบ)
- [การแก้ไขปัญหา](#การแก้ไขปัญหา)
- [การปรับแต่ง](#การปรับแต่ง)

## 🎯 ภาพรวมระบบ

ระบบนี้เป็นการปรับปรุงจากโค้ดเดิมให้รองรับ **YOLOv11** (เวอร์ชันล่าสุด) พร้อมฟีเจอร์ครบครัน:

### 🔄 กระบวนการทำงาน
```
📹 กล้อง → 🤖 YOLOv11 → 🔍 ตรวจจับขวด → 📡 Arduino → 🔥 Firebase
                ↓
            💡 LED + 🔊 Buzzer
```

### ✨ ฟีเจอร์หลัก
- 🤖 **YOLOv11** - AI model ล่าสุดสำหรับตรวจจับวัตถุ
- 📱 **Real-time Detection** - ตรวจจับขวดแบบเรียลไทม์
- 🔌 **Arduino Integration** - เชื่อมต่อ Arduino ผ่าน Serial
- 🔥 **Firebase Sync** - บันทึกข้อมูลลง Firebase แบบอัตโนมัติ
- 💡 **Hardware Control** - ควบคุม LED และ Buzzer
- 📊 **Statistics** - นับจำนวนขวดและคำนวณคะแนน
- ⌨️ **Keyboard Controls** - ควบคุมระบบด้วยคีย์บอร์ด

## 💻 ความต้องการของระบบ

### 🐍 Python Requirements
- Python 3.8 หรือใหม่กว่า
- Webcam หรือกล้อง USB
- RAM อย่างน้อย 4GB (แนะนำ 8GB)

### 🤖 Arduino Requirements
- Arduino R4 WiFi (หรือ Arduino ที่รองรับ WiFi)
- LED (built-in pin 13)
- Buzzer (pin 8)
- สาย USB สำหรับเชื่อมต่อ

### 🔥 Firebase Requirements
- Firebase Realtime Database
- Internet connection

## 📦 การติดตั้ง

### 1. ติดตั้ง Python Dependencies

```bash
# ติดตั้ง packages ที่จำเป็น
pip install -r requirements_yolo_v11.txt

# หรือติดตั้งทีละตัว
pip install ultralytics opencv-python pyserial requests numpy
```

### 2. ดาวน์โหลด YOLOv11 Model

```bash
# สร้างโฟลเดอร์สำหรับ model
mkdir yolo
cd yolo

# ดาวน์โหลด pre-trained model (เลือกขนาดที่เหมาะสม)
wget https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8n.pt
# หรือ
wget https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8s.pt
```

**หรือใช้ custom model ของคุณเอง:**
- วาง `.pt` file ในโฟลเดอร์เดียวกับ script
- แก้ไข `MODEL_PATH` ใน config

### 3. อัปโหลด Arduino Code

1. เปิด Arduino IDE
2. เปิดไฟล์ `arduino_yolo_v11_firebase.ino`
3. แก้ไข WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
4. อัปโหลดไปยัง Arduino

## ⚙️ การตั้งค่า

### 1. แก้ไข Configuration ใน Python

แก้ไขไฟล์ `yolo_v11_arduino_firebase.py` ในส่วน `Config` class:

```python
class Config:
    # Arduino Settings
    ARDUINO_PORT = "COM5"          # เปลี่ยนตาม COM port ของคุณ
    ARDUINO_BAUD_RATE = 9600
    
    # YOLOv11 Settings
    MODEL_PATH = "best.pt"         # path ไปยัง model ของคุณ
    TARGET_CLASS_ID = 0            # class ID ของขวดพลาสติก
    CONF_THRESHOLD = 0.80          # confidence threshold
    
    # Camera Settings
    CAM_ID = 1                     # camera index (0, 1, 2, ...)
    DEVICE = "cpu"                 # หรือ "cuda" สำหรับ GPU
    
    # Firebase Settings
    FIREBASE_URL = "https://your-project.firebasedatabase.app"
    USER_ID = "yolo_v11_user"
```

### 2. ตรวจสอบ COM Port

**Windows:**
```bash
# ใน Command Prompt
mode

# หรือใน Device Manager
# Control Panel → Device Manager → Ports (COM & LPT)
```

**หาก Arduino ไม่ขึ้น:**
- ตรวจสอบสาย USB
- ติดตั้ง Arduino driver
- ปิด Arduino IDE และ Serial Monitor

### 3. ตั้งค่า Firebase

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. สร้าง project ใหม่หรือใช้ project เดิม
3. เปิดใช้งาน Realtime Database
4. คัดลอก Database URL
5. แก้ไข `FIREBASE_URL` ใน config

## 🚀 การใช้งาน

### 1. เริ่มระบบ

```bash
# วิธีที่ 1: รันไฟล์ Python โดยตรง
python yolo_v11_arduino_firebase.py

# วิธีที่ 2: ใช้ batch script (Windows)
# สร้างไฟล์ start_yolo_v11.bat
```

### 2. การควบคุมระบบ

**ในหน้าต่าง OpenCV:**
- `ESC` - ออกจากระบบ
- `r` - รีเซ็ตตัวนับ
- `s` - แสดงสถานะระบบ

**ใน Arduino Serial Monitor:**
- `reset` - รีเซ็ตตัวนับ
- `status` - แสดงสถานะ Arduino

### 3. การตรวจสอบผลลัพธ์

**ใน Console:**
```
🍼 [14:30:25] Bottles detected: 1, Total: 5, Points: 50
📡 → Arduino: 90 (Plastic bottle detected)
✅ Firebase: Data sent successfully
```

**ใน Firebase:**
```json
{
  "bottle_data": {
    "yolo_v11_user": {
      "bottle_count": 5,
      "total_points": 50,
      "timestamp": "2024-01-15T14:30:25",
      "model_version": "YOLOv11"
    }
  }
}
```

## 📁 ไฟล์ในระบบ

```
app na ka/
├── yolo_v11_arduino_firebase.py     # ระบบหลัก Python
├── arduino_yolo_v11_firebase.ino     # โค้ด Arduino
├── requirements_yolo_v11.txt         # Python dependencies
├── README_YOLOv11.md                 # คู่มือนี้
├── config_yolo_v11.py               # ไฟล์ config แยก (optional)
└── models/
    ├── best.pt                       # YOLOv11 model
    └── yolov8n.pt                    # Pre-trained model
```

## 🔧 การแก้ไขปัญหา

### ❌ ปัญหาที่พบบ่อย

**1. Model ไม่โหลด**
```
❌ Model file not found: best.pt
```
**แก้ไข:**
- ตรวจสอบว่าไฟล์ model อยู่ในโฟลเดอร์ที่ถูกต้อง
- แก้ไข `MODEL_PATH` ใน config
- ดาวน์โหลด pre-trained model

**2. Arduino ไม่เชื่อมต่อ**
```
❌ Failed to connect to Arduino: [Errno 2] could not open port 'COM5'
```
**แก้ไข:**
- ตรวจสอบ COM port ใน Device Manager
- ปิด Arduino IDE และ Serial Monitor
- เปลี่ยน `ARDUINO_PORT` ใน config

**3. กล้องไม่ทำงาน**
```
❌ Cannot open camera
```
**แก้ไข:**
- เปลี่ยน `CAM_ID` (ลอง 0, 1, 2)
- ตรวจสอบว่ากล้องไม่ถูกใช้งานโดยแอปอื่น
- ติดตั้ง camera driver

**4. Firebase ไม่เชื่อมต่อ**
```
❌ Firebase connection error
```
**แก้ไข:**
- ตรวจสอบ internet connection
- ตรวจสอบ `FIREBASE_URL`
- ตรวจสอบ Firebase rules

### 🔍 การ Debug

**เปิด verbose mode:**
```python
# ใน model.predict()
verbose=True  # เปลี่ยนจาก False
```

**ตรวจสอบ class IDs:**
```python
# เพิ่มใน detection loop
print(f"Detected classes: {[int(box.cls[0]) for box in r.boxes]}")
```

## ⚡ การปรับแต่ง

### 🎯 ปรับ Detection Accuracy

```python
# ลด false positives
CONF_THRESHOLD = 0.90  # เพิ่มจาก 0.80

# เพิ่ม sensitivity
CONF_THRESHOLD = 0.60  # ลดจาก 0.80
```

### 📱 ปรับ Performance

```python
# สำหรับ GPU (ถ้ามี)
DEVICE = "cuda"

# ลดขนาดภาพเพื่อเพิ่มความเร็ว
IMG_SIZE = 416  # ลดจาก 640

# เพิ่มขนาดภาพเพื่อเพิ่มความแม่นยำ
IMG_SIZE = 1280  # เพิ่มจาก 640
```

### 🔄 ปรับ Detection Cooldown

```python
# ป้องกันการนับซ้ำ
DETECTION_COOLDOWN = 3.0  # เพิ่มจาก 2.0 วินาที

# ตอบสนองเร็วขึ้น
DETECTION_COOLDOWN = 1.0  # ลดจาก 2.0 วินาที
```

### 🎨 ปรับ UI Display

```python
# เปลี่ยนสีข้อความ
color = (0, 255, 255)  # เหลือง
color = (255, 0, 255)  # ม่วง

# เปลี่ยนขนาดตัวอักษร
cv2.putText(frame, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
```

## 📊 ข้อมูลที่เก็บใน Firebase

```json
{
  "bottle_data": {
    "yolo_v11_user": {
      "bottle_count": 10,
      "total_points": 100,
      "last_detection": 2,
      "device": "yolo_v11_python",
      "confidence_threshold": 0.8,
      "model_path": "best.pt",
      "timestamp": "2024-01-15T14:30:25.123456",
      "unix_timestamp": 1705312225,
      "model_version": "YOLOv11"
    }
  },
  "arduino_data": {
    "yolo_v11_device": {
      "bottle_count": 10,
      "total_points": 100,
      "detection_state": true,
      "device": "arduino_yolo_v11",
      "action": "detection",
      "timestamp": 123456789,
      "wifi_rssi": -45
    }
  }
}
```

## 🆕 อัปเดตจากเวอร์ชันเดิม

### ✨ ฟีเจอร์ใหม่
- 🤖 **YOLOv11 Support** - รองรับ YOLO เวอร์ชันล่าสุด
- 📊 **Enhanced Statistics** - สถิติที่ละเอียดขึ้น
- 🔄 **Better Error Handling** - จัดการ error ที่ดีขึ้น
- 🎨 **Improved UI** - หน้าตาที่สวยขึ้น
- 🔧 **Modular Design** - โครงสร้างโค้ดที่เป็นระเบียบ
- ⚡ **Performance Optimization** - ประสิทธิภาพที่ดีขึ้น

### 🔄 การ Migrate จากเวอร์ชันเดิม
1. สำรองข้อมูล Firebase เดิม
2. อัปเดต Python dependencies
3. เปลี่ยน model path ใน config
4. อัปโหลด Arduino code ใหม่
5. ทดสอบระบบ

## 📞 การสนับสนุน

**หากพบปัญหา:**
1. ตรวจสอบ [การแก้ไขปัญหา](#การแก้ไขปัญหา) ก่อน
2. ดู log messages ใน console
3. ตรวจสอบ hardware connections
4. ลองใช้ pre-trained model ก่อน

**สำหรับการพัฒนาต่อ:**
- ศึกษา [Ultralytics Documentation](https://docs.ultralytics.com/)
- ดู [YOLOv11 Examples](https://github.com/ultralytics/ultralytics)
- ทดลองกับ custom datasets

---

🎯 **P2P Detection System v3.0** - Powered by YOLOv11 🤖

*"From Plastic to Points - Making recycling smart and rewarding!"*