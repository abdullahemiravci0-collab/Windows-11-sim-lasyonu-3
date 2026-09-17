import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, ShieldCheck, XCircle } from 'lucide-react';
import { MemzStage } from '../types';

interface Props {
  memzStage: MemzStage;
  onKillMemz: () => void;
}

export const TaskManagerApp: React.FC<Props> = ({ memzStage, onKillMemz }) => {
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(24);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const isMemzActive = ['warning1', 'warning2', 'payload'].includes(memzStage);
      setCpu(isMemzActive ? Math.floor(75 + Math.random() * 24) : Math.floor(8 + Math.random() * 8));
      setRam(isMemzActive ? Math.floor(65 + Math.random() * 15) : Math.floor(22 + Math.random() * 4));
    }, 1200);
    return () => clearInterval(timer);
  }, [memzStage]);

  const processes = [
    { name: 'apo-Explorer.exe', pid: '1042', user: 'apo', cpu: '1.2%', ram: '142 MB', status: 'Çalışıyor' },
    { name: 'AvciAI-Assistant.exe', pid: '2094', user: 'apo', cpu: '2.4%', ram: '210 MB', status: 'Çalışıyor' },
    { name: 'Undertale-Fan.exe', pid: '3188', user: 'apo', cpu: '4.1%', ram: '185 MB', status: 'Çalışıyor' },
    { name: 'msedge.exe', pid: '4120', user: 'apo', cpu: '3.0%', ram: '320 MB', status: 'Çalışıyor' },
    { name: 'dwm.exe (Masaüstü Yöneticisi)', pid: '740', user: 'SYSTEM', cpu: '0.8%', ram: '98 MB', status: 'Çalışıyor' }
  ];

  if (['warning1', 'warning2', 'payload'].includes(memzStage)) {
    processes.unshift({
      name: 'MEMZ_Payload.exe (Trojan)',
      pid: '6666',
      user: 'apo',
      cpu: '84.2%',
      ram: '840 MB',
      status: 'YÜKSEK CPU KULLANIMI ⚠️'
    });
  }

  const handleEndTask = () => {
    if (selectedProcess === 'MEMZ_Payload.exe (Trojan)') {
      onKillMemz();
      setSelectedProcess(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 select-none text-xs">
      {/* Top Metrics Cards */}
      <div className="p-3 bg-white border-b border-slate-200 grid grid-cols-3 gap-2">
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-blue-500" /> CPU
            </div>
            <div className={`text-base font-bold ${cpu > 60 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
              %{cpu}
            </div>
          </div>
          <div className="w-12 h-6 bg-slate-200 rounded overflow-hidden flex items-end">
            <div className={`w-full transition-all duration-300 ${cpu > 60 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${cpu}%` }} />
          </div>
        </div>

        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500" /> Bellek
            </div>
            <div className="text-base font-bold text-slate-800">
              %{ram}
            </div>
          </div>
          <div className="w-12 h-6 bg-slate-200 rounded overflow-hidden flex items-end">
            <div className="w-full bg-emerald-500 transition-all duration-300" style={{ height: `${ram}%` }} />
          </div>
        </div>

        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-purple-500" /> Disk
            </div>
            <div className="text-base font-bold text-slate-800">
              %4
            </div>
          </div>
          <div className="w-12 h-6 bg-slate-200 rounded overflow-hidden flex items-end">
            <div className="w-full bg-purple-500 h-1" />
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="flex-1 overflow-auto bg-white p-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 text-[10px]">
              <th className="pb-1.5 font-medium pl-2">İşlem Adı</th>
              <th className="pb-1.5 font-medium">PID</th>
              <th className="pb-1.5 font-medium">Kullanıcı</th>
              <th className="pb-1.5 font-medium">CPU</th>
              <th className="pb-1.5 font-medium">Bellek</th>
              <th className="pb-1.5 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, i) => (
              <tr 
                key={i}
                onClick={() => setSelectedProcess(p.name)}
                className={`border-b border-slate-100 cursor-pointer transition-colors ${
                  selectedProcess === p.name ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50'
                } ${p.name.includes('MEMZ') ? 'bg-red-50 text-red-700' : ''}`}
              >
                <td className="py-2 pl-2 flex items-center gap-1.5">
                  <span className="truncate">{p.name}</span>
                </td>
                <td className="py-2 text-slate-500">{p.pid}</td>
                <td className="py-2 text-slate-500">{p.user}</td>
                <td className="py-2 font-medium">{p.cpu}</td>
                <td className="py-2 text-slate-500">{p.ram}</td>
                <td className="py-2 text-[11px] font-medium">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">Kullanıcı: apo (Yönetici)</span>
        <button
          onClick={handleEndTask}
          disabled={!selectedProcess}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded text-xs font-semibold flex items-center gap-1 transition"
        >
          <XCircle className="w-3.5 h-3.5" /> Görevi Sonlandır
        </button>
      </div>
    </div>
  );
};
