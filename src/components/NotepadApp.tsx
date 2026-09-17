import React, { useState } from 'react';
import { FileDown, FilePlus, Copy, Trash2, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  initialTitle?: string;
  initialContent?: string;
}

export const NotepadApp: React.FC<Props> = ({ 
  initialTitle = 'apo_notlari.txt',
  initialContent = `Kullanıcı: apo (Yönetici / Administrator)
Sistem: Windows 11 Enterprise
Tarih: 01.01.2026

Önemli Notlar:
1. Masaüstündeki MEMZ_Payload.exe dosyası simülasyon amaçlıdır.
2. Avcı AI ile sistem durumu kontrol edilebilir.
3. Undertale Web Fan Edition üzerinde Sans ile karşılaşılabilir.
4. Paint ile çizim yapılıp bilgisayara kaydedilebilir.
`
}) => {
  const [content, setContent] = useState(initialContent);
  const [fileName, setFileName] = useState(initialTitle);
  const [fontSize, setFontSize] = useState(13);
  const [wordWrap, setWordWrap] = useState(true);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content.split('\n').length;

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleNew = () => {
    setContent('');
    setFileName('Adsız.txt');
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] text-slate-800 select-none text-xs font-sans">
      {/* Menu Bar */}
      <div className="px-2 py-1 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-slate-700">
        <div className="flex items-center gap-1">
          <button 
            onClick={handleNew}
            className="px-2 py-1 hover:bg-slate-200 rounded flex items-center gap-1 transition" 
            title="Yeni Belge"
          >
            <FilePlus className="w-3.5 h-3.5" /> Yeni
          </button>
          <button 
            onClick={handleDownload}
            className="px-2 py-1 hover:bg-slate-200 rounded flex items-center gap-1 transition text-blue-600 font-medium" 
            title="İndir (.txt)"
          >
            <FileDown className="w-3.5 h-3.5" /> Kaydet (İndir)
          </button>
          <button 
            onClick={() => setContent('')}
            className="px-2 py-1 hover:bg-slate-200 rounded flex items-center gap-1 transition text-red-500" 
            title="Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" /> Temizle
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <button 
            onClick={() => setFontSize(f => Math.max(10, f - 1))}
            className="p-1 hover:bg-slate-200 rounded" 
            title="Yazıyı Küçült"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] w-6 text-center">{fontSize}px</span>
          <button 
            onClick={() => setFontSize(f => Math.min(22, f + 1))}
            className="p-1 hover:bg-slate-200 rounded" 
            title="Yazıyı Büyüt"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setWordWrap(!wordWrap)}
            className={`px-2 py-0.5 rounded text-[10px] ml-1 ${wordWrap ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}
          >
            Sözcük Kaydır
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-3 bg-white overflow-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ fontSize: `${fontSize}px` }}
          className={`w-full h-full border-none outline-none font-mono text-slate-800 resize-none bg-transparent ${
            wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
          }`}
          placeholder="Notlarınızı buraya yazabilirsiniz apo..."
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
        <div className="flex items-center gap-3">
          <span>Satır: {lineCount}</span>
          <span>Sözcük: {wordCount}</span>
          <span>Karakter: {charCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>%100</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};
