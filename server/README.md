# 🖥️ ResepMenu — Server Documentation

## Overview

Server backend terdiri dari dua komponen utama:
1. **`app.ts`** — Express HTTP Server yang menjadi jembatan antara frontend, Ollama (LLM), dan MCP Server
2. **`mcp-server.ts`** — MCP Server yang menyediakan tools untuk mengakses data resep masakan

---

## Arsitektur Server

```
Frontend (HTTP) → app.ts (Express) → Ollama (LLM)
                                    ↕
                              mcp-server.ts (MCP Tools)
                                    ↕
                              data/resep.json (Data)
```

---

## API Endpoints

### POST `/api/chat`
Mengirim pesan dan menerima respons dari AI.

**Request Body:**
```json
{
  "message": "Cari resep nasi goreng",
  "sessionId": "default"
}
```

**Response:**
```json
{
  "reply": "Berikut resep nasi goreng yang saya temukan...",
  "sessionId": "default"
}
```

### POST `/api/reset`
Reset sesi chat.

**Request Body:**
```json
{
  "sessionId": "default"
}
```

### GET `/api/health`
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

### 1. `cari_resep`
Mencari resep berdasarkan nama atau kategori.
- **Parameter:** `query` (string) — Nama resep atau kategori
- **Contoh:** `"nasi goreng"`, `"sup"`, `"dessert"`

### 2. `lihat_bahan`
Menampilkan daftar bahan-bahan untuk resep tertentu.
- **Parameter:** `namaResep` (string) — Nama resep yang ingin dilihat bahannya
- **Contoh:** `"rendang"`, `"soto ayam"`

### 3. `cari_berdasarkan_bahan`
Mencari resep yang bisa dibuat dari bahan yang tersedia.
- **Parameter:** `bahan` (string) — Bahan yang tersedia (pisahkan dengan koma)
- **Contoh:** `"ayam, bawang, tomat"`

### 4. `rekomendasi_menu`
Mendapatkan rekomendasi menu harian.
- **Parameter:** `waktu` (string, optional) — Waktu makan (sarapan/makan siang/makan malam)
- **Contoh:** `"sarapan"`, `"makan siang"`

### 5. `lihat_kategori`
Menampilkan semua kategori resep yang tersedia.
- **Parameter:** Tidak ada

---

## Setup & Run

```bash
# Install dependencies
npm install

# Run server
npx tsx app.ts

# Server berjalan di http://localhost:3000
```

---

## Dependencies

| Package | Kegunaan |
|---------|----------|
| `express` | HTTP server |
| `cors` | Cross-Origin Resource Sharing |
| `ollama` | Koneksi ke Ollama LLM |
| `@modelcontextprotocol/sdk` | MCP protocol |
| `zod` | Schema validation |
| `tsx` | TypeScript executor |
| `typescript` | TypeScript compiler |

---

## Environment Variables

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| PORT | 3000 | Port server |
| OLLAMA_HOST | http://localhost:11434 | URL Ollama |
| OLLAMA_MODEL | llama3.2 | Model yang digunakan |
