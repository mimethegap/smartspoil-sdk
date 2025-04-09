#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <Adafruit_ADXL362.h>

Adafruit_BME280 bme; // I2C
Adafruit_ADXL362 accel;

void setup() {
    Serial.begin(115200);

    // Initialize BME280
    if (!bme.begin(0x76)) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
        while (1);
    }

    // Initialize ADXL362
    if (!accel.begin()) {
        Serial.println("Could not find a valid ADXL362 sensor, check wiring!");
        while (1);
    }
    accel.setRange(ADXL362_RANGE_4_G);
}

void loop() {
    // Collect data from sensors
    float temperature = bme.readTemperature();
    float humidity = bme.readHumidity();
    float accelX = accel.getX();
    float accelY = accel.getY();
    float accelZ = accel.getZ();

    // Print data
    Serial.print("Temperature = ");
    Serial.print(temperature);
    Serial.println(" *C");
    Serial.print("Humidity = ");
    Serial.print(humidity);
    Serial.println(" %");
    Serial.print("Accel X: ");
    Serial.print(accelX);
    Serial.print(" m/s^2 ");
    Serial.print("Accel Y: ");
    Serial.print(accelY);
    Serial.print(" m/s^2 ");
    Serial.print("Accel Z: ");
    Serial.println(accelZ);

    delay(2000);
}
