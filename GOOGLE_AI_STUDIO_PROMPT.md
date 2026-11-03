# GOOGLE AI STUDIO (https://aistudio.google.com/apps) PROMPT & SYSTEM REHBERİ

Bu dosya, Google AI Studio üzerinde Kimyâ-yı Saâdet (İmam Gazâlî) E-Kitap Android uygulamasını çalıştırmak, düzenlemek veya Gemini'ye yeni özellikler ekletmek için hazırlanmış hazır prompt şablonudur.

---

## 1. YÖNTEM: Google AI Studio "Apps" Bölümünde Çalıştırma (En Hızlı)

1. Tarayıcınızda **https://aistudio.google.com/apps** adresine gidin.
2. Yeni bir uygulama ("Create App" / "New App") başlatın.
3. Size sunulan kod editörüne projenizdeki **`KimyayiSaadetApp/standalone_ai_studio_app.html`** dosyasının tüm içeriğini yapıştırın.
4. "Run" / "Preview" butonuna bastığınız anda:
   - 46 bölümün tamamı yüklenecektir.
   - Dikey kaydırmalı (vertical scrolling) okuma aktif olacaktır.
   - A− / A+ yazı büyütme, 4 farklı okuma teması (Sepya, OLED, Gece, Gündüz), fihrist ve arama anında çalışacaktır.
5. "Share" veya "Export" butonuna basarak doğrudan mobil cihazınızdan açabilir veya PWA olarak Android telefonunuza yükleyebilirsiniz.

---

## 2. YÖNTEM: Google AI Studio Chat / System Prompt Olarak Kullanma

Aşağıdaki metni kopyalayıp Google AI Studio'da **System Instructions** veya **User Prompt** alanına yapıştırabilirsiniz:

```text
ROL VE GÖREV:
Sen uzman bir Mobil E-Kitap ve Android Uygulama Geliştiricisisin.
Konumuz: Hüccetü'l-İslâm İmam Ebû Hâmid el-Gazâlî'nin ölümsüz başyapıtı olan "Kimyâ-yı Saâdet" (Mutluluk İksiri) eseridir.

HEDEF:
Taranmış hantal PDF dosyaları yerine, mobil ekranda yukarıdan aşağıya kayan (vertical scroll), yazıları büyütülüp küçültülebilen, okuma konumu yerel veritabanında (local database / offline storage) saklanan tam bir modern Android E-Kitap Okuyucu uygulaması sunmak.

KİTAP VERİ YAPISI:
Eser 4 Temel Unvan ve 4 Büyük Rükünden (toplam 46 bölüm) oluşur:
1. Mukaddime: Hakikat Kimyası ve İnsanın Yaratılış Hikmeti
2. 1. Unvan: Kendi Hakikatini Bilmek (Nefsini Tanımak - Ruh, Kalp, Beden Ülkesi)
3. 2. Unvan: Allah Teâlâ'yı Tanımak (Marifetullah ve Muhabbetullah)
4. 3. Unvan: Dünyanın Hakikatini Tanımak (Dünyanın Aldatıcı Yüzü ve Faniliği)
5. 4. Unvan: Âhiretin Hakikatini Tanımak (Ölüm, Kabir, Mahşer ve Rüyetullah)
6. 1. Rükün: İbâdetler (İtikad, İlim, Taharet, Namaz, Zekât, Oruç, Hac, Kur'an, Zikir, Evrâd)
7. 2. Rükün: Muâmelât (Yemek, Evlilik, Helal Kazanç, Sohbet, Uzlet, Sefer, Semâ, Emr-i bi'l-Ma'ruf, Adalet)
8. 3. Rükün: Mühlikât (Nefis Riyazeti, Mide/Şehvet, Dil Afetleri, Öfke/Haset, Hubb-i Dünya, Makam Hırsı, Riya, Kibir, Gaflet)
9. 4. Rükün: Münciyât (Tövbe, Sabır/Şükür, Havf/Recâ, Zühd, İhlas/Sıdk, Murakabe, Tefekkür, Tevekkül, Muhabbetullah, Ölümü Anmak)

UYGULAMA TEKNİK ÖZELLİKLERİ:
1. Dikey Kaydırma (Vertical Scroll): Sabit PDF sayfaları yerine akıcı, ekrana uyumlu responsive tipografi.
2. Yazı Boyutu Kontrolü: Anlık A- / A+ steppers ve 14px-32px slider ile yazıları büyütme/küçültme.
3. Çoklu Temalar: Gündüz (Açık), Sepya (Kitap Kağıdı), Gece (Koyu Gri), OLED (Tam Siyah Pil Tasarrufu).
4. İlerleme Takibi: Scroll yüzdesi (%0 - %100) ve son okunan bölümü yerel hafızaya kaydedip 'Okumaya Devam Et' butonu ile kaldığı yere otomatik sarma.
5. Fihrist ve Kitap İçi Arama: 46 bölümlük konu indeksi ve içerikte canlı kelime arama.
6. %100 Çevrimdışı Çalışma (Offline First).

Lütfen bu yapıya uygun olarak bana Android için kodları, geliştirmeleri ve kullanıcı dostu arayüzü sağla.
```

---

## 3. PROJEDEKİ HAZIR DOSYALARINIZ:

1. **`standalone_ai_studio_app.html`**:
   Google AI Studio'ya veya herhangi bir tarayıcıya tek tıkla yapıştırıp çalıştırabileceğiniz, CSS'i, JS'i ve tüm kitap veritabanı içine gömülü tek parça uygulama dosyası.

2. **`android/`**:
   Android Studio'da derleyip doğrudan Google Play veya telefonunuza `.apk` olarak kurabileceğiniz yerel Android Studio projesi.

3. **`www/`**:
   Çevrimdışı PWA (Progressive Web App) sürümü.
