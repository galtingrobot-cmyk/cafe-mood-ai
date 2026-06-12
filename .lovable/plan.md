

# 🔄 Update Aplikasi Kopi Mood

Memperbarui aplikasi sesuai 6 halaman yang diminta, menambahkan halaman Checkout terpisah, banner promosi, form rekomendasi terstruktur, dan tab Saran Pelanggan di Admin.

---

## 1. 🏠 Halaman Home (update)
- Tambah **logo café** lebih menonjol di hero (icon Coffee + nama besar)
- Dua tombol utama: **"Lihat Menu"** dan **"Rekomendasi Minuman"** (ke `/chat`)
- Tambah **banner promosi** di bawah hero (contoh: "Promo Happy Hour 15-17 — Diskon 20% Semua Kopi ☕")

## 2. 📋 Halaman Menu (sudah ada, minor polish)
- Pastikan setiap kartu menampilkan: nama, harga, deskripsi, tombol **Tambah ke Keranjang** ✓ (sudah)

## 3. 🤖 Halaman Chat Rekomendasi AI (redesign)
- Ubah dari free-chat menjadi **form terstruktur** di atas + chat di bawah
- **Input fields**:
  - Mood (select: santai, fokus, sedih, semangat, romantis, lelah)
  - Rasa (select: manis, pahit, segar, creamy, asam)
  - Budget (input angka, Rp)
- Tombol **"Kirim"** → susun prompt otomatis ke AI Barista
- Output: rekomendasi minuman + deskripsi (markdown streaming, sudah ada)
- Tetap dukung free-text di kolom chat di bawah untuk lanjut tanya

## 4. 🛒 Halaman Keranjang (update)
- Daftar pesanan + total ✓ (sudah)
- Tombol **Checkout** sekarang → **redirect ke `/checkout`** (bukan langsung selesai)

## 5. 💳 Halaman Checkout (BARU)
- Route baru `/checkout`
- **Ringkasan pesanan** (read-only list dari cart)
- Pilihan **Metode pembayaran** (radio: Tunai, QRIS, Transfer Bank, E-Wallet) — simulasi
- Input nama pelanggan (opsional, untuk Admin)
- Tombol **"Bayar"** → simulasi sukses, simpan order, clear cart, redirect ke home dengan toast sukses

## 6. ⚙️ Dashboard Admin (update)
Tambah tab ketiga jadi 3 tabs:
- **Kelola Menu** ✓ (sudah)
- **Data Pesanan** ✓ (sudah, tampilkan juga metode bayar & nama pelanggan)
- **Saran Pelanggan** (BARU): list saran/feedback dari `localStorage`, dengan form kecil untuk pelanggan kirim saran (bisa ditaruh di footer atau halaman /cart sukses)

---

## 📂 Detail Teknis

**File baru:**
- `src/pages/CheckoutPage.tsx` — halaman checkout dengan ringkasan + metode bayar
- `src/contexts/FeedbackContext.tsx` — kelola saran pelanggan via `localStorage`

**File diupdate:**
- `src/App.tsx` — tambah route `/checkout`, wrap `FeedbackProvider`
- `src/pages/Index.tsx` — banner promosi, dua CTA jelas (Lihat Menu + Rekomendasi Minuman)
- `src/pages/ChatPage.tsx` — tambah form (mood/rasa/budget) di atas chat; submit menyusun prompt
- `src/pages/CartPage.tsx` — tombol Checkout → `navigate("/checkout")`
- `src/pages/AdminPage.tsx` — tambah tab "Saran Pelanggan", tampilkan metode bayar di order
- `src/contexts/CartContext.tsx` — `Order` ditambah field `paymentMethod` & `customerName` opsional; `checkout()` terima parameter
- `src/data/menu.ts` — (opsional) tambah field promo
- `supabase/functions/cafe-chat/index.ts` — system prompt update agar memahami input terstruktur (mood/rasa/budget) dan memfilter rekomendasi sesuai budget

**Tidak ada perubahan database** — semua state via React Context + `localStorage` (sesuai keputusan awal "data statis").

