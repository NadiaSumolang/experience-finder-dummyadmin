/* Experience Finder — fitur "Dengarkan cerita" (Text-to-Speech).
   Berdiri sendiri: tidak mengubah script.js / cloud.js. Memakai Web Speech API bawaan browser
   (gratis, tanpa API key). Panel pemutar disisipkan otomatis di halaman detail cerita. */
(function () {
  'use strict';

  const synth = window.speechSynthesis;
  const SUPPORTED = !!(synth && window.SpeechSynthesisUtterance);
  const PREF_KEY = 'ef_voice_prefs2';
  const RATES = [0.75, 1, 1.25, 1.5];
  const defaults = { rate: 1, voiceURI: '', autoNext: false };

  const FEMALE = /damayanti|gadis|female|wanita|perempuan|cewek|google bahasa indonesia|google indonesian/i;
  const MALE = /andika|ardi|\bmale\b|laki|pria|cowok/i;

  const ICON = {
    play: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1.2" fill="currentColor"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2" fill="currentColor"/></svg>',
    head: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="3" y="13" width="4.5" height="7" rx="2" fill="currentColor"/><rect x="16.5" y="13" width="4.5" height="7" rx="2" fill="currentColor"/></svg>',
    tiny: '<svg viewBox="0 0 24 24" width="9" height="9" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>'
  };

  let prefs = Object.assign({}, defaults, readPrefs());
  let voices = [];
  let state = 'idle';            // idle | playing | paused
  let finishedId = null;         // id cerita yang baru selesai dibacakan
  let storyId = null;            // cerita yang sedang/terakhir diputar
  let queue = [];                // [{text, sec, label, start}]
  let starts = [];
  let pos = 0;
  let token = 0;                 // membatalkan callback lama
  let currentUtterance = null;   // cegah garbage-collect di Chrome
  let wakeLock = null;
  let menuOpen = false;           // menu audio tertutup secara default
  let autoAdvance = false;
  let io = null;

  const $ = id => document.getElementById(id);
  const toast = msg => { if (typeof window.showToast === 'function') window.showToast(msg); };

  function readPrefs() { try { return JSON.parse(localStorage.getItem(PREF_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function savePrefs() { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* abaikan */ } }

  /* ---------- Suara ---------- */
  const isId = v => /^id([-_]|$)/i.test(v.lang || '');           // hanya bahasa Indonesia (bukan Sunda/Jawa)
  const isNatural = v => /natural|neural|online/i.test(v.name);
  function genderOf(v) {
    if (FEMALE.test(v.name)) return 'female';
    if (MALE.test(v.name)) return 'male';
    return 'unknown';
  }
  const gRank = v => ({ female: 0, unknown: 1, male: 2 })[genderOf(v)];
  function sortedVoices() {
    return voices.filter(isId).sort((a, b) => (isNatural(b) - isNatural(a)) || (gRank(a) - gRank(b)) || a.name.localeCompare(b.name));
  }
  function activeVoice() {
    const list = sortedVoices();
    return list.find(v => v.voiceURI === prefs.voiceURI) || list[0] || null;
  }
  function friendly(v, i) {
    let n = v.name.replace(/^Microsoft\s+/i, '').replace(/\s*Online\s*\(Natural\)/i, '').replace(/\s*-\s.*$/, '').replace(/\s*\(.*?\)\s*/g, ' ').trim();
    if (/^google/i.test(n)) n = 'Google';
    if (!n || n.length > 16 || /indonesia/i.test(n)) n = 'Suara ' + (i + 1);
    return n;
  }
  function loadVoices() {
    if (!SUPPORTED) return;
    voices = synth.getVoices() || [];
    renderVoiceChips();
    updateUI();
  }

  /* ---------- Teks yang dibacakan ---------- */
  function splitSentences(text) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];
    const parts = clean.match(/[^.!?…]+[.!?…]*\s*/g) || [clean];
    const out = [];
    parts.forEach(p => {
      p = p.trim();
      if (!p) return;
      if (p.length <= 220) { out.push(p); return; }
      let buf = '';
      p.split(/(?<=,)\s+/).forEach(seg => {
        if ((buf + ' ' + seg).length > 200 && buf) { out.push(buf.trim()); buf = seg; } else buf += ' ' + seg;
      });
      if (buf.trim()) out.push(buf.trim());
    });
    return out;
  }
  function buildQueue(item) {
    const q = [];
    const add = (sec, label, text, spokenLabel) => {
      const sentences = splitSentences(text);
      if (!sentences.length) return;
      if (spokenLabel) q.push({ text: spokenLabel, sec, label, start: true });
      sentences.forEach((s, i) => q.push({ text: s, sec, label, start: !spokenLabel && i === 0 }));
    };
    const real = t => (t && t.trim() && !/^tidak dituliskan\.?$/i.test(t.trim())) ? t : '';
    add(-1, 'Judul', `${item.title}. Cerita dari ${item.author}${item.role ? ', ' + item.role : ''}.`);
    add(0, 'Yang terjadi', real(item.happened), 'Yang terjadi.');
    add(1, 'Yang aku lakukan', real(item.did), 'Yang aku lakukan.');
    add(2, 'Ternyata', real(item.unexpected), 'Ternyata.');
    add(3, 'Yang aku pelajari', real(item.lesson), 'Yang aku pelajari.');
    add(4, 'Kalau mengulang lagi', real(item.repeat), 'Kalau mengulang lagi.');
    // Reality check: dibacakan sesuai urutan di layar (yang dibayangkan -> yang ternyata terjadi)
    const imagined = real(item.happened);
    const actual = real(item.unexpected) || real(item.lesson) || 'Setiap pengalaman bisa memberi sudut pandang baru.';
    if (imagined) add(5, 'Reality check', 'Reality check. Ekspektasi versus kenyataan. Yang dibayangkan. ' + imagined + ' Yang ternyata terjadi. ' + actual);
    return q;
  }
  function ensureQueue(item) {
    if (state !== 'idle' && storyId === item.id && queue.length) return;
    storyId = item.id;
    queue = buildQueue(item);
    starts = queue.map((q, i) => q.start ? i : -1).filter(i => i >= 0);
  }
  function currentItem() {
    const id = window.getCurrentStoryId && window.getCurrentStoryId();
    return (window.experiences || []).find(x => x.id === id) || null;
  }
  const detailShown = () => { const d = $('detailPage'); return !!d && !d.classList.contains('hidden'); };
  function estimateMinutes(item) {
    const words = buildQueue(item).map(x => x.text).join(' ').split(/\s+/).length;
    return Math.max(1, Math.round(words / (165 * prefs.rate)));
  }

  /* ---------- Pemutaran ---------- */
  function applyTo(u) {
    const v = activeVoice();
    if (v) { u.voice = v; u.lang = v.lang.replace('_', '-'); } else u.lang = 'id-ID';
    u.rate = prefs.rate;
    u.pitch = 1;
  }
  function speakFrom(i) {
    if (!SUPPORTED) return;
    const my = ++token;
    const busy = synth.speaking || synth.pending;
    synth.cancel();
    pos = Math.max(0, Math.min(i, queue.length));
    state = 'playing';
    finishedId = null;
    acquireWake();
    updateUI();
    if (busy) setTimeout(() => speakNext(my), 60); else speakNext(my);
  }
  function speakNext(my) {
    if (my !== token || state !== 'playing') return;
    if (pos >= queue.length) { finish(); return; }
    const u = new SpeechSynthesisUtterance(queue[pos].text);
    applyTo(u);
    u.onend = () => { if (my !== token) return; pos++; updateUI(); speakNext(my); };
    u.onerror = e => {
      if (my !== token) return;
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      stopAll();
      toast(e.error === 'not-allowed' ? 'Browser memblokir suara. Tekan tombol putar sekali lagi.' : 'Suara ini tidak bisa diputar. Coba pilih suara lain.');
    };
    currentUtterance = u;
    synth.speak(u);
    applyHighlight();
  }
  function pauseAll() {
    if (state !== 'playing') return;
    token++;
    synth.cancel();            // "jeda" = berhenti di kalimat ini; lanjut mengulang kalimat yang sama (andal di semua browser)
    state = 'paused';
    releaseWake();
    updateUI();
  }
  function stopAll() {
    token++;
    if (SUPPORTED) synth.cancel();
    state = 'idle'; pos = 0; finishedId = null;
    releaseWake();
    updateUI();
  }
  function finish() {
    token++;
    finishedId = storyId;
    state = 'idle'; pos = 0;
    releaseWake();
    updateUI();
    if (prefs.autoNext && advanceToNext()) return;
    toast('Selesai dibacakan.');
  }
  function advanceToNext() {
    const list = window.experiences || [];
    const i = list.findIndex(x => x.id === storyId);
    const next = i >= 0 ? list[i + 1] : null;
    if (!next || typeof window.openDetail !== 'function') return false;
    autoAdvance = true;
    setTimeout(() => { autoAdvance = false; }, 2500);
    toast('Lanjut ke cerita berikutnya…');
    window.openDetail(next.id);
    return true;
  }
  function begin(item) { ensureQueue(item); speakFrom(0); }
  function playFromSection(sec) {
    const item = currentItem(); if (!item) return;
    ensureQueue(item);
    const idx = queue.findIndex(q => q.sec === sec && q.start);
    if (idx < 0) { toast('Bagian ini kosong, tidak ada yang dibacakan.'); return; }
    speakFrom(idx);
  }
  const mine = () => { const it = currentItem(); return !!it && state !== 'idle' && storyId === it.id; };
  function togglePlay() {
    const item = currentItem(); if (!item) return;
    if (mine() && state === 'playing') { pauseAll(); return; }
    if (mine() && state === 'paused') { speakFrom(pos); return; }
    begin(item);
  }
  function jump(dir) {
    if (!mine()) return;
    const cur = starts.filter(s => s <= pos).pop() ?? 0;
    if (dir > 0) {
      const n = starts.find(s => s > pos);
      if (n === undefined) { finish(); return; }
      speakFrom(n);
    } else {
      const prevStarts = starts.filter(s => s < cur);
      if (pos > cur + 1 || !prevStarts.length) speakFrom(cur); else speakFrom(prevStarts[prevStarts.length - 1]);
    }
  }
  function preview() {            // contoh singkat saat memilih suara / kecepatan (hanya jika tidak sedang memutar cerita)
    if (!SUPPORTED || state !== 'idle') return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance('Halo, ini suara untuk membacakan ceritamu.');
    applyTo(u);
    currentUtterance = u;
    setTimeout(() => synth.speak(u), 50);
  }
  function setRate(r) {
    prefs.rate = r; savePrefs();
    if (state === 'playing') speakFrom(pos); else { updateUI(); preview(); }
  }
  function setVoice(uri) {
    prefs.voiceURI = uri; savePrefs();
    renderVoiceChips();
    if (state === 'playing') speakFrom(pos); else { updateUI(); preview(); }
  }

  /* ---------- Layar tetap menyala saat memutar ---------- */
  async function acquireWake() {
    try {
      if ('wakeLock' in navigator && !wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } catch (e) { wakeLock = null; }
  }
  function releaseWake() { try { wakeLock && wakeLock.release(); } catch (e) { /* abaikan */ } wakeLock = null; }

  /* ---------- UI ---------- */
  function panelHTML() {
    const rateBtns = RATES.map(r => `<button type="button" class="vp-chip" role="radio" data-vp-rate="${r}" aria-checked="false">${String(r).replace('.', ',')}×</button>`).join('');
    return `
      <button type="button" class="vp-open" data-vp="menu" id="vpOpen" aria-expanded="false" aria-controls="vpCard">${ICON.head}<span>Dengarkan cerita</span></button>
      <div class="vp-card" id="vpCard" hidden>
      <div class="vp-cardhead"><strong>Dengarkan cerita</strong><button type="button" class="vp-x" data-vp="close" aria-label="Tutup menu audio">×</button></div>
      <div class="vp-head">
        <button type="button" class="pill-btn vp-play" data-vp="toggle"><span class="vp-play-text">Dengarkan cerita</span><i class="vp-play-ico">${ICON.play}</i></button>
        <div class="vp-info">
          <div class="vp-status" id="vpStatus">Siap dibacakan</div>
          <div class="vp-hint" id="vpHint"></div>
          <div class="vp-bar" aria-hidden="true"><i id="vpBar"></i></div>
        </div>
      </div>
      <div class="vp-nav" id="vpNav" hidden>
        <button type="button" class="vp-link" data-vp="prev">← Bagian sebelumnya</button>
        <button type="button" class="vp-link" data-vp="next">Bagian berikutnya →</button>
        <button type="button" class="vp-link" data-vp="restart">↺ Dari awal</button>
        <button type="button" class="vp-link" data-vp="stop">Hentikan</button>
      </div>
      <div class="vp-settings">
        <div class="vp-row"><span class="vp-label" id="vpVoiceLbl">Suara</span><div class="vp-chips" id="vpVoices" role="radiogroup" aria-labelledby="vpVoiceLbl"></div></div>
        <div class="vp-row"><span class="vp-label" id="vpRateLbl">Kecepatan</span><div class="vp-chips" role="radiogroup" aria-labelledby="vpRateLbl">${rateBtns}</div></div>
        <div class="vp-row"><span class="vp-label">Otomatis</span><button type="button" class="vp-switch" id="vpAuto" role="switch" aria-checked="false" data-vp-auto="1"><i></i><span>Lanjut ke cerita berikutnya</span></button></div>
      </div>
      <p class="vp-note" id="vpNote"></p>
      </div>`;
  }

  function renderVoiceChips() {
    const box = $('vpVoices'); if (!box) return;
    const list = sortedVoices().slice(0, 6), act = activeVoice();
    box.textContent = '';
    if (!list.length) {
      const s = document.createElement('span'); s.className = 'vp-empty'; s.textContent = 'Suara bawaan perangkat'; box.appendChild(s); return;
    }
    list.forEach((v, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'vp-chip'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(!!act && act.voiceURI === v.voiceURI));
      b.dataset.vpVoice = v.voiceURI;
      const n = document.createElement('span'); n.textContent = friendly(v, i); b.appendChild(n);
      const g = genderOf(v);
      if (g !== 'unknown') { const s = document.createElement('small'); s.textContent = g === 'female' ? 'cewek' : 'cowok'; b.appendChild(s); }
      if (isNatural(v)) { const t = document.createElement('span'); t.className = 'vp-badge'; t.textContent = 'Natural'; b.appendChild(t); }
      box.appendChild(b);
    });
  }

  function miniEl() {
    let el = $('vpMini');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'vpMini'; el.className = 'vp-mini hidden';
    el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Pemutar suara cerita');
    el.innerHTML = `
      <button type="button" class="vp-mini-play" data-vp="toggle" id="vpMiniPlay" aria-label="Jeda">${ICON.pause}</button>
      <button type="button" class="vp-mini-info" data-vp="open" aria-label="Buka cerita yang sedang dibacakan"><strong id="vpMiniTitle"></strong><small id="vpMiniSub"></small></button>
      <button type="button" class="vp-mini-step" data-vp="prev" aria-label="Bagian sebelumnya">‹</button>
      <button type="button" class="vp-mini-step" data-vp="next" aria-label="Bagian berikutnya">›</button>
      <button type="button" class="vp-mini-speed" data-vp="speed" id="vpMiniSpeed" aria-label="Ubah kecepatan">1×</button>
      <button type="button" class="vp-mini-close" data-vp="stop" aria-label="Hentikan dan tutup">×</button>`;
    document.body.appendChild(el);
    return el;
  }

  function applyHighlight() {
    document.querySelectorAll('.story-body > section.ef-speaking, .reality-check.ef-speaking').forEach(s => s.classList.remove('ef-speaking'));
    if (!mine() || !detailShown()) return;
    const sec = queue[Math.min(pos, queue.length - 1)]?.sec;
    if (sec === undefined || sec < 0) return;
    const el = sec === 5 ? document.querySelector('.reality-check') : document.querySelectorAll('.story-body > section')[sec];
    if (el) el.classList.add('ef-speaking');
  }

  function updateUI() {
    const item = currentItem();
    const active = state !== 'idle';
    const isMine = mine();
    const cur = queue[Math.min(pos, queue.length - 1)];
    const secLabel = cur ? cur.label : '';
    const panel = $('voicePanel');

    if (panel && item && SUPPORTED) {
      const card = $('vpCard'), opener = $('vpOpen');
      if (card) card.hidden = !menuOpen;
      if (opener) { opener.setAttribute('aria-expanded', String(menuOpen)); opener.classList.toggle('is-on', menuOpen); }
      panel.classList.toggle('is-open', menuOpen);
      let label = 'Dengarkan cerita', icon = ICON.play, status = '', hint = '';
      if (isMine && state === 'playing') {
        label = 'Jeda'; icon = ICON.pause; status = 'Sedang dibacakan · ' + secLabel;
        hint = 'Mau pindah bagian? Ketuk “putar dari sini” di bagian cerita mana pun.';
      } else if (isMine && state === 'paused') {
        label = 'Lanjutkan'; status = 'Dijeda · ' + secLabel;
        hint = `Berhenti di “${secLabel}”. Tekan Lanjutkan untuk meneruskan.`;
      } else if (finishedId === item.id) {
        label = 'Putar lagi'; status = 'Selesai dibacakan';
      } else {
        status = `Siap dibacakan · ± ${estimateMinutes(item)} menit`;
        if (active) hint = 'Cerita lain sedang diputar. Menekan tombol ini akan menggantinya.';
      }
      const btn = panel.querySelector('.vp-play');
      btn.querySelector('.vp-play-text').textContent = label;
      btn.querySelector('.vp-play-ico').innerHTML = icon;
      $('vpStatus').textContent = status;
      $('vpHint').textContent = hint;
      $('vpBar').style.width = (isMine ? Math.round(pos / (queue.length || 1) * 100) : finishedId === item.id ? 100 : 0) + '%';
      $('vpNav').hidden = !isMine;
      panel.classList.toggle('is-active', isMine);
      panel.querySelectorAll('[data-vp-rate]').forEach(b => b.setAttribute('aria-checked', String(Number(b.dataset.vpRate) === prefs.rate)));
      $('vpAuto').setAttribute('aria-checked', String(!!prefs.autoNext));
      const note = $('vpNote');
      const list = sortedVoices();
      let t = '';
      if (!list.length) t = 'Suara bahasa Indonesia belum terdeteksi di perangkat ini. Pasang lewat pengaturan Text-to-speech / Bahasa.';
      else if (!list.some(isNatural)) t = 'Tip: buka di Microsoft Edge untuk suara Indonesia “Natural” (Gadis & Ardi) yang terdengar lebih alami.';
      note.textContent = t;
    }

    document.body.classList.toggle('vp-menu-open', menuOpen && detailShown());   // tombol "putar dari sini" hanya tampil saat menu terbuka

    const mini = miniEl();
    const showMini = active && !(detailShown() && menuOpen && isMine);
    mini.classList.toggle('hidden', !showMini);
    document.body.classList.toggle('vp-mini-on', showMini);
    $('vpMiniPlay').innerHTML = state === 'playing' ? ICON.pause : ICON.play;
    $('vpMiniPlay').setAttribute('aria-label', state === 'playing' ? 'Jeda' : 'Lanjutkan');
    const playing = (window.experiences || []).find(x => x.id === storyId);
    $('vpMiniTitle').textContent = playing ? playing.title : '';
    $('vpMiniSub').textContent = `${secLabel} · ${state === 'paused' ? 'dijeda' : 'sedang dibacakan'} · ketuk untuk membuka`;
    $('vpMiniSpeed').textContent = String(prefs.rate).replace('.', ',') + '×';
    applyHighlight();
  }

  function addSectionButtons(host) {
    host.querySelectorAll('.story-body > section').forEach((sec, i) => {
      if (sec.querySelector('.vp-from')) return;
      const label = sec.querySelector('small'); if (!label) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'vp-from'; b.dataset.vpSec = String(i);
      b.setAttribute('aria-label', 'Dengarkan mulai dari bagian ini');
      b.innerHTML = ICON.tiny + '<span>putar dari sini</span>';
      label.after(b);
    });
  }

  function addRealityButton(host) {
    const label = host.querySelector('.reality-check .reality-heading small');
    if (!label || host.querySelector('.reality-check .vp-from')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'vp-from'; b.dataset.vpSec = '5';
    b.setAttribute('aria-label', 'Dengarkan mulai dari Reality check');
    b.innerHTML = ICON.tiny + '<span>putar dari sini</span>';
    label.after(b);
  }

  function inject() {
    const host = document.querySelector('#detailContent .full-story');
    if (!host || host.querySelector('.voice-panel')) return;
    const item = currentItem(); if (!item) return;
    // perpindahan otomatis ke cerita berikutnya -> langsung putar
    let autoStart = false;
    if (autoAdvance && storyId !== item.id) { autoAdvance = false; autoStart = true; }
    const panel = document.createElement('section');
    panel.className = 'voice-panel'; panel.id = 'voicePanel';
    panel.setAttribute('aria-label', 'Dengarkan cerita');
    if (!SUPPORTED) {
      panel.innerHTML = '<p class="vp-note">Browser ini belum mendukung fitur suara. Coba Chrome, Edge, atau Safari versi terbaru.</p>';
      host.insertBefore(panel, host.querySelector('.story-body'));
      return;
    }
    panel.innerHTML = panelHTML();
    host.insertBefore(panel, host.querySelector('.story-body'));
    addSectionButtons(host);
    addRealityButton(host);
    renderVoiceChips();
    menuOpen = false;
    updateUI();
    if (autoStart) begin(item);
  }

  /* ---------- Event ---------- */
  document.addEventListener('click', e => {
    if (!SUPPORTED) return;
    const t = e.target.closest('[data-vp],[data-vp-voice],[data-vp-rate],[data-vp-sec],[data-vp-auto]');
    if (!t) return;
    if (t.dataset.vpVoice !== undefined) return setVoice(t.dataset.vpVoice);
    if (t.dataset.vpRate) return setRate(Number(t.dataset.vpRate));
    if (t.dataset.vpSec !== undefined) return playFromSection(Number(t.dataset.vpSec));
    if (t.dataset.vpAuto) { prefs.autoNext = !prefs.autoNext; savePrefs(); return updateUI(); }
    const a = t.dataset.vp;
    if (a === 'menu') { menuOpen = !menuOpen; return updateUI(); }
    if (a === 'close') { menuOpen = false; return updateUI(); }
    if (a === 'toggle') {
      const fromPanel = !!t.closest('#voicePanel');
      if (state !== 'idle' && !mine()) {            // pemutar mini: kontrol cerita yang sedang aktif
        if (state === 'playing') pauseAll(); else speakFrom(pos);
      } else togglePlay();
      if (fromPanel && state === 'playing') { menuOpen = false; updateUI(); }   // mulai putar -> menu menutup, cerita kembali lega
    }
    else if (a === 'prev') { if (state !== 'idle') { if (mine()) jump(-1); else { const c = starts.filter(s => s <= pos).pop() ?? 0; const p = starts.filter(s => s < c); speakFrom(pos > c + 1 || !p.length ? c : p[p.length - 1]); } } }
    else if (a === 'next') { if (state !== 'idle') { if (mine()) jump(1); else { const n = starts.find(s => s > pos); if (n === undefined) finish(); else speakFrom(n); } } }
    else if (a === 'restart') { if (mine()) speakFrom(0); }
    else if (a === 'stop') stopAll();
    else if (a === 'speed') setRate(RATES[(RATES.indexOf(prefs.rate) + 1) % RATES.length]);
    else if (a === 'open') { if (storyId !== null && typeof window.openDetail === 'function') window.openDetail(storyId); }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { menuOpen = false; updateUI(); } });

  if (SUPPORTED) {
    loadVoices();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', loadVoices); else synth.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 600); setTimeout(loadVoices, 1800);
    window.addEventListener('pagehide', () => synth.cancel());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || state !== 'playing') return;
      acquireWake();
      if (!synth.speaking && !synth.pending) speakFrom(pos);
    });
  }

  const detailContent = $('detailContent');
  if (detailContent) new MutationObserver(inject).observe(detailContent, { childList: true });
  // Suara TIDAK dihentikan saat pindah halaman; pemutar mini tetap muncul agar bisa dijeda / dibuka lagi.
  const detailPage = $('detailPage');
  if (detailPage) new MutationObserver(() => updateUI()).observe(detailPage, { attributes: true, attributeFilter: ['class'] });
  inject();
})();
