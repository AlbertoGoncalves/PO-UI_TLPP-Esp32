#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include <TZ.h>
#include <FS.h>
#include <LittleFS.h>
#include <CertStoreBearSSL.h>

// Update these with values suitable for your network.
const char* ssid = "ssid";
const char* password = "password";
const char* mqtt_server = "mqtt_server";
const char* setTopic = "esp8266_setTopic";
const String descriTopic = "esp8266_descriTopic";
const char* setTopicServer = "Serv_01";
const char* client_Id = "hivemq.webclient.client_Id";
const char* clientId_key = "clientId_key";
bool StatusCarregamento = false;


#define LED_01 LED_BUILTIN
#define LED_02 0

// A single, global CertStore which can be used by all connections.
// Needs to stay live the entire time any of the WiFiClientBearSSLs
// are present.
BearSSL::CertStore certStore;

WiFiClientSecure espClient;
PubSubClient* client;
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (500)
char msg[MSG_BUFFER_SIZE];
int value = 0;

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void setDateTime() {
  // You can use your own timezone, but the exact time is not used at all.
  // Only the date is needed for validating the certificates.
  configTime(TZ_America_Sao_Paulo, "pool.ntp.org", "time.nist.gov");

  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(100);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println();

  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.printf("%s %s", tzname[0], asctime(&timeinfo));
}


void callback(char* topic, byte* payload, unsigned int length) {
  // Criar uma variável para armazenar a mensagem recebida
  String receivedMessage = "";
  Serial.print("Mensagem recebida [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    receivedMessage += (char)payload[i];
  }
  Serial.println();
  actions(receivedMessage.toInt());
}

void sendMessage(String sendMessage) {

    client->publish(setTopicServer, sendMessage.c_str());
    // … and resubscribe
    // client->subscribe(setTopic);
}

void actions(int receivedMessage) {

  // Controle das portas com base na mensagem recebida
  switch (receivedMessage) {
    case 1:
      digitalWrite(LED_01, LOW);  // Garante que a porta digital 3 está desligada
      Serial.println("Verificacao de dispositivo");
      sendMessage("Verificacao de dispositivo: " + descriTopic);
      BlinkLed(10, 100, 50, LED_02);
      break;
    case 2:
      digitalWrite(LED_01, LOW);  // Garante que a porta digital 3 está desligada
      Serial.println("Dispositivo Atribuido a uma objeto");
      sendMessage("Dispositivo Atribuido a uma objeto: " + descriTopic);
      BlinkLed(5, 500, 500, LED_02);
      break;
    case 3:
      digitalWrite(LED_01, LOW);  // Garante que a porta digital 3 está desligada
      Serial.println("Comando de carregamento ativado ao dispositivo");
      sendMessage("Comando de carregamento ativado ao dispositivo: " + descriTopic);
      // BlinkLed(1, 20, LED_02);
      digitalWrite(LED_02, HIGH);  // Liga porta digital 2
      StatusCarregamento = true;
      break;
    case 4:
      digitalWrite(LED_01, LOW);  // Garante que a porta digital 3 está desligada
      // BlinkLed(1, 20, LED_02)
      digitalWrite(LED_02, LOW);  // Liga porta digital 2
      Serial.println("Comando de carregamento concluido dispositivo disponivel");
      sendMessage("Comando de carregamento concluido dispositivo disponivel: " + descriTopic);
      StatusCarregamento = false;
      break;
    default:
      Serial.println("Comando não reconhecido");
      sendMessage("Comando não reconhecido: " + descriTopic);
      break;
  }
}


void BlinkLed(int piscar, int timeHigh, int timeLow, int Led) {
  if (StatusCarregamento) {
    digitalWrite(LED_02, LOW);
    delay(timeLow);
  }

  for (int i = 0; i < piscar; i++) {
    digitalWrite(Led, HIGH);
    delay(timeHigh);
    digitalWrite(Led, LOW);
    delay(timeLow);
  }

  if (StatusCarregamento) {
    digitalWrite(LED_02, HIGH);
  }
}

void reconnect() {
  // Loop until we’re reconnected
  while (!client->connected()) {
    Serial.print("Attempting MQTT connection…");
    String clientId = "ESP8266Client - MyClient";
    // Attempt to connect
    // Insert your password
    if (client->connect(clientId.c_str(), client_Id, clientId_key)) {
      Serial.println("connected");
      // Once connected, publish an announcement…

      client->publish(setTopicServer, ("TOPICO ATIVO: " + descriTopic).c_str());
      // … and resubscribe
      client->subscribe(setTopic);
    } else {
      Serial.print("failed, rc = ");
      Serial.print(client->state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


void setup() {
  delay(500);
  // When opening the Serial Monitor, select 9600 Baud
  // Serial.begin(9600);
  Serial.begin(115200);
  delay(500);

  // LittleFS.begin();
  if (!LittleFS.begin()) {
    Serial.println("An Error has occurred while mounting LittleFS");
    return;
  }

  File file = LittleFS.open("/test_example.txt", "r");
  if (!file) {
    Serial.println("Failed to open file for reading");
    return;
  }

  Serial.println("File Content:");
  while (file.available()) {
    Serial.write(file.read());
  }
  file.close();

  setup_wifi();
  setDateTime();

  // pinMode(LED_BUILTIN, OUTPUT); // Initialize the LED_BUILTIN pin as an output
  pinMode(LED_01, OUTPUT);  // Initialize the LED_BUILTIN pin as an output
  pinMode(LED_02, OUTPUT);  // Initialize the LED_BUILTIN pin as an output
  digitalWrite(LED_01, LOW);
  digitalWrite(LED_02, LOW);
  // you can use the insecure mode, when you want to avoid the certificates
  // espclient->setInsecure();

  int numCerts = certStore.initCertStore(LittleFS, PSTR("/certs.idx"), PSTR("/certs.ar"));
  Serial.printf("Number of CA certs read: %d\n", numCerts);
  if (numCerts == 0) {
    Serial.printf("No certs found. Did you run certs-from-mozilla.py and upload the LittleFS directory before running?\n");
    return;  // Can't connect to anything w/o certs!
  }

  BearSSL::WiFiClientSecure* bear = new BearSSL::WiFiClientSecure();
  // Integrate the cert store with this connection
  bear->setCertStore(&certStore);

  client = new PubSubClient(*bear);

  client->setServer(mqtt_server, 8883);
  client->setCallback(callback);
}

void loop() {
  if (!client->connected()) {
    reconnect();
  }
  client->loop();

  // unsigned long now = millis();
  // if (now - lastMsg > 2000) {
  //   lastMsg = now;
  //   ++value;
  //   snprintf (msg, MSG_BUFFER_SIZE, "hello world #%ld", value);
  //   Serial.print("Publish message: ");
  //   Serial.println(msg);
  //   client->publish(setTopic, msg);
  // }
}
