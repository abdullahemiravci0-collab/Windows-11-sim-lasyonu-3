import React, { useEffect, useRef, useState } from 'react';

const BLOCK_SIZE = 32;
const WORLD_W = 128;
const WORLD_H = 64;
const PLAYER_W = 24;
const PLAYER_H = 48;

const BLOCKS = {
  AIR: 0,
  DIRT: 1,
  GRASS: 2,
  STONE: 3,
  WOOD: 4,
  LEAVES: 5,
  PLANKS: 6,
  BRICK: 7,
  GLASS: 8,
  VERITY_EGG: 99,
  SWORD: 100,
};

const COLORS: Record<number, string> = {
  [BLOCKS.DIRT]: '#8B4513',
  [BLOCKS.GRASS]: '#228B22',
  [BLOCKS.STONE]: '#808080',
  [BLOCKS.WOOD]: '#5c4033',
  [BLOCKS.LEAVES]: '#006400',
  [BLOCKS.PLANKS]: '#DEB887',
  [BLOCKS.BRICK]: '#B22222',
  [BLOCKS.GLASS]: 'rgba(173, 216, 230, 0.4)',
  [BLOCKS.VERITY_EGG]: '#FFCC00',
  [BLOCKS.SWORD]: 'transparent',
};

const BLOCK_NAMES: Record<number, string> = {
  [BLOCKS.DIRT]: 'Toprak',
  [BLOCKS.GRASS]: 'Çimen',
  [BLOCKS.STONE]: 'Taş',
  [BLOCKS.WOOD]: 'Odun',
  [BLOCKS.LEAVES]: 'Yaprak',
  [BLOCKS.PLANKS]: 'Ahşap',
  [BLOCKS.BRICK]: 'Tuğla',
  [BLOCKS.GLASS]: 'Cam',
  [BLOCKS.VERITY_EGG]: 'Verity (Asistan)',
  [BLOCKS.SWORD]: 'Elmas Kılıç',
};

const HOTBAR_ITEMS = [
  BLOCKS.DIRT,
  BLOCKS.GRASS,
  BLOCKS.STONE,
  BLOCKS.WOOD,
  BLOCKS.LEAVES,
  BLOCKS.PLANKS,
  BLOCKS.BRICK,
  BLOCKS.VERITY_EGG,
  BLOCKS.SWORD,
];

interface Enemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  grounded: boolean;
  active: boolean;
}

export function MinecraftApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBlock, setSelectedBlock] = useState<number>(BLOCKS.DIRT);
  const [interactionMode, setInteractionMode] = useState<'break' | 'place'>('break');
  
  // States for Chat & Inventory
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [verityReply, setVerityReply] = useState<string>("Merhaba! Sana nasıl yardım edebilirim?");
  const [inventory, setInventory] = useState<Record<number, number>>({
    [BLOCKS.DIRT]: 10,
    [BLOCKS.GRASS]: 5,
    [BLOCKS.STONE]: 5,
    [BLOCKS.VERITY_EGG]: 1, // Start with Verity!
    [BLOCKS.SWORD]: 1, // Give 1 sword
  });

  const selectedBlockRef = useRef(BLOCKS.DIRT);
  const interactionModeRef = useRef<'break' | 'place'>('break');
  const inventoryRef = useRef<Record<number, number>>(inventory);
  const verityReplyRef = useRef<string>("Merhaba! Sana nasıl yardım edebilirim?");

  // Mutable refs for game loop
  const worldRef = useRef(new Uint8Array(WORLD_W * WORLD_H));
  const playerRef = useRef({ x: WORLD_W * BLOCK_SIZE / 2, y: 10 * BLOCK_SIZE, vx: 0, vy: 0, grounded: false, hp: 20, invulnTimer: 0 });
  const verityRef = useRef({ x: 0, y: 0, active: false, timer: 0, alpha: 0, flicker: 1, form: 'smiley', carrying: false });
  const enemiesRef = useRef<Enemy[]>([]);
  const cameraRef = useRef({ x: 0, y: 0 });
  const keysRef = useRef({ left: false, right: false, up: false, down: false });
  const mouseRef = useRef({ x: 0, y: 0, leftDown: false, rightDown: false, interactX: -1, interactY: -1, button: -1 });

  const setBlock = (b: number) => {
    setSelectedBlock(b);
    selectedBlockRef.current = b;
  };

  const toggleInteractionMode = () => {
    setInteractionMode(prev => {
      const next = prev === 'break' ? 'place' : 'break';
      interactionModeRef.current = next;
      return next;
    });
  };

  // Sync state and ref for inventory
  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);
  
  useEffect(() => {
    verityReplyRef.current = verityReply;
  }, [verityReply]);

  // Generate World
  useEffect(() => {
    const world = worldRef.current;
    for (let x = 0; x < WORLD_W; x++) {
      const height = Math.floor(30 + Math.sin(x / 6) * 4 + Math.sin(x / 14) * 6);
      for (let y = 0; y < WORLD_H; y++) {
        if (y > height) {
          if (y === height + 1) world[y * WORLD_W + x] = BLOCKS.GRASS;
          else if (y < height + 5) world[y * WORLD_W + x] = BLOCKS.DIRT;
          else world[y * WORLD_W + x] = BLOCKS.STONE;
        }
      }
      // Simple Tree Gen
      if (Math.random() < 0.1 && x > 3 && x < WORLD_W - 4 && height > 5) {
        const trunkHeight = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < trunkHeight; i++) {
          world[(height - i) * WORLD_W + x] = BLOCKS.WOOD;
        }
        for (let ly = height - trunkHeight - 2; ly <= height - trunkHeight; ly++) {
          for (let lx = x - 2; lx <= x + 2; lx++) {
            if (world[ly * WORLD_W + lx] === BLOCKS.AIR) {
              world[ly * WORLD_W + lx] = BLOCKS.LEAVES;
            }
          }
        }
      }
    }
    // Find initial player y
    const pxBlock = Math.floor(playerRef.current.x / BLOCK_SIZE);
    let py = 0;
    while (world[py * WORLD_W + pxBlock] === BLOCKS.AIR && py < WORLD_H - 1) {
      py++;
    }
    playerRef.current.y = (py - 3) * BLOCK_SIZE;
  }, []);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let enemySpawnTimer = 0;
    let nextEnemyId = 1;

    const collides = (x: number, y: number, w: number, h: number) => {
      const left = Math.floor(x / BLOCK_SIZE);
      const right = Math.floor((x + w - 0.1) / BLOCK_SIZE);
      const top = Math.floor(y / BLOCK_SIZE);
      const bottom = Math.floor((y + h - 0.1) / BLOCK_SIZE);

      for (let by = top; by <= bottom; by++) {
        for (let bx = left; bx <= right; bx++) {
          if (bx < 0 || bx >= WORLD_W || by >= WORLD_H) return true; // World bounds
          if (by < 0) continue; // Sky
          if (worldRef.current[by * WORLD_W + bx] !== BLOCKS.AIR) return true;
        }
      }
      return false;
    };

    const updatePhysics = (dt: number) => {
      const player = playerRef.current;
      const keys = keysRef.current;
      const verity = verityRef.current;

      // Prevent movement if chat is open
      if (!isChatOpen) {
        if (keys.left) player.vx -= 1.5;
        if (keys.right) player.vx += 1.5;
      }

      // Check if carried by Verity
      const isCarried = verity.active && verity.carrying;

      if (!isCarried) {
        player.vy += 0.5; // normal gravity
        player.vy *= 0.98; // air friction
      } else {
        // Anti-gravity and fly mechanics
        player.vy *= 0.8; // heavy friction so they can hover
        if (!isChatOpen) {
           if (keys.up) player.vy -= 1.5; // Fly up
           if (keys.down) player.vy += 1.5; // Fly down
        }
      }
      
      player.vx *= 0.8; // ground friction

      if (player.vx > 7) player.vx = 7;
      if (player.vx < -7) player.vx = -7;
      if (player.vy > 10) player.vy = 10;
      if (player.vy < -10) player.vy = -10;

      // X
      player.x += player.vx;
      if (collides(player.x, player.y, PLAYER_W, PLAYER_H)) {
        player.x -= player.vx;
        player.vx = 0;
      }

      // Y
      player.y += player.vy;
      if (collides(player.x, player.y, PLAYER_W, PLAYER_H)) {
        player.y -= player.vy;
        if (player.vy > 0) player.grounded = true;
        player.vy = 0;
      } else {
        player.grounded = false;
      }

      if (!isChatOpen && keys.up && player.grounded) {
        player.vy = -9.5;
        player.grounded = false;
      }

      // Decrement invuln timer
      player.invulnTimer = Math.max(0, player.invulnTimer - dt);

      // Fall off world
      if (player.y > WORLD_H * BLOCK_SIZE + 200) {
        player.y = 0;
        player.vy = 0;
        player.hp -= 2;
      }

      // Enemy logic
      enemySpawnTimer += dt;
      if (enemySpawnTimer > 5000 && enemiesRef.current.length < 5) { // Spawn zombie every 5s, max 5
        enemySpawnTimer = 0;
        // Spawn randomly left or right of player, off screen
        const dir = Math.random() > 0.5 ? 1 : -1;
        const spawnX = player.x + dir * (canvas.width / 2 + 100);
        if (spawnX > 0 && spawnX < WORLD_W * BLOCK_SIZE) {
          enemiesRef.current.push({
            id: nextEnemyId++,
            x: spawnX,
            y: 0, // Fall from sky
            vx: 0,
            vy: 0,
            hp: 10,
            grounded: false,
            active: true
          });
        }
      }

      enemiesRef.current.forEach(enemy => {
        if (!enemy.active) return;
        
        // Simple AI: walk towards player
        const dist = player.x - enemy.x;
        if (Math.abs(dist) < 800) {
          if (dist > 20) enemy.vx += 0.5;
          else if (dist < -20) enemy.vx -= 0.5;
        }

        enemy.vy += 0.5;
        enemy.vx *= 0.8;
        if (enemy.vx > 3) enemy.vx = 3;
        if (enemy.vx < -3) enemy.vx = -3;

        enemy.x += enemy.vx;
        if (collides(enemy.x, enemy.y, PLAYER_W, PLAYER_H)) {
          enemy.x -= enemy.vx;
          // Jump over obstacles
          if (enemy.grounded) {
            enemy.vy = -8;
            enemy.grounded = false;
          }
        }

        enemy.y += enemy.vy;
        if (collides(enemy.x, enemy.y, PLAYER_W, PLAYER_H)) {
          enemy.y -= enemy.vy;
          if (enemy.vy > 0) enemy.grounded = true;
          enemy.vy = 0;
        } else {
          enemy.grounded = false;
        }
        
        // Damage player
        if (player.invulnTimer <= 0) {
          if (Math.abs(player.x - enemy.x) < PLAYER_W && Math.abs(player.y - enemy.y) < PLAYER_H) {
            player.hp -= 2; // 1 Heart
            player.invulnTimer = 1000; // 1 second invulnerability
            player.vx = enemy.x > player.x ? -5 : 5; // Knockback
            player.vy = -5;
          }
        }
        
        // Fall off
        if (enemy.y > WORLD_H * BLOCK_SIZE) enemy.active = false;
      });
      // Clean up dead enemies
      enemiesRef.current = enemiesRef.current.filter(e => e.active);

      // Verity AI (Assistant Mode)
      verity.timer += dt;
      
      if (verity.active) {
        const reply = verityReplyRef.current.toLowerCase();
        
        // Parse carrying
        if (reply.includes("taşıyorum") || reply.includes("bindin")) {
           verity.carrying = true;
        } else if (reply.includes("indiriyorum") || reply.includes("bırakıyorum")) {
           verity.carrying = false;
        }

        // Parse transformation
        if (reply.includes("dönüşüyorum")) {
           if (reply.includes("oyuncu") || reply.includes("senin") || reply.includes("şekline")) {
               verity.form = 'player';
           } else if (reply.includes("entity") || reply.includes("canavar")) {
               verity.form = 'entity';
           } else {
               verity.form = 'smiley';
           }
        }

        if (verity.carrying) {
          // Carry the player, Verity stays right under/behind player
          verity.x = player.x;
          verity.y = player.y + 20 + Math.sin(verity.timer / 300) * 5;
          verity.flicker = player.vx < 0 ? -1 : 1; 
        } else {
          // If the player asked for protection, Verity attacks nearby zombies!
          let targetEnemy: Enemy | null = null;
          if (reply.includes("koruyacağım") || reply.includes("koruyorum") || reply.includes("saldırıyorum")) {
            let minD = Infinity;
            enemiesRef.current.forEach(e => {
              if (e.active) {
                const d = Math.hypot(e.x - verity.x, e.y - verity.y);
                if (d < 500 && d < minD) {
                  minD = d;
                  targetEnemy = e;
                }
              }
            });
          }

          if (targetEnemy) {
            // Fly towards enemy and attack
            verity.x += ((targetEnemy as Enemy).x - verity.x) * 0.1;
            verity.y += ((targetEnemy as Enemy).y - 20 - verity.y) * 0.1;
            verity.flicker = (targetEnemy as Enemy).x < verity.x ? -1 : 1;
            
            if (Math.hypot((targetEnemy as Enemy).x - verity.x, (targetEnemy as Enemy).y - verity.y) < 40) {
              (targetEnemy as Enemy).hp -= 1; // Deal damage
              if ((targetEnemy as Enemy).hp <= 0) (targetEnemy as Enemy).active = false;
              (targetEnemy as Enemy).vx = verity.flicker * 5; // knockback
            }
          } else {
            // Follow the player smoothly
            const targetX = player.x + (player.vx >= 0 ? -60 : 60);
            const targetY = player.y - 50 + Math.sin(verity.timer / 500) * 10;

            verity.x += (targetX - verity.x) * 0.05;
            verity.y += (targetY - verity.y) * 0.05;
            verity.flicker = player.x < verity.x ? -1 : 1; 
          }
        }
      }
    };

    const handleInteraction = () => {
      const m = mouseRef.current;
      if (m.interactX !== -1 && m.interactY !== -1 && !isChatOpen) {
        const camera = cameraRef.current;
        const bx = Math.floor((m.interactX + camera.x) / BLOCK_SIZE);
        const by = Math.floor((m.interactY + camera.y) / BLOCK_SIZE);

        if (bx >= 0 && bx < WORLD_W && by >= 0 && by < WORLD_H) {
          const px = playerRef.current.x + PLAYER_W / 2;
          const py = playerRef.current.y + PLAYER_H / 2;
          const dist = Math.hypot((bx + 0.5) * BLOCK_SIZE - px, (by + 0.5) * BLOCK_SIZE - py);

          if (dist < 250) { // slightly increased range for attack and building
            const isPlace = m.button === 2 || (m.button === 0 && interactionModeRef.current === 'place');
            const isBreak = m.button === 0 && interactionModeRef.current === 'break';
            
            // 1) Handle Combat (Zombies)
            let hitZombie = false;
            if (isBreak || (isPlace && selectedBlockRef.current === BLOCKS.SWORD)) {
              const clickX = m.interactX + camera.x;
              const clickY = m.interactY + camera.y;
              for (let i = 0; i < enemiesRef.current.length; i++) {
                const enemy = enemiesRef.current[i];
                if (!enemy.active) continue;
                // Basic bounding box click detection
                if (clickX >= enemy.x && clickX <= enemy.x + PLAYER_W && 
                    clickY >= enemy.y && clickY <= enemy.y + PLAYER_H) {
                  
                  const dmg = selectedBlockRef.current === BLOCKS.SWORD ? 10 : 2; // Sword 1-shots, hand takes 5
                  enemy.hp -= dmg;
                  if (enemy.hp <= 0) enemy.active = false;
                  
                  // Knockback
                  enemy.vx = enemy.x > playerRef.current.x ? 8 : -8;
                  enemy.vy = -5;
                  hitZombie = true;
                  break;
                }
              }
            }

            // 2) Handle Block breaking/placing if we didn't hit a zombie
            if (!hitZombie && selectedBlockRef.current !== BLOCKS.SWORD) {
              if (isBreak) {
                // Break Block -> add to inventory
                const brokenBlock = worldRef.current[by * WORLD_W + bx];
                if (brokenBlock !== BLOCKS.AIR) {
                  worldRef.current[by * WORLD_W + bx] = BLOCKS.AIR;
                  // Update inventory state
                  setInventory(prev => ({
                    ...prev,
                    [brokenBlock]: (prev[brokenBlock] || 0) + 1
                  }));
                }
              } else if (isPlace) {
                const blk = selectedBlockRef.current;
                
                if (blk === BLOCKS.VERITY_EGG) {
                  // Summon Verity!
                  if ((inventoryRef.current[blk] || 0) > 0) {
                    verityRef.current.active = true;
                    verityRef.current.x = (bx * BLOCK_SIZE);
                    verityRef.current.y = (by * BLOCK_SIZE);
                    verityRef.current.alpha = 1;
                    // Don't place a real block
                    setInventory(prev => ({ ...prev, [blk]: prev[blk] - 1 }));
                  }
                } else {
                  // Normal block placement
                  if ((inventoryRef.current[blk] || 0) > 0) {
                    if (worldRef.current[by * WORLD_W + bx] === BLOCKS.AIR) {
                      const oldBlock = worldRef.current[by * WORLD_W + bx];
                      worldRef.current[by * WORLD_W + bx] = blk;
                      if (collides(playerRef.current.x, playerRef.current.y, PLAYER_W, PLAYER_H)) {
                        worldRef.current[by * WORLD_W + bx] = oldBlock; // undo if inside player
                      } else {
                        // Decrease inventory
                        setInventory(prev => ({ ...prev, [blk]: prev[blk] - 1 }));
                      }
                    }
                  }
                }
              }
            }
          }
        }
        m.interactX = -1;
        m.interactY = -1;
      }
    };

    const draw = () => {
      if (containerRef.current) {
        if (canvas.width !== containerRef.current.clientWidth || canvas.height !== containerRef.current.clientHeight) {
          canvas.width = containerRef.current.clientWidth;
          canvas.height = containerRef.current.clientHeight;
        }
      }

      const player = playerRef.current;
      const camera = cameraRef.current;
      const world = worldRef.current;

      camera.x += ((player.x + PLAYER_W / 2) - canvas.width / 2 - camera.x) * 0.1;
      camera.y += ((player.y + PLAYER_H / 2) - canvas.height / 2 - camera.y) * 0.1;

      if (camera.x < 0) camera.x = 0;
      if (camera.x > WORLD_W * BLOCK_SIZE - canvas.width) camera.x = WORLD_W * BLOCK_SIZE - canvas.width;
      if (camera.y > WORLD_H * BLOCK_SIZE - canvas.height) camera.y = WORLD_H * BLOCK_SIZE - canvas.height;

      // Sky
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.max(0, Math.floor(camera.x / BLOCK_SIZE));
      const endX = Math.min(WORLD_W, Math.ceil((camera.x + canvas.width) / BLOCK_SIZE));
      const startY = Math.max(0, Math.floor(camera.y / BLOCK_SIZE));
      const endY = Math.min(WORLD_H, Math.ceil((camera.y + canvas.height) / BLOCK_SIZE));

      // Draw blocks
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const block = world[y * WORLD_W + x];
          if (block !== BLOCKS.AIR) {
            ctx.fillStyle = COLORS[block];
            ctx.fillRect(x * BLOCK_SIZE - camera.x, y * BLOCK_SIZE - camera.y, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.strokeRect(x * BLOCK_SIZE - camera.x, y * BLOCK_SIZE - camera.y, BLOCK_SIZE, BLOCK_SIZE);
            
            if (block === BLOCKS.GRASS) {
              ctx.fillStyle = '#1A6B1A';
              ctx.fillRect(x * BLOCK_SIZE - camera.x, y * BLOCK_SIZE - camera.y, BLOCK_SIZE, 6);
            }
          }
        }
      }

      // Draw enemies (Zombies)
      enemiesRef.current.forEach(enemy => {
        if (enemy.active) {
          const ex = enemy.x - camera.x;
          const ey = enemy.y - camera.y;
          ctx.fillStyle = '#1a5927'; // Dark green shirt
          ctx.fillRect(ex, ey + 16, PLAYER_W, 18);
          ctx.fillStyle = '#211c6a'; // Blue pants
          ctx.fillRect(ex, ey + 34, PLAYER_W, 14);
          ctx.fillStyle = '#397a47'; // Green skin
          ctx.fillRect(ex + 2, ey, 20, 16);
          // Eyes
          ctx.fillStyle = '#000';
          ctx.fillRect(ex + 6, ey + 6, 4, 4);
          ctx.fillRect(ex + 14, ey + 6, 4, 4);
        }
      });

      // Draw player
      if (player.invulnTimer <= 0 || Math.floor(player.invulnTimer / 100) % 2 === 0) {
        const px = player.x - camera.x;
        const py = player.y - camera.y;
        
        // Flash red if recently hit
        if (player.invulnTimer > 800) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(px, py, PLAYER_W, PLAYER_H);
        } else {
          ctx.fillStyle = '#00A8A8'; 
          ctx.fillRect(px, py + 16, PLAYER_W, 18);
          ctx.fillStyle = '#211c6a';
          ctx.fillRect(px, py + 34, PLAYER_W, 14);
          ctx.fillStyle = '#F0C8A0';
          ctx.fillRect(px + 2, py, 20, 16);
        }
      }

      // Block highlight
      const bx = Math.floor((mouseRef.current.x + camera.x) / BLOCK_SIZE);
      const by = Math.floor((mouseRef.current.y + camera.y) / BLOCK_SIZE);
      if (bx >= 0 && bx < WORLD_W && by >= 0 && by < WORLD_H && !isChatOpen) {
        const dist = Math.hypot((bx + 0.5) * BLOCK_SIZE - (player.x + PLAYER_W/2), (by + 0.5) * BLOCK_SIZE - (player.y + PLAYER_H/2));
        if (dist < 200) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx * BLOCK_SIZE - camera.x, by * BLOCK_SIZE - camera.y, BLOCK_SIZE, BLOCK_SIZE);
          ctx.lineWidth = 1;
        }
      }

      // Draw Verity
      const verity = verityRef.current;
      if (verity.active && verity.alpha > 0) {
        const vx = verity.x - camera.x;
        const vy = verity.y - camera.y;
        const radius = 24; 
        
        ctx.globalAlpha = Math.max(0, verity.alpha);
        
        if (verity.form === 'player') {
          // Draw Verity as Player Shape (slightly translucent or glowing)
          ctx.fillStyle = '#008888'; // Slightly different teal
          ctx.fillRect(vx, vy + 16, PLAYER_W, 18);
          ctx.fillStyle = '#1a1555';
          ctx.fillRect(vx, vy + 34, PLAYER_W, 14);
          ctx.fillStyle = '#F0C8A0';
          ctx.fillRect(vx + 2, vy, 20, 16);
          // Name tag
          ctx.fillStyle = '#FFCC00';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('VERITY', vx + PLAYER_W/2, vy - 5);
        } else if (verity.form === 'entity') {
          // Tall Monster Form (Verity Entity)
          const vCol = '#FFCC00';
          const ribCol = '#D0A000';
          
          // Torso
          ctx.fillStyle = vCol;
          ctx.fillRect(vx + 6, vy + 24, 12, 45);
          
          // Ribs
          ctx.fillStyle = ribCol;
          ctx.fillRect(vx + 6, vy + 32, 12, 2);
          ctx.fillRect(vx + 6, vy + 38, 12, 2);
          ctx.fillRect(vx + 6, vy + 44, 12, 2);
          ctx.fillRect(vx + 6, vy + 50, 12, 2);

          // Arms (Long and thin)
          ctx.fillStyle = vCol;
          ctx.fillRect(vx, vy + 24, 4, 65); // Left arm
          ctx.fillRect(vx + 20, vy + 24, 4, 65); // Right arm
          
          // Legs (Long and thin)
          ctx.fillStyle = vCol;
          ctx.fillRect(vx + 6, vy + 69, 4, 50); // Left leg
          ctx.fillRect(vx + 14, vy + 69, 4, 50); // Right leg

          // Head
          ctx.beginPath();
          ctx.arc(vx + 12, vy + 12, 14, 0, Math.PI * 2);
          ctx.fillStyle = vCol;
          ctx.fill();
          
          // Face
          const eyeOffset = verity.flicker * 3; 
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.ellipse(vx + 12 - 5 + eyeOffset, vy + 8, 2.5, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(vx + 12 + 5 + eyeOffset, vy + 8, 2.5, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(vx + 12, vy + 12, 9, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#000000';
          ctx.stroke();
          ctx.lineWidth = 1;
        } else {
          // Default Smiley Form
          ctx.beginPath();
          ctx.arc(vx + radius, vy + radius, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#FFCC00';
          ctx.fill();
          
          const eyeOffset = verity.flicker * 4; 
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.ellipse(vx + radius - 8 + eyeOffset, vy + radius - 4, 3, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(vx + radius + 8 + eyeOffset, vy + radius - 4, 3, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(vx + radius, vy + radius + 2, 12, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#000000';
          ctx.stroke();
          ctx.lineWidth = 1;
        }

        // Draw Chat Bubble for Verity
        const msg = verityReplyRef.current;
        if (msg) {
          ctx.font = '12px sans-serif';
          const textMetrics = ctx.measureText(msg);
          const bubbleW = Math.max(120, textMetrics.width + 20);
          
          const bubbleX = verity.form === 'player' ? vx + PLAYER_W/2 : vx + 12;
          const bubbleY = vy;

          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath();
          ctx.roundRect(bubbleX - bubbleW/2, bubbleY - 45, bubbleW, 26, 8);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(bubbleX, bubbleY - 19);
          ctx.lineTo(bubbleX + 10, bubbleY - 30);
          ctx.lineTo(bubbleX - 10, bubbleY - 30);
          ctx.fill();
          
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.fillText(msg, bubbleX, bubbleY - 28);
        }
        
        ctx.globalAlpha = 1.0;
      }
      
      // Draw Health (Hearts)
      ctx.textAlign = 'left';
      ctx.font = '20px sans-serif';
      let heartsStr = '';
      const totalHearts = Math.max(0, Math.ceil(player.hp / 2));
      for (let i = 0; i < totalHearts; i++) {
        heartsStr += '❤️';
      }
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(10, 10, ctx.measureText(heartsStr).width + 20, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(heartsStr, 20, 32);
      
      if (player.hp <= 0) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("ÖLDÜN!", canvas.width / 2, canvas.height / 2);
        
        // Auto respawn logic
        if (player.invulnTimer <= 0) {
          player.hp = 20;
          player.x = WORLD_W * BLOCK_SIZE / 2;
          player.y = 0;
          player.invulnTimer = 2000;
        }
      }
    };

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      updatePhysics(Math.min(dt, 32));
      handleInteraction();
      draw();
      
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isChatOpen]); // Dependency on isChatOpen to block inputs properly inside loop ref usage

  // Handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isChatOpen) return;
    
    switch (e.key.toLowerCase()) {
      case 'a':
      case 'arrowleft':
        keysRef.current.left = true;
        break;
      case 'd':
      case 'arrowright':
        keysRef.current.right = true;
        break;
      case 'w':
      case 'arrowup':
      case ' ':
        keysRef.current.up = true;
        break;
      case 's':
      case 'arrowdown':
        keysRef.current.down = true;
        break;
      case 't':
        e.preventDefault();
        setIsChatOpen(true);
        break;
      case '1': setBlock(HOTBAR_ITEMS[0]); break;
      case '2': setBlock(HOTBAR_ITEMS[1]); break;
      case '3': setBlock(HOTBAR_ITEMS[2]); break;
      case '4': setBlock(HOTBAR_ITEMS[3]); break;
      case '5': setBlock(HOTBAR_ITEMS[4]); break;
      case '6': setBlock(HOTBAR_ITEMS[5]); break;
      case '7': setBlock(HOTBAR_ITEMS[6]); break;
      case '8': setBlock(HOTBAR_ITEMS[7]); break;
      case '9': setBlock(HOTBAR_ITEMS[8]); break;
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'a':
      case 'arrowleft':
        keysRef.current.left = false;
        break;
      case 'd':
      case 'arrowright':
        keysRef.current.right = false;
        break;
      case 'w':
      case 'arrowup':
      case ' ':
        keysRef.current.up = false;
        break;
      case 's':
      case 'arrowdown':
        keysRef.current.down = false;
        break;
    }
  };

  const updateMousePos = (e: React.MouseEvent | MouseEvent) => {
    if (canvasRef.current && !isChatOpen) {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isChatOpen) return;
    updateMousePos(e);
    mouseRef.current.interactX = mouseRef.current.x;
    mouseRef.current.interactY = mouseRef.current.y;
    mouseRef.current.button = e.button;
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleTouchStart = (e: React.TouchEvent, action: 'left' | 'right' | 'up') => {
    if (isChatOpen) return;
    e.preventDefault();
    if (action === 'left') keysRef.current.left = true;
    if (action === 'right') keysRef.current.right = true;
    if (action === 'up') keysRef.current.up = true;
  };

  const handleTouchEnd = (e: React.TouchEvent, action: 'left' | 'right' | 'up') => {
    e.preventDefault();
    if (action === 'left') keysRef.current.left = false;
    if (action === 'right') keysRef.current.right = false;
    if (action === 'up') keysRef.current.up = false;
  };

  const handleCanvasTouch = (e: React.TouchEvent) => {
    if (isChatOpen) return;
    if (e.touches.length > 0) {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
        mouseRef.current.interactX = mouseRef.current.x;
        mouseRef.current.interactY = mouseRef.current.y;
        mouseRef.current.button = 0; 
      }
    }
  };

  const sendVerityMessage = async () => {
    if (!chatMessage.trim()) return;
    
    setVerityReply("Düşünüyorum...");
    const msg = chatMessage;
    setChatMessage('');
    setIsChatOpen(false); // Close chat to play

    const getOfflineReply = (m: string) => {
      const lower = m.toLowerCase();
      if(lower.includes('taşı') || lower.includes('uçur')) return "Seni taşıyorum apo!";
      if(lower.includes('bırak') || lower.includes('indir')) return "Seni indiriyorum apo!";
      if(lower.includes('entity') || lower.includes('canavar')) return "Entity şekline dönüşüyorum apo!";
      if(lower.includes('eski') || lower.includes('normal') || lower.includes('smiley')) return "Eski halime dönüşüyorum apo!";
      if(lower.includes('koru') || lower.includes('saldır')) return "Seni koruyorum apo, düşmanlara saldıracağım!";
      if(lower.includes('oyuncu') || lower.includes('benim şekl')) return "Oyuncu şekline dönüşüyorum apo!";
      return "Anladım apo! (Bağlantı yok - Yerel Mod)";
    };

    try {
      const res = await fetch("/api/verity-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setVerityReply(data.reply || getOfflineReply(msg));
    } catch (e) {
      // GitHub Pages'te backend çalışmadığı için yerel simüle cevaplara düşer
      setVerityReply(getOfflineReply(msg));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-black focus:outline-none select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseMove={updateMousePos}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
      autoFocus
    >
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full block cursor-crosshair touch-none ${isChatOpen ? 'brightness-50' : ''}`}
        onTouchStart={handleCanvasTouch}
      />

      {/* On-Screen Mobile Controls */}
      <div className="absolute bottom-24 left-4 flex gap-2 sm:hidden opacity-70">
        <button 
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full text-white text-2xl flex items-center justify-center active:bg-white/40 touch-none"
          onTouchStart={(e) => handleTouchStart(e, 'left')}
          onTouchEnd={(e) => handleTouchEnd(e, 'left')}
        >
          ←
        </button>
        <button 
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full text-white text-2xl flex items-center justify-center active:bg-white/40 touch-none"
          onTouchStart={(e) => handleTouchStart(e, 'right')}
          onTouchEnd={(e) => handleTouchEnd(e, 'right')}
        >
          →
        </button>
      </div>

      <div className="absolute bottom-24 right-4 flex flex-col gap-2 sm:hidden opacity-70 items-end">
        <button 
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full text-white text-2xl flex items-center justify-center active:bg-white/40 touch-none"
          onClick={() => setIsChatOpen(true)}
        >
          💬
        </button>
        <button 
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full text-white text-2xl flex items-center justify-center active:bg-white/40 touch-none"
          onTouchStart={(e) => handleTouchStart(e, 'up')}
          onTouchEnd={(e) => handleTouchEnd(e, 'up')}
        >
          ↑
        </button>
      </div>

      <div className="absolute top-4 left-4 sm:hidden z-10">
        <button
          onClick={toggleInteractionMode}
          className={`px-4 py-2 rounded-full font-bold text-sm backdrop-blur-md shadow-lg transition-colors ${
            interactionMode === 'break' 
              ? 'bg-red-500/80 text-white border-2 border-red-300' 
              : 'bg-green-500/80 text-white border-2 border-green-300'
          }`}
        >
          Mod: {interactionMode === 'break' ? 'Kır (Break)' : 'Koy (Place)'}
        </button>
      </div>

      {/* Chat Box Overlay */}
      {isChatOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90%] bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/20 z-50 shadow-2xl">
          <h3 className="text-white mb-2 font-bold flex items-center gap-2">
            <span className="text-xl">💬</span> Verity ile Konuş
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              autoFocus
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendVerityMessage();
                if (e.key === 'Escape') setIsChatOpen(false);
              }}
              className="flex-1 bg-white/10 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bir şeyler yaz..."
            />
            <button 
              onClick={sendVerityMessage}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Gönder
            </button>
          </div>
          <p className="text-white/50 text-xs mt-2 text-center">İptal etmek için ESC</p>
        </div>
      )}

      {/* Hotbar / Inventory */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 p-1.5 rounded-lg backdrop-blur-md z-40 pointer-events-auto">
        {HOTBAR_ITEMS.map((block, i) => {
          const count = inventory[block] || 0;
          const isVerityEgg = block === BLOCKS.VERITY_EGG;
          const isSword = block === BLOCKS.SWORD;
          
          return (
            <div
              key={block}
              onClick={(e) => {
                e.stopPropagation();
                setBlock(block);
              }}
              className={`w-10 h-10 border-2 rounded-md shadow-sm flex items-center justify-center cursor-pointer transition-all relative ${
                selectedBlock === block ? 'border-white scale-110 z-10' : 'border-slate-500/50 hover:border-slate-300 opacity-90'
              }`}
              style={{ backgroundColor: (isVerityEgg || isSword) ? '#222' : COLORS[block] }}
              title={`${BLOCK_NAMES[block]} (Miktar: ${count}) - Tuş: ${i + 1}`}
            >
              {block === BLOCKS.GRASS && (
                <div className="w-full h-[6px] bg-[#1A6B1A] absolute top-0" />
              )}
              {isVerityEgg && (
                <div className="text-xl">🙂</div>
              )}
              {isSword && (
                <div className="text-xl" style={{ textShadow: '0 0 5px cyan' }}>🗡️</div>
              )}
              
              {/* Inventory Count Badge */}
              {(!isSword) && (
                <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md border border-black/50 ${
                  count > 0 ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {count}
                </span>
              )}

              {/* Number hint */}
              <span className="absolute bottom-0.5 left-1 text-[9px] font-mono font-bold text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                {i + 1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="absolute top-2 right-2 bg-black/50 text-white/90 text-[11px] p-3 rounded-lg backdrop-blur-sm pointer-events-none font-mono border border-white/10 hidden sm:block">
        <div className="font-bold text-yellow-400 mb-1">MİNECRAFT 2D</div>
        <div>[W,A,S,D] veya [Ok Tuşları] : Hareket</div>
        <div>[T] : Verity ile Chat</div>
        <div>[Sol Tık] : Blok Kır / Saldır</div>
        <div>[Sağ Tık] : Blok Koy</div>
        <div>[1-9] : Envanterden Seç</div>
      </div>
    </div>
  );
}
