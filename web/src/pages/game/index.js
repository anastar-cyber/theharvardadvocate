import { useEffect } from "react";
import Head from "next/head";

export default function GamePage() {
  useEffect(() => {
    // Inject styles
    const style = document.createElement("style");
    style.innerHTML = `
      #game-root { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; font-family: 'Cormorant Garamond', Georgia, serif; background: #03050e; z-index: 999; }
      #game-root canvas { display: block; position: absolute; top: 0; left: 0; }
      #game-root .float-word { position: absolute; pointer-events: none; font-style: italic; font-size: 1.1rem; color: #f0e0a0; text-shadow: 0 0 14px rgba(240,224,160,0.9); white-space: nowrap; z-index: 10; transform: translateX(-50%); animation: grise 1.8s ease forwards; }
      @keyframes grise { 0% { opacity:0; transform:translateX(-50%) translateY(0); } 15% { opacity:1; } 80% { opacity:1; transform:translateX(-50%) translateY(-40px); } 100% { opacity:0; transform:translateX(-50%) translateY(-55px); } }
      #game-root #hint { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); font-style: italic; font-size: 0.9rem; color: rgba(200,188,155,0.45); letter-spacing: 0.07em; pointer-events: none; white-space: nowrap; z-index: 10; }
      #game-root #counter { position: absolute; top: 1.4rem; right: 1.8rem; font-style: italic; font-size: 0.8rem; color: rgba(200,188,155,0.3); letter-spacing: 0.1em; z-index: 10; }
      #game-root #poem-title { position: absolute; top: 1.4rem; left: 1.8rem; font-style: italic; font-size: 0.8rem; color: rgba(200,188,155,0.3); letter-spacing: 0.1em; z-index: 10; max-width: 50vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #game-root #collection-btn { position: absolute; bottom: 1.4rem; right: 1.8rem; font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 0.8rem; color: rgba(200,148,58,0.4); letter-spacing: 0.1em; z-index: 10; background: none; border: none; cursor: pointer; transition: color 0.25s; }
      #game-root #collection-btn:hover { color: rgba(200,148,58,0.85); }
      #game-root #collection-btn .badge { display: inline-block; margin-left: 0.4em; background: rgba(200,148,58,0.18); border: 1px solid rgba(200,148,58,0.3); border-radius: 20px; padding: 0 0.5em; font-size: 0.75rem; color: rgba(200,148,58,0.55); }
      #game-root #overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(3,5,14,0); pointer-events: none; transition: background 1.2s ease; z-index: 20; }
      #game-root #overlay.active { background: rgba(3,5,14,0.88); pointer-events: all; }
      #game-root #poem-box { text-align: center; opacity: 0; transform: translateY(18px); transition: opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s; max-width: min(700px, 88vw); }
      #game-root #overlay.active #poem-box { opacity: 1; transform: translateY(0); }
      #game-root .pline { font-size: clamp(1.0rem, 2.4vw, 1.4rem); line-height: 2.1; color: rgba(228,218,192,0.9); letter-spacing: 0.03em; opacity: 0; transition: opacity 0.8s ease; }
      #game-root .pline.show { opacity: 1; }
      #game-root .pline em { color: #f0c84a; font-style: italic; }
      #game-root #poem-attribution { margin-top: 1.1rem; font-style: italic; font-size: 0.78rem; color: rgba(200,188,155,0.28); letter-spacing: 0.12em; opacity: 0; transition: opacity 0.8s ease 3.2s; }
      #game-root #overlay.active #poem-attribution { opacity: 1; }
      #game-root #btn-row { margin-top: 1.8rem; display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap; }
      #game-root #btn-next, #game-root #btn-collection-from-poem { display: inline-block; padding: 0.45rem 1.7rem; background: none; border: 1px solid rgba(200,148,58,0.35); color: rgba(200,148,58,0.6); font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 0.9rem; letter-spacing: 0.1em; cursor: pointer; opacity: 0; transition: opacity 0.8s ease 2.4s, background 0.2s, color 0.2s; }
      #game-root #overlay.active #btn-next, #game-root #overlay.active #btn-collection-from-poem { opacity: 1; }
      #game-root #btn-next:hover, #game-root #btn-collection-from-poem:hover { background: rgba(200,148,58,0.1); color: rgba(200,148,58,1); }
      #game-root #collection-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(3,5,14,0); pointer-events: none; transition: background 0.8s ease; z-index: 30; }
      #game-root #collection-panel.open { background: rgba(3,5,14,0.94); pointer-events: all; }
      #game-root #collection-inner { width: min(760px, 90vw); max-height: 80vh; opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s; display: flex; flex-direction: column; }
      #game-root #collection-panel.open #collection-inner { opacity: 1; transform: translateY(0); }
      #game-root #collection-header { display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid rgba(200,188,155,0.12); margin-bottom: 1.4rem; }
      #game-root #collection-header h2 { font-weight: 300; font-style: italic; font-size: clamp(1.3rem, 2.8vw, 1.7rem); color: rgba(228,218,192,0.7); letter-spacing: 0.08em; }
      #game-root #btn-close-collection, #game-root #btn-seek-from-collection { background: none; border: none; cursor: pointer; font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 0.85rem; color: rgba(200,148,58,0.5); letter-spacing: 0.1em; transition: color 0.2s; }
      #game-root #btn-close-collection:hover, #game-root #btn-seek-from-collection:hover { color: rgba(200,148,58,1); }
      #game-root #collection-scroll { overflow-y: auto; flex: 1; padding-right: 0.5rem; scrollbar-width: thin; scrollbar-color: rgba(200,148,58,0.2) transparent; }
      #game-root #collection-scroll::-webkit-scrollbar { width: 3px; }
      #game-root #collection-scroll::-webkit-scrollbar-thumb { background: rgba(200,148,58,0.2); border-radius: 2px; }
      #game-root .collection-entry { padding: 1.3rem 0; border-bottom: 1px solid rgba(200,188,155,0.07); animation: fadeIn 0.5s ease forwards; }
      #game-root .collection-entry:last-child { border-bottom: none; }
      @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      #game-root .col-poem-title { font-style: italic; font-size: 0.72rem; color: rgba(200,148,58,0.45); letter-spacing: 0.15em; margin-bottom: 0.4rem; }
      #game-root .col-poem-line { font-size: clamp(0.95rem, 2vw, 1.15rem); line-height: 2; color: rgba(228,218,192,0.75); letter-spacing: 0.03em; }
      #game-root .col-poem-line em { color: #f0c84a; font-style: italic; }
      #game-root .col-attribution { margin-top: 0.4rem; font-style: italic; font-size: 0.7rem; color: rgba(200,188,155,0.22); letter-spacing: 0.1em; }
      #game-root .collection-empty { text-align: center; font-style: italic; font-size: 1rem; color: rgba(200,188,155,0.2); padding: 3rem 0; letter-spacing: 0.08em; }
      #game-root .col-nav { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
      #game-root .col-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(200,148,58,0.12); border: 1px solid rgba(200,148,58,0.25); transition: background 0.3s; }
      #game-root .col-dot.found { background: rgba(200,148,58,0.55); }
    `;
    document.head.appendChild(style);

    // Run game logic
    const POEMS = [
      { title: 'star poetry', attribution: '', words: [ { word: 'silence', hint: 'the quietest star' }, { word: 'spills', hint: 'a star that overflows' }, { word: 'cold', hint: 'a distant, fading star' }, { word: 'light', hint: 'the oldest star' }, { word: 'we', hint: 'the star nearest home' }, { word: 'carry', hint: 'a wandering star' }, { word: 'on', hint: 'the smallest star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'its ',post:''},{i:3,pre:'',post:' —'} ], [ {i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:''} ] ] },
      { title: 'Ozymandias', attribution: '— Percy Bysshe Shelley, 1818', words: [ { word: 'My', hint: 'a possessive star' }, { word: 'name', hint: 'a named star' }, { word: 'is', hint: 'a present-tense star' }, { word: 'Ozymandias', hint: 'the king of stars' }, { word: 'king', hint: 'a royal star' }, { word: 'of', hint: 'a relational star' }, { word: 'kings', hint: 'a sovereign star' }, { word: 'Look', hint: 'an observing star' }, { word: 'on', hint: 'a facing star' }, { word: 'my', hint: 'a quiet possessive star' }, { word: 'Works', hint: 'a laboring star' }, { word: 'ye', hint: 'an ancient star' }, { word: 'Mighty', hint: 'a powerful star' }, { word: 'and', hint: 'a joining star' }, { word: 'despair', hint: 'a dark, falling star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:','},{i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:'!'} ], [ {i:7,pre:'',post:''},{i:8,pre:'',post:''},{i:9,pre:'',post:''},{i:10,pre:'',post:','},{i:11,pre:'',post:''},{i:12,pre:'',post:','},{i:13,pre:'',post:''},{i:14,pre:'',post:'!'} ] ] },
      { title: 'The Tyger', attribution: '— William Blake, 1794', words: [ { word: 'Tyger', hint: 'a burning star' }, { word: 'burning', hint: 'an incandescent star' }, { word: 'bright', hint: 'the brightest star' }, { word: 'In', hint: 'an interior star' }, { word: 'the', hint: 'a definite star' }, { word: 'forests', hint: 'a hidden star' }, { word: 'of', hint: 'a belonging star' }, { word: 'the', hint: 'a second definite star' }, { word: 'night', hint: 'the darkest star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:','} ], [ {i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:''},{i:7,pre:'',post:''},{i:8,pre:'',post:''} ] ] },
      { title: 'Ode to a Nightingale', attribution: '— John Keats, 1819', words: [ { word: 'Thou', hint: 'an ancient star' }, { word: 'wast', hint: 'a past-tense star' }, { word: 'not', hint: 'a negating star' }, { word: 'born', hint: 'a newborn star' }, { word: 'for', hint: 'a purposeful star' }, { word: 'death', hint: 'a fading star' }, { word: 'immortal', hint: 'an eternal star' }, { word: 'Bird', hint: 'a flying star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:'!'} ], [ {i:6,pre:'',post:''},{i:7,pre:'',post:'!'} ] ] },
      { title: 'I Wandered Lonely as a Cloud', attribution: '— William Wordsworth, 1807', words: [ { word: 'I', hint: 'the nearest star of all' }, { word: 'wandered', hint: 'a drifting star' }, { word: 'lonely', hint: 'a solitary star' }, { word: 'as', hint: 'a comparing star' }, { word: 'a', hint: 'a singular star' }, { word: 'cloud', hint: 'a veiled star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:''} ] ] },
      { title: 'Because I could not stop for Death', attribution: '— Emily Dickinson, c. 1863', words: [ { word: 'Because', hint: 'a reasoning star' }, { word: 'I', hint: 'the nearest star' }, { word: 'could', hint: 'a capable star' }, { word: 'not', hint: 'a refusing star' }, { word: 'stop', hint: 'a still star' }, { word: 'for', hint: 'a purposeful star' }, { word: 'Death', hint: 'a final star' }, { word: 'He', hint: 'an arriving star' }, { word: 'kindly', hint: 'a gentle star' }, { word: 'stopped', hint: 'a pausing star' }, { word: 'for', hint: 'a waiting star' }, { word: 'me', hint: 'a personal star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:' —'} ], [ {i:7,pre:'',post:''},{i:8,pre:'',post:''},{i:9,pre:'',post:''},{i:10,pre:'',post:''},{i:11,pre:'',post:''} ] ] },
      { title: 'Remember', attribution: '— Christina Rossetti, 1849', words: [ { word: 'Remember', hint: 'a remembering star' }, { word: 'me', hint: 'a personal star' }, { word: 'when', hint: 'a temporal star' }, { word: 'I', hint: 'the nearest star' }, { word: 'am', hint: 'a present star' }, { word: 'gone', hint: 'a vanished star' }, { word: 'away', hint: 'a distant star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:''} ] ] },
      { title: 'She Walks in Beauty', attribution: '— Lord Byron, 1815', words: [ { word: 'She', hint: 'a distant familiar star' }, { word: 'walks', hint: 'a moving star' }, { word: 'in', hint: 'an inner star' }, { word: 'beauty', hint: 'a luminous star' }, { word: 'like', hint: 'a comparing star' }, { word: 'the', hint: 'a definite star' }, { word: 'night', hint: 'the darkest star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:''} ] ] },
      { title: 'A Dream Within a Dream', attribution: '— Edgar Allan Poe, 1849', words: [ { word: 'All', hint: 'a total star' }, { word: 'that', hint: 'a pointing star' }, { word: 'we', hint: 'the star nearest home' }, { word: 'see', hint: 'an observing star' }, { word: 'or', hint: 'an alternating star' }, { word: 'seem', hint: 'an illusory star' }, { word: 'Is', hint: 'a present-tense star' }, { word: 'but', hint: 'a limiting star' }, { word: 'a', hint: 'a singular star' }, { word: 'dream', hint: 'a sleeping star' }, { word: 'within', hint: 'an interior star' }, { word: 'a', hint: 'another singular star' }, { word: 'dream', hint: 'a deeper sleeping star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:''} ], [ {i:6,pre:'',post:''},{i:7,pre:'',post:''},{i:8,pre:'',post:''},{i:9,pre:'',post:''},{i:10,pre:'',post:''},{i:11,pre:'',post:''},{i:12,pre:'',post:'.'} ] ] },
      { title: 'Crossing the Bar', attribution: '— Alfred Lord Tennyson, 1889', words: [ { word: 'Sunset', hint: 'a fading star' }, { word: 'and', hint: 'a joining star' }, { word: 'evening', hint: 'a dusk star' }, { word: 'star', hint: 'a star naming itself' }, { word: 'And', hint: 'a second joining star' }, { word: 'one', hint: 'a lone star' }, { word: 'clear', hint: 'a bright clear star' }, { word: 'call', hint: 'a calling star' }, { word: 'for', hint: 'a purposeful star' }, { word: 'me', hint: 'a personal star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:','} ], [ {i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:''},{i:7,pre:'',post:''},{i:8,pre:'',post:''},{i:9,pre:'',post:'!'} ] ] },
      { title: 'O Captain! My Captain!', attribution: '— Walt Whitman, 1865', words: [ { word: 'O', hint: 'an exclaiming star' }, { word: 'Captain', hint: 'a leading star' }, { word: 'my', hint: 'a possessive star' }, { word: 'Captain', hint: 'a loyal star' }, { word: 'our', hint: 'a shared star' }, { word: 'fearful', hint: 'a trembling star' }, { word: 'trip', hint: 'a voyaging star' }, { word: 'is', hint: 'a present star' }, { word: 'done', hint: 'a finished star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:'!'},{i:2,pre:'',post:''},{i:3,pre:'',post:'!'} ], [ {i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:''},{i:7,pre:'',post:''},{i:8,pre:'',post:'.'} ] ] },
      { title: 'Invictus', attribution: '— William Ernest Henley, 1875', words: [ { word: 'I', hint: 'the nearest star of all' }, { word: 'am', hint: 'a being star' }, { word: 'the', hint: 'a definite star' }, { word: 'master', hint: 'a commanding star' }, { word: 'of', hint: 'a belonging star' }, { word: 'my', hint: 'a possessive star' }, { word: 'fate', hint: 'a fixed star' }, { word: 'the', hint: 'another definite star' }, { word: 'captain', hint: 'a leading star' }, { word: 'of', hint: 'another belonging star' }, { word: 'my', hint: 'another possessive star' }, { word: 'soul', hint: 'the innermost star' } ], lines: [ [ {i:0,pre:'',post:''},{i:1,pre:'',post:''},{i:2,pre:'',post:''},{i:3,pre:'',post:''},{i:4,pre:'',post:''},{i:5,pre:'',post:''},{i:6,pre:'',post:','} ], [ {i:7,pre:'',post:''},{i:8,pre:'',post:''},{i:9,pre:'',post:''},{i:10,pre:'',post:''},{i:11,pre:'',post:'.'} ] ] }
    ];

    const root = document.getElementById('game-root');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    let bgStars = [], hidden = [], found = [];
    let currentPoemIdx = 0, collectedPoems = [], collectionOpen = false, overlayOpen = false;

    function buildBg() {
      bgStars = [];
      const n = Math.floor(W * H / 2800);
      for (let i = 0; i < n; i++) bgStars.push({ x: Math.random()*W, y: Math.random()*H*0.9, r: 0.3+Math.random()*1.0, b: 0.3+Math.random()*0.7, ph: Math.random()*6.28, sp: 0.5+Math.random()*1.5 });
    }

    function buildHidden() {
      hidden = POEMS[currentPoemIdx].words.map((pw, i) => ({ idx: i, word: pw.word, hint: pw.hint, x: (0.1+Math.random()*0.8)*W, y: (0.07+Math.random()*0.72)*H, found: false, hovered: false }));
    }

    function drawBg() {
      const g = ctx.createRadialGradient(W*0.5,0,0,W*0.5,H*0.4,H);
      g.addColorStop(0,'#0b1525'); g.addColorStop(0.6,'#060a16'); g.addColorStop(1,'#02030b');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      const mw = ctx.createLinearGradient(W*0.25,0,W*0.75,H);
      mw.addColorStop(0,'rgba(70,90,150,0)'); mw.addColorStop(0.5,'rgba(70,90,150,0.05)'); mw.addColorStop(1,'rgba(70,90,150,0)');
      ctx.fillStyle=mw; ctx.fillRect(0,0,W,H);
      const hz = ctx.createLinearGradient(0,H*0.8,0,H);
      hz.addColorStop(0,'rgba(2,3,11,0)'); hz.addColorStop(1,'rgba(2,3,11,1)');
      ctx.fillStyle=hz; ctx.fillRect(0,0,W,H);
    }

    function drawBgStar(s, t) {
      const tw = 0.65+0.35*Math.sin(t*s.sp+s.ph);
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.28);
      ctx.fillStyle='rgba(215,210,192,'+(s.b*tw)+')'; ctx.fill();
    }

    function drawHidden(s) {
      const col = s.found ? '125,198,125' : '208,172,75';
      const gSize = s.hovered ? 22 : (s.found ? 12 : 10);
      const gA = s.found ? 0.22 : (s.hovered ? 0.55 : 0.36);
      const cSize = s.hovered ? 3.8 : (s.found ? 2.5 : 2.9);
      const g = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,gSize);
      g.addColorStop(0,'rgba('+col+','+gA+')'); g.addColorStop(1,'rgba('+col+',0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s.x,s.y,gSize,0,6.28); ctx.fill();
      ctx.beginPath(); ctx.arc(s.x,s.y,cSize,0,6.28);
      ctx.fillStyle = s.found ? 'rgba(155,228,155,0.75)' : (s.hovered ? 'rgba(255,226,105,1)' : 'rgba(235,206,90,0.9)');
      ctx.fill();
      if (!s.found) {
        const len = s.hovered ? 8 : 5;
        ctx.strokeStyle = s.hovered ? 'rgba(255,226,105,0.5)' : 'rgba(235,206,90,0.27)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(s.x-len,s.y); ctx.lineTo(s.x+len,s.y);
        ctx.moveTo(s.x,s.y-len); ctx.lineTo(s.x,s.y+len);
        ctx.stroke();
      }
    }

    let rafId;
    function loop(ts) {
      const t = ts/1000;
      ctx.clearRect(0,0,W,H);
      drawBg();
      bgStars.forEach(s => drawBgStar(s,t));
      hidden.forEach(s => drawHidden(s));
      rafId = requestAnimationFrame(loop);
    }

    function hit(mx, my) {
      return hidden.find(s => !s.found && Math.hypot(s.x-mx, s.y-my) < 20) || null;
    }

    canvas.addEventListener('mousemove', e => {
      if (overlayOpen || collectionOpen) return;
      const h = hit(e.clientX, e.clientY);
      hidden.forEach(s => s.hovered = false);
      if (h) h.hovered = true;
      document.getElementById('game-hint').textContent = h ? h.hint : '';
      canvas.style.cursor = h ? 'pointer' : 'default';
    });

    canvas.addEventListener('click', e => {
      if (overlayOpen || collectionOpen) return;
      discover(hit(e.clientX, e.clientY));
    });

    canvas.addEventListener('touchstart', e => {
      if (overlayOpen || collectionOpen) return;
      e.preventDefault();
      const t = e.touches[0];
      discover(hit(t.clientX, t.clientY));
    }, { passive: false });

    function discover(s) {
      if (!s) return;
      s.found = true; s.hovered = false;
      found.push(s.idx);
      document.getElementById('game-hint').textContent = '';
      updateCounter();
      floatWord(s.x, s.y, s.word);
      if (found.length === POEMS[currentPoemIdx].words.length) setTimeout(showPoem, 1200);
    }

    function updateCounter() {
      document.getElementById('game-counter').textContent = found.length + ' / ' + POEMS[currentPoemIdx].words.length;
    }

    function floatWord(x, y, word) {
      const el = document.createElement('div');
      el.className = 'float-word';
      el.textContent = word;
      el.style.left = x+'px'; el.style.top = (y-6)+'px';
      root.appendChild(el);
      setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 1900);
    }

    function showPoem() {
      overlayOpen = true;
      const poem = POEMS[currentPoemIdx];
      const container = document.getElementById('game-poem-lines');
      container.innerHTML = '';
      poem.lines.forEach((parts, li) => {
        const div = document.createElement('div');
        div.className = 'pline';
        div.innerHTML = parts.map(p => p.pre+'<em>'+poem.words[p.i].word+'</em>'+p.post).join(' ');
        container.appendChild(div);
        setTimeout(() => div.classList.add('show'), 700+li*850);
      });
      document.getElementById('game-poem-attribution').textContent = poem.attribution;
      document.getElementById('game-overlay').classList.add('active');
      if (!collectedPoems.includes(currentPoemIdx)) { collectedPoems.push(currentPoemIdx); updateCollectionBadge(); }
      document.getElementById('game-btn-next').textContent = currentPoemIdx < POEMS.length-1 ? 'next poem →' : 'seek again';
    }

    function closePoem() {
      overlayOpen = false;
      document.getElementById('game-overlay').classList.remove('active');
    }

    function resetPoem() {
      found = []; buildHidden(); updateCounter();
      document.getElementById('game-poem-title').textContent = POEMS[currentPoemIdx].title;
    }

    function updateCollectionBadge() {
      document.getElementById('game-col-badge').textContent = collectedPoems.length+' / '+POEMS.length;
      renderCollectionNav();
    }

    function openCollection() {
      collectionOpen = true;
      renderCollectionEntries(); renderCollectionNav();
      document.getElementById('game-collection-panel').classList.add('open');
      canvas.style.cursor = 'default';
      document.getElementById('game-hint').textContent = '';
    }

    function closeCollection() {
      collectionOpen = false;
      document.getElementById('game-collection-panel').classList.remove('open');
    }

    function renderCollectionNav() {
      const nav = document.getElementById('game-col-nav');
      nav.innerHTML = '';
      POEMS.forEach((poem, i) => {
        const dot = document.createElement('div');
        dot.className = 'col-dot'+(collectedPoems.includes(i) ? ' found' : '');
        dot.title = poem.title;
        nav.appendChild(dot);
      });
    }

    function renderCollectionEntries() {
      const container = document.getElementById('game-collection-entries');
      container.innerHTML = '';
      if (collectedPoems.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'collection-empty';
        empty.textContent = 'no poems gathered yet — seek the stars';
        container.appendChild(empty); return;
      }
      collectedPoems.forEach(poemIdx => {
        const poem = POEMS[poemIdx];
        const entry = document.createElement('div');
        entry.className = 'collection-entry';
        const titleEl = document.createElement('div');
        titleEl.className = 'col-poem-title';
        titleEl.textContent = poem.title;
        entry.appendChild(titleEl);
        poem.lines.forEach(parts => {
          const lineEl = document.createElement('div');
          lineEl.className = 'col-poem-line';
          lineEl.innerHTML = parts.map(p => p.pre+'<em>'+poem.words[p.i].word+'</em>'+p.post).join(' ');
          entry.appendChild(lineEl);
        });
        if (poem.attribution) {
          const attr = document.createElement('div');
          attr.className = 'col-attribution';
          attr.textContent = poem.attribution;
          entry.appendChild(attr);
        }
        container.appendChild(entry);
      });
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    const onResize = () => { resize(); buildBg(); buildHidden(); found = []; updateCounter(); };
    window.addEventListener('resize', onResize);

    document.getElementById('game-btn-next').addEventListener('click', () => {
      closePoem();
      if (currentPoemIdx < POEMS.length-1) currentPoemIdx++;
      resetPoem();
    });
    document.getElementById('game-btn-collection-from-poem').addEventListener('click', () => { closePoem(); openCollection(); });
    document.getElementById('game-collection-btn').addEventListener('click', openCollection);
    document.getElementById('game-btn-close-collection').addEventListener('click', closeCollection);
    document.getElementById('game-btn-seek-from-collection').addEventListener('click', () => { closeCollection(); resetPoem(); });

    resize(); buildBg(); buildHidden();
    document.getElementById('game-poem-title').textContent = POEMS[0].title;
    updateCounter(); updateCollectionBadge();
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Star Poetry — The Harvard Advocate</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div id="game-root">
        <canvas id="game-canvas" />
        <div id="game-hint" />
        <div id="game-poem-title" />
        <div id="game-counter">0 / 0</div>
        <button id="game-collection-btn">collection <span className="badge" id="game-col-badge">0 / 11</span></button>

        <div id="game-overlay">
          <div id="poem-box">
            <div id="game-poem-lines" />
            <div id="game-poem-attribution" />
            <div id="btn-row">
              <button id="game-btn-collection-from-poem">collection</button>
              <button id="game-btn-next">next poem →</button>
            </div>
          </div>
        </div>

        <div id="game-collection-panel">
          <div id="collection-inner">
            <div id="collection-header">
              <h2>gathered poems</h2>
              <div style={{ display:'flex', gap:'1rem', alignItems:'baseline' }}>
                <button id="game-btn-seek-from-collection">seek</button>
                <button id="game-btn-close-collection">close</button>
              </div>
            </div>
            <div className="col-nav" id="game-col-nav" />
            <div id="collection-scroll">
              <div id="game-collection-entries" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

