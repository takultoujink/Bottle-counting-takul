// Firebase to Google Sheets Integration
// ไฟล์นี้ใช้สำหรับการเชื่อมต่อ Firebase กับ Google Sheets

// ฟังก์ชันสำหรับส่งข้อมูลจาก Firebase ไปยัง Google Sheets
export async function sendDataToGoogleSheets(data, sheetId, sheetName = 'Sheet1', range = 'A1') {
  try {
    // ตรวจสอบว่ามีข้อมูลที่จะส่งหรือไม่
    if (!data || Object.keys(data).length === 0) {
      console.error('ไม่มีข้อมูลที่จะส่งไปยัง Google Sheets');
      return { success: false, error: 'ไม่มีข้อมูลที่จะส่ง' };
    }

    // ตรวจสอบว่ามี Sheet ID หรือไม่
    if (!sheetId) {
      console.error('ไม่ได้ระบุ Google Sheet ID');
      return { success: false, error: 'ไม่ได้ระบุ Google Sheet ID' };
    }

    // แปลงข้อมูลเป็นรูปแบบที่ Google Sheets API ต้องการ
    const formattedData = formatDataForSheets(data);

    // URL สำหรับเรียกใช้ Google Apps Script Web App
    // คุณต้องสร้าง Google Apps Script และเผยแพร่เป็น Web App ก่อน
    // แล้วนำ URL ที่ได้มาใส่ที่นี่
    const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'; // ต้องแก้ไขเป็น URL จริงหลังจากเผยแพร่ Google Apps Script

    // ส่งข้อมูลไปยัง Google Apps Script Web App
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheetId: sheetId,
        sheetName: sheetName,
        range: range,
        data: formattedData
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('ส่งข้อมูลไปยัง Google Sheets สำเร็จ');
      return { success: true, result };
    } else {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

// ฟังก์ชันสำหรับแปลงข้อมูลให้อยู่ในรูปแบบที่ Google Sheets ต้องการ
function formatDataForSheets(data) {
  // ถ้าข้อมูลเป็น Array อยู่แล้ว ให้ใช้ได้เลย
  if (Array.isArray(data)) {
    return data;
  }
  
  // ถ้าเป็น Object ให้แปลงเป็น Array ของ Arrays
  // โดยแถวแรกเป็นชื่อคอลัมน์ และแถวถัดไปเป็นข้อมูล
  if (typeof data === 'object' && data !== null) {
    // กรณีเป็น Array ของ Objects
    if (Array.isArray(Object.values(data)[0])) {
      const headers = Object.keys(data);
      const rows = [];
      
      // เพิ่ม headers เป็นแถวแรก
      rows.push(headers);
      
      // หาจำนวนแถวสูงสุด
      const maxRows = Math.max(...headers.map(header => data[header].length));
      
      // สร้างแถวข้อมูล
      for (let i = 0; i < maxRows; i++) {
        const row = headers.map(header => {
          return data[header][i] !== undefined ? data[header][i] : '';
        });
        rows.push(row);
      }
      
      return rows;
    }
    
    // กรณีเป็น Object ธรรมดา
    const headers = Object.keys(data);
    const values = Object.values(data);
    return [headers, values];
  }
  
  // กรณีอื่นๆ ให้ส่งเป็น Array เดียว
  return [[data]];
}

// ฟังก์ชันสำหรับดึงข้อมูลจาก Firebase และส่งไปยัง Google Sheets
export async function syncFirebaseToSheets(database, path, sheetId, sheetName = 'Sheet1', range = 'A1') {
  try {
    // ดึงข้อมูลจาก Firebase
    const snapshot = await database.ref(path).once('value');
    const data = snapshot.val();
    
    // ส่งข้อมูลไปยัง Google Sheets
    return await sendDataToGoogleSheets(data, sheetId, sheetName, range);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการซิงค์ข้อมูล:', error);
    return { success: false, error: error.message };
  }
}

// ฟังก์ชันสำหรับตั้งค่าการซิงค์อัตโนมัติ
export function setupAutoSync(database, path, sheetId, sheetName = 'Sheet1', range = 'A1', intervalMinutes = 60) {
  // ซิงค์ข้อมูลครั้งแรก
  syncFirebaseToSheets(database, path, sheetId, sheetName, range);
  
  // ตั้งเวลาซิงค์ข้อมูลอัตโนมัติ
  const intervalMs = intervalMinutes * 60 * 1000;
  const intervalId = setInterval(() => {
    syncFirebaseToSheets(database, path, sheetId, sheetName, range);
  }, intervalMs);
  
  // ส่งคืน intervalId เพื่อให้สามารถยกเลิกการซิงค์ได้ในภายหลัง
  return intervalId;
}

// ฟังก์ชันสำหรับยกเลิกการซิงค์อัตโนมัติ
export function stopAutoSync(intervalId) {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('ยกเลิกการซิงค์อัตโนมัติแล้ว');
    return true;
  }
  return false;
}