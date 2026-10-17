import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

/* ─────────────────────────────────────────────
   CONFIG
──────────────────────────────────────────────*/
const SIS_NAME      = "Maitri";
const BROTHER_NAME  = "Ayaan";
const BIRTHDAY_DATE = new Date('2026-10-17'); // October 17

/* ─── Falling leaves ──────────────────────── */
const LEAVES = [
  { e:'🍁', lft:'3%',  sz:'2rem',   dur:'11s', del:'0s',   sw:'60px'  },
  { e:'🍂', lft:'9%',  sz:'1.6rem', dur:'14s', del:'1.8s', sw:'-55px' },
  { e:'🍁', lft:'16%', sz:'2.3rem', dur:'12s', del:'3.2s', sw:'80px'  },
  { e:'🍂', lft:'23%', sz:'1.8rem', dur:'10s', del:'0.6s', sw:'-70px' },
  { e:'🍁', lft:'30%', sz:'2.1rem', dur:'13s', del:'2.4s', sw:'50px'  },
  { e:'🍂', lft:'38%', sz:'1.5rem', dur:'15s', del:'4s',   sw:'-40px' },
  { e:'🍁', lft:'46%', sz:'2.4rem', dur:'11s', del:'1s',   sw:'65px'  },
  { e:'🍂', lft:'54%', sz:'1.9rem', dur:'13s', del:'2.8s', sw:'-60px' },
  { e:'🍁', lft:'62%', sz:'2.2rem', dur:'12s', del:'0.4s', sw:'75px'  },
  { e:'🍂', lft:'69%', sz:'1.7rem', dur:'14s', del:'3.6s', sw:'-50px' },
  { e:'🍁', lft:'77%', sz:'2rem',   dur:'10s', del:'1.4s', sw:'55px'  },
  { e:'🍂', lft:'84%', sz:'2.3rem', dur:'16s', del:'2s',   sw:'-80px' },
  { e:'🍁', lft:'91%', sz:'1.6rem', dur:'12s', del:'4.8s', sw:'45px'  },
  { e:'🍂', lft:'97%', sz:'2.1rem', dur:'11s', del:'0.9s', sw:'-65px' },
];

/* ─── Floating emojis ─────────────────────── */
const FLOATS = [
  { e:'😊',  et:'7%',  el:'4%',  esz:'2.1rem', ed:'7s',  edl:'0s'   },
  { e:'❤️',  et:'12%', el:'87%', esz:'2.3rem', ed:'9s',  edl:'1.2s' },
  { e:'🤩',  et:'20%', el:'8%',  esz:'1.9rem', ed:'8s',  edl:'2.5s' },
  { e:'💛',  et:'28%', el:'91%', esz:'2rem',   ed:'6s',  edl:'0.4s' },
  { e:'🥰',  et:'38%', el:'5%',  esz:'2.4rem', ed:'10s', edl:'3.1s' },
  { e:'💕',  et:'45%', el:'93%', esz:'1.8rem', ed:'8s',  edl:'1.8s' },
  { e:'😄',  et:'55%', el:'6%',  esz:'2rem',   ed:'11s', edl:'0.7s' },
  { e:'🧡',  et:'62%', el:'88%', esz:'2.2rem', ed:'9s',  edl:'2.2s' },
  { e:'🎉',  et:'72%', el:'10%', esz:'2.1rem', ed:'7s',  edl:'4s'   },
  { e:'💖',  et:'15%', el:'47%', esz:'1.7rem', ed:'8s',  edl:'3.5s' },
  { e:'✨',  et:'80%', el:'82%', esz:'1.9rem', ed:'6s',  edl:'1s'   },
  { e:'😜',  et:'68%', el:'40%', esz:'2rem',   ed:'9s',  edl:'2s'   },
  { e:'🌟',  et:'33%', el:'74%', esz:'1.8rem', ed:'7s',  edl:'0.3s' },
  { e:'🤗',  et:'48%', el:'55%', esz:'2.1rem', ed:'10s', edl:'4.2s' },
];

/* ─── Tulips ──────────────────────────────── */
const TULIPS = [
  { e:'🌷', ts:'3s',   td:'0s',   tsz:'2.8rem' },
  { e:'🌸', ts:'3.5s', td:'0.4s', tsz:'2.3rem' },
  { e:'🌺', ts:'2.8s', td:'0.8s', tsz:'2.5rem' },
  { e:'🌷', ts:'3.2s', td:'1.2s', tsz:'3rem'   },
  { e:'🌻', ts:'2.6s', td:'0.2s', tsz:'2.6rem' },
  { e:'🌷', ts:'3.4s', td:'0.6s', tsz:'2.4rem' },
  { e:'🌸', ts:'2.9s', td:'1s',   tsz:'2.7rem' },
  { e:'🌺', ts:'3.1s', td:'0.3s', tsz:'2.2rem' },
  { e:'🌷', ts:'2.7s', td:'1.4s', tsz:'2.9rem' },
];

/* ─── Particle emojis for click burst ─────── */
const BURST_EMOJIS = ['🍁','🍂','❤️','🌷','✨','💛','🧡','💖'];

/* ─── Vibes chips ─────────────────────────── */
const VIBES = [
  { icon:'🍁', label:'October 17th', sub:'Birthday' },
  { icon:'👑', label:'Autumn Queen',  sub:'Forever'       },
  { icon:'💕', label:'Best Sister',   sub:'In The World'  },
  { icon:'🌷', label:'Tulip Power',   sub:'Always Blooming'},
];

/* ─── Candle config ───────────────────────── */
const CANDLES_COUNT = 6;

/* ══════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════ */

/* Typewriter effect */
function useTypewriter(text, speed = 90, startDelay = 800) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* Birthday countdown (days until Oct 17) */
function useBirthdayCountdown(targetMonth = 9, targetDay = 17) {
  const [status, setStatus] = useState({ days: null, isToday: false });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const isToday = now.getMonth() === targetMonth && now.getDate() === targetDay;

      if (isToday) {
        setStatus({ days: 0, isToday: true });
        return;
      }

      let target = new Date(currentYear, targetMonth, targetDay, 0, 0, 0);
      const todayStart = new Date(currentYear, now.getMonth(), now.getDate(), 0, 0, 0);

      if (target < todayStart) {
        target = new Date(currentYear + 1, targetMonth, targetDay, 0, 0, 0);
      }

      const diffTime = target - todayStart;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      setStatus({ days: diffDays, isToday: false });
    };

    calc();
    const t = setInterval(calc, 60_000);
    return () => clearInterval(t);
  }, [targetMonth, targetDay]);

  return status;
}

/* ══════════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════════ */
function fireConfetti() {
  const colors = ['#e67e22','#f1c40f','#c0392b','#e91e8c','#9b59b6','#27ae60','#e74c3c'];
  const end    = Date.now() + 4000;
  (function frame() {
    confetti({ particleCount:5, angle:60,  spread:65, origin:{x:0}, colors });
    confetti({ particleCount:5, angle:120, spread:65, origin:{x:1}, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/* ══════════════════════════════════════════════
   APP
══════════════════════════════════════════════ */
export default function App() {
  const [modal,       setModal]       = useState(false);
  const [particles,   setParticles]   = useState([]);
  const [candles,     setCandles]     = useState(Array(CANDLES_COUNT).fill(true)); // true = lit
  const [allBlown,    setAllBlown]    = useState(false);
  const [toastMsg,    setToastMsg]    = useState('');
  const [isPlaying,   setIsPlaying]   = useState(false);
  const audioRef                      = useRef(null);
  const userToggledRef                = useRef(false);
  const particleId                    = useRef(0);
  const { days: daysLeft, isToday }   = useBirthdayCountdown(9, 17); // October 17
  const { displayed: typedName, done: typingDone } = useTypewriter(SIS_NAME, 100, 1000);

  // Preview mode via URL param (?preview=bday or ?bday=today)
  const isBdayPreview = typeof window !== 'undefined' && 
    (new URLSearchParams(window.location.search).get('preview') === 'bday' ||
     new URLSearchParams(window.location.search).get('bday') === 'today');
  const isBdayMode = isToday || isBdayPreview;

  /* ── Auto Confetti Burst on Birthday Day ── */
  useEffect(() => {
    if (isBdayMode) {
      const timer = setTimeout(() => {
        fireConfetti();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isBdayMode]);

  /* ── Background Music Autoplay on website open ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;

    // Try autoplay when page opens
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy until interaction
          setIsPlaying(false);
        });
    }

    // Play on first user interaction if blocked
    const handleFirstInteraction = () => {
      if (!userToggledRef.current && audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  /* ── Music Toggle (Turn Music Off/On) ── */
  const toggleMusic = (e) => {
    e.stopPropagation();
    userToggledRef.current = true;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      showToast('Music Off 🔇');
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        showToast('Music Playing 🎵 (October 17th)');
      }).catch(err => {
        console.error('Audio playback error:', err);
      });
    }
  };

  /* ── Show toast ── */
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  }, []);

  /* ── Click-anywhere particle burst ── */
  const handlePageClick = useCallback((e) => {
    // Don't fire inside modal
    if (e.target.closest('.overlay')) return;

    const id     = particleId.current++;
    const emoji  = BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];
    const count  = 6 + Math.floor(Math.random() * 5);
    const items  = Array.from({ length: count }).map((_, k) => ({
      id:    `${id}-${k}`,
      emoji,
      x:     e.clientX,
      y:     e.clientY,
      angle: (360 / count) * k,
    }));

    setParticles(prev => [...prev, ...items]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !items.map(i => i.id).includes(p.id)));
    }, 900);
  }, []);

  /* ── Blow out candle ── */
  const blowCandle = (idx) => {
    if (!candles[idx]) return;
    const next = [...candles];
    next[idx] = false;
    setCandles(next);
    if (next.every(c => !c)) {
      setAllBlown(true);
      showToast('All candles blown! 🎂✨');
      fireConfetti();
    }
  };

  /* ── Open surprise ── */
  const openSurprise = () => {
    fireConfetti();
    setModal(true);
    setCandles(Array(CANDLES_COUNT).fill(true));
    setAllBlown(false);
  };

  /* ── Countdown label: on bday only todaay bday day tadda!! ── */
  const countdownLabel =
    isBdayMode
      ? `🎉 TADAAA!! It's Your Birthday Today! Happy Birthday ${SIS_NAME}! 🎂🥳✨`
      : daysLeft === null
      ? ''
      : daysLeft === 0
      ? `🎉 TADAAA!! It's Your Birthday Today! Happy Birthday ${SIS_NAME}! 🎂🥳✨`
      : daysLeft === 1
      ? "🎉 TOMORROW is your Birthday! Almost there! 🍁✨"
      : `🍁 ${daysLeft} Days Until Your Birthday!`;

  return (
    <div className="root-wrap" onClick={handlePageClick}>

      {/* ── Fixed Background ── */}
      <div className="bg-layer" />
      <div className="bg-overlay" />

      {/* ── Click Particle Bursts ── */}
      {particles.map(p => (
        <span
          key={p.id}
          className="burst-particle"
          style={{
            left:  p.x,
            top:   p.y,
            '--angle': `${p.angle}deg`,
          }}
        >{p.emoji}</span>
      ))}

      {/* ── Toast Notification ── */}
      {toastMsg && (
        <div className="toast">{toastMsg}</div>
      )}

      {/* ── Falling Leaves ── */}
      <div className="leaves-wrap">
        {LEAVES.map((l, i) => (
          <span key={i} className="leaf" style={{
            '--sz': l.sz, '--dur': l.dur, '--del': l.del,
            '--sw': l.sw, left: l.lft,
          }}>{l.e}</span>
        ))}
      </div>

      {/* ── Floating Emojis ── */}
      <div className="emojis-wrap">
        {FLOATS.map((f, i) => (
          <span key={i} className="flt" style={{
            '--et': f.et, '--el': f.el, '--esz': f.esz,
            '--ed': f.ed, '--edl': f.edl,
            top: f.et, left: f.el,
          }}>{f.e}</span>
        ))}
      </div>

      {/* ── Background Audio ── */}
      <audio
        ref={audioRef}
        src="/October_Seventeenth.mp3"
        loop
        preload="auto"
      />

      {/* ── Floating Music Control Button ── */}
      <button
        className={`music-btn ${isPlaying ? 'is-playing' : 'is-paused'}`}
        onClick={toggleMusic}
        title={isPlaying ? "Turn Music OFF" : "Turn Music ON (October 17th)"}
        aria-label={isPlaying ? "Music Off" : "Music On"}
      >
        <span className="music-btn-icon">{isPlaying ? '🎵' : '🔇'}</span>
        <span className="music-btn-text">{isPlaying ? 'Music ON' : 'Music OFF'}</span>
        {isPlaying && (
          <span className="music-bars">
            <span className="bar b1" />
            <span className="bar b2" />
            <span className="bar b3" />
          </span>
        )}
      </button>

      {/* ═══════════════════════════
           PAGE CONTENT
      ═══════════════════════════ */}
      <div className="page">

        {/* ① COUNTDOWN BANNER */}
        {countdownLabel && (
          <div className={`countdown-strip ${isBdayMode ? 'is-today' : ''}`}>
            <span className="countdown-text">{countdownLabel}</span>
          </div>
        )}

        {/* ② HBD BANNER */}
        <div className="banner-wrap">
          <div className="banner">
            <div className="banner-inner">
              <div className="hbd-title">
                <span className="leaf-deco">🍁</span>
                Happy Birthday!
                <span className="leaf-deco">🍂</span>
              </div>
              <p className="banner-sub">October 17th &nbsp;•&nbsp; Autumn Queen 👑</p>
            </div>
          </div>
        </div>

        {/* ③ PHOTO FRAME + CUTE GIF BUDDIES */}
        <div className="photo-section">
          <div className="photo-row">
            {/* Cute Kitten GIF Buddy (Left) */}
            <div className="gif-buddy left-buddy">
              <img src="/cute_kitten.gif" alt="Cute Birthday Kitten" className="buddy-img" />
              <span className="buddy-bubble">HBD Maitri! 🐾🎂</span>
            </div>

            {/* Central Photo Frame */}
            <div className="photo-frame">
              <div className="photo-inner">
                <img src="/sis.jpeg" alt={SIS_NAME} />
              </div>
            </div>

            {/* Cute Dancing Cat GIF Buddy (Right) */}
            <div className="gif-buddy right-buddy">
              <img src="/dancing_cat.gif" alt="Dancing Cat" className="buddy-img" />
              <span className="buddy-bubble">Party Time! 💃✨</span>
            </div>
          </div>

          <div className="name-badge">
            ✨&nbsp;
            <span className="typed-name">{typedName}</span>
            {!typingDone && <span className="cursor-blink">|</span>}
            &nbsp;✨
          </div>
          <div className="date-chip">🍁 Born in October &nbsp;•&nbsp; Autumn Baby 🍂</div>
        </div>

        {/* ④ TULIP ROW */}
        <div className="tulip-strip">
          {TULIPS.map((t, i) => (
            <span key={i} className="t-item"
              style={{ '--ts': t.ts, '--td': t.td, '--tsz': t.tsz }}
            >{t.e}</span>
          ))}
        </div>

        {/* ⑤ VIBES CHIPS */}
        <div className="vibes-row">
          {VIBES.map((v, i) => (
            <div key={i} className="vibe-chip">
              <span className="vc-icon">{v.icon}</span>
              <strong>{v.label}</strong>
              <span className="vc-label">{v.sub}</span>
            </div>
          ))}
        </div>

        {/* ⑥ SURPRISE BUTTON WITH CUTE MASCOT */}
        <div className="btn-wrap">
          <div className="mascot-badge">
            <img src="/mewmew.gif" alt="Cute Mascot" className="mascot-img" />
            <span className="mascot-bubble">Tap below for your gift! 🎁👇</span>
          </div>

          <button className="surprise-btn" onClick={(e) => { e.stopPropagation(); openSurprise(); }}>
            🎁 Open Your Surprise! 🎉
          </button>
          <span className="btn-hint">tap anywhere on screen to burst autumn leaves ✨</span>
        </div>

        {/* ⑦ FOOTER */}
        <div className="footer">
          Made with ❤️ by {BROTHER_NAME} &nbsp;•&nbsp; Happy Birthday {SIS_NAME}! 🍂🌷
        </div>
      </div>

      {/* ═══════════════════════════
           MODAL
      ═══════════════════════════ */}
      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(false)}>✕</button>

            <div className="modal-leaf-strip">🍁 🌷 🍂 🌺 🍁</div>
            <h2>🎂 A Little Note For You 🎂</h2>

            <img src="/chibi_bday2.jpg" alt="Chibi birthday girl" className="modal-chibi-main" />

            {/* Cute GIF Celebration Squad in Modal */}
            <div className="modal-gifs-row">
              <div className="modal-gif-card">
                <img src="/cat_cake.gif" alt="Birthday Cat" className="modal-gif-img" />
                <span className="modal-gif-caption">Birthday Cake! 🎂</span>
              </div>
              <div className="modal-gif-card">
                <img src="/mewmew.gif" alt="Mewmew celebration" className="modal-gif-img" />
                <span className="modal-gif-caption">Yay Maitri! 💕</span>
              </div>
              <div className="modal-gif-card">
                <img src="/dancing_cat.gif" alt="Dancing Cat celebration" className="modal-gif-img" />
                <span className="modal-gif-caption">Dance Time! 🥳</span>
              </div>
            </div>

            {/* Blowable Candles */}
            <div className="candles-section">
              <p className="candles-label">
                {allBlown
                  ? '🎉 Happy Birthday Maitri! 🎉'
                  : 'Click each candle to blow it out! 🎂'}
              </p>
              <div className="candles-row">
                {candles.map((lit, i) => (
                  <button
                    key={i}
                    className={`candle-btn ${lit ? 'lit' : 'out'}`}
                    onClick={(e) => { e.stopPropagation(); blowCandle(i); }}
                    title={lit ? 'Blow out!' : 'Blown out!'}
                  >
                    <span className="candle-flame">{lit ? '🕯️' : '🕳️'}</span>
                  </button>
                ))}
              </div>
              {allBlown && <div className="wish-sparkle">✨ May all your dreams come true! ✨</div>}
            </div>

            <div className="modal-msg-box">
              <p className="modal-msg">
                Dear {SIS_NAME}, 🍂<br /><br />
                You are the most amazing, kind, and wonderful sister anyone could ever ask for. 🥰<br /><br />
                Just like the vibrant autumn leaves 🍁🍂 swirling in October — you bring warmth,
                color, and happiness to everyone around you.<br /><br />
                And just like these colorful blooming tulips 🌷🌺 —
                you are strong, bright, and truly one of a kind.<br /><br />
                Thank you for always being there, sharing endless laughs, and tolerating
                all my annoying brother antics 😜💕<br /><br />
                May your special day and the year ahead be filled with unlimited smiles, pure joy, and everything you deserve! 🎉✨<br /><br />
                <strong>Love you always, {BROTHER_NAME} 🌙❤️</strong>
              </p>
            </div>

            <img src="/chibi_siblings.jpg" alt="Sibling chibi hug" className="modal-chibi-bottom" />

            <div className="modal-emoji-row">🍁 🌷 💖 🎂 🥳 ✨ 🤗 🍂</div>
          </div>
        </div>
      )}
    </div>
  );
}
