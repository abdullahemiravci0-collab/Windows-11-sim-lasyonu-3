import React, { useState, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';

type Cell = {
  row: number;
  col: number;
  isBomb: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborBombs: number;
};

const ROWS = 10;
const COLS = 10;
const BOMBS = 15;

export function MinesweeperApp() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [flagsLeft, setFlagsLeft] = useState<number>(BOMBS);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const initializeGrid = useCallback(() => {
    let newGrid: Cell[][] = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => ({
        row: r,
        col: c,
        isBomb: false,
        isRevealed: false,
        isFlagged: false,
        neighborBombs: 0
      }))
    );

    // Place bombs
    let bombsPlaced = 0;
    while (bombsPlaced < BOMBS) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isBomb) {
        newGrid[r][c].isBomb = true;
        bombsPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isBomb) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isBomb) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborBombs = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setFlagsLeft(BOMBS);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    let timer: number;
    if (startTime && !gameOver && !gameWon) {
      timer = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, gameOver, gameWon]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    sound.playClick();
    const newGrid = [...grid];
    
    if (newGrid[r][c].isBomb) {
      // Game Over
      newGrid[r][c].isRevealed = true;
      setGrid(newGrid);
      setGameOver(true);
      sound.playError();
      return;
    }

    // Flood fill algorithm for empty cells
    const stack = [{ r, c }];
    while (stack.length > 0) {
      const { r: currR, c: currC } = stack.pop()!;
      if (!newGrid[currR][currC].isRevealed && !newGrid[currR][currC].isFlagged) {
        newGrid[currR][currC].isRevealed = true;
        if (newGrid[currR][currC].neighborBombs === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = currR + dr;
              const nc = currC + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                stack.push({ r: nr, c: nc });
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);
    checkWinCondition(newGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[r][c].isRevealed) return;

    sound.playClick();
    const newGrid = [...grid];
    if (newGrid[r][c].isFlagged) {
      newGrid[r][c].isFlagged = false;
      setFlagsLeft(prev => prev + 1);
    } else if (flagsLeft > 0) {
      newGrid[r][c].isFlagged = true;
      setFlagsLeft(prev => prev - 1);
    }
    setGrid(newGrid);
  };

  const checkWinCondition = (currentGrid: Cell[][]) => {
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (currentGrid[r][c].isRevealed) revealedCount++;
      }
    }
    if (revealedCount === ROWS * COLS - BOMBS) {
      setGameWon(true);
      sound.playDrop(); // Simple win sound placeholder
    }
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-blue-500';
      case 2: return 'text-green-600';
      case 3: return 'text-red-500';
      case 4: return 'text-purple-600';
      case 5: return 'text-red-800';
      case 6: return 'text-teal-600';
      case 7: return 'text-black';
      case 8: return 'text-gray-600';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full bg-slate-200 flex flex-col font-sans select-none overflow-hidden">
      <div className="bg-slate-300 p-2 border-b-2 border-white shadow-sm flex items-center justify-between text-slate-800 font-bold px-4">
        <div className="bg-slate-800 text-red-500 font-mono text-xl px-2 py-1 rounded shadow-inner w-16 text-center border-2 border-slate-600">
          {flagsLeft.toString().padStart(3, '0')}
        </div>
        
        <button 
          onClick={initializeGrid}
          className="w-10 h-10 bg-slate-200 border-2 border-t-white border-l-white border-b-slate-500 border-r-slate-500 flex items-center justify-center active:border-t-slate-500 active:border-l-slate-500 active:border-b-white active:border-r-white cursor-pointer transition-all"
        >
          {gameOver ? (
            <i className="fa-solid fa-face-dizzy text-xl text-yellow-500 drop-shadow"></i>
          ) : gameWon ? (
            <i className="fa-solid fa-face-sunglasses text-xl text-yellow-500 drop-shadow"></i>
          ) : (
            <i className="fa-solid fa-face-smile text-xl text-yellow-500 drop-shadow"></i>
          )}
        </button>

        <div className="bg-slate-800 text-red-500 font-mono text-xl px-2 py-1 rounded shadow-inner w-16 text-center border-2 border-slate-600">
          {elapsedTime.toString().padStart(3, '0')}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-200 p-4">
        <div className="bg-slate-400 p-1 border-t-slate-500 border-l-slate-500 border-b-white border-r-white border-4 inline-block">
          <div className="grid gap-[1px] bg-slate-500 border border-slate-600" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {grid.map((row, rIdx) => 
              row.map((cell, cIdx) => (
                <div 
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => revealCell(rIdx, cIdx)}
                  onContextMenu={(e) => toggleFlag(e, rIdx, cIdx)}
                  className={`w-8 h-8 flex items-center justify-center text-lg font-black cursor-pointer transition-colors ${
                    cell.isRevealed 
                      ? cell.isBomb 
                        ? 'bg-red-500' 
                        : 'bg-slate-200 border border-slate-300'
                      : 'bg-slate-300 border-2 border-t-white border-l-white border-b-slate-500 border-r-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isBomb ? (
                      <i className="fa-solid fa-bomb text-slate-900"></i>
                    ) : (
                      cell.neighborBombs > 0 ? (
                        <span className={getNumberColor(cell.neighborBombs)}>
                          {cell.neighborBombs}
                        </span>
                      ) : null
                    )
                  ) : cell.isFlagged ? (
                    <i className="fa-solid fa-flag text-red-600"></i>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {(gameOver || gameWon) && (
        <div className="absolute inset-x-0 bottom-0 py-2 bg-slate-800/80 text-white text-center font-bold text-sm shadow-[0_-4px_10px_rgba(0,0,0,0.2)] backdrop-blur-sm animate-in slide-in-from-bottom">
          {gameWon ? 'Kazandın! 🏆' : 'Mayına Bastın! 💥'} Yüz simgesine tıklayarak tekrar oyna.
        </div>
      )}
    </div>
  );
}
