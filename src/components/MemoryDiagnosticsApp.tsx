import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

export function MemoryDiagnosticsApp() {
  const [progress, setProgress] = useState(0);
  const [pass, setPass] = useState(1);
  const [status, setStatus] = useState('Running test pass 1 of 2...');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 2);
        if (next >= 100) {
          if (pass === 1) {
            setPass(2);
            setStatus('Running test pass 2 of 2...');
            return 0;
          } else {
            clearInterval(timer);
            setIsComplete(true);
            setStatus('Memory diagnostic tool has completed. No memory errors were detected.');
            sound.playNotification();
            return 100;
          }
        }
        return next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [pass, isComplete]);

  return (
    <div className="w-full h-full bg-[#0000AA] text-white font-mono p-6 select-none flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold bg-white text-[#0000AA] inline-block px-2 mb-2">
          Windows Memory Diagnostics Tool
        </h1>
        <p className="mt-2">
          Windows is checking for memory problems...
        </p>
        <p className="mt-2">
          This might take several minutes.
        </p>
      </div>

      <div className="flex-1">
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span>Test mix: Standard</span>
            <span>Pass: {pass} of 2</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Overall test status:</span>
            <span>{Math.floor((pass === 1 ? progress / 2 : 50 + progress / 2))}%</span>
          </div>
          <div className="w-full h-4 border border-white p-[1px]">
            <div 
              className="h-full bg-yellow-400 transition-all duration-200"
              style={{ width: `${pass === 1 ? progress / 2 : 50 + progress / 2}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span>Test pass {pass} status:</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-4 border border-white p-[1px]">
            <div 
              className="h-full bg-yellow-400 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-8">
          <p>Status:</p>
          <p className="mt-2 text-yellow-300">{status}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-white pt-4 text-sm opacity-80">
        <p>Press F1 for Options</p>
        <p>Press ESC to Exit</p>
      </div>
    </div>
  );
}
