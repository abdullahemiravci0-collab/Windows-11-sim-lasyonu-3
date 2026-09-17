import React, { useState } from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Moon, 
  Plane, 
  Volume2, 
  VolumeX, 
  Sun, 
  Battery, 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: string;
  onChangeWallpaper: (url: string) => void;
}

export const QuickSettingsPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  currentWallpaper,
  onChangeWallpaper
}) => {
  const [wifiActive, setWifiActive] = useState(true);
  const [btActive, setBtActive] = useState(true);
  const [nightLight, setNightLight] = useState(false);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(90);

  if (!isOpen) return null;

  const wallpapers = [
    { name: 'Windows 11 Bloom Dark', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920' },
    { name: 'Windows 11 Bloom Light', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&invert=1' },
    { name: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920' },
    { name: 'Minimalist Dağlar', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920' }
  ];

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-14 right-3 w-80 sm:w-96 bg-slate-900/85 dark:bg-slate-950/90 backdrop-blur-2xl border border-white/15 dark:border-slate-800/80 rounded-2xl p-4 text-white z-50 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 select-none text-xs"
    >
      {/* Quick Toggles Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => setWifiActive(!wifiActive)}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition ${
            wifiActive ? 'bg-blue-600 text-white' : 'bg-slate-800 dark:bg-slate-800/50 text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span className="text-[11px] font-medium">Wi-Fi</span>
        </button>

        <button
          onClick={() => setBtActive(!btActive)}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition ${
            btActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          <span className="text-[11px] font-medium">Bluetooth</span>
        </button>

        <button
          onClick={() => setNightLight(!nightLight)}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition ${
            nightLight ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span className="text-[11px] font-medium">Gece Işığı</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3 bg-slate-800/60 p-3 rounded-xl border border-white/5 mb-4">
        {/* Brightness */}
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-[10px] text-slate-400 w-6 text-right">%{brightness}</span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              sound.setMuted(val === 0);
            }}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-[10px] text-slate-400 w-6 text-right">%{volume}</span>
        </div>
      </div>

      {/* Wallpaper Switcher */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2 text-slate-300 font-semibold text-[11px]">
          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>Masaüstü Duvar Kağıdı</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {wallpapers.map((wp, i) => (
            <button
              key={i}
              onClick={() => onChangeWallpaper(wp.url)}
              className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition overflow-hidden ${
                currentWallpaper === wp.url
                  ? 'border-blue-400 bg-blue-600/30'
                  : 'border-white/10 bg-slate-800/80 hover:border-white/25'
              }`}
            >
              <div 
                className="w-7 h-5 rounded bg-cover bg-center shrink-0 border border-white/20"
                style={{ backgroundImage: `url('${wp.url}')` }}
              />
              <span className="text-[10px] text-slate-200 truncate flex-1">{wp.name}</span>
              {currentWallpaper === wp.url && <Check className="w-3 h-3 text-blue-400 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Toast item */}
      <div className="p-2.5 bg-slate-800/80 border border-white/10 rounded-xl flex items-start gap-2.5">
        <div className="p-1.5 bg-cyan-600/20 text-cyan-400 rounded-lg shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-200">Avcı AI Güvenlik Koruyucusu</div>
          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
            Windows 11 Enterprise (apo-PC) sisteminiz güncel ve güvenli.
          </div>
        </div>
      </div>
    </div>
  );
};
