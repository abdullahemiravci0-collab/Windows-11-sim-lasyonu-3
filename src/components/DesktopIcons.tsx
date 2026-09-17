import React, { useState, useRef, useEffect } from 'react';
import { AppId } from '../types';
import { sound } from '../utils/audio';

export interface DesktopIconItem {
  id: AppId;
  name: string;
  iconClass: string;
  colorClass: string;
  badge?: string;
  isRecycleBin?: boolean;
}

interface Props {
  onOpenApp: (id: AppId) => void;
  selectedIcon: string | null;
  onSelectIcon: (id: string | null) => void;
  iconPositions: Record<string, { x: number; y: number }>;
  onUpdateIconPosition: (id: string, x: number, y: number) => void;
  trashItemsCount?: number;
  deletedApps?: AppId[];
  onDeleteApp?: (id: AppId) => void;
}

export const DesktopIcons: React.FC<Props> = ({
  onOpenApp,
  selectedIcon,
  onSelectIcon,
  iconPositions,
  onUpdateIconPosition,
  trashItemsCount = 3,
  deletedApps = [],
  onDeleteApp
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; appId: AppId } | null>(null);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDragged = useRef<boolean>(false);

  const allIcons: DesktopIconItem[] = [
    {
      id: 'recycle_bin',
      name: trashItemsCount > 0 ? 'Geri Dönüşüm Kutusu' : 'Geri Dönüşüm Kutusu',
      iconClass: trashItemsCount > 0 ? 'fa-solid fa-trash-can' : 'fa-regular fa-trash-can',
      colorClass: trashItemsCount > 0 ? 'text-sky-300' : 'text-slate-300',
      badge: trashItemsCount > 0 ? `${trashItemsCount}` : undefined,
      isRecycleBin: true
    },
    { id: 'my_computer', name: 'Bu Bilgisayar', iconClass: 'fa-solid fa-computer', colorClass: 'text-blue-500' },
    { id: 'user', name: 'apo', iconClass: 'fa-solid fa-user-gear', colorClass: 'text-blue-300' },
    { id: 'retro_games', name: 'Retro Games', iconClass: 'fa-solid fa-gamepad', colorClass: 'text-green-500' },
    { id: 'avci', name: 'Avcı AI', iconClass: 'fa-solid fa-robot', colorClass: 'text-cyan-400' },
    { id: 'edge', name: 'Microsoft Edge', iconClass: 'fa-brands fa-edge', colorClass: 'text-blue-400' },
    { id: 'notepad', name: 'Not Defteri', iconClass: 'fa-solid fa-file-lines', colorClass: 'text-sky-300' },
    { id: 'paint', name: 'Paint', iconClass: 'fa-solid fa-paint-brush', colorClass: 'text-pink-400' },
    { id: 'cmd', name: 'Komut İstemi', iconClass: 'fa-solid fa-terminal', colorClass: 'text-emerald-400' },
    { id: 'undertale', name: 'Undertale', iconClass: 'fa-solid fa-heart', colorClass: 'text-red-500' },
    { id: 'taskmgr', name: 'Görev Yöneticisi', iconClass: 'fa-solid fa-chart-line', colorClass: 'text-purple-400' },
    { id: 'calculator', name: 'Hesap Makinesi', iconClass: 'fa-solid fa-calculator', colorClass: 'text-indigo-400' },
    { id: 'memz', name: 'MEMZ_Payload.exe', iconClass: 'fa-solid fa-triangle-exclamation', colorClass: 'text-yellow-400' },
    { id: 'minesweeper', name: 'Mayın Tarlası', iconClass: 'fa-solid fa-bomb', colorClass: 'text-slate-800' },
    { id: 'camera', name: 'Kamera', iconClass: 'fa-solid fa-camera', colorClass: 'text-blue-500' },
    { id: 'minecraft', name: 'Minecraft 2D', iconClass: 'fa-solid fa-cubes', colorClass: 'text-green-600' }
  ];

  const icons = allIcons.filter(icon => !deletedApps.includes(icon.id));

  // Handle Dragging
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    item: DesktopIconItem
  ) => {
    // Only primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();

    onSelectIcon(item.id);

    const pos = iconPositions[item.id] || { x: 16, y: 16 };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasDragged.current = false;

    setDraggingId(item.id);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
    setCurrentPos(pos);
  };

  useEffect(() => {
    if (!draggingId) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);

      if (dx > 4 || dy > 4) {
        hasDragged.current = true;
      }

      const rawX = e.clientX - dragOffset.x;
      const rawY = e.clientY - dragOffset.y;

      // Bound within window
      const maxX = Math.max(10, window.innerWidth - 85);
      const maxY = Math.max(10, window.innerHeight - 130);

      const boundedX = Math.max(10, Math.min(rawX, maxX));
      const boundedY = Math.max(10, Math.min(rawY, maxY));

      setCurrentPos({ x: boundedX, y: boundedY });
    };

    const handlePointerUp = () => {
      if (draggingId) {
        if (hasDragged.current) {
          // Snap smoothly to grid (92px horizontal, 96px vertical)
          const gridX = Math.max(16, Math.min(Math.round((currentPos.x - 16) / 92) * 92 + 16, window.innerWidth - 85));
          const gridY = Math.max(16, Math.min(Math.round((currentPos.y - 16) / 96) * 96 + 16, window.innerHeight - 130));

          onUpdateIconPosition(draggingId, gridX, gridY);
          sound.playDrop();
        } else {
          // It was a click!
          onOpenApp(draggingId as AppId);
        }
      }
      setDraggingId(null);
      hasDragged.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingId, dragOffset, currentPos, onUpdateIconPosition, onOpenApp]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
      {icons.map((item) => {
        const isSelected = selectedIcon === item.id;
        const isDragging = draggingId === item.id;
        const pos = isDragging ? currentPos : (iconPositions[item.id] || { x: 16, y: 16 });

        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectIcon(item.id);
              if (!item.isRecycleBin) {
                setContextMenu({ x: e.clientX, y: e.clientY, appId: item.id });
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onOpenApp(item.id);
            }}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              touchAction: 'none'
            }}
            className={`absolute top-0 left-0 pointer-events-auto flex flex-col items-center justify-center p-2 rounded-lg text-center cursor-grab active:cursor-grabbing transition-all duration-75 w-[84px] group ${
              isDragging
                ? 'z-40 scale-105 opacity-90 shadow-2xl bg-white/20 ring-2 ring-blue-400'
                : isSelected
                ? 'bg-white/20 ring-1 ring-white/40 shadow-sm z-20'
                : 'hover:bg-white/10 hover:shadow-xs z-10'
            }`}
          >
            <div className="relative mb-1 pointer-events-none">
              <i
                className={`${item.iconClass} ${item.colorClass} text-3xl drop-shadow-md group-hover:scale-110 transition-transform`}
              ></i>

              {/* MEMZ Warning Pulse */}
              {item.id === 'memz' && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}

              {/* Recycle Bin Items Counter Badge */}
              {item.badge && (
                <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>

            <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-center line-clamp-2 px-1 rounded leading-tight pointer-events-none">
              {item.name}
            </span>
          </div>
        );
      })}

      {contextMenu && (
        <div
          className="fixed bg-slate-100 border border-slate-300 shadow-xl py-1 rounded w-48 z-50 pointer-events-auto text-sm"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <div
            className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-200 cursor-pointer text-slate-800"
            onClick={(e) => {
              e.stopPropagation();
              onOpenApp(contextMenu.appId);
              setContextMenu(null);
            }}
          >
            <i className="fa-solid fa-folder-open w-4 text-center"></i>
            Aç
          </div>
          <div className="border-t border-slate-300 my-1"></div>
          <div
            className="flex items-center gap-2 px-4 py-1.5 hover:bg-red-100 hover:text-red-600 cursor-pointer text-slate-800"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteApp?.(contextMenu.appId);
              setContextMenu(null);
            }}
          >
            <i className="fa-solid fa-trash-can w-4 text-center"></i>
            Sil
          </div>
        </div>
      )}
    </div>
  );
};
