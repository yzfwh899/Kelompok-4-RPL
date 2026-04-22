<h1>Tugas Kelompok 4 - Pencari-Resep-Makan</h1>
<h3>Anggota Kelompok:</h3>
<h5>Baday Ekel Perimsa Gloria Tarigan,
          Muhammad Falih FajrulHaq Natadipura,
          Yoza Alshifwah,
          Aulia Indriyani</h5>
# 🍽️ ResepMenu Luxe — Asisten Virtual Resep Masakan Indonesia

> **Digital Recipe Concierge** — Chatbot berbasis AI yang membantu Anda menemukan dan membuat resep masakan Indonesia dengan mudah.

Aplikasi chatbot interaktif yang menggabungkan **AI Language Model (Ollama)** dengan **MCP (Model Context Protocol)** untuk memberikan rekomendasi resep masakan Indonesia yang akurat dan personal.

---

## ✨ Fitur Utama

- 🔍 **Cari Resep** — Temukan resep berdasarkan nama atau kategori masakan
- 🥘 **Lihat Bahan-Bahan** — Daftar lengkap bahan untuk setiap resep
- 🎯 **Cari Berdasarkan Bahan** — Temukan resep dari bahan yang Anda miliki
- 📅 **Rekomendasi Menu** — Saran menu sarapan, makan siang, atau makan malam
- 📚 **Jelajahi Kategori** — Lihat semua kategori masakan yang tersedia
- 💬 **Chat Interface** — Tanya jawab dengan AI secara natural dalam Bahasa Indonesia
- 🎨 **UI Modern** — Desain dark theme yang elegant dan responsif

---

## 🛠️ Tech Stack

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** | ≥18 | Runtime JavaScript |
| **TypeScript** | ^5.9.3 | Type-safe development |
| **Express.js** | ^5.2.1 | HTTP server & REST API |
| **Ollama** | ^0.6.3 | Client untuk LLM cloud |
| **MCP SDK** | ^1.27.1 | Model Context Protocol |
| **Zod** | ^4.3.6 | Schema validation |
| **CORS** | ^2.8.6 | Cross-origin resource sharing |

### Frontend
| Teknologi | Fungsi |
|-----------|--------|
| **HTML5** | Struktur halaman |
| **Tailwind CSS** | Utility-first CSS framework |
| **Marked.js** | Markdown parser untuk respons AI |
| **DOMPurify** | XSS protection |
| **JavaScript (Vanilla)** | Logika interaktif |
| **Material Symbols** | Icon set |
| **Google Fonts** | Playfair Display & Inter |

---

## 📁 Struktur Proyek

```
ResepMakan-Project-main/
├── README.md                   # Dokumentasi utama (file ini)
├── server/                     # Backend Express + MCP
│   ├── app.ts                  # HTTP server + Ollama integration
│   ├── mcp-server.ts           # MCP Server dengan 5 tools
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── README.md               # Dokumentasi server
│   ├── node_modules/           # Dependencies (auto-generated)
│   └── data/
│       └── resep.json          # Database 15+ resep masakan Indonesia
├── frontend/                   # Frontend SPA
│   ├── index.html              # Single-page app (HTML + CSS + JS)
│   └── README.md               # Dokumentasi frontend
└── docs/                       # Dokumentasi tambahan
    ├── DOKUMENTASI.md          # Dokumentasi lengkap
    └── tools.md                # Dokumentasi MCP tools
```

---

## 🏗️ Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                    │
│            HTML + Tailwind CSS + Vanilla JS              │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP POST /api/chat
                             ▼
┌──────────────────────────────────────────────────────────┐
│              Backend (Express.js Server)                 │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  app.ts — HTTP API & Ollama Integration             │ │
│  └─────────────────────────────────────────────────────┘ │
│                       │                                  │
│        ┌──────────────┼──────────────┐                  │
│        │              │              │                  │
│        ▼              ▼              ▼                  │
│    MCP Client    Ollama Cloud   MCP Server             │
│                  (LLM)          (mcp-server.ts)        │
│                                     │                   │
│                                     ▼                   │
│                                data/resep.json         │
│                             (Database resep)           │
└──────────────────────────────────────────────────────────┘
```

**Flow:**
1. User mengirim pesan ke frontend
2. Frontend melakukan POST request ke `/api/chat`
3. Backend (app.ts) menerima pesan dan mengirimnya ke Ollama LLM
4. Ollama dapat mengakses 5 tools MCP dari mcp-server.ts
5. Tools membaca data dari resep.json
6. Ollama memberikan respons yang relevan dengan data resep
7. Frontend menampilkan respons dan render Markdown

---

## 🚀 Quick Start

### Prasyarat
- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **Ollama API Key** — Daftar di [ollama.com](https://ollama.com)

### Instalasi & Setup

```bash
# 1. Clone atau masuk ke folder proyek
cd ResepMakan-Project-main

# 2. Masuk ke folder server
cd server

# 3. Install dependencies
npm install

# 4. Update API key di app.ts (baris OLLAMA_API_KEY)
# Edit server/app.ts line 13:
# const OLLAMA_API_KEY = "YOUR_ACTUAL_API_KEY_HERE";

# 5. Jalankan server
npm start
# Server berjalan di http://localhost:3000
```

### Menjalankan Frontend

```bash
# Buka browser ke http://localhost:3000
# Frontend sudah serve otomatis oleh Express.js
# Atau buka folder frontend/index.html langsung di browser
```

---

## 📡 API Endpoints

### POST `/api/chat`
Mengirim pesan chat dan menerima respons dari AI.

**Request:**
```json
{
  "message": "Cari resep nasi goreng",
  "sessionId": "user123"
}
```

**Response:**
```json
{
  "reply": "Berikut resep nasi goreng yang saya temukan...",
  "sessionId": "user123"
}
```

### POST `/api/reset`
Reset sesi chat untuk user tertentu.

**Request:**
```json
{
  "sessionId": "user123"
}
```

### GET `/api/health`
Health check server status.

**Response:**
```json
{
  "status": "ok",
  "mcpConnected": true,
  "toolsAvailable": ["cari_resep", "lihat_bahan", "cari_berdasarkan_bahan", "rekomendasi_menu", "lihat_kategori"]
}
```

---

## 🔧 MCP Tools (5 Tools)

### 1. `cari_resep`
Mencari resep berdasarkan nama atau kategori.

```
Parameter: query (string)
Contoh: "nasi goreng", "sup", "lauk pauk"
```

### 2. `lihat_bahan`
Menampilkan daftar bahan untuk resep tertentu.

```
Parameter: namaResep (string)
Contoh: "Rendang Daging Sapi", "Soto Ayam"
```

### 3. `cari_berdasarkan_bahan`
Mencari resep dari bahan yang tersedia.

```
Parameter: bahan (string, pisahkan dengan koma)
Contoh: "ayam, bawang, tomat"
```

### 4. `rekomendasi_menu`
Rekomendasi menu berdasarkan waktu makan.

```
Parameter: waktu (string, optional)
Contoh: "sarapan", "makan siang", "makan malam"
```

### 5. `lihat_kategori`
Menampilkan semua kategori resep yang tersedia.

```
Parameter: (tidak ada)
```

Dokumentasi lengkap tools → lihat **[docs/tools.md](docs/tools.md)**

---

## 🧪 Testing & Development

### Development Mode
```bash
cd server
npm run dev
# Menggunakan tsx watch untuk auto-reload
```

### Jalankan MCP Server Standalone
```bash
cd server
npm run mcp
# Untuk testing tools secara terpisah
```

### Manual Testing dengan cURL

```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Cari resep nasi goreng","sessionId":"test1"}'

# Test health check
curl http://localhost:3000/api/health

# Test reset session
curl -X POST http://localhost:3000/api/reset \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test1"}'
```

### Testing di Browser
1. Buka http://localhost:3000
2. Coba pertanyaan seperti:
   - "Cari resep nasi goreng"
   - "Apa bahan-bahan untuk rendang?"
   - "Menu sarapan apa yang enak?"
   - "Resep apa saja yang ada di kategori sup?"
   - "Saya punya ayam, bawang, tomat. Bisa masak apa?"

---

## 📊 Data Resep

Database terdiri dari **15+ resep masakan Indonesia** dengan kategori:
- **Nasi** — Nasi Goreng, Nasi Uduk, dll
- **Lauk Pauk** — Rendang, Ayam Goreng, Ikan Bakar, dll
- **Sup** — Soto Ayam, Sup Buntut, dll
- **Bubur** — Bubur Ayam, Bubur Manado, dll
- **Dessert** — Es Cendol, Martabak, dll

Setiap resep memiliki:
- Deskripsi lengkap
- Waktu memasak
- Jumlah porsi
- Tingkat kesulitan
- Daftar bahan lengkap
- Langkah-langkah detail
- Tags untuk pencarian

Lihat data lengkap → **[server/data/resep.json](server/data/resep.json)**

---

## 📚 Dokumentasi Lengkap

- **[server/README.md](server/README.md)** — Dokumentasi backend
- **[frontend/README.md](frontend/README.md)** — Dokumentasi frontend
- **[docs/DOKUMENTASI.md](docs/DOKUMENTASI.md)** — Dokumentasi lengkap & arsitektur detail
- **[docs/tools.md](docs/tools.md)** — Dokumentasi MCP tools dengan contoh

---

## 🔐 Keamanan

- ✅ XSS Protection — Menggunakan DOMPurify untuk sanitasi HTML
- ✅ CORS Protection — Express CORS middleware
- ✅ Input Validation — Zod schema validation untuk parameters
- ✅ API Key Management — Gunakan environment variables untuk sensitive data

**Catatan:** Jangan commit API key ke repository. Gunakan `.env` file atau environment variables.

---

## 🎯 Scripts Tersedia

```bash
cd server

# Production
npm start          # Jalankan server dengan tsx

# Development
npm run dev        # Jalankan dengan watch mode

# Testing
npm run mcp        # Jalankan MCP server standalone
```

---

## 🤝 Kontribusi

Proyek ini adalah tugas kelompok untuk mempelajari:
- MCP (Model Context Protocol) architecture
- AI integration dengan Large Language Models
- Full-stack development dengan TypeScript
- RESTful API design

---

## 📄 Lisensi

MIT License © 2025

---

## 📞 Support & Questions

Untuk pertanyaan atau issues, silakan cek:
- [Documentation lengkap](docs/DOKUMENTASI.md)
- [Tools documentation](docs/tools.md)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**Selamat menggunakan ResepMenu! 🎉 Semoga membantu Anda menemukan resep masakan Indonesia favorit!**
