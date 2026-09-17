import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Trash2, 
  Clock, 
  Play, 
  Check, 
  ShieldCheck, 
  Info, 
  AlertTriangle 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarNotificationFlyout: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [focusTimer, setFocusTimer] = useState(30);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      app: 'Avcı AI Asistanı',
      title: 'Sistem Koruma Durumu',
      desc: 'apo-PC çekirdek bütünlüğü doğrulandı. Tüm arka plan hizmetleri kararlı.',
      time: '10 dk önce',
      icon: ShieldCheck,
      iconColor: 'text-cyan-400'
    },
    {
      id: 2,
      app: 'Windows Güvenliği',
      title: 'Kötü Amaçlı Yazılım Uyarısı',
      desc: 'Masaüstündeki MEMZ_Payload.exe dosyası simülasyon modunda çalışmaya hazır.',
      time: '35 dk önce',
      icon: AlertTriangle,
      iconColor: 'text-amber-400'
    }
  ]);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert so Monday is 0:
  const startDay = (firstDayIndex + 6) % 7;

  const daysArray = [];
  for (let i = 0; i < startDay; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const todayDate = new Date();
  const isTodayMonth = todayDate.getFullYear() === year && todayDate.getMonth() === month;

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-3 w-84 sm:w-96 bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-white/10 dark:border-slate-800/80 rounded-2xl p-4 text-white shadow-2xl z-50 select-none animate-in fade-in slide-in-from-bottom-3 duration-150 flex flex-col gap-3 font-sans"
    >
      {/* Top Header: Date and Notification Clear */}
      <div className="flex items-center justify-between border-b border-white/10 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-xs text-slate-200">Bildirimler ({notifications.length})</span>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearAllNotifications}
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          >
            <Trash2 className="w-3 h-3" /> Tümünü Temizle
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-36 overflow-y-auto space-y-2">
        {notifications.map(n => {
          const IconComp = n.icon;
          return (
            <div key={n.id} className="p-2.5 bg-slate-800/70 border border-white/5 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <IconComp className={`w-3.5 h-3.5 ${n.iconColor}`} />
                  <span>{n.app}</span>
                </div>
                <span>{n.time}</span>
              </div>
              <div className="font-medium text-slate-200 text-[11px]">{n.title}</div>
              <div className="text-[10px] text-slate-400 line-clamp-2">{n.desc}</div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-4 text-slate-500 text-xs">
            Yeni bildirim yok
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 pt-2">
        {/* Month Title & Nav */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-xs text-white">
            {monthNames[month]} {year}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-md transition text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-md transition text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
          <span>Pzt</span>
          <span>Sal</span>
          <span>Çar</span>
          <span>Per</span>
          <span>Cum</span>
          <span className="text-blue-300">Cmt</span>
          <span className="text-red-400">Paz</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {daysArray.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-7" />;
            }
            const isToday = isTodayMonth && day === todayDate.getDate();
            return (
              <button
                key={day}
                className={`h-7 rounded-full flex items-center justify-center font-medium transition text-[11px] ${
                  isToday
                    ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-300'
                    : 'hover:bg-white/10 text-slate-200'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus Assist bar at bottom */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] text-slate-300">Odaklanma (30 dk)</span>
        </div>
        <button 
          onClick={() => setIsFocusActive(!isFocusActive)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition flex items-center gap-1 ${
            isFocusActive ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          {isFocusActive ? <Check className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {isFocusActive ? 'Aktif' : 'Başlat'}
        </button>
      </div>
    </div>
  );
};
