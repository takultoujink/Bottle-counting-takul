// ตัวอย่างการใช้งาน Firebase กับ Google Sheets
// ไฟล์นี้แสดงตัวอย่างการใช้งานฟังก์ชันต่างๆ ในการเชื่อมต่อ Firebase กับ Google Sheets

// นำเข้าโมดูลที่จำเป็น
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, push, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';
import { sendDataToGoogleSheets, syncFirebaseToSheets, setupAutoSync, stopAutoSync } from './firebase-to-sheets.js';

// ตัวแปรสำหรับเก็บค่า interval ID ของการซิงค์อัตโนมัติ
let autoSyncIntervalId = null;

// ฟังก์ชันเริ่มต้นการทำงาน
async function initApp() {
  try {
    // กำหนดค่า Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    
    // ตรวจสอบสถานะการเข้าสู่ระบบ
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('ผู้ใช้เข้าสู่ระบบแล้ว:', user.uid);
        setupSyncButton(database, user.uid);
      } else {
        console.log('ไม่ได้เข้าสู่ระบบ');
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเริ่มต้นแอป:', error);
  }
}

// ฟังก์ชันสำหรับตั้งค่าปุ่มซิงค์ข้อมูล
function setupSyncButton(database, userId) {
  // ค้นหาปุ่มซิงค์ข้อมูลในหน้าเว็บ
  const syncButton = document.getElementById('syncToSheetsButton');
  const autoSyncButton = document.getElementById('autoSyncButton');
  
  if (syncButton) {
    // เพิ่ม event listener สำหรับปุ่มซิงค์ข้อมูลแบบทันที
    syncButton.addEventListener('click', async () => {
      try {
        // แสดงสถานะกำลังซิงค์
        syncButton.disabled = true;
        syncButton.textContent = 'กำลังซิงค์...';
        
        // กำหนดค่าพารามิเตอร์สำหรับการซิงค์
        const path = `bottles/${userId}`;
        const sheetId = document.getElementById('sheetIdInput').value;
        const sheetName = document.getElementById('sheetNameInput').value || 'BottleData';
        
        // ซิงค์ข้อมูลจาก Firebase ไปยัง Google Sheets
        const result = await syncFirebaseToSheets(database, path, sheetId, sheetName);
        
        // แสดงผลลัพธ์
        if (result.success) {
          alert('ซิงค์ข้อมูลสำเร็จ!');
        } else {
          alert(`เกิดข้อผิดพลาด: ${result.error}`);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการซิงค์ข้อมูล:', error);
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
      } finally {
        // คืนค่าปุ่มกลับสู่สถานะปกติ
        syncButton.disabled = false;
        syncButton.textContent = 'ซิงค์ข้อมูลตอนนี้';
      }
    });
  }
  
  if (autoSyncButton) {
    // เพิ่ม event listener สำหรับปุ่มซิงค์ข้อมูลอัตโนมัติ
    autoSyncButton.addEventListener('click', () => {
      try {
        // ตรวจสอบว่ากำลังซิงค์อัตโนมัติอยู่หรือไม่
        if (autoSyncIntervalId) {
          // ถ้ากำลังซิงค์อยู่ ให้หยุดการซิงค์
          stopAutoSync(autoSyncIntervalId);
          autoSyncIntervalId = null;
          autoSyncButton.textContent = 'เริ่มการซิงค์อัตโนมัติ';
          alert('หยุดการซิงค์อัตโนมัติแล้ว');
        } else {
          // ถ้ายังไม่ได้ซิงค์ ให้เริ่มการซิงค์อัตโนมัติ
          const path = `bottles/${userId}`;
          const sheetId = document.getElementById('sheetIdInput').value;
          const sheetName = document.getElementById('sheetNameInput').value || 'BottleData';
          const intervalMinutes = parseInt(document.getElementById('syncIntervalInput').value) || 60;
          
          // ตรวจสอบว่ามี Sheet ID หรือไม่
          if (!sheetId) {
            alert('กรุณาระบุ Google Sheet ID');
            return;
          }
          
          // เริ่มการซิงค์อัตโนมัติ
          autoSyncIntervalId = setupAutoSync(database, path, sheetId, sheetName, 'A1', intervalMinutes);
          autoSyncButton.textContent = 'หยุดการซิงค์อัตโนมัติ';
          alert(`เริ่มการซิงค์อัตโนมัติแล้ว (ทุก ${intervalMinutes} นาที)`);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการตั้งค่าการซิงค์อัตโนมัติ:', error);
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    });
  }
}

// เริ่มต้นการทำงานเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', initApp);

// ฟังก์ชันสำหรับส่งข้อมูลเฉพาะส่วนไปยัง Google Sheets
async function sendSpecificDataToSheets() {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    
    const user = auth.currentUser;
    if (!user) {
      console.error('ไม่ได้เข้าสู่ระบบ');
      return;
    }
    
    // ดึงข้อมูลจาก Firebase
    const bottleRef = ref(database, `bottles/${user.uid}`);
    const snapshot = await get(bottleRef);
    const bottleData = snapshot.val();
    
    if (!bottleData) {
      console.error('ไม่พบข้อมูลขวด');
      return;
    }
    
    // จัดรูปแบบข้อมูลสำหรับ Google Sheets
    const formattedData = [
      ['วันที่', 'จำนวนขวดทั้งหมด', 'จำนวนขวดวันนี้', 'คะแนนรวม', 'ชั่วโมงจิตอาสา'],
      [new Date().toLocaleDateString('th-TH'), bottleData.total, bottleData.today, bottleData.points, Math.floor(bottleData.total / 30)]
    ];
    
    // ส่งข้อมูลไปยัง Google Sheets
    const sheetId = document.getElementById('sheetIdInput').value;
    const result = await sendDataToGoogleSheets(formattedData, sheetId, 'สรุปข้อมูล');
    
    if (result.success) {
      console.log('ส่งข้อมูลสรุปสำเร็จ');
    } else {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูลสรุป:', result.error);
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งข้อมูลเฉพาะส่วน:', error);
  }
}

// ส่งออกฟังก์ชันที่จำเป็น
export { initApp, sendSpecificDataToSheets };