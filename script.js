const experiences = [
  {id:1,category:"Interview kerja",situation:"Interview pertama",title:"Aku terlalu fokus menghafal jawaban teknis",author:"Raka",role:"Mahasiswa tingkat akhir",summary:"Aku belajar banyak pertanyaan teknis sebelum interview. Ternyata interviewer lebih banyak bertanya tentang proyek yang pernah aku kerjakan.",happened:"Ini adalah interview kerja pertamaku. Karena takut tidak bisa menjawab pertanyaan teknis, aku belajar teori dan menghafal kemungkinan pertanyaan sampai malam sebelum interview.",did:"Aku tetap menjawab semampuku. Setelah interview, aku mengevaluasi pertanyaan yang membuatku kesulitan.",unexpected:"Ternyata interviewer lebih tertarik mengetahui cara aku menyelesaikan masalah dalam proyek daripada sekadar menguji hafalan teori.",lesson:"Persiapan interview bukan hanya tentang menghafal jawaban. Memahami proyek yang pernah dikerjakan juga penting.",repeat:"Kalau mengulang lagi, aku akan menyiapkan beberapa cerita tentang proyek yang pernah aku kerjakan.",helpful:12,keywords:["interview","kerja","wawancara","pertama","proyek","lamaran"]},
  {id:2,category:"Organisasi",situation:"Masuk organisasi kampus",title:"Aku kira harus langsung aktif sejak hari pertama",author:"Dina",role:"Mahasiswa",summary:"Saat pertama masuk organisasi, aku merasa harus langsung banyak bicara. Ternyata mengenal cara kerja anggota lain dulu membuatku lebih nyaman.",happened:"Aku masuk organisasi kampus karena ingin punya pengalaman baru. Pada pertemuan pertama, aku merasa semua orang sudah saling mengenal.",did:"Aku mencoba ikut diskusi walaupun awalnya hanya memberi pendapat sederhana. Aku juga bertanya kepada anggota yang sudah lebih dulu bergabung.",unexpected:"Tidak ada yang mengharuskanku langsung menjadi orang paling aktif. Aku lebih cepat beradaptasi setelah berhenti memikirkan apakah aku terlihat cukup aktif.",lesson:"Beradaptasi tidak harus dilakukan sekaligus. Mengenali lingkungan dan orang lain juga bagian dari proses.",repeat:"Aku akan memberi waktu untuk mengenal anggota dan alur kerja sebelum memaksakan diri.",helpful:8,keywords:["organisasi","kampus","adaptasi","teman","anggota","kepanitiaan"]},
  {id:3,category:"Presentasi",situation:"Presentasi di depan kelas",title:"Aku blank setelah melihat semua orang memperhatikan",author:"Fahmi",role:"Mahasiswa",summary:"Aku sudah menghafal materi presentasi, tetapi malah lupa ketika mulai berbicara.",happened:"Sebelum presentasi aku membaca materi berkali-kali dan mencoba menghafal urutan kalimat. Ketika berdiri di depan kelas, aku tiba-tiba lupa.",did:"Aku berhenti sebentar, melihat slide, lalu melanjutkan dengan menjelaskan menggunakan kata-kata sendiri.",unexpected:"Teman-teman ternyata tidak terlalu memperhatikan kesalahan kecil yang menurutku sangat besar.",lesson:"Presentasi tidak harus menghafal semua kalimat. Memahami inti materi membuatku lebih mudah melanjutkan ketika lupa.",repeat:"Aku akan membuat catatan berisi kata kunci dan berlatih menjelaskan materi tanpa membaca kalimat lengkap.",helpful:15,keywords:["presentasi","kelas","blank","public speaking","berbicara","tugas"]},
  {id:4,category:"Internship",situation:"Hari pertama internship",title:"Aku merasa paling tidak tahu apa-apa di hari pertama",author:"Nadia",role:"Mahasiswa tingkat akhir",summary:"Hari pertama internship membuatku merasa tertinggal karena banyak istilah dan alur kerja yang belum kupahami.",happened:"Aku masuk ke lingkungan kerja yang baru. Orang-orang terlihat sudah tahu apa yang harus dilakukan, sedangkan aku masih mencoba memahami istilah yang digunakan.",did:"Aku mencatat hal-hal yang belum kupahami dan bertanya setelah mencoba mencari jawabannya sendiri.",unexpected:"Ternyata beberapa orang menganggap wajar kalau anak internship masih banyak bertanya.",lesson:"Tidak mengetahui sesuatu di hari pertama bukan berarti tidak mampu. Yang penting mau belajar dan mencatat.",repeat:"Aku akan membawa catatan kecil dan membuat daftar pertanyaan.",helpful:10,keywords:["internship","magang","hari pertama","kerja","adaptasi","kantor"]},
  {id:5,category:"Mencari kerja",situation:"Mulai mencari pekerjaan",title:"Aku bingung harus mulai mencari kerja dari mana",author:"Salsa",role:"Fresh graduate",summary:"Aku membuka banyak lowongan sekaligus sampai akhirnya bingung sendiri. Setelah membuat daftar target, prosesnya terasa lebih terarah.",happened:"Setelah lulus, aku membuka berbagai situs lowongan setiap hari. Banyak posisi terlihat menarik, tetapi aku tidak tahu mana yang cocok.",did:"Aku menuliskan tiga jenis posisi yang ingin dicoba dan menyesuaikan CV untuk posisi tersebut.",unexpected:"Ternyata mencari kerja tidak harus mengirim lamaran ke sebanyak mungkin tempat. Mengetahui posisi yang dituju justru membuatku lebih fokus.",lesson:"Mulai dari mengenali posisi yang ingin dicoba membuat pencarian kerja lebih terarah.",repeat:"Aku akan membuat target mingguan yang realistis dan mencatat setiap lamaran.",helpful:19,keywords:["kerja","lowongan","fresh graduate","cv","lamaran","karier"]},
  {id:6,category:"Freelance",situation:"Menerima pekerjaan freelance pertama",title:"Aku hampir menerima pekerjaan tanpa membahas deadline",author:"Bima",role:"Mahasiswa",summary:"Aku terlalu senang mendapat klien pertama sampai lupa membicarakan detail pekerjaan dan batas waktunya.",happened:"Aku mendapat tawaran membuat desain sederhana. Karena ingin mencoba freelance, aku langsung bilang iya tanpa membicarakan revisi dan deadline dengan jelas.",did:"Setelah ada perubahan berkali-kali, aku akhirnya membuat daftar pekerjaan dan batas revisi.",unexpected:"Ternyata sebagian masalah bukan karena klien sulit, tetapi karena kesepakatan awal memang belum jelas.",lesson:"Sebelum mulai bekerja, detail tugas, deadline, revisi, dan hasil akhir perlu dibicarakan.",repeat:"Aku akan membuat brief singkat sebelum menyetujui pekerjaan.",helpful:14,keywords:["freelance","klien","kerja","deadline","desain","proyek"]},
  {id:7,category:"Pertemanan",situation:"Berkenalan dengan teman baru",title:"Aku terlalu memikirkan harus bicara apa",author:"Alya",role:"Mahasiswa",summary:"Aku sering memikirkan kalimat yang tepat sebelum ngobrol dengan orang baru. Ternyata pertanyaan sederhana justru membuat percakapan berjalan.",happened:"Aku bertemu teman baru di kegiatan kampus. Aku ingin ngobrol tetapi takut percakapannya menjadi canggung.",did:"Aku mulai dengan menanyakan hal sederhana tentang kegiatan yang sedang kami ikuti.",unexpected:"Percakapan ternyata tidak perlu selalu menarik. Respons kecil dan pertanyaan lanjutan sudah cukup untuk membuat obrolan berjalan.",lesson:"Tidak perlu mencari topik yang sempurna. Mendengarkan dan menanggapi lawan bicara juga penting.",repeat:"Aku akan lebih santai dan tidak terlalu mempersiapkan setiap kalimat.",helpful:17,keywords:["teman","kenalan","basa-basi","ngobrol","sosial","kampus"]},
  {id:8,category:"Tugas kuliah",situation:"Mengerjakan tugas kelompok",title:"Kelompokku bukan tidak kompak, kami cuma belum membagi tugas",author:"Kevin",role:"Mahasiswa",summary:"Awalnya semua anggota mengira orang lain sudah mengerjakan. Setelah tugas dibagi dengan jelas, pekerjaan menjadi lebih mudah.",happened:"Kami langsung masuk ke grup dan membahas tugas tanpa menentukan siapa mengerjakan bagian tertentu.",did:"Aku mengajak anggota membuat daftar bagian tugas dan menentukan penanggung jawabnya.",unexpected:"Ternyata beberapa anggota sebenarnya sudah ingin mengerjakan, tetapi bingung harus mulai dari bagian mana.",lesson:"Pembagian tugas yang jelas bisa mencegah banyak pekerjaan terlewat atau dikerjakan dua kali.",repeat:"Aku akan mengusulkan pembagian tugas dan deadline kecil sejak awal.",helpful:11,keywords:["tugas","kuliah","kelompok","deadline","mahasiswa","kerja sama"]},
  {id:9,category:"Public speaking",situation:"Berbicara di depan banyak orang",title:"Aku berhenti mengejar supaya suaraku terdengar sempurna",author:"Reno",role:"Mahasiswa",summary:"Aku terlalu fokus pada suara dan gaya bicara. Setelah berlatih menyampaikan poin utama, aku merasa lebih tenang.",happened:"Aku diminta menjadi pembicara singkat dalam sebuah kegiatan. Aku takut suara terdengar kecil dan salah bicara.",did:"Aku berlatih dengan merekam suara sendiri dan menyiapkan tiga poin utama.",unexpected:"Aku tidak perlu terdengar seperti pembicara profesional. Yang penting orang memahami pesan yang ingin disampaikan.",lesson:"Fokus pada pesan membuatku lebih tenang daripada terus memikirkan penampilan diri.",repeat:"Aku akan latihan dengan poin, bukan menghafal seluruh kalimat.",helpful:9,keywords:["public speaking","berbicara","pidato","acara","percaya diri"]},
  {id:10,category:"Adaptasi kerja",situation:"Hari pertama di tempat kerja",title:"Aku takut bertanya karena semua orang terlihat sibuk",author:"Mira",role:"Junior staff",summary:"Aku menahan pertanyaan karena takut mengganggu. Setelah tahu kapan waktu yang tepat untuk bertanya, pekerjaan justru lebih cepat selesai.",happened:"Di minggu pertama kerja, aku menemukan proses yang belum kupahami. Semua orang terlihat sibuk sehingga aku memilih mencoba sendiri terlalu lama.",did:"Aku mencatat pertanyaan dan menanyakannya sekaligus saat rekan kerja sedang senggang.",unexpected:"Rekan kerja justru mengatakan lebih baik bertanya daripada menghabiskan waktu terlalu lama dengan asumsi sendiri.",lesson:"Bertanya tetap perlu dilakukan, tetapi pilih waktu dan sampaikan pertanyaannya dengan jelas.",repeat:"Aku akan mencoba mencari informasi dulu, lalu membawa pertanyaan yang sudah spesifik.",helpful:16,keywords:["kerja","kantor","adaptasi","bertanya","pegawai baru","hari pertama"]},
  {id:11,category:"CV & Portofolio",situation:"Membuat CV pertama",title:"CV-ku penuh tulisan tetapi tidak menjelaskan apa yang bisa kulakukan",author:"Tio",role:"Mahasiswa tingkat akhir",summary:"Aku memasukkan banyak informasi ke CV. Setelah meminta teman membacanya, aku sadar bagian proyek justru lebih penting untuk ditonjolkan.",happened:"Aku membuat CV pertama dengan memasukkan hampir semua kegiatan yang pernah kuikuti.",did:"Aku memilih beberapa pengalaman yang paling relevan lalu menambahkan peran dan hasil yang pernah dikerjakan.",unexpected:"CV yang lebih singkat ternyata lebih mudah dibaca dan lebih jelas menunjukkan pengalamanku.",lesson:"Tidak semua pengalaman harus dimasukkan. Pilih yang paling berhubungan dengan posisi yang dituju.",repeat:"Aku akan membuat versi CV yang disesuaikan dengan jenis posisi yang dilamar.",helpful:13,keywords:["cv","portofolio","lamaran","kerja","fresh graduate","resume"]},
  {id:12,category:"Presentasi",situation:"Mempresentasikan tugas kelompok",title:"Aku baru sadar slide terlalu penuh setelah melihat dari jauh",author:"Putri",role:"Mahasiswa",summary:"Slide kelompokku berisi banyak teks. Saat latihan, kami kesulitan menjelaskan karena malah sibuk membaca.",happened:"Kami memasukkan hampir semua isi laporan ke dalam slide agar tidak ada materi yang tertinggal.",did:"Kami mengurangi kalimat panjang dan menggantinya dengan poin penting, gambar, serta ilustrasi.",unexpected:"Setelah slide lebih sederhana, kami justru lebih mudah menjelaskan materi dengan kata-kata sendiri.",lesson:"Slide sebaiknya membantu penjelasan, bukan menggantikan seluruh isi penjelasan.",repeat:"Aku akan membuat kerangka presentasi dulu sebelum memasukkan isi ke slide.",helpful:18,keywords:["presentasi","ppt","slide","tugas","kelompok","kuliah"]},
  {id:13,category:"Organisasi",situation:"Pertama kali menjadi panitia",title:"Aku menerima tugas karena malu bilang belum paham",author:"Nisa",role:"Mahasiswa",summary:"Aku mengangguk saat diberi tugas karena takut terlihat tidak bisa. Akhirnya aku belajar bahwa meminta penjelasan di awal justru menghemat waktu.",happened:"Aku pertama kali menjadi panitia acara dan mendapat tugas yang belum pernah kulakukan.",did:"Aku mencoba mencari tahu sendiri, lalu bertanya kepada koordinator ketika menemui bagian yang benar-benar tidak kupahami.",unexpected:"Koordinator ternyata memang mengharapkan anggota baru untuk bertanya.",lesson:"Mengakui belum tahu bukan berarti tidak mampu. Yang penting mau belajar dan memastikan tugasnya benar.",repeat:"Aku akan bertanya lebih awal jika instruksi belum jelas.",helpful:12,keywords:["organisasi","panitia","acara","kampus","tugas","koordinator"]},
  {id:14,category:"Interview kerja",situation:"Mendapat penolakan setelah interview",title:"Aku mengira penolakan berarti aku tidak cocok bekerja",author:"Ardi",role:"Fresh graduate",summary:"Setelah ditolak, aku sempat berhenti melamar. Kemudian aku meminta feedback dan menemukan beberapa hal yang masih bisa diperbaiki.",happened:"Aku sudah mengikuti beberapa tahap interview dan cukup yakin akan diterima. Beberapa hari kemudian aku menerima email penolakan.",did:"Aku mencatat pertanyaan yang sulit kujawab dan mencoba memperbaiki cara menjelaskan pengalaman.",unexpected:"Satu penolakan ternyata tidak memberi gambaran lengkap tentang kemampuanku.",lesson:"Penolakan bisa menjadi bahan evaluasi, tetapi tidak harus langsung dianggap sebagai penilaian terhadap seluruh kemampuan diri.",repeat:"Aku akan tetap mengevaluasi proses tanpa menjadikan satu hasil sebagai kesimpulan akhir.",helpful:21,keywords:["interview","ditolak","rekrutmen","kerja","lamaran","gagal"]},
  {id:15,category:"Kuliah",situation:"Tertinggal materi kuliah",title:"Aku mencoba mengejar semuanya sekaligus dan malah semakin bingung",author:"Caca",role:"Mahasiswa",summary:"Aku tertinggal beberapa materi lalu mencoba mempelajari semuanya dalam satu malam. Setelah membaginya menjadi bagian kecil, prosesnya lebih masuk akal.",happened:"Ada beberapa pertemuan yang materinya belum kupahami. Ketika mendekati ujian, aku mencoba membaca semuanya sekaligus.",did:"Aku membuat daftar topik dari yang paling dasar dan mempelajarinya sedikit demi sedikit.",unexpected:"Beberapa materi ternyata saling berkaitan. Memahami dasar membuat materi berikutnya lebih mudah.",lesson:"Mengejar ketertinggalan tidak selalu berarti belajar lebih banyak dalam satu waktu.",repeat:"Aku akan mencicil materi dan menandai bagian yang benar-benar belum dipahami.",helpful:14,keywords:["kuliah","materi","belajar","ujian","mahasiswa","tugas"]}
];

const categories = [
  ["Karier","Pekerjaan, magang, dan perjalanan profesional","01"],
  ["Pendidikan","Kuliah, tugas, dan proses belajar","02"],
  ["Organisasi","Kampus, kepanitiaan, dan kerja tim","03"],
  ["Pertemanan & Sosial","Pertemanan, relasi, dan interaksi sosial","04"],
  ["Pengembangan Diri","Kepercayaan diri, keterampilan, dan kebiasaan","05"],
  ["Kehidupan Sehari-hari","Pengalaman dan tantangan sehari-hari","06"]
];

const legacyCategoryMap = {
  "Interview kerja":"Karier", "Mencari kerja":"Karier", "Internship":"Karier",
  "Freelance":"Karier", "Adaptasi kerja":"Karier", "CV & Portofolio":"Karier",
  "Organisasi":"Organisasi", "Presentasi":"Pendidikan", "Tugas kuliah":"Pendidikan",
  "Kuliah":"Pendidikan", "Pertemanan":"Pertemanan & Sosial",
  "Public speaking":"Pengembangan Diri"
};
experiences.forEach(story => {
  story.category = legacyCategoryMap[story.category] || story.category || 'Kehidupan Sehari-hari';
});

const STORAGE = {saved:'ef_saved', stories:'ef_stories', helped:'ef_helped', draft:'ef_draft'};
let saved = new Set(readJSON(STORAGE.saved, []));
let helped = new Set(readJSON(STORAGE.helped, []));
let currentResults = [...experiences];
let currentKeyword = '';
let currentCategory = '';
let currentStoryId = null;
let lastView = 'home';
let editingStoryId = null;
let editReturnStoryId = null;
let draftBeforeEdit = null;

const $ = id => document.getElementById(id);
const homePage = $('homePage');
const discoverPage = $('discoverPage');
const detailPage = $('detailPage');
const sharePage = $('sharePage');
const savedPage = $('savedPage');
const toast = $('toast');

function readJSON(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch{ return fallback; }
}

function writeJSON(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch{}
}

function mergeStoredStories(){
  const stored = readJSON(STORAGE.stories, []);
  if(!Array.isArray(stored) || !stored.length) return;
  // Versi lama pernah menaruh salinan cerita cloud di localStorage. Hapus salinan
  // tersebut agar logout tidak meninggalkan isi cerita online di perangkat.
  const localOnly = stored.filter(story => !story.cloud);
  if(localOnly.length !== stored.length) writeJSON(STORAGE.stories,localOnly);
  localOnly.forEach(story => {
    story.category = legacyCategoryMap[story.category] || story.category || 'Kehidupan Sehari-hari';
    if(!experiences.some(item => String(item.id) === String(story.id))) experiences.unshift(story);
  });
}

function safe(value){
  const el = document.createElement('div');
  el.textContent = value ?? '';
  return el.innerHTML;
}

function normalize(text){
  return String(text ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}

// Stop words bahasa Indonesia hanya mengurangi kata umum; pencarian memakai TF-IDF + cosine.
const stopWords = new Set([
  'aku','saya','kamu','dia','kami','kita','mereka','nya','yang','dan','di','ke','dari','ini','itu',
  'untuk','dengan','pada','karena','atau','juga','saat','ketika','adalah','agar','dalam','oleh',
  'sebagai','ada','akan','sudah','belum','masih','lebih','sangat','bisa','dapat','jadi','nya',
  'sebuah','suatu','para','setelah','sebelum','hingga','tentang','tersebut','kalau','jika','maka',
  'aku','ku','mu','pun','lah','kok','kan'
]);

function tokenize(text){
  return normalize(text).split(' ').filter(token => token.length > 1 && !stopWords.has(token));
}

function storySearchText(item){
  return [item.category,item.situation,item.title,item.summary,item.happened,item.did,item.unexpected,item.lesson,item.repeat].join(' ');
}

function buildTfidfModel(items){
  const documents = items.map(item => tokenize(storySearchText(item)));
  const documentFrequency = new Map();
  documents.forEach(tokens => {
    new Set(tokens).forEach(token => documentFrequency.set(token,(documentFrequency.get(token)||0)+1));
  });
  const totalDocuments = Math.max(documents.length,1);
  const idf = token => Math.log((totalDocuments+1)/((documentFrequency.get(token)||0)+1))+1;
  const vectorize = tokens => {
    const counts = new Map();
    tokens.forEach(token => counts.set(token,(counts.get(token)||0)+1));
    const vector = new Map();
    counts.forEach((count,token) => vector.set(token,(1+Math.log(count))*idf(token)));
    return vector;
  };
  return { idf, vectorize };
}

function cosineSimilarity(vectorA,vectorB){
  if(!vectorA.size || !vectorB.size) return 0;
  let dot=0, normA=0, normB=0;
  vectorA.forEach((value,token) => { dot += value*(vectorB.get(token)||0); normA += value*value; });
  vectorB.forEach(value => { normB += value*value; });
  return normA && normB ? dot/(Math.sqrt(normA)*Math.sqrt(normB)) : 0;
}

function rankSimilarStories(source,items=experiences,limit=4){
  const corpus = items.filter(item => String(item.id)!==String(source.id));
  if(!corpus.length) return [];
  const model = buildTfidfModel([source,...corpus]);
  const queryVector = model.vectorize(tokenize(storySearchText(source)));
  return corpus.map(item => ({...item,score:cosineSimilarity(queryVector,model.vectorize(tokenize(storySearchText(item))))}))
    .filter(item => item.score > 0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,limit);
}

function setNav(which){
  [['homeNav','home'],['discoverNav','discover'],['shareNav','share'],['savedNav','saved']].forEach(([id,key])=>$(id)?.classList.toggle('active',which===key));
}

function showPage(page){
  document.querySelectorAll('.page-section').forEach(p=>p.classList.add('hidden'));
  page.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

function showHome(){
  lastView = 'home';
  showPage(homePage);
  setNav('home');
  render(currentResults.length ? currentResults : experiences);
}

function showDiscover(){
  lastView = 'discover';
  showPage(discoverPage);
  setNav('discover');
  $('discoverInput').value = currentKeyword;
  renderDiscoverList(currentResults.length ? currentResults : experiences);
  renderDiscoverCategories();
}

function showShare(){
  // GERBANG LOGIN: halaman buat cerita hanya bisa dibuka setelah login.
  if(!window.EFCloud){showToast('Layanan login belum termuat. Periksa koneksi internet lalu muat ulang halaman.');return;}
  if(!window.EFCloud.requireLoginForShare()) return;
  lastView = 'share';
  showPage(sharePage);
  setNav('share');
  loadDraft();
  updateAllCounters();
}

function showSaved(){
  lastView = 'saved';
  showPage(savedPage);
  setNav('saved');
  renderSaved();
}

function goBackFromDetail(){
  if(lastView === 'discover') showDiscover();
  else if(lastView === 'saved') showSaved();
  else showHome();
}

function renderCategories(){
  $('categories').innerHTML = categories.map(c => `
    <button class="topic" onclick="searchCategory('${safeAttr(c[0])}')">
      <span class="topic-no">${safe(c[2])}</span>
      <span class="topic-text"><strong>${safe(c[0])}</strong><small>${safe(c[1])}</small></span>
      <span class="topic-arrow">↗</span>
    </button>
  `).join('');
  $('category').innerHTML = '<option value="">Pilih kategori</option>' + categories.map(c=>`<option value="${safeAttr(c[0])}">${safe(c[0])}</option>`).join('');
}

function renderDiscoverCategories(){
  $('discoverCategories').innerHTML = `<button class="filter-button ${!currentCategory?'active':''}" onclick="filterCategory('')">Semua cerita</button>` + categories.map(c=>`
    <button class="filter-button ${currentCategory===c[0]?'active':''}" onclick="filterCategory('${safeAttr(c[0])}')">${safe(c[0])}</button>
  `).join('');
}

function scoreResults(keyword){
  const queryTokens = tokenize(keyword);
  if(!queryTokens.length) return [...experiences];
  const model = buildTfidfModel(experiences);
  const queryVector = model.vectorize(queryTokens);
  return experiences.map(item=>({
    ...item,
    score:cosineSimilarity(queryVector,model.vectorize(tokenize(storySearchText(item))))
  })).filter(item=>item.score>0).sort((a,b)=>b.score-a.score);
}

function applyCurrentSort(data=currentResults){
  const mode = $('sortSelect')?.value || 'relevant';
  const arr = [...data];
  if(mode === 'helpful') arr.sort((a,b)=>b.helpful-a.helpful);
  else if(mode === 'latest') arr.sort((a,b)=>Number(b.id)-Number(a.id));
  else if(currentKeyword) arr.sort((a,b)=>(b.score||0)-(a.score||0));
  return arr;
}

function refreshCurrentSort(){
  if(!$('homePage').classList.contains('hidden')) render(currentResults,Boolean(currentKeyword || currentCategory));
  else if(!$('discoverPage').classList.contains('hidden')) renderDiscoverList(currentResults);
}

function render(data, searched=Boolean(currentKeyword || currentCategory)){
  currentResults = [...data];
  const sorted = applyCurrentSort(data);
  $('resultTitle').textContent = searched ? (currentCategory ? currentCategory : 'Cerita yang mungkin cocok') : 'Mungkin ini yang kamu cari';
  $('resultCount').textContent = `${sorted.length} cerita`;
  $('storyTotal').textContent = `${experiences.length}+`;

  if(!sorted.length){
    $('experienceList').innerHTML = emptyState('Belum menemukan cerita yang cocok.','Coba kata yang lebih umum seperti “kerja”, “kuliah”, atau “teman”.','showAllStories()');
    updateSavedBadge();
    return;
  }

  $('experienceList').innerHTML = sorted.map((item,index)=>storyCard(item,index===0 && !searched)).join('');
  updateSavedBadge();
}

function storyCard(item,featured=false){
  const isSaved = saved.has(item.id);
  const first = safe(item.author.charAt(0).toUpperCase());
  return `
    <article class="story-card ${featured?'featured':''}">
      <div class="story-meta"><span class="category">${safe(item.category)}</span><span>${safe(item.situation)}</span></div>
      <h3>${safe(item.title)}</h3>
      <p>${safe(item.summary)}</p>
      <div class="story-footer">
        <div class="person">
          <span class="avatar">${first}</span>
          <span class="person-meta"><strong>${safe(item.author)}</strong><small>${safe(item.role)}</small></span>
        </div>
        <div class="card-actions">
          <button aria-label="${isSaved?'Hapus dari simpanan':'Simpan cerita'}" onclick="save(${item.id})">${isSaved?'♥ tersimpan':'♡ simpan'}</button>
          <button class="read-button" onclick="openDetail(${item.id})">baca cerita →</button>
        </div>
      </div>
    </article>`;
}

function emptyState(title,desc,action){
  return `<div class="empty"><div class="empty-icon">?</div><h3>${safe(title)}</h3><p>${safe(desc)}</p><button onclick="${action}">lihat semua cerita</button></div>`;
}

function search(keyword, scroll=true){
  currentKeyword = String(keyword || '').trim();
  currentCategory = '';
  const result = scoreResults(currentKeyword);
  render(result, Boolean(currentKeyword));
  if(scroll) $('storySection')?.scrollIntoView({behavior:'smooth',block:'start'});
}

function searchCategory(category){
  currentCategory = category;
  currentKeyword = '';
  const result = experiences.filter(item=>item.category===category);
  render(result,true);
  $('searchInput').value = category;
  $('sortSelect').value = 'relevant';
  $('storySection')?.scrollIntoView({behavior:'smooth',block:'start'});
}

function filterCategory(category){
  currentCategory = category;
  currentKeyword = '';
  const result = category ? experiences.filter(item=>item.category===category) : [...experiences];
  $('discoverInput').value = '';
  renderDiscoverCategories();
  renderDiscoverList(result);
}

function showAllStories(){
  currentKeyword=''; currentCategory='';
  $('searchInput').value='';
  $('sortSelect').value='relevant';
  render(experiences,false);
}

function clearSearch(){showAllStories();}

function renderDiscoverList(data){
  currentResults = [...data];
  const sorted = applyCurrentSort(data);
  $('discoverResultTitle').textContent = currentCategory || (currentKeyword ? 'Hasil pencarian' : 'Semua cerita');
  $('discoverResultCount').textContent = `${sorted.length} cerita`;
  if(!sorted.length){
    $('discoverList').innerHTML = emptyState('Belum ada cerita di kategori ini.','Coba kategori lain atau gunakan kata pencarian yang lebih umum.','filterCategory(\'\')');
    return;
  }
  $('discoverList').innerHTML = sorted.map((item,i)=>`
    <article class="discover-item">
      <span class="discover-number">${String(i+1).padStart(2,'0')}</span>
      <div>
        <div class="story-meta"><span class="category">${safe(item.category)}</span><span>${safe(item.situation)}</span></div>
        <strong>${safe(item.title)}</strong>
        <p>${safe(item.summary)}</p>
        <small>${safe(item.author)} · ${item.helpful} orang merasa terbantu</small>
      </div>
      <button onclick="openDetail(${item.id})">baca →</button>
    </article>`).join('');
}

function openDetail(id){
  // Cek autentikasi sebelum memastikan cerita sudah ada di memori. Ini memungkinkan
  // tautan #story-ID memuat cerita cloud setelah login, walaupun cerita belum diambil.
  if(!window.EFCloud){showToast('Layanan login belum termuat. Periksa koneksi internet lalu muat ulang halaman.');return;}
  if(!window.EFCloud.requireLoginForRead(id)) return;
  const item = experiences.find(x=>String(x.id)===String(id));
  if(!item){showToast('Cerita tidak ditemukan atau belum tersedia di database.');return;}
  currentStoryId = id;
  showPage(detailPage);
  setNav('');
  detailPage.querySelector('.detail-shell').scrollIntoView({block:'start'});
  const related = rankSimilarStories(item,experiences,4);
  $('detailContent').innerHTML = `
    <article class="full-story">
      <header class="story-header">
        <div class="story-meta"><span class="category">${safe(item.category)}</span><span>${safe(item.situation)}</span></div>
        <h1>${safe(item.title)}</h1>
        <div class="person big"><span class="avatar">${safe(item.author.charAt(0).toUpperCase())}</span><span class="person-meta"><strong>${safe(item.author)}</strong><small>${safe(item.role)} · pengalaman pribadi</small></span></div>
      </header>
      <div class="story-body">
        <section><span class="step">01</span><div><small>yang terjadi</small><p>${safe(item.happened)}</p></div></section>
        <section><span class="step">02</span><div><small>yang aku lakukan</small><p>${safe(item.did)}</p></div></section>
        <section class="turning"><span class="step">03</span><div><small>ternyata...</small><p>${safe(item.unexpected || 'Tidak dituliskan.')}</p></div></section>
        <section><span class="step">04</span><div><small>yang aku pelajari</small><p>${safe(item.lesson)}</p></div></section>
        <section><span class="step">05</span><div><small>kalau mengulang lagi</small><p>${safe(item.repeat || 'Tidak dituliskan.')}</p></div></section>
      </div>
      <section class="reality-check">
        <div class="reality-heading"><span class="reality-spark">✳</span><div><small>REALITY CHECK</small><h2>Ekspektasi vs kenyataan</h2></div></div>
        <div class="reality-grid">
          <div class="reality-card expectation"><span>YANG DIBAYANGKAN</span><p>${safe(item.happened)}</p></div>
          <div class="reality-card reality"><span>YANG TERNYATA TERJADI</span><p>${safe(item.unexpected || item.lesson || 'Setiap pengalaman bisa memberi sudut pandang baru.')}</p></div>
        </div>
        <p class="reality-footnote">Setiap orang punya pengalaman berbeda. Ambil pelajarannya, lalu tentukan langkahmu sendiri.</p>
      </section>
      <div class="story-actions">
        <button class="${saved.has(item.id)?'on':''}" onclick="save(${item.id})">${saved.has(item.id)?'♥ tersimpan':'♡ simpan cerita'}</button>
        <button class="help ${helped.has(item.id)?'on':''}" onclick="helpful(${item.id})">${helped.has(item.id)?'✓ membantu':'ini membantu'} · ${item.helpful}</button>
        <button onclick="openShareModal(${item.id})">↗ bagikan</button>
      </div>
      ${item.cloud && item.isMine ? `<div class="owner-actions"><button type="button" onclick="editOwnStory(${item.id})">Ubah ceritaku</button><button type="button" class="danger-action" onclick="deleteOwnStory(${item.id})">Hapus cerita</button></div>` : ''}
      <div class="small-note">Cerita di Experience Finder adalah pengalaman pribadi. Gunakan sebagai gambaran, bukan sebagai satu-satunya jawaban.</div>
      ${related.length ? `<section class="related-section"><h3>Mungkin kamu juga dekat dengan cerita ini.</h3><div class="related-grid">${related.map(x=>`<button class="related-card" onclick="openDetail(${x.id})"><span class="cat">${safe(x.category)}</span><strong>${safe(x.title)}</strong><small>${safe(x.author)} · ${x.helpful} terbantu</small></button>`).join('')}</div></section>`:''}
    </article>`;
  window.EFCloud?.renderCommunity(id);
}

function editOwnStory(id){
  const item=experiences.find(story=>String(story.id)===String(id));
  if(!item?.cloud || !item.isMine){showToast('Kamu hanya bisa mengubah cerita milik akunmu.');return;}
  if(!window.EFCloud?.getUser?.()){window.EFCloud?.requireLoginForShare();return;}
  editingStoryId=String(id);
  editReturnStoryId=id;
  draftBeforeEdit=readJSON(STORAGE.draft,{});
  showShare();
  ['title','category','situation','happened','did','unexpected','lesson','repeat'].forEach(field=>{
    $(field).value=item[field] || '';
  });
  $('storyVisibility').value=item.isAnonymous?'anonymous':'profile';
  $('clearDraftButton').classList.add('hidden');
  $('cancelEditButton').classList.remove('hidden');
  document.querySelector('.send-story').innerHTML='Simpan perubahan <i>↗</i>';
  updateAllCounters();
}

function cancelStoryEdit(){
  const returnId=editReturnStoryId;
  editingStoryId=null;
  editReturnStoryId=null;
  $('clearDraftButton').classList.remove('hidden');
  $('cancelEditButton').classList.add('hidden');
  document.querySelector('.send-story').innerHTML='Bagikan cerita <i>↗</i>';
  $('shareForm').reset();
  if(draftBeforeEdit) writeJSON(STORAGE.draft,draftBeforeEdit);
  draftBeforeEdit=null;
  updateAllCounters();
  const item=experiences.find(story=>String(story.id)===String(returnId));
  if(item) openDetail(item.id); else showHome();
}

async function deleteOwnStory(id){
  const item=experiences.find(story=>String(story.id)===String(id));
  if(!item?.cloud || !item.isMine){showToast('Kamu hanya bisa menghapus cerita milik akunmu.');return;}
  if(!window.confirm('Hapus cerita ini secara permanen? Komentar pada cerita ini juga akan dihapus.')) return;
  const result=await window.EFCloud?.deleteStory(id);
  if(!result?.ok){showToast('Cerita belum terhapus: '+(result?.reason||'layanan tidak tersedia'));return;}
  const index=experiences.findIndex(story=>String(story.id)===String(id));
  if(index>=0) experiences.splice(index,1);
  saved.delete(id); helped.delete(id);
  writeJSON(STORAGE.saved,[...saved]); writeJSON(STORAGE.helped,[...helped]);
  currentResults=currentResults.filter(story=>String(story.id)!==String(id));
  currentStoryId=null;
  history.replaceState(null,'',location.pathname+location.search);
  renderCloudStories();
  showHome();
  showToast('Cerita dan komentar terkait berhasil dihapus.');
}

function helpful(id){
  const item = experiences.find(x=>x.id===id);
  if(!item)return;
  if(helped.has(id)){helped.delete(id);item.helpful=Math.max(0,item.helpful-1);showToast('Tanda membantu dibatalkan.');}
  else{helped.add(id);item.helpful++;showToast('Terima kasih. Cerita ini ditandai membantu.');}
  writeJSON(STORAGE.helped,[...helped]);
  if(currentStoryId===id) openDetail(id); else render(currentResults);
}

function save(id){
  if(saved.has(id)){saved.delete(id);showToast('Cerita dihapus dari simpanan.');}
  else{saved.add(id);showToast('Cerita disimpan di perangkat kamu.');}
  writeJSON(STORAGE.saved,[...saved]);
  updateSavedBadge();
  if(currentStoryId===id) openDetail(id);
  else { render(currentResults,Boolean(currentKeyword||currentCategory)); renderSaved(); }
}

function renderSaved(){
  const items = experiences.filter(x=>saved.has(x.id));
  if(!items.length){ $('savedList').innerHTML = emptyState('Belum ada cerita tersimpan.','Simpan cerita yang ingin kamu baca lagi saat membutuhkannya.','showDiscover()'); return; }
  $('savedList').innerHTML = items.map((item,i)=>storyCard(item,i===0)).join('');
}

function updateSavedBadge(){
  $('savedBadge').textContent = saved.size;
  $('savedBadge').style.display = saved.size ? 'inline-grid' : 'none';
}

function openShareModal(id){
  currentStoryId = id;
  $('shareModal').classList.remove('hidden');
}

function closeModal(){ $('shareModal').classList.add('hidden'); }

async function copyCurrentStoryLink(){
  if(!currentStoryId) return;
  const url = `${location.href.split('#')[0]}#story-${currentStoryId}`;
  try{
    await navigator.clipboard.writeText(url);
    showToast('Tautan cerita berhasil disalin.');
  }catch{
    window.prompt('Salin tautan ini:',url);
  }
  closeModal();
}

function saveDraft(){
  const fields=['title','category','situation','happened','did','unexpected','lesson','repeat','storyVisibility'];
  const data={};
  fields.forEach(id=>{const el=$(id); if(el) data[id]=el.value;});
  writeJSON(STORAGE.draft,data);
}

function loadDraft(){
  const data=readJSON(STORAGE.draft,{});
  Object.entries(data).forEach(([id,value])=>{if($(id)) $(id).value=value;});
  updateAllCounters();
}

function clearDraft(){
  localStorage.removeItem(STORAGE.draft);
  $('shareForm').reset();
  updateAllCounters();
  showToast('Draft dihapus.');
}

function updateCounter(input){
  const counter=document.querySelector(`.char-count[data-for="${input.id}"]`);
  if(counter) counter.textContent=`${input.value.length} / ${input.maxLength}`;
}

function updateAllCounters(){document.querySelectorAll('.char-count').forEach(c=>{const el=$(c.dataset.for);if(el)updateCounter(el);});}

function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);
}

function safeAttr(value){return String(value).replace(/&/g,'&amp;').replace(/'/g,'&#39;').replace(/"/g,'&quot;');}

function handleHash(){
  const match=location.hash.match(/^#story-(\d+)$/);
  if(match) openDetail(Number(match[1]));
}

$('searchForm').addEventListener('submit',e=>{e.preventDefault();search($('searchInput').value);});
$('discoverForm').addEventListener('submit',e=>{
  e.preventDefault();
  const q=$('discoverInput').value.trim();
  currentCategory=''; currentKeyword=q;
  const result=scoreResults(q);
  renderDiscoverList(result); renderDiscoverCategories();
});
$('shareForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const category=$('category').value;
  const title=$('title').value.trim();
  const situation=$('situation').value.trim();
  const happened=$('happened').value.trim();
  const did=$('did').value.trim();
  const lesson=$('lesson').value.trim();
  if(!category || !title || !situation || !happened || !did || !lesson){showToast('Lengkapi dulu bagian yang wajib diisi.');return;}
  if(!window.EFCloud || !window.EFCloud.requireLoginForShare()) return;
  // PENINJAUAN: penulis wajib mencentang pernyataan tanggung jawab sebelum cerita dikirim.
  if(window.ReviewDemo && !ReviewDemo.confirmChecked()) return;
  const currentUser=window.EFCloud?.getUser?.();
  const authorName=currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Kamu';
  const isAnonymous=$('storyVisibility').value==='anonymous';
  // PENINJAUAN (dummy): cerita masuk antrean "Menunggu Peninjauan" dan TIDAK masuk daftar publik.
  // TODO-DB: ganti hook ini dengan publishStory ke Supabase (status awal 'Menunggu Peninjauan').
  if(window.ReviewDemo && !editingStoryId && ReviewDemo.handleSubmit({category,title,situation,happened,did,unexpected:$('unexpected').value.trim(),lesson,repeat:$('repeat').value.trim(),isAnonymous,authorName})) return;
  const id=editingStoryId || Date.now();
  const item={
    id:Number(id),category,situation,title,
    author:isAnonymous?'Anonim':authorName,
    role:isAnonymous?'Identitas dirahasiakan':'Pengguna',
    isAnonymous,isMine:true,summary:happened,happened,did,
    unexpected:$('unexpected').value.trim(),lesson,repeat:$('repeat').value.trim(),
    helpful:0,keywords:[],cloud:true
  };
  const submitButton=document.querySelector('.send-story');
  submitButton.disabled=true;
  try{
    if(editingStoryId){
      const result=await window.EFCloud.updateStory(item);
      if(!result.ok){showToast('Perubahan belum tersimpan: '+result.reason);return;}
      const index=experiences.findIndex(story=>String(story.id)===String(editingStoryId));
      if(index>=0) experiences[index]={...experiences[index],...item};
      editingStoryId=null; editReturnStoryId=null; draftBeforeEdit=null;
      $('clearDraftButton').classList.remove('hidden');
      $('cancelEditButton').classList.add('hidden');
      document.querySelector('.send-story').innerHTML='Bagikan cerita <i>↗</i>';
      clearDraft();
      currentResults=[...experiences]; currentKeyword=''; currentCategory='';
      renderCloudStories();
      showToast('Cerita berhasil diperbarui.');
      setTimeout(()=>openDetail(Number(id)),150);
      return;
    }

    const result=await window.EFCloud.publishStory(item);
    if(!result.ok){
      if(result.reason==='login'||result.reason==='not-configured'){window.EFCloud.requireLoginForShare();return;}
      showToast('Cerita belum tersimpan online: '+result.reason);return;
    }
    experiences.unshift(item);
    localStorage.removeItem(STORAGE.draft);
    $('shareForm').reset(); updateAllCounters();
    currentResults=[...experiences]; currentKeyword=''; currentCategory='';
    showToast('Cerita berhasil disimpan ke database online.');
    setTimeout(()=>openDetail(Number(id)),350);
  } finally {
    submitButton.disabled=false;
  }
});

let spotIndex=0, spotTimer=null;
function renderSpotlight(){
  const el=$('spotQuote'); if(!el) return;
  const top=[...experiences].sort((a,b)=>b.helpful-a.helpful).slice(0,3);
  if(!top.length) return;
  const show=i=>{
    spotIndex=i; const s=top[i];
    $('spotCat').textContent=s.category;
    el.textContent='“'+s.summary+'”';
    $('spotAuthor').textContent=s.author+' · '+s.role;
    $('spotInitial').textContent=s.author.charAt(0).toUpperCase();
    $('spotRead').onclick=()=>openDetail(s.id);
    $('spotDots').innerHTML=top.map((_,k)=>`<button class="${k===i?'on':''}" aria-label="Cerita ${k+1}" data-i="${k}"></button>`).join('');
    $('spotDots').querySelectorAll('button').forEach(b=>b.onclick=()=>{show(Number(b.dataset.i));restart();});
  };
  const restart=()=>{clearInterval(spotTimer);spotTimer=setInterval(()=>show((spotIndex+1)%top.length),6500);};
  show(0); restart();
}

window.experiences=experiences;
window.getCurrentStoryId=()=>currentStoryId;
window.renderCloudStories=()=>{renderSpotlight();currentResults=[...experiences];renderCategories();renderDiscoverCategories();render(currentResults,false);updateSavedBadge();};

document.querySelectorAll('.story-form input,.story-form textarea,.story-form select').forEach(input=>{
  input.addEventListener('input',()=>{updateCounter(input);saveDraft();});
  input.addEventListener('change',saveDraft);
});

document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
window.addEventListener('hashchange',handleHash);

mergeStoredStories();
renderCategories();
renderDiscoverCategories();
render(experiences,false);
renderSpotlight();
updateSavedBadge();
updateAllCounters();
setTimeout(handleHash,200);

window.showShare=showShare;window.showHome=showHome;window.editOwnStory=editOwnStory;window.deleteOwnStory=deleteOwnStory;window.refreshCurrentSort=refreshCurrentSort;window.cancelStoryEdit=cancelStoryEdit;
