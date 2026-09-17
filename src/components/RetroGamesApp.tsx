import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio';

type ViewMode = 'menu' | 'snake' | 'adventure';

// Snake Constants
const SNAKE_GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function RetroGamesApp() {
  const [view, setView] = useState<ViewMode>('menu');

  // Snake States
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Adventure States
  const [advLog, setAdvLog] = useState<string[]>([
    "Karanlık ve rutubetli bir zindanda uyandın.",
    "Karşında ahşap bir kapı ve parlayan bir sandık var.",
    "Ne yapmak istersin? (kapi / sandik / etraf)"
  ]);
  const [advInput, setAdvInput] = useState('');
  const [advState, setAdvState] = useState('start');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [view]);

  // --- SNAKE GAME LOGIC ---
  const spawnFood = useCallback(() => {
    let newFood = {
      x: Math.floor(Math.random() * SNAKE_GRID_SIZE),
      y: Math.floor(Math.random() * SNAKE_GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * SNAKE_GRID_SIZE),
        y: Math.floor(Math.random() * SNAKE_GRID_SIZE),
      };
    }
    setFood(newFood);
  }, [snake]);

  useEffect(() => {
    if (view !== 'snake' || snakeGameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= SNAKE_GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= SNAKE_GRID_SIZE
        ) {
          setSnakeGameOver(true);
          sound.playError();
          return prev;
        }

        // Self Collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setSnakeGameOver(true);
          sound.playError();
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          sound.playClick();
          spawnFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [view, snakeGameOver, direction, food, spawnFood]);

  const handleSnakeKeyDown = (e: React.KeyboardEvent) => {
    if (snakeGameOver) {
      if (e.key === 'Enter') {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setScore(0);
        setSnakeGameOver(false);
        spawnFood();
      } else if (e.key === 'Escape') {
        setView('menu');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
      case 'Escape':
        setView('menu');
        break;
    }
  };

  const renderSnakeGrid = () => {
    const grid = [];
    for (let r = 0; r < SNAKE_GRID_SIZE; r++) {
      for (let c = 0; c < SNAKE_GRID_SIZE; c++) {
        let isSnake = snake.some(s => s.x === c && s.y === r);
        let isFood = food.x === c && food.y === r;
        let isHead = snake[0].x === c && snake[0].y === r;

        let char = '.';
        if (isHead) char = 'O';
        else if (isSnake) char = 'o';
        else if (isFood) char = '*';

        grid.push(
          <span key={`${r}-${c}`} className={isFood ? 'text-red-500' : isSnake ? 'text-green-500' : 'text-slate-700'}>
            {char} 
          </span>
        );
      }
      grid.push(<br key={`br-${r}`} />);
    }
    return grid;
  };


  // --- TEXT ADVENTURE LOGIC ---
  const advEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'adventure') {
      advEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [advLog, view]);

  const handleAdvCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advInput.trim()) return;

    const cmd = advInput.trim().toLowerCase();
    const newLog = [...advLog, `> ${cmd}`];

    if (cmd === 'cikis' || cmd === 'exit') {
      setView('menu');
      setAdvInput('');
      return;
    }

    if (advState === 'start') {
      if (cmd === 'kapi') {
        newLog.push("Kapı kilitli. Kilidin üzerinde üçgen şeklinde bir yuva var.");
      } else if (cmd === 'sandik') {
        newLog.push("Sandığı açtın. İçinde üçgen bir taş ve eski bir not var.", "Üçgen taşı aldın.");
        setAdvState('has_key');
      } else if (cmd === 'etraf') {
        newLog.push("Duvarlarda sönmek üzere olan meşaleler var. Başka bir şey yok.");
      } else {
        newLog.push("Anlamadım. (Seçenekler: kapi / sandik / etraf)");
      }
    } else if (advState === 'has_key') {
      if (cmd === 'kapi') {
        newLog.push("Üçgen taşı kapıdaki yuvaya yerleştirdin.", "Kapı büyük bir gıcırtıyla açıldı!", "Tebrikler! Zindandan kaçtın. [OYUN BİTTİ]");
        setAdvState('won');
      } else if (cmd === 'sandik') {
        newLog.push("Sandık artık boş.");
      } else if (cmd === 'etraf') {
        newLog.push("Kapı bekliyor...");
      } else {
         newLog.push("Anlamadım. (Seçenekler: kapi / sandik / etraf)");
      }
    } else if (advState === 'won') {
      newLog.push("Oyun bitti. Çıkmak için 'exit' veya 'cikis' yazın.");
    }

    setAdvLog(newLog);
    setAdvInput('');
  };


  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-black text-green-400 font-mono text-sm p-4 overflow-hidden outline-none flex flex-col"
      tabIndex={0}
      onKeyDown={view === 'snake' ? handleSnakeKeyDown : undefined}
    >
      {view === 'menu' && (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-500 mb-2">=== TERMINAL ARCADE ===</h1>
            <p className="text-slate-400">Select a retro game to play</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => { setView('snake'); setSnake(INITIAL_SNAKE); setDirection(INITIAL_DIRECTION); setScore(0); setSnakeGameOver(false); spawnFood(); containerRef.current?.focus(); }}
              className="px-6 py-2 border border-green-500 hover:bg-green-900 hover:text-white transition-colors text-left"
            >
              [1] SNAKE.EXE
            </button>
            <button 
              onClick={() => { setView('adventure'); setAdvState('start'); setAdvLog(["Karanlık ve rutubetli bir zindanda uyandın.", "Karşında ahşap bir kapı ve parlayan bir sandık var.", "Ne yapmak istersin? (kapi / sandik / etraf)"]); }}
              className="px-6 py-2 border border-green-500 hover:bg-green-900 hover:text-white transition-colors text-left"
            >
              [2] DUNGEON_ESCAPE.BAT (Text Adventure)
            </button>
          </div>
        </div>
      )}

      {view === 'snake' && (
        <div className="flex flex-col items-center h-full">
          <div className="w-full flex justify-between mb-4 text-green-500 font-bold border-b border-green-800 pb-2">
            <span>SNAKE.EXE</span>
            <span>SCORE: {score.toString().padStart(4, '0')}</span>
            <span>[ESC] to Menu</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-black border-2 border-green-900 p-2 leading-none whitespace-pre select-none">
              {renderSnakeGrid()}
            </div>
          </div>

          {snakeGameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
              <h2 className="text-red-500 text-4xl font-bold mb-4 animate-pulse">GAME OVER</h2>
              <p className="text-green-400 mb-2">FINAL SCORE: {score}</p>
              <p className="text-slate-500">Press [ENTER] to Restart or [ESC] to Menu</p>
            </div>
          )}
        </div>
      )}

      {view === 'adventure' && (
        <div className="flex flex-col h-full w-full">
          <div className="w-full flex justify-between mb-2 text-green-500 font-bold border-b border-green-800 pb-2 shrink-0">
            <span>DUNGEON_ESCAPE.BAT</span>
            <span>Type 'exit' to Menu</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pb-4">
            {advLog.map((log, i) => (
              <div key={i} className={log.startsWith('>') ? 'text-slate-400' : 'text-green-400'}>
                {log}
              </div>
            ))}
            <div ref={advEndRef} />
          </div>

          <form onSubmit={handleAdvCommand} className="shrink-0 flex items-center gap-2 border-t border-green-900 pt-2">
            <span className="text-green-500">&gt;</span>
            <input 
              type="text"
              value={advInput}
              onChange={e => setAdvInput(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-green-400 font-mono"
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  );
}
