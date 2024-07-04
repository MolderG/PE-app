#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <EmonLib.h>
#include <ZMPT101B.h>
#include <Adafruit_ADS1X15.h>
#include <Wire.h>


#define SENSITIVITY 500.0f

#define WIFI_SSID "AndroidAP"
#define WIFI_PASSWORD "guhd8363"
#define API_KEY "AIzaSyDpUSW3BJRFlscoQTZMLl1KeEQ1Nv7dm6s"
#define DATABASE_URL "https://projeto-especializado-default-rtdb.firebaseio.com/"


EnergyMonitor emon1;

const int pinoTensao = 12;
ZMPT101B voltageSensor(pinoTensao, 60.0);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

const int pinoCorrente = 32;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

void setup() {
  
  Serial.begin(115200);

  emon1.current(pinoCorrente, 0.65);
  voltageSensor.setSensitivity(SENSITIVITY);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
    {
      Serial.print("...\n");
      delay(300);
    }
  Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if(Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("SignUp OK");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

}

void loop() {
  if(Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    
    float Irms = emon1.calcIrms(1480);
    float voltagem = voltageSensor.getRmsVoltage();
    Serial.println(); Serial.print("Corrente: "); Serial.println(Irms);
    Serial.println(); Serial.print("Voltagem: ");Serial.println(voltagem);

    if(Firebase.RTDB.setFloat(&fbdo, "Sensor/Corrente", Irms)) {
      Serial.println(); Serial.print("Corrente: "); Serial.println(Irms);
      Serial.print("Enviou com sucesso para: " + fbdo.dataPath());
      Serial.println("(" + fbdo.dataType() +")");
    } else {
      Serial.println("Falhou: " + fbdo.errorReason());
    }

    if(Firebase.RTDB.setFloat(&fbdo, "Sensor/Voltagem", voltagem)) {
      Serial.println(); Serial.print("Voltagem: ");Serial.println(voltagem);
      Serial.print("Enviou com sucesso para: " + fbdo.dataPath());
      Serial.println("(" + fbdo.dataType() +")");
    } else {
      Serial.println("Falhou: " + fbdo.errorReason());
    }
  }
}