import React, { useState } from 'react';
import { 
  Laptop, 
  Palette, 
  LayoutGrid, 
  User, 
  Clock, 
  RotateCw, 
  Volume2, 
  HardDrive, 
  ShieldCheck, 
  Check, 
  Moon, 
  Sun,
  Bell,
  Wifi,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface Props {
  currentWallpaper: string;
  onChangeWallpaper: (url: string) => void;
  onOpenApp?: (id: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

type TabType = 'system' | 'personalization' | 'apps' | 'accounts' | 'update';

export const SettingsApp: React.FC<Props> = ({
  currentWallpaper,
  onChangeWallpaper,
  isDarkMode,
  setIsDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('system');
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastCheck, setLastCheck] = useState('Bugün 12:45');

  const wallpapers = [
    {
      id: 'bloom-dark',
      name: 'Windows 11 Bloom Dark (Varsayılan)',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920'
    },
    {
      id: 'bloom-light',
      name: 'Windows 11 Bloom Light',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&invert=1'
    },
    {
      id: 'glow',
      name: 'Windows 11 Glow (Neon Işıltı)',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920'
    },
    {
      id: 'sunrise',
      name: 'Gündoğumu & Doğa',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920'
    },
    {
      id: 'flow',
      name: 'Modern Akışkan Dalgalar',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1920'
    },
    {
      id: 'abstract',
      name: 'Minimalist Gece Gökyüzü',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920'
    }
  ];

  const handleCheckUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setLastCheck('Az önce');
    }, 2000);
  };

  return (
    <div className="flex h-full bg-[#f3f3f3] dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-none text-xs overflow-hidden font-sans transition-colors">
      {/* Left Navigation Sidebar */}
      <div className="w-56 bg-slate-100/90 dark:bg-slate-800/90 border-r border-slate-200/80 dark:border-slate-700/80 p-3 flex flex-col justify-between shrink-0">
        <div>
          {/* User Brief in Settings */}
          <div className="flex items-center gap-2.5 px-2 py-2.5 mb-3 bg-white/70 dark:bg-slate-700/70 rounded-xl border border-slate-200/60 dark:border-slate-600/60 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              A
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">apo</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">apo-PC • Yönetici</div>
            </div>
          </div>

          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-2.5 mb-1.5 uppercase tracking-wider">
            Ayarlar
          </div>

          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeTab === 'system'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Laptop className="w-4 h-4 text-blue-500" />
              <span>Sistem</span>
            </button>

            <button
              onClick={() => setActiveTab('personalization')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeTab === 'personalization'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4 text-pink-500" />
              <span>Kişiselleştirme</span>
            </button>

            <button
              onClick={() => setActiveTab('apps')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeTab === 'apps'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-cyan-500" />
              <span>Uygulamalar</span>
            </button>

            <button
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeTab === 'accounts'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-emerald-500" />
              <span>Hesaplar</span>
            </button>

            <button
              onClick={() => setActiveTab('update')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                activeTab === 'update'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-600/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RotateCw className="w-4 h-4 text-purple-500" />
              <span>Windows Update</span>
            </button>
          </nav>
        </div>

        <div className="p-2.5 bg-blue-50/70 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-xl text-[10px] text-blue-800 dark:text-blue-300 space-y-1">
          <div className="font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Windows 11 Enterprise
          </div>
          <div className="text-blue-600/90 dark:text-blue-300/80">Sürüm 23H2 (apo Lisansı)</div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-5 overflow-y-auto bg-white/60 dark:bg-slate-900/60">
        {/* TAB 1: SYSTEM */}
        {activeTab === 'system' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Sistem</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">apo-PC aygıt ve donanım özellikleri</p>
              </div>
            </div>

            {/* PC Overview Hero Card */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">apo-PC</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Intel(R) Core(TM) i9-14900K @ 5.80GHz</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium text-[10px] mt-0.5">32,0 GB RAM • Windows 11 Enterprise x64</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-full font-semibold text-[10px]">
                Etkinleştirildi
              </span>
            </div>

            {/* Sub-cards */}
            <div className="space-y-2">
              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Depolama (Yerel Disk C:)</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px]">182 GB kullanılıyor / 512 GB toplam</div>
                  </div>
                </div>
                <div className="w-28 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                  <div className="w-[35%] h-full bg-blue-500 dark:bg-blue-400 rounded-full" />
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Ses & Hoparlörler</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px]">Realtek High Definition Audio (Varsayılan çıkış)</div>
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-500 text-xs">Açık ›</span>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Bildirimler ve Odaklanma Yardımı</div>
                    <div className="text-slate-500 text-[10px]">Tüm sistem bildirimleri etkin</div>
                  </div>
                </div>
                <span className="text-slate-400 text-xs">Açık ›</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONALIZATION */}
        {activeTab === 'personalization' && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Kişiselleştirme</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Masaüstü duvar kağıdı, renkler ve temalar</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Tema Rengi</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Açık veya koyu mod seçin</div>
                </div>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => setIsDarkMode(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    !isDarkMode ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-600/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  Açık
                </button>
                <button
                  onClick={() => setIsDarkMode(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isDarkMode ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-600/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Koyu
                </button>
              </div>
            </div>

            {/* Current Wallpaper Preview */}
            <div 
              className="h-36 rounded-xl bg-cover bg-center border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex items-end p-3"
              style={{ backgroundImage: `url('${currentWallpaper}')` }}
            >
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span className="font-medium">Mevcut Duvar Kağıdı</span>
              </div>
            </div>

            {/* Wallpaper Grid */}
            <div className="space-y-2">
              <div className="font-semibold text-slate-700 text-xs">Bir tema veya arka plan seçin</div>
              <div className="grid grid-cols-3 gap-2.5">
                {wallpapers.map((wp) => {
                  const isSelected = currentWallpaper === wp.url;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => onChangeWallpaper(wp.url)}
                      className={`group relative rounded-xl border-2 p-1 text-left transition-all overflow-hidden ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div 
                        className="h-20 rounded-lg bg-cover bg-center mb-1.5 transition-transform group-hover:scale-105"
                        style={{ backgroundImage: `url('${wp.url}')` }}
                      />
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-medium text-slate-800 truncate">{wp.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPS */}
        {activeTab === 'apps' && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Yüklü Uygulamalar</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Windows 11 Enterprise üzerinde çalışan yazılımlar</p>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Avcı AI (Windows 11 Asistanı)', size: '42 MB', ver: '2.4.0', status: 'Sistem Bileşeni' },
                { name: 'Microsoft Edge', size: '280 MB', ver: '124.0.2478.80', status: 'Varsayılan Tarayıcı' },
                { name: 'Undertale (Web Fan Edition)', size: '185 MB', ver: '1.08', status: 'Oyun' },
                { name: 'Paint (Modern Çizim)', size: '34 MB', ver: '11.2310.24', status: 'Sistem' },
                { name: 'Not Defteri (Notepad)', size: '12 MB', ver: '11.2311.35', status: 'Sistem' },
                { name: 'Komut İstemi (Windows Terminal)', size: '8 MB', ver: '10.0.22631', status: 'Sistem' },
                { name: 'Görev Yöneticisi', size: '16 MB', ver: '11.0.1', status: 'Sistem' },
                { name: 'Hesap Makinesi', size: '18 MB', ver: '11.2307.4', status: 'Sistem' },
                { name: 'MEMZ_Payload.exe (Trojan)', size: '348 KB', ver: '1.0', status: 'Simülatör' }
              ].map((app, i) => (
                <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{app.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Sürüm {app.ver} • {app.size}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400 font-medium">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNTS */}
        {activeTab === 'accounts' && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Hesaplar</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">apo kullanıcı hesabı ve kimlik doğrulama</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-md">
                A
              </div>
              <div className="space-y-0.5">
                <div className="text-base font-bold text-slate-900 dark:text-white">apo</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Yerel Hesap • Yönetici (Administrator)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">avcih4271@gmail.com</div>
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Windows Hello / PIN ile Oturum Açma</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Windows 11 PIN koruması yapılandırıldı</div>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-[11px] font-medium">
                Yapılandırıldı
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: WINDOWS UPDATE */}
        {activeTab === 'update' && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Windows Update</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Güncellemeleri denetleyin ve apo-PC'yi güvende tutun</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Güncelsiniz</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">Son denetleme: {lastCheck}</div>
                </div>
              </div>

              <button
                onClick={handleCheckUpdate}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Denetleniyor...' : 'Güncelleştirmeleri Denetle'}
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Güncelleme Geçmişi</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                <span>Windows 11 Toplu Güncelleştirmesi (KB5034441)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Başarılı</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Avcı AI Güvenlik Tanımı Güncelleştirmesi v2.4</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Başarılı</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
