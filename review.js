/* =====================================================================
   Experience Finder — Peninjauan Cerita (VERSI TAMPILAN / DUMMY)
   ---------------------------------------------------------------------
   Semua data di file ini hanya disimpan di localStorage browser sebagai
   contoh agar alur & tampilan bisa dilihat dan direvisi dulu.
   BELUM ADA DATABASE. Tidak ada yang dikirim ke Supabase.

   Login admin di sini hanya tampilan (username/password dummy di
   DEMO_ADMIN). Itu BUKAN keamanan. Saat database dikerjakan, pemeriksaan
   admin harus diganti dengan Supabase Auth + RLS, dan titik penggantian
   ditandai dengan komentar "TODO-DB".
   ===================================================================== */
(function () {
  'use strict';

  const el = id => document.getElementById(id);
  const esc = v => { const d = document.createElement('div'); d.textContent = v == null ? '' : String(v); return d.innerHTML; };

  const KEY = 'ef_review_demo_v1';
  const ADMIN_KEY = 'ef_admin_demo_session';
  const DRAFT_KEY = 'ef_draft';
  // TODO-DB: ganti dengan Supabase Auth (role admin) + kebijakan RLS.
  const DEMO_ADMIN = { username: 'admin', password: 'admin123', name: 'Admin Demo' };
  const OWNER = 'demo-user'; // TODO-DB: ganti dengan auth.uid() pemilik cerita.

  const ST = { WAIT: 'Menunggu Peninjauan', OK: 'Disetujui', FIX: 'Perlu Diperbaiki', NO: 'Ditolak' };
  const ST_CLASS = { [ST.WAIT]: 's-wait', [ST.OK]: 's-ok', [ST.FIX]: 's-fix', [ST.NO]: 's-no' };
  const DECISION_TO_STATUS = { ok: ST.OK, fix: ST.FIX, no: ST.NO };

  const CRITERIA = [
    { key: 'kelengkapan', no: '01', label: 'Kelengkapan',
      desc: 'Bagian-bagian cerita telah diisi dengan cukup jelas.',
      ask: 'Apakah bagian wajib (apa yang terjadi, apa yang dilakukan, pelajaran) terisi dengan kalimat yang cukup jelas?',
      meets: ['Bagian wajib terisi dengan kalimat yang utuh', 'Ada gambaran kejadian, tindakan, dan pelajaran'],
      fails: ['Hanya satu–dua kata atau teks asal isi', 'Bagian wajib hanya berisi pengulangan bagian lain'] },
    { key: 'relevansi', no: '02', label: 'Relevansi',
      desc: 'Cerita berkaitan dengan pengalaman seseorang.',
      ask: 'Apakah isinya berupa pengalaman yang benar-benar dialami penulis (bukan iklan, promosi, atau opini umum)?',
      meets: ['Menceritakan kejadian yang dialami penulis', 'Ada situasi, tindakan, dan hasil'],
      fails: ['Berisi promosi, tautan jualan, atau iklan', 'Hanya opini umum atau salinan artikel tanpa pengalaman pribadi'] },
    { key: 'kejelasan', no: '03', label: 'Kejelasan',
      desc: 'Isi cerita dapat dipahami oleh pembaca.',
      ask: 'Apakah pembaca bisa memahami alur dan maksud ceritanya?',
      meets: ['Alur kejadian dapat diikuti', 'Bahasa cukup mudah dipahami'],
      fails: ['Kalimat acak atau tidak berkaitan satu sama lain', 'Maksud cerita tidak bisa dipahami sama sekali'] },
    { key: 'privasi', no: '04', label: 'Privasi',
      desc: 'Tidak membocorkan informasi pribadi orang lain.',
      ask: 'Apakah cerita bebas dari data pribadi orang lain, misalnya nama lengkap, nomor telepon, alamat, atau akun media sosial?',
      meets: ['Orang lain disebut secara umum (“temanku”, “atasanku”)', 'Tidak ada nomor, alamat, atau identitas yang bisa dilacak'],
      fails: ['Menyebut nama lengkap beserta nomor induk, nomor HP, atau alamat', 'Menyebarkan akun atau foto orang lain tanpa izin'] },
    { key: 'keamanan', no: '05', label: 'Keamanan',
      desc: 'Tidak mengandung ancaman, penghinaan, atau konten berbahaya.',
      ask: 'Apakah cerita bebas dari ancaman, penghinaan, ujaran kebencian, atau konten berbahaya?',
      meets: ['Kritik disampaikan tanpa merendahkan orang', 'Tidak ada ajakan atau petunjuk yang membahayakan'],
      fails: ['Ancaman atau ajakan kekerasan', 'Penghinaan, ujaran kebencian, atau konten berbahaya'] },
    { key: 'komitmen', no: '06', label: 'Komitmen',
      desc: 'Penulis menyatakan bahwa cerita disampaikan secara bertanggung jawab.',
      ask: 'Apakah penulis sudah mencentang pernyataan tanggung jawab saat mengirim cerita?',
      meets: ['Pernyataan tanggung jawab dicentang saat mengirim'],
      fails: ['Pernyataan tidak tercatat pada pengiriman ini'] }
  ];
  const CRIT_BY_KEY = Object.fromEntries(CRITERIA.map(c => [c.key, c]));

  const state = { editingId: null, draftStash: null, startingEdit: false, guideFrom: 'home', adminFilter: ST.WAIT, reviewId: null };

  /* ------------------------------ data ------------------------------ */
  function ago(days, hours = 0) { return new Date(Date.now() - days * 864e5 - hours * 36e5).toISOString(); }
  function uid() { return 'r-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function seed() {
    const base = (o) => Object.assign({ ownerId: 'seed', isAnonymous: false, unexpected: '', repeat: '', revision: 1, commit: { accepted: true }, review: null, reviews: [], seen: true, publicId: null }, o);
    const ok = (extraFail) => { const c = {}; CRITERIA.forEach(x => c[x.key] = 'ok'); (extraFail || []).forEach(k => c[k] = 'fail'); return c; };
    return [
      base({ id: uid(), author: 'Wulan', category: 'Karier', situation: 'Rapat pertama di tempat magang', title: 'Aku diam saja di rapat pertamaku karena takut salah bicara', status: ST.WAIT, submittedAt: ago(0, 5),
        happened: 'Di rapat mingguan pertama, aku hanya mencatat dan tidak berani menyampaikan satu pun pendapat karena merasa semua orang lebih berpengalaman.',
        did: 'Setelah rapat, aku menanyakan hal yang belum kupahami kepada mentor. Di rapat berikutnya aku mencoba menyampaikan satu pertanyaan singkat.',
        unexpected: 'Mentorku justru senang karena ada yang bertanya. Pertanyaanku ternyata juga mewakili anak magang lain.',
        lesson: 'Satu pertanyaan kecil lebih baik daripada diam dan menyimpan bingung sendirian.',
        repeat: 'Aku akan menyiapkan satu pertanyaan sebelum rapat dimulai.' }),
      base({ id: uid(), author: 'Anonim', isAnonymous: true, category: 'Kehidupan Sehari-hari', situation: 'Pindah kos untuk pertama kali', title: 'Pindah kos ternyata tidak semudah yang kubayangkan', status: ST.WAIT, submittedAt: ago(1, 2),
        happened: 'Aku pindah kos karena jarak ke kampus terlalu jauh. Aku mengira cukup mengemas barang, ternyata ada urusan kontrak, deposit, dan jadwal angkut barang yang belum kupikirkan.',
        did: 'Aku membuat daftar urusan yang harus selesai dan mulai mengerjakannya dari yang paling mendesak. Aku juga bertanya ke teman yang pernah pindah kos.',
        unexpected: 'Pemilik kos baru ternyata terbuka soal aturan, jadi banyak kekhawatiranku tidak terjadi.',
        lesson: 'Pindah tempat tinggal butuh persiapan satu–dua minggu, bukan satu hari.',
        repeat: 'Aku akan menanyakan semua aturan tertulis sebelum membayar deposit.' }),
      base({ id: uid(), author: 'Dimas', category: 'Pendidikan', situation: 'Menjadi ketua kelompok', title: 'Pertama kali jadi ketua kelompok dan semua menunggu aku', status: ST.WAIT, submittedAt: ago(1, 9),
        happened: 'Aku ditunjuk jadi ketua kelompok tugas besar. Semua anggota menunggu arahan, sedangkan aku sendiri belum tahu harus mulai dari mana.',
        did: 'Aku mengajak semua anggota rapat singkat, menuliskan bagian tugas, lalu menyepakati tenggat kecil tiap minggu.',
        unexpected: 'Anggota lain ternyata lega ada yang mengatur. Mereka lebih mudah bergerak setelah punya bagian masing-masing.',
        lesson: 'Ketua tidak harus tahu semuanya, cukup membantu kelompok punya arah.',
        repeat: 'Aku akan membuat pembagian tugas di pertemuan pertama.' }),
      base({ id: uid(), author: 'Anonim', isAnonymous: true, category: 'Pengembangan Diri', situation: 'Terlalu sering membandingkan diri', title: 'Aku berhenti membandingkan progresku dengan unggahan orang lain', status: ST.WAIT, submittedAt: ago(2, 1),
        happened: 'Setiap membuka media sosial aku melihat teman seangkatan yang sudah magang atau lomba. Aku merasa tertinggal, padahal aku sedang mengerjakan hal lain.',
        did: 'Aku membatasi waktu membuka media sosial dan mulai menulis target kecilku sendiri tiap minggu.',
        unexpected: 'Tidak semua yang terlihat di unggahan adalah gambaran lengkap. Beberapa temanku ternyata juga merasa tertinggal.',
        lesson: 'Membandingkan diri dengan potongan cerita orang lain jarang adil untuk diri sendiri.',
        repeat: 'Aku akan lebih cepat membatasi waktu layar sejak awal.' }),
      base({ id: uid(), author: 'Rizky', category: 'Pertemanan & Sosial', situation: 'Melihat teman menyontek', title: 'Temanku menyontek saat ujian dan aku bingung harus bagaimana', status: ST.WAIT, submittedAt: ago(2, 6),
        happened: 'Teman sekelasku, Budi Santoso (NIM 2201234, no. HP 0812-XXXX-XXXX, tinggal di Jl. Melati No. 5), terlihat menyontek saat ujian akhir dan aku melihatnya langsung.',
        did: 'Aku diam saja saat ujian lalu menceritakannya ke beberapa teman lain setelahnya.',
        unexpected: 'Ternyata beberapa teman sudah tahu dan memilih tidak ikut campur.',
        lesson: 'Aku belajar bahwa memilih bersikap di situasi seperti ini tidak mudah.',
        repeat: 'Aku akan menanyakan dulu ke dosen cara melapor tanpa harus menyebut identitas.' }),
      base({ id: uid(), author: 'Tari', category: 'Karier', situation: 'Magang', title: 'Magang seru', status: ST.WAIT, submittedAt: ago(3, 3),
        happened: 'Seru banget magangnya.', did: 'Ya kerja aja.', lesson: 'Belajar banyak.' }),
      /* cerita milik pengguna demo (muncul di "Status ceritaku") */
      base({ id: uid(), ownerId: OWNER, author: 'Pengguna Demo', category: 'Pendidikan', situation: 'Ragu ikut lomba karya tulis', title: 'Aku ragu ikut lomba karya tulis karena merasa belum cukup bagus', status: ST.WAIT, submittedAt: ago(0, 2),
        happened: 'Ada lomba karya tulis di kampus. Aku ingin ikut, tetapi merasa tulisanku masih biasa saja dibandingkan teman-teman yang sudah sering menang.',
        did: 'Aku menulis draf pendek lalu meminta satu teman membacanya sebelum memutuskan mendaftar.',
        unexpected: 'Temanku justru bilang ide di tulisanku jarang diangkat orang lain.',
        lesson: 'Menunggu merasa siap sering membuat kesempatan lewat.',
        repeat: 'Aku akan mulai menulis lebih awal supaya ada waktu revisi.' }),
      base({ id: uid(), ownerId: OWNER, author: 'Pengguna Demo', category: 'Organisasi', situation: 'Memilih organisasi kampus', title: 'Aku bingung memilih organisasi yang cocok', status: ST.FIX, submittedAt: ago(3, 4), seen: false,
        happened: 'Di awal semester banyak organisasi membuka pendaftaran dan semuanya terlihat menarik. Aku bingung memilih karena takut salah pilih.',
        did: 'Aku coba-coba.', lesson: 'Jangan terburu-buru memilih.',
        review: { decision: 'fix', status: ST.FIX, criteria: ok(['kelengkapan', 'kejelasan']), failed: ['kelengkapan', 'kejelasan'], reviewer: DEMO_ADMIN.name, reviewedAt: ago(2, 3),
          reason: 'Bagian “Apa yang kamu lakukan?” baru berisi satu kalimat pendek sehingga pembaca belum tahu langkah apa yang kamu ambil. Tambahkan 2–3 kalimat tentang cara kamu membandingkan pilihan organisasi, lalu kirim ulang.' } }),
      base({ id: uid(), ownerId: OWNER, author: 'Pengguna Demo', category: 'Pendidikan', situation: 'Bimbingan skripsi', title: 'Dosen pembimbingku selalu menyebalkan dan tidak berguna', status: ST.NO, submittedAt: ago(4, 1), seen: false,
        happened: 'Pak Hendra Wijaya dari prodiku itu dosen yang bodoh. Setiap bimbingan aku selalu dibuat menunggu berjam-jam tanpa kejelasan.',
        did: 'Aku hanya diam dan menunggu sambil mengeluh ke teman-teman.', lesson: 'Dosennya memang tidak bisa diandalkan.',
        review: { decision: 'no', status: ST.NO, criteria: ok(['privasi', 'keamanan']), failed: ['privasi', 'keamanan'], reviewer: DEMO_ADMIN.name, reviewedAt: ago(3, 6),
          reason: 'Cerita menyebut nama lengkap dosen beserta kata yang merendahkan. Ini melanggar kriteria Privasi dan Keamanan pada pedoman. Kamu boleh menulis ulang pengalamanmu sebagai cerita baru tanpa menyebut identitas dan tanpa kata yang menghina.' } })
    ].map(s => { if (s.review) s.reviews = [s.review]; return s; });
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const v = JSON.parse(raw); if (Array.isArray(v)) return v; }
    } catch (e) { /* abaikan */ }
    const s = seed(); save(s); return s;
  }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* abaikan */ } }
  const byId = (list, id) => list.find(s => s.id === id);

  function fmtDate(iso) { try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } }
  function fmtDateTime(iso) { try { return fmtDate(iso) + ', ' + new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'); } catch (e) { return ''; } }
  const chip = status => `<span class="rv-chip ${ST_CLASS[status] || ''}">${esc(status)}</span>`;
  const authorLabel = s => s.isAnonymous ? 'Anonim' : s.author;
  const toast = m => (typeof showToast === 'function' ? showToast(m) : alert(m));
  const hasCloud = () => !!window.EFCloud;

  /* --------------------- publik: hanya cerita disetujui --------------------- */
  function toPublic(s) {
    return { id: s.publicId, category: s.category, situation: s.situation, title: s.title,
      author: s.isAnonymous ? 'Anonim' : s.author, role: s.isAnonymous ? 'Identitas dirahasiakan' : 'Pengguna',
      isAnonymous: s.isAnonymous, summary: s.happened, happened: s.happened, did: s.did, unexpected: s.unexpected || '',
      lesson: s.lesson, repeat: s.repeat || '', helpful: 0, keywords: [], fromReview: true };
  }
  function syncPublic() {
    // Hanya status Disetujui yang boleh masuk daftar publik / pencarian (TF-IDF memakai array ini).
    const exps = window.experiences; if (!exps) return false;
    let changed = false;
    load().forEach(s => {
      if (s.status === ST.OK && s.publicId && !exps.some(x => String(x.id) === String(s.publicId))) { exps.unshift(toPublic(s)); changed = true; }
    });
    return changed;
  }
  function refreshPublic() { if (typeof window.renderCloudStories === 'function') window.renderCloudStories(); }

  /* ------------------------------ navigasi ------------------------------ */
  function open(pageId) {
    if (typeof showPage === 'function') showPage(el(pageId));
    if (typeof setNav === 'function') setNav('');
    const pm = el('profileMenu'); if (pm) pm.classList.add('hidden');
  }

  /* ----------------------------- pedoman ----------------------------- */
  function showGuidelines(from) {
    state.guideFrom = from || 'home';
    renderGuidelines();
    open('guidelinesPage');
  }
  function backFromGuidelines() {
    const f = state.guideFrom;
    if (f === 'share' && typeof showShare === 'function') showShare();
    else if (f === 'admin') showAdmin();
    else if (f === 'mystories') showMyStories();
    else if (typeof showHome === 'function') showHome();
  }
  function renderGuidelines() {
    el('guidelinesContent').innerHTML = `
      <div class="rv-crit-grid">
        ${CRITERIA.map(c => `
          <article class="rv-crit-card">
            <div class="rv-crit-top"><span class="rv-no">${c.no}</span><h3>${esc(c.label)}</h3></div>
            <p class="rv-crit-desc">${esc(c.desc)}</p>
            <div class="rv-two">
              <div><small class="rv-ok-t">memenuhi</small><ul>${c.meets.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
              <div><small class="rv-no-t">belum memenuhi</small><ul>${c.fails.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
            </div>
          </article>`).join('')}
      </div>
      <aside class="rv-guide-side">
        <div class="rv-side-card">
          <h3>Admin tidak menilai benar atau bohong</h3>
          <p>Admin hanya memeriksa apakah cerita layak dipublikasikan menurut enam kriteria di samping. Keputusan tidak boleh didasarkan pada:</p>
          <ul class="rv-plain">
            <li>perbedaan pendapat dengan penulis</li>
            <li>ketidaksukaan pribadi pada topik, gaya bahasa, atau penulis</li>
            <li>anggapan bahwa cerita terasa biasa atau kurang menarik</li>
          </ul>
        </div>
        <div class="rv-side-card">
          <h3>Tiga keputusan</h3>
          <div class="rv-dec-list">
            <div>${chip(ST.OK)}<p>Memenuhi semua kriteria dan dapat dipublikasikan.</p></div>
            <div>${chip(ST.FIX)}<p>Perlu diperbaiki penulis. Admin wajib menulis alasan, lalu penulis bisa mengedit dan mengirim ulang.</p></div>
            <div>${chip(ST.NO)}<p>Melanggar pedoman dan tidak dapat dipublikasikan. Admin wajib menulis alasan berdasarkan kriteria.</p></div>
          </div>
        </div>
      </aside>`;
  }

  /* ------------------------ form Bagikan (konfirmasi) ------------------------ */
  function confirmChecked() {
    const box = el('commitCheck'), err = el('commitError');
    if (box && box.checked) { if (err) err.classList.add('hidden'); return true; }
    if (err) err.classList.remove('hidden');
    if (box) { box.focus(); el('commitBox')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    toast('Centang pernyataan tanggung jawab dulu sebelum mengirim cerita.');
    return false;
  }

  function finishForm() {
    const f = el('shareForm'); if (f) f.reset();
    try {
      if (state.editingId) { state.draftStash == null ? localStorage.removeItem(DRAFT_KEY) : localStorage.setItem(DRAFT_KEY, state.draftStash); }
      else localStorage.removeItem(DRAFT_KEY);
    } catch (e) { /* abaikan */ }
    resetEditUI();
    if (typeof updateAllCounters === 'function') updateAllCounters();
  }

  // Dipanggil dari script.js saat form dikirim (setelah validasi & cek login).
  // TODO-DB: ganti penyimpanan localStorage di bawah dengan insert/update ke Supabase
  //          (status awal 'Menunggu Peninjauan').
  function handleSubmit(d) {
    const list = load(), now = new Date().toISOString();
    const fields = { category: d.category, situation: d.situation, title: d.title, isAnonymous: d.isAnonymous, author: d.authorName,
      happened: d.happened, did: d.did, unexpected: d.unexpected, lesson: d.lesson, repeat: d.repeat };
    let resubmitted = false;
    if (state.editingId) {
      const s = byId(list, state.editingId);
      if (s) { Object.assign(s, fields, { status: ST.WAIT, submittedAt: now, revision: (s.revision || 1) + 1, commit: { accepted: true, at: now }, seen: true }); resubmitted = true; }
    }
    if (!resubmitted) {
      list.unshift(Object.assign({ id: uid(), ownerId: OWNER, unexpected: '', repeat: '', status: ST.WAIT, submittedAt: now, revision: 1,
        commit: { accepted: true, at: now }, review: null, reviews: [], seen: true, publicId: null }, fields));
    }
    save(list);
    finishForm();
    updateBadges();
    showMyStories();
    toast(resubmitted ? 'Cerita dikirim ulang dan menunggu peninjauan.' : 'Cerita terkirim. Admin akan meninjaunya sebelum tampil di Temukan.');
    return true;
  }

  function resetEditUI() {
    state.editingId = null; state.draftStash = null;
    el('rvEditBanner')?.classList.add('hidden');
    el('rvCancelEdit')?.classList.add('hidden');
    el('clearDraftButton')?.classList.remove('hidden');
    const b = document.querySelector('.send-story'); if (b) b.innerHTML = 'Bagikan cerita <i>↗</i>';
  }

  function startEdit(id) {
    const s = byId(load(), id);
    if (!s || s.status !== ST.FIX) return;
    state.startingEdit = true;
    try { if (typeof showShare === 'function') showShare(); } finally { state.startingEdit = false; }
    if (el('sharePage').classList.contains('hidden')) return; // belum login
    state.editingId = id;
    try { state.draftStash = localStorage.getItem(DRAFT_KEY); } catch (e) { state.draftStash = null; }
    ['title', 'category', 'situation', 'happened', 'did', 'unexpected', 'lesson', 'repeat'].forEach(f => { if (el(f)) el(f).value = s[f] || ''; });
    el('storyVisibility').value = s.isAnonymous ? 'anonymous' : 'profile';
    el('commitCheck').checked = false;
    el('commitError').classList.add('hidden');
    const r = s.review;
    el('rvEditBanner').innerHTML = `<strong>Perbaiki ceritamu, lalu kirim ulang.</strong><p>${esc(r ? r.reason : '')}</p>` +
      (r && r.failed && r.failed.length ? `<div class="rv-fail-chips">${r.failed.map(k => `<span>${esc(CRIT_BY_KEY[k].label)}</span>`).join('')}</div>` : '');
    el('rvEditBanner').classList.remove('hidden');
    el('rvCancelEdit').classList.remove('hidden');
    el('clearDraftButton').classList.add('hidden');
    document.querySelector('.send-story').innerHTML = 'Kirim ulang untuk ditinjau <i>↗</i>';
    if (typeof updateAllCounters === 'function') updateAllCounters();
  }
  function cancelEdit() {
    const stash = state.draftStash;
    el('shareForm').reset();
    try { stash == null ? localStorage.removeItem(DRAFT_KEY) : localStorage.setItem(DRAFT_KEY, stash); } catch (e) { /* abaikan */ }
    resetEditUI();
    if (typeof updateAllCounters === 'function') updateAllCounters();
    showMyStories();
  }

  /* ------------------------- status cerita pengguna ------------------------- */
  function showMyStories() {
    if (!hasCloud()) { toast('Layanan login belum termuat. Muat ulang halaman.'); return; }
    if (typeof window.EFCloud.requireLoginForShare === 'function' && !window.EFCloud.requireLoginForShare()) return;
    // TODO-DB: ambil cerita milik auth.uid() dari Supabase.
    const list = load();
    const mine = list.filter(s => s.ownerId === OWNER).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    renderMyStories(mine);
    open('myStoriesPage');
    // tandai notifikasi sudah dibaca
    let changed = false; list.forEach(s => { if (s.ownerId === OWNER && s.seen === false) { s.seen = true; changed = true; } });
    if (changed) { save(list); updateBadges(); }
  }

  function renderMyStories(mine) {
    const box = el('myStoriesList');
    if (!mine.length) {
      box.innerHTML = `<div class="empty"><div class="empty-icon">?</div><h3>Belum ada cerita yang kamu kirim.</h3><p>Setelah kamu mengirim cerita, statusnya akan muncul di sini.</p><button onclick="showShare()">tulis cerita</button></div>`;
      return;
    }
    box.innerHTML = mine.map(s => {
      const r = s.review;
      let body = '';
      if (s.status === ST.WAIT) {
        body = `<p class="rv-note-line">${s.revision > 1 ? 'Revisi ke-' + s.revision + ' sedang' : 'Ceritamu sedang'} menunggu giliran ditinjau. Cerita belum tampil di halaman Temukan.</p>`;
      } else if (s.status === ST.OK) {
        body = `<p class="rv-note-line">Cerita ini sudah tampil di halaman Temukan dan bisa ditemukan lewat pencarian.</p>
          <div class="rv-actions"><button class="rv-ghost" onclick="ReviewDemo.viewPublic('${esc(s.id)}')">Lihat di Temukan ↗</button></div>`;
      } else if (r) {
        body = `<div class="rv-feedback ${s.status === ST.NO ? 'is-no' : 'is-fix'}">
            <small>${s.status === ST.NO ? 'ALASAN PENOLAKAN' : 'YANG PERLU DIPERBAIKI'}</small>
            <p>${esc(r.reason)}</p>
            ${r.failed && r.failed.length ? `<div class="rv-fail-chips"><em>Kriteria terkait:</em>${r.failed.map(k => `<span>${esc(CRIT_BY_KEY[k].label)}</span>`).join('')}</div>` : ''}
            <small class="rv-by">Ditinjau tim admin · ${esc(fmtDate(r.reviewedAt))}</small>
          </div>
          <div class="rv-actions">
            ${s.status === ST.FIX ? `<button class="pill-btn" onclick="ReviewDemo.startEdit('${esc(s.id)}')">Perbaiki &amp; kirim ulang <i>↗</i></button>` : `<button class="rv-ghost" onclick="showShare()">Tulis cerita baru</button><button class="rv-ghost" onclick="ReviewDemo.showGuidelines('mystories')">Baca pedoman</button>`}
          </div>`;
      }
      return `<article class="rv-my-card">
          <div class="rv-card-top">${chip(s.status)}<span class="rv-meta">Dikirim ${esc(fmtDate(s.submittedAt))}${s.revision > 1 ? ' · revisi ke-' + s.revision : ''}</span></div>
          <h3>${esc(s.title)}</h3>
          <div class="story-meta"><span class="category">${esc(s.category)}</span><span>${esc(s.situation)}</span><span>tampil sebagai ${s.isAnonymous ? 'Anonim' : 'nama profil'}</span></div>
          ${body}
        </article>`;
    }).join('');
  }

  function viewPublic(id) {
    const s = byId(load(), id);
    if (s && s.publicId && typeof openDetail === 'function') openDetail(s.publicId);
  }

  function updateBadges() {
    const n = load().filter(s => s.ownerId === OWNER && s.seen === false).length;
    const c = el('rvMenuCount');
    if (c) { c.textContent = n; c.classList.toggle('hidden', !n); }
    el('profileButton')?.classList.toggle('has-update', n > 0);
  }

  /* ------------------------------- admin ------------------------------- */
  // TODO-DB: ganti dengan cek sesi Supabase + role admin. RLS harus menegakkannya di server.
  const isAdmin = () => { try { return sessionStorage.getItem(ADMIN_KEY) === '1'; } catch (e) { return false; } };

  function openAdmin() { isAdmin() ? showAdmin() : showAdminLogin(); }
  function showAdminLogin() {
    el('adminLoginError').classList.add('hidden');
    open('adminLoginPage');
  }
  function adminLogin(e) {
    e.preventDefault();
    const u = el('adminUser').value.trim(), p = el('adminPass').value;
    if (u === DEMO_ADMIN.username && p === DEMO_ADMIN.password) {
      try { sessionStorage.setItem(ADMIN_KEY, '1'); } catch (x) { /* abaikan */ }
      el('adminPass').value = '';
      state.adminFilter = ST.WAIT;
      showAdmin();
    } else {
      el('adminLoginError').classList.remove('hidden');
    }
  }
  function adminLogout() {
    try { sessionStorage.removeItem(ADMIN_KEY); } catch (e) { /* abaikan */ }
    syncAdminLink();
    if (typeof showHome === 'function') showHome();
    toast('Kamu keluar dari area admin.');
  }
  function syncAdminLink() { const a = el('adminFooterLink'); if (a) a.textContent = isAdmin() ? 'Dashboard admin' : 'Admin'; }

  function showAdmin() {
    if (!isAdmin()) { showAdminLogin(); return; } // gerbang halaman admin
    state.reviewId = null;
    el('adminWho').textContent = 'Masuk sebagai ' + DEMO_ADMIN.name;
    syncAdminLink();
    renderAdminList();
    open('adminPage');
  }

  function renderAdminList() {
    // TODO-DB: ambil dari Supabase (hanya admin yang boleh membaca semua cerita).
    const list = load();
    const count = st => list.filter(s => s.status === st).length;
    const filter = state.adminFilter;
    const rows = list.filter(s => s.status === filter)
      .sort((a, b) => filter === ST.WAIT ? new Date(a.submittedAt) - new Date(b.submittedAt) : new Date((b.review || {}).reviewedAt || b.submittedAt) - new Date((a.review || {}).reviewedAt || a.submittedAt));
    el('adminBody').innerHTML = `
      <div class="rv-stats" role="tablist" aria-label="Filter status">
        ${Object.values(ST).map(st => `<button role="tab" aria-selected="${st === filter}" class="rv-stat ${ST_CLASS[st]} ${st === filter ? 'on' : ''}" onclick="ReviewDemo.setFilter('${st}')"><strong>${count(st)}</strong><span>${esc(st)}</span></button>`).join('')}
      </div>
      <p class="rv-list-hint">${filter === ST.WAIT ? 'Urutan dari yang paling lama menunggu, supaya semua cerita ditinjau adil.' : 'Daftar cerita dengan status ' + esc(filter) + '.'}</p>
      <div class="rv-list">
        ${rows.length ? rows.map(s => `
          <article class="rv-item">
            <div class="rv-card-top">${chip(s.status)}<span class="rv-meta">${esc(fmtDate(s.submittedAt))}${s.revision > 1 ? ' · revisi ke-' + s.revision : ''}</span></div>
            <h3>${esc(s.title)}</h3>
            <div class="story-meta"><span class="category">${esc(s.category)}</span><span class="${s.isAnonymous ? 'rv-anon' : ''}">${s.isAnonymous ? 'Anonim' : esc(s.author)}</span></div>
            <p class="rv-excerpt">${esc((s.happened || '').slice(0, 170))}${(s.happened || '').length > 170 ? '…' : ''}</p>
            <button class="pill-btn" onclick="ReviewDemo.openReview('${esc(s.id)}')">${s.status === ST.WAIT ? 'Tinjau cerita' : 'Lihat hasil peninjauan'} <i>→</i></button>
          </article>`).join('') : `<div class="empty"><div class="empty-icon">✓</div><h3>Tidak ada cerita di status ini.</h3><p>Pilih status lain di atas.</p></div>`}
      </div>`;
  }
  function setFilter(st) { state.adminFilter = st; renderAdminList(); }

  function storyBlock(label, text, n) {
    return `<section class="rv-block"><span class="step">${n}</span><div><small>${label}</small><p>${text ? esc(text) : '<em class="rv-empty-text">Tidak diisi.</em>'}</p></div></section>`;
  }

  function openReview(id) {
    if (!isAdmin()) { showAdminLogin(); return; }
    const s = byId(load(), id); if (!s) return;
    state.reviewId = id;
    const done = s.status !== ST.WAIT;
    const r = s.review;
    el('adminBody').innerHTML = `
      <button class="back-button" onclick="ReviewDemo.showAdmin()">← kembali ke daftar</button>
      <div class="rv-review">
        <article class="rv-read">
          <div class="rv-card-top">${chip(s.status)}<span class="rv-meta">Dikirim ${esc(fmtDateTime(s.submittedAt))}${s.revision > 1 ? ' · revisi ke-' + s.revision : ''}</span></div>
          <h2>${esc(s.title)}</h2>
          <div class="story-meta"><span class="category">${esc(s.category)}</span><span>${esc(s.situation)}</span></div>
          <div class="rv-author"><span class="avatar">${esc((s.isAnonymous ? 'A' : s.author.charAt(0)).toUpperCase())}</span><span><strong>${s.isAnonymous ? 'Anonim' : esc(s.author)}</strong><small>${s.isAnonymous ? 'Penulis memilih tampil anonim di halaman publik' : 'Tampil dengan nama profil'}</small></span></div>
          <div class="rv-body">
            ${storyBlock('apa yang terjadi', s.happened, '01')}
            ${storyBlock('apa yang dilakukan', s.did, '02')}
            ${storyBlock('yang ternyata berbeda', s.unexpected, '03')}
            ${storyBlock('yang dipelajari', s.lesson, '04')}
            ${storyBlock('kalau mengulang lagi', s.repeat, '05')}
          </div>
          <div class="rv-commit-line">✓ Penulis mencentang pernyataan tanggung jawab${s.commit && s.commit.at ? ' pada ' + esc(fmtDateTime(s.commit.at)) : ''}.</div>
        </article>
        <aside class="rv-panel">${done ? resultPanel(s) : decisionPanel(s)}</aside>
      </div>`;
    if (!done) wireDecisionForm(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resultPanel(s) {
    const r = s.review || {};
    return `<h3>Hasil peninjauan</h3>
      <div class="rv-result">${chip(s.status)}
        <ul class="rv-crit-result">${CRITERIA.map(c => `<li class="${(r.criteria || {})[c.key] === 'fail' ? 'f' : 'o'}"><b>${(r.criteria || {})[c.key] === 'fail' ? '✕' : '✓'}</b>${esc(c.label)}</li>`).join('')}</ul>
        ${r.reason ? `<div class="rv-feedback"><small>ALASAN / CATATAN</small><p>${esc(r.reason)}</p></div>` : ''}
        <small class="rv-by">Ditinjau oleh ${esc(r.reviewer || '—')} · ${esc(fmtDateTime(r.reviewedAt))}</small>
        ${s.status === ST.FIX ? '<small class="rv-by">Menunggu penulis memperbaiki dan mengirim ulang.</small>' : ''}
      </div>`;
  }

  function decisionPanel(s) {
    return `<form id="rvForm" novalidate>
      <h3>Peninjauan berdasarkan pedoman</h3>
      <p class="rv-hint">Nilai setiap kriteria. Jangan menolak karena perbedaan pendapat atau ketidaksukaan pribadi. <button type="button" class="inline-link" onclick="ReviewDemo.showGuidelines('admin')">Baca pedoman</button></p>
      <div class="rv-crit-rows">
        ${CRITERIA.map(c => `
          <fieldset class="rv-crit-row">
            <legend><b>${c.no}</b> ${esc(c.label)}</legend>
            <small>${esc(c.ask)}</small>
            <div class="rv-seg">
              <label><input type="radio" name="c_${c.key}" value="ok"><span class="ok">Terpenuhi</span></label>
              <label><input type="radio" name="c_${c.key}" value="fail"><span class="fail">Belum terpenuhi</span></label>
            </div>
          </fieldset>`).join('')}
      </div>
      <div class="rv-summary" id="rvSummary" aria-live="polite"></div>

      <div class="rv-block-label">Keputusan</div>
      <div class="rv-decisions">
        <label class="rv-dec d-ok"><input type="radio" name="decision" value="ok"><span><strong>Disetujui</strong><small>Semua kriteria terpenuhi. Cerita langsung tampil.</small></span></label>
        <label class="rv-dec d-fix"><input type="radio" name="decision" value="fix"><span><strong>Perlu Diperbaiki</strong><small>Penulis diminta mengedit dan mengirim ulang. Alasan wajib.</small></span></label>
        <label class="rv-dec d-no"><input type="radio" name="decision" value="no"><span><strong>Ditolak</strong><small>Melanggar pedoman dan tidak dipublikasikan. Alasan wajib.</small></span></label>
      </div>

      <label class="rv-reason">
        <span id="rvReasonLabel">Alasan keputusan</span>
        <textarea id="rvReason" maxlength="600" placeholder="Tulis alasan yang merujuk ke kriteria pedoman..."></textarea>
        <span class="char-count" id="rvReasonCount">0 / 600</span>
      </label>

      <label class="commit-box rv-confirm"><input type="checkbox" id="rvConfirm"><span>Keputusan ini saya ambil berdasarkan pedoman peninjauan, bukan karena perbedaan pendapat atau ketidaksukaan pribadi.</span></label>
      <ul class="rv-errors hidden" id="rvError" role="alert"></ul>
      <button class="pill-btn" type="submit">Simpan keputusan <i>→</i></button>
    </form>`;
  }

  function wireDecisionForm(s) {
    const form = el('rvForm');
    const read = () => {
      const crit = {}; CRITERIA.forEach(c => { const x = form.querySelector(`input[name="c_${c.key}"]:checked`); crit[c.key] = x ? x.value : ''; });
      const d = form.querySelector('input[name="decision"]:checked');
      return { crit, decision: d ? d.value : '' };
    };
    const update = () => {
      const { crit, decision } = read();
      const vals = Object.values(crit);
      const okN = vals.filter(v => v === 'ok').length, failN = vals.filter(v => v === 'fail').length, none = vals.length - okN - failN;
      el('rvSummary').innerHTML = `<span class="o">${okN} terpenuhi</span><span class="f">${failN} belum terpenuhi</span><span>${none} belum dinilai</span>`;
      const lab = el('rvReasonLabel');
      lab.textContent = decision === 'ok' ? 'Catatan untuk penulis (opsional)' : decision ? 'Alasan keputusan (wajib)' : 'Alasan keputusan';
      el('rvReasonCount').textContent = `${el('rvReason').value.length} / 600`;
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
    form.addEventListener('submit', e => {
      e.preventDefault();
      const { crit, decision } = read();
      const reason = el('rvReason').value.trim();
      const unrated = CRITERIA.filter(c => !crit[c.key]);
      const failed = CRITERIA.filter(c => crit[c.key] === 'fail').map(c => c.key);
      const errs = [];
      if (unrated.length) errs.push(`Nilai dulu semua kriteria (${unrated.length} belum dinilai).`);
      if (!decision) errs.push('Pilih salah satu keputusan.');
      if (decision === 'ok' && failed.length) errs.push('“Disetujui” hanya bisa dipilih jika semua kriteria terpenuhi.');
      if ((decision === 'fix' || decision === 'no') && !failed.length && !unrated.length) errs.push('Tandai minimal satu kriteria “Belum terpenuhi” sebagai dasar keputusan.');
      if ((decision === 'fix' || decision === 'no') && reason.length < 15) errs.push('Tulis alasan minimal 15 karakter agar penulis tahu dasar keputusannya.');
      if (!el('rvConfirm').checked) errs.push('Centang pernyataan bahwa keputusan berdasarkan pedoman.');
      const box = el('rvError');
      if (errs.length) { box.innerHTML = errs.map(x => `<li>${esc(x)}</li>`).join(''); box.classList.remove('hidden'); box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
      box.classList.add('hidden');
      commitDecision(s.id, decision, crit, failed, reason);
    });
  }

  // TODO-DB: simpan ke Supabase (status, alasan, waktu, id admin) lewat aturan RLS khusus admin.
  function commitDecision(id, decision, crit, failed, reason) {
    const list = load(), s = byId(list, id); if (!s) return;
    const status = DECISION_TO_STATUS[decision];
    const review = { decision, status, criteria: crit, failed, reason, reviewer: DEMO_ADMIN.name, reviewedAt: new Date().toISOString() };
    s.status = status; s.review = review; (s.reviews = s.reviews || []).push(review);
    if (s.ownerId === OWNER) s.seen = false;
    if (status === ST.OK && !s.publicId) s.publicId = Date.now() + Math.floor(Math.random() * 1000);
    save(list);
    if (status === ST.OK && syncPublic()) refreshPublic();
    updateBadges();
    state.adminFilter = ST.WAIT;
    showAdmin();
    toast('Keputusan tersimpan: ' + status + '.');
  }

  function resetDemo() {
    if (!window.confirm('Kembalikan semua data contoh peninjauan ke kondisi awal?')) return;
    const exps = window.experiences;
    if (exps) for (let i = exps.length - 1; i >= 0; i--) if (exps[i].fromReview) exps.splice(i, 1);
    try { localStorage.removeItem(KEY); } catch (e) { /* abaikan */ }
    load(); refreshPublic(); updateBadges();
    state.adminFilter = ST.WAIT;
    showAdmin();
    toast('Data demo dikembalikan.');
  }

  /* --------------------- stub login (hanya bila cloud.js tidak ada) --------------------- */
  function installStub() {
    if (window.EFCloud) return;
    const user = { id: OWNER, email: 'demo@contoh.id', user_metadata: { full_name: 'Pengguna Demo' } };
    window.EFCloud = {
      isStub: true, getUser: () => user,
      requireLoginForShare: () => true, requireLoginForRead: () => true, renderCommunity() {},
      openAuth() { toast('Mode demo: login asli aktif jika cloud.js ada.'); }, closeAuth() {}, toggleAuthMode() {}, signInGoogle() {}, resetPassword() {},
      toggleProfile() { el('profileMenu').classList.toggle('hidden'); },
      signOut() { toast('Mode demo: tidak ada akun yang benar-benar masuk.'); el('profileMenu').classList.add('hidden'); },
      publishStory: async () => ({ ok: false, reason: 'mode demo' }), updateStory: async () => ({ ok: false, reason: 'mode demo' }), deleteStory: async () => ({ ok: false, reason: 'mode demo' })
    };
    el('accountButton')?.classList.add('hidden');
    el('profileButton')?.classList.remove('hidden');
    if (el('profileName')) el('profileName').textContent = 'Pengguna Demo';
    if (el('profileEmail')) el('profileEmail').textContent = 'demo@contoh.id';
    updateBadges();
  }
  window.addEventListener('error', e => { const t = e.target; if (t && t.tagName === 'SCRIPT' && /cloud\.js/.test(t.src || '')) installStub(); }, true);

  /* ------------------------------- init ------------------------------- */
  // Jika pengguna membuka halaman Bagikan biasa saat sedang mode perbaikan, keluarkan dari mode perbaikan.
  const origShowShare = window.showShare;
  if (typeof origShowShare === 'function') {
    window.showShare = function () {
      if (state.editingId && !state.startingEdit) {
        const stash = state.draftStash;
        el('shareForm').reset();
        try { stash == null ? localStorage.removeItem(DRAFT_KEY) : localStorage.setItem(DRAFT_KEY, stash); } catch (e) { /* abaikan */ }
        resetEditUI();
      }
      return origShowShare.apply(this, arguments);
    };
  }

  function route() {
    if (location.hash === '#admin') openAdmin();
  }
  window.addEventListener('hashchange', route);
  el('adminLoginForm')?.addEventListener('submit', adminLogin);

  load();
  if (syncPublic()) refreshPublic();
  updateBadges();
  syncAdminLink();
  setTimeout(route, 250);

  window.ReviewDemo = { showGuidelines, backFromGuidelines, showMyStories, startEdit, cancelEdit, viewPublic, openAdmin, showAdmin, adminLogout,
    setFilter, openReview, resetDemo, confirmChecked, handleSubmit, STATUS: ST };
})();
