import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Search, 
  Lock, 
  Star, 
  Globe, 
  ExternalLink,
  Plus,
  X
} from 'lucide-react';

export const EdgeApp: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [activeTab, setActiveTab] = useState('Google');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'iframe' | 'search_results' | 'home'>('home');

  const bookmarks = [
    { title: 'Google', url: 'https://www.google.com' },
    { title: 'Undertale Wiki', url: 'https://undertale.fandom.com' },
    { title: 'Wikipedia (TR)', url: 'https://tr.wikipedia.org' },
    { title: 'Scratch Oyunlar', url: 'https://scratch.mit.edu' },
    { title: 'GitHub', url: 'https://github.com' }
  ];

  const handleNavigate = (targetUrl?: string) => {
    const raw = targetUrl || urlInput;
    let finalUrl = raw.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        // It's a search query
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
        setActiveView('search_results');
        setUrlInput(finalUrl);
        setCurrentUrl(finalUrl);
        setSearchHistory(prev => [raw, ...prev]);
        return;
      }
    }
    setUrlInput(finalUrl);
    setCurrentUrl(finalUrl);
    setActiveView('iframe');
    setSearchHistory(prev => [finalUrl, ...prev]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] text-slate-800 select-none text-xs">
      {/* Edge Tabs Bar */}
      <div className="bg-[#e9e9e9] pt-1 px-2 flex items-end gap-1 border-b border-slate-300">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-t-lg border-t border-l border-r border-slate-300 text-xs font-medium text-slate-800 shadow-xs max-w-[200px]">
          <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">{activeTab}</span>
          <button className="hover:bg-slate-200 rounded p-0.5 ml-1">
            <X className="w-3 h-3 text-slate-400" />
          </button>
        </div>
        <button 
          onClick={() => {
            setActiveView('home');
            setActiveTab('Yeni Sekme');
            setUrlInput('https://www.google.com');
          }}
          className="p-1 hover:bg-slate-300 rounded mb-1 text-slate-600" 
          title="Yeni Sekme"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Toolbar */}
      <div className="p-1.5 bg-white border-b border-slate-200 flex items-center gap-1.5 shadow-xs">
        <button 
          onClick={() => setActiveView('home')} 
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
          title="Geri"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-40" title="İleri">
          <ArrowRight className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleNavigate()} 
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
          title="Yenile"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button 
          onClick={() => {
            setActiveView('home');
            setUrlInput('https://www.google.com');
            setActiveTab('Google');
          }} 
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
          title="Başlangıç"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* URL Bar */}
        <div className="flex-1 flex items-center bg-slate-100 border border-slate-300 hover:border-blue-400 focus-within:border-blue-500 rounded-full px-3 py-1 transition-all">
          <Lock className="w-3 h-3 text-emerald-600 mr-2 shrink-0" />
          <input 
            type="text" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bir web adresi veya arama terimi girin..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800"
          />
          <button onClick={() => handleNavigate()} className="text-slate-400 hover:text-blue-600 ml-1">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="p-1.5 hover:bg-slate-100 rounded text-amber-500" title="Sık Kullanılanlara Ekle">
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Bookmarks Bar */}
      <div className="px-3 py-1 bg-slate-50 border-b border-slate-200 flex items-center gap-4 text-[11px] text-slate-600 overflow-x-auto">
        {bookmarks.map((bm, i) => (
          <button 
            key={i}
            onClick={() => {
              setUrlInput(bm.url);
              setActiveTab(bm.title);
              handleNavigate(bm.url);
            }}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{bm.title}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
        {activeView === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-radial from-slate-50 to-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-brands fa-edge text-blue-500 text-5xl"></i>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Microsoft Edge</h1>
                <p className="text-xs text-slate-500">Windows 11 Enterprise (apo) Web Gezgini</p>
              </div>
            </div>

            <div className="w-full max-w-md flex items-center bg-white border border-slate-300 rounded-full px-4 py-2 shadow-sm focus-within:shadow-md focus-within:border-blue-500 transition-all mb-8">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Google veya Web'de arayın..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-xs outline-none bg-transparent"
              />
              <button 
                onClick={() => handleNavigate()}
                className="bg-blue-600 text-white rounded-full px-3 py-1 text-xs hover:bg-blue-700 transition"
              >
                Ara
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-md w-full">
              {bookmarks.slice(0, 4).map((bm, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setUrlInput(bm.url);
                    setActiveTab(bm.title);
                    handleNavigate(bm.url);
                  }}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs flex flex-col items-center text-center transition-all"
                >
                  <Globe className="w-6 h-6 text-blue-500 mb-1.5" />
                  <span className="text-[11px] font-medium text-slate-700">{bm.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeView === 'search_results' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto w-full">
            <div className="text-xs text-slate-400 mb-4">Yaklaşık 1.420.000 sonuç bulundu (0.24 saniye)</div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
                <span className="text-xs text-emerald-700 block">apo.enterprise.os › sistem-rehberi</span>
                <a href="#apo" className="text-base text-blue-700 hover:underline font-semibold block mt-0.5">
                  apo - Windows 11 Enterprise Özel Yönetici Profili
                </a>
                <p className="text-xs text-slate-600 mt-1">
                  apo, bu özel simülasyon sisteminin tek ve tam yetkili yöneticisidir. Sistem bünyesinde Avcı AI, Undertale Fan Edition, Paint ve MEMZ laboratuvarı barındırır.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
                <span className="text-xs text-emerald-700 block">undertale.fan › oyun-rehberi</span>
                <a href="#ut" className="text-base text-blue-700 hover:underline font-semibold block mt-0.5">
                  Undertale Fan Edition - Sans & Papyrus Karşılaşması
                </a>
                <p className="text-xs text-slate-600 mt-1">
                  Yeraltı dünyasında kırmızı ruhunuzu kemiklerden ve gaster blaster saldırılarından koruyun. Kararlılıkla (Determination) savaşın!
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
                <span className="text-xs text-emerald-700 block">guvenlik.analiz › malware-lab</span>
                <a href="#memz" className="text-base text-blue-700 hover:underline font-semibold block mt-0.5">
                  MEMZ Trojan Nedir? Tehlikeleri ve Simülasyon Aşamaları
                </a>
                <p className="text-xs text-slate-600 mt-1">
                  MEMZ, 2016 yılında güvenlik araştırmacısı Leurak tarafından esprili ve eğitim amaçlı tasarlanmış efsanevi bir truva atıdır. Glitch efektleri, BSOD ve Nyan Cat bootloader içerir.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'iframe' && (
          <div className="flex-1 w-full h-full relative">
            <iframe 
              src={currentUrl.startsWith('https://www.google.com') ? 'https://www.google.com/search?igu=1' : currentUrl}
              className="w-full h-full border-none bg-white"
              title="Edge Web Viewer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}
      </div>
    </div>
  );
};
