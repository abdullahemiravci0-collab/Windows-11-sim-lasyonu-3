import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { WindowState } from '../types';

interface Props {
  windowState: WindowState;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximizeToggle: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onSnap?: (x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<Props> = ({
  windowState,
  onFocus,
  onClose,
  onMinimize,
  onMaximizeToggle,
  onUpdatePosition,
  onSnap,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSnapFlyout, setShowSnapFlyout] = useState(false);
  const snapTimeoutRef = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    };
    onFocus();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (windowState.isMaximized || e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - windowState.x,
      y: touch.clientY - windowState.y
    };
    onFocus();
  };

  const handleSnapSelect = (type: 'left' | 'right' | 'left-wide' | 'right-narrow' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    setShowSnapFlyout(false);
    if (!onSnap) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight - 48; // minus taskbar

    switch (type) {
      case 'left':
        onSnap(0, 0, Math.floor(screenW / 2), screenH);
        break;
      case 'right':
        onSnap(Math.floor(screenW / 2), 0, Math.floor(screenW / 2), screenH);
        break;
      case 'left-wide':
        onSnap(0, 0, Math.floor(screenW * 0.65), screenH);
        break;
      case 'right-narrow':
        onSnap(Math.floor(screenW * 0.65), 0, Math.floor(screenW * 0.35), screenH);
        break;
      case 'top-left':
        onSnap(0, 0, Math.floor(screenW / 2), Math.floor(screenH / 2));
        break;
      case 'top-right':
        onSnap(Math.floor(screenW / 2), 0, Math.floor(screenW / 2), Math.floor(screenH / 2));
        break;
      case 'bottom-left':
        onSnap(0, Math.floor(screenH / 2), Math.floor(screenW / 2), Math.floor(screenH / 2));
        break;
      case 'bottom-right':
        onSnap(Math.floor(screenW / 2), Math.floor(screenH / 2), Math.floor(screenW / 2), Math.floor(screenH / 2));
        break;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 180, e.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.current.y));
      onUpdatePosition(newX, newY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - 180, touch.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, touch.clientY - dragOffset.current.y));
      onUpdatePosition(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, onUpdatePosition]);

  if (windowState.isMinimized) return null;

  const style: React.CSSProperties = windowState.isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)',
        zIndex: windowState.zIndex,
        borderRadius: 0
      }
    : {
        left: `${windowState.x}px`,
        top: `${windowState.y}px`,
        width: `${windowState.width}px`,
        height: `${windowState.height}px`,
        maxWidth: '96vw',
        maxHeight: 'calc(100vh - 56px)',
        zIndex: windowState.zIndex
      };

  return (
    <div
      onMouseDown={onFocus}
      style={style}
      className={`absolute flex flex-col mica-effect rounded-lg shadow-2xl border border-white/40 dark:border-slate-700/60 overflow-hidden transition-all duration-100 ${
        windowState.isMaximized ? 'rounded-none' : ''
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="h-9 px-3 bg-white/75 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between select-none cursor-move"
      >
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          {windowState.icon.startsWith('fa-') ? (
            <i className={`${windowState.icon} text-sm shrink-0`}></i>
          ) : (
            <span className="text-sm shrink-0">{windowState.icon}</span>
          )}
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {windowState.title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-8 h-7 flex items-center justify-center hover:bg-slate-200/80 text-slate-600 rounded-xs transition-colors"
            title="Simge Durumuna Küçült"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          {/* Maximize / Snap Button with Flyout */}
          <div 
            className="relative"
            onMouseEnter={() => {
              if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
              setShowSnapFlyout(true);
            }}
            onMouseLeave={() => {
              snapTimeoutRef.current = window.setTimeout(() => {
                setShowSnapFlyout(false);
              }, 400);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximizeToggle();
              }}
              className="w-8 h-7 flex items-center justify-center hover:bg-slate-200/80 text-slate-600 rounded-xs transition-colors"
              title={windowState.isMaximized ? 'Önceki Boyut' : 'Ekranı Kapla (Snap Layouts için üzerine gelin)'}
            >
              {windowState.isMaximized ? (
                <Copy className="w-3 h-3 rotate-180" />
              ) : (
                <Square className="w-3 h-3" />
              )}
            </button>

            {/* Windows 11 Snap Layouts Flyout */}
            {showSnapFlyout && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-8 right-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="text-[10px] font-semibold text-slate-300 mb-2">Hizalama Düzenleri (Snap)</div>
                <div className="grid grid-cols-2 gap-2">
                  {/* Layout 1: 50 / 50 */}
                  <div className="h-14 border border-white/20 rounded-lg p-1 flex gap-1 bg-slate-800/60 hover:border-blue-400 transition">
                    <button 
                      onClick={() => handleSnapSelect('left')}
                      className="w-1/2 h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                      title="Sol Yarı"
                    >
                      Sol
                    </button>
                    <button 
                      onClick={() => handleSnapSelect('right')}
                      className="w-1/2 h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                      title="Sağ Yarı"
                    >
                      Sağ
                    </button>
                  </div>

                  {/* Layout 2: 65 / 35 */}
                  <div className="h-14 border border-white/20 rounded-lg p-1 flex gap-1 bg-slate-800/60 hover:border-blue-400 transition">
                    <button 
                      onClick={() => handleSnapSelect('left-wide')}
                      className="w-[65%] h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                      title="Sol Geniş"
                    >
                      2/3
                    </button>
                    <button 
                      onClick={() => handleSnapSelect('right-narrow')}
                      className="w-[35%] h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                      title="Sağ Dar"
                    >
                      1/3
                    </button>
                  </div>

                  {/* Layout 3: 4 Quadrants */}
                  <div className="col-span-2 h-16 border border-white/20 rounded-lg p-1 grid grid-cols-2 gap-1 bg-slate-800/60 hover:border-blue-400 transition">
                    <button 
                      onClick={() => handleSnapSelect('top-left')}
                      className="h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                    >
                      Üst Sol
                    </button>
                    <button 
                      onClick={() => handleSnapSelect('top-right')}
                      className="h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                    >
                      Üst Sağ
                    </button>
                    <button 
                      onClick={() => handleSnapSelect('bottom-left')}
                      className="h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                    >
                      Alt Sol
                    </button>
                    <button 
                      onClick={() => handleSnapSelect('bottom-right')}
                      className="h-full bg-slate-700/80 hover:bg-blue-600 rounded text-[9px] text-white flex items-center justify-center transition"
                    >
                      Alt Sağ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-7 flex items-center justify-center hover:bg-red-600 hover:text-white text-slate-600 rounded-xs transition-colors"
            title="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-white/95">
        {children}
      </div>
    </div>
  );
};
