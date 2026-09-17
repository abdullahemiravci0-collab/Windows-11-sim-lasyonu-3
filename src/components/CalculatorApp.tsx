import React, { useState } from 'react';
import { Delete, History, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [memory, setMemory] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleDigit = (digit: string) => {
    sound.playClick();
    if (display === '0' || display === 'Hata') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    sound.playClick();
    setFormula(`${display} ${op} `);
    setDisplay('0');
  };

  const handleCalculate = () => {
    sound.playClick();
    try {
      const fullExpression = formula + display;
      const sanitized = fullExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');
      
      // Safe math eval with Function
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${sanitized})`)();
      const formatted = Number(result).toLocaleString('tr-TR', { maximumFractionDigits: 8 });
      setHistory(prev => [`${fullExpression} = ${formatted}`, ...prev.slice(0, 9)]);
      setDisplay(formatted);
      setFormula('');
    } catch {
      setDisplay('Hata');
    }
  };

  const handleClear = () => {
    sound.playClick();
    setDisplay('0');
    setFormula('');
  };

  const handleBackspace = () => {
    sound.playClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    sound.playClick();
    if (display === '0') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handleDecimal = () => {
    sound.playClick();
    if (!display.includes(',')) {
      setDisplay(display + ',');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] text-slate-800 select-none text-xs font-sans">
      {/* Top Header Mode */}
      <div className="px-4 py-2 border-b border-slate-200 bg-white/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm">Standart</span>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-1.5 rounded-lg hover:bg-slate-200 transition ${showHistory ? 'bg-slate-200 text-blue-600' : 'text-slate-600'}`}
          title="Geçmiş"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Calculator */}
        <div className="flex-1 flex flex-col p-3 justify-between">
          {/* Display screen */}
          <div className="text-right px-2 py-3 bg-transparent">
            <div className="text-slate-500 text-xs h-4 overflow-hidden">{formula}</div>
            <div className="text-3xl font-light text-slate-900 truncate tracking-tight">
              {display}
            </div>
          </div>

          {/* Memory Bar */}
          <div className="grid grid-cols-5 gap-1 mb-2 text-center text-[11px] text-slate-600">
            <button 
              onClick={() => { setMemory(null); sound.playClick(); }}
              disabled={memory === null}
              className="py-1 rounded hover:bg-white/80 disabled:opacity-30"
            >
              MC
            </button>
            <button 
              onClick={() => { if (memory !== null) setDisplay(memory.toString()); sound.playClick(); }}
              disabled={memory === null}
              className="py-1 rounded hover:bg-white/80 disabled:opacity-30"
            >
              MR
            </button>
            <button 
              onClick={() => { setMemory((memory || 0) + Number(display.replace(',', '.'))); sound.playClick(); }}
              className="py-1 rounded hover:bg-white/80"
            >
              M+
            </button>
            <button 
              onClick={() => { setMemory((memory || 0) - Number(display.replace(',', '.'))); sound.playClick(); }}
              className="py-1 rounded hover:bg-white/80"
            >
              M-
            </button>
            <button 
              onClick={() => { setMemory(Number(display.replace(',', '.'))); sound.playClick(); }}
              className="py-1 rounded hover:bg-white/80"
            >
              MS
            </button>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-1.5 flex-1">
            <button onClick={handleClear} className="bg-white/60 hover:bg-white border border-slate-200/80 rounded-lg font-medium text-slate-700 py-2.5">
              C
            </button>
            <button onClick={handleClear} className="bg-white/60 hover:bg-white border border-slate-200/80 rounded-lg font-medium text-slate-700 py-2.5">
              CE
            </button>
            <button onClick={handleBackspace} className="bg-white/60 hover:bg-white border border-slate-200/80 rounded-lg flex items-center justify-center text-slate-700 py-2.5">
              <Delete className="w-4 h-4" />
            </button>
            <button onClick={() => handleOperator('÷')} className="bg-slate-200/70 hover:bg-slate-200 border border-slate-300/60 rounded-lg font-semibold text-slate-800 text-sm py-2.5">
              ÷
            </button>

            {['7', '8', '9'].map(d => (
              <button key={d} onClick={() => handleDigit(d)} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 text-base py-2.5 shadow-2xs">
                {d}
              </button>
            ))}
            <button onClick={() => handleOperator('×')} className="bg-slate-200/70 hover:bg-slate-200 border border-slate-300/60 rounded-lg font-semibold text-slate-800 text-sm py-2.5">
              ×
            </button>

            {['4', '5', '6'].map(d => (
              <button key={d} onClick={() => handleDigit(d)} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 text-base py-2.5 shadow-2xs">
                {d}
              </button>
            ))}
            <button onClick={() => handleOperator('−')} className="bg-slate-200/70 hover:bg-slate-200 border border-slate-300/60 rounded-lg font-semibold text-slate-800 text-sm py-2.5">
              −
            </button>

            {['1', '2', '3'].map(d => (
              <button key={d} onClick={() => handleDigit(d)} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 text-base py-2.5 shadow-2xs">
                {d}
              </button>
            ))}
            <button onClick={() => handleOperator('+')} className="bg-slate-200/70 hover:bg-slate-200 border border-slate-300/60 rounded-lg font-semibold text-slate-800 text-sm py-2.5">
              +
            </button>

            <button onClick={handleToggleSign} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 py-2.5 shadow-2xs">
              ⁺/₋
            </button>
            <button onClick={() => handleDigit('0')} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 text-base py-2.5 shadow-2xs">
              0
            </button>
            <button onClick={handleDecimal} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 text-base py-2.5 shadow-2xs">
              ,
            </button>
            <button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg py-2.5 shadow-sm transition">
              =
            </button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="w-48 border-l border-slate-200 bg-white/80 p-3 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Geçmiş</span>
              <button onClick={() => setHistory([])} className="text-[10px] text-blue-600 hover:underline">
                Temizle
              </button>
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="text-right p-1.5 hover:bg-slate-100 rounded text-xs border border-slate-100">
                  <div className="text-slate-500 text-[10px]">{h.split('=')[0]} =</div>
                  <div className="font-semibold text-slate-800">{h.split('=')[1]}</div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-slate-400 text-center py-6 text-[11px]">
                  Henüz geçmiş yok
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
