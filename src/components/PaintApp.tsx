import React, { useRef, useState, useEffect } from 'react';
import { 
  Paintbrush, 
  Eraser, 
  Trash2, 
  Download, 
  Undo, 
  Palette 
} from 'lucide-react';

export const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);

  const defaultPalette = [
    '#000000', '#ffffff', '#7f7f7f', '#c3c3c3',
    '#880015', '#b97a57', '#ed1c24', '#ffaec9',
    '#ff7f27', '#ffc90e', '#fff200', '#efe4b0',
    '#22b14c', '#b5e61d', '#00a2e8', '#99d9ea',
    '#3f48cc', '#7092be', '#a349a4', '#c8bfe7'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-15), imgData]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previous = newHistory[newHistory.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
      setHistory(newHistory);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'apo_paint_cizim.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f6] text-slate-800 select-none text-xs">
      {/* Paint Ribbon Toolbar */}
      <div className="p-2 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Tools */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setTool('brush')}
            className={`p-1.5 rounded flex items-center gap-1 transition ${
              tool === 'brush' ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Fırça"
          >
            <Paintbrush className="w-4 h-4" />
            <span className="hidden sm:inline">Fırça</span>
          </button>

          <button 
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded flex items-center gap-1 transition ${
              tool === 'eraser' ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Silgi"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Silgi</span>
          </button>

          <button 
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-40"
            title="Geri Al"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button 
            onClick={clearCanvas}
            className="p-1.5 rounded hover:bg-slate-100 text-red-500"
            title="Tuvali Temizle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
          <span className="text-[11px] text-slate-500">Boyut:</span>
          {[2, 4, 8, 16].map(sz => (
            <button
              key={sz}
              onClick={() => setBrushSize(sz)}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                brushSize === sz ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <input 
              type="color" 
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setTool('brush');
              }}
              className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0 bg-transparent"
              title="Özel Renk Seç"
            />
          </div>

          <div className="grid grid-cols-10 gap-1 max-w-[170px]">
            {defaultPalette.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setColor(c);
                  setTool('brush');
                }}
                style={{ backgroundColor: c }}
                className={`w-3.5 h-3.5 rounded-xs border transition-transform ${
                  color === c && tool === 'brush' ? 'scale-125 border-black shadow-xs ring-1 ring-blue-500' : 'border-slate-300 hover:scale-110'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={downloadCanvas}
            className="p-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white ml-2 flex items-center gap-1"
            title="Resmi İndir (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">İndir</span>
          </button>
        </div>
      </div>

      {/* Drawing Canvas Container */}
      <div className="flex-1 bg-slate-200 p-3 overflow-auto flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white shadow-md rounded border border-slate-300 cursor-crosshair max-w-full h-auto"
        />
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
        <span>Tuval: 640 x 400 piksel</span>
        <span>{tool === 'brush' ? `Fırça: ${color} (${brushSize}px)` : `Silgi (${brushSize}px)`}</span>
      </div>
    </div>
  );
};
