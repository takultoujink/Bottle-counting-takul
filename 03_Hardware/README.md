# ⚡ Hardware

โฟลเดอร์นี้เก็บโค้ด Arduino ทั้งหมดสำหรับการควบคุมฮาร์ดแวร์

## 📋 ไฟล์ในโฟลเดอร์

### 🔌 Arduino Sketches
- `arduino_yolo_firebase.ino` - โค้ด Arduino เชื่อมต่อ YOLO และ Firebase
- `arduino_yolo_v11_firebase.ino` - โค้ด Arduino สำหรับ YOLOv11 และ Firebase
- `arduino_yolo_v11_servo.ino` - โค้ด Arduino ควบคุม Servo กับ YOLOv11

## 🔧 ฮาร์ดแวร์ที่รองรับ

### 🎛️ Microcontroller
- **Arduino Uno/Nano** - สำหรับโปรเจกต์ขนาดเล็ก
- **ESP32** - สำหรับการเชื่อมต่อ WiFi
- **Arduino Mega** - สำหรับโปรเจกต์ขนาดใหญ่

### 🔩 Components
- **Servo Motors** - สำหรับการคัดแยกขวด
- **Sensors** - เซ็นเซอร์ตรวจจับ
- **LEDs** - แสดงสถานะการทำงาน
- **Buzzer** - เสียงแจ้งเตือน

## 📡 การเชื่อมต่อ

### 🌐 WiFi Connection
```cpp
// การตั้งค่า WiFi
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### 🔥 Firebase Integration
```cpp
// การเชื่อมต่อ Firebase
#include <FirebaseESP32.h>
FirebaseData firebaseData;
```

### 📊 Serial Communication
```cpp
// การสื่อสารกับ Python
Serial.begin(9600);
```

## ⚙️ Pin Configuration

### 🔌 Servo Motors
- **Servo 1**: Pin 9 (การคัดแยกหลัก)
- **Servo 2**: Pin 10 (การคัดแยกรอง)

### 💡 LEDs
- **Status LED**: Pin 13
- **Error LED**: Pin 12
- **Success LED**: Pin 11

### 🔊 Audio
- **Buzzer**: Pin 8

## 🚀 การติดตั้งและใช้งาน

1. **เปิด Arduino IDE**
2. **เลือกไฟล์ .ino ที่ต้องการ**
3. **ตั้งค่า Board และ Port**
4. **Upload โค้ดไปยัง Arduino**

## 📚 Libraries ที่จำเป็น

```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Servo.h>
#include <ArduinoJson.h>
```

## 🔧 Troubleshooting

### ❌ ปัญหาที่พบบ่อย
- **WiFi ไม่เชื่อมต่อ**: ตรวจสอบ SSID และ Password
- **Servo ไม่ทำงาน**: ตรวจสอบการต่อสาย Power
- **Firebase Error**: ตรวจสอบ API Key และ Database URL

### ✅ วิธีแก้ไข
1. ตรวจสอบการเชื่อมต่อสาย
2. ตรวจสอบ Serial Monitor
3. ตรวจสอบ Library versions