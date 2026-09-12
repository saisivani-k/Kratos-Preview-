/* =========================================================
   KRATOS — ACE INTERFACE 01

   awaiting cartridge
     → insert
     → campus scan   (coding / cat exam / assessment / project)
     → undefined signal
     → target lock
     → EASWARI ENGINEERING COLLEGE + ACCESS GRANTED
     → loading (about 3.5s)
     → intro video   (assets/intro.mp4, optional)
     → reveal page   (BE READY → KRATOS → COMING SOON)
   ========================================================= */

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const el = {
  hud:$('hud'), hudDot:$('hud-dot'), hudStat:$('hud-status'),
  rig:$('rig'), console:$('console'), tab:$('tab'), port:$('port'),
  seated:$('seated'), pillFill:$('pill-fill'),

  cart:$('cart'), cartHint:$('cart-hint'), cartBtn:$('cart-btn'),

  lAwait:$('l-await'), lMap:$('l-map'), lLoad:$('l-load'),

  signals:$('signals'), coords:$('coords'), detected:$('detected'),
  pin:$('pin'), place:$('place'), granted:$('granted'),

  loadHd:$('load-hd'), loadBig:$('load-big'),
  loadFill:$('load-fill'), loadSb:$('load-sb'),

  flash:$('flash'),
  stageVideo:$('stage-video'), intro:$('intro'), skip:$('skip'), sound:$('sound'),
  stageRev:$('stage-reveal'), particles:$('particles'),
  beReady:$('be-ready'), kratos:$('kratos'), soon:$('soon'), soonSub:$('soon-sub'),

  replay:$('replay')
};

/* =========================================================
   CARTRIDGE DRAG
   ========================================================= */
let dragging = false, inserted = false, sx = 0, sy = 0;

el.cart.addEventListener('pointerdown', (e) => {
  if (inserted) return;
  dragging = true;
  el.cart.setPointerCapture(e.pointerId);
  el.cart.classList.add('dragging');
  sx = e.clientX; sy = e.clientY;
  el.cartHint.classList.add('gone');
});

el.cart.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - sx, dy = e.clientY - sy;
  el.cart.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.015}deg)`;
  el.port.classList.toggle('hot', near());
});

el.cart.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  el.cart.classList.remove('dragging');

  if (near()) {
    insert();
  } else {
    el.cart.style.transition = 'transform .42s cubic-bezier(.3,1.4,.5,1)';
    el.cart.style.transform = '';
    setTimeout(() => el.cart.style.transition = '', 440);
    el.port.classList.remove('hot');
    el.cartHint.classList.remove('gone');
  }
});

el.cartBtn.addEventListener('click', () => { if (!inserted) insert(); });
el.cart.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && !inserted) { e.preventDefault(); insert(); }
});

function near() {
  const a = el.cart.getBoundingClientRect(), b = el.port.getBoundingClientRect();
  const ax = a.left + a.width / 2, ay = a.top + a.height / 2;
  const bx = b.left + b.width / 2, by = b.top + b.height / 2;
  return Math.hypot(ax - bx, ay - by) < 150 + b.width / 2;
}

function insert() {
  inserted = true;
  el.port.classList.remove('hot');
  el.cart.classList.add('inserted');
  el.cartHint.classList.add('gone');
  el.cartBtn.classList.add('gone');
  el.cart.style.pointerEvents = 'none';
  el.cart.style.zIndex = '1';           // behind the console shell

  const c = el.cart.getBoundingClientRect();
  const p = el.port.getBoundingClientRect();
  const m = new DOMMatrix(getComputedStyle(el.cart).transform);
  const bx = m.m41 + (p.left + p.width / 2) - (c.left + c.width / 2);
  const by = m.m42 + p.top - (c.top + c.height);

  el.cart.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
  el.cart.style.transform = `translate(${bx}px, ${by}px)`;

  setTimeout(() => {
    el.cart.style.transition = 'transform .5s cubic-bezier(.55,0,.25,1), opacity .2s .38s';
    el.cart.style.transform = `translate(${bx}px, ${by + c.height + 20}px)`;
    el.cart.style.opacity = '0';
    el.port.classList.add('hot');
    el.seated.classList.add('show');
    clunk();
  }, 420);

  setTimeout(() => el.port.classList.remove('hot'), 1050);
  setTimeout(run, 1180);
}

/* ---------------------------------------------------------
   Audio — generated, no files needed
   --------------------------------------------------------- */
let actx = null;
function audio() {
  if (!actx) {
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (_) { return null; }
  }
  if (actx.state === 'suspended') actx.resume();
  return actx;
}

function tone({ freq = 440, dur = .12, type = 'sine', gain = .07, sweep = null }) {
  const ctx = audio(); if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  if (sweep) o.frequency.exponentialRampToValueAtTime(sweep, ctx.currentTime + dur);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(.0008, ctx.currentTime + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + dur + .02);
}

/* soft sonar ping, repeating while the map scans */
let pingTimer = null;
function startSearchSound() {
  stopSearchSound();
  const ping = () => tone({ freq: 880, sweep: 520, dur: .28, type: 'sine', gain: .05 });
  ping();
  pingTimer = setInterval(ping, 620);
}
function stopSearchSound() {
  if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
}

/* short blip when a signal resolves */
function blipSound() { tone({ freq: 1320, dur: .07, type: 'triangle', gain: .05 }); }

/* low alert when the undefined signal appears */
function alertSound() {
  tone({ freq: 180, sweep: 90, dur: .5, type: 'sawtooth', gain: .07 });
  setTimeout(() => tone({ freq: 220, sweep: 110, dur: .4, type: 'sawtooth', gain: .05 }), 180);
}

/* rising confirm when access is granted */
function grantSound() {
  tone({ freq: 440, sweep: 880, dur: .3, type: 'sine', gain: .07 });
  setTimeout(() => tone({ freq: 660, sweep: 1320, dur: .35, type: 'sine', gain: .05 }), 150);
}

function clunk() { tone({ freq: 118, dur: .18, type: 'square', gain: .12 }); }

/* =========================================================
   SEQUENCE
   ========================================================= */
async function run() {
  el.tab.textContent = 'ACE MODULE LOCKED';
  el.tab.classList.add('locked');
  el.console.classList.add('live');
  el.hudDot.classList.add('live');
  el.hudStat.textContent = 'MODULE READ';
  el.pillFill.style.width = '40%';

  el.lAwait.classList.remove('show');
  await wait(420);

  await campusScan();
  await loading();

  const played = await playVideo();
  // the clip already ends on the KRATOS lockup, so it holds as the final frame.
  // with no clip present we fall back to the built-in reveal page.
  if (played) {
    el.replay.classList.add('show');
  } else {
    await reveal();
  }
}

/* ---------------------------------------------------------
   STATE 2 — campus scan
   --------------------------------------------------------- */
const SIGNALS = [
  { tag:'CODING',     x:22, y:34 },
  { tag:'CAT EXAM',   x:74, y:28 },
  { tag:'ASSESSMENT', x:30, y:68 },
  { tag:'PROJECT',    x:68, y:66 }
];

async function campusScan() {
  el.lMap.classList.add('show');
  el.hudStat.textContent = 'SEARCHING CAMPUS';
  el.coords.innerHTML = 'SEARCHING...';
  startSearchSound();
  await wait(700);

  // four seconds of searching — activity signals resolve one at a time
  for (let i = 0; i < SIGNALS.length; i++) {
    addSignal(SIGNALS[i], false);
    blipSound();
    el.coords.innerHTML = `SIGNALS FOUND<br>${i + 1} / 4`;
    await wait(820);
  }

  el.pillFill.style.width = '58%';
  el.coords.innerHTML = 'SWEEPING<br>SECTOR 4';
  await wait(900);

  stopSearchSound();

  // then the one that does not belong
  el.coords.innerHTML = 'UNDEFINED<br>SIGNAL';
  el.hudStat.textContent = 'UNDEFINED SIGNAL';
  addSignal({ tag:'UNDEFINED', x:50, y:47 }, true);
  alertSound();
  await wait(1500);

  // lock on to it
  el.hudStat.textContent = 'LOCKING TARGET';
  for (const p of [28, 61, 88, 100]) {
    el.coords.innerHTML = `LOCKING<br>${p}%`;
    tone({ freq: 520 + p * 4, dur: .06, type: 'square', gain: .04 });
    await wait(320);
  }

  // known signals clear, the target resolves
  document.querySelectorAll('.signal').forEach(n => n.classList.add('out'));
  await wait(450);

  el.pin.classList.add('show');
  el.detected.classList.add('show');
  el.coords.innerHTML = '13.0174&deg; N<br>80.1399&deg; E';
  el.hudStat.textContent = 'TARGET ACQUIRED';
  el.pillFill.style.width = '82%';
  await wait(700);

  el.place.classList.add('show');
  await wait(1900);

  el.granted.classList.add('show');
  el.hudStat.textContent = 'ACCESS GRANTED';
  grantSound();
  await wait(1700);

  el.lMap.classList.remove('show');
  await wait(400);
}

function addSignal(s, unknown) {
  const n = document.createElement('div');
  n.className = 'signal' + (unknown ? ' unknown' : '');
  n.style.left = s.x + '%';
  n.style.top  = s.y + '%';
  n.innerHTML = `<span class="s-ping"></span><span class="s-dot"></span><span class="s-tag">${s.tag}</span>`;
  el.signals.appendChild(n);
  requestAnimationFrame(() => n.classList.add('show'));
}

/* ---------------------------------------------------------
   STATE 3 — loading, about 3.5 seconds
   --------------------------------------------------------- */
async function loading() {
  el.lLoad.classList.add('show');
  el.hudStat.textContent = 'DECRYPTING';
  await wait(250);

  el.loadFill.style.width = '36%';
  await wait(1100);

  el.loadSb.textContent = 'UNPACKING TRANSMISSION';
  el.loadFill.style.width = '72%';
  await wait(1100);

  el.loadBig.textContent = 'READY';
  el.loadSb.textContent = 'STAND BY';
  el.loadFill.style.width = '100%';
  el.pillFill.style.width = '100%';
  await wait(1000);
}

/* ---------------------------------------------------------
   Intro video — plays if assets/intro.mp4 exists
   --------------------------------------------------------- */
function playVideo() {
  return new Promise((resolve) => {
    const v = el.intro;

    // no file, or the browser cannot play it — skip straight on
    if (!v || !v.querySelector('source')?.getAttribute('src')) return resolve();

    let done = false, started = false;

    // when the clip finishes we leave it on screen, paused on its last frame
    const finish = (ok) => {
      if (done) return;
      done = true;
      el.skip.classList.remove('show');
      el.sound.classList.remove('show');
      if (!ok) {
        el.stageVideo.classList.remove('is-active');
      }
      resolve(!!ok);
    };

    v.addEventListener('ended', () => finish(true), { once:true });
    v.addEventListener('error', () => finish(false), { once:true });
    el.skip.addEventListener('click', () => { v.pause(); v.currentTime = v.duration || 0; finish(true); }, { once:true });

    // unmute control — browsers only autoplay muted video
    el.sound.addEventListener('click', () => {
      v.muted = !v.muted;
      el.sound.innerHTML = v.muted ? '&#128263; SOUND ON' : '&#128266; SOUND OFF';
    });

    // safety net in case the file never loads
    const guard = setTimeout(() => { if (!started && v.readyState < 2) finish(false); }, 3000);
    v.addEventListener('canplay', () => { started = true; clearTimeout(guard); }, { once:true });

    // dive out of the console into the video
    el.rig.classList.add('diving');
    setTimeout(() => {
      el.flash.classList.add('on');
      setTimeout(() => {
        el.rig.style.display = 'none';
        el.hud.style.opacity = '0';
        el.stageVideo.classList.add('is-active');
        el.flash.classList.remove('on');
        el.skip.classList.add('show');
        el.sound.classList.add('show');
        v.play().catch(() => finish(false));
      }, 200);
    }, 700);
  });
}

/* ---------------------------------------------------------
   Reveal page
   --------------------------------------------------------- */
async function reveal() {
  // if the video stage never ran, dive out of the console now
  if (el.rig.style.display !== 'none') {
    el.rig.classList.add('diving');
    await wait(700);
    el.flash.classList.add('on');
    await wait(200);
    el.rig.style.display = 'none';
    el.hud.style.opacity = '0';
    el.flash.classList.remove('on');
  }

  el.stageRev.classList.add('is-active');
  makeParticles(54);
  await wait(650);

  el.beReady.classList.add('show');
  await wait(2100);
  el.beReady.classList.add('gone');
  await wait(750);
  el.beReady.style.display = 'none';

  el.kratos.classList.add('show');
  await wait(1050);
  el.soon.classList.add('show');
  await wait(850);
  el.soonSub.classList.add('show');
  await wait(700);
  el.replay.classList.add('show');
}

function makeParticles(n) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 1 + Math.random() * 2.4;
    p.style.cssText =
      `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `animation-duration:${7 + Math.random() * 10}s;` +
      `animation-delay:${Math.random() * 9}s;`;
    el.particles.appendChild(p);
  }
}

el.replay.addEventListener('click', () => location.reload());

/* ---------------------------------------------------------
   Boot — hold everything hidden until the art has decoded,
   so nothing flashes in before the console does.
   --------------------------------------------------------- */
function boot() {
  el.lAwait.classList.add('show');
  document.body.classList.add('ready');
}

const art = [...document.images].filter(i => i.src && !i.src.endsWith('.mp4'));
let left = art.length;
if (!left) {
  boot();
} else {
  const tick = () => { if (--left <= 0) boot(); };
  art.forEach(i => {
    if (i.complete) tick();
    else { i.addEventListener('load', tick, { once:true }); i.addEventListener('error', tick, { once:true }); }
  });
  // never hang on a slow asset
  setTimeout(boot, 2500);
}
