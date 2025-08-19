/*
 * Arduino R4 WiFi - Firebase Bottle Counter
 * สำหรับเชื่อมต่อกับ Firebase Realtime Database
 * ใช้กับ YOLO bottle detection
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase Configuration
const char* firebaseHost = "takultoujink-default-rtdb.asia-southeast1.firebasedatabase.app";
const char* firebaseAuth = "YOUR_FIREBASE_SECRET"; // หรือใช้ API Key
const char* userId = "USER_ID_FROM_WEB"; // ได้จาก Web Authentication

// Pin Configuration
const int bottleDetectionPin = 2;  // Pin รับสัญญาณจาก YOLO detection
const int ledPin = LED_BUILTIN;     // LED แสดงสถานะ
const int buzzerPin = 8;            // Buzzer แจ้งเตือน (optional)

// Variables
int bottleCount = 0;
int lastBottleCount = 0;
bool detectionFlag = false;
unsigned long lastUpdateTime = 0;
const unsigned long updateInterval = 2000; // อัพเดททุก 2 วินาที

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(bottleDetectionPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  
  // Connect to WiFi
  connectWiFi();
  
  // Get initial bottle count from Firebase
  getBottleCountFromFirebase();
  
  Serial.println("Arduino Bottle Counter Ready!");
  Serial.println("Waiting for bottle detection...");
}

void loop() {
  // Check for bottle detection from YOLO
  if (digitalRead(bottleDetectionPin) == HIGH && !detectionFlag) {
    detectionFlag = true;
    bottleCount++;
    
    Serial.println("🍼 Bottle Detected! Count: " + String(bottleCount));
    
    // Visual/Audio feedback
    digitalWrite(ledPin, HIGH);
    tone(buzzerPin, 1000, 200); // Beep for 200ms
    
    delay(500); // Debounce delay
  } else if (digitalRead(bottleDetectionPin) == LOW) {
    detectionFlag = false;
    digitalWrite(ledPin, LOW);
  }
  
  // Send data to Firebase periodically or when count changes
  unsigned long currentTime = millis();
  if (currentTime - lastUpdateTime >= updateInterval || bottleCount != lastBottleCount) {
    if (WiFi.status() == WL_CONNECTED) {
      sendToFirebase();
      lastUpdateTime = currentTime;
      lastBottleCount = bottleCount;
    } else {
      Serial.println("WiFi Disconnected! Reconnecting...");
      connectWiFi();
    }
  }
  
  delay(100); // Small delay for stability
}

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi Connected!");
  Serial.println("IP Address: " + WiFi.localIP().toString());
}

void sendToFirebase() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Firebase Realtime Database URL
    String url = "https://" + String(firebaseHost) + "/live_count/" + String(userId) + ".json";
    
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    // Send PUT request with bottle count
    int httpResponseCode = http.PUT(String(bottleCount));
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("✅ Data sent to Firebase: " + String(bottleCount));
      Serial.println("Response: " + response);
    } else {
      Serial.println("❌ Error sending data: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void getBottleCountFromFirebase() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Get current count from Firebase
    String url = "https://" + String(firebaseHost) + "/bottles/" + String(userId) + "/total.json";
    
    http.begin(url);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      int currentCount = payload.toInt();
      
      if (currentCount > 0) {
        bottleCount = currentCount;
        lastBottleCount = bottleCount;
        Serial.println("📊 Current count from Firebase: " + String(bottleCount));
      }
    } else {
      Serial.println("❌ Error getting data from Firebase");
    }
    
    http.end();
  }
}

// Function to handle YOLO detection input
// Call this function when YOLO detects a bottle
void onBottleDetected() {
  bottleCount++;
  Serial.println("🍼 YOLO Detected Bottle! Total: " + String(bottleCount));
  
  // Immediate feedback
  digitalWrite(ledPin, HIGH);
  tone(buzzerPin, 1500, 300);
  
  // Send to Firebase immediately
  sendToFirebase();
  
  delay(100);
  digitalWrite(ledPin, LOW);
}

// Function to reset counter (optional)
void resetCounter() {
  bottleCount = 0;
  Serial.println("🔄 Counter Reset!");
  sendToFirebase();
}

// Function to test Firebase connection
void testFirebaseConnection() {
  Serial.println("🧪 Testing Firebase Connection...");
  sendToFirebase();
}
