# Kimyâ-yı Saâdet (İmam Gazâlî) - Mobil E-Kitap Okuyucu Uygulaması

Bu uygulama, Telegram bağlantısındaki (`https://t.me/pdfdinikitaplar/2836`) **752 sayfalık "Kimyâyı Saâdet - İmam Gazâlî"** kitabının taranmış PDF formatından arındırılarak, mobil cihazlarda akıcı şekilde okunabilen, dikey kaydırmalı (vertical scroll) modern bir e-kitaba dönüştürülmesiyle hazırlanmıştır.

---

## 🌟 Öne Çıkan Özellikler

### 1. 📖 Tam E-Kitap Deneyimi (Reflowable & Dikey Kaydırma)
- Sabit ve hantal taranmış PDF sayfaları yerine, mobil ekrana göre otomatik hizalanan, satır başları ve paragrafları düzenlenmiş akıcı metin yapısı.
- Yukarıdan aşağıya kesintisiz ve yumuşak kaydırma (smooth vertical scroll).

### 2. 🔍 Yazı Boyutu ve Tipografi Ayarları
- **Hızlı Boyut Değiştirme:** Ekranın alt barında yer alan `A−` ve `A+` butonlarıyla anında tek dokunuşla büyütme/küçültme.
- **Detaylı Yazı Slider'ı:** 14px ile 32px arasında dilediğiniz boyuta ayarlayabilme.
- **Yazı Tipi Seçenekleri:**
  - 📖 **Serif (Klasik Kitap):** Literata / Georgia ile geleneksel matbaa estetiği.
  - 🕌 **Amiri (Edebî / Hat):** Tasavvufi ve İslami eserlere özel zengin hat estetiği.
  - 📱 **Sans-Serif (Modern Net):** Gün ışığında ve küçük ekranlarda maksimum okunabilirlik.
- **Satır Aralığı:** Sıkı (1.4x), Normal (1.7x) ve Ferah (2.0x) modları.

### 3. 📊 Okuma Takibi ve Kaldığın Yerden Devam Etme
- **Otomatik Konum Kaydı:** Sayfayı kaydırdığınız her an, bulunduğunuz bölüm, paragraf ve okuma yüzdesi yerel veritabanına kaydedilir.
- **Kaldığın Yerden Devam Et:** Uygulama her açıldığında ana ekranda son okuduğunuz bölüm ve ilerleme oranı gösterilir; tek tıkla tam kaldığınız satıra atlarsınız.
- **Canlı İlerleme Çubuğu:** Ekranın en üstünde ve en altında `%` cinsinden canlı okuma takip göstergesi.

### 4. 🎨 Ekran ve Tema Modları
- ☀️ **Gündüz:** Temiz, aydınlık beyaz arka plan.
- 📜 **Sepya:** Göz yormayan, nostaljik krem kitap kâğıdı dokusu.
- 🌙 **Gece:** Koyu gri kontrastlı gece okuma modu.
- 🌌 **OLED Siyah:** AMOLED ekranlarda pil tasarrufu sağlayan derin siyah mod.
- 🕶️ **Gece Ekran Perdesi (Dimmer):** Yatakta okurken telefonun kendi parlaklığının da altına inebilmenizi sağlayan karartma filtresi (%0 - %65).
- 📱 **Tam Ekran Modu:** Bildirim çubuklarını gizleyerek dikkatsiz okuma sağlayan mod.

### 5. 🗄️ Yerel Veritabanı (Offline Local Database)
- İnternet bağlantısına asla ihtiyaç duymaz.
- Tüm kitap verisi (46 ana bölüm, 4 Unvan, 4 Rükün ve Mukaddime) uygulamanın kendi yerel veritabanında saklanır.
- SQLite (Android Native) ve IndexedDB / LocalStorage altyapısı ile okuma geçmişi ve yer imleri cihazınızda kalır.

### 6. 🔖 Yer İmleri ve 🔎 Kitap İçi Arama
- **Yer İmleri:** Dilediğiniz paragrafa sağındaki ikona dokunarak yer imi koyabilir, fihristteki yer imleri sekmesinden kayıtlı bölümlere tek tıkla dönebilirsiniz.
- **Hızlı Arama:** Kitabın tamamında saniyeler içinde arama yapabilir, eşleşen cümleleri vurgulu olarak görüp doğrudan o bölüme gidebilirsiniz.

---

## 📁 Proje Dizin Yapısı

```
KimyayiSaadetApp/
├── www/                                # E-Kitap Okuyucu Web / PWA Motoru
│   ├── index.html                      # Mobil Arayüz ve Okuyucu Görünümü
│   ├── styles.css                      # Modern Tipografi, Temalar ve Animasyonlar
│   ├── app.js                          # Okuma Motoru, Kaydırma & Veritabanı Mantığı
│   ├── book_database.js                # Kitabın 46 Bölümlük Tam Yapılandırılmış Veritabanı
│   ├── book_database.json              # Ham JSON Veritabanı
│   ├── manifest.json                   # Android PWA Kurulum Manifestosu
│   ├── sw.js                           # %100 Çevrimdışı Çalışma Sağlayan Service Worker
│   ├── icon-192.png                    # Android Uygulama İkonu (192px)
│   └── icon-512.png                    # Android Uygulama İkonu (512px)
├── android/                            # Tam Android Studio Gradle Projesi
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml         # Android Uygulama Yapılandırması
│   │   ├── assets/www/                 # APK İçine Gömülü Kitap ve Arayüz Dosyaları
│   │   ├── java/.../MainActivity.java  # Donanım Hızlandırmalı WebView ve JS Köprüsü
│   │   └── java/.../DatabaseHelper.java# Android Yerel SQLite Veritabanı Sınıfı
│   └── build.gradle                    # Gradle Derleme Dosyası
└── run_preview.py                      # Bilgisayarda veya Telefondan Test Sunucusu
```

---

## 🚀 Nasıl Çalıştırılır ve Telefona Yüklenir?

### Yöntem 1: Android Telefona Doğrudan Yükleme (PWA - En Kolay ve Hızlı Yol)
1. Bilgisayarınızda `KimyayiSaadetApp` klasöründe şu komutu çalıştırın:
   ```bash
   python run_preview.py
   ```
2. Terminal ekranında yerel ağ IP adresiniz gösterilecektir (Örn: `http://192.168.1.xxx:8085`).
3. Android telefonunuzun Chrome tarayıcısından bu adrese girin.
4. Chrome menüsünden (sağ üstteki 3 nokta) **"Ana Ekrana Ekle"** veya **"Uygulamayı Yükle"** butonuna dokunun.
5. Uygulama telefonunuza tıpkı Google Play'den indirilmiş gibi kendi ikonu ve adı ile kurulur. İnternet olmasa dahi %100 çevrimdışı çalışır.

### Yöntem 2: Android Studio ile APK Olarak Derleme
1. **Android Studio** uygulamasını açın.
2. `KimyayiSaadetApp/android` klasörünü proje olarak seçip açın.
3. Gradle senkronizasyonunun tamamlanmasını bekleyin.
4. Menüden **Build -> Build Bundle(s) / APK(s) -> Build APK(s)** seçeneğine tıklayın.
5. Üretilen `.apk` dosyasını telefonunuza yükleyip kurun.
