import React from 'react';
import { 
  RotateCw, 
  FileText, 
  Bot, 
  Activity, 
  Palette, 
  AlertTriangle,
  Power,
  Trash2,
  LayoutGrid
} from 'lucide-react';
import { AppId } from '../types';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onRefresh: () => void;
  onOpenWallpaperSettings: () => void;
  onShutdownPC?: () => void;
  onAutoArrangeIcons?: () => void;
  onEmptyTrash?: () => void;
  trashCount?: number;
}

export const DesktopContextMenu: React.FC<Props> = ({
  x,
  y,
  onClose,
  onOpenApp,
  onRefresh,
  onOpenWallpaperSettings,
  onShutdownPC,
  onAutoArrangeIcons,
  onEmptyTrash,
  trashCount = 0
}) => {
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 340);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ left: adjustedX, top: adjustedY }}
      className="fixed w-56 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-xl p-1.5 text-white z-[9999] shadow-2xl animate-in fade-in zoom-in-95 duration-100 text-xs select-none"
    >
      <button
        onClick={() => {
          onRefresh();
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition cursor-pointer"
      >
        <RotateCw className="w-3.5 h-3.5 text-slate-300" />
        <span>Yenile</span>
      </button>

      {onAutoArrangeIcons && (
        <button
          onClick={() => {
            onAutoArrangeIcons();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
          <span>Simgeleri Otomatik Düzenle</span>
        </button>
      )}

      <div className="h-px bg-white/10 my-1" />

      <button
        onClick={() => {
          onOpenApp('recycle_bin');
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5 text-cyan-400" />
        <span>Geri Dönüşüm Kutusu ({trashCount})</span>
      </button>

      {onEmptyTrash && trashCount > 0 && (
        <button
          onClick={() => {
            onEmptyTrash();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-red-500/20 text-red-300 text-left transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
          <span>Geri Dönüşüm Kutusunu Boşalt</span>
        </button>
      )}

      <div className="h-px bg-white/10 my-1" />

      <button
        onClick={() => {
          onOpenApp('notepad');
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5 text-amber-400" />
        <span>Yeni Metin Belgesi</span>
      </button>

      <button
        onClick={() => {
          onOpenApp('avci');
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition cursor-pointer"
      >
        <Bot className="w-3.5 h-3.5 text-cyan-400" />
        <span>Avcı AI ile Sistemi Tara</span>
      </button>

      <button
        onClick={() => {
          onOpenApp('taskmgr');
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition cursor-pointer"
      >
        <Activity className="w-3.5 h-3.5 text-purple-400" />
        <span>Görev Yöneticisi</span>
      </button>

      <div className="h-px bg-white/10 my-1" />

      <button
        onClick={() => {
          onOpenWallpaperSettings();
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left transition cursor-pointer"
      >
        <Palette className="w-3.5 h-3.5 text-blue-400" />
        <span>Kişiselleştir (Duvar Kağıdı)</span>
      </button>

      <button
        onClick={() => {
          onOpenApp('memz');
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-red-500/20 text-red-400 text-left transition cursor-pointer"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        <span>MEMZ Simülatörünü Çalıştır</span>
      </button>

      {onShutdownPC && (
        <>
          <div className="h-px bg-white/10 my-1" />
          <button
            onClick={() => {
              onClose();
              onShutdownPC();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-red-500/20 text-red-300 text-left transition cursor-pointer"
          >
            <Power className="w-3.5 h-3.5 text-red-400" />
            <span>Bilgisayarı Kapat</span>
          </button>
        </>
      )}
    </div>
  );
};
