#!/usr/bin/env python3
"""
Configuration Template for YOLO Arduino Firebase Bridge
คัดลอกไฟล์นี้เป็น config.py และแก้ไขค่าต่างๆ ตามต้องการ

Usage:
1. คัดลอก: copy config_template.py config.py
2. แก้ไข config.py ตามการตั้งค่าของคุณ
3. ระบบจะใช้ค่าจาก config.py แทน default values
"""

class UserConfig:
    """
    การตั้งค่าผู้ใช้ - แก้ไขค่าเหล่านี้ตามสภาพแวดล้อมของคุณ
    """
    
    # ========================================
    # Arduino Settings
    # ========================================
    
    # COM Port ของ Arduino R4 (ตรวจสอบใน Device Manager)
    ARDUINO_PORT = 'COM3'  # Windows: COM3, COM4, etc.
                           # Linux/Mac: /dev/ttyUSB0, /dev/ttyACM0, etc.
    
    # Baud Rate (ต้องตรงกับที่ตั้งใน Arduino)
    ARDUINO_BAUD_RATE = 115200
    
    # Timeout สำหรับการเชื่อมต่อ (วินาที)
    ARDUINO_TIMEOUT = 2
    
    # ========================================
    # Camera Settings
    # ========================================
    
    # Index ของกล้อง (0 = กล้องหลัก, 1 = กล้องรอง)
    CAMERA_INDEX = 0
    
    # ความละเอียดของภาพ
    FRAME_WIDTH = 640   # ความกว้าง (pixels)
    FRAME_HEIGHT = 480  # ความสูง (pixels)
    
    # ========================================
    # Firebase Settings
    # ========================================
    
    # Firebase Realtime Database URL
    # ได้จาก Firebase Console → Realtime Database
    FIREBASE_URL = "https://your-project-name-default-rtdb.asia-southeast1.firebasedatabase.app"
    
    # User ID สำหรับแยกข้อมูลแต่ละผู้ใช้
    USER_ID = "user_001"  # เปลี่ยนเป็น ID ที่ต้องการ
    
    # ========================================
    # YOLO Detection Settings
    # ========================================
    
    # ความมั่นใจขั้นต่ำสำหรับการตรวจจับ (0.0 - 1.0)
    CONFIDENCE_THRESHOLD = 0.5  # ลดเพื่อความไวมากขึ้น, เพิ่มเพื่อความแม่นยำมากขึ้น
    
    # Non-Maximum Suppression threshold
    NMS_THRESHOLD = 0.4
    
    # เวลารอระหว่างการตรวจจับ (วินาที) - ป้องกันการตรวจจับซ้ำ
    DETECTION_COOLDOWN = 2.0
    
    # ========================================
    # System Settings
    # ========================================
    
    # แสดงข้อมูล debug หรือไม่
    DEBUG_MODE = True
    
    # บันทึก log ลงไฟล์หรือไม่
    ENABLE_LOGGING = True
    
    # ชื่อไฟล์ log
    LOG_FILENAME = "bottle_detection.log"
    
    # ========================================
    # Scoring System
    # ========================================
    
    # คะแนนต่อขวด
    POINTS_PER_BOTTLE = 10
    
    # คะแนนโบนัสสำหรับการตรวจจับต่อเนื่อง
    BONUS_MULTIPLIER = 1.5  # เมื่อตรวจจับได้ 5 ขวดติดต่อกัน
    BONUS_THRESHOLD = 5     # จำนวนขวดที่ต้องตรวจจับเพื่อได้โบนัส
    
    # ========================================
    # Hardware Feedback Settings
    # ========================================
    
    # เปิดใช้งาน LED feedback
    ENABLE_LED_FEEDBACK = True
    
    # เปิดใช้งาน Buzzer feedback
    ENABLE_BUZZER_FEEDBACK = True
    
    # ระยะเวลาที่ LED ติด (มิลลิวินาที)
    LED_DURATION = 1000
    
    # ระยะเวลาที่ Buzzer ดัง (มิลลิวินาที)
    BUZZER_DURATION = 500
    
    # ========================================
    # Network Settings
    # ========================================
    
    # Timeout สำหรับการเชื่อมต่อ Firebase (วินาที)
    FIREBASE_TIMEOUT = 10
    
    # จำนวนครั้งที่ลองใหม่เมื่อเชื่อมต่อไม่สำเร็จ
    MAX_RETRY_ATTEMPTS = 3
    
    # เวลารอระหว่างการลองใหม่ (วินาที)
    RETRY_DELAY = 2
    
    # ========================================
    # Advanced YOLO Settings
    # ========================================
    
    # โฟลเดอร์ที่เก็บไฟล์ YOLO
    YOLO_DIR = "yolo"
    
    # ชื่อไฟล์ YOLO (ไม่ควรเปลี่ยน)
    YOLO_CONFIG_FILE = "yolov3.cfg"
    YOLO_WEIGHTS_FILE = "yolov3.weights"
    YOLO_CLASSES_FILE = "coco.names"
    
    # Class ID ของขวดใน COCO dataset (ไม่ควรเปลี่ยน)
    BOTTLE_CLASS_ID = 39
    
    # ========================================
    # Display Settings
    # ========================================
    
    # แสดงหน้าต่าง OpenCV หรือไม่
    SHOW_DISPLAY = True
    
    # ชื่อหน้าต่างแสดงผล
    WINDOW_TITLE = "YOLO Bottle Detection - P2P System"
    
    # สีของ bounding box (BGR format)
    BBOX_COLOR = (0, 255, 0)  # สีเขียว
    
    # ความหนาของเส้น bounding box
    BBOX_THICKNESS = 2
    
    # ขนาดตัวอักษร
    FONT_SCALE = 0.6
    
    # ความหนาของตัวอักษร
    FONT_THICKNESS = 2

# ========================================
# WiFi Configuration for Arduino
# ========================================

class WiFiConfig:
    """
    การตั้งค่า WiFi สำหรับ Arduino
    ใช้ข้อมูลนี้ในไฟล์ Arduino sketch
    """
    
    # ชื่อ WiFi Network
    WIFI_SSID = "YOUR_WIFI_NAME"
    
    # รหัสผ่าน WiFi
    WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"
    
    # Firebase URL สำหรับ Arduino (ต้องเหมือนกับ UserConfig.FIREBASE_URL)
    ARDUINO_FIREBASE_URL = "https://your-project-name-default-rtdb.asia-southeast1.firebasedatabase.app"

# ========================================
# Example Usage
# ========================================

if __name__ == "__main__":
    print("🔧 Configuration Template")
    print("=" * 40)
    print(f"Arduino Port: {UserConfig.ARDUINO_PORT}")
    print(f"Camera Index: {UserConfig.CAMERA_INDEX}")
    print(f"Firebase URL: {UserConfig.FIREBASE_URL}")
    print(f"User ID: {UserConfig.USER_ID}")
    print(f"Confidence Threshold: {UserConfig.CONFIDENCE_THRESHOLD}")
    print("=" * 40)
    print("💡 คัดลอกไฟล์นี้เป็น 'config.py' และแก้ไขค่าต่างๆ")
    print("📝 จากนั้นระบบจะใช้การตั้งค่าของคุณแทน default values")