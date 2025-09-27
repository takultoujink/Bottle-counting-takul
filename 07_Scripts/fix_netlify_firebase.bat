@echo off
chcp 65001 >nul
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🔧 Firebase Netlify Fix Tool 🔧               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🌐 เครื่องมือแก้ไขปัญหา Firebase Authentication บน Netlify
echo.
echo ⚡ กำลังเปิดเครื่องมือตรวจสอบ...
echo.

REM เปิด Firebase Domain Checker
start "" "check_firebase_domains.html"

echo ✅ เปิด Firebase Domain Checker แล้ว
echo.
echo 📋 ขั้นตอนการแก้ไข:
echo    1. ตรวจสอบ domain ปัจจุบันในหน้าเว็บที่เปิดขึ้น
echo    2. คลิก "ทดสอบ Firebase Auth" เพื่อตรวจสอบปัญหา
echo    3. หากพบ error ให้คลิก "แสดงวิธีแก้ไข"
echo    4. ทำตามขั้นตอนในหน้าเว็บ
echo.
echo 🔗 ต้องการเปิดลิงก์เพิ่มเติม? (y/n)
set /p choice="พิมพ์ y แล้วกด Enter: "

if /i "%choice%"=="y" (
    echo.
    echo 🔥 เปิด Firebase Console...
    start "" "https://console.firebase.google.com/project/takultoujink/authentication/settings"
    
    echo 🚀 เปิด Netlify Dashboard...
    start "" "https://app.netlify.com/"
    
    echo 📚 เปิดคู่มือแก้ไขปัญหา...
    start "" "NETLIFY_FIREBASE_SETUP.md"
    
    echo.
    echo ✅ เปิดลิงก์ทั้งหมดแล้ว!
)

echo.
echo 💡 Tips:
echo    - ใน Firebase Console ให้ไปที่ Authentication → Settings → Authorized domains
echo    - เพิ่ม domain ของ Netlify (เช่น your-app.netlify.app)
echo    - รอ 5-10 นาที แล้วลองใหม่
echo.
echo 🔄 ต้องการเปิดเครื่องมือตรวจสอบอีกครั้ง? (y/n)
set /p choice2="พิมพ์ y แล้วกด Enter: "

if /i "%choice2%"=="y" (
    start "" "check_firebase_domains.html"
    echo ✅ เปิดเครื่องมือตรวจสอบอีกครั้งแล้ว!
)

echo.
echo 🎯 หากยังมีปัญหา ให้ตรวจสอบ:
echo    1. Firebase project ID ถูกต้อง (takultoujink)
echo    2. API Key ถูกต้อง
echo    3. Internet connection
echo    4. Browser cache (ลองใช้ Incognito mode)
echo.
echo 📞 ต้องการความช่วยเหลือเพิ่มเติม?
echo    - อ่านไฟล์ NETLIFY_FIREBASE_SETUP.md
echo    - อ่านไฟล์ TROUBLESHOOTING_FIREBASE.md
echo.
echo กด Enter เพื่อปิดหน้าต่าง...
pause >nul