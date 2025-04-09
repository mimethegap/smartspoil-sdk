/*******************************************************
 * SmartSpoil Firmware with OTA Update Capability
 * Points to local OTA server for .bin and version check
 *******************************************************/

#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* ota_metadata_url = "http://192.168.1.100:8080/firmware.json";  // Replace with your OTA server IP
const char* firmware_bin_url = "http://192.168.1.100:8080/firmware.bin";

void checkForUpdates() {
  Serial.println("Checking for OTA update...");

  HTTPClient http;
  http.begin(ota_metadata_url);
  int httpCode = http.GET();

  if (httpCode == 200) {
    String payload = http.getString();
    Serial.println("Firmware metadata received:");
    Serial.println(payload);

    // Proceed to download and apply update
    Serial.println("Downloading firmware binary...");
    http.end();

    http.begin(firmware_bin_url);
    httpCode = http.GET();

    if (httpCode == 200) {
      int contentLength = http.getSize();
      bool canBegin = Update.begin(contentLength);

      if (canBegin) {
        WiFiClient *client = http.getStreamPtr();
        size_t written = Update.writeStream(*client);

        if (written == contentLength) {
          Serial.println("Firmware written successfully.");
        }

        if (Update.end()) {
          if (Update.isFinished()) {
            Serial.println("Update complete. Rebooting...");
            ESP.restart();
          } else {
            Serial.println("Update failed to finish.");
          }
        } else {
          Serial.printf("Update error: %d
", Update.getError());
        }

      } else {
        Serial.println("Not enough space for OTA.");
      }
    } else {
      Serial.printf("Failed to download firmware: HTTP %d
", httpCode);
    }
  } else {
    Serial.printf("Failed to fetch metadata: HTTP %d
", httpCode);
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println(" connected.");
  checkForUpdates();  // Perform OTA check on boot
}

void loop() {
  // Add your main logic here
  delay(60000);  // Optionally check for updates periodically
}
