import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { AppId } from '../types';

interface Props {
  onOpenApp?: (id: AppId) => void;
  onTriggerMemz?: () => void;
  onShutdown?: () => void;
  onRestart?: () => void;
}

export const CmdApp: React.FC<Props> = ({ onOpenApp, onTriggerMemz, onShutdown, onRestart }) => {
  const [lines, setLines] = useState<string[]>([
    'Microsoft Windows [Sürüm 10.0.22631.3296]',
    '(c) Microsoft Corporation. Tüm hakları saklıdır.',
    '',
    'apo-PC C:\\Users\\apo> yardım için "help" yazabilirsiniz.'
  ]);
  const [inputVal, setInputVal] = useState('');
  const [textColor, setTextColor] = useState('#22c55e'); // green
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newLines = [...lines, `C:\\Users\\apo> ${cmd}`];
    const lower = cmd.toLowerCase();

    if (lower === 'cls' || lower === 'clear') {
      setLines([]);
      setInputVal('');
      return;
    }

    if (lower === 'help') {
      newLines.push(
        'Kullanılabilir Komutlar:',
        '  help          - Komut listesini görüntüler',
        '  dir           - Dizin içeriğini listeler',
        '  whoami        - Aktif kullanıcı bilgilerini gösterir',
        '  systeminfo    - Sistem özelliklerini raporlar',
        '  avci          - Avcı AI asistanını başlatır',
        '  undertale     - Undertale oyununu başlatır',
        '  games         - Retro Games terminalini başlatır (Snake, Text Adventure)',
        '  paint         - Paint uygulamasını açar',
        '  notepad       - Not Defterini açar',
        '  memz          - MEMZ_Payload.exe simülasyonunu başlatır (DİKKAT!)',
        '  shutdown      - Bilgisayarı kapatır (shutdown /s)',
        '  restart       - Bilgisayarı yeniden başlatır (shutdown /r)',
        '  color <renk>  - Yazı rengini değiştirir (green, cyan, yellow, white, red)',
        '  matrix        - Matrix akışını başlatır',
        '  cls           - Ekranı temizler'
      );
    } else if (lower === 'dir') {
      newLines.push(
        ' C:\\Users\\apo dizini',
        '',
        ' 01/01/2026  10:00    <DIR>          .',
        ' 01/01/2026  10:00    <DIR>          ..',
        ' 01/01/2026  10:14             1,240 apo_notlari.txt',
        ' 01/01/2026  09:20           356,352 MEMZ_Payload.exe',
        ' 01/01/2026  08:45             3,174 undertale_save.dat',
        ' 01/01/2026  11:00             2,450 Proje_Plani_2026.txt',
        ' 01/01/2026  12:00    <DIR>          Belgeler',
        ' 01/01/2026  12:00    <DIR>          İndirilenler',
        ' 01/01/2026  12:00    <DIR>          Resimler'
      );
    } else if (lower === 'whoami') {
      newLines.push('apo-pc\\apo [Yönetici / Administrator] (Yetki Seviyesi: Full Root)');
    } else if (lower === 'systeminfo') {
      newLines.push(
        'İşletim Sistemi Adı:     Microsoft Windows 11 Enterprise (apo)',
        'İşletim Sistemi Sürümü:  10.0.22631 Derleme 22631 (x64)',
        'Sistem Üreticisi:        apo Teknoloji Laboratuvarı',
        'Sistem Türü:             x64-based PC',
        'İşlemci:                 Intel(R) Core(TM) i9-14900K @ 5.80GHz (24 Çekirdek)',
        'Toplam Fiziksel Bellek:  32.768 MB (Kullanılabilir: 28.140 MB)',
        'Yapay Zeka Modülü:       Avcı AI v2.4 Entegre (Gemini Motoru)'
      );
    } else if (lower.startsWith('color ')) {
      const col = lower.split(' ')[1];
      if (col === 'green') setTextColor('#22c55e');
      else if (col === 'cyan') setTextColor('#06b6d4');
      else if (col === 'yellow') setTextColor('#eab308');
      else if (col === 'white') setTextColor('#ffffff');
      else if (col === 'red') setTextColor('#ef4444');
      else newLines.push('Geçersiz renk! Seçenekler: green, cyan, yellow, white, red');
    } else if (lower === 'avci') {
      newLines.push('Avcı AI başlatılıyor...');
      onOpenApp?.('avci');
    } else if (lower === 'undertale') {
      newLines.push('Undertale Web Fan Edition başlatılıyor...');
      onOpenApp?.('undertale');
    } else if (lower === 'games' || lower === 'retro') {
      newLines.push('Retro Games Arcade başlatılıyor...');
      onOpenApp?.('retro_games');
    } else if (lower === 'paint') {
      newLines.push('Paint başlatılıyor...');
      onOpenApp?.('paint');
    } else if (lower === 'notepad') {
      newLines.push('Not Defteri başlatılıyor...');
      onOpenApp?.('notepad');
    } else if (lower === 'memz' || lower === 'start memz') {
      newLines.push('⚠️ UYARI: MEMZ_Payload.exe çağrıldı!');
      onTriggerMemz?.();
    } else if (lower.startsWith('shutdown') || lower === 'kapat' || lower === 'exit /s') {
      if (lower.includes('/r') || lower.includes('-r')) {
        newLines.push('Windows 11 yeniden başlatılıyor...');
        setTimeout(() => onRestart?.(), 600);
      } else {
        newLines.push('Windows 11 kapatılıyor... Güle güle apo!');
        setTimeout(() => onShutdown?.(), 600);
      }
    } else if (lower === 'restart' || lower === 'reboot') {
      newLines.push('Windows 11 yeniden başlatılıyor...');
      setTimeout(() => onRestart?.(), 600);
    } else if (lower === 'matrix') {
      newLines.push(
        '01001000 01100001 01100011 01101011 01101001 01101110 01100111 00101110 00101110 00101110',
        'W A K E   U P ,   A P O . . .',
        'The Matrix has you.',
        'Follow the white rabbit.'
      );
    } else {
      newLines.push(`'${cmd}' geçerli bir iç ya da dış komut olarak tanınmıyor. Bilgi için 'help' yazın.`);
    }

    setLines(newLines);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full bg-black text-xs font-mono p-3 select-text overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1" style={{ color: textColor }}>
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">{l}</div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-1.5 mt-2 border-t border-slate-800 pt-2" style={{ color: textColor }}>
        <span>C:\Users\apo&gt;</span>
        <input 
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs"
          style={{ color: textColor }}
          autoFocus
        />
      </form>
    </div>
  );
};
