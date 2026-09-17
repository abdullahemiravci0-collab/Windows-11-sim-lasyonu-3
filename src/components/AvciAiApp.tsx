import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Shield, Cpu, Terminal, RefreshCw, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface Props {
  onTriggerMemz?: () => void;
  onOpenApp?: (appId: any) => void;
}

export const AvciAiApp: React.FC<Props> = ({ onTriggerMemz, onOpenApp }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'avci',
      text: 'Merhaba apo! Ben Avcı AI, Windows 11 Enterprise sistem asistanınızım. Bilgisayarınızın durumu, Undertale tüyoları veya masaüstündeki uygulamalar hakkında size nasıl yardımcı olabilirim?',
      timestamp: '10:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    'Sistem durumunu kontrol et',
    'MEMZ virüsü nedir?',
    'Undertale Sans nasıl geçilir?',
    'apo kimdir?',
    'Bana bir espri yap'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/avci-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error('Sunucu yanıt vermedi');
      }

      const data = await response.json();
      const reply = data.reply || getLocalFallback(text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'avci',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // Intelligent offline response
      const fallbackReply = getLocalFallback(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'avci',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('memz') || q.includes('virüs') || q.includes('malware')) {
      return '⚠️ DİKKAT apo! Masaüstündeki MEMZ_Payload.exe simülasyonu çalıştırıldığında ekranda glitch efektleri, Nyan Cat animasyonu ve Mavi Ekran (BSOD) tetiklenecektir. Korkma, bu güvenli bir sanal simülasyondur ve sonrasında Otomatik Onarım ile sistemi hemen kurtarabilirsin!';
    }
    if (q.includes('undertale') || q.includes('sans')) {
      return '💀 Sans savaşında en önemli kural: Kararlılık! Kırmızı ruhunla kemiklerin arasından kayarken ritmi koru. Mavi saldırılarda sakın hareket etme, beyaz saldırılarda ise sürekli yön değiştir apo!';
    }
    if (q.includes('apo') || q.includes('kimdir')) {
      return '👑 apo, bu Windows 11 Enterprise sisteminin tek ve mutlak yöneticisidir (Administrator). Tüm yetkiler, özel klasörler ve Avcı AI protokolü apo için optimize edilmiştir.';
    }
    if (q.includes('sistem') || q.includes('durum')) {
      return '💻 apo-PC Sistem Durumu: Windows 11 Enterprise 23H2. CPU: %14 (Stabil). RAM: 4.8 GB / 16 GB. Güvenlik Duvarı: Aktif. Avcı AI asistan koruması devrede!';
    }
    if (q.includes('espri') || q.includes('şaka')) {
      return '😄 Bir yazılımcı neden gözlük takar? Çünkü C# göremiyormuş! apo, umarım sisteminde sonsuz döngülere denk gelmezsin!';
    }
    return `Anladım apo! "${query}" isteğin işleme alındı. Windows 11 ortamında senin için hazır bekliyorum.`;
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 select-none text-xs">
      {/* AI Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-200" />
          </div>
          <div>
            <div className="font-bold text-xs flex items-center gap-1.5">
              Avcı AI <Sparkles className="w-3 h-3 text-yellow-300" />
            </div>
            <div className="text-[10px] text-cyan-100">Windows 11 Enterprise Asistanı</div>
          </div>
        </div>

        <button 
          onClick={() => setMessages([messages[0]])} 
          className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10"
          title="Sohbeti Temizle"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs px-2">
            <Bot className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
            <span>Avcı AI düşünüyor...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 border border-slate-200 rounded-full text-[10px] whitespace-nowrap text-slate-600 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Avcı AI'ya bir soru sorun veya komut verin..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs outline-none focus:border-cyan-500 focus:bg-white transition-all"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-full transition shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
