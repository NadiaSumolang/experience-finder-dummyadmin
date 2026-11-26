import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.js';

const configured = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(SUPABASE_URL) &&
  typeof SUPABASE_PUBLISHABLE_KEY === 'string' &&
  SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_') &&
  SUPABASE_PUBLISHABLE_KEY.length > 20 &&
  !SUPABASE_PUBLISHABLE_KEY.includes('PASTE_');

const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
}) : null;

let session = null;
let authMode = 'login';
let currentCommentStory = null;
let pendingAction = null;
let cloudLoadPromise = null;
const PENDING_KEY = 'ef_pending';
const $c = id => document.getElementById(id);
const escapeHtml = value => {
  const element = document.createElement('div');
  element.textContent = value ?? '';
  return element.innerHTML;
};
const showToastSafe = message => window.showToast ? window.showToast(message) : alert(message);
const redirectUrl = () => `${window.location.origin}${window.location.pathname}`;
const displayName = user =>
  user?.user_metadata?.full_name ||
  user?.user_metadata?.name ||
  user?.email?.split('@')[0] ||
  'Pengguna';

function authMessage(message, error = false) {
  const element = $c('authMessage');
  if (!element) return;
  element.textContent = message;
  element.classList.toggle('error', error);
}

function setMode(mode) {
  authMode = mode;
  const signup = mode === 'signup';
  $c('authTitle').textContent = signup ? 'Buat ruang ceritamu.' : 'Senang bertemu kamu.';
  $c('authSubtitle').textContent = signup
    ? 'Buat akun untuk membaca cerita lengkap, menyimpan pengalaman, dan berbagi cerita.'
    : 'Masuk untuk membaca cerita lengkap, menyimpan pengalaman, dan ikut berdiskusi.';
  $c('authSubmit').textContent = signup ? 'Buat akun' : 'Masuk';
  $c('authNameLabel').classList.toggle('hidden', !signup);
  $c('authName').required = signup;
  $c('authSwitchText').textContent = signup ? 'Sudah punya akun?' : 'Belum punya akun?';
  $c('authSwitchButton').textContent = signup ? 'Masuk' : 'Daftar';
  $c('forgotPasswordButton').classList.toggle('hidden', signup);
  authMessage('');
}

function openAuth() {
  $c('profileMenu')?.classList.add('hidden');
  $c('authModal')?.classList.remove('hidden');
  setMode(authMode);
  if (!configured) {
    authMessage('Supabase belum dikonfigurasi. Isi supabase-config.js sesuai panduan.', true);
  }
}

function closeAuth() {
  $c('authModal')?.classList.add('hidden');
  try { sessionStorage.removeItem(PENDING_KEY); } catch {}
}

function toggleAuthMode() {
  setMode(authMode === 'login' ? 'signup' : 'login');
}

function toggleProfile() {
  $c('profileMenu')?.classList.toggle('hidden');
}

function clearCloudStories() {
  const stories = window.experiences;
  if (!Array.isArray(stories)) return;
  const activeId = window.getCurrentStoryId?.();
  const activeStory = stories.find(story => String(story.id) === String(activeId));
  const wasReadingCloudStory = Boolean(activeStory?.cloud);
  for (let index = stories.length - 1; index >= 0; index--) {
    if (stories[index].cloud) stories.splice(index, 1);
  }
  window.renderCloudStories?.();
  if (wasReadingCloudStory || ($c('sharePage') && !$c('sharePage').classList.contains('hidden'))) {
    window.showHome?.();
  }
}

function resumePendingAction() {
  if (!session?.user || !pendingAction) return;
  const pending = pendingAction;
  if (pending.type === 'share') {
    pendingAction = null;
    window.showShare?.();
    return;
  }
  if (pending.type === 'read') {
    const id = Number(pending.id);
    const found = window.experiences?.some(story => String(story.id) === String(id));
    pendingAction = null;
    if (!found) { showToastSafe('Cerita tidak ditemukan atau tidak tersedia di akun ini.'); return; }
    window.openDetail?.(id);
  }
}

function setUser(user) {
  session = user ? { user } : null;
  $c('accountButton')?.classList.toggle('hidden', !!user);
  $c('profileButton')?.classList.toggle('hidden', !user);
  $c('profileMenu')?.classList.add('hidden');

  if (user) {
    const name = displayName(user);
    $c('profileInitial').textContent = name.trim().charAt(0).toUpperCase();
    $c('profileName').textContent = name;
    $c('profileEmail').textContent = user.email || '';
    try {
      pendingAction = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null') || pendingAction;
    } catch {}
    closeAuth();
    loadCloudStories().then(resumePendingAction);
  } else {
    pendingAction = null;
    clearCloudStories();
  }
}

async function signInGoogle() {
  if (!configured) { openAuth(); return; }
  authMessage('Menghubungkan ke Google…');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl() }
  });
  if (error) authMessage(error.message, true);
}

async function signOut() {
  if (!supabase) { setUser(null); return; }
  const { error } = await supabase.auth.signOut();
  if (error) showToastSafe(error.message);
  else {
    setUser(null);
    showToastSafe('Kamu sudah keluar dari akun.');
  }
}

async function submitAuth(event) {
  event.preventDefault();
  if (!configured) {
    authMessage('Supabase belum dikonfigurasi. Isi supabase-config.js sesuai panduan.', true);
    return;
  }
  const email = $c('authEmail').value.trim();
  const password = $c('authPassword').value;
  const submit = $c('authSubmit');
  submit.disabled = true;
  authMessage(authMode === 'signup' ? 'Membuat akun…' : 'Memeriksa akun…');
  try {
    if (authMode === 'signup') {
      const name = $c('authName').value.trim();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: redirectUrl() }
      });
      if (error) throw error;
      if (data.session) {
        setUser(data.user);
        authMessage('Akun berhasil dibuat.');
      } else {
        authMessage('Akun dibuat. Periksa email untuk konfirmasi, lalu masuk kembali.');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      showToastSafe('Berhasil masuk. Selamat datang kembali!');
    }
  } catch (error) {
    authMessage(error.message || 'Terjadi kesalahan. Coba lagi.', true);
  } finally {
    submit.disabled = false;
  }
}

async function resetPassword() {
  if (!configured) { authMessage('Supabase belum dikonfigurasi.', true); return; }
  const email = $c('authEmail').value.trim();
  if (!email) {
    authMessage('Isi email terlebih dahulu, lalu pilih lupa kata sandi.', true);
    return;
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
  authMessage(error ? error.message : 'Jika email terdaftar, tautan pemulihan akan dikirim ke email tersebut.', !!error);
}

async function loadCloudStories() {
  if (!configured || !session?.user) return;
  if (cloudLoadPromise) return cloudLoadPromise;

  cloudLoadPromise = (async () => {
    const [storiesResult, ownKeysResult] = await Promise.all([
      supabase.from('stories')
        .select('story_key,category,situation,title,author_name,is_anonymous,happened,did,unexpected,lesson,repeat,created_at,updated_at')
        .order('created_at', { ascending: false })
        .limit(200),
      supabase.rpc('get_my_story_keys')
    ]);

    if (storiesResult.error) {
      console.warn('Tidak dapat memuat cerita cloud:', storiesResult.error.message);
      return;
    }
    if (ownKeysResult.error) {
      console.warn('Tidak dapat memuat daftar cerita milik akun:', ownKeysResult.error.message);
    }

    const ownKeys = new Set(ownKeysResult.data || []);
    const local = window.experiences;
    if (!Array.isArray(local)) return;

    for (let index = local.length - 1; index >= 0; index--) {
      if (local[index].cloud) local.splice(index, 1);
    }

    (storiesResult.data || []).forEach(row => {
      const id = Number(row.story_key);
      if (!Number.isSafeInteger(id) || local.some(story => String(story.id) === String(id))) return;
      const anonymous = Boolean(row.is_anonymous);
      local.unshift({
        id,
        cloud: true,
        isMine: ownKeys.has(row.story_key),
        isAnonymous: anonymous,
        category: row.category,
        situation: row.situation,
        title: row.title,
        author: anonymous ? 'Anonim' : (row.author_name || 'Pengguna'),
        role: anonymous ? 'Identitas dirahasiakan' : 'Pengguna',
        summary: row.happened,
        happened: row.happened,
        did: row.did,
        unexpected: row.unexpected || '',
        lesson: row.lesson,
        repeat: row.repeat || '',
        helpful: 0,
        keywords: []
      });
    });
    window.renderCloudStories?.();
  })();

  try {
    await cloudLoadPromise;
  } finally {
    cloudLoadPromise = null;
  }
}

function storyPayload(item) {
  return {
    p_story_key: String(item.id),
    p_author_name: displayName(session?.user),
    p_category: item.category,
    p_situation: item.situation,
    p_title: item.title,
    p_happened: item.happened,
    p_did: item.did,
    p_unexpected: item.unexpected || '',
    p_lesson: item.lesson,
    p_repeat: item.repeat || '',
    p_is_anonymous: Boolean(item.isAnonymous)
  };
}

async function publishStory(item) {
  if (!configured) return { ok: false, reason: 'not-configured' };
  if (!session?.user) return { ok: false, reason: 'login' };
  const { error } = await supabase.rpc('create_story', storyPayload(item));
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

async function updateStory(item) {
  if (!configured) return { ok: false, reason: 'not-configured' };
  if (!session?.user) return { ok: false, reason: 'login' };
  const { error } = await supabase.rpc('update_my_story', storyPayload(item));
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

async function deleteStory(storyKey) {
  if (!configured) return { ok: false, reason: 'not-configured' };
  if (!session?.user) return { ok: false, reason: 'login' };
  const { error } = await supabase.rpc('delete_my_story', { p_story_key: String(storyKey) });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

function renderCommunity(storyId) {
  const target = $c('detailContent');
  if (!target) return;
  target.querySelector('.community-panel')?.remove();
  currentCommentStory = String(storyId);
  const panel = document.createElement('section');
  panel.className = 'community-panel';
  panel.innerHTML = `
    <h2>Obrolan cerita</h2>
    <p class="community-intro">Punya pertanyaan atau pernah mengalami hal serupa? Mulai percakapan dengan tetap saling menghargai.</p>
    <form class="comment-form" id="cloudCommentForm">
      <textarea id="cloudCommentInput" maxlength="1200" placeholder="Tulis komentar atau pertanyaanmu…" aria-label="Komentar atau pertanyaan" required></textarea>
      <button type="submit">Kirim komentar ↗</button>
    </form>
    <div id="cloudCommentList" class="comment-list"><div class="comment-empty">Memuat percakapan…</div></div>`;
  target.querySelector('.full-story')?.append(panel);
  $c('cloudCommentForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    await postComment(currentCommentStory);
  });
  loadComments(currentCommentStory);
}

async function loadComments(storyKey) {
  const list = $c('cloudCommentList');
  if (!list) return;
  if (!configured || !session?.user) {
    list.innerHTML = '<div class="comment-empty">Masuk untuk membaca percakapan.</div>';
    return;
  }
  const { data, error } = await supabase.from('comments')
    .select('id,story_key,author_id,author_name,body,created_at')
    .eq('story_key', String(storyKey))
    .order('created_at', { ascending: true })
    .limit(100);
  if (error) {
    list.innerHTML = '<div class="comment-empty">Belum dapat memuat komentar. Pastikan database sudah diperbarui.</div>';
    console.warn(error.message);
    return;
  }
  if (!data?.length) {
    list.innerHTML = '<div class="comment-empty">Belum ada komentar. Jadilah orang pertama yang memulai percakapan.</div>';
    return;
  }
  list.innerHTML = data.map(comment => `
    <article class="comment-item">
      <div class="comment-top">
        <span class="comment-avatar">${escapeHtml((comment.author_name || 'P').trim().charAt(0).toUpperCase())}</span>
        <span class="comment-author"><strong>${escapeHtml(comment.author_name || 'Pengguna')}</strong><small>${new Date(comment.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</small></span>
      </div>
      <p class="comment-text">${escapeHtml(comment.body)}</p>
      ${session?.user?.id === comment.author_id ? `<button class="comment-delete" type="button" data-delete-comment="${comment.id}">Hapus komentarku</button>` : ''}
    </article>`).join('');

  list.querySelectorAll('[data-delete-comment]').forEach(button => {
    button.addEventListener('click', async () => {
      const { error: deleteError } = await supabase.from('comments')
        .delete().eq('id', button.dataset.deleteComment).eq('author_id', session.user.id);
      if (deleteError) showToastSafe(deleteError.message);
      else await loadComments(storyKey);
    });
  });
}

async function postComment(storyKey) {
  if (!configured) { openAuth(); authMessage('Komentar online memerlukan konfigurasi Supabase.', true); return; }
  if (!session?.user) { openAuth(); authMessage('Masuk terlebih dahulu untuk berkomentar.'); return; }
  const input = $c('cloudCommentInput');
  const body = input?.value.trim();
  if (!body) return;
  const button = $c('cloudCommentForm')?.querySelector('button');
  if (button) button.disabled = true;
  const { error } = await supabase.from('comments').insert({
    story_key: String(storyKey),
    author_id: session.user.id,
    author_name: displayName(session.user),
    body
  });
  if (button) button.disabled = false;
  if (error) { showToastSafe('Komentar belum terkirim: ' + error.message); return; }
  input.value = '';
  await loadComments(storyKey);
  showToastSafe('Komentar berhasil dikirim.');
}

function setPending(action) {
  try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(action)); } catch {}
}

function requireLoginForRead(storyId) {
  if (configured && session?.user) return true;
  openAuth();
  setPending({ type: 'read', id: storyId });
  if (!configured) authMessage('Login belum aktif karena konfigurasi Supabase belum lengkap. Ikuti PETUNJUK-PENGATURAN.txt.', true);
  else authMessage('Masuk atau daftar dulu untuk membaca cerita lengkap. Setelah berhasil, kamu akan kembali ke cerita ini.');
  return false;
}

function requireLoginForShare() {
  if (configured && session?.user) return true;
  openAuth();
  setPending({ type: 'share' });
  if (!configured) authMessage('Login belum aktif karena konfigurasi Supabase belum lengkap. Ikuti PETUNJUK-PENGATURAN.txt.', true);
  else authMessage('Masuk atau daftar dulu untuk membuat cerita. Setelah berhasil, kamu langsung diarahkan ke formulir cerita.');
  return false;
}

window.EFCloud = {
  isConfigured: () => configured,
  openAuth,
  closeAuth,
  toggleAuthMode,
  toggleProfile,
  signInGoogle,
  signOut,
  resetPassword,
  requireLoginForRead,
  requireLoginForShare,
  publishStory,
  updateStory,
  deleteStory,
  renderCommunity,
  getUser: () => session?.user || null
};

$c('authForm')?.addEventListener('submit', submitAuth);
setMode('login');
if (!configured) $c('accountButton').title = 'Perlu konfigurasi Supabase untuk login sungguhan';

if (supabase) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) console.warn('Tidak dapat memeriksa sesi login:', error.message);
    setUser(data?.session?.user || null);
  });
  supabase.auth.onAuthStateChange((_event, newSession) => {
    setUser(newSession?.user || null);
  });
}

// Menambahkan panel komentar setelah tampilan detail cerita selesai dirender.
const detailObserver = new MutationObserver(() => {
  const detail = $c('detailContent');
  const heading = detail?.querySelector('.story-header h1');
  if (heading && detail.querySelector('.full-story') && !detail.querySelector('.community-panel')) {
    const id = window.getCurrentStoryId?.();
    if (id !== null && id !== undefined) renderCommunity(id);
  }
});
const detailNode = $c('detailContent');
if (detailNode) detailObserver.observe(detailNode, { childList: true, subtree: true });
