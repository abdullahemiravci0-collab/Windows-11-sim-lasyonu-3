import React from 'react';

export function MyComputerApp() {
  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Ribbon / Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-4 text-sm text-slate-700">
        <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <button className="flex items-center gap-1 hover:bg-slate-200 px-2 py-1 rounded">
          <i className="fa-solid fa-arrow-up"></i>
        </button>
        
        <div className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white flex items-center gap-2">
          <i className="fa-solid fa-computer text-blue-500"></i>
          <span>Bu Bilgisayar</span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-slate-50 border-r border-slate-200 p-2 overflow-y-auto">
          <ul className="space-y-1 text-sm text-slate-700">
            <li className="flex items-center gap-2 hover:bg-slate-200 p-1.5 rounded cursor-pointer bg-slate-200/50">
              <i className="fa-solid fa-computer text-blue-500 w-4 text-center"></i>
              <span>Bu Bilgisayar</span>
            </li>
            <li className="flex items-center gap-2 hover:bg-slate-200 p-1.5 rounded cursor-pointer">
              <i className="fa-solid fa-folder text-blue-400 w-4 text-center"></i>
              <span>Belgeler</span>
            </li>
            <li className="flex items-center gap-2 hover:bg-slate-200 p-1.5 rounded cursor-pointer">
              <i className="fa-solid fa-download text-blue-400 w-4 text-center"></i>
              <span>İndirilenler</span>
            </li>
            <li className="flex items-center gap-2 hover:bg-slate-200 p-1.5 rounded cursor-pointer">
              <i className="fa-solid fa-image text-blue-400 w-4 text-center"></i>
              <span>Resimler</span>
            </li>
          </ul>
        </div>

        {/* Main Drive View */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">
          <h2 className="text-slate-600 font-semibold mb-4 border-b pb-2">Cihazlar ve Sürücüler (2)</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 border rounded hover:bg-blue-50 cursor-pointer group transition-colors">
              <i className="fa-brands fa-windows text-4xl text-blue-500 group-hover:scale-105 transition-transform"></i>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">Yerel Disk (C:)</div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mt-1 mb-1 shadow-inner">
                  <div className="bg-blue-500 h-full w-[85%]"></div>
                </div>
                <div className="text-xs text-slate-500">22.4 GB boş, Toplam 120 GB</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded hover:bg-blue-50 cursor-pointer group transition-colors">
              <i className="fa-solid fa-hard-drive text-4xl text-slate-400 group-hover:scale-105 transition-transform"></i>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">Depo (D:)</div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mt-1 mb-1 shadow-inner">
                  <div className="bg-blue-500 h-full w-[45%]"></div>
                </div>
                <div className="text-xs text-slate-500">550 GB boş, Toplam 1 TB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-slate-100 border-t border-slate-200 flex items-center px-4 text-xs text-slate-600">
        <span>2 öğe</span>
      </div>
    </div>
  );
}
