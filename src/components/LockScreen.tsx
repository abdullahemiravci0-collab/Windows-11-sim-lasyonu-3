import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, User, ShieldCheck, Power } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isLocked: boolean;
  onUnlock: () => void;
  wallpaperUrl?: string;
}

export const LockScreen: React.FC<Props> = ({ 
  isLocked, 
  onUnlock, 
  wallpaperUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920' 
}) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pin, setPin] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [dateStr, setDateStr] = useState('11 Eylül Cuma');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return;
      if (e.key === 'Escape' || e.key === 'Enter') {
        setShowLoginPrompt(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked]);

  if (!isLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playStartup();
    setShowLoginPrompt(false);
    setPin('');
    onUnlock();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-cover bg-center select-none overflow-hidden font-sans"
      style={{ backgroundImage: `url('${wallpaperUrl}')` }}
      onClick={() => {
        if (!showLoginPrompt) setShowLoginPrompt(true);
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col justify-between p-8 text-white">
        {/* If on primary lock screen */}
        {!showLoginPrompt ? (
          <>
            <div className="pt-16 pl-8">
              <div className="text-8xl font-extralight tracking-tight drop-shadow-lg">
                {timeStr}
              </div>
              <div className="text-2xl font-light text-slate-200 mt-2 drop-shadow-md">
                {dateStr}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-slate-200 border border-white/10">
                <span>☀️</span>
                <span>22°C Çoğunlukla Güneşli • İstanbul</span>
              </div>
            </div>

            <div className="text-center pb-6 animate-pulse text-xs text-slate-300">
              Kilidi açmak için herhangi bir yere tıklayın veya yukarı kaydırın
            </div>
          </>
        ) : (
          /* Login Screen for user apo */
          <div 
            onClick={(e) => e.stopPropagation()}
            className="m-auto w-full max-w-sm flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200"
          >
            {/* User Avatar */}
            <div className="w-28 h-28 rounded-full bg-blue-600 border-4 border-white/30 text-white font-bold text-4xl flex items-center justify-center shadow-2xl mb-4">
              A
            </div>

            <div className="text-2xl font-semibold text-white drop-shadow-md">apo</div>
            <div className="text-xs text-blue-300 font-medium mb-6">Yönetici (Administrator)</div>

            {/* PIN or Sign In Button */}
            <form onSubmit={handleUnlock} className="w-full space-y-3">
              <div className="relative">
                <input
                  type="password"
                  placeholder="PIN veya parola (İsteğe bağlı)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-900/80 border border-white/30 rounded-xl py-2.5 px-4 pr-10 text-sm text-white placeholder:text-slate-400 outline-none focus:border-blue-400 backdrop-blur-md shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                  title="Oturum Aç"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleUnlock()}
                className="w-full py-2.5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-xs font-semibold text-white transition backdrop-blur-md shadow-md"
              >
                Oturum Aç (apo)
              </button>
            </form>

            <button
              onClick={() => setShowLoginPrompt(false)}
              className="mt-6 text-xs text-slate-300 hover:text-white underline underline-offset-4"
            >
              Geri dön
            </button>
          </div>
        )}

        {/* Bottom corner power & network icons */}
        <div className="flex items-center justify-end gap-3 text-slate-300">
          <div className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <button 
            onClick={() => handleUnlock()}
            className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition"
            title="Kullanıcı: apo"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
