import React, { useState } from 'react';
import { 
  Folder, 
  Monitor, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Gamepad2, 
  ChevronRight, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw,
  FileCode,
  HardDrive
} from 'lucide-react';

interface Props {
  onOpenFile?: (fileName: string, content: string) => void;
}

type FolderKey = 'desktop' | 'downloads' | 'documents' | 'pictures' | 'games';

interface MockFile {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'txt' | 'img' | 'game' | 'code' | 'log';
  content: string;
}

const folderContents: Record<FolderKey, { title: string; files: MockFile[] }> = {
  desktop: {
    title: 'Masaüstü',
    files: [
      { id: '1', name: 'apo_notlari.txt', size: '1.2 KB', date: 'Bugün 10:14', type: 'txt', content: 'Kullanıcı: apo\nYönetici hakları tanımlandı.\n\nNot: MEMZ_Payload.exe dosyasına dikkat et! Yanlışlıkla çalıştırırsan Avcı AI üzerinden sistem onarımı gerekebilir.' },
      { id: '2', name: 'Undertale_Kısayol.lnk', size: '1 KB', date: '01.01.2026', type: 'game', content: 'Hedef: Undertale Web Fan Edition\nSans ile karşılaşmaya hazır mısın apo?' },
      { id: '3', name: 'Sistem_Raporu.log', size: '4.8 KB', date: 'Dün 23:45', type: 'log', content: '[OK] Windows 11 Enterprise (apo) çekirdek kararlı.\n[OK] RAM 16 GB DDR5 kullanılabilir.\n[INFO] Avcı AI arka plan hizmeti çalışıyor.' }
    ]
  },
  downloads: {
    title: 'İndirilenler',
    files: [
      { id: '4', name: 'MEMZ_Payload.exe', size: '348 KB', date: 'Bugün 09:20', type: 'code', content: 'UYARI: Bu dosya bir simülasyondur. Masaüstünden çift tıklayarak çalıştırabilirsiniz.' },
      { id: '5', name: 'undertale_soundtrack.mp3', size: '8.4 MB', date: 'Dün 15:30', type: 'log', content: 'Undertale OST - Megalovania & Hopes and Dreams.' },
      { id: '6', name: 'win11_apo_theme.pack', size: '12 MB', date: '28.12.2025', type: 'log', content: 'Windows 11 Enterprise tema paketi apo özel sürüm.' }
    ]
  },
  documents: {
    title: 'Belgeler',
    files: [
      { id: '7', name: 'Proje_Plani_2026.txt', size: '2.4 KB', date: 'Bugün 11:00', type: 'txt', content: 'apo 2026 Teknoloji Hedefleri:\n1. Windows 11 Enterprise ortamını geliştirmek\n2. Avcı AI ile entegre sistem optimizasyonu\n3. Undertale tüm sonları tamamlamak\n4. Siber güvenlik laboratuvarında MEMZ analizleri yapmak.' },
      { id: '8', name: 'guvenlik_anahtarlari.txt', size: '512 B', date: '15.11.2025', type: 'txt', content: 'APO-ENTERPRISE-LIC-2026-KEY-9941\nDurum: Etkinleştirildi (Yönetici: apo)' }
    ]
  },
  pictures: {
    title: 'Resimler',
    files: [
      { id: '9', name: 'apo_wallpaper_bloom.png', size: '2.8 MB', date: 'Geçen hafta', type: 'img', content: 'Windows 11 Bloom Arka Planı' },
      { id: '10', name: 'undertale_sans.png', size: '420 KB', date: 'Geçen hafta', type: 'img', content: 'Sans pixel art portresi' }
    ]
  },
  games: {
    title: 'Kaydedilen Oyunlar',
    files: [
      { id: '11', name: 'undertale_save.dat', size: '3.1 KB', date: 'Bugün 08:45', type: 'game', content: '[Undertale Save Data]\nOyuncu: apo\nLV: 1\nHP: 20/20\nOda: The Barrier\nDurum: DETERMINATION' },
      { id: '12', name: 'pacman_highscore.dat', size: '128 B', date: 'Dün', type: 'game', content: 'Yüksek Skor: 99,420 (apo)' }
    ]
  }
};

export const UserFolderApp: React.FC<Props> = ({ onOpenFile }) => {
  const [activeFolder, setActiveFolder] = useState<FolderKey>('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<MockFile | null>(null);

  const current = folderContents[activeFolder];
  const displayedFiles = current.files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (file: MockFile) => {
    setSelectedFile(file);
    if (file.type === 'txt' && onOpenFile) {
      onOpenFile(file.name, file.content);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fbfbfb] text-slate-800 select-none text-xs">
      {/* Explorer Top Toolbar */}
      <div className="px-3 py-2 border-b border-slate-200 bg-white/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-slate-500">
          <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-40" title="Geri">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-40" title="İleri">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-slate-100 rounded" title="Yenile">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Breadcrumb Path */}
        <div className="flex-1 flex items-center bg-slate-100/90 border border-slate-200 rounded px-2 py-1 text-slate-700">
          <HardDrive className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
          <span className="font-semibold text-slate-600">Bu Bilgisayar</span>
          <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
          <span>Yerel Disk (C:)</span>
          <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
          <span className="text-blue-600 font-medium">Kullanıcılar</span>
          <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
          <span className="font-semibold text-slate-900">apo</span>
          <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
          <span className="text-slate-800 font-semibold">{current.title}</span>
        </div>

        {/* Search Input */}
        <div className="relative w-40 sm:w-52">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder={`${current.title} içinde ara...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded pl-7 pr-2 py-1 outline-none focus:border-blue-500 text-xs"
          />
        </div>
      </div>

      {/* Main Layout: Sidebar & Files Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-44 border-r border-slate-200 bg-slate-50/70 p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hızlı Erişim</div>
          
          <button 
            onClick={() => setActiveFolder('desktop')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
              activeFolder === 'desktop' ? 'bg-blue-100/70 text-blue-800 font-semibold' : 'hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-500" />
            <span>Masaüstü</span>
          </button>

          <button 
            onClick={() => setActiveFolder('downloads')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
              activeFolder === 'downloads' ? 'bg-blue-100/70 text-blue-800 font-semibold' : 'hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>İndirilenler</span>
          </button>

          <button 
            onClick={() => setActiveFolder('documents')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
              activeFolder === 'documents' ? 'bg-blue-100/70 text-blue-800 font-semibold' : 'hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Belgeler</span>
          </button>

          <button 
            onClick={() => setActiveFolder('pictures')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
              activeFolder === 'pictures' ? 'bg-blue-100/70 text-blue-800 font-semibold' : 'hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-purple-500" />
            <span>Resimler</span>
          </button>

          <button 
            onClick={() => setActiveFolder('games')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
              activeFolder === 'games' ? 'bg-blue-100/70 text-blue-800 font-semibold' : 'hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-rose-500" />
            <span>Kaydedilen Oyunlar</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-white flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 content-start">
            {displayedFiles.map(file => (
              <div 
                key={file.id}
                onClick={() => handleFileClick(file)}
                className={`p-3 rounded-lg border flex flex-col items-center text-center cursor-pointer transition-all ${
                  selectedFile?.id === file.id 
                    ? 'border-blue-400 bg-blue-50/80 shadow-xs' 
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                {file.type === 'txt' && <FileText className="w-10 h-10 text-amber-500 mb-1.5" />}
                {file.type === 'img' && <ImageIcon className="w-10 h-10 text-purple-500 mb-1.5" />}
                {file.type === 'game' && <Gamepad2 className="w-10 h-10 text-red-500 mb-1.5" />}
                {file.type === 'code' && <FileCode className="w-10 h-10 text-emerald-500 mb-1.5" />}
                {file.type === 'log' && <Folder className="w-10 h-10 text-blue-400 mb-1.5" />}
                
                <span className="font-medium text-slate-800 line-clamp-2 break-all text-[11px]">{file.name}</span>
                <span className="text-[10px] text-slate-400 mt-1">{file.size}</span>
              </div>
            ))}

            {displayedFiles.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400">
                Bu klasörde eşleşen öğe bulunamadı.
              </div>
            )}
          </div>

          {/* Bottom File Preview Bar if selected */}
          {selectedFile && (
            <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-700">{selectedFile.name}</span>
                <span className="text-slate-400 ml-2">({selectedFile.size} • {selectedFile.date})</span>
              </div>
              <div className="text-blue-600 font-medium">
                {selectedFile.type === 'txt' ? 'Çift tıklayarak Not Defteri ile açabilirsiniz' : 'Önizleme hazır'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
        <span>{displayedFiles.length} öğe</span>
        <span>apo (Yönetici) • NTFS</span>
      </div>
    </div>
  );
};
