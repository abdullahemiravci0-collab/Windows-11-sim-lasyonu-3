# 🪟 Windows 11 Enterprise (apo Edition) with Undertale & MEMZ Simulation

Modern tarayıcı tabanlı, gerçeğe birebir sadık Windows 11 Fluent Design arayüzü, tam etkileşimli Undertale boss savaşları, MEMZ virüs simülasyonu ve yerel yapay zeka asistanı **Avcı AI** içeren tam teşekküllü web işletim sistemi deneyimi.

![Windows 11 Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200)

---

## 🌟 Öne Çıkan Özellikler

### 💀 1. Undertale (Web Fan Edition) & Boss Savaşları
- **Sans (Orijinal B&W Modeli):** Toby Fox'un orijinal siyah-beyaz monokrom savaşına sadık tasarım. Yanıp sönen mavi alevli göz (Bad Time), orijinal kaçma (*Dodge & MISS*) mekaniği ve Gaster Blaster lazer saldırıları.
- **Karakter Çeşitliliği:**
  - 🦴 **Papyrus:** Mavi Ruh (Yerçekimi / Gravity) modu, zıplama ve kemik engelleri, 8-bit *Bonetrousle* teması.
  - 🐟 **Undyne:** Yeşil Ruh (Green Soul) ve 4 yönlü kalkan mekaniği (ok tuşları/WASD ile gelen mızrakları savuşturma).
  - 🐐 **Toriel:** Dairesel alev saldırıları. *(Düşük canda alevler apo'dan kaçınır!)*
  - 🌻 **Flowey the Flower:** Dostluk tanecikleri ve şeytani gülüş dönüşümü.
  - 🤖 **Mettaton EX:** Poz verme (`[ ACT ]`), reyting sayacı ve disko saldırıları.
- **Müzik & Sesler:** Web Audio API ile sıfır harici dosya bağımlılığıyla sentezlenen 8-bit **Megalovania** ve **Bonetrousle** melodileri, Sans/Papyrus konuşma sesleri ve bıçak kesme efektleri.

---

### ⚠️ 2. MEMZ Trojan Simülasyonu & Sistem Kurtarma
- **Tetikleme & Onay Pencereleri:** Orijinal MEMZ uyarı diyalogları.
- **Payload Efektleri:** Ekran tüneli (*screen tunnel*), rastgele açılan Windows hata pencereleri, fare imleci izi ve ters renk glitchleri.
- **BSOD (Mavi Ekran):** Windows 11 QR kodlu ölüm ekranı.
- **Nyan Cat Bootloader:** İkonik 8-bit Nyan Cat animasyonu.
- **apo Güvenlik Kurtarma Konsolu:** Sistemi anında sıfırlayıp pencereleri güvenle geri yükleme.

---

### 🤖 3. Avcı AI - Sistem Asistanı
- Yönetici **apo** için özel olarak yapılandırılmış yapay zeka asistanı.
- İster Google Gemini API ile gerçek zamanlı akıllı yanıtlar, ister API anahtarı olmadan yerel zeki yanıt motoruyla kesintisiz sohbet.
- Windows komutları, MEMZ kurtarma taktikleri ve Undertale boss stratejileri sunar.

---

### 🖥️ 4. Windows 11 Arayüzü & Dahili Uygulamalar
- **Masaüstü & Görev Çubuğu:** Başlat Menüsü, Windows arama, ses/parlaklık paneli, takvim ve bildirim merkezi, sağ tık bağlam menüsü.
- **Pencere Yöneticisi:** Sürükleme, yeniden boyutlandırma, küçültme, büyütme (maximize) ve Windows Snap Layouts (ekran bölme).
- **Not Defteri (Notepad):** Metin düzenleme ve kaydetme.
- **Paint:** Renk seçimi, fırça kalınlığı ve tuval üzerine çizim.
- **Komut İstemi (CMD):** `help`, `dir`, `echo`, `cls`, `color`, `ping` ve gizli kodlar.
- **Görev Yöneticisi (Task Manager):** Canlı CPU/RAM grafikleri ve çalışan uygulamaları sonlandırma.
- **Hesap Makinesi:** Temel matematiksel işlemler.
- **Kilit Ekranı (Lock Screen):** PIN kodu veya Enter/Esc ile masaüstüne dönüş.

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- `npm` veya `bun`

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
cd REPO_ADINIZ
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. (İsteğe Bağlı) Gemini API Anahtarı
Avcı AI'ın bulut yapay zeka modelini kullanmasını isterseniz `.env` dosyası oluşturup anahtarınızı ekleyin:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Anahtar girilmezse yerel akıllı yanıt motoru otomatik devreye girer).*

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresine gidin.

### 5. Canlı Üretime Derleme (Production Build)
```bash
npm run build
npm start
```

---

## 📂 Proje Dizin Yapısı

```text
├── server.ts                  # Express & Gemini backend sunucusu
├── vite.config.ts             # Vite & Tailwind CSS konfigürasyonu
├── package.json               # Proje bağımlılıkları ve scriptler
├── index.html                 # Ana HTML giriş noktası
└── src/
    ├── main.tsx               # React DOM giriş noktası
    ├── App.tsx                # Ana Windows masaüstü & pencere yöneticisi
    ├── types.ts               # TypeScript tipleri ve arayüzler
    ├── index.css              # Tailwind CSS stilleri
    ├── utils/
    │   └── audio.ts           # Web Audio API 8-bit synthesizer & ses motoru
    └── components/
        ├── UndertaleApp.tsx   # Sans, Papyrus, Undyne savaş motoru
        ├── MemzSimulation.tsx # MEMZ virüs simülasyonu & Nyan Cat
        ├── AvciAiApp.tsx      # apo için Avcı AI sohbet uygulaması
        ├── Taskbar.tsx        # Windows 11 görev çubuğu & Başlat düğmesi
        ├── StartMenu.tsx      # Başlat menüsü ve arama
        ├── WindowFrame.tsx    # Akrilik efektli sürüklenebilir pencereler
        ├── NotepadApp.tsx     # Not defteri
        ├── PaintApp.tsx       # Çizim uygulaması
        ├── CmdApp.tsx         # Komut İstemi (Terminal)
        ├── TaskManagerApp.tsx # Görev yöneticisi & CPU monitörü
        ├── CalculatorApp.tsx  # Hesap makinesi
        ├── EdgeApp.tsx        # Microsoft Edge simülatörü
        ├── SettingsApp.tsx    # Windows ayarları & duvar kağıtları
        ├── LockScreen.tsx     # apo kilit ekranı
        └── DesktopIcons.tsx   # Masaüstü kısayolları
```

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, HTML5 Canvas
- **Ses & Müzik:** Web Audio API (Harici ses dosyası gerekmez)
- **Backend:** Node.js, Express, Vite Middleware Mode
- **AI Motoru:** `@google/genai` (Google Gemini 3.8 Flash)

---

## 📜 Lisans

Bu proje kişisel eğlence ve eğitim amacıyla geliştirilmiş bir hayran (fan-made) projesidir.  
- *Undertale* © Toby Fox  
- *Windows 11* © Microsoft Corporation  
- *Geliştirici:* **apo** için özel olarak hazırlanmıştır.
