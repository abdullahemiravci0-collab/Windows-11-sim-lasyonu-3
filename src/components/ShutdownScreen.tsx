import React, { useEffect } from 'react';
import { Power, Monitor } from 'lucide-react';
import { sound } from '../utils/audio';

export type PowerState = 
  | 'running' 
  | 'shutting_down' 
  | 'restarting' 
  | 'off' 
  | 'booting_logo' 
  | 'booting_welcome'
  | 'bsod';

interface Props {
  powerState: PowerState;
  onTurnOn: () => void;
  wallpaperUrl?: string;
}

// Windows 11 Authentic Segoe Boot / Progress Ring (5 orbiting dots)
export const Win11ProgressRing: React.FC<{ size?: number; dotSize?: number; color?: string }> = ({
  size = 46,
  dotSize = 5,
  color = 'bg-white'
}) => {
  const delays = [0, 0.16, 0.32, 0.48, 0.64];
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {delays.map((delay, idx) => (
        <div
          key={idx}
          className="absolute inset-0 animate-win11-dot"
          style={{ animationDelay: `${delay}s` }}
        >
          <div
            className={`rounded-full ${color} mx-auto shadow-[0_0_6px_rgba(255,255,255,0.85)]`}
            style={{ width: dotSize, height: dotSize }}
          />
        </div>
      ))}
    </div>
  );
};

// Windows 11 Authentic Flat Blue 4-Square Logo
export const Win11Logo: React.FC<{ size?: number }> = ({ size = 68 }) => {
  const gap = Math.max(3, Math.round(size * 0.065));
  const sqSize = (size - gap) / 2;
  return (
    <div
      className="grid grid-cols-2 grid-rows-2 select-none"
      style={{ width: size, height: size, gap: `${gap}px` }}
    >
      <div className="bg-[#0078d4] rounded-[1px] shadow-[0_0_18px_rgba(0,120,212,0.45)]" style={{ width: sqSize, height: sqSize }} />
      <div className="bg-[#0078d4] rounded-[1px] shadow-[0_0_18px_rgba(0,120,212,0.45)]" style={{ width: sqSize, height: sqSize }} />
      <div className="bg-[#0078d4] rounded-[1px] shadow-[0_0_18px_rgba(0,120,212,0.45)]" style={{ width: sqSize, height: sqSize }} />
      <div className="bg-[#0078d4] rounded-[1px] shadow-[0_0_18px_rgba(0,120,212,0.45)]" style={{ width: sqSize, height: sqSize }} />
    </div>
  );
};

export const ShutdownScreen: React.FC<Props> = ({ 
  powerState, 
  onTurnOn, 
  wallpaperUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920' 
}) => {
  useEffect(() => {
    if (powerState !== 'off') return;
    const handleKeyDown = () => {
      // Any key press wakes the computer into original Windows 11 boot sequence
      sound.playClick();
      onTurnOn();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [powerState, onTurnOn]);

  if (powerState === 'running') return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none font-[Segoe_UI,system-ui,-apple-system,sans-serif] overflow-hidden">
      {/* 1. Windows 11 Orijinal Kapatılıyor / Yeniden Başlatılıyor Ekranı */}
      {(powerState === 'shutting_down' || powerState === 'restarting') && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-300"
          style={{
            background: 'radial-gradient(circle at 50% 45%, #004c8f 0%, #001f40 60%, #000a18 100%)'
          }}
        >
          {/* Windows 11 Yükleme Çarkı (Orijinal döner noktalar) */}
          <div className="mb-7">
            <Win11ProgressRing size={48} dotSize={5.5} />
          </div>

          <h2 className="text-2xl font-light tracking-wide text-white">
            {powerState === 'restarting' ? 'Yeniden başlatılıyor' : 'Kapatılıyor'}
          </h2>
        </div>
      )}

      {/* 2. PC Kapalı (Standby / Black Screen) Ekranı */}
      {powerState === 'off' && (
        <div 
          onClick={() => {
            sound.playClick();
            onTurnOn();
          }}
          className="absolute inset-0 bg-black flex flex-col items-center justify-center text-slate-400 p-6 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative flex flex-col items-center max-w-sm text-center"
          >
            {/* Güç LED Işığı (Amber / Turuncu Standby LED) */}
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-2xl relative group">
              <div 
                className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" 
                title="Standby LED" 
              />
              
              <button
                id="pc-power-btn"
                onClick={() => {
                  sound.playClick();
                  onTurnOn();
                }}
                className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition shadow-inner group-hover:ring-2 group-hover:ring-blue-500 cursor-pointer"
                title="PC'yi Aç (Power Button)"
              >
                <Power className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-medium text-slate-200">
                apo-PC Kapalı
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bilgisayarı başlatmak için güç tuşuna veya ekrana dokunun.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onTurnOn();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-lg hover:shadow-blue-500/30 transition transform active:scale-95 cursor-pointer"
            >
              <Power className="w-4 h-4" />
              <span>apo-PC'yi Başlat (Güç Tuşu)</span>
            </button>

            <div className="mt-8 text-[11px] text-slate-400 flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5" />
              <span>Klavyeden herhangi bir tuşa basarak da açabilirsiniz.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Windows 11 Orijinal Açılış Ekranı - Boot Logo (UEFI/BIOS Açılışı) */}
      {powerState === 'booting_logo' && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
          {/* Windows 11 Logosu */}
          <div className="mb-14">
            <Win11Logo size={68} />
          </div>

          {/* Dönen Windows 11 Noktaları */}
          <div className="mt-2">
            <Win11ProgressRing size={44} dotSize={5} />
          </div>
        </div>
      )}

      {/* 4. Windows 11 Orijinal Açılış Ekranı - Hoş Geldiniz (Welcome Screen) */}
      {powerState === 'booting_welcome' && (
        <div 
          className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center text-white animate-in fade-in duration-500"
          style={{ backgroundImage: `url('${wallpaperUrl}')` }}
        >
          {/* Windows 11 Acrylic Blur Katmanı */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xl" />

          <div className="relative z-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            {/* Kullanıcı Avatarı (apo) */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-3xl flex items-center justify-center shadow-2xl border-2 border-white/40 mb-4">
              A
            </div>

            <h1 className="text-2xl font-semibold text-white tracking-normal drop-shadow-md mb-6">
              apo
            </h1>

            {/* Dönen Çark ve "Hoş geldiniz" */}
            <div className="flex flex-col items-center gap-3">
              <Win11ProgressRing size={42} dotSize={5} />
              <span className="text-base font-normal text-slate-100 tracking-normal">
                Hoş geldiniz
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Blue Screen of Death (BSOD) */}
      {powerState === 'bsod' && (
        <div className="absolute inset-0 bg-[#0078D7] flex flex-col justify-center text-white px-24 py-16 animate-in fade-in duration-300 font-segoe select-none cursor-none z-50">
          <h1 className="text-[120px] font-normal leading-none mb-8">:(</h1>
          <p className="text-2xl mb-8 w-[80%] leading-tight font-light">
            Cihazınız bir sorunla karşılaştı ve yeniden başlatılması gerekiyor. Şu anda bazı
            hata bilgileri toplanıyor, bu işlemden sonra sizin için yeniden başlatılacak.
          </p>
          <div className="flex items-center gap-6 mt-4">
            <h2 className="text-3xl font-light">100% tamamlandı</h2>
          </div>
          <div className="mt-12 flex gap-4 text-sm font-light">
            <div className="bg-white p-2 rounded shrink-0">
              {/* Dummy QR Code representation */}
              <div className="w-24 h-24 bg-white grid grid-cols-5 grid-rows-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={Math.random() > 0.5 ? 'bg-black' : 'bg-white'} />
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <p>Bu sorun ve olası düzeltmeler hakkında daha fazla bilgi için:</p>
              <p>https://www.windows.com/stopcode</p>
              <p className="mt-4">Durdurma Kodu: CRITICAL_PROCESS_DIED</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
