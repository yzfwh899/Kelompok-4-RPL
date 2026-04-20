# 🍽️ ResepMenu — Asisten Virtual Resep Masakan Indonesia

Chatbot asisten virtual yang membantu pengguna mencari resep masakan Indonesia, informasi bahan, kategori makanan, dan rekomendasi menu harian. Dibangun menggunakan **MCP Server**, **Ollama**, **Express.js**, dan **TypeScript**.

---

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Arsitektur](#arsitektur)
- [Fitur & Tools](#fitur--tools)
- [Tech Stack](#tech-stack)
- [Perencanaan](#perencanaan)
- [Setup Environment](#setup-environment)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Testing](#testing)
- [Struktur Folder](#struktur-folder)

---

## 📖 Tentang Proyek

**ResepMenu** adalah chatbot berbasis AI yang menggunakan arsitektur MCP (Model Context Protocol) untuk menghubungkan model bahasa (Ollama) dengan data resep masakan Indonesia. Pengguna dapat bertanya tentang:

- Mencari resep berdasarkan nama atau kategori
- Melihat bahan-bahan yang diperlukan
- Mendapatkan rekomendasi menu harian
- Melihat langkah-langkah memasak
- Mencari resep berdasarkan bahan yang tersedia

---

## 🏗️ Arsitektur

```
┌─────────────┐     HTTP      ┌─────────────┐     Stdio     ┌─────────────┐
│   Frontend   │ ──────────▶ │  Express.js  │ ──────────▶  │  MCP Server │
│  (HTML/JS)   │ ◀────────── │   (app.ts)   │ ◀────────── │ (mcp-server) │
└─────────────┘              └──────┬───────┘              └─────────────┘
                                    │
                               Ollama API
                                    │
                             ┌──────▼───────┐
                             │  LLM Model   │
                             │  (Ollama)     │
                             └──────────────┘
```

---

## 🔧 Fitur & Tools

| No | Tool Name          | Deskripsi                                      |
|----|--------------------|-------------------------------------------------|
| 1  | `cari_resep`       | Mencari resep berdasarkan nama atau kategori    |
| 2  | `lihat_bahan`      | Melihat bahan-bahan untuk resep tertentu        |
| 3  | `cari_berdasarkan_bahan` | Mencari resep berdasarkan bahan yang tersedia |
| 4  | `rekomendasi_menu` | Rekomendasi menu harian (sarapan, makan siang, makan malam) |
| 5  | `lihat_kategori`   | Menampilkan daftar kategori resep               |

---

## 🛠️ Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Node.js   | ≥ 18  | Runtime JavaScript |
| TypeScript| ^5.x  | Type-safe development |
| Express.js| ^5.x  | HTTP Server & API |
| Ollama    | -     | LLM AI Model |
| MCP SDK   | ^1.x  | Model Context Protocol |
| Zod       | ^4.x  | Schema validation |
| TailwindCSS| CDN  | Frontend styling |

---

## 📝 Perencanaan

### Phase 1 — Foundation
1. ✅ Setup environment (Node.js, TypeScript, Ollama)
2. ✅ Membuat minimal 3 tool MCP (cari_resep, lihat_bahan, cari_berdasarkan_bahan, rekomendasi_menu, lihat_kategori)
3. ✅ Membuat data dummy JSON resep masakan Indonesia
4. ✅ Membuat MCP Server dan menghubungkan dengan Ollama
5. ✅ Testing dan memperbaiki error
6. ✅ Cross-test antar kelompok

---

## ⚙️ Setup Environment

### Prasyarat
- **Node.js** ≥ 18.x → [Download](https://nodejs.org/)
- **Ollama** → [Download](https://ollama.com/)
- **Git** → [Download](https://git-scm.com/)

### Langkah Instalasi

```bash
# 1. Clone/masuk ke folder proyek
cd ResepMenu

# 2. Masuk ke folder server
cd server

# 3. Install dependencies
npm install

# 4. Pastikan Ollama sudah terinstall dan model tersedia
ollama pull llama3.2

# 5. Jalankan server
npx tsx app.ts
```

### Konfigurasi Ollama
Jika menggunakan Ollama lokal, pastikan Ollama berjalan:
```bash
ollama serve
```

Jika menggunakan Ollama cloud, sesuaikan konfigurasi di `server/app.ts`.

---

## 🚀 Menjalankan Proyek

```bash
# Terminal 1: Jalankan Ollama (jika lokal)
ollama serve

# Terminal 2: Jalankan server
cd server
npx tsx app.ts
```

Buka browser: **http://localhost:3000**

---

## 🧪 Testing

### Manual Testing
1. Buka http://localhost:3000
2. Coba tanyakan: "Cari resep nasi goreng"
3. Coba tanyakan: "Apa bahan-bahan untuk rendang?"
4. Coba tanyakan: "Rekomendasikan menu makan siang"
5. Coba tanyakan: "Resep apa saja yang menggunakan ayam?"

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Cross-Test
- Pastikan frontend dan backend terintegrasi dengan baik
- Test semua 5 tools melalui chatbot
- Verifikasi respons dari Ollama sesuai dengan data

---

## 📁 Struktur Folder

```
ResepMenu/
├── README.md                  # Dokumentasi utama
├── server/
│   ├── README.md              # Dokumentasi server
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── app.ts                 # Express server + Ollama
│   ├── mcp-server.ts          # MCP Server + Tools
│   └── data/
│       └── resep.json         # Data dummy resep
├── frontend/
│   ├── README.md              # Dokumentasi frontend
│   └── index.html             # UI Chatbot
└── docs/
    └── tools.md               # Dokumentasi tools
```

---

## 👥 Tim

Proyek ini dibuat sebagai tugas kelompok untuk mempelajari arsitektur MCP Server dan integrasi AI.

---

## 📄 Lisensi

MIT License © 2025
<<<<<<< HEAD
=======
"# ResepMakan-Project" 
>>>>>>> 30758d103545b4b5a9397bdcacc4c3077f183581
