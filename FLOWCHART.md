# 📊 Flowchart การทำงานของระบบ P2P (Plastic to Points)

## 🔧 1. การทำงานของตัวเครื่อง (Hardware System)

```mermaid
flowchart TD
    A[🔌 เริ่มต้นระบบ Arduino R4] --> B[📶 เชื่อมต่อ WiFi]
    B --> C{WiFi เชื่อมต่อสำเร็จ?}
    C -->|ไม่สำเร็จ| D[❌ แสดง LED แดง]
    D --> B
    C -->|สำเร็จ| E[✅ เชื่อมต่อ Firebase]
    E --> F[🔄 เริ่ม Loop หลัก]
    
    F --> G[📷 รอสัญญาณจาก Python YOLO]
    G --> H{ได้รับสัญญาณ Serial?}
    H -->|ไม่ได้รับ| G
    H -->|ได้รับ| I[🍼 ตรวจสอบขวดที่ Pin]
    
    I --> J{มีขวดหรือไม่?}
    J -->|ไม่มี| G
    J -->|มี| K[📈 เพิ่มจำนวนขวด +1]
    
    K --> L[💡 เปิด LED เขียว]
    L --> M[🔊 เปิด Buzzer 500ms]
    M --> N[📤 ส่งข้อมูลไป Firebase]
    
    N --> O{ส่งข้อมูลสำเร็จ?}
    O -->|ไม่สำเร็จ| P[❌ แสดง LED แดง]
    P --> Q[⏱️ รอ 2 วินาที]
    Q --> N
    O -->|สำเร็จ| R[✅ แสดง LED เขียว]
    R --> S[⏱️ รอ 1 วินาที]
    S --> G
    
    style A fill:#e1f5fe
    style K fill:#c8e6c9
    style N fill:#fff3e0
    style D fill:#ffcdd2
    style P fill:#ffcdd2
```

---

## 📱 2. การทำงานของตัวแอป (Web Application)

### 🔐 ระบบ Authentication

```mermaid
flowchart TD
    A[🌐 เข้าสู่เว็บไซต์] --> B[📄 หน้า Landing Page]
    B --> C{ผู้ใช้มี Account?}
    C -->|ไม่มี| D[📝 หน้าสมัครสมาชิก]
    C -->|มี| E[🔑 หน้าเข้าสู่ระบบ]
    
    D --> F[📋 กรอกข้อมูล]
    F --> G[🎨 เลือกทีมสี]
    G --> H[🔥 Firebase Authentication]
    H --> I{สมัครสำเร็จ?}
    I -->|ไม่สำเร็จ| J[❌ แสดงข้อผิดพลาด]
    J --> F
    I -->|สำเร็จ| K[📊 Google Sheets บันทึก]
    K --> L[✅ เข้าสู่ Dashboard]
    
    E --> M[🔑 กรอก Email/Password]
    M --> N[🔥 Firebase Login]
    N --> O{เข้าสู่ระบบสำเร็จ?}
    O -->|ไม่สำเร็จ| P[❌ แสดงข้อผิดพลาด]
    P --> M
    O -->|สำเร็จ| Q[📊 Google Sheets บันทึก]
    Q --> L
    
    style D fill:#e3f2fd
    style E fill:#e8f5e8
    style L fill:#fff3e0
    style J fill:#ffcdd2
    style P fill:#ffcdd2
```

### 📊 ระบบ Dashboard

```mermaid
flowchart TD
    A[✅ เข้าสู่ Dashboard] --> B[🔄 โหลดข้อมูลจาก Firebase]
    B --> C[📊 แสดงสถิติส่วนตัว]
    C --> D[🏆 แสดงอันดับทีม]
    D --> E[📈 แสดงกราฟ Real-time]
    
    E --> F[🔄 Real-time Listener]
    F --> G{มีข้อมูลใหม่?}
    G -->|ไม่มี| H[⏱️ รอ 1 วินาที]
    H --> G
    G -->|มี| I[🔔 แจ้งเตือนข้อมูลใหม่]
    I --> J[📊 อัปเดตสถิติ]
    J --> K[🏆 อัปเดตอันดับ]
    K --> L[📈 อัปเดตกราฟ]
    L --> M[📊 Google Sheets บันทึก]
    M --> G
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style M fill:#fff3e0
```

---

## 🤖 3. การทำงานของ AI Detection System

```mermaid
flowchart TD
    A[🐍 เริ่มต้น Python Script] --> B[📷 เชื่อมต่อกล้อง]
    B --> C[🔗 เชื่อมต่อ Arduino Serial]
    C --> D[🧠 โหลด YOLO Model]
    
    D --> E{Model โหลดสำเร็จ?}
    E -->|ไม่สำเร็จ| F[📥 ดาวน์โหลด YOLO Files]
    F --> D
    E -->|สำเร็จ| G[🔄 เริ่ม Detection Loop]
    
    G --> H[📸 อ่านภาพจากกล้อง]
    H --> I[🔍 ประมวลผลด้วย YOLO]
    I --> J{ตรวจพบขวด?}
    
    J -->|ไม่พบ| K[⏱️ รอ 100ms]
    K --> H
    
    J -->|พบขวด| L[📊 วิเคราะห์ Confidence Score]
    L --> M{Confidence > 50%?}
    M -->|ไม่ผ่าน| K
    M -->|ผ่าน| N[📤 ส่งสัญญาณไป Arduino]
    
    N --> O[🔥 ส่งข้อมูลไป Firebase]
    O --> P[📊 Google Sheets บันทึก]
    P --> Q[⏱️ รอ 2 วินาที]
    Q --> H
    
    style A fill:#e1f5fe
    style L fill:#fff3e0
    style N fill:#c8e6c9
    style O fill:#ffeb3b
```

---

## 🔄 4. Data Flow ทั้งระบบ

```mermaid
flowchart LR
    A[📷 Camera] --> B[🤖 YOLO AI]
    B --> C[🐍 Python Script]
    C --> D[📡 Serial Communication]
    D --> E[🔧 Arduino R4]
    E --> F[📶 WiFi]
    F --> G[🔥 Firebase Database]
    G --> H[🌐 Web Dashboard]
    G --> I[📊 Google Sheets]
    
    J[👤 User] --> K[📱 Web App]
    K --> G
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style E fill:#e8f5e8
    style G fill:#ffeb3b
    style H fill:#f3e5f5
    style I fill:#e0f2f1
```

---

## 📋 5. ขั้นตอนการใช้งานสำหรับผู้ใช้

```mermaid
flowchart TD
    A[👤 ผู้ใช้เข้าเว็บไซต์] --> B{มี Account หรือไม่?}
    B -->|ไม่มี| C[📝 สมัครสมาชิก]
    B -->|มี| D[🔑 เข้าสู่ระบบ]
    
    C --> E[🎨 เลือกทีมสี]
    E --> F[✅ เข้าสู่ระบบสำเร็จ]
    D --> F
    
    F --> G[📊 ดู Dashboard]
    G --> H[🍼 นำขวดมาใส่เครื่อง]
    H --> I[🤖 AI ตรวจจับขวด]
    I --> J[📈 คะแนนเพิ่มขึ้น]
    J --> K[🔔 ได้รับแจ้งเตือน]
    K --> L[🏆 ดูอันดับทีม]
    L --> M{ต้องการใส่ขวดต่อ?}
    M -->|ใช่| H
    M -->|ไม่| N[👋 ออกจากระบบ]
    
    style C fill:#e3f2fd
    style F fill:#c8e6c9
    style J fill:#fff3e0
    style K fill:#ffeb3b
```

---

## 🔧 6. ขั้นตอนการแก้ไขปัญหา (Troubleshooting)

```mermaid
flowchart TD
    A[⚠️ พบปัญหา] --> B{ประเภทปัญหา?}
    
    B -->|Arduino ไม่เชื่อมต่อ WiFi| C[🔍 ตรวจสอบ WiFi Credentials]
    C --> D[🔄 Restart Arduino]
    D --> E[📶 ทดสอบการเชื่อมต่อ]
    
    B -->|YOLO ตรวจจับไม่ได้| F[📷 ตรวจสอบกล้อง]
    F --> G[🧠 ตรวจสอบ Model Files]
    G --> H[💡 ปรับแสงสว่าง]
    
    B -->|Firebase Error| I[🔑 ตรวจสอบ API Keys]
    I --> J[🌐 ตรวจสอบ Internet]
    J --> K[🔥 ทดสอบ Firebase Connection]
    
    B -->|Serial Communication Error| L[🔌 ตรวจสอบ USB Cable]
    L --> M[📡 ตรวจสอบ COM Port]
    M --> N[🔄 Restart Python Script]
    
    E --> O{แก้ไขแล้ว?}
    H --> O
    K --> O
    N --> O
    
    O -->|ไม่| P[📞 ติดต่อ Support]
    O -->|ใช่| Q[✅ ระบบทำงานปกติ]
    
    style A fill:#ffcdd2
    style P fill:#ffcdd2
    style Q fill:#c8e6c9
```

---

## 📊 7. Google Sheets Data Flow

```mermaid
flowchart TD
    A[🔥 Firebase Event] --> B{ประเภท Event?}
    
    B -->|User Registration| C[📝 sendUserRegistrationToSheets()]
    B -->|User Login| D[🔑 sendUserLoginToSheets()]
    B -->|Bottle Collection| E[🍼 sendBottleDataToSheets()]
    
    C --> F[📊 Google Apps Script]
    D --> F
    E --> F
    
    F --> G[📋 ตรวจสอบ Sheet ที่ต้องการ]
    G --> H{Sheet มีอยู่หรือไม่?}
    
    H -->|ไม่มี| I[📄 สร้าง Sheet ใหม่]
    I --> J[📝 เพิ่ม Headers]
    J --> K[💾 บันทึกข้อมูล]
    
    H -->|มี| K
    K --> L[✅ ส่งผลลัพธ์กลับ]
    L --> M[🔔 แจ้งเตือนสำเร็จ]
    
    style F fill:#fff3e0
    style K fill:#c8e6c9
    style M fill:#e8f5e8
```

---

**🎯 หมายเหตุ:** Flowchart เหล่านี้แสดงการทำงานของระบบ P2P (Plastic to Points) อย่างละเอียด ตั้งแต่การตรวจจับขวดด้วย AI จนถึงการแสดงผลบน Dashboard และการบันทึกข้อมูลใน Google Sheets

**🔄 การอัปเดต Real-time:** ระบบทำงานแบบ Real-time ทำให้ผู้ใช้เห็นผลลัพธ์ทันทีที่มีการเก็บขวด และสามารถแข่งขันกันระหว่างทีมได้อย่างสนุกสนาน! 🏆