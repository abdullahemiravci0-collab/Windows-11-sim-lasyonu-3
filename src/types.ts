export type AppId =
  | 'user'
  | 'edge'
  | 'undertale'
  | 'avci'
  | 'memz'
  | 'notepad'
  | 'paint'
  | 'cmd'
  | 'taskmgr'
  | 'settings'
  | 'calculator'
  | 'recycle_bin'
  | 'minesweeper'
  | 'camera'
  | 'retro_games'
  | 'my_computer'
  | 'memory_diagnostics'
  | 'minecraft';

export interface DesktopIconData {
  id: AppId;
  name: string;
  iconClass: string;
  colorClass: string;
  x: number;
  y: number;
  isRecycleBin?: boolean;
}

export interface TrashItem {
  id: string;
  name: string;
  originalLocation: string;
  originalAppId?: AppId;
  iconClass: string;
  colorClass: string;
  deletedAt: string;
  size: string;
  type: string;
  originalPos?: { x: number; y: number };
}

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export type MemzStage =
  | 'idle'
  | 'warning1'
  | 'warning2'
  | 'payload'
  | 'bsod'
  | 'nyan'
  | 'recovery'
  | 'recovering';

export interface PopupAlert {
  id: string;
  title: string;
  text: string;
  x: number;
  y: number;
  icon: 'error' | 'warning' | 'info';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'avci';
  text: string;
  timestamp: string;
}

export interface DesktopFile {
  id: string;
  name: string;
  extension: string;
  size: string;
  date: string;
  type: 'text' | 'image' | 'game' | 'code' | 'folder';
  content?: string;
  imageUrl?: string;
}
