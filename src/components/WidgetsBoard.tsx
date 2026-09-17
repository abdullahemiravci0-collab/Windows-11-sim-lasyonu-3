import React, { useState } from 'react';
import { 
  CloudSun, 
  TrendingUp, 
  Newspaper, 
  CheckSquare, 
  X, 
  Search, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp?: (id: string) => void;
}

export const WidgetsBoard: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Windows 11 Enterprise optimizasyonunu tamamla', done: true },
    { id: 2, text: 'Avcı AI güvenlik analizini çalıştır', done: true },
    { id: 3, text: 'Undertale Sans savaşında pratik yap', done: false },
    { id: 4, text: 'MEMZ trojan karantina testlerini gözden geçir', done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  if (!isOpen) return null;

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText.trim(), done: false }]);
    setNewTaskText('');
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="fixed top-0 left-0 bottom-12 w-96 sm:w-[460px] bg-slate-900/85 backdrop-blur-2xl border-r border-white/10 z-40 p-4 text-white shadow-2xl flex flex-col justify-between overflow-y-auto select-none animate-in slide-in-from-left duration-200"
    >
      <div>
        {/* Top Widgets Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <div className="font-semibold text-xs text-white">Widget Paneli</div>
              <div className="text-[10px] text-slate-400">apo-PC • Kişisel Akış</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Widgets Search */}
        <div className="relative mb-4">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Web'de ve haberlerde ara..."
            className="w-full bg-slate-800/80 border border-white/10 rounded-full py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-400 outline-none focus:border-blue-400 transition"
          />
        </div>

        {/* Cards Grid */}
        <div className="space-y-3.5">
          {/* Weather Widget */}
          <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-4 shadow-sm hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <CloudSun className="w-4 h-4 text-amber-400" />
                <span>Hava Durumu</span>
              </div>
              <span className="text-[10px] text-slate-400">İstanbul</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-light text-white">22°C</div>
                <div className="text-xs text-slate-300">Çoğunlukla Güneşli</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Hissedilen: 23° • Nem: %48</div>
              </div>
              <div className="text-4xl">🌤️</div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/10 text-center text-[10px]">
              <div><span className="text-slate-400">Bugün</span><div className="font-semibold">22° / 15°</div></div>
              <div><span className="text-slate-400">Yarın</span><div className="font-semibold">24° / 16°</div></div>
              <div><span className="text-slate-400">Pzr</span><div className="font-semibold">21° / 14°</div></div>
              <div><span className="text-slate-400">Pzt</span><div className="font-semibold">19° / 12°</div></div>
            </div>
          </div>

          {/* Finance / Stocks Widget */}
          <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-4 shadow-sm hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Piyasalar</span>
              </div>
              <span className="text-[10px] text-slate-400">Canlı</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400">BIST 100</div>
                <div className="font-bold text-white text-xs">9.842,50</div>
                <div className="text-[10px] text-emerald-400 font-medium">+%1,42</div>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400">USD / TRY</div>
                <div className="font-bold text-white text-xs">34,12</div>
                <div className="text-[10px] text-emerald-400 font-medium">+%0,18</div>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400">EUR / TRY</div>
                <div className="font-bold text-white text-xs">37,85</div>
                <div className="text-[10px] text-emerald-400 font-medium">+%0,25</div>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400">BTC / USD</div>
                <div className="font-bold text-white text-xs">$64.280</div>
                <div className="text-[10px] text-emerald-400 font-medium">+%3,10</div>
              </div>
            </div>
          </div>

          {/* apo's To-Do List Widget */}
          <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-4 shadow-sm hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <span>apo Yapılacaklar Listesi</span>
              </div>
              <span className="text-[10px] text-blue-400 font-medium">Microsoft To Do</span>
            </div>

            <div className="space-y-1.5 mb-3">
              {tasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer transition text-xs"
                >
                  <input 
                    type="checkbox" 
                    checked={t.done}
                    onChange={() => {}} 
                    className="accent-blue-500 rounded cursor-pointer"
                  />
                  <span className={`text-slate-200 text-[11px] truncate ${t.done ? 'line-through text-slate-500' : ''}`}>
                    {t.text}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="flex items-center gap-1.5 pt-2 border-t border-white/10">
              <input 
                type="text" 
                placeholder="Yeni görev ekle..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-slate-400 outline-none focus:border-blue-400"
              />
              <button 
                type="submit"
                className="p-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* MSN News Highlights */}
          <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-4 shadow-sm hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Newspaper className="w-4 h-4 text-purple-400" />
                <span>Günün Haberleri</span>
              </div>
              <span className="text-[10px] text-slate-400">MSN</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/15 transition cursor-pointer">
                <div className="text-[11px] font-semibold text-white">Windows 11 Enterprise 23H2 yeni yapay zeka deneyimleriyle güncellendi</div>
                <div className="text-[9px] text-slate-400 mt-1">Teknoloji • 20 dk önce</div>
              </div>
              <div className="p-2 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/15 transition cursor-pointer">
                <div className="text-[11px] font-semibold text-white">Undertale hayranları için tarayıcı üzerinde interaktif Sans savaşı yayınlandı</div>
                <div className="text-[9px] text-slate-400 mt-1">Oyun • 1 saat önce</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10 text-center text-[10px] text-slate-400">
        Windows 11 Widgets • apo-PC
      </div>
    </div>
  );
};
