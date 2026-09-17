import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio';
import { 
  Heart, RefreshCw, Volume2, VolumeX, Music, Shield, Sparkles, 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Swords, Award
} from 'lucide-react';

export type UndertaleCharacterId = 'sans' | 'papyrus' | 'undyne' | 'toriel' | 'flowey' | 'mettaton';

interface CharacterConfig {
  id: UndertaleCharacterId;
  name: string;
  title: string;
  avatar: string;
  maxHp: number;
  initialDialogue: string;
  musicType: 'megalovania' | 'bonetrousle' | 'none';
  atk: number;
  def: number;
  checkText: string;
  color: string;
}

const CHARACTERS: Record<UndertaleCharacterId, CharacterConfig> = {
  sans: {
    id: 'sans',
    name: 'Sans',
    title: 'Yargıç (Orijinal B&W)',
    avatar: '💀',
    maxHp: 20,
    initialDialogue: 'hey apo... dışarıda harika bir gün. kuşlar ötüyor, çiçekler açıyor. senin gibi yöneticiler... KÖTÜ BİR ZAMAN geçirmeli.',
    musicType: 'megalovania',
    atk: 1,
    def: 1,
    checkText: 'SANS 1 ATK 1 DEF. En kolay düşman. Yalnızca 1 hasar verebilir. Ama asla yerinde durmuyor.',
    color: '#00ffff'
  },
  papyrus: {
    id: 'papyrus',
    name: 'Papyrus',
    title: 'Büyük Papyrus',
    avatar: '🦴',
    maxHp: 20,
    initialDialogue: 'NYEH HEH HEH! BEN BÜYÜK PAPYRUS! KRALİYET MUHAFIZI OLMAK İÇİN SENİ YAKALAYACAĞIM VE SPAGETTİMLE KUTLAYACAĞIZ!',
    musicType: 'bonetrousle',
    atk: 20,
    def: 20,
    checkText: 'PAPYRUS 20 ATK 20 DEF. Spagetti yapmayı sever. Kalbi saf ve iyi niyetlidir.',
    color: '#ff9900'
  },
  undyne: {
    id: 'undyne',
    name: 'Undyne',
    title: 'Kraliyet Muhafızları Lideri',
    avatar: '🐟',
    maxHp: 20,
    initialDialogue: 'NGAHHH! TÜM CANAVARLARIN UMUT VE HAYALLERİ BENİMLE! YEŞİL KALKANINI KALDIR VE MIZRAKLARIMI SAVUŞTUR!',
    musicType: 'none',
    atk: 50,
    def: 20,
    checkText: 'UNDYNE 50 ATK 20 DEF. Asla pes etmeyen kararlı bir savaşçı. Mızraklarını 4 yönden kalkanınla engelle!',
    color: '#00e5ff'
  },
  toriel: {
    id: 'toriel',
    name: 'Toriel',
    title: 'Yeraltı Harabelerinin Koruyucusu',
    avatar: '🐐',
    maxHp: 20,
    initialDialogue: 'Korkma apo, çocuğum. Ben Toriel. Seni korumak ve güvenliğini sağlamak için buradayım. Lütfen dikkatli ol.',
    musicType: 'none',
    atk: 80,
    def: 80,
    checkText: 'TORIEL 80 ATK 80 DEF. Harabelerin koruyucusu. Canın azaldığında alevleri senden kaçınır.',
    color: '#d8b4e2'
  },
  flowey: {
    id: 'flowey',
    name: 'Flowey',
    title: 'Çiçek Flowey',
    avatar: '🌻',
    maxHp: 20,
    initialDialogue: 'Selam apo! Ben FLOWEY. Çiçek FLOWEY! Bu dünyada tek bir kural vardır: ÖLDÜR YA DA ÖLDÜRÜL!',
    musicType: 'none',
    atk: 19,
    def: 0,
    checkText: 'FLOWEY 19 ATK 0 DEF. Masum görünür ama "dostluk tanecikleri" ölümcüldür!',
    color: '#ffd700'
  },
  mettaton: {
    id: 'mettaton',
    name: 'Mettaton EX',
    title: 'Yeraltının Popstar Robotu',
    avatar: '🤖',
    maxHp: 20,
    initialDialogue: 'OHHH YESSS! Kameralar bana dönsün! Reytingleri 10,000\'e çıkar ve yeraltının en görkemli şovuna tanık ol apo!',
    musicType: 'none',
    atk: 47,
    def: 47,
    checkText: 'METTATON EX 47 ATK 47 DEF. Gösteri yıldızı. Poz vererek ve saldırılardan kaçarak reyting topla!',
    color: '#ff2a85'
  }
};

interface Projectile {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dir: 'left' | 'right' | 'up' | 'down';
  type: 'bone' | 'blue-bone' | 'spear' | 'fire' | 'pellet' | 'disco';
  spearDir?: 'from-left' | 'from-right' | 'from-top' | 'from-bottom';
}

interface BlasterAttack {
  id: number;
  beamY: number;
  beamHeight: number;
  chargeTime: number;
  firingTime: number;
}

export const UndertaleApp: React.FC = () => {
  const [character, setCharacter] = useState<UndertaleCharacterId>('sans');
  const [mode, setMode] = useState<'battle' | 'scratch'>('battle');
  const [hp, setHp] = useState(20);
  const maxHp = 20;
  const [isGameOver, setIsGameOver] = useState(false);
  const [battleMessage, setBattleMessage] = useState<string>('apo kendini KARARLILIKLA dolu hissediyor.');
  const [dialogue, setDialogue] = useState<string>(CHARACTERS.sans.initialDialogue);
  const [activeMenu, setActiveMenu] = useState<'main' | 'act' | 'item'>('main');

  // Music state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Character specific state
  const [sansEyeGlow, setSansEyeGlow] = useState(true);
  const [isDodging, setIsDodging] = useState(false);
  const [showMiss, setShowMiss] = useState(false);
  const [isSlashing, setIsSlashing] = useState(false);
  const [floweyEvil, setFloweyEvil] = useState(false);
  const [ratings, setRatings] = useState(4200);

  // Soul / Heart & Shield State
  const [soulMode, setSoulMode] = useState<'red' | 'blue' | 'green'>('red');
  const [shieldDir, setShieldDir] = useState<'up' | 'down' | 'left' | 'right'>('up');

  // Canvas and Physics
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heartPos = useRef({ x: 160, y: 125 });
  const heartVelocity = useRef({ vx: 0, vy: 0 });
  const isGrounded = useRef(false);
  const keysDown = useRef<Record<string, boolean>>({});
  const isPointerDown = useRef(false);
  const projectiles = useRef<Projectile[]>([]);
  const blasters = useRef<BlasterAttack[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const tickCount = useRef(0);

  const activeChar = CHARACTERS[character];

  // Stop music on unmount
  useEffect(() => {
    return () => {
      sound.stopAllUndertaleMusic();
    };
  }, []);

  // Handle Character Switch
  const switchCharacter = (charId: UndertaleCharacterId) => {
    sound.stopAllUndertaleMusic();
    setIsPlayingMusic(false);
    setCharacter(charId);
    setDialogue(CHARACTERS[charId].initialDialogue);
    setBattleMessage(`* ${CHARACTERS[charId].name} sahneye çıktı!`);
    projectiles.current = [];
    blasters.current = [];
    heartPos.current = { x: 160, y: 125 };
    setHp(20);
    setIsGameOver(false);

    // Set soul mode per character
    if (charId === 'undyne') {
      setSoulMode('green');
      setShieldDir('up');
    } else if (charId === 'papyrus') {
      setSoulMode('blue');
    } else {
      setSoulMode('red');
    }

    // Voice sound
    if (charId === 'sans') sound.playSansVoice();
    else if (charId === 'papyrus') sound.playPapyrusVoice();
    else sound.playClick();
  };

  // Music Toggle
  const toggleMusic = () => {
    if (isPlayingMusic) {
      sound.stopAllUndertaleMusic();
      setIsPlayingMusic(false);
    } else {
      if (character === 'papyrus') {
        sound.startBonetrousle();
      } else {
        sound.startMegalovania();
      }
      setIsPlayingMusic(true);
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (mode !== 'battle') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
      }

      keysDown.current[e.key.toLowerCase()] = true;
      keysDown.current[e.code] = true;

      // Green Soul Shield controls for Undyne
      if (soulMode === 'green') {
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') setShieldDir('up');
        if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') setShieldDir('down');
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') setShieldDir('left');
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') setShieldDir('right');
        sound.playClick();
        return;
      }

      // Blue Soul Jump
      if (soulMode === 'blue' && (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w' || e.code === 'Space') && isGrounded.current) {
        heartVelocity.current.vy = -340;
        isGrounded.current = false;
        sound.playClick();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = false;
      keysDown.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode, soulMode]);

  // Main Battle Loop
  useEffect(() => {
    if (mode !== 'battle') return;

    const box = { x: 20, y: 15, w: 280, h: 190 };
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;
      tickCount.current++;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Clear Screen
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Battle Box (Undertale white border)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(box.x, box.y, box.w, box.h);

      // 3. Movement Physics
      const speed = 190 * dt;
      let isMoving = false;

      if (soulMode === 'red') {
        if (keysDown.current['arrowleft'] || keysDown.current['a'] || keysDown.current['keya']) {
          heartPos.current.x = Math.max(box.x + 10, heartPos.current.x - speed);
          isMoving = true;
        }
        if (keysDown.current['arrowright'] || keysDown.current['d'] || keysDown.current['keyd']) {
          heartPos.current.x = Math.min(box.x + box.w - 10, heartPos.current.x + speed);
          isMoving = true;
        }
        if (keysDown.current['arrowup'] || keysDown.current['w'] || keysDown.current['keyw']) {
          heartPos.current.y = Math.max(box.y + 10, heartPos.current.y - speed);
          isMoving = true;
        }
        if (keysDown.current['arrowdown'] || keysDown.current['s'] || keysDown.current['keys']) {
          heartPos.current.y = Math.min(box.y + box.h - 10, heartPos.current.y + speed);
          isMoving = true;
        }
      } else if (soulMode === 'blue') {
        if (keysDown.current['arrowleft'] || keysDown.current['a'] || keysDown.current['keya']) {
          heartPos.current.x = Math.max(box.x + 10, heartPos.current.x - speed);
          isMoving = true;
        }
        if (keysDown.current['arrowright'] || keysDown.current['d'] || keysDown.current['keyd']) {
          heartPos.current.x = Math.min(box.x + box.w - 10, heartPos.current.x + speed);
          isMoving = true;
        }

        const gravity = 800 * dt;
        heartVelocity.current.vy += gravity;
        heartPos.current.y += heartVelocity.current.vy * dt;

        const floorY = box.y + box.h - 10;
        if (heartPos.current.y >= floorY) {
          heartPos.current.y = floorY;
          heartVelocity.current.vy = 0;
          isGrounded.current = true;
        } else {
          isGrounded.current = false;
        }
        if (heartPos.current.y <= box.y + 10) {
          heartPos.current.y = box.y + 10;
          heartVelocity.current.vy = 0;
        }
      } else if (soulMode === 'green') {
        // Undyne Green Soul is locked in center of box
        heartPos.current.x = box.x + box.w / 2;
        heartPos.current.y = box.y + box.h / 2;
      }

      // 4. Character-Specific Attack Spawners
      if (tickCount.current % 35 === 0 && !isGameOver) {
        const id = Date.now() + Math.random();

        if (character === 'sans') {
          // Sans attacks: Gaster Blaster & Bones
          if (Math.random() < 0.25) {
            // Spawn Gaster Blaster
            blasters.current.push({
              id,
              beamY: box.y + 20 + Math.random() * (box.h - 60),
              beamHeight: 34,
              chargeTime: 36,
              firingTime: 22
            });
          } else {
            const isBlue = Math.random() < 0.3;
            projectiles.current.push({
              id,
              x: box.x + box.w + 10,
              y: box.y + 15 + Math.random() * (box.h - 35),
              width: 28 + Math.random() * 25,
              height: 8,
              speed: 2.6 + Math.random() * 2.0,
              dir: 'left',
              type: isBlue ? 'blue-bone' : 'bone'
            });
          }
        } else if (character === 'papyrus') {
          // Papyrus: Hurdles of jumping bones on the floor
          projectiles.current.push({
            id,
            x: box.x + box.w + 10,
            y: box.y + box.h - 32,
            width: 10,
            height: 32,
            speed: 2.8 + Math.random() * 1.6,
            dir: 'left',
            type: 'bone'
          });
        } else if (character === 'undyne') {
          // Undyne: Spears flying toward the center from 4 directions
          const dirs: ('from-left' | 'from-right' | 'from-top' | 'from-bottom')[] = ['from-left', 'from-right', 'from-top', 'from-bottom'];
          const spearDir = dirs[Math.floor(Math.random() * dirs.length)];
          let sx = box.x + box.w / 2;
          let sy = box.y + box.h / 2;
          let pdir: 'left' | 'right' | 'up' | 'down' = 'left';

          if (spearDir === 'from-left') {
            sx = box.x - 20;
            pdir = 'right';
          } else if (spearDir === 'from-right') {
            sx = box.x + box.w + 20;
            pdir = 'left';
          } else if (spearDir === 'from-top') {
            sy = box.y - 20;
            pdir = 'down';
          } else {
            sy = box.y + box.h + 20;
            pdir = 'up';
          }

          projectiles.current.push({
            id,
            x: sx,
            y: sy,
            width: pdir === 'left' || pdir === 'right' ? 24 : 6,
            height: pdir === 'left' || pdir === 'right' ? 6 : 24,
            speed: 2.6 + Math.random() * 1.5,
            dir: pdir,
            type: 'spear',
            spearDir
          });
        } else if (character === 'toriel') {
          // Toriel: Fireballs swirling down
          projectiles.current.push({
            id,
            x: box.x + 20 + Math.random() * (box.w - 40),
            y: box.y - 15,
            width: 14,
            height: 14,
            speed: 1.8 + Math.random() * 1.4,
            dir: 'down',
            type: 'fire'
          });
        } else if (character === 'flowey') {
          // Flowey: Friendliness pellets
          projectiles.current.push({
            id,
            x: box.x + box.w + 10,
            y: box.y + 15 + Math.random() * (box.h - 30),
            width: 10,
            height: 10,
            speed: 3.2,
            dir: 'left',
            type: 'pellet'
          });
        } else if (character === 'mettaton') {
          // Mettaton: Disco spark attacks
          projectiles.current.push({
            id,
            x: box.x + 15 + Math.random() * (box.w - 30),
            y: box.y - 15,
            width: 12,
            height: 12,
            speed: 2.2 + Math.random() * 1.8,
            dir: 'down',
            type: 'disco'
          });
          setRatings(r => Math.min(10000, r + 25));
        }
      }

      // 5. Update & Draw Projectiles
      const hx = heartPos.current.x;
      const hy = heartPos.current.y;

      for (let i = projectiles.current.length - 1; i >= 0; i--) {
        const p = projectiles.current[i];

        // Movement
        if (p.dir === 'left') p.x -= p.speed;
        if (p.dir === 'right') p.x += p.speed;
        if (p.dir === 'up') p.y -= p.speed;
        if (p.dir === 'down') {
          // Toriel Easter Egg: Fireballs curve away from heart when HP is low!
          if (p.type === 'fire' && hp <= 2 && Math.abs(p.x - hx) < 25) {
            p.x += p.x < hx ? -3 : 3;
          }
          p.y += p.speed;
        }

        // Undyne Green Shield Block Check
        if (soulMode === 'green' && p.type === 'spear' && p.spearDir) {
          const distToHeart = Math.hypot(p.x - hx, p.y - hy);
          if (distToHeart < 28) {
            // Check if shield matches direction of incoming spear
            const blocked = 
              (p.spearDir === 'from-left' && shieldDir === 'left') ||
              (p.spearDir === 'from-right' && shieldDir === 'right') ||
              (p.spearDir === 'from-top' && shieldDir === 'up') ||
              (p.spearDir === 'from-bottom' && shieldDir === 'down');

            if (blocked) {
              sound.playShieldBlock();
              projectiles.current.splice(i, 1);
              continue;
            }
          }
        }

        // Standard Collision Check
        const isTouching = (
          hx + 6 > p.x &&
          hx - 6 < p.x + p.width &&
          hy + 6 > p.y &&
          hy - 6 < p.y + p.height
        );

        // Blue bone safety rule
        const hurts = isTouching && (p.type !== 'blue-bone' || isMoving);

        if (hurts) {
          sound.playHeartHurt();
          setHp(prev => {
            const next = Math.max(0, prev - 1);
            if (next === 0) setIsGameOver(true);
            return next;
          });
          projectiles.current.splice(i, 1);
          continue;
        }

        // Draw projectile based on type
        if (p.type === 'bone' || p.type === 'blue-bone') {
          ctx.fillStyle = p.type === 'blue-bone' ? '#00bfff' : '#ffffff';
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.beginPath();
          ctx.arc(p.x + p.width / 2, p.y, p.width / 2, 0, Math.PI * 2);
          ctx.arc(p.x + p.width / 2, p.y + p.height, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'spear') {
          ctx.fillStyle = '#00ffff';
          ctx.fillRect(p.x, p.y, p.width, p.height);
        } else if (p.type === 'fire') {
          ctx.fillStyle = '#ff6600';
          ctx.beginPath();
          ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffcc00';
          ctx.beginPath();
          ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'pellet') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'disco') {
          ctx.fillStyle = '#ff2a85';
          ctx.fillRect(p.x, p.y, p.width, p.height);
        }

        // Cull off-screen
        if (p.x < box.x - 30 || p.x > box.x + box.w + 30 || p.y < box.y - 30 || p.y > box.y + box.h + 30) {
          projectiles.current.splice(i, 1);
        }
      }

      // 6. Gaster Blasters (Sans)
      for (let i = blasters.current.length - 1; i >= 0; i--) {
        const gb = blasters.current[i];
        if (gb.chargeTime > 0) {
          gb.chargeTime--;
          // Draw Blaster Skull Charge
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(box.x + 12, gb.beamY + gb.beamHeight / 2, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#00ffff';
          ctx.fillRect(box.x + 10, gb.beamY + gb.beamHeight / 2 - 3, 4, 4);

          ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(box.x, gb.beamY + gb.beamHeight / 2);
          ctx.lineTo(box.x + box.w, gb.beamY + gb.beamHeight / 2);
          ctx.stroke();

          if (gb.chargeTime === 1) sound.playGasterBlaster();
        } else if (gb.firingTime > 0) {
          gb.firingTime--;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillRect(box.x, gb.beamY, box.w, gb.beamHeight);
          ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
          ctx.fillRect(box.x, gb.beamY - 4, box.w, gb.beamHeight + 8);

          if (hy + 4 >= gb.beamY && hy - 4 <= gb.beamY + gb.beamHeight) {
            sound.playHeartHurt();
            setHp(prev => {
              const next = Math.max(0, prev - 1);
              if (next === 0) setIsGameOver(true);
              return next;
            });
          }
        } else {
          blasters.current.splice(i, 1);
        }
      }

      // 7. Draw Undyne Green Shield
      if (soulMode === 'green') {
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 4;
        const shieldDist = 20;
        ctx.beginPath();
        if (shieldDir === 'up') {
          ctx.moveTo(hx - 14, hy - shieldDist);
          ctx.lineTo(hx + 14, hy - shieldDist);
        } else if (shieldDir === 'down') {
          ctx.moveTo(hx - 14, hy + shieldDist);
          ctx.lineTo(hx + 14, hy + shieldDist);
        } else if (shieldDir === 'left') {
          ctx.moveTo(hx - shieldDist, hy - 14);
          ctx.lineTo(hx - shieldDist, hy + 14);
        } else if (shieldDir === 'right') {
          ctx.moveTo(hx + shieldDist, hy - 14);
          ctx.lineTo(hx + shieldDist, hy + 14);
        }
        ctx.stroke();
      }

      // 8. Draw Soul / Heart (Red, Blue, or Green)
      ctx.fillStyle = soulMode === 'red' ? '#ff0000' : soulMode === 'blue' ? '#0099ff' : '#00ff66';
      ctx.beginPath();
      ctx.moveTo(hx, hy + 6);
      ctx.bezierCurveTo(hx, hy + 3, hx - 7, hy - 4, hx - 7, hy - 4);
      ctx.bezierCurveTo(hx - 10, hy - 8, hx - 4, hy - 11, hx, hy - 7);
      ctx.bezierCurveTo(hx + 4, hy - 11, hx + 10, hy - 8, hx + 7, hy - 4);
      ctx.bezierCurveTo(hx + 7, hy - 4, hx, hy + 3, hx, hy + 6);
      ctx.fill();

      if (!isGameOver) {
        animationFrameId.current = requestAnimationFrame(loop);
      }
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [mode, isGameOver, soulMode, shieldDir, character, hp]);

  // Pointer drag to move heart
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current || isGameOver || soulMode === 'green') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const box = { x: 20, y: 15, w: 280, h: 190 };
    heartPos.current.x = Math.max(box.x + 8, Math.min(box.x + box.w - 8, mouseX));
    if (soulMode === 'red') {
      heartPos.current.y = Math.max(box.y + 8, Math.min(box.y + box.h - 8, mouseY));
    }
  };

  // Virtual buttons handler
  const handleDirectionBtn = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (soulMode === 'green') {
      setShieldDir(dir);
      sound.playClick();
      return;
    }

    const box = { x: 20, y: 15, w: 280, h: 190 };
    const step = 24;
    if (dir === 'left') heartPos.current.x = Math.max(box.x + 8, heartPos.current.x - step);
    if (dir === 'right') heartPos.current.x = Math.min(box.x + box.w - 8, heartPos.current.x + step);

    if (soulMode === 'red') {
      if (dir === 'up') heartPos.current.y = Math.max(box.y + 8, heartPos.current.y - step);
      if (dir === 'down') heartPos.current.y = Math.min(box.y + box.h - 8, heartPos.current.y + step);
    } else if (soulMode === 'blue') {
      if (dir === 'up' && isGrounded.current) {
        heartVelocity.current.vy = -340;
        isGrounded.current = false;
        sound.playClick();
      }
    }
  };

  // FIGHT button handler
  const handleFight = () => {
    setIsSlashing(true);
    sound.playSlash();

    if (character === 'sans') {
      // Sans always DODGES in original game!
      setTimeout(() => {
        setIsDodging(true);
        setShowMiss(true);
        sound.playClick();
        sound.playSansVoice();
        setDialogue('* ne sandın, öylece durup vurmama izin mi verecektim? heh heh.');
        setBattleMessage('* apo Sans\'a vurdu ama Sans yana kayarak sıyrıldı!');

        setTimeout(() => {
          setIsSlashing(false);
          setTimeout(() => {
            setIsDodging(false);
            setShowMiss(false);
          }, 1200);
        }, 600);
      }, 300);
    } else if (character === 'flowey') {
      setFloweyEvil(true);
      setTimeout(() => {
        setIsSlashing(false);
        setBattleMessage('* Flowey şeytani bir kahkaha attı: "Beni incitemezsin apo!"');
        setDialogue('* HEHEHEHEHE! Sen gerçekten çok safsın apo!');
      }, 500);
    } else {
      setTimeout(() => {
        setIsSlashing(false);
        setBattleMessage(`* apo ${activeChar.name}'a cesurca saldırdı!`);
        if (character === 'papyrus') {
          sound.playPapyrusVoice();
          setDialogue('* VAY CANINA! BU GERÇEKTEN SERT BİR HAMLEYDİ! AMA BÜYÜK PAPYRUS PES ETMEZ!');
        } else if (character === 'undyne') {
          setDialogue('* GÜCÜN BU KADAR MI APO?! HERKESİN UMUDU İÇİN AYAKTAYIM!');
        } else if (character === 'toriel') {
          setDialogue('* Lütfen çocuğum, dövüşmeyi bırak... incinmeni istemiyorum.');
        } else if (character === 'mettaton') {
          setRatings(r => Math.min(10000, r + 450));
          setDialogue('* VURGUN GİBİ BİR HAMLE! REYTİNGLER TAVAN YAPIYOR DARLING!');
        }
      }, 400);
    }
    setActiveMenu('main');
  };

  // ACT options
  const handleActOption = (type: 'check' | 'special') => {
    sound.playClick();
    if (type === 'check') {
      setBattleMessage(`* ${activeChar.checkText}`);
      setDialogue(`* ${activeChar.checkText}`);
    } else {
      if (character === 'sans') {
        sound.playSansVoice();
        setDialogue('* iskeletler neden kaza yapmaz? çünkü kemiklerinde fren var! heh heh.');
        setBattleMessage('* apo Sans ile kemik esprisi yaptı.');
      } else if (character === 'papyrus') {
        sound.playPapyrusVoice();
        setDialogue('* SPAGETTİ TARİFİME HAYRAN KALACAKSIN! HEMEN BİR TABAK HAZIRLIYORUM!');
        setBattleMessage('* apo Papyrus\'un harika spagetti aşçılığını övdü.');
      } else if (character === 'undyne') {
        setDialogue('* HEY, BANA SAVAŞ SIRASINDA ARKADAŞLIK MI TEKLİF EDİYORSUN?! NGAHHH!');
        setBattleMessage('* apo Undyne ile dostluk kurmaya çalıştı.');
      } else if (character === 'toriel') {
        setDialogue('* Tatlı çocuğum... sana sarılmak iyi gelecektir.');
        setBattleMessage('* apo Toriel\'a sıcacık sarıldı.');
      } else if (character === 'flowey') {
        setDialogue('* Bana dostluk numarası yapma apo! Burada sadece güç konuşur!');
        setBattleMessage('* apo Flowey\'e dostça baktı.');
      } else if (character === 'mettaton') {
        setRatings(r => Math.min(10000, r + 700));
        setDialogue('* MUHTEŞEM BİR POZ! İŞTE BEN BUNA GERÇEK ŞOV DERİM DARLING!');
        setBattleMessage('* apo kameralara karşı havalı bir poz verdi! +700 Reyting!');
      }
    }
    setActiveMenu('main');
  };

  // ITEM options
  const handleItemOption = (type: 'pie' | 'hero' | 'spaghetti') => {
    sound.playClick();
    if (type === 'pie') {
      setHp(20);
      setBattleMessage('* apo Karamel-Tarçınlı Turta yedi! HP 20/20 tamamen doldu.');
      setDialogue('* Turta kokusu tüm odayı taze bir umutla doldurdu.');
    } else if (type === 'hero') {
      setHp(prev => Math.min(20, prev + 15));
      setBattleMessage('* apo Efsanevi Kahraman yedi! +15 HP kazandı.');
    } else {
      setHp(prev => Math.min(20, prev + 12));
      setBattleMessage('* apo Papyrus\'un pişirdiği sıcak spagettiyi yedi! +12 HP.');
    }
    setActiveMenu('main');
  };

  // MERCY
  const handleMercy = () => {
    sound.playClick();
    setBattleMessage(`* apo ${activeChar.name}'ı bağışladı. Barış ortamı sağlandı.`);
    if (character === 'sans') {
      sound.playSansVoice();
      setDialogue('* beni gerçekten bağışlamak mı istiyorsun? heh... fena bir yönetici değilsin apo.');
    } else if (character === 'papyrus') {
      sound.playPapyrusVoice();
      setDialogue('* BİLİYORDUM! BİZ EN İYİ ARKADAŞLAR OLACAĞIZ APO! SENİ BAĞIŞLIYORUM!');
    } else if (character === 'toriel') {
      setDialogue('* Teşekkür ederim tatlı çocuğum... artık güvendesin.');
    } else if (character === 'undyne') {
      setDialogue('* ...tamam apo. Belki de insanların hepsi kötü değildir.');
    } else if (character === 'mettaton') {
      setDialogue('* ŞOVUMUZ REKORLAR KIRDI! ŞİMDİLİK HOŞÇA KALIN SEVGİLİ İZLEYİCİLER!');
    } else {
      setDialogue('* Beni bağışlamak mı?! Hahaha, göreceğiz apo...');
    }
    setActiveMenu('main');
  };

  const restartGame = () => {
    setHp(20);
    setIsGameOver(false);
    projectiles.current = [];
    blasters.current = [];
    heartPos.current = { x: 160, y: 125 };
    setDialogue(activeChar.initialDialogue);
    setBattleMessage('* apo pes etmedi. KARARLILIK yeniden alevlendi!');
  };

  return (
    <div className="flex flex-col h-full bg-black text-white select-none font-mono">
      {/* HEADER: CHARACTER SELECTOR & MUSIC */}
      <div className="bg-slate-950 px-3 py-2 border-b border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Character Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {(Object.keys(CHARACTERS) as UndertaleCharacterId[]).map((cid) => {
            const c = CHARACTERS[cid];
            const isSelected = character === cid;
            return (
              <button
                key={cid}
                onClick={() => switchCharacter(cid)}
                className={`px-2 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                  isSelected
                    ? 'bg-white text-black ring-1 ring-yellow-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
                title={c.title}
              >
                <span>{c.avatar}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Music & Scratch Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
              isPlayingMusic
                ? 'bg-cyan-600 text-white animate-pulse shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="8-Bit Undertale Tema Müziği"
          >
            <Music className="w-3 h-3" />
            <span>{character === 'papyrus' ? 'Bonetrousle' : 'Megalovania'}: {isPlayingMusic ? 'Açık' : 'Kapalı'}</span>
          </button>

          <button
            onClick={() => setMode(mode === 'battle' ? 'scratch' : 'battle')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold transition"
          >
            {mode === 'battle' ? 'Scratch Modu' : 'Savaşa Dön'}
          </button>
        </div>
      </div>

      {mode === 'scratch' ? (
        <div className="flex-1 w-full h-full bg-black p-2">
          <iframe 
            src="https://scratch.mit.edu/projects/389332304/embed" 
            className="w-full h-full border-none rounded"
            allowFullScreen
            title="Undertale Scratch Embed"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-between p-3 overflow-y-auto max-w-2xl mx-auto w-full">
          
          {/* CHARACTER DISPLAY & DIALOGUE AREA */}
          <div className="w-full flex items-center justify-center gap-4 relative min-h-[150px]">
            
            {/* 1. SANS: ORIGINAL TOBY FOX MONOCHROME PIXEL SPRITE */}
            {character === 'sans' && (
              <div 
                className={`relative flex flex-col items-center cursor-pointer transition-transform duration-300 ${
                  isDodging ? 'translate-x-28 opacity-85' : 'hover:scale-105'
                }`}
                onClick={() => {
                  setSansEyeGlow(!sansEyeGlow);
                  sound.playSansVoice();
                  setDialogue('* sol gözümdeki mavi alev mi? o kötü zamanın habercisi apo.');
                }}
                title="Sans (Orijinal B&W) - Tıklayarak etkileşime geçebilirsiniz"
              >
                {/* Slash & Miss animation */}
                {isSlashing && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-1 bg-red-500 rotate-45 transform scale-150 animate-ping shadow-[0_0_12px_#ff0000]" />
                  </div>
                )}
                {showMiss && (
                  <div className="absolute -top-7 text-slate-400 font-bold text-base tracking-widest animate-bounce z-30 drop-shadow">
                    MISS
                  </div>
                )}

                {/* SANS ORIGINAL MONOCHROME HEAD */}
                <div className="relative w-16 h-13 bg-white rounded-t-full rounded-b-xl border-2 border-black flex flex-col items-center shadow-md animate-bounce duration-1000">
                  {/* Eye Sockets */}
                  <div className="flex justify-between w-10 mt-2 px-1">
                    {/* Left Eye: Iconic Bad Time Flashing Eye */}
                    <div className="w-3 h-4 bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                      {sansEyeGlow && (
                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping shadow-[0_0_8px_#00ffff]" />
                      )}
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        sansEyeGlow ? 'bg-cyan-300 ring-2 ring-cyan-500' : 'bg-white'
                      }`} />
                    </div>
                    {/* Right Eye: White pupil in black hollow */}
                    <div className="w-3 h-4 bg-black rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Triangular nose cavity */}
                  <div className="w-1.5 h-1.5 bg-black clip-path-polygon mt-0.5" />

                  {/* Original 8-tooth skeleton smile */}
                  <div className="w-9 h-2.5 border-b-2 border-black flex items-center justify-evenly mt-0.5 px-0.5">
                    <div className="w-0.5 h-2 bg-black" />
                    <div className="w-0.5 h-2 bg-black" />
                    <div className="w-0.5 h-2 bg-black" />
                    <div className="w-0.5 h-2 bg-black" />
                  </div>
                </div>

                {/* SANS ORIGINAL BLACK & WHITE HOODIE TORSO */}
                <div className="relative w-20 h-10 bg-black rounded-t-lg border-2 border-white flex flex-col items-center -mt-1">
                  {/* White Fluffy Collar */}
                  <div className="w-16 h-2.5 bg-white rounded-full border border-black -mt-1" />
                  {/* White T-shirt center seam */}
                  <div className="w-3 h-full bg-white" />
                  {/* Pockets where hands are tucked */}
                  <div className="absolute left-1 bottom-1 w-3 h-4 bg-black border border-white/40 rounded" />
                  <div className="absolute right-1 bottom-1 w-3 h-4 bg-black border border-white/40 rounded" />
                </div>

                {/* SANS SHORTS & SLIPPERS */}
                <div className="flex flex-col items-center -mt-0.5">
                  <div className="w-14 h-5 bg-black border-x-2 border-b-2 border-white rounded-b flex justify-between px-1.5">
                    <div className="w-1 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                  </div>
                  <div className="flex justify-between w-12 -mt-0.5 px-1">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-1.5 bg-white border-x border-black" />
                      <div className="w-5 h-2.5 bg-white rounded-full border border-black" title="Slippers" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-1.5 bg-white border-x border-black" />
                      <div className="w-5 h-2.5 bg-white rounded-full border border-black" title="Slippers" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PAPYRUS: THE GREAT PAPYRUS SPRITE */}
            {character === 'papyrus' && (
              <div className="flex flex-col items-center animate-pulse duration-700">
                {/* Triangular Grinning Head */}
                <div className="w-12 h-14 bg-white border-2 border-black rounded-t-full rounded-b-md flex flex-col items-center relative">
                  <div className="flex justify-between w-8 mt-2 px-0.5">
                    <div className="w-2.5 h-3 bg-black rounded-full" />
                    <div className="w-2.5 h-3 bg-black rounded-full" />
                  </div>
                  {/* Big triangular grin */}
                  <div className="w-8 h-4 border-2 border-black rounded-b-full mt-1 flex justify-evenly">
                    <div className="w-0.5 h-full bg-black" />
                    <div className="w-0.5 h-full bg-black" />
                  </div>
                </div>
                {/* Flowing Red Scarf / Cape */}
                <div className="w-18 h-4 bg-red-600 rounded-full -mt-1 border border-black shadow" />
                {/* Battle Body Torso */}
                <div className="w-14 h-11 bg-white border-2 border-black rounded flex flex-col items-center relative">
                  <div className="w-10 h-4 bg-black rounded-t-full mt-1" />
                  {/* Red Gloves on sides */}
                  <div className="absolute -left-3 top-1 w-3 h-6 bg-red-600 rounded border border-black" />
                  <div className="absolute -right-3 top-1 w-3 h-6 bg-red-600 rounded border border-black" />
                </div>
                {/* Blue Underwear & Tall Red Boots */}
                <div className="w-10 h-3 bg-blue-600 border border-black" />
                <div className="flex justify-between w-10 px-0.5">
                  <div className="w-4 h-6 bg-red-600 rounded-b border border-black" />
                  <div className="w-4 h-6 bg-red-600 rounded-b border border-black" />
                </div>
              </div>
            )}

            {/* 3. UNDYNE: THE ROYAL GUARD CAPTAIN SPRITE */}
            {character === 'undyne' && (
              <div className="flex flex-col items-center">
                {/* Head with red ponytail & eyepatch */}
                <div className="relative w-14 h-12 bg-cyan-400 border-2 border-black rounded-full flex flex-col items-center">
                  {/* Eye patch on left with beam */}
                  <div className="absolute left-2 top-3 w-3 h-3 bg-black rounded-full border border-white">
                    <div className="w-1.5 h-1.5 bg-cyan-200 rounded-full animate-ping" />
                  </div>
                  {/* Fierce right eye */}
                  <div className="absolute right-2 top-3 w-3 h-3 bg-yellow-400 rounded-full border border-black flex items-center justify-center">
                    <div className="w-1 h-2 bg-black" />
                  </div>
                  {/* Sharp teeth grin */}
                  <div className="w-8 h-2 bg-white border border-black mt-6 rounded flex justify-evenly">
                    <div className="w-0.5 h-full bg-black" />
                    <div className="w-0.5 h-full bg-black" />
                  </div>
                  {/* Red flowing ponytail */}
                  <div className="absolute -right-5 -top-2 w-8 h-10 bg-red-600 rounded-full -rotate-12 border border-black" />
                </div>
                {/* Silver Knight Armor with Pauldrons */}
                <div className="relative w-18 h-12 bg-slate-400 border-2 border-black rounded-t-lg flex justify-between px-1">
                  <div className="w-4 h-6 bg-slate-500 rounded-full border border-black" />
                  <div className="w-6 h-full bg-slate-300 border-x border-black" />
                  <div className="w-4 h-6 bg-slate-500 rounded-full border border-black" />
                </div>
                {/* Glowing Cyan Spear */}
                <div className="w-1 h-14 bg-cyan-300 absolute -left-4 top-2 rotate-12 shadow-[0_0_8px_#00ffff]" />
              </div>
            )}

            {/* 4. TORIEL: GOAT MOTHER SPRITE */}
            {character === 'toriel' && (
              <div className="flex flex-col items-center">
                {/* White goat head with drooping ears & horns */}
                <div className="relative w-16 h-14 bg-white border-2 border-black rounded-full flex flex-col items-center">
                  {/* Two small horns */}
                  <div className="absolute -top-3 left-2 w-2 h-4 bg-slate-300 rounded-t-full rotate-[-20deg] border border-black" />
                  <div className="absolute -top-3 right-2 w-2 h-4 bg-slate-300 rounded-t-full rotate-[20deg] border border-black" />
                  {/* Drooping ears */}
                  <div className="absolute -left-4 top-2 w-4 h-9 bg-white border border-black rounded-full" />
                  <div className="absolute -right-4 top-2 w-4 h-9 bg-white border border-black rounded-full" />
                  {/* Gentle eyes */}
                  <div className="flex justify-between w-9 mt-4 px-1">
                    <div className="w-2.5 h-3 bg-rose-950 rounded-full" />
                    <div className="w-2.5 h-3 bg-rose-950 rounded-full" />
                  </div>
                  {/* Sweet smile */}
                  <div className="w-4 h-2 border-b-2 border-black mt-1" />
                </div>
                {/* Purple Robe with Delta Rune Crest */}
                <div className="w-22 h-16 bg-purple-900 border-2 border-white rounded-t-xl flex flex-col items-center justify-center relative">
                  <div className="w-8 h-8 border border-white/60 rounded-full flex items-center justify-center text-[9px] text-white">
                    🜁
                  </div>
                  <div className="w-18 h-2 bg-white/40 absolute bottom-0" />
                </div>
              </div>
            )}

            {/* 5. FLOWEY: FLOWER SPRITE */}
            {character === 'flowey' && (
              <div className="flex flex-col items-center">
                {/* 6 Golden Petals */}
                <div className="relative w-18 h-18 flex items-center justify-center">
                  {/* Petals */}
                  <div className="absolute -top-1 w-6 h-7 bg-yellow-400 rounded-full border border-black" />
                  <div className="absolute -bottom-1 w-6 h-7 bg-yellow-400 rounded-full border border-black" />
                  <div className="absolute -left-1 w-7 h-6 bg-yellow-400 rounded-full border border-black" />
                  <div className="absolute -right-1 w-7 h-6 bg-yellow-400 rounded-full border border-black" />
                  <div className="absolute -top-0 -left-0 w-6 h-6 bg-yellow-400 rounded-full border border-black" />
                  <div className="absolute -top-0 -right-0 w-6 h-6 bg-yellow-400 rounded-full border border-black" />
                  
                  {/* Face: Innocent or Demonic */}
                  <div className={`relative z-10 w-12 h-12 rounded-full border-2 border-black flex flex-col items-center justify-center transition-colors ${
                    floweyEvil ? 'bg-black text-white' : 'bg-white'
                  }`}>
                    {floweyEvil ? (
                      <div className="flex flex-col items-center">
                        <div className="flex justify-between w-7 px-0.5">
                          <div className="w-2 h-3 bg-red-600 rounded-full" />
                          <div className="w-2 h-3 bg-red-600 rounded-full" />
                        </div>
                        <div className="w-8 h-3 border-b-2 border-red-500 flex justify-evenly">
                          <div className="w-0.5 h-2 bg-white" />
                          <div className="w-0.5 h-2 bg-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex justify-between w-7 px-0.5">
                          <div className="w-2 h-2.5 bg-black rounded-full" />
                          <div className="w-2 h-2.5 bg-black rounded-full" />
                        </div>
                        <div className="w-4 h-2 border-b-2 border-black rounded-full mt-0.5" />
                      </div>
                    )}
                  </div>
                </div>
                {/* Green Stem & Leaves */}
                <div className="w-2 h-6 bg-emerald-600 border border-black" />
                <div className="w-12 h-3 bg-emerald-600 rounded-full border border-black -mt-1" />
              </div>
            )}

            {/* 6. METTATON EX: ROBOT SPRITE */}
            {character === 'mettaton' && (
              <div className="flex flex-col items-center">
                {/* Robotic Head with black bangs */}
                <div className="relative w-14 h-12 bg-slate-200 border-2 border-black rounded flex flex-col items-center">
                  <div className="w-full h-4 bg-black rounded-t flex items-end px-1">
                    <div className="w-5 h-5 bg-black rounded-br-full" />
                  </div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full border border-black mt-1 animate-pulse" />
                </div>
                {/* Magenta / Pink Chestplate */}
                <div className="w-18 h-10 bg-pink-600 border-2 border-black rounded-t flex items-center justify-center relative shadow">
                  <Heart className="w-4 h-4 text-white fill-white animate-ping" />
                </div>
                {/* Slender Legs & Pink High Heels */}
                <div className="flex justify-between w-10 px-1">
                  <div className="w-2.5 h-10 bg-black flex flex-col justify-end">
                    <div className="w-4 h-3 bg-pink-500 rounded border border-black" />
                  </div>
                  <div className="w-2.5 h-10 bg-black flex flex-col justify-end">
                    <div className="w-4 h-3 bg-pink-500 rounded border border-black" />
                  </div>
                </div>
              </div>
            )}

            {/* UNDERTALE DIALOGUE BUBBLE */}
            <div className="flex-1 bg-black border-2 border-white rounded-xl p-3 relative max-w-sm shadow-lg text-left">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />
              <div className="text-[11px] font-bold text-yellow-300 uppercase tracking-wide mb-1 flex items-center justify-between">
                <span>{activeChar.avatar} {activeChar.name}</span>
                {character === 'mettaton' && (
                  <span className="text-[10px] text-pink-400 font-mono">
                    Reyting: {ratings}
                  </span>
                )}
                {soulMode === 'green' && (
                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-mono">
                    YEŞİL RUH (KALKAN)
                  </span>
                )}
                {soulMode === 'blue' && (
                  <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono">
                    MAVİ RUH (YERÇEKİMİ)
                  </span>
                )}
              </div>
              <div className="text-xs text-white leading-relaxed font-mono">
                "{dialogue}"
              </div>
            </div>
          </div>

          {/* BATTLE CANVAS */}
          <div className="relative my-2 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={320}
              height={220}
              onPointerDown={(e) => {
                isPointerDown.current = true;
                handlePointerMove(e);
              }}
              onPointerUp={() => {
                isPointerDown.current = false;
              }}
              onPointerMove={handlePointerMove}
              className="bg-black block rounded-lg cursor-crosshair touch-none shadow-2xl border border-white/20"
              title="Kalbi hareket ettirin veya yeşil kalkanı yönlendirin"
            />

            {/* Game Over Modal */}
            {isGameOver && (
              <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-4 rounded-lg z-20">
                <div className="text-red-600 text-2xl font-black mb-2 tracking-widest animate-pulse">
                  GAME OVER
                </div>
                <div className="text-xs text-yellow-300 text-center mb-4 max-w-xs font-mono">
                  apo! Pes etme! Sen bu sistemin mutlak yöneticisisin! Kararlılık seni ayakta tutacak!
                </div>
                <button
                  onClick={restartGame}
                  className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs transition shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" /> Yeniden Başla (Kararlılık)
                </button>
              </div>
            )}
          </div>

          {/* CONTROLS & D-PAD / SHIELD CONTROLLER */}
          <div className="w-full flex items-center justify-between text-xs px-2 mb-2 bg-slate-950 p-2 rounded-lg border border-white/10">
            <div className="text-[11px] text-slate-300">
              <span className="text-yellow-400 font-bold">Kontrol: </span>
              {soulMode === 'green'
                ? '⬆️⬇️⬅️➡️ veya W/A/S/D ile kalkanı gelen mızraklara çevir!'
                : soulMode === 'blue'
                ? '⬆️ / [W]: Zıpla • ⬅️➡️: Koş'
                : 'Yön Tuşları / [W,A,S,D] veya Fareyle Kalbi Sürükle'}
            </div>

            {/* D-Pad */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDirectionBtn('left')}
                className={`w-7 h-7 rounded flex items-center justify-center text-white transition ${
                  soulMode === 'green' && shieldDir === 'left' ? 'bg-emerald-600 ring-2 ring-white' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title="Sol"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleDirectionBtn('up')}
                  className={`w-7 h-3.5 rounded flex items-center justify-center text-white transition ${
                    soulMode === 'green' && shieldDir === 'up' ? 'bg-emerald-600 ring-2 ring-white' : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title="Yukarı / Zıpla"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDirectionBtn('down')}
                  className={`w-7 h-3.5 rounded flex items-center justify-center text-white transition ${
                    soulMode === 'green' && shieldDir === 'down' ? 'bg-emerald-600 ring-2 ring-white' : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title="Aşağı"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => handleDirectionBtn('right')}
                className={`w-7 h-7 rounded flex items-center justify-center text-white transition ${
                  soulMode === 'green' && shieldDir === 'right' ? 'bg-emerald-600 ring-2 ring-white' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title="Sağ"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HP BAR & PLAYER STATS */}
          <div className="w-full flex items-center justify-between text-xs px-2 mb-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-400 tracking-wider">apo</span>
              <span className="text-slate-400">LV 19</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-yellow-400 font-bold">HP</span>
              <div className="w-36 h-4 bg-red-800 border border-slate-600 rounded-xs overflow-hidden flex">
                <div
                  className="h-full bg-yellow-400 transition-all duration-150"
                  style={{ width: `${(hp / maxHp) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold">{hp} / {maxHp}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Ruh Modu:</span>
              <div className={`w-3 h-3 rounded-full ${
                soulMode === 'red' ? 'bg-red-500' : soulMode === 'blue' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-400 animate-pulse'
              }`} />
            </div>
          </div>

          {/* SUBMENU DISPLAY */}
          {activeMenu === 'act' && (
            <div className="w-full bg-slate-950 border border-orange-500 rounded p-2 mb-2 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleActOption('check')}
                className="p-1.5 bg-slate-900 hover:bg-orange-600 rounded text-left transition font-mono"
              >
                * İncele (Check)
              </button>
              <button
                onClick={() => handleActOption('special')}
                className="p-1.5 bg-slate-900 hover:bg-orange-600 rounded text-left transition font-mono"
              >
                * Özel Eylem Yap
              </button>
            </div>
          )}

          {activeMenu === 'item' && (
            <div className="w-full bg-slate-950 border border-orange-500 rounded p-2 mb-2 grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => handleItemOption('pie')}
                className="p-1.5 bg-slate-900 hover:bg-orange-600 rounded text-left transition font-mono"
              >
                * Turta (Full HP)
              </button>
              <button
                onClick={() => handleItemOption('hero')}
                className="p-1.5 bg-slate-900 hover:bg-orange-600 rounded text-left transition font-mono"
              >
                * Kahraman (+15 HP)
              </button>
              <button
                onClick={() => handleItemOption('spaghetti')}
                className="p-1.5 bg-slate-900 hover:bg-orange-600 rounded text-left transition font-mono"
              >
                * Spagetti (+12 HP)
              </button>
            </div>
          )}

          {/* 4 CLASSIC UNDERTALE BUTTONS */}
          <div className="grid grid-cols-4 gap-2 w-full">
            <button
              onClick={handleFight}
              className="py-2 border-2 border-orange-500 text-orange-400 hover:bg-orange-500/20 active:scale-95 rounded text-center text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>FIGHT</span>
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'act' ? 'main' : 'act')}
              className={`py-2 border-2 border-orange-500 text-orange-400 rounded text-center text-xs font-bold transition active:scale-95 ${
                activeMenu === 'act' ? 'bg-orange-500 text-white' : 'hover:bg-orange-500/20'
              }`}
            >
              ACT
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'item' ? 'main' : 'item')}
              className={`py-2 border-2 border-orange-500 text-orange-400 rounded text-center text-xs font-bold transition active:scale-95 ${
                activeMenu === 'item' ? 'bg-orange-500 text-white' : 'hover:bg-orange-500/20'
              }`}
            >
              ITEM
            </button>
            <button
              onClick={handleMercy}
              className="py-2 border-2 border-orange-500 text-orange-400 hover:bg-orange-500/20 active:scale-95 rounded text-center text-xs font-bold transition"
            >
              MERCY
            </button>
          </div>

          {/* BATTLE NARRATION */}
          <div className="text-[11px] text-slate-400 text-center mt-2 font-mono">
            {battleMessage}
          </div>
        </div>
      )}
    </div>
  );
};
