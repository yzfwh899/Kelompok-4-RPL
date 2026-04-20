# 📖 ResepMenu Luxe — Dokumentasi Lengkap

> Digital Recipe Concierge — Asisten masakan Indonesia berbasis AI

---

## 📋 Daftar Isi

- [Overview](#overview)
- [Tech Stack & Bahasa yang Digunakan](#tech-stack--bahasa-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Arsitektur & Cara Kerja](#arsitektur--cara-kerja)
- [Fitur yang Sudah Dibuat](#fitur-yang-sudah-dibuat)
- [API Endpoints](#api-endpoints)
- [MCP Tools](#mcp-tools)
- [Data Resep](#data-resep)
- [Cara Menjalankan](#cara-menjalankan)

---

## Overview

**ResepMenu Luxe** adalah aplikasi chatbot berbasis AI yang berfungsi sebagai asisten masakan Indonesia. Pengguna bisa bertanya tentang resep, mencari berdasarkan bahan, mendapatkan rekomendasi menu, dan menelusuri kategori masakan — semuanya melalui antarmuka chat yang elegan bertema luxury dark-gold.

Aplikasi ini menggunakan arsitektur **MCP (Model Context Protocol)** untuk menghubungkan Large Language Model (Ollama) dengan data resep masakan lokal, sehingga AI bisa memberikan jawaban yang akurat berdasarkan database resep yang tersedia.

---

## Tech Stack & Bahasa yang Digunakan

### Bahasa Pemrograman

| Bahasa | Digunakan untuk |
|--------|----------------|
| **TypeScript** | Backend (Express server + MCP server) |
| **HTML** | Struktur halaman frontend |
| **CSS** | Styling (via Tailwind CSS + custom CSS) |
| **JavaScript** | Logika frontend (chat, search, filter) |
| **JSON** | Data resep masakan |

### Framework & Library

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Express.js** | ^5.2.1 | HTTP server & REST API |
| **@modelcontextprotocol/sdk** | ^1.27.1 | MCP client (app.ts) & MCP server (mcp-server.ts) |
| **Ollama** (npm package) | ^0.6.3 | Client untuk berkomunikasi dengan LLM cloud |
| **Zod** | ^4.3.6 | Validasi schema parameter MCP tools |
| **CORS** | ^2.8.6 | Middleware cross-origin request |
| **tsx** | ^4.21.0 | TypeScript executor untuk development |
| **TypeScript** | ^5.9.3 | Compiler TypeScript |

### Frontend (CDN)

| Teknologi | Fungsi |
|-----------|--------|
| **Tailwind CSS** | Utility-first CSS framework (plugins: forms, container-queries) |
| **Marked.js** | Markdown parser — render respons AI ke HTML |
| **DOMPurify** | Sanitasi HTML untuk mencegah XSS attack |
| **Google Material Symbols** | Icon set |
| **Google Fonts** | Playfair Display (serif) & Inter (sans-serif) |

### Runtime & Tooling

| Teknologi | Fungsi |
|-----------|--------|
| **Node.js** (≥18) | JavaScript runtime untuk server |
| **npm** | Package manager |
| **ESModules** | Module system (`"type": "module"`) |

---

## Struktur Proyek

```
ResepMenu/
├── README.md                   # Dokumentasi utama proyek
├── docs/
│   ├── tools.md                # Dokumentasi MCP tools
│   └── DOKUMENTASI.md          # Dokumentasi lengkap (file ini)
├── frontend/
│   ├── index.html              # Single-page app (HTML + CSS + JS)
│   └── README.md               # Dokumentasi frontend
└── server/
    ├── app.ts                  # Express HTTP server + Ollama + MCP Client
    ├── mcp-server.ts           # MCP Server dengan 5 tools
    ├── package.json            # Dependencies & scripts
    ├── tsconfig.json           # Konfigurasi TypeScript
    ├── README.md               # Dokumentasi server
    └── data/
        └── resep.json          # Database 15 resep masakan Indonesia
```

---

## Arsitektur & Cara Kerja

### Diagram Arsitektur

```
┌────────────────────┐          ┌────────────────────┐          ┌────────────────────┐
│                    │  HTTP    │                    │  Stdio   │                    │
│   Frontend (SPA)   │────────▶│   Express Server   │────────▶│    MCP Server      │
│   index.html       │◀────────│   app.ts (:3000)   │◀────────│   mcp-server.ts    │
│                    │         │                    │          │                    │
└────────────────────┘         └────────┬───────────┘          └────────┬───────────┘
                                        │                               │
                                        │ HTTPS                         │ File Read
                                        ▼                               ▼
                               ┌────────────────────┐          ┌────────────────────┐
                               │   Ollama Cloud     │          │   resep.json       │
                               │   (gpt-oss:120b)   │          │   (15 resep)       │
                               └────────────────────┘          └────────────────────┘
```

### Alur Kerja Detail

#### 1. Chat dengan AI (Alur Utama)

```
User ketik pesan ──▶ Frontend kirim POST /api/chat
                            │
                            ▼
                    Express terima pesan
                            │
                            ▼
              Simpan pesan ke session history
                            │
                            ▼
              Kirim messages + tools ke Ollama Cloud
                            │
                            ▼
                   Ollama proses pesan
                     ┌──────┴──────┐
                     │             │
              Tool diperlukan?     Tidak
                     │             │
                     ▼             ▼
           Panggil MCP Server   Kirim jawaban
           via StdioTransport   langsung ke user
                     │
                     ▼
            MCP Server eksekusi tool
            (baca resep.json, filter data)
                     │
                     ▼
            Hasil tool dikirim balik ke Ollama
                     │
                     ▼
            Ollama buat jawaban akhir
            berdasarkan hasil tool
                     │
                     ▼
            Jawaban dikirim ke Frontend
                     │
                     ▼
            Frontend render Markdown ke HTML
            (via Marked.js + DOMPurify)
```

#### 2. Search & Filter (Alur Pencarian)

```
User buka Search Overlay (klik tombol / tekan "/")
                     │
                     ▼
          Frontend load filter options
          GET /api/resep/filters
                     │
                     ▼
       Tampilkan filter chips
       (Kategori, Kesulitan, Waktu Makan)
                     │
                     ▼
    User ketik keyword / klik filter
                     │
                     ▼
    Frontend kirim GET /api/resep?q=...&kategori=...
    (debounce 250ms)
                     │
                     ▼
    Server filter data resep.json di memory
                     │
                     ▼
    Hasil ditampilkan sebagai list
                     │
                     ▼
    User klik resep ──▶ Kirim chat otomatis
    "Tampilkan resep lengkap untuk [nama]"
```

#### 3. Reset Session

```
User klik "Percakapan Baru"
         │
         ▼
  POST /api/reset { sessionId }
         │
         ▼
  Server hapus session dari Map
         │
         ▼
  Frontend restore Welcome Screen + Quick Actions
```

### Komponen Utama

| Komponen | File | Fungsi |
|----------|------|--------|
| **Express Server** | `server/app.ts` | HTTP server, routing API, integrasi Ollama, MCP client |
| **MCP Server** | `server/mcp-server.ts` | Menyediakan 5 tools untuk akses data resep |
| **MCP Client** | (dalam `app.ts`) | Menghubungkan Express ke MCP Server via stdio |
| **Ollama Client** | (dalam `app.ts`) | Komunikasi dengan LLM cloud untuk generate jawaban |
| **Frontend SPA** | `frontend/index.html` | UI chat, search, filter, quick actions |
| **Data Layer** | `server/data/resep.json` | Database resep masakan Indonesia (15 resep) |

### Session Management

- Setiap tab browser mendapat `sessionId` unik secara random
- History percakapan disimpan di memory server (`Map<string, messages[]>`)
- Setiap session dimulai dengan **system prompt** yang menginstruksikan AI sebagai asisten masakan Indonesia
- Session dihapus saat user klik "Percakapan Baru"

---

## Fitur yang Sudah Dibuat

### 🤖 AI Chat

| Fitur | Deskripsi |
|-------|-----------|
| Chat real-time | Kirim pesan dan terima respons AI secara langsung |
| Markdown rendering | Respons AI di-render sebagai formatted HTML (heading, list, tabel, code block, blockquote) |
| XSS Protection | Semua input user di-escape, output AI disanitasi dengan DOMPurify |
| Session management | Setiap pengguna memiliki session terpisah dengan history percakapan |
| Tool-augmented AI | AI menggunakan MCP tools untuk mengambil data resep yang akurat |
| System prompt | AI dikonfigurasi sebagai "Chef AI" yang ramah dan berbahasa Indonesia |

### 🔍 Search & Filter

| Fitur | Deskripsi |
|-------|-----------|
| Search overlay | Panel pencarian full-screen dengan keyboard shortcut (`/` untuk buka, `ESC` untuk tutup) |
| Real-time search | Pencarian langsung dengan debounce 250ms (cari berdasarkan nama, deskripsi, bahan, tags) |
| Filter Kategori | Filter berdasarkan: Nasi, Lauk Pauk, Sup & Soto, Sayuran, Sambal, Dessert, Bubur |
| Filter Kesulitan | Filter berdasarkan: Mudah, Sedang, Sulit |
| Filter Waktu Makan | Filter berdasarkan: Sarapan, Makan Siang, Makan Malam |
| Kombinasi filter | Semua filter bisa dikombinasikan (contoh: Kategori=Lauk Pauk + Kesulitan=Mudah) |
| Klik hasil | Klik resep dari hasil pencarian langsung mengirim chat ke AI untuk detail lengkap |
| Dynamic filter chips | Filter chips di-load dari API, otomatis update jika data berubah |

### 🎯 Quick Actions

| Quick Action | Pesan yang Dikirim ke AI |
|-------------|-------------------------|
| Cari Resep | "Tampilkan resep populer Indonesia" |
| Lihat Bahan | "Apa bahan-bahan untuk rendang?" |
| Filter Bahan | "Saya punya ayam, bawang, dan tomat. Bisa masak apa?" |
| Kategori | "Tampilkan semua kategori resep yang tersedia" |
| Rekomendasi | "Rekomendasikan menu makan siang hari ini" |

### 🎨 UI/UX

| Fitur | Deskripsi |
|-------|-----------|
| Dark luxury theme | Skema warna hitam/emas/krem dengan branding "Luxe" |
| Glass-morphism | Efek glass-card dengan backdrop-blur |
| Gold foil border | Border gradient emas pada elemen penting |
| Google Material Symbols | Icon set modern untuk semua elemen UI |
| Playfair Display + Inter | Typography serif + sans-serif untuk nuansa premium |
| Responsive layout | Sidebar collapse ke icon di mobile, grid adaptif 1-3 kolom |
| Custom scrollbar | Scrollbar tipis 4px warna emas |
| Smooth animations | Fade-in animation untuk pesan chat dan elemen baru |
| Status indicator | "Concierge Online" dengan animasi pulse hijau |
| Keyboard shortcuts | `/` buka search, `ESC` tutup search, `Enter` kirim pesan |

### 🔧 Backend

| Fitur | Deskripsi |
|-------|-----------|
| REST API | 5 endpoint untuk chat, reset, search, filter, dan health check |
| MCP Protocol | Implementasi client-server MCP untuk tool-based AI |
| Static file serving | Express serve frontend dari folder `../frontend` |
| CORS enabled | Cross-origin request diizinkan |
| Error handling | Error dari Ollama/MCP ditangkap dan dikembalikan sebagai pesan error |

---

## API Endpoints

### `POST /api/chat`

Mengirim pesan chat ke AI dan mendapatkan jawaban.

**Request Body:**
```json
{
  "message": "Bagaimana cara membuat rendang?",
  "sessionId": "luxe_session_abc123"
}
```

**Response:**
```json
{
  "reply": "## Rendang Daging Sapi\n\nRendang adalah masakan...",
  "sessionId": "luxe_session_abc123"
}
```

### `POST /api/reset`

Reset/hapus session chat.

**Request Body:**
```json
{
  "sessionId": "luxe_session_abc123"
}
```

**Response:**
```json
{
  "message": "Sesi chat direset."
}
```

### `GET /api/resep`

Cari dan filter resep. Semua parameter opsional dan bisa dikombinasikan.

**Query Parameters:**

| Parameter | Tipe | Contoh | Deskripsi |
|-----------|------|--------|-----------|
| `q` | string | `ayam` | Pencarian teks di nama, deskripsi, tags, bahan |
| `kategori` | string | `Lauk Pauk` | Filter berdasarkan kategori |
| `kesulitan` | string | `Mudah` | Filter berdasarkan tingkat kesulitan |
| `waktuMakan` | string | `sarapan` | Filter berdasarkan waktu makan |

**Contoh:** `GET /api/resep?q=goreng&kesulitan=Mudah`

**Response:**
```json
{
  "total": 2,
  "resep": [
    {
      "id": "R014",
      "nama": "Pisang Goreng Crispy",
      "kategori": "Dessert",
      "deskripsi": "...",
      "waktuMasak": "15 menit",
      "porsi": 4,
      "kesulitan": "Mudah",
      "waktuMakan": ["sarapan", "makan siang"],
      "bahan": ["..."],
      "langkah": ["..."],
      "tags": ["pisang", "tepung", "goreng", "dessert"]
    }
  ]
}
```

### `GET /api/resep/filters`

Mendapatkan semua opsi filter yang tersedia.

**Response:**
```json
{
  "kategori": ["Bubur", "Dessert", "Lauk Pauk", "Nasi", "Sambal", "Sayuran", "Sup & Soto"],
  "kesulitan": ["Mudah", "Sulit", "Sedang"],
  "waktuMakan": ["makan malam", "makan siang", "sarapan"]
}
```

### `GET /api/health`

Health check server.

**Response:**
```json
{
  "status": "ok",
  "mcpConnected": true,
  "toolsAvailable": ["cari_resep", "lihat_bahan", "cari_berdasarkan_bahan", "rekomendasi_menu", "lihat_kategori"]
}
```

---

## MCP Tools

MCP Server menyediakan 5 tools yang bisa dipanggil oleh AI melalui Ollama:

### 1. `cari_resep`

Mencari resep berdasarkan nama, kategori, atau tags.

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `query` | string | Ya | Nama resep atau kategori |

### 2. `lihat_bahan`

Menampilkan bahan-bahan dan langkah memasak untuk resep tertentu.

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `namaResep` | string | Ya | Nama resep yang ingin dilihat |

### 3. `cari_berdasarkan_bahan`

Mencari resep berdasarkan bahan yang tersedia, diurutkan berdasarkan jumlah bahan yang cocok.

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `bahan` | string | Ya | Bahan-bahan, dipisahkan koma (contoh: "ayam, bawang, tomat") |

### 4. `rekomendasi_menu`

Memberikan rekomendasi menu berdasarkan waktu makan.

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `waktu` | string | Tidak | "sarapan", "makan siang", atau "makan malam". Jika kosong, rekomendasikan untuk semua waktu |

### 5. `lihat_kategori`

Menampilkan semua kategori resep yang tersedia beserta jumlah resep di setiap kategori.

*(Tidak ada parameter)*

---

## Data Resep

Database berisi **15 resep masakan Indonesia** dalam file `server/data/resep.json`.

### Schema

```typescript
interface Resep {
  id: string;           // ID unik (contoh: "R001")
  nama: string;         // Nama resep
  kategori: string;     // Kategori masakan
  deskripsi: string;    // Deskripsi singkat
  waktuMasak: string;   // Estimasi waktu memasak
  porsi: number;        // Jumlah porsi
  kesulitan: string;    // "Mudah" | "Sedang" | "Sulit"
  waktuMakan: string[]; // Waktu makan yang cocok
  bahan: string[];      // Daftar bahan + takaran
  langkah: string[];    // Langkah-langkah memasak
  tags: string[];       // Tags untuk pencarian
}
```

### Daftar Resep

| ID | Nama | Kategori | Kesulitan | Waktu |
|----|------|----------|-----------|-------|
| R001 | Nasi Goreng Spesial | Nasi | Mudah | 20 menit |
| R002 | Rendang Daging Sapi | Lauk Pauk | Sulit | 3 jam |
| R003 | Soto Ayam | Sup & Soto | Sedang | 45 menit |
| R004 | Gado-Gado Jakarta | Sayuran | Mudah | 30 menit |
| R005 | Ayam Goreng Kremes | Lauk Pauk | Sedang | 60 menit |
| R006 | Sayur Lodeh | Sayuran | Mudah | 35 menit |
| R007 | Nasi Uduk | Nasi | Mudah | 30 menit |
| R008 | Sop Buntut | Sup & Soto | Sedang | 2 jam |
| R009 | Sambal Terasi | Sambal | Mudah | 10 menit |
| R010 | Es Cendol | Dessert | Sedang | 30 menit |
| R011 | Tempe Orek | Lauk Pauk | Mudah | 20 menit |
| R012 | Bubur Ayam | Bubur | Mudah | 40 menit |
| R013 | Sambal Matah | Sambal | Mudah | 10 menit |
| R014 | Pisang Goreng Crispy | Dessert | Mudah | 15 menit |
| R015 | Pecel Lele | Lauk Pauk | Mudah | 25 menit |

### Statistik per Kategori

| Kategori | Jumlah Resep |
|----------|-------------|
| Lauk Pauk | 4 |
| Nasi | 2 |
| Sup & Soto | 2 |
| Sayuran | 2 |
| Sambal | 2 |
| Dessert | 2 |
| Bubur | 1 |

---

## Cara Menjalankan

### Prasyarat

- Node.js ≥ 18
- npm

### Instalasi

```bash
cd server
npm install
```

### Menjalankan (Development)

```bash
cd server
npm run dev
```

Server berjalan di `http://localhost:3000`

### Menjalankan (Production)

```bash
cd server
npm start
```

### NPM Scripts

| Script | Command | Deskripsi |
|--------|---------|-----------|
| `npm start` | `npx tsx app.ts` | Jalankan server production |
| `npm run dev` | `npx tsx watch app.ts` | Jalankan server dengan auto-reload |
| `npm run mcp` | `npx tsx mcp-server.ts` | Jalankan MCP server standalone |

---

> **ResepMenu Luxe** © 2024 — Digital Recipe Concierge
