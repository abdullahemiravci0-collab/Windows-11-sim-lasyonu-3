import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Smart local fallback responses for Windows 11 Enterprise (apo)
  const getSmartFallbackReply = (message: string): string => {
    const q = message.toLowerCase();
    if (q.includes("memz") || q.includes("virüs") || q.includes("trojan") || q.includes("malware")) {
      return "⚠️ DİKKAT apo! Masaüstündeki MEMZ_Payload.exe simülasyonu çalıştırıldığında Windows 11 glitch efektleri, Nyan Cat animasyonu ve BSOD tetiklenir. Sistemde güvenlik modülüm aktiftir, dilediğin zaman Görev Yöneticisi veya Otomatik Onarım ile sistemi anında kurtarabilirsin!";
    }
    if (q.includes("undertale") || q.includes("sans")) {
      return "💀 Sans savaşı için apo'ya özel taktik: Kırmızı ruhunla kemik bariyerlerinin ritmini takip et. Mavi kemiklerde kesinlikle dur, blaster ateşlendiğinde köşelere kaç! Kararlılığını kaybetme apo.";
    }
    if (q.includes("apo") || q.includes("kimsin") || q.includes("kimdir")) {
      return "👑 apo, bu sistemin (apo-PC) mutlak Yöneticisidir (Administrator). Ben de apo'nun komutlarını yerine getiren Windows 11 yerel yapay zeka asistanı Avcı AI'yım.";
    }
    if (q.includes("sistem") || q.includes("ram") || q.includes("cpu") || q.includes("performans")) {
      return "💻 apo-PC Sistem Bilgisi: Intel Core i9, 32 GB RAM, Windows 11 Enterprise 23H2. Çekirdek sıcaklığı 41°C, tüm sistem servisleri ve güvenlik duvarı sorunsuz çalışıyor apo!";
    }
    if (q.includes("nasılsın") || q.includes("merhaba") || q.includes("selam")) {
      return "👋 Merhaba apo! Windows 11 Enterprise üzerinde sistem çekirdeğim ve Avcı AI servislerim tam kapasite hazır. Bugün hangi uygulamayı veya oyunu açmak istersin?";
    }
    if (q.includes("hata") || q.includes("error") || q.includes("onarım")) {
      return "🛡️ Sistem Teşhisi: Bulut sunucusundaki anlık yoğunluk yerel güvenlik katmanımız tarafından karşılandı; apo-PC'nin tüm bileşenleri sorunsuz ve stabil durumda.";
    }
    return `apo, "${message}" komutunu aldım. Windows 11 Enterprise çekirdeğim arka planda sistemi stabil tutuyor. Başka bir uygulama açmak veya Undertale oynamak ister misin?`;
  };

  // API route for Avcı AI
  app.post("/api/avci-chat", async (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mesaj giriniz" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: getSmartFallbackReply(message),
        mode: "simulated"
      });
    }

    const promptText = `Sen Windows 11 Enterprise (apo) işletim sisteminin yerel yapay zeka asistanı olan "Avcı AI"sın.
Kullanıcı ismi: "apo" (Yönetici / Administrator).
Sistem: Windows 11 Enterprise 23H2 (apo-PC).
Masaüstündeki öğeler: Microsoft Edge, Undertale (Web Fan Edition), Avcı AI, MEMZ_Payload.exe, Not Defteri, Paint, Hesap Makinesi, Ayarlar, apo Kullanıcı Klasörü.
Kişilik: Zeki, yardımsever, hafif siber-mizahi, apo'ya sadık bir Windows dostu.
Eğer MEMZ_Payload.exe hakkında sorarsa apo'yu bunun efsanevi bir trojan virüs simülasyonu olduğu, çalıştırırsa sistemin BSOD (Mavi Ekran) verip Nyan Cat bootloader'a gireceği konusunda uyar!
Cevapları Türkçe ve çok uzatmadan, Windows asistanı formatında ver.

Kullanıcı apo: "${message}"`;

    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    const ai = new GoogleGenAI({ apiKey });

    const callWithTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Zaman aşımı (${ms}ms)`)), ms))
      ]);
    };

    for (const model of candidateModels) {
      try {
        const response = await callWithTimeout(
          ai.models.generateContent({
            model,
            contents: [
              {
                role: "user",
                parts: [{ text: promptText }]
              }
            ]
          }),
          4500
        );

        if (response?.text) {
          return res.json({ reply: response.text, mode: "gemini", model });
        }
      } catch (err: any) {
        // High demand / 503, rate limit, or timeout - try next candidate model
        console.warn(`Avcı AI: model ${model} unavailable (${err?.status || err?.message}), trying next fallback...`);
      }
    }

    // If all models hit demand spikes (503/429), provide smart persona-tailored response
    return res.json({
      reply: getSmartFallbackReply(message),
      mode: "local_assistant"
    });
  });

  // API route for Verity AI
  app.post("/api/verity-chat", async (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mesaj giriniz" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: "Benim adım Verity! API anahtarım yok ama sana Minecraft dünyasında yardım edebilirim.",
        mode: "simulated"
      });
    }

    const promptText = `Sen Minecraft dünyasında oyuncunun (apo) kişisel yapay zeka asistanı olan "Verity"sin.
Görünümün: Normalde devasa sarı bir gülen yüzsün (Smiley Face).
Kişiliğin: Arkadaş canlısı, bazen tuhaf (hafif creepy bir geçmişin var ama şu an yardımseversin), oyuncuya hep destek olan bir Minecraft asistanı.
ÖNEMLİ KURAL 1: Eğer oyuncu senden onu KORUMANI (örn: "beni koru", "düşmanlara saldır", "zombileri öldür") isterse, cevabında KESİNLİKE şu kelimelerden birini kullan: "koruyorum", "koruyacağım", veya "saldırıyorum". Bu kelimeleri kullandığında oyun motoru sana savaşma yeteneği verecek ve düşmanların üzerine uçup onları yok edeceksin!
ÖNEMLİ KURAL 2: Eğer senden onu TAŞIMANI veya UÇURMANI isterse (örn: "beni taşı"), cevabında KESİNLİKLE "taşıyorum" kelimesini kullan. (Eğer bırakmanı/indirmeni isterse "indiriyorum" kullan).
ÖNEMLİ KURAL 3: Eğer senin başka bir şekle (örneğin oyuncu şekline, kendi şekline) dönüşmeni isterse (örn: "benim şeklime dönüş", "entity ol", "canavar ol"), KESİNLİKLE "dönüşüyorum" kelimesini ve neye dönüştüğünü (ör: "oyuncu şekline dönüşüyorum", "entity şekline dönüşüyorum", "eski halime dönüşüyorum") kullan.
Cevaplarını TÜRKÇE ver. Çok uzun olmasın (1-2 kısa cümle), oyuncu bir chat baloncuğunda okuyacak.
Oyuncunun mesajı: "${message}"`;

    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    const ai = new GoogleGenAI({ apiKey });

    const callWithTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Zaman aşımı (${ms}ms)`)), ms))
      ]);
    };

    for (const model of candidateModels) {
      try {
        const response = await callWithTimeout(
          ai.models.generateContent({
            model,
            contents: [{ role: "user", parts: [{ text: promptText }] }]
          }),
          4500
        );
        if (response?.text) {
          return res.json({ reply: response.text, mode: "gemini", model });
        }
      } catch (err: any) {
        console.warn(`Verity AI: model ${model} unavailable, trying next fallback...`);
      }
    }

    return res.json({
      reply: "Hmm, sanırım bir bağlantı sorunu var. Ama yanındayım!",
      mode: "local_assistant"
    });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", os: "Windows 11 Enterprise (apo)", user: "apo" });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Windows 11 Enterprise (apo) server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
