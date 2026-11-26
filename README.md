# Experience Finder

Website untuk mencari dan berbagi pengalaman. Frontend di-host melalui GitHub Pages; cerita, komentar, dan akun disimpan/diatur oleh Supabase.

## Fitur

- Kategori: Karier, Pendidikan, Organisasi, Pertemanan & Sosial, Pengembangan Diri, Kehidupan Sehari-hari.
- Login Google dan email/password melalui Supabase Auth.
- Bagikan cerita dengan nama profil atau anonim.
- Edit/hapus cerita milik akun sendiri.
- Komentar dengan kebijakan akses berbasis akun.
- Pencarian TF-IDF dan Cosine Similarity serta daftar cerita terkait berdasarkan kemiripan teks.

## Menjalankan secara lokal

1. Buka folder ini di Visual Studio Code.
2. Isi `supabase-config.js` dengan Project URL dan publishable key dari Supabase.
3. Jalankan `index.html` menggunakan Live Server (bukan `file://`).
4. Siapkan database dan OAuth mengikuti `PANDUAN-SUPABASE-GOOGLE.txt`.

## Database

- Proyek Supabase baru: jalankan `database-schema.sql` di SQL Editor.
- Proyek lama Experience Finder: jalankan `database-migration-v2.sql`.

Migrasi menyalin pemilik cerita lama ke schema privat sebelum menghapus `author_id` dari tabel cerita. Isi cerita lama dan komentar tidak dihapus.

## GitHub Pages

Unggah isi folder ini ke root repository (pastikan `index.html` berada langsung di root). Kemudian buka **Settings → Pages**, pilih **Deploy from a branch**, branch `main`, folder `/(root)`. Masukkan URL Pages ke **Supabase → Authentication → URL Configuration**.

## Konfigurasi dan keamanan

`supabase-config.js` memuat Project URL dan **publishable key** (`sb_publishable_...`) yang memang harus digunakan browser. Kode juga menolak key yang tidak diawali `sb_publishable_`. Nilai itu bukan secret. Keamanan data bergantung pada RLS, GRANT minimal, dan pemeriksaan kepemilikan di fungsi RPC.

**Jangan pernah commit** Supabase Secret/service_role key, Google OAuth Client Secret, database password, token, atau `.env` rahasia.

Cerita contoh pada `script.js` merupakan data demo statis dan dapat dibaca dari source code. Cerita pengguna yang disimpan di Supabase dilindungi RLS dan tidak dapat dibaca pengunjung tanpa login.
