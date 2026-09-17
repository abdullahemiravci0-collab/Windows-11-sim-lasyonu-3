import React, { useState, useEffect } from 'react';
import { AppId, WindowState } from '../types';
import { sound } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Wifi, 
  Battery, 
  Bell, 
  ChevronUp, 
  Monitor, 
  ShieldCheck,
  Search
} from 'lucide-react';

interface Props {
  openWindows: WindowState[];
  activeWindowId: AppId | null;
  isStartOpen: boolean;
  onToggleStart: () => void;
  onOpenApp: (id: AppId) => void;
  onToggleQuickSettings: () => void;
  isQuickSettingsOpen: boolean;
  onToggleWidgets: () => void;
  isWidgetsOpen: boolean;
  onToggleCalendar: () => void;
  isCalendarOpen: boolean;
  onMinimizeAll?: () => void;
}

export const Taskbar: React.FC<Props> = ({
  openWindows,
  activeWindowId,
  isStartOpen,
  onToggleStart,
  onOpenApp,
  onToggleQuickSettings,
  isQuickSettingsOpen,
  onToggleWidgets,
  isWidgetsOpen,
  onToggleCalendar,
  isCalendarOpen,
  onMinimizeAll
}) => {
  const [timeStr, setTimeStr] = useState('12:00');
  const [dateStr, setDateStr] = useState('01.01.2026');
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const pinnedApps: { id: AppId; iconClass: string; colorClass: string; title: string }[] = [
    { id: 'user', iconClass: 'fa-solid fa-folder', colorClass: 'text-amber-400', title: 'Dosya Gezgini' },
    { id: 'edge', iconClass: 'fa-brands fa-edge', colorClass: 'text-blue-400', title: 'Microsoft Edge' },
    { id: 'avci', iconClass: 'fa-solid fa-robot', colorClass: 'text-cyan-400', title: 'Avcı AI Asistanı' },
    { id: 'undertale', iconClass: 'fa-solid fa-heart', colorClass: 'text-red-500', title: 'Undertale' },
    { id: 'calculator', iconClass: 'fa-solid fa-calculator', colorClass: 'text-blue-400', title: 'Hesap Makinesi' },
    { id: 'notepad', iconClass: 'fa-solid fa-file-lines', colorClass: 'text-sky-300', title: 'Not Defteri' },
    { id: 'paint', iconClass: 'fa-solid fa-paint-brush', colorClass: 'text-pink-400', title: 'Paint' },
    { id: 'cmd', iconClass: 'fa-solid fa-terminal', colorClass: 'text-emerald-400', title: 'Komut İstemi' },
    { id: 'taskmgr', iconClass: 'fa-solid fa-chart-line', colorClass: 'text-purple-400', title: 'Görev Yöneticisi' },
    { id: 'settings', iconClass: 'fa-solid fa-gear', colorClass: 'text-slate-300', title: 'Ayarlar' },
    { id: 'memz', iconClass: 'fa-solid fa-triangle-exclamation', colorClass: 'text-yellow-400', title: 'MEMZ_Payload.exe' }
  ];

  return (
    <div className="h-12 w-full bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 dark:border-slate-800/80 flex items-center justify-between px-2 text-white z-50 select-none font-sans">
      {/* Left side: Windows 11 Widgets button */}
      <button 
        onClick={onToggleWidgets}
        className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg transition-all ${
          isWidgetsOpen ? 'bg-white/20 dark:bg-white/10 ring-1 ring-white/20 dark:ring-white/10' : 'hover:bg-white/10 dark:hover:bg-white/5 text-slate-300 dark:text-slate-400'
        }`}
        title="Widget'lar (Hava Durumu, Haberler)"
      >
        <span className="text-amber-400 text-sm">☀️</span>
        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-semibold leading-tight">22°C Güneşli</div>
          <div className="text-[9px] text-slate-400 leading-none">apo-PC • İstanbul</div>
        </div>
      </button>

      {/* Center: Windows 11 Centered App Dock */}
      <div className="flex items-center gap-1 mx-auto">
        {/* Start Button */}
        <button
          onClick={onToggleStart}
          className={`p-2 rounded-lg transition-all flex items-center justify-center ${
            isStartOpen
              ? 'bg-white/20 dark:bg-white/10 text-blue-300 ring-1 ring-blue-400'
              : 'hover:bg-white/15 dark:hover:bg-white/5 text-blue-400 active:scale-95'
          }`}
          title="Başlat"
        >
          <svg className="w-5 h-5 fill-current text-blue-400 drop-shadow-sm" viewBox="0 0 24 24">
            <path d="M0 0h11v11H0zM13 0h11v11H13zM0 13h11v11H0zM13 13h11v11H13z" />
          </svg>
        </button>

        {/* Taskbar Search Pill */}
        <button
          onClick={onToggleStart}
          className="hidden md:flex items-center gap-2 bg-slate-800/80 dark:bg-slate-800 hover:bg-slate-700/80 dark:hover:bg-slate-700 border border-white/10 dark:border-slate-700 rounded-full px-3 py-1 text-slate-300 text-xs transition"
          title="Arama yapmak için yazın"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px]">Ara</span>
        </button>

        {/* Task View icon */}
        <button
          onClick={onToggleWidgets}
          className="hidden sm:flex p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 text-slate-300 dark:text-slate-400 transition"
          title="Görev Görünümü & Widget'lar"
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* Pinned & Running Apps */}
        {pinnedApps.map((app) => {
          const isOpen = openWindows.some(w => w.id === app.id);
          const isActive = activeWindowId === app.id;

          return (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className={`relative p-2 rounded-lg transition-all flex flex-col items-center justify-center group ${
                isActive
                  ? 'bg-white/20'
                  : isOpen
                  ? 'bg-white/10 hover:bg-white/15'
                  : 'hover:bg-white/10 active:scale-95'
              }`}
              title={app.title}
            >
              <i className={`${app.iconClass} ${app.colorClass} text-lg drop-shadow-sm group-hover:scale-110 transition-transform`}></i>
              
              {/* Active / Open indicator pill */}
              {isOpen && (
                <div
                  className={`absolute bottom-0.5 h-1 rounded-full transition-all ${
                    isActive ? 'w-4 bg-blue-400' : 'w-1.5 bg-slate-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side: System Tray */}
      <div className="flex items-center gap-1 text-slate-300 text-xs">
        {/* Hidden Icons chevron */}
        <div className="hidden sm:block p-1 hover:bg-white/10 rounded cursor-pointer text-slate-400">
          <ChevronUp className="w-3.5 h-3.5" />
        </div>

        {/* Language Badge */}
        <div className="hidden sm:block px-1.5 py-0.5 hover:bg-white/10 rounded font-semibold text-[10px] text-slate-300 cursor-pointer">
          TUR
        </div>

        {/* Mute / Audio Toggle */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 hover:bg-white/10 rounded-lg transition text-slate-300"
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
        </button>

        {/* Quick Settings Group (Wifi, Battery) */}
        <button
          onClick={onToggleQuickSettings}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition ${
            isQuickSettingsOpen ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'
          }`}
          title="Hızlı Ayarlar (Ağ, Pil, Ses)"
        >
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </button>

        {/* Clock & Date (opens Windows 11 Calendar flyout) */}
        <div 
          onClick={onToggleCalendar}
          className={`text-right px-2 py-1 rounded-lg cursor-pointer transition select-none ${
            isCalendarOpen ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'
          }`}
          title="Takvim ve Bildirimleri Aç"
        >
          <div className="font-semibold text-[11px] text-white leading-tight">{timeStr}</div>
          <div className="text-[10px] text-slate-400 leading-tight">{dateStr}</div>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onToggleCalendar}
          className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 relative transition"
          title="Bildirimler"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
        </button>

        {/* Desktop Peek line at very end */}
        <button
          onClick={onMinimizeAll}
          className="w-1.5 h-8 border-l border-white/20 hover:bg-white/30 transition ml-0.5 rounded-xs"
          title="Masaüstünü Göster"
        />
      </div>
    </div>
  );
};
