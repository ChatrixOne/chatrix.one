/* =====  SCROLL EFFECTS  ===== */
(function () {
  var nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  });

  /* =====  INTERSECTION REVEAL  ===== */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();

/* =====================================================================
   SOUND ENGINE — Web Audio API, zero external files.
===================================================================== */
var _audioCtx     = null;
var _ringInterval = null;
var _soundEnabled = false; /* off by default */

function getAudioCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return null; }
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}
/* Unlock AudioContext on any user interaction */
function _unlockAudio() {
  var c = getAudioCtx();
  if (c) c.resume();
}
['click','touchstart','keydown','scroll'].forEach(function(e) {
  document.addEventListener(e, _unlockAudio, { passive: true });
});

function _out(ctx, vol) {
  var g = ctx.createGain();
  g.gain.value = vol || 0.17;
  g.connect(ctx.destination);
  return g;
}

/* A short buffer of white noise, made once and reused */
var _noiseBuf = null;
function _noise(ctx) {
  if (!_noiseBuf) {
    var len = Math.floor(ctx.sampleRate * 0.4);
    _noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = _noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  var src = ctx.createBufferSource(); src.buffer = _noiseBuf;
  return src;
}
function _vary(v, k) { return v * (1 - k + Math.random() * 2 * k); }

/* Key press, like a phone keyboard: a soft tick on top of a small low
   "tock", a little different every time; the space bar sounds deeper. */
function playKeySound(ch) {
  if (!_soundEnabled) return;
  var ctx = getAudioCtx(); if (!ctx) return;
  try {
    var now = ctx.currentTime, space = ch === ' ';
    var out = _out(ctx, _vary(0.09, 0.15));
    /* the tick: a few ms of noise, band-passed, offset into the buffer */
    var src = _noise(ctx);
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = _vary(space ? 1300 : 2000, 0.12); bp.Q.value = 0.9;
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(0.7, now + 0.0015);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);
    src.connect(bp); bp.connect(env); env.connect(out);
    src.start(now, Math.random() * 0.3, 0.02);
    /* the body: a short sine dropping in pitch */
    var osc = ctx.createOscillator(); osc.type = 'sine';
    var f0 = _vary(space ? 170 : 240, 0.08);
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f0 * 0.6, now + 0.035);
    var body = ctx.createGain();
    body.gain.setValueAtTime(0.0001, now);
    body.gain.exponentialRampToValueAtTime(space ? 0.5 : 0.35, now + 0.003);
    body.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    osc.connect(body); body.connect(out);
    osc.start(now); osc.stop(now + 0.05);
  } catch(e) {}
}

/* Send: a soft "whoosh" (noise swept upwards) that ends in a light pop */
function playSendSound() {
  if (!_soundEnabled) return;
  var ctx = getAudioCtx(); if (!ctx) return;
  try {
    var now = ctx.currentTime;
    var out = _out(ctx, 0.11);
    var src = _noise(ctx);
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(500, now);
    bp.frequency.exponentialRampToValueAtTime(2600, now + 0.18);
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(0.8, now + 0.07);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    src.connect(bp); bp.connect(env); env.connect(out);
    src.start(now, 0, 0.22);
    var pop = ctx.createOscillator(); pop.type = 'sine';
    var t = now + 0.15;
    pop.frequency.setValueAtTime(620, t);
    pop.frequency.exponentialRampToValueAtTime(980, t + 0.05);
    var pg = ctx.createGain();
    pg.gain.setValueAtTime(0.0001, t);
    pg.gain.exponentialRampToValueAtTime(0.35, t + 0.008);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    pop.connect(pg); pg.connect(out);
    pop.start(t); pop.stop(t + 0.08);
  } catch(e) {}
}

function playReceiveSound() {
  if (!_soundEnabled) return;
  var ctx = getAudioCtx(); if (!ctx) return;
  try {
    var now = ctx.currentTime;
    /* "piiu" — subtle downward sweep, soft and brief, mirror of send */
    var osc = ctx.createOscillator(); osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.10);
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.28, now + 0.010);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
    osc.connect(env); env.connect(_out(ctx, 0.12));
    osc.start(now); osc.stop(now + 0.11);
  } catch(e) {}
}



/* =====================================================================
   ADDITIONS: theme toggle · scroll-to-top · obfuscated email
===================================================================== */

/* ── RING TONE — GSM-style double ring, repeating ─────────────────
   Two 400ms bursts at 425Hz with 200ms gap, then 2s silence.
   Call stopRingTone() to cancel.                                    */
function _oneBurst(ctx, startTime) {
  try {
    var out = _out(ctx, 0.22);
    var osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 425;
    var lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 20;
    var lg  = ctx.createGain(); lg.gain.value = 4;
    lfo.connect(lg); lg.connect(osc.frequency);
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.001, startTime);
    env.gain.linearRampToValueAtTime(0.85, startTime + 0.025);
    env.gain.setValueAtTime(0.85, startTime + 0.375);
    env.gain.linearRampToValueAtTime(0.001, startTime + 0.40);
    osc.connect(env); env.connect(out);
    lfo.start(startTime); lfo.stop(startTime + 0.42);
    osc.start(startTime); osc.stop(startTime + 0.42);
  } catch(e) {}
}

function playRingTone() {
  if (!_soundEnabled) return;
  stopRingTone();
  function ring() {
    var ctx = getAudioCtx(); if (!ctx) return;
    var now = ctx.currentTime;
    _oneBurst(ctx, now);
    _oneBurst(ctx, now + 0.6);
  }
  ring();
  _ringInterval = setInterval(ring, 2600);
}

function stopRingTone() {
  if (_ringInterval) { clearInterval(_ringInterval); _ringInterval = null; }
}

(function () {
  'use strict';

  var THEME_KEY = 'chatrix:theme';
  var ROOT      = document.documentElement;
  var REDUCE_MOTION = typeof window.matchMedia === 'function' &&
                      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── helpers ─────────────────────────────────────────────── */
  function getStored() {
    try { var v = localStorage.getItem(THEME_KEY); return (v === 'light' || v === 'dark') ? v : null; }
    catch (_) { return null; }
  }
  function setStored(v) {
    try { if (v === 'light' || v === 'dark') localStorage.setItem(THEME_KEY, v); }
    catch (_) {}
  }

  /* ── apply theme ──────────────────────────────────────────── */
  function applyTheme(theme, persist) {
    ROOT.setAttribute('data-theme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0e14' : '#f0f4f8');
    if (persist) setStored(theme);
  }

  /* ── init theme ───────────────────────────────────────────── */
  /* Dark by default whatever the OS prefers; light only when chosen. */
  function initTheme() {
    var stored = getStored();
    applyTheme(stored || 'dark', false);

    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = ROOT.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    }
  }

  /* ── scroll-to-top ────────────────────────────────────────── */
  function initScrollTop() {
    var btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── obfuscated email ─────────────────────────────────────── */
  /* The email is split into data-u (user) and data-d (domain)
     and assembled by JS at runtime — never visible to scrapers
     reading raw HTML source.                                     */
  function initObfEmail() {
    var spans = document.querySelectorAll('.obf-email');
    for (var i = 0; i < spans.length; i++) {
      var el = spans[i];
      var u  = el.getAttribute('data-u');
      var d  = el.getAttribute('data-d');
      var s  = el.getAttribute('data-s') || 'mailto';
      if (!u || !d) continue;
      var at   = String.fromCharCode(64);
      var addr = u + at + d;
      var href = (s === 'xmpp' ? 'xmpp:' : 'mailto:') + addr;
      var a    = document.createElement('a');
      a.href        = href;
      a.textContent = addr;
      el.appendChild(a);
    }
  }

  /* ── boot ─────────────────────────────────────────────────── */
  function initMobileNav() {
    var btn  = document.getElementById('navHamburger');
    var menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    function close() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    }
    function open() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.contains('is-open') ? close() : open();
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('is-open') &&
          !menu.contains(e.target) && !btn.contains(e.target)) {
        close();
      }
    });

    /* Close on menu link click */
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', close);
    }

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initSoundToggle() {
    var btn   = document.getElementById('soundToggle');
    var label = document.getElementById('soundToggleLabel');
    if (!btn) return;

    /* Read translated strings from the rendered label (set by Hugo i18n) */
    var labelOff = label ? label.textContent.trim() : 'Sound off';
    /* Derive "on" string — look for a data attribute or use a fallback */
    var isBG = document.documentElement.lang === 'bg';
    var labelOn  = isBG ? 'Звукът е включен' : 'Sound on';

    function update() {
      btn.classList.toggle('is-on', _soundEnabled);
      btn.setAttribute('aria-label', _soundEnabled ? labelOn : labelOff);
      btn.setAttribute('title',      _soundEnabled ? labelOn : labelOff);
      if (label) label.textContent = _soundEnabled ? labelOn : labelOff;
    }
    btn.addEventListener('click', function() {
      _soundEnabled = !_soundEnabled;
      if (_soundEnabled) _unlockAudio();
      update();
    });
    update(); /* set initial state */
  }

  function initTechTooltips() {
    var tooltip   = document.getElementById('techTooltip');
    var tipTitle  = document.getElementById('techTooltipTitle');
    var tipBody   = document.getElementById('techTooltipBody');
    if (!tooltip) return;

    var items = document.querySelectorAll('.tech-item[data-tech]');
    var hideTimer = null;

    function show(item) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      var isBG  = (typeof currentLang !== 'undefined' && currentLang === 'bg')
                  || document.documentElement.lang === 'bg';
      var title = (isBG && item.getAttribute('data-tip-title-bg'))
                  ? item.getAttribute('data-tip-title-bg')
                  : (item.getAttribute('data-tip-title') || '');
      var body  = (isBG && item.getAttribute('data-tip-body-bg'))
                  ? item.getAttribute('data-tip-body-bg')
                  : (item.getAttribute('data-tip-body')  || '');
      tipTitle.textContent = title;
      tipBody.textContent  = body;

      /* Position above the hovered item */
      var r   = item.getBoundingClientRect();
      var tw  = 260; /* max-width */
      var left = r.left + r.width / 2 - tw / 2;
      /* Clamp within viewport */
      left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
      var top = r.top - 10; /* will be adjusted after render */

      tooltip.style.left  = left + 'px';
      tooltip.style.top   = (top - 10) + 'px'; /* rough start */
      tooltip.style.width = tw + 'px';
      tooltip.removeAttribute('aria-hidden');
      tooltip.classList.add('is-visible');

      /* Nudge after browser knows the tooltip height */
      requestAnimationFrame(function() {
        var th = tooltip.offsetHeight;
        tooltip.style.top = (r.top - th - 12) + 'px';
        /* Reposition arrow */
        var itemCx  = r.left + r.width / 2;
        var tipLeft = parseFloat(tooltip.style.left);
        var arrowX  = itemCx - tipLeft;
        arrowX = Math.max(20, Math.min(arrowX, tw - 20));
        var arrow = tooltip.querySelector('.tech-tooltip-arrow');
        if (arrow) arrow.style.left = arrowX + 'px';
        arrow.style.transform = 'translateX(0)';
      });
    }

    function hide() {
      hideTimer = setTimeout(function() {
        tooltip.classList.remove('is-visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }, 80);
    }

    for (var i = 0; i < items.length; i++) {
      (function(item) {
        item.addEventListener('mouseenter', function() { show(item); });
        item.addEventListener('mouseleave', hide);
      })(items[i]);
    }
  }

  

  function initXmrDonate() {
    var trigger = document.getElementById('xmrTrigger');
    var popup   = document.getElementById('xmrPopup');
    var copyBtn = document.getElementById('xmrCopy');
    var copyLbl = document.getElementById('xmrCopyLabel');
    var address = document.getElementById('xmrAddress');
    if (!trigger || !popup) return;

    var isOpen = false;

    function positionPopup() {
      var r      = trigger.getBoundingClientRect();
      var pw     = Math.min(280, window.innerWidth - 24);
      var bottom = window.innerHeight - r.top + 14;
      popup.style.width  = pw + 'px';
      popup.style.bottom = bottom + 'px';
      popup.style.top    = 'auto';

      var arrow = popup.querySelector('.xmr-popup-arrow');

      /* On narrow screens (mobile) centre on the viewport */
      if (window.innerWidth < 600) {
        popup.style.left      = '50%';
        popup.style.transform = 'translateX(-50%) scale(1)';
        if (arrow) {
          arrow.style.left      = '50%';
          arrow.style.transform = 'translateX(-50%)';
        }
      } else {
        popup.style.transform = '';
        /* Centre above trigger, clamp to viewport edges */
        var left = r.left + r.width / 2 - pw / 2;
        left     = Math.max(12, Math.min(left, window.innerWidth - pw - 12));
        popup.style.left = left + 'px';
        /* Reposition arrow to point at trigger centre */
        if (arrow) {
          var arrowX = (r.left + r.width / 2) - left;
          arrowX = Math.max(20, Math.min(arrowX, pw - 20));
          arrow.style.left      = arrowX + 'px';
          arrow.style.transform = 'translateX(0)';
        }
      }
    }

    function open() {
      positionPopup();
      popup.classList.add('is-visible');
      popup.removeAttribute('aria-hidden');
      isOpen = true;
    }
    function close() {
      popup.classList.remove('is-visible');
      popup.setAttribute('aria-hidden', 'true');
      isOpen = false;
    }

    /* ── Feature card "Support Us" button ── */
    var featTrigger = document.getElementById('featXmrTrigger');
    if (featTrigger) {
      featTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isOpen) { close(); return; }
        /* Position popup above the feature card button */
        var origGetRect = trigger.getBoundingClientRect.bind(trigger);
        trigger.getBoundingClientRect = featTrigger.getBoundingClientRect.bind(featTrigger);
        open();
        trigger.getBoundingClientRect = origGetRect;
      });
    }

    trigger.addEventListener('click', function() {
      isOpen ? close() : open();
    });
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isOpen ? close() : open(); }
      if (e.key === 'Escape') close();
    });
    document.addEventListener('click', function(e) {
      if (isOpen && !trigger.contains(e.target) && !popup.contains(e.target) && !(featTrigger && featTrigger.contains(e.target))) close();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) close();
    });
    window.addEventListener('resize', function() {
      if (isOpen) positionPopup();
    });
    window.addEventListener('scroll', function() {
      if (isOpen) positionPopup();
    }, { passive: true });

    /* Copy address */
    if (copyBtn && address) {
      var isBG = document.documentElement.lang === 'bg';
      copyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var text = address.textContent.trim();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function() {
            copyBtn.classList.add('copied');
            if (copyLbl) copyLbl.textContent = isBG ? 'Копирано!' : 'Copied!';
            setTimeout(function() {
              copyBtn.classList.remove('copied');
              if (copyLbl) copyLbl.textContent = isBG ? 'Копирай' : 'Copy';
            }, 2000);
          });
        }
      });
    }
  }

  function initHeroParticles() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var COUNT = 55;

    function accentColor() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      return dark ? '#00c896' : '#00a87a';
    }

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function randomParticle() {
      return {
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.8 + 0.5,
        vx:    (Math.random() - 0.5) * 0.35,
        vy:    (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.15
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < COUNT; i++) particles.push(randomParticle());
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var color = accentColor();
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5)                p.x = canvas.width  + 5;
        if (p.x > canvas.width  + 5) p.x = -5;
        if (p.y < -5)                p.y = canvas.height + 5;
        if (p.y > canvas.height + 5) p.y = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running) requestAnimationFrame(draw);
    }

    var running = false;
    init();
    if (REDUCE_MOTION) {
      draw();
      window.addEventListener('resize', function () { init(); draw(); });
      return;
    }
    window.addEventListener('resize', init);
    whileVisible(canvas, function (on) {
      if (on && !running) { running = true; draw(); }
      else if (!on) running = false;
    });
  }

  /* Calls fn(true) when el scrolls into view and fn(false) when it leaves,
     so canvas loops stop drawing off-screen. */
  function whileVisible(el, fn) {
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(function (entries) {
      fn(entries[entries.length - 1].isIntersecting);
    }).observe(el);
  }

  function initTechPlayPause() {
    var btn   = document.getElementById('techPlayPause');
    var track = document.querySelector('.tech-track');
    if (!btn || !track) return;
    var paused = false;
    btn.addEventListener('click', function() {
      paused = !paused;
      track.style.animationPlayState = paused ? 'paused' : 'running';
      btn.querySelector('.icon-pause').style.display = paused ? 'none'  : '';
      btn.querySelector('.icon-play').style.display  = paused ? ''      : 'none';
      btn.setAttribute('aria-label', paused ? 'Play marquee' : 'Pause marquee');
      btn.setAttribute('title',      paused ? 'Play'         : 'Pause');
    });
  }

  function initDataFlow() {
    var canvas = document.getElementById('dataFlowCanvas');
    if (!canvas) return;
    var ctx    = canvas.getContext('2d');
    var W      = canvas.width;
    var H      = canvas.height;
    var chars  = '0123456789abcdef';
    var COUNT  = 10;
    var particles = [];

    function isDark() {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    function randChar() { return chars[Math.floor(Math.random() * chars.length)]; }
    function newParticle() {
      return {
        x: -4,
        y: H / 2 + (Math.random() - 0.5) * 4,
        char: randChar(),
        speed: 0.4 + Math.random() * 0.4,
        life: 0,
        maxLife: 80 + Math.floor(Math.random() * 60)
      };
    }

    for (var i = 0; i < COUNT; i++) {
      var p = newParticle();
      p.x = Math.random() * W;
      particles.push(p);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var color = isDark() ? '255,255,255' : '0,0,0';
      ctx.font = '7px IBM Plex Mono, monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.speed;
        p.life++;
        var fadeIn   = Math.min(1, p.life / 20);
        var fadeOut  = Math.min(1, (p.maxLife - p.life) / 20);
        var edgeIn   = Math.min(1, p.x / (W * 0.2));
        var edgeOut  = Math.min(1, (W - p.x) / (W * 0.2));
        var alpha    = Math.min(fadeIn, fadeOut) * Math.min(edgeIn, edgeOut) * 0.55;
        if (alpha > 0) {
          ctx.fillStyle = 'rgba(' + color + ',' + alpha + ')';
          ctx.fillText(p.char, p.x, p.y);
        }
        if (Math.random() < 0.03) p.char = randChar();
        if (p.life >= p.maxLife || p.x > W + 10) {
          particles[i] = newParticle();
        }
      }
      if (running) requestAnimationFrame(draw);
    }
    var running = false;
    if (REDUCE_MOTION) return;  /* the two city names are enough */
    whileVisible(canvas, function (on) {
      if (on && !running) { running = true; draw(); }
      else if (!on) running = false;
    });
  }

  /* Home page, "Start in just three steps": a drawn phone acts out the
     sign-up, from nothing installed to ready to chat (about 15 s). Plays
     once when half the phone is on screen; Replay plays it again, a
     step's title plays it from that step. Reduced motion: the finished
     phone, and a step's title shows that step's last picture, still. */
  function initPhoneSteps() {
    var ps = document.querySelector('.ps');
    if (!ps) return;
    var steps = ps.querySelectorAll('.ps-steps li');
    var ctl = ps.querySelector('.ps-ctl');
    var dots = ps.querySelectorAll('.ps-dot');
    var toggle = ps.querySelector('.ps-toggle-play');
    var timers = [], raf = 0, cur = 0, mode = 'paused';  /* mode: playing, paused, ended */
    function q(sel) { return ps.querySelector(sel); }
    function scene(name) { return q('.ps-scene[data-s="' + name + '"]'); }
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function show(name) {
      ps.querySelectorAll('.ps-scene').forEach(function (s) {
        s.classList.toggle('on', s.dataset.s === name);
        s.classList.toggle('off', s.dataset.s !== name);
      });
    }
    function mark(n) {  /* n: the step on screen; 4 = all done */
      steps.forEach(function (li, i) {
        li.classList.toggle('is-active', i + 1 === n);
        li.classList.toggle('is-done', i + 1 < n);
      });
    }
    /* A finger tap on the centre of the target */
    function tap(sel, target, ms) {
      at(ms, function () {
        var t = q(sel), el = q(target), box = t.parentNode.getBoundingClientRect(), r = el.getBoundingClientRect();
        t.style.left = (r.left - box.left + r.width / 2) + 'px';
        t.style.top = (r.top - box.top + r.height / 2) + 'px';
        t.classList.remove('go'); void t.offsetWidth; t.classList.add('go');
        el.classList.add('press');
        setTimeout(function () { el.classList.remove('press'); }, 180);
      });
    }
    function type(sel, ms, per) {
      var el = q(sel), text = el.dataset.text;
      for (var i = 1; i <= text.length; i++) {
        (function (k) { at(ms + k * per, function () { el.textContent = text.slice(0, k); }); })(i);
      }
      return ms + text.length * per;
    }
    function fill(sel, on) { var el = q(sel); el.textContent = on ? el.dataset.text : ''; }
    function setDl(v) {
      var home = scene('home');
      home.style.setProperty('--dl', v);
      q('.ps-pct').textContent = Math.round(v) + '%';
      home.classList.toggle('installed', v >= 100);
    }
    function msgs(n) {  /* the first n chat messages shown */
      ['.ps-m1', '.ps-m2', '.ps-m3'].forEach(function (m, i) { q(m).classList.toggle('on', i < n); });
      q('.ps-typing').classList.remove('on');
    }
    function chatState(cls) {
      var c = scene('chat');
      ['clear', 'menu', 'zoom'].forEach(function (k) { c.classList.toggle(k, cls.indexOf(k) >= 0); });
    }

    /* The screens, one dot each. step: the step it belongs to. set(done):
       the screen as it starts (done false) or as it ends (done true), so
       any screen can be shown or played on its own. play(t) schedules the
       screen from t and returns its end. */
    var check = q('.ps-check'), login = q('.ps-btn-login'), word = q('.ps-word'), typing = q('.ps-typing');
    var screens = [
      { step: 1, set: function (d) { setDl(d ? 100 : 0); show('home'); },
        play: function (t) {
          at(t + 300, function () {
            var start = null;
            function step(ts) {
              if (start === null) start = ts;
              var k = Math.min(1, (ts - start) / 1300);
              setDl(k * 100);
              if (k < 1) raf = requestAnimationFrame(step);
            }
            raf = requestAnimationFrame(step);
          });
          tap('.ps-tap-app', '.ps-ico-app', t + 2000);
          return t + 2350;
        } },
      { step: 1, set: function () { show('welcome'); },
        play: function (t) { tap('.ps-tap-new', '.ps-btn-new', t + 900); return t + 1250; } },
      { step: 2, set: function (d) { check.classList.remove('wait'); check.classList.toggle('ok', d); show('join'); },
        play: function (t) {
          at(t + 550, function () { check.classList.add('wait'); });
          at(t + 1250, function () { check.classList.remove('wait'); check.classList.add('ok'); });
          tap('.ps-tap-open', '.ps-btn-open', t + 1750);
          return t + 2100;
        } },
      { step: 2, set: function (d) { fill('.ps-user', d); fill('.ps-pass', d); show('register'); },
        play: function (t) {
          var e = type('.ps-user', t + 350, 80);
          e = type('.ps-pass', e + 250, 45);
          tap('.ps-tap-submit', '.ps-btn-submit', e + 350);
          return e + 700;
        } },
      { step: 2, set: function () { show('made'); },
        play: function (t) { tap('.ps-tap-back', '.ps-btn-back', t + 1300); return t + 1650; } },
      { step: 2, set: function (d) { fill('.ps-pass2', d); login.classList.remove('busy'); show('login'); },
        play: function (t) {
          var e = type('.ps-pass2', t + 500, 40);
          tap('.ps-tap-login', '.ps-btn-login', e + 350);
          at(e + 500, function () { login.classList.add('busy'); });
          return e + 1300;
        } },
      { step: 2, set: function () { show('avatar'); },
        play: function (t) { tap('.ps-tap-skip', '.ps-btn-skip', t + 1000); return t + 1350; } },
      { step: 2, set: function () { show('list'); },
        play: function (t) { tap('.ps-tap-row', '.ps-row', t + 850); return t + 1200; } },
      { step: 3, set: function (d) { msgs(d ? 1 : 0); word.textContent = ''; chatState(''); show('chat'); },
        play: function (t) {
          at(t + 350, function () { typing.classList.add('on'); });
          at(t + 1150, function () { typing.classList.remove('on'); q('.ps-m1').classList.add('on'); });
          tap('.ps-tap-lock', '.ps-lock', t + 2550);
          return t + 2750;
        } },
      /* The lock's menu, a magnifier over "Clear text", a tap there */
      { step: 3, set: function (d) { msgs(1); word.textContent = ''; chatState(d ? 'menu zoom clear' : 'menu'); show('chat'); },
        play: function (t) {
          at(t + 400, function () { chatState('menu zoom'); });
          tap('.ps-tap-zoom', '.ps-zoom-opt', t + 1200);
          at(t + 1350, function () { chatState('menu zoom clear'); });
          return t + 2700;
        } },
      { step: 3, set: function (d) { msgs(d ? 3 : 1); word.textContent = ''; chatState('clear'); show('chat'); },
        play: function (t) {
          var e = type('.ps-word', t + 400, 110);
          at(e + 350, function () { word.textContent = ''; q('.ps-m2').classList.add('on'); });
          at(e + 800, function () { typing.classList.add('on'); });
          at(e + 1700, function () { typing.classList.remove('on'); q('.ps-m3').classList.add('on'); });
          return e + 3400;
        } },
      { step: 4, set: function () { show('ready'); }, play: function (t) { return t; } }
    ];
    var LAST = screens.length - 1;

    function stop() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); }
    function dot(i) {
      cur = i;
      dots.forEach(function (d, k) {
        d.classList.toggle('is-on', k === i);
        d.classList.toggle('is-past', k < i);
        if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      ps.classList.toggle('playing', screens[i].step < 4);
      mark(screens[i].step);
    }
    function setMode(m) {
      mode = m;
      if (!toggle) return;
      toggle.dataset.mode = m;
      var label = toggle.dataset[m === 'playing' ? 'pause' : m === 'ended' ? 'replay' : 'play'];
      toggle.setAttribute('aria-label', label); toggle.title = label;
    }
    /* Play from screen i to the end */
    function play(i) {
      stop();
      ps.classList.add('anim');
      setMode('playing');
      var t = 0;
      for (var k = i; k <= LAST; k++) {
        (function (k, t) { at(t, function () { screens[k].set(false); dot(k); }); })(k, t);
        t = screens[k].play(t);
      }
      at(t, function () { setMode('ended'); });
    }
    /* Show screen i, finished, and stay there */
    function still(i) {
      stop();
      ps.classList.add('anim');
      i = Math.max(0, Math.min(LAST, i));
      screens[i].set(true); dot(i);
      setMode(i === LAST ? 'ended' : 'paused');
    }
    var MOTION = !REDUCE_MOTION && 'IntersectionObserver' in window;

    /* The steps' titles start their first screen */
    ps.querySelectorAll('.ps-go').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = +b.dataset.go, i = 0;
        while (screens[i].step < n) i++;
        if (MOTION) play(i); else still(i);
      });
    });
    if (ctl) {
      ctl.hidden = false;
      if (!MOTION && toggle) toggle.hidden = true;
      ctl.querySelector('.ps-prev').addEventListener('click', function () { still(cur - 1); });
      ctl.querySelector('.ps-next').addEventListener('click', function () { still(cur + 1); });
      dots.forEach(function (d, k) { d.addEventListener('click', function () { still(k); }); });
      if (toggle) toggle.addEventListener('click', function () {
        if (mode === 'playing') still(cur);
        else play(mode === 'ended' ? 0 : cur);
      });
      ctl.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { still(cur - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { still(cur + 1); e.preventDefault(); }
      });
    }
    if (!MOTION) { still(LAST); return; }

    /* The waiting phone, without fading from the finished one */
    ps.classList.add('instant', 'anim');
    screens[0].set(false); dot(0); ps.classList.remove('playing'); mark(0);
    requestAnimationFrame(function () { requestAnimationFrame(function () { ps.classList.remove('instant'); }); });
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); if (mode === 'paused' && cur === 0) play(0); }
    }, { threshold: 0.5 });
    io.observe(q('.ps-phone'));
  }

  /* The hero phone (partials/hero-phone.html): one chat in the Chatrix.One
     app, then the features it adds, one per dot. Built like initPhoneSteps:
     set(f, done) puts feature f's start (or end) on screen at once, play(f, t)
     schedules its motion from t and returns its end. It loops. */
  function initHeroPhone() {
    var hp = document.querySelector('.hp');
    if (!hp) return;
    var ctl = hp.querySelector('.hp-ctl');
    var dots = hp.querySelectorAll('.ps-dot');
    var toggle = hp.querySelector('.ps-toggle-play');
    var cap = hp.querySelector('.hp-cap');
    var timers = [], cur = 0, mode = 'paused', speed = 1;
    function q(sel) { return hp.querySelector(sel); }
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function m(k) { return q('.hp-m[data-m="' + k + '"]'); }
    var tapEl = q('.hp-tap'), screen = q('.hp-screen');
    var bars = hp.querySelectorAll('.hp-wave i'), voice = q('.hp-voice'), chip = q('.hp-speed');
    var SPEEDS = [1, 1.5, 2];
    var OVERLAYS = ['quoting', 'pop', 'over', 'dlg', 'bg-pic', 'pic-picked'];

    function press(el) { el.classList.add('press'); setTimeout(function () { el.classList.remove('press'); }, 180); }
    /* A finger on the target's centre; hold = a long-press */
    function tap(target, ms, hold) {
      at(ms, function () {
        var el = typeof target === 'string' ? q(target) : target;
        var box = screen.getBoundingClientRect(), r = el.getBoundingClientRect(), s = box.width / screen.offsetWidth || 1;
        tapEl.style.left = (r.left - box.left + r.width / 2) / s + 'px';
        tapEl.style.top = (r.top - box.top + r.height / 2) / s + 'px';
        tapEl.classList.remove('go', 'hold'); void tapEl.offsetWidth; tapEl.classList.add(hold ? 'hold' : 'go');
        if (!hold) press(el);
      });
    }
    function type(sel, ms, per) {
      var el = q(sel), text = el.dataset.text, chars = Array.from(text);
      chars.forEach(function (c, i) {
        at(ms + (i + 1) * per, function () { el.textContent = chars.slice(0, i + 1).join(''); playKeySound(c); });
      });
      return ms + chars.length * per;
    }
    function show(k, sound) {  /* message k arrives (or is sent) */
      var el = m(k);
      el.classList.add('on'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      if (sound === 'in') playReceiveSound();
      if (sound === 'out') playSendSound();
    }
    function setSpeed(v) { speed = v; chip.textContent = String(v) + '×'; }
    function wave(n) { bars.forEach(function (b, i) { b.classList.toggle('done', i < n); }); }

    /* Messages shown at the start / end of each feature */
    var FROM = [0, 3, 3, 4, 5, 6, 6, 6], TO = [3, 3, 4, 5, 6, 6, 6, 6];
    var dur = q('.hp-call-dur'), phone = q('.hp-phone');
    function callState(c) { if (c) hp.dataset.c = c; else delete hp.dataset.c; hp.classList.toggle('call', !!c); }
    function clock(sec) { dur.textContent = '00:' + (sec < 10 ? '0' : '') + sec; }
    function set(f, d) {
      var n = d ? TO[f] : FROM[f];
      for (var k = 1; k <= 6; k++) m(k).classList.toggle('on', k <= n);
      hp.querySelectorAll('.hp-m').forEach(function (el) { el.classList.remove('pop', 'sw-r', 'sw-l', 'held'); });
      q('.hp-r3').classList.toggle('on', f >= 2 || (f === 1 && d));
      q('.hp-r6').classList.toggle('on', f >= 6 || (f === 5 && d));
      setSpeed(f < 3 || (f === 3 && !d) ? 1 : 2);
      voice.classList.remove('playing'); wave(0);
      OVERLAYS.forEach(function (c) { hp.classList.remove(c); });
      if ((f === 6 && d) || f === 7) hp.classList.add('bg-pic', 'pic-picked');
      stopRingTone(); clock(0);
      if (f === 7 && d) { callState('on'); clock(12); } else callState('');
      q('.hp-type').textContent = ''; q('.hp-type2').textContent = '';
    }
    var plays = [
      /* 1: the chat, encrypted as always */
      function (t) {
        at(t + 600, function () { show(1, 'in'); });
        var e = type('.hp-type2', t + 1500, 70);
        tap('.hp-send', e + 300);
        at(e + 450, function () { q('.hp-type2').textContent = ''; show(2, 'out'); });
        at(e + 1900, function () { show(3, 'in'); });
        return e + 3400;
      },
      /* 2: swipe right on her question: a quick 👍 */
      function (t) {
        at(t + 700, function () { m(3).classList.add('sw-r'); });
        at(t + 1300, function () { m(3).classList.remove('sw-r'); q('.hp-r3').classList.add('on'); });
        return t + 2800;
      },
      /* 3: swipe left: quote it, then answer */
      function (t) {
        at(t + 700, function () { m(3).classList.add('sw-l'); });
        at(t + 1200, function () { m(3).classList.remove('sw-l'); hp.classList.add('quoting'); });
        var e = type('.hp-type', t + 1700, 65);
        tap('.hp-send', e + 300);
        at(e + 450, function () { q('.hp-type').textContent = ''; hp.classList.remove('quoting'); show(4, 'out'); });
        return e + 2200;
      },
      /* 4: a voice message, played faster: 1× → 1.5× → 2× */
      function (t) {
        at(t + 500, function () { show(5, 'in'); });
        tap('.hp-play', t + 1500);
        var i = 0;
        function tick() {
          if (i >= bars.length) { voice.classList.remove('playing'); return; }
          wave(++i);
          at(260 / speed, tick);
        }
        at(t + 1550, function () { voice.classList.add('playing'); i = 0; tick(); });
        tap('.hp-speed', t + 2700); at(t + 2750, function () { setSpeed(1.5); });
        tap('.hp-speed', t + 3700); at(t + 3750, function () { setSpeed(2); });
        return t + 6600;
      },
      /* 5: a link with its preview card */
      function (t) {
        at(t + 600, function () { show(6, 'in'); });
        return t + 3600;
      },
      /* 6: long-press: the emoji row, ❤️ */
      function (t) {
        tap('.hp-link p', t + 700, true);
        at(t + 800, function () { m(6).classList.add('held'); });
        at(t + 1400, function () { hp.classList.add('pop'); });
        tap('.hp-heart', t + 2500);
        at(t + 2700, function () { hp.classList.remove('pop'); m(6).classList.remove('held'); q('.hp-r6').classList.add('on'); });
        return t + 4300;
      },
      /* 7: the chat's menu › Chat background › My own picture… */
      function (t) {
        tap('.hp-more', t + 700);
        at(t + 800, function () { hp.classList.add('over'); });
        tap('.hp-item-bg', t + 1700);
        at(t + 1850, function () { hp.classList.remove('over'); hp.classList.add('dlg'); });
        tap('.hp-opt-pic', t + 3000);
        at(t + 3100, function () { hp.classList.add('pic-picked'); });
        at(t + 3500, function () { hp.classList.remove('dlg'); });
        at(t + 3700, function () { hp.classList.add('bg-pic'); });
        return t + 6800;
      },
      /* 8: Maria calls: it rings, Accept, Connected, then end the call */
      function (t) {
        at(t + 600, function () { callState('in'); playRingTone(); });
        [700, 2000, 3300].forEach(function (ms) {
          at(t + ms, function () { phone.classList.remove('buzz'); void phone.offsetWidth; phone.classList.add('buzz'); });
        });
        tap('.hp-accept', t + 4000);
        at(t + 4100, function () { stopRingTone(); callState('conn'); });
        at(t + 4900, function () { callState('on'); });
        for (var sec = 1; sec <= 6; sec++) (function (sec) { at(t + 4900 + sec * 1000, function () { clock(sec); }); })(sec);
        tap('.hp-hangup', t + 11300);
        at(t + 11400, function () { callState('end'); });
        at(t + 12300, function () { callState(''); });
        return t + 13600;
      }
    ];
    var LAST = plays.length - 1;

    function stop() { timers.forEach(clearTimeout); timers = []; stopRingTone(); }
    function dot(i) {
      cur = i;
      dots.forEach(function (d, k) {
        d.classList.toggle('is-on', k === i);
        d.classList.toggle('is-past', k < i);
        if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      var d = dots[i];
      if (d && cap) {
        cap.querySelector('b').textContent = d.dataset.t;
        cap.querySelector('span').textContent = d.dataset.s;
        cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
      }
    }
    function setMode(mo) {
      mode = mo;
      if (!toggle) return;
      toggle.dataset.mode = mo;
      var label = toggle.dataset[mo === 'playing' ? 'pause' : 'play'];
      toggle.setAttribute('aria-label', label); toggle.title = label;
    }
    /* Play from feature i to the end, then again from the start */
    function play(i) {
      stop();
      hp.classList.add('anim');
      setMode('playing');
      var t = 0;
      for (var k = i; k <= LAST; k++) {
        (function (k, t) { at(t, function () { set(k, false); dot(k); }); })(k, t);
        t = plays[k](t);
      }
      at(t, function () { play(0); });
    }
    /* Show feature i, finished, and stay there */
    function still(i) {
      stop();
      hp.classList.add('anim');
      i = (i + plays.length) % plays.length;
      set(i, true); dot(i);
      setMode('paused');
    }
    var MOTION = !REDUCE_MOTION;
    if (ctl) {
      ctl.hidden = false;
      if (!MOTION && toggle) toggle.hidden = true;
      ctl.querySelector('.ps-prev').addEventListener('click', function () { still(cur - 1); });
      ctl.querySelector('.ps-next').addEventListener('click', function () { still(cur + 1); });
      dots.forEach(function (d, k) { d.addEventListener('click', function () { if (MOTION) play(k); else still(k); }); });
      if (toggle) toggle.addEventListener('click', function () {
        if (mode === 'playing') still(cur); else play(cur);
      });
      ctl.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { still(cur - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { still(cur + 1); e.preventDefault(); }
      });
    }
    if (!MOTION) { still(LAST); return; }
    play(0);
  }

  /* The Obtainium steps for Chatrix.One: the card's button opens the dialog */
  function initObtainium() {
    var dlg = document.getElementById('obtainium');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    document.querySelectorAll('[data-open="obtainium"]').forEach(function (b) {
      b.hidden = false;
      b.addEventListener('click', function () { dlg.showModal(); });
    });
    /* A click on the backdrop closes it too */
    dlg.addEventListener('click', function (e) {
      var r = dlg.getBoundingClientRect();
      if (e.target === dlg && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dlg.close();
    });
    var copy = dlg.querySelector('.obt-copy');
    if (copy && navigator.clipboard) copy.addEventListener('click', function () {
      var label = copy.textContent;
      navigator.clipboard.writeText(dlg.querySelector('.obt-url code').textContent).then(function () {
        copy.textContent = copy.dataset.copied;
        setTimeout(function () { copy.textContent = label; }, 1600);
      });
    });
    else if (copy) copy.hidden = true;
  }

  function init() {
    initTheme();
    initMobileNav();
    initScrollTop();
    initObfEmail();
    initSoundToggle();
    initTechTooltips();
    initTechPlayPause();
    initHeroParticles();
    initDataFlow();
    initXmrDonate();
    initHeroPhone();
    initPhoneSteps();
    initObtainium();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
