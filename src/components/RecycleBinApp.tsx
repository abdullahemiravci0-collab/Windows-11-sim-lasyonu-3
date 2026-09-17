import React, { useState } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  Search, 
  HardDrive, 
  FileText, 
  FileCode, 
  Image as ImageIcon, 
  File, 
  Check, 
  Info,
  Sparkles,
  ArrowUp,
  RefreshCw
} from 'lucide-react';
import { TrashItem } from '../types';
import { sound } from '../utils/audio';

interface Props {
  items: TrashItem[];
  onEmptyTrash: () => void;
  onRestoreItem?: (id: string) => void;
  onRestoreAll?: () => void;
}

export const RecycleBinApp: React.FC<Props> = ({
  items,
  onEmptyTrash,
  onRestoreItem,
  onRestoreAll
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.originalLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmpty = () => {
    sound.playTrashEmpty();
    onEmptyTrash();
    setShowConfirmModal(false);
    setSelectedId(null);
  };

  const handleRestoreSelected = () => {
    if (!selectedId) return;
    sound.playClick();
    onRestoreItem?.(selectedId);
    setSelectedId(null);
  };

  const handleRestoreAll = () => {
    sound.playClick();
    onRestoreAll?.();
    setSelectedId(null);
  };

  const getFileIcon = (type: string, iconClass: string) => {
    if (type.includes('Metin') || type.includes('txt')) {
      return <FileText className="w-4 h-4 text-sky-400 shrink-0" />;
    }
    if (type.includes('Resim') || type.includes('png') || type.includes('jpg')) {
      return <ImageIcon className="w-4 h-4 text-pink-400 shrink-0" />;
    }
    if (type.includes('Kod') || type.includes('bat') || type.includes('js')) {
      return <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    return <File className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/95 text-slate-200 select-none font-sans text-xs">
      {/* Windows 11 Command Bar / Ribbon Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-white/10 bg-slate-800/60 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => items.length > 0 && setShowConfirmModal(true)}
            disabled={items.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              items.length > 0
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 active:scale-95 cursor-pointer'
                : 'opacity-40 text-slate-400 cursor-not-allowed'
            }`}
            title="Geri Dönüşüm Kutusundaki tüm öğeleri kalıcı olarak sil"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Geri Dönüşüm Kutusunu Boşalt</span>
          </button>

          <button
            onClick={handleRestoreAll}
            disabled={items.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              items.length > 0
                ? 'hover:bg-white/10 text-slate-200 active:scale-95 cursor-pointer'
                : 'opacity-40 text-slate-400 cursor-not-allowed'
            }`}
            title="Tüm öğeleri eski konumlarına geri yükle"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>Tüm Öğeleri Geri Yükle</span>
          </button>

          {selectedId && (
            <button
              onClick={handleRestoreSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 transition active:scale-95 cursor-pointer"
              title="Seçili öğeyi geri yükle"
            >
              <Check className="w-3.5 h-3.5 text-blue-300" />
              <span>Seçiliyi Geri Yükle</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-48 sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Geri Dönüşüm Kutusu içinde ara..."
            className="w-full bg-slate-950/60 border border-white/10 rounded-md py-1 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Path Breadcrumb Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 bg-slate-950/40 text-[11px] text-slate-400">
        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
        <span>Bu Bilgisayar</span>
        <span>&gt;</span>
        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
          <Trash2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Geri Dönüşüm Kutusu</span>
        </div>
        <div className="ml-auto text-[10px] text-slate-400">
          {items.length > 0 ? `${items.length} öğe mevcut` : 'Boş'}
        </div>
      </div>

      {/* File List / Table Content */}
      <div className="flex-1 overflow-auto p-2">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center mb-4 text-slate-500">
              <Trash2 className="w-10 h-10 stroke-[1.2]" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">
              Bu klasör boş
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs text-center">
              Geri dönüşüm kutusunda şu anda silinmiş herhangi bir dosya veya kısayol bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-white/10 select-none">
              <div className="col-span-4 flex items-center gap-1">Ad</div>
              <div className="col-span-3">Özgün Konum</div>
              <div className="col-span-3">Silinme Tarihi</div>
              <div className="col-span-2 text-right">Boyut</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/5 mt-1">
              {filteredItems.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedId(item.id);
                    }}
                    onDoubleClick={() => {
                      // Double clicking item prompts restore
                      handleRestoreSelected();
                    }}
                    className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-600/30 text-white ring-1 ring-blue-500/50'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="col-span-4 flex items-center gap-2.5 truncate pr-2">
                      {getFileIcon(item.type, item.iconClass)}
                      <span className="truncate font-medium">{item.name}</span>
                    </div>
                    <div className="col-span-3 truncate text-slate-400 pr-2">
                      {item.originalLocation}
                    </div>
                    <div className="col-span-3 truncate text-slate-400">
                      {item.deletedAt}
                    </div>
                    <div className="col-span-2 text-right font-mono text-[11px] text-slate-400">
                      {item.size}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-white/10 bg-slate-950/60 text-[11px] text-slate-400">
        <div>
          {items.length} öğe {selectedId ? '(1 öğe seçildi)' : ''}
        </div>
        <div className="flex items-center gap-3">
          <span>Yönetici: apo</span>
          <span>Windows 11 Enterprise</span>
        </div>
      </div>

      {/* Empty Trash Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-white/20 rounded-xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Geri Dönüşüm Kutusunu Boşalt
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bu {items.length} öğeyi kalıcı olarak silmek istediğinizden emin misiniz?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleEmpty}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium shadow-md transition active:scale-95 cursor-pointer"
              >
                Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
