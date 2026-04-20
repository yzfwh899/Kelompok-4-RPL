a# 🎨 ResepMenu — Frontend Documentation

## Overview

Frontend ResepMenu adalah single-page application (SPA) berbasis HTML, CSS (TailwindCSS), dan JavaScript vanilla. Tidak memerlukan build tool — cukup serve sebagai static file.

---

## Fitur UI

- 💬 **Chat Interface** — Tampilan chat interaktif dengan bubble message
- 🎨 **Dark Theme** — Tema gelap dengan warna hijau/orange (tema masakan)
- 📱 **Responsive** — Berfungsi di desktop dan mobile
- ⚡ **Quick Actions** — Tombol shortcut untuk pertanyaan umum
- 📝 **Markdown Support** — Respons AI dirender sebagai Markdown
- 🔒 **XSS Protection** — Menggunakan DOMPurify untuk sanitasi HTML

---

## Struktur File

```
frontend/
└── index.html    # Semua UI dalam satu file (HTML + CSS + JS)
```

---

## Teknologi

| Teknologi | Via | Kegunaan |
|-----------|-----|----------|
| TailwindCSS | CDN | Utility-first CSS framework |
| Marked.js | CDN | Markdown parser |
| DOMPurify | CDN | HTML sanitizer (XSS protection) |
| Google Fonts | CDN | Poppins & Inter font |
| Material Symbols | CDN | Icon set |

---

## Cara Kerja

1. User mengetik pertanyaan di input field
2. JavaScript mengirim POST request ke `/api/chat`
3. Server memproses dengan Ollama + MCP Tools
4. Respons ditampilkan sebagai bubble chat dengan Markdown rendering
5. User bisa klik tombol quick action untuk pertanyaan preset

---

## Quick Actions

| Tombol | Pertanyaan yang Dikirim |
|--------|------------------------|
| 🍳 Resep Populer | "Tampilkan resep populer Indonesia" |
| 🥘 Kategori Masakan | "Tampilkan semua kategori resep" |
| 🛒 Cari Berdasarkan Bahan | "Saya punya ayam dan bawang, bisa buat apa?" |
| 📋 Rekomendasi Menu | "Rekomendasikan menu makan siang hari ini" |

---

## API Integration

Frontend berkomunikasi dengan backend melalui 3 endpoint:

```javascript
// Kirim pesan
POST /api/chat { message, sessionId }

// Reset chat
POST /api/reset { sessionId }

// Health check
GET /api/health
```

---

## Kustomisasi

Untuk mengubah warna tema, edit konfigurasi Tailwind di `<script id="tailwind-config">`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#ea580c",        // Warna utama (Orange)
        "background-dark": "#1c1917", // Background gelap
      }
    }
  }
}
```
