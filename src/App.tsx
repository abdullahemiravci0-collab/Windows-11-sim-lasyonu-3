import React, { useState, useEffect } from 'react';
import { AppId, WindowState, MemzStage, TrashItem, DesktopIconData } from './types';
import { sound } from './utils/audio';
import { DesktopIcons } from './components/DesktopIcons';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { WindowFrame } from './components/WindowFrame';
import { UserFolderApp } from './components/UserFolderApp';
import { EdgeApp } from './components/EdgeApp';
import { UndertaleApp } from './components/UndertaleApp';
import { AvciAiApp } from './components/AvciAiApp';
import { NotepadApp } from './components/NotepadApp';
import { PaintApp } from './components/PaintApp';
import { CmdApp } from './components/CmdApp';
import { TaskManagerApp } from './components/TaskManagerApp';
import { SettingsApp } from './components/SettingsApp';
import { CalculatorApp } from './components/CalculatorApp';
import { RecycleBinApp } from './components/RecycleBinApp';
import { MinesweeperApp } from './components/MinesweeperApp';
import { CameraApp } from './components/CameraApp';
import { RetroGamesApp } from './components/RetroGamesApp';
import { MyComputerApp } from './components/MyComputerApp';
import { MemoryDiagnosticsApp } from './components/MemoryDiagnosticsApp';
import { MinecraftApp } from './components/MinecraftApp';
import { WidgetsBoard } from './components/WidgetsBoard';
import { CalendarNotificationFlyout } from './components/CalendarNotificationFlyout';
import { LockScreen } from './components/LockScreen';
import { MemzSimulation } from './components/MemzSimulation';
import { QuickSettingsPanel } from './components/QuickSettingsPanel';
import { DesktopContextMenu } from './components/DesktopContextMenu';
import { ShutdownScreen, PowerState } from './components/ShutdownScreen';

const APP_CONFIGS: Record<AppId, { title: string; icon: string; width: number; height: number }> = {
  recycle_bin: { title: 'Geri Dönüşüm Kutusu', icon: 'fa-solid fa-trash-can text-sky-400', width: 700, height: 480 },
  user: { title: 'C:\\Users\\apo', icon: 'fa-solid fa-folder text-yellow-400', width: 640, height: 460 },
  edge: { title: 'Microsoft Edge', icon: 'fa-brands fa-edge text-blue-500', width: 800, height: 520 },
  undertale: { title: 'Undertale (Web Fan Edition)', icon: 'fa-solid fa-heart text-red-500', width: 720, height: 600 },
  avci: { title: 'Avcı AI - Sistem Asistanı', icon: 'fa-solid fa-robot text-cyan-400', width: 440, height: 520 },
  memz: { title: 'MEMZ_Payload.exe', icon: 'fa-solid fa-triangle-exclamation text-yellow-400', width: 420, height: 320 },
  minesweeper: { title: 'Mayın Tarlası', icon: 'fa-solid fa-bomb text-slate-800', width: 400, height: 480 },
  notepad: { title: 'Not Defteri', icon: 'fa-solid fa-file-lines text-sky-400', width: 560, height: 420 },
  paint: { title: 'Paint', icon: 'fa-solid fa-paint-brush text-pink-400', width: 700, height: 480 },
  cmd: { title: 'Komut İstemi (Administrator: apo)', icon: 'fa-solid fa-terminal text-emerald-400', width: 600, height: 380 },
  taskmgr: { title: 'Görev Yöneticisi', icon: 'fa-solid fa-chart-line text-purple-400', width: 640, height: 440 },
  settings: { title: 'Ayarlar', icon: 'fa-solid fa-gear text-slate-300', width: 720, height: 500 },
  calculator: { title: 'Hesap Makinesi', icon: 'fa-solid fa-calculator text-blue-400', width: 340, height: 480 },
  camera: { title: 'Kamera', icon: 'fa-solid fa-camera text-blue-500', width: 640, height: 480 },
  retro_games: { title: 'Retro Games', icon: 'fa-solid fa-gamepad text-green-500', width: 640, height: 480 },
  my_computer: { title: 'Bu Bilgisayar', icon: 'fa-solid fa-computer text-blue-500', width: 720, height: 500 },
  memory_diagnostics: { title: 'Windows Bellek Tanılama', icon: 'fa-solid fa-microchip text-blue-800', width: 640, height: 480 },
  minecraft: { title: 'Minecraft 2D', icon: 'fa-solid fa-cubes text-green-600', width: 800, height: 600 }
};

export default function App() {
  const [openWindows, setOpenWindows] = useState<WindowState[]>([
    {
      id: 'avci',
      title: APP_CONFIGS.avci.title,
      icon: APP_CONFIGS.avci.icon,
      x: 70,
      y: 60,
      width: APP_CONFIGS.avci.width,
      height: APP_CONFIGS.avci.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10
    }
  ]);

  const [activeWindowId, setActiveWindowId] = useState<AppId | null>('avci');
  const [nextZIndex, setNextZIndex] = useState(15);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [wallpaper, setWallpaper] = useState<string>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920'
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Notepad custom initial file
  const [notepadInit, setNotepadInit] = useState<{ title: string; content: string } | null>(null);

  // MEMZ Simulation Stage
  const [memzStage, setMemzStage] = useState<MemzStage>('idle');

  // PC Power State: running | shutting_down | restarting | off | booting_logo | booting_welcome
  const [powerState, setPowerState] = useState<PowerState>('booting_logo');

  useEffect(() => {
    // Initial Boot Sequence
    const t1 = setTimeout(() => {
      setPowerState('booting_welcome');
      sound.playStartup();
      const t2 = setTimeout(() => {
        setPowerState('running');
        setIsLocked(false);
      }, 1800);
    }, 2300);
    return () => clearTimeout(t1);
  }, []);

  // Desktop Icon Positions (Draggable)
  const getDefaultIconPositions = (): Record<string, { x: number; y: number }> => ({
    recycle_bin: { x: 16, y: 16 },
    my_computer: { x: 16, y: 112 },
    user: { x: 16, y: 208 },
    avci: { x: 16, y: 304 },
    edge: { x: 16, y: 400 },
    notepad: { x: 16, y: 496 },
    paint: { x: 16, y: 592 },
    cmd: { x: 16, y: 688 },
    undertale: { x: 108, y: 16 },
    taskmgr: { x: 108, y: 112 },
    calculator: { x: 108, y: 208 },
    memz: { x: 108, y: 304 },
    minesweeper: { x: 108, y: 400 },
    camera: { x: 108, y: 496 },
    retro_games: { x: 108, y: 592 },
    minecraft: { x: 200, y: 16 }
  });

  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(getDefaultIconPositions);

  useEffect(() => {
    // If we add new icons during development or updates, this ensures they are placed instead of stacked at 16,16
    setIconPositions(prev => {
      let changed = false;
      const next = { ...prev };
      const defaults = getDefaultIconPositions();
      for (const [id, pos] of Object.entries(defaults)) {
        if (!next[id]) {
          next[id] = pos;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const handleUpdateIconPosition = (id: string, x: number, y: number) => {
    setIconPositions(prev => ({
      ...prev,
      [id]: { x, y }
    }));
  };

  const handleAutoArrangeIcons = () => {
    sound.playDrop();
    setIconPositions(getDefaultIconPositions());
  };

  const [deletedApps, setDeletedApps] = useState<AppId[]>([]);
  const [iconContextMenu, setIconContextMenu] = useState<{ x: number; y: number; appId: AppId } | null>(null);

  const handleDeleteApp = (id: AppId) => {
    sound.playTrash();
    setDeletedApps(prev => [...prev, id]);
    closeApp(id);
    setIconContextMenu(null);

    const config = APP_CONFIGS[id];
    setTrashItems(prev => [
      ...prev,
      {
        id: `trash-${Date.now()}`,
        name: config?.title || id,
        originalLocation: 'C:\\Users\\apo\\Desktop',
        originalAppId: id,
        iconClass: config?.icon ? config.icon.split(' ')[0] + ' ' + config.icon.split(' ')[1] : 'fa-solid fa-file',
        colorClass: config?.icon ? config.icon.split(' ')[2] : 'text-slate-400',
        deletedAt: new Date().toLocaleString('tr-TR'),
        size: 'N/A',
        type: 'Kısayol'
      }
    ]);

    if (id === 'my_computer') {
      sound.playError();
      setTimeout(() => {
        setPowerState('bsod');
      }, 300);
    }
  };

  // Recycle Bin (Geri Dönüşüm Kutusu) State & Items
  const [trashItems, setTrashItems] = useState<TrashItem[]>([
    {
      id: 'trash-1',
      name: 'eski_apo_notu.txt',
      originalLocation: 'C:\\Users\\apo\\Documents',
      iconClass: 'fa-solid fa-file-lines',
      colorClass: 'text-sky-400',
      deletedAt: 'Bugün 04:12',
      size: '2.1 KB',
      type: 'Metin Belgesi'
    },
    {
      id: 'trash-2',
      name: 'memz_test_script.bat',
      originalLocation: 'C:\\Users\\apo\\Downloads',
      iconClass: 'fa-solid fa-terminal',
      colorClass: 'text-emerald-400',
      deletedAt: 'Dün 21:30',
      size: '1.2 KB',
      type: 'Toplu İş Dosyası (BAT)'
    },
    {
      id: 'trash-3',
      name: 'silinmis_ekran_goruntusu.png',
      originalLocation: 'C:\\Users\\apo\\Pictures',
      iconClass: 'fa-solid fa-image',
      colorClass: 'text-pink-400',
      deletedAt: '09.09.2026 18:45',
      size: '1.4 MB',
      type: 'PNG Resmi'
    },
    {
      id: 'trash-4',
      name: 'undertale_gecici_kayit.dat',
      originalLocation: 'C:\\Users\\apo\\Games',
      iconClass: 'fa-solid fa-heart',
      colorClass: 'text-red-400',
      deletedAt: '08.09.2026 14:20',
      size: '4.6 KB',
      type: 'DAT Dosyası'
    }
  ]);

  const handleEmptyTrash = () => {
    setTrashItems([]);
    sound.playTrashEmpty();
  };

  const handleRestoreTrashItem = (id: string) => {
    sound.playClick();
    setTrashItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRestoreAllTrash = () => {
    sound.playClick();
    setTrashItems([]);
  };

  // Welcome sound and keyboard shortcuts
  useEffect(() => {
    const handleFirstClick = () => {
      sound.playStartup();
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Windows / Meta key opens Start Menu
      if (e.key === 'Meta' || e.key === 'OS') {
        e.preventDefault();
        setIsStartOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleFirstClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openApp = (id: AppId) => {
    sound.playFolderOpen();
    setIsStartOpen(false);
    setIsQuickSettingsOpen(false);
    setIsWidgetsOpen(false);
    setIsCalendarOpen(false);
    setContextMenu(null);

    // If it's MEMZ, trigger the interactive simulation flow!
    if (id === 'memz') {
      sound.playWarning();
      setMemzStage('warning1');
      return;
    }

    const existing = openWindows.find(w => w.id === id);
    if (existing) {
      // Un-minimize and bring to front
      setOpenWindows(prev =>
        prev.map(w =>
          w.id === id
            ? { ...w, isMinimized: false, zIndex: nextZIndex + 1 }
            : w
        )
      );
      setNextZIndex(z => z + 1);
      setActiveWindowId(id);
      return;
    }

    // Otherwise create new window with responsive bounds
    const config = APP_CONFIGS[id];
    const offset = (openWindows.length % 6) * 24;
    const safeWidth = Math.max(320, Math.min(config.width, window.innerWidth - 20));
    const safeHeight = Math.max(260, Math.min(config.height, window.innerHeight - 68));
    const safeX = Math.max(10, Math.min(Math.max(10, window.innerWidth - safeWidth - 10), 40 + offset));
    const safeY = Math.max(10, Math.min(Math.max(10, window.innerHeight - safeHeight - 58), 30 + offset));

    const newWin: WindowState = {
      id,
      title: config.title,
      icon: config.icon,
      x: safeX,
      y: safeY,
      width: safeWidth,
      height: safeHeight,
      isMinimized: false,
      isMaximized: window.innerWidth < 640,
      zIndex: nextZIndex + 1
    };

    setOpenWindows(prev => [...prev, newWin]);
    setNextZIndex(z => z + 1);
    setActiveWindowId(id);
  };

  const closeApp = (id: AppId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeApp = (id: AppId) => {
    setOpenWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximizeApp = (id: AppId) => {
    sound.playWindowMaximize();
    setOpenWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  const focusApp = (id: AppId) => {
    setActiveWindowId(id);
    setOpenWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, zIndex: nextZIndex + 1 } : w
      )
    );
    setNextZIndex(z => z + 1);
  };

  const updateWindowPos = (id: AppId, x: number, y: number) => {
    setOpenWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const handleSnap = (id: AppId, x: number, y: number, width: number, height: number) => {
    sound.playSnap();
    setOpenWindows(prev =>
      prev.map(w =>
        w.id === id
          ? {
              ...w,
              x,
              y,
              width,
              height,
              isMaximized: false,
              isMinimized: false,
              zIndex: nextZIndex + 1
            }
          : w
      )
    );
    setNextZIndex(z => z + 1);
    setActiveWindowId(id);
  };

  const handleMinimizeAll = () => {
    const allMinimized = openWindows.every(w => w.isMinimized);
    setOpenWindows(prev =>
      prev.map(w => ({ ...w, isMinimized: !allMinimized }))
    );
  };

  const handleOpenFileInNotepad = (fileName: string, content: string) => {
    setNotepadInit({ title: fileName, content });
    openApp('notepad');
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setIsStartOpen(false);
    setIsQuickSettingsOpen(false);
    setIsWidgetsOpen(false);
    setIsCalendarOpen(false);
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
    setIsStartOpen(false);
    setIsQuickSettingsOpen(false);
    setIsWidgetsOpen(false);
    setIsCalendarOpen(false);
    setContextMenu(null);
  };

  const handleKillMemz = () => {
    setMemzStage('idle');
    closeApp('memz');
    sound.playStartup();
  };

  const handleRecovered = () => {
    setMemzStage('idle');
    setOpenWindows([
      {
        id: 'avci',
        title: APP_CONFIGS.avci.title,
        icon: APP_CONFIGS.avci.icon,
        x: 80,
        y: 60,
        width: APP_CONFIGS.avci.width,
        height: APP_CONFIGS.avci.height,
        isMinimized: false,
        isMaximized: false,
        zIndex: 10
      }
    ]);
    setActiveWindowId('avci');
  };

  const handleRestartPC = () => {
    setIsStartOpen(false);
    setIsQuickSettingsOpen(false);
    setIsWidgetsOpen(false);
    setIsCalendarOpen(false);
    setContextMenu(null);
    setPowerState('restarting');
    sound.playShutdown();

    // 2.2s Orijinal Windows 11 "Yeniden başlatılıyor" ekranı
    setTimeout(() => {
      setOpenWindows([]);
      setActiveWindowId(null);
      // Windows 11 Boot Logosu (UEFI Boot)
      setPowerState('booting_logo');

      // 2.3s sonra Windows 11 "Hoş geldiniz" ekranı ve açılış melodisi
      setTimeout(() => {
        setPowerState('booting_welcome');
        sound.playStartup();

        // 1.8s sonra masaüstü açılır
        setTimeout(() => {
          setPowerState('running');
          handleRecovered();
        }, 1800);
      }, 2300);
    }, 2200);
  };

  const handleShutdownPC = () => {
    setIsStartOpen(false);
    setIsQuickSettingsOpen(false);
    setIsWidgetsOpen(false);
    setIsCalendarOpen(false);
    setContextMenu(null);
    setPowerState('shutting_down');
    sound.playShutdown();

    // 2.4 saniye orijinal Windows 11 "Kapatılıyor" ekranından sonra PC kapanır (off)
    setTimeout(() => {
      setOpenWindows([]);
      setActiveWindowId(null);
      setPowerState('off');
    }, 2400);
  };

  const handleTurnOnPC = () => {
    // 1. Aşama: Orijinal Windows 11 Boot Logosu ve Dönen Noktalar (UEFI Boot)
    setPowerState('booting_logo');

    // 2.3 saniye sonra: Windows 11 "Hoş geldiniz" ekranı ve orijinal açılış sesi
    setTimeout(() => {
      setPowerState('booting_welcome');
      sound.playStartup();

      // 1.8 saniye sonra: Masaüstü açılır
      setTimeout(() => {
        setPowerState('running');
        setIsLocked(false);
        setOpenWindows([
          {
            id: 'avci',
            title: APP_CONFIGS.avci.title,
            icon: APP_CONFIGS.avci.icon,
            x: 70,
            y: 50,
            width: APP_CONFIGS.avci.width,
            height: APP_CONFIGS.avci.height,
            isMinimized: false,
            isMaximized: false,
            zIndex: 10
          }
        ]);
        setActiveWindowId('avci');
      }, 1800);
    }, 2300);
  };

  return (
    <div
      id="desktop"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      style={{ backgroundImage: `url('${wallpaper}')` }}
      className={`relative w-screen h-screen bg-cover bg-center overflow-hidden flex flex-col justify-between font-sans select-none transition-all duration-300 ${
        memzStage === 'payload' ? 'animate-memz-glitch' : ''
      } ${isDarkMode ? 'dark' : ''}`}
    >
      {/* Desktop Main Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Desktop Icons */}
        <DesktopIcons
          onOpenApp={openApp}
          selectedIcon={selectedIcon}
          onSelectIcon={setSelectedIcon}
          iconPositions={iconPositions}
          onUpdateIconPosition={handleUpdateIconPosition}
          trashItemsCount={trashItems.length}
          deletedApps={deletedApps}
          onDeleteApp={handleDeleteApp}
        />

        {/* Windows Manager */}
        {openWindows.map((win) => (
          <WindowFrame
            key={win.id}
            windowState={win}
            onFocus={() => focusApp(win.id)}
            onClose={() => closeApp(win.id)}
            onMinimize={() => minimizeApp(win.id)}
            onMaximizeToggle={() => toggleMaximizeApp(win.id)}
            onUpdatePosition={(x, y) => updateWindowPos(win.id, x, y)}
            onSnap={(x, y, w, h) => handleSnap(win.id, x, y, w, h)}
          >
            {win.id === 'recycle_bin' && (
              <RecycleBinApp
                items={trashItems}
                onEmptyTrash={handleEmptyTrash}
                onRestoreItem={handleRestoreTrashItem}
                onRestoreAll={handleRestoreAllTrash}
              />
            )}
            {win.id === 'user' && (
              <UserFolderApp onOpenFile={handleOpenFileInNotepad} />
            )}
            {win.id === 'my_computer' && <MyComputerApp />}
            {win.id === 'edge' && <EdgeApp />}
            {win.id === 'undertale' && <UndertaleApp />}
            {win.id === 'minesweeper' && <MinesweeperApp />}
            {win.id === 'camera' && <CameraApp />}
            {win.id === 'retro_games' && <RetroGamesApp />}
            {win.id === 'memory_diagnostics' && <MemoryDiagnosticsApp />}
            {win.id === 'avci' && (
              <AvciAiApp
                onTriggerMemz={() => openApp('memz')}
                onOpenApp={openApp}
              />
            )}
            {win.id === 'notepad' && (
              <NotepadApp
                initialTitle={notepadInit?.title}
                initialContent={notepadInit?.content}
              />
            )}
            {win.id === 'paint' && <PaintApp />}
            {win.id === 'cmd' && (
              <CmdApp
                onOpenApp={openApp}
                onTriggerMemz={() => openApp('memz')}
                onShutdown={handleShutdownPC}
                onRestart={handleRestartPC}
              />
            )}
            {win.id === 'taskmgr' && (
              <TaskManagerApp
                memzStage={memzStage}
                onKillMemz={handleKillMemz}
              />
            )}
            {win.id === 'settings' && (
              <SettingsApp 
                currentWallpaper={wallpaper} 
                onChangeWallpaper={setWallpaper} 
                onOpenApp={openApp} 
                isDarkMode={isDarkMode} 
                setIsDarkMode={setIsDarkMode} 
              />
            )}
            {win.id === 'calculator' && <CalculatorApp />}
            {win.id === 'minecraft' && <MinecraftApp />}
          </WindowFrame>
        ))}

        {/* Start Menu */}
        <StartMenu
          isOpen={isStartOpen}
          onClose={() => setIsStartOpen(false)}
          onOpenApp={openApp}
          onRestartPC={handleRestartPC}
          onShutdownPC={handleShutdownPC}
          onLockPC={() => {
            setIsStartOpen(false);
            setIsLocked(true);
          }}
          deletedApps={deletedApps}
        />

        {/* Windows 11 Widgets Board */}
        <WidgetsBoard
          isOpen={isWidgetsOpen}
          onClose={() => setIsWidgetsOpen(false)}
        />

        {/* Windows 11 Calendar & Notification Flyout */}
        <CalendarNotificationFlyout
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          onOpenApp={openApp}
        />

        {/* Quick Settings Panel */}
        <QuickSettingsPanel
          isOpen={isQuickSettingsOpen}
          onClose={() => setIsQuickSettingsOpen(false)}
          currentWallpaper={wallpaper}
          onChangeWallpaper={setWallpaper}
        />

        {/* Context Menu */}
        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onOpenApp={openApp}
            onRefresh={() => sound.playWarning()}
            onOpenWallpaperSettings={() => setIsQuickSettingsOpen(true)}
            onShutdownPC={handleShutdownPC}
            onAutoArrangeIcons={handleAutoArrangeIcons}
            onEmptyTrash={handleEmptyTrash}
            trashCount={trashItems.length}
          />
        )}
      </div>

      {/* Taskbar Area */}
      <Taskbar
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        isStartOpen={isStartOpen}
        onToggleStart={() => {
          setIsStartOpen(!isStartOpen);
          setIsQuickSettingsOpen(false);
          setIsWidgetsOpen(false);
          setIsCalendarOpen(false);
          setContextMenu(null);
        }}
        onOpenApp={openApp}
        onToggleQuickSettings={() => {
          setIsQuickSettingsOpen(!isQuickSettingsOpen);
          setIsStartOpen(false);
          setIsWidgetsOpen(false);
          setIsCalendarOpen(false);
          setContextMenu(null);
        }}
        isQuickSettingsOpen={isQuickSettingsOpen}
        onToggleWidgets={() => {
          setIsWidgetsOpen(!isWidgetsOpen);
          setIsStartOpen(false);
          setIsQuickSettingsOpen(false);
          setIsCalendarOpen(false);
          setContextMenu(null);
        }}
        isWidgetsOpen={isWidgetsOpen}
        onToggleCalendar={() => {
          setIsCalendarOpen(!isCalendarOpen);
          setIsStartOpen(false);
          setIsQuickSettingsOpen(false);
          setIsWidgetsOpen(false);
          setContextMenu(null);
        }}
        isCalendarOpen={isCalendarOpen}
        onMinimizeAll={handleMinimizeAll}
      />

      {/* Windows 11 Lock Screen */}
      <LockScreen
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        wallpaperUrl={wallpaper}
      />

      {/* MEMZ Trojan Experience & Recovery Overlays */}
      <MemzSimulation
        stage={memzStage}
        onSetStage={setMemzStage}
        onRecovered={handleRecovered}
      />

      {/* Windows 11 PC Shutdown Screen & Power Management */}
      <ShutdownScreen
        powerState={powerState}
        onTurnOn={handleTurnOnPC}
        wallpaperUrl={wallpaper}
      />
    </div>
  );
}
