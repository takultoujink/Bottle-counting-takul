# 🤖 AI Detection

โฟลเดอร์นี้เก็บไฟล์ Python ทั้งหมดที่เกี่ยวข้องกับระบบ AI Detection และ YOLO

## 📋 ไฟล์ในโฟลเดอร์

### 🎯 YOLO Detection Scripts
- `yolo_bottle_detection.py` - สคริปต์หลักสำหรับการตรวจจับขวด
- `yolo_v11_arduino_firebase.py` - ระบบ YOLO v11 เชื่อมต่อ Arduino และ Firebase
- `yolo_v11_servo_system.py` - ระบบ YOLO v11 ควบคุม Servo Motor

### 🌉 Bridge Scripts
- `yolo_arduino_firebase_bridge.py` - สคริปต์เชื่อมต่อระหว่าง YOLO, Arduino และ Firebase

## 🔧 ความสามารถของระบบ

### 🎯 การตรวจจับ (Detection)
- ตรวจจับขวดพลาสติกด้วย AI
- รองรับการตรวจจับแบบ Real-time
- ความแม่นยำสูงด้วย YOLOv11

### 📡 การเชื่อมต่อ (Connectivity)
- เชื่อมต่อกับ Arduino สำหรับควบคุมฮาร์ดแวร์
- ส่งข้อมูลไปยัง Firebase Database
- รองรับการทำงานแบบ Real-time

### ⚙️ การควบคุม (Control)
- ควบคุม Servo Motor สำหรับการคัดแยก
- ระบบ Feedback แบบอัตโนมัติ
- การจัดการข้อผิดพลาด

## 🚀 การใช้งาน

1. **ติดตั้ง Dependencies**
   ```bash
   pip install -r requirements_yolo_v11.txt
   ```

2. **รันระบบตรวจจับ**
   ```bash
   python yolo_bottle_detection.py
   ```

3. **รันระบบเต็มรูปแบบ**
   ```bash
   python yolo_v11_servo_system.py
   ```

## 📊 Performance

- **ความเร็ว**: 30+ FPS
- **ความแม่นยำ**: 95%+
- **การใช้ทรัพยากร**: Optimized สำหรับ Raspberry Pi

## 🔗 Dependencies

- OpenCV
- Ultralytics YOLO
- PySerial (สำหรับ Arduino)
- Firebase Admin SDK
- NumPy
- Matplotlib