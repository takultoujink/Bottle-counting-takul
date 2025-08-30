// Google Apps Script สำหรับเชื่อมต่อ Firebase กับ Google Sheets
// คุณต้องคัดลอกโค้ดนี้ไปใส่ใน Google Apps Script และเผยแพร่เป็น Web App

/**
 * ฟังก์ชันที่จะถูกเรียกเมื่อมีการส่ง HTTP request มาที่ Web App
 * @param {Object} e - ข้อมูล HTTP request
 * @return {Object} ผลลัพธ์การทำงาน
 */
function doPost(e) {
  try {
    // แปลงข้อมูล JSON ที่ได้รับ
    const requestData = JSON.parse(e.postData.contents);
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!requestData.sheetId || !requestData.data) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'ข้อมูลไม่ครบถ้วน กรุณาระบุ sheetId และ data'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // เปิด Google Sheets ตาม ID ที่ระบุ
    const spreadsheet = SpreadsheetApp.openById(requestData.sheetId);
    if (!spreadsheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'ไม่พบ Google Sheets ตาม ID ที่ระบุ'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // เลือก Sheet ตามชื่อที่ระบุ หรือใช้ Sheet แรกถ้าไม่ได้ระบุ
    let sheet;
    if (requestData.sheetName) {
      sheet = spreadsheet.getSheetByName(requestData.sheetName);
      // ถ้าไม่พบ Sheet ตามชื่อที่ระบุ ให้สร้างใหม่
      if (!sheet) {
        sheet = spreadsheet.insertSheet(requestData.sheetName);
      }
    } else {
      sheet = spreadsheet.getSheets()[0];
    }
    
    // กำหนดช่วงของเซลล์ที่จะเขียนข้อมูล
    const range = requestData.range || 'A1';
    const startCell = sheet.getRange(range);
    const startRow = startCell.getRow();
    const startCol = startCell.getColumn();
    
    // เขียนข้อมูลลงใน Google Sheets
    const data = requestData.data;
    const numRows = data.length;
    const numCols = data[0].length;
    
    const targetRange = sheet.getRange(startRow, startCol, numRows, numCols);
    targetRange.setValues(data);
    
    // ส่งผลลัพธ์กลับ
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'บันทึกข้อมูลลงใน Google Sheets สำเร็จ',
      updatedRange: `${sheet.getName()}!${range}:${getColumnLetter(startCol + numCols - 1)}${startRow + numRows - 1}`,
      rowsUpdated: numRows,
      columnsUpdated: numCols
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // กรณีเกิดข้อผิดพลาด
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ฟังก์ชันสำหรับแปลงเลขคอลัมน์เป็นตัวอักษร (เช่น 1 -> A, 2 -> B, ...)
 * @param {number} columnNumber - เลขคอลัมน์
 * @return {string} ตัวอักษรที่แทนคอลัมน์
 */
function getColumnLetter(columnNumber) {
  let columnLetter = '';
  let temp = columnNumber;
  
  while (temp > 0) {
    let remainder = temp % 26;
    if (remainder === 0) {
      remainder = 26;
      temp--;
    }
    columnLetter = String.fromCharCode(64 + remainder) + columnLetter;
    temp = Math.floor(temp / 26);
  }
  
  return columnLetter;
}

/**
 * ฟังก์ชันสำหรับทดสอบการทำงาน
 */
function testFunction() {
  // ข้อมูลตัวอย่าง
  const testData = {
    sheetId: 'YOUR_SHEET_ID', // ใส่ Sheet ID ของคุณที่นี่
    sheetName: 'Sheet1',
    range: 'A1',
    data: [
      ['วันที่', 'จำนวนขวด', 'คะแนน'],
      ['2023-01-01', 10, 10],
      ['2023-01-02', 15, 15],
      ['2023-01-03', 20, 20]
    ]
  };
  
  // จำลองการเรียกใช้ doPost
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  // แสดงผลลัพธ์
  Logger.log(result.getContent());
}

/**
 * ฟังก์ชันที่จะถูกเรียกเมื่อมีการส่ง HTTP GET request มาที่ Web App
 * @return {Object} ข้อความแสดงสถานะ
 */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'Firebase to Google Sheets API พร้อมใช้งาน',
    timestamp: new Date().toString()
  })).setMimeType(ContentService.MimeType.JSON);
}