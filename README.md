# Cafe Mood AI

Selamat datang di project **Cafe Mood AI**! Ini adalah aplikasi web kafe modern yang interaktif, dilengkapi dengan fitur chat AI, animasi 3D, efek scroll yang halus, serta sistem manajemen antrean dan pemesanan.

## 🚀 Fitur Utama
- **UI/UX Modern**: Desain responsif, animasi halus (Framer Motion), dan efek paralaks.
- **Elemen 3D**: Integrasi cangkir kopi 3D dan animasi *particle* menggunakan Three.js & React Three Fiber.
- **Smooth Scrolling**: Scroll mulus dan premium berkat Lenis.
- **Pemesanan & Antrean (Waiting List)**: Manajemen pesanan real-time berbasis Supabase.
- **Chat Interaktif**: Antarmuka percakapan bergaya AI.

---

## 📋 Prasyarat Sistem

Sebelum memulai instalasi, pastikan komputer Anda sudah terinstal perangkat lunak berikut:
- **Node.js** (Versi 18 atau yang lebih baru) - [Download di sini](https://nodejs.org/)
- **npm** (Biasanya otomatis terinstal saat Anda menginstal Node.js)
- Akun atau akses database [Supabase](https://supabase.com) (Untuk fungsi pemesanan dan antrean)

---

## 🛠️ Langkah-langkah Instalasi

Ikuti panduan berikut secara berurutan untuk menjalankan web ini di komputer lokal Anda:

### 1. Clone Repository (Unduh Kode)
Buka terminal/CMD Anda, lalu jalankan perintah berikut:
```bash
git clone https://github.com/galtingrobot-cmyk/cafe-mood-ai.git
cd cafe-mood-ai
```

### 2. Install Dependensi
Jalankan perintah `npm install` untuk mengunduh semua paket pihak ketiga yang dibutuhkan project ini:
```bash
npm install
```

### 3. Konfigurasi Environment (Variabel Lingkungan)
Project ini membutuhkan koneksi database. Buat sebuah file bernama `.env` di folder utama project (sejajar dengan file `package.json`), lalu isi dengan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=masukkan_url_supabase_anda_disini
NEXT_PUBLIC_SUPABASE_ANON_KEY=masukkan_anon_key_supabase_anda_disini
```
*(Catatan: Jika Anda tidak punya kredensial ini, beberapa fitur pemesanan tidak akan bisa menyimpan data)*

### 4. Jalankan Aplikasi Mode Development
Aplikasi ini sudah dikonfigurasi untuk menggunakan **Turbopack** bawaan Next.js agar *loading* sangat cepat. Jalankan:
```bash
npm run dev
```

### 5. Buka di Browser
Setelah proses build selesai (muncul keterangan *Ready in ...ms*), buka web browser Anda dan akses:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🤖 Integrasi AI dengan N8N (Workflow Automation)

Aplikasi ini menggunakan **n8n** sebagai *backend* berbasis *workflow* untuk memproses fitur Chat AI. Jika Anda mengembangkan secara lokal dan ingin menghubungkan antarmuka chat dengan n8n, ikuti langkah berikut:

### 1. Menjalankan N8N menggunakan Docker
Pastikan aplikasi Docker sudah berjalan di sistem Anda. Buka terminal baru dan jalankan *container* n8n lokal (secara *default* akan berjalan di port `5678`):
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

### 2. Mengekspos Localhost ke Publik dengan Cloudflare Tunnel
Agar webhook n8n lokal Anda dapat menerima *request* dari *frontend* (terutama jika *frontend* di-*deploy* di Vercel), Anda perlu membuat sebuah *tunnel* agar URL `localhost` memiliki alamat publik.
Jalankan perintah berikut di terminal:
```bash
npx cloudflared tunnel --url http://localhost:5678
```
*Tunggu beberapa saat, dan Cloudflare akan memberikan URL publik acak (contoh: `https://acak-kata.trycloudflare.com`).*

### 3. Konfigurasi Endpoint Webhook
Salin URL publik dari Cloudflare tersebut. Gunakan URL tersebut sebagai basis untuk endpoint AI *chat webhook* Anda. Masukkan ke dalam Environment Variables di Vercel atau di file `.env` lokal jika diperlukan, sesuai dengan konfigurasi endpoint yang digunakan di dalam *source code* (contoh: di `src/app/chat/page.tsx`).

---

## 📖 Cara Penggunaan

1. **Jelajahi Menu**: Scroll halaman ke bawah untuk menikmati efek transisi paralaks, lihat daftar menu kopi dan kue yang tersedia.
2. **Order / Cart**: Klik menu yang diinginkan untuk menambahkannya ke keranjang (Cart), lalu lanjutkan hingga halaman Checkout.
3. **Admin & Antrean**: Jika pesanan berhasil dibuat, pesanan akan masuk ke sistem *Waiting List*. Anda bisa mengakses `http://localhost:3000/waiting-list` untuk melihat daftar antrean pelanggan, atau ke menu Admin untuk menyelesaikan pesanan.
4. **Chatbot**: Akses halaman chat untuk mencoba UI perpesanan AI yang ada di dalam aplikasi.

---

## 📦 Dependensi Utama yang Digunakan

Aplikasi ini dirancang dengan teknologi web terbaru. Berikut adalah pustaka (library) penting yang menggerakkan web ini:

### ⚡ Framework & Core
- **[Next.js (v16)](https://nextjs.org/)** - React framework dengan fitur *Server-Side Rendering* dan Turbopack.
- **[React (v19)](https://react.dev/)** - Library JavaScript utama untuk membangun antarmuka pengguna (UI).
- **TypeScript** - Untuk mencegah *bug* dengan *static typing*.

### 🎨 Styling & Komponen UI
- **[Tailwind CSS](https://tailwindcss.com/)** - *Utility-first CSS framework* untuk mempercepat *styling*.
- **[Radix UI](https://www.radix-ui.com/)** - Kumpulan komponen UI tanpa *style* dasar (headless) untuk membuat *dropdown*, modal, *accordion*, dll secara aksesibel.
- **[Lucide React](https://lucide.dev/)** & **FontAwesome** - Library kumpulan ikon modern.
- **clsx** & **tailwind-merge** - Utilitas untuk menggabungkan class CSS dinamis.

### 🎬 Animasi & Interaksi 3D
- **[Framer Motion](https://www.framer.com/motion/)** - Library animasi *super power* untuk React (membuat efek memudar, melayang, dll).
- **[Three.js](https://threejs.org/)** & **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)** - Digunakan khusus untuk me-render objek 3D cangkir kopi (Coffee Loader) secara ringan di *browser*.
- **[Lenis](https://lenis.studiofreight.com/)** - Menambahkan efek *Smooth Scrolling* agar saat layar digulir terasa seperti aplikasi natif kelas atas.

### 💾 Backend & Pengolahan Data
- **[Supabase](https://supabase.com/)** - Platform Backend-as-a-Service (PostgreSQL) untuk menyimpan data keranjang, status pesanan, dan menu.
- **[React Query (@tanstack/react-query)](https://tanstack.com/query/latest)** - Menangani proses *fetching* (pengambilan data dari database) beserta *caching* secara reaktif.
- **React Hook Form** & **Zod** - Membantu manajemen form (input data) dan memvalidasi kebenaran data yang diketik oleh pengguna.
