import React, { useState, useEffect, useRef } from 'react';
import { MemzStage, PopupAlert } from '../types';
import { sound } from '../utils/audio';
import { AlertTriangle, RefreshCw, ShieldAlert, Volume2, VolumeX } from 'lucide-react';

interface Props {
  stage: MemzStage;
  onSetStage: (stage: MemzStage) => void;
  onRecovered: () => void;
}

export const MemzSimulation: React.FC<Props> = ({ stage, onSetStage, onRecovered }) => {
  const [bsodProgress, setBsodProgress] = useState(0);
  const [popups, setPopups] = useState<PopupAlert[]>([]);
  const [cursorTrails, setCursorTrails] = useState<{ x: number; y: number; id: number; symbol: string }[]>([]);
  const [recoveryStep, setRecoveryStep] = useState(0);
  const [recoveryProgress, setRecoveryProgress] = useState(0);

  // Nyan canvas
  const nyanCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Warning 1 sound
  useEffect(() => {
    if (stage === 'warning1' || stage === 'warning2') {
      sound.playWarning();
    }
  }, [stage]);

  // Payload phase: popups, cursor trail, audio glitch
  useEffect(() => {
    if (stage !== 'payload') {
      setPopups([]);
      setCursorTrails([]);
      return;
    }

    const popupMessages = [
      'Still using this computer?',
      'ur computer is dead haha',
      'Enjoy the show apo!',
      'MEMZ Trojan payload is active!',
      'Windows 11 Enterprise (apo) corrupted!',
      'Why did you run this?',
      'Trojan.Win32.MEMZ in memory...',
      'Greetings from Leurak & Avcı AI!'
    ];

    const symbols = ['💀', '⚠️', '💣', '🐱', '🎵', '⚡', '🔥', '💻'];

    // Cursor tracking for trails
    let trailCount = 0;
    const handleMouseMove = (e: MouseEvent) => {
      trailCount++;
      if (trailCount % 3 === 0) {
        setCursorTrails(prev => [
          ...prev.slice(-18),
          {
            x: e.clientX,
            y: e.clientY,
            id: Date.now() + Math.random(),
            symbol: symbols[Math.floor(Math.random() * symbols.length)]
          }
        ]);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Random popup interval
    const popupInterval = setInterval(() => {
      sound.playMemzGlitch();
      const id = Date.now().toString() + Math.random();
      const x = 50 + Math.random() * (window.innerWidth - 320);
      const y = 50 + Math.random() * (window.innerHeight - 200);
      const title = Math.random() > 0.5 ? 'MEMZ Trojan' : 'Windows Güvenlik Hatası';
      const text = popupMessages[Math.floor(Math.random() * popupMessages.length)];

      setPopups(prev => [
        ...prev.slice(-8),
        { id, title, text, x, y, icon: 'warning' }
      ]);
    }, 700);

    // After 9 seconds of chaos, crash into BSOD!
    const crashTimer = setTimeout(() => {
      sound.playError();
      onSetStage('bsod');
    }, 9500);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(popupInterval);
      clearTimeout(crashTimer);
    };
  }, [stage, onSetStage]);

  // BSOD phase: progress counter 0 to 100%
  useEffect(() => {
    if (stage !== 'bsod') return;
    setBsodProgress(0);

    const interval = setInterval(() => {
      setBsodProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onSetStage('nyan');
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12 + 6);
      });
    }, 280);

    return () => clearInterval(interval);
  }, [stage, onSetStage]);

  // Nyan Cat screen
  useEffect(() => {
    if (stage !== 'nyan') {
      sound.stopNyanCat();
      return;
    }

    sound.startNyanCat();

    const canvas = nyanCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animId: number;

    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * 640,
      y: Math.random() * 360,
      speed: 1.5 + Math.random() * 3,
      size: 1.5 + Math.random() * 2
    }));

    const render = () => {
      frame++;
      ctx.fillStyle = '#003366';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#ffffff';
      stars.forEach(s => {
        s.x -= s.speed;
        if (s.x < 0) s.x = canvas.width;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      // Rainbow Trail behind cat
      const catX = canvas.width / 2 - 40;
      const catY = canvas.height / 2 - 20 + Math.sin(frame * 0.15) * 8;
      const colors = ['#ff0000', '#ff9900', '#ffff00', '#33ff00', '#0099ff', '#6633ff'];

      for (let rx = 0; rx < catX; rx += 14) {
        const waveY = Math.sin((frame + rx) * 0.15) * 6;
        colors.forEach((col, ci) => {
          ctx.fillStyle = col;
          ctx.fillRect(rx, catY + ci * 6 + waveY, 14, 6);
        });
      }

      // Draw Nyan Cat
      // Pop-tart body
      ctx.fillStyle = '#ffcc99';
      ctx.fillRect(catX, catY, 68, 44);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(catX, catY, 68, 44);

      // Pink icing
      ctx.fillStyle = '#ff66cc';
      ctx.fillRect(catX + 6, catY + 6, 56, 32);

      // Sprinkles
      ctx.fillStyle = '#cc0066';
      ctx.fillRect(catX + 12, catY + 12, 4, 4);
      ctx.fillRect(catX + 28, catY + 22, 4, 4);
      ctx.fillRect(catX + 44, catY + 14, 4, 4);
      ctx.fillRect(catX + 36, catY + 28, 4, 4);

      // Cat Head
      const headX = catX + 50;
      const headY = catY + 8;
      ctx.fillStyle = '#999999';
      ctx.fillRect(headX, headY, 28, 26);
      ctx.strokeRect(headX, headY, 28, 26);

      // Ears
      ctx.fillRect(headX + 2, headY - 8, 8, 8);
      ctx.fillRect(headX + 18, headY - 8, 8, 8);

      // Eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(headX + 8, headY + 8, 4, 4);
      ctx.fillRect(headX + 18, headY + 8, 4, 4);

      // Cheeks
      ctx.fillStyle = '#ff9999';
      ctx.fillRect(headX + 4, headY + 14, 5, 4);
      ctx.fillRect(headX + 21, headY + 14, 5, 4);

      // Legs animation
      ctx.fillStyle = '#999999';
      const legOffset = Math.sin(frame * 0.3) * 4;
      ctx.fillRect(catX + 8, catY + 44, 8, 8 + legOffset);
      ctx.fillRect(catX + 48, catY + 44, 8, 8 - legOffset);

      // Tail animation
      ctx.fillRect(catX - 12, catY + 14 + legOffset, 12, 6);

      animId = requestAnimationFrame(render);
    };

    render();

    // Auto-advance to Recovery Menu after 12s, or user can click
    const nyanTimer = setTimeout(() => {
      sound.stopNyanCat();
      onSetStage('recovery');
    }, 13000);

    return () => {
      sound.stopNyanCat();
      cancelAnimationFrame(animId);
      clearTimeout(nyanTimer);
    };
  }, [stage, onSetStage]);

  // Recovery progress handler
  const handleStartRecovery = () => {
    onSetStage('recovering');
    setRecoveryStep(1);
    setRecoveryProgress(10);

    const steps = [
      { step: 1, text: 'Sistem bileşenleri taranıyor...', delay: 1000 },
      { step: 2, text: 'Zararlı MEMZ.sys sürücüsü izole ediliyor ve siliniyor...', delay: 2400 },
      { step: 3, text: 'Önyükleme yapılandırma verileri (BCD) onarılıyor...', delay: 3800 },
      { step: 4, text: 'apo kullanıcı profili ve kayıt defteri geri yükleniyor...', delay: 5200 },
      { step: 5, text: 'Sistem yeniden başlatılıyor...', delay: 6500 }
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setRecoveryStep(step);
        setRecoveryProgress(step * 20);
      }, delay);
    });

    setTimeout(() => {
      sound.playStartup();
      onRecovered();
    }, 7200);
  };

  const closePopup = (id: string) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      {/* WARNING 1 DIALOG */}
      {stage === 'warning1' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[99990] p-4 select-none">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="w-4 h-4" /> Güvenlik Uyarısı - MEMZ_Payload.exe
              </span>
            </div>
            <div className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">
                  Çalıştırmak üzere olduğunuz yazılım ZARARLI YAZILIM (Trojan) olarak sınıflandırılmıştır.
                </p>
                <p>
                  Bu bir eğitim ve simülasyon aracıdır. Eğer devam ederseniz masaüstünüz bozulacak, ekran glitchleri belirecek ve apo-PC Mavi Ekran (BSOD) verecektir!
                </p>
                <p className="text-slate-500 font-medium">Devam etmek istediğinizden emin misiniz apo?</p>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => onSetStage('idle')}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-xs font-semibold text-slate-700 transition"
              >
                Hayır (İptal)
              </button>
              <button
                onClick={() => onSetStage('warning2')}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold text-white transition shadow-sm"
              >
                Evet (Devam Et)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WARNING 2 DIALOG */}
      {stage === 'warning2' && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[99992] p-4 select-none">
          <div className="bg-white rounded-lg shadow-2xl border-2 border-red-500 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> SON ŞANS UYARISI / LAST WARNING
              </span>
            </div>
            <div className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-red-600 animate-pulse" />
              </div>
              <div className="text-xs text-slate-800 space-y-2">
                <p className="font-bold text-red-600 text-sm">
                  BU SON UYARIDIR!
                </p>
                <p>
                  MEMZ_Payload.exe çalıştırıldıktan sonra durdurulamaz! Ekran ters dönecek, pencereler çoğalacak ve sistem Nyan Cat önyükleyicisine girecektir.
                </p>
                <p className="text-slate-600 italic">
                  Sistem sonrasında "Otomatik Onarım" ile yeniden başlatılabilecektir.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => onSetStage('idle')}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-xs font-semibold text-slate-700 transition"
              >
                İptal Et
              </button>
              <button
                onClick={() => onSetStage('payload')}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs font-bold text-white transition shadow-md"
              >
                RİSKİ KABUL EDİYORUM (MEMZ'i Başlat)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PAYLOAD: Cursor Trails & Random Popups */}
      {stage === 'payload' && (
        <div className="fixed inset-0 pointer-events-none z-[99995]">
          {/* Cursor Trails */}
          {cursorTrails.map(t => (
            <div
              key={t.id}
              style={{ left: t.x, top: t.y }}
              className="fixed pointer-events-none text-2xl -translate-x-1/2 -translate-y-1/2 animate-bounce transition-opacity duration-300"
            >
              {t.symbol}
            </div>
          ))}

          {/* Floating Random Popups */}
          {popups.map(p => (
            <div
              key={p.id}
              style={{ left: p.x, top: p.y }}
              className="absolute pointer-events-auto w-64 bg-slate-100 border-2 border-slate-400 rounded shadow-2xl overflow-hidden animate-in zoom-in-75 duration-150"
            >
              <div className="bg-blue-800 text-white px-2 py-1 text-[11px] font-bold flex justify-between items-center">
                <span>{p.title}</span>
                <button onClick={() => closePopup(p.id)} className="hover:bg-red-600 px-1.5 text-xs font-mono">✕</button>
              </div>
              <div className="p-3 text-xs text-slate-800 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span>{p.text}</span>
              </div>
              <div className="p-1.5 bg-slate-200 text-right">
                <button 
                  onClick={() => closePopup(p.id)}
                  className="px-3 py-0.5 bg-white hover:bg-slate-100 border border-slate-400 rounded text-[11px] font-semibold"
                >
                  Tamam
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STAGE 2: BSOD (Mavi Ekran) */}
      {stage === 'bsod' && (
        <div className="fixed inset-0 bg-[#0078d7] text-white p-8 sm:p-14 flex flex-col justify-between z-[99998] font-sans select-none animate-in fade-in duration-300">
          <div>
            <div className="text-7xl sm:text-9xl mb-6 font-light">:(</div>
            <h1 className="text-xl sm:text-3xl font-light mb-4">
              Cihazınız (apo-PC) bir sorunla karşılaştı ve yeniden başlatılması gerekiyor.
            </h1>
            <p className="text-sm sm:text-base font-light mb-8 opacity-90 max-w-2xl">
              Biz sadece bazı hata bilgilerini topluyoruz, ardından sizin için otomatik olarak yeniden başlatacağız.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-10">
              {/* QR Code Mock */}
              <div className="bg-white p-2 text-black w-24 h-24 flex flex-col items-center justify-center border border-white">
                <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-black">
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div>
                  <div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div><div className="bg-white"></div>
                  <div className="bg-black"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-black"></div>
                  <div className="bg-white"></div><div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div>
                </div>
              </div>

              <div className="text-xs sm:text-sm space-y-1 font-light opacity-95">
                <div>Bu konu hakkında daha fazla bilgi edinmek için çevrimiçi destek ekibini arayabilirsiniz.</div>
                <div className="font-semibold text-white mt-1">Durdurma Kodu: MEMZ_MALWARE_EXECUTED</div>
                <div>Başarısız olan: MEMZ.sys</div>
                <div className="text-blue-200">Kullanıcı: apo | Hata Kaydı: C:\Windows\Minidump\apo.dmp</div>
              </div>
            </div>
          </div>

          <div className="text-sm sm:text-base font-light pt-6 border-t border-white/20 flex items-center justify-between">
            <div>
              Tamamlanan: %<span className="font-bold text-lg">{bsodProgress}</span>
            </div>
            <div className="text-xs opacity-75">Windows 11 Enterprise Recovery Engine</div>
          </div>
        </div>
      )}

      {/* STAGE 3: NYAN CAT BOOT SCREEN */}
      {stage === 'nyan' && (
        <div className="fixed inset-0 bg-black text-white flex flex-col justify-between p-4 sm:p-6 z-[99999] font-mono select-none crt-scanlines">
          {/* Header Terminal Message */}
          <div className="text-green-400 text-xs sm:text-sm space-y-1">
            <div className="font-bold text-red-500">
              YOUR COMPUTER HAS BEEN INFECTED BY THE MEMZ TROJAN.
            </div>
            <div className="text-emerald-400">
              User: apo | Your computer won't boot up again, so enjoy the Nyan Cat!
            </div>
          </div>

          {/* Animated Nyan Canvas */}
          <div className="flex-1 flex flex-col items-center justify-center my-3">
            <div className="text-amber-300 font-bold text-base sm:text-xl mb-3 tracking-widest text-center animate-pulse">
              🐱🚀 NYAN CAT BOOTLOADER 🐱🚀
            </div>
            <canvas
              ref={nyanCanvasRef}
              width={640}
              height={320}
              className="max-w-full rounded border-2 border-slate-700 shadow-2xl bg-[#003366]"
            />
            <div className="text-pink-400 font-bold text-xs sm:text-sm tracking-widest text-center mt-3">
              ~=[,,_,,]:3 ~=[,,_,,]:3 ~=[,,_,,]:3
            </div>
          </div>

          {/* Footer with Skip button */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
            <span className="text-slate-400 animate-pulse">Kurtarma moduna geçiliyor... Lütfen bekleyin.</span>
            <button
              onClick={() => {
                sound.stopNyanCat();
                onSetStage('recovery');
              }}
              className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded font-sans text-xs transition"
            >
              Kurtarma Menüsüne Geç &gt;
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: AUTOMATIC REPAIR / RECOVERY MENU */}
      {(stage === 'recovery' || stage === 'recovering') && (
        <div className="fixed inset-0 bg-[#002040] text-white p-6 sm:p-12 flex flex-col justify-between z-[999999] font-sans select-none">
          <div className="max-w-xl mx-auto my-auto w-full">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
              <RefreshCw className={`w-6 h-6 text-cyan-400 ${stage === 'recovering' ? 'animate-spin' : ''}`} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-light mb-2 text-cyan-400">
              Otomatik Onarım (Automatic Repair)
            </h1>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Sayın <span className="text-white font-semibold">apo</span>, bilgisayarınız düzgün başlatılamadı. Kötü amaçlı MEMZ_Payload.exe kaynaklı sistem dosyası hasarı tespit edildi.
            </p>

            {stage === 'recovery' && (
              <div className="space-y-3">
                <button
                  onClick={handleStartRecovery}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-3.5 rounded-lg text-left text-sm font-medium transition shadow-lg flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <div>
                      <div className="font-semibold">Sistemi Onar ve Yeniden Başlat (Geri Yükleme)</div>
                      <div className="text-[11px] text-cyan-100">MEMZ.sys izole edilecek, apo-PC güvenli şekilde açılacaktır.</div>
                    </div>
                  </div>
                  <span className="text-xs bg-cyan-700 px-2.5 py-1 rounded">Başlat</span>
                </button>
              </div>
            )}

            {stage === 'recovering' && (
              <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-cyan-500/20">
                <div className="flex justify-between text-xs text-cyan-300">
                  <span>Sistem Kurtarma İşlemi Sürüyor...</span>
                  <span className="font-bold">%{recoveryProgress}</span>
                </div>

                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                    style={{ width: `${recoveryProgress}%` }}
                  />
                </div>

                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  {recoveryStep === 1 && 'Sistem bileşenleri taranıyor...'}
                  {recoveryStep === 2 && 'Zararlı MEMZ.sys sürücüsü izole ediliyor ve siliniyor...'}
                  {recoveryStep === 3 && 'Önyükleme yapılandırma verileri (BCD) onarılıyor...'}
                  {recoveryStep === 4 && 'apo kullanıcı profili ve kayıt defteri geri yükleniyor...'}
                  {recoveryStep === 5 && 'Sistem yeniden başlatılıyor... Hoş geldiniz apo!'}
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-500">
            Windows 11 Enterprise (apo) Recovery Environment v10.0.22631
          </div>
        </div>
      )}
    </>
  );
};
