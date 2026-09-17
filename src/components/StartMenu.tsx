import React, { useState } from 'react';
import { AppId } from '../types';
import { 
  Search, 
  Power, 
  Settings, 
  RotateCw, 
  Lock, 
  LogOut, 
  FileText, 
  Gamepad2, 
  ShieldAlert, 
  Bot,
  ChevronRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onRestartPC: () => void;
  onShutdownPC?: () => void;
  onLockPC?: () => void;
  deletedApps?: AppId[];
}

export const StartMenu: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenApp,
  onRestartPC,
  onShutdownPC,
  onLockPC,
  deletedApps = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'pinned' | 'all'>('pinned');

  if (!isOpen) return null;

  const allApps: { id: AppId; name: string; iconClass: string; colorClass: string; desc: string; letter: string }[] = [
    { id: 'avci', name: 'Avcı AI Asistanı', iconClass: 'fa-solid fa-robot', colorClass: 'text-cyan-400', desc: 'Windows Sistem Asistanı', letter: 'A' },
    { id: 'settings', name: 'Ayarlar', iconClass: 'fa-solid fa-gear', colorClass: 'text-slate-300', desc: 'Sistem Yapılandırması', letter: 'A' },
    { id: 'user', name: 'Dosya Gezgini (apo)', iconClass: 'fa-solid fa-folder', colorClass: 'text-yellow-400', desc: 'C:\\Users\\apo', letter: 'D' },
    { id: 'recycle_bin', name: 'Geri Dönüşüm Kutusu', iconClass: 'fa-solid fa-trash-can', colorClass: 'text-cyan-400', desc: 'Silinen Öğeler & Çöp Kovası', letter: 'G' },
    { id: 'taskmgr', name: 'Görev Yöneticisi', iconClass: 'fa-solid fa-chart-line', colorClass: 'text-purple-400', desc: 'Performans & İşlemler', letter: 'G' },
    { id: 'calculator', name: 'Hesap Makinesi', iconClass: 'fa-solid fa-calculator', colorClass: 'text-blue-400', desc: 'Standart Hesaplama', letter: 'H' },
    { id: 'camera', name: 'Kamera', iconClass: 'fa-solid fa-camera', colorClass: 'text-blue-500', desc: 'Gerçek Web Kamerası', letter: 'K' },
    { id: 'cmd', name: 'Komut İstemi (CMD)', iconClass: 'fa-solid fa-terminal', colorClass: 'text-emerald-400', desc: 'Windows Terminal', letter: 'K' },
    { id: 'edge', name: 'Microsoft Edge', iconClass: 'fa-brands fa-edge', colorClass: 'text-blue-400', desc: 'İnternet Tarayıcısı', letter: 'M' },
    { id: 'memz', name: 'MEMZ_Payload.exe', iconClass: 'fa-solid fa-triangle-exclamation', colorClass: 'text-yellow-400', desc: 'Trojan Simülatörü', letter: 'M' },
    { id: 'notepad', name: 'Not Defteri', iconClass: 'fa-solid fa-file-lines', colorClass: 'text-sky-300', desc: 'Metin Düzenleyici', letter: 'N' },
    { id: 'paint', name: 'Paint', iconClass: 'fa-solid fa-paint-brush', colorClass: 'text-pink-400', desc: 'Çizim ve Grafik', letter: 'P' },
    { id: 'retro_games', name: 'Retro Games', iconClass: 'fa-solid fa-gamepad', colorClass: 'text-green-500', desc: 'Snake & Arcade', letter: 'R' },
    { id: 'my_computer', name: 'Bu Bilgisayar', iconClass: 'fa-solid fa-computer', colorClass: 'text-blue-500', desc: 'Sistem Sürücüleri ve Dosyalar', letter: 'B' },
    { id: 'minesweeper', name: 'Mayın Tarlası', iconClass: 'fa-solid fa-bomb', colorClass: 'text-slate-800', desc: 'Klasik Mayın Oyunu', letter: 'M' },
    { id: 'minecraft', name: 'Minecraft 2D', iconClass: 'fa-solid fa-cubes', colorClass: 'text-green-600', desc: 'Sandbox Oyunu', letter: 'M' },
    { id: 'undertale', name: 'Undertale', iconClass: 'fa-solid fa-heart', colorClass: 'text-red-500', desc: 'Web Fan Edition', letter: 'U' }
  ];

  const availableApps = allApps.filter(app => !deletedApps.includes(app.id));

  const filteredApps = availableApps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recommendedItems = [
    { name: 'apo_notlari.txt', time: '10 dk önce', icon: <FileText className="w-4 h-4 text-amber-400" />, appId: 'notepad' as AppId },
    { name: 'undertale_save.dat', time: 'Bugün 08:45', icon: <Gamepad2 className="w-4 h-4 text-rose-400" />, appId: 'undertale' as AppId },
    { name: 'MEMZ_Payload.exe', time: 'Dün 22:15', icon: <ShieldAlert className="w-4 h-4 text-yellow-400" />, appId: 'memz' as AppId },
    { name: 'Avcı AI Günlüğü', time: 'Bugün', icon: <Bot className="w-4 h-4 text-cyan-400" />, appId: 'avci' as AppId }
  ];

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-84 sm:w-[560px] bg-slate-900/85 dark:bg-slate-950/90 backdrop-blur-2xl border border-white/15 dark:border-white/10 rounded-2xl p-5 text-white z-50 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 select-none font-sans"
    >
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Tüm uygulamalarda, dosyalarda veya web'de ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value) setViewMode('all');
          }}
          autoFocus
          className="w-full bg-slate-800/90 dark:bg-slate-800/60 border border-white/10 dark:border-white/5 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-400 outline-none focus:border-blue-400 transition"
        />
      </div>

      {/* Main View: Pinned vs All Apps */}
      {viewMode === 'pinned' && !searchTerm ? (
        <>
          {/* Pinned Section Header */}
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-xs font-semibold text-slate-200">Sabitlenenler</span>
            <button
              onClick={() => setViewMode('all')}
              className="text-[11px] bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-md text-slate-200 transition flex items-center gap-1 border border-white/5"
            >
              <span>Tüm uygulamalar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Pinned Icons Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center mb-5">
            {allApps.slice(0, 12).map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  onOpenApp(app.id);
                  onClose();
                }}
                className="p-2.5 hover:bg-white/10 rounded-xl cursor-pointer transition-all flex flex-col items-center group active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <i className={`${app.iconClass} ${app.colorClass} text-xl`}></i>
                </div>
                <div className="text-[11px] font-medium text-slate-200 truncate w-full">
                  {app.name}
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Section */}
          <div className="mb-4 pt-3 border-t border-white/10">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-semibold text-slate-200">Önerilenler</span>
              <span className="text-[10px] text-slate-400 hover:text-white cursor-pointer">Daha Fazla ›</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recommendedItems.map((rec, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onOpenApp(rec.appId);
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition border border-transparent hover:border-white/5"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-white/5">
                    {rec.icon}
                  </div>
                  <div className="overflow-hidden text-left">
                    <div className="text-[11px] font-medium text-slate-200 truncate">{rec.name}</div>
                    <div className="text-[9px] text-slate-400">{rec.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* All Apps A-Z List */
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-slate-200">Tüm Uygulamalar</span>
            <button
              onClick={() => {
                setViewMode('pinned');
                setSearchTerm('');
              }}
              className="text-[11px] bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-md text-slate-200 transition border border-white/5"
            >
              ‹ Geri
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto pr-1 space-y-1">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  onOpenApp(app.id);
                  onClose();
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0">
                  <i className={`${app.iconClass} ${app.colorClass} text-base`}></i>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate">{app.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{app.desc}</div>
                </div>
              </div>
            ))}

            {filteredApps.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                "{searchTerm}" ile eşleşen uygulama bulunamadı.
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Card (apo) Footer */}
      <div className="pt-3 border-t border-white/10 flex justify-between items-center px-1 relative">
        <div 
          onClick={() => {
            onOpenApp('user');
            onClose();
          }}
          className="flex items-center space-x-3 p-1 rounded-xl hover:bg-white/10 cursor-pointer transition"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm border border-white/20 shadow-xs">
            A
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white">apo</div>
            <div className="text-[10px] text-slate-400">Yönetici / Administrator</div>
          </div>
        </div>

        {/* Power Button & Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowPowerMenu(!showPowerMenu)}
            className="p-2 hover:bg-white/15 rounded-full text-slate-300 hover:text-white transition"
            title="Açma/Kapatma"
          >
            <Power className="w-4 h-4" />
          </button>

          {showPowerMenu && (
            <div className="absolute right-0 bottom-10 w-48 bg-slate-800/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-1.5 text-xs text-slate-200 z-50 space-y-1">
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  if (onLockPC) onLockPC();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 rounded-lg text-left transition"
              >
                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Kilitle</span>
              </button>
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  onRestartPC();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 rounded-lg text-left transition"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Yeniden Başlat</span>
              </button>
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  if (onShutdownPC) {
                    onShutdownPC();
                  } else {
                    onRestartPC();
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-500/20 text-red-300 rounded-lg text-left transition"
              >
                <Power className="w-3.5 h-3.5 text-red-400" />
                <span>Kapat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
