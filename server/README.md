# Server ResepMakan

Server MCP (Model Context Protocol) berbasis TypeScript untuk mengelola dan menyajikan data resep Indonesia dengan pencarian resep bertenaga AI dan rekomendasi.

## Gambaran Umum

Server ini menyediakan API backend dan alat MCP untuk menangani manajemen resep masakan Indonesia. Server ini terintegrasi dengan Ollama untuk fitur bertenaga AI dan mengekspos alat terkait resep melalui Model Context Protocol.

## Struktur Proyek

```
server/
├── app.ts              # Express server - Aplikasi API utama
├── mcp-server.ts       # Implementasi MCP server - Alat untuk operasi resep
├── package.json        # Dependensi proyek dan skrip
├── tsconfig.json       # Konfigurasi TypeScript
├── data/
│   └── resep.json      # Database resep (format JSON)
└── README.md           # File ini
```

## Fitur

- **Pencarian Resep**: Cari resep berdasarkan nama atau kategori
- **Penyaringan Resep**: Saring resep berdasarkan tingkat kesulitan, waktu memasak, jenis makanan
- **Integrasi AI**: Didukung oleh Ollama untuk rekomendasi resep yang cerdas
- **Alat MCP**: Mengekspos alat resep melalui Model Context Protocol
- **Dukungan CORS**: Memungkinkan permintaan lintas asal
- **API RESTful**: Titik akhir HTTP berbasis Express.js

## Prasyarat

- Node.js (ES2022+)
- npm atau yarn
- Ollama (untuk fitur AI)
- TypeScript 5.9+

## Instalasi

1. Navigasikan ke direktori server:
   ```bash
   cd server
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

## Skrip yang Tersedia

### `npm start`
Menjalankan server Express dalam mode produksi.
```bash
npm start
```

### `npm run dev`
Menjalankan server dalam mode pengembangan dengan reload otomatis menggunakan `tsx watch`.
```bash
npm run dev
```

### `npm run mcp`
Memulai server MCP.
```bash
npm run mcp
```

## Konfigurasi

### Pengaturan Ollama

Server menggunakan Ollama untuk interaksi model AI. Perbarui konfigurasi di `app.ts`:

```typescript
const OLLAMA_API_KEY = "kunci-api-anda-di-sini";
const MODEL = "gpt-oss:120b"; // Model cloud
```

Ganti kunci API dengan kredensial Ollama Anda yang sebenarnya.

## Dependensi

### Dependensi Inti
- **express** (^5.2.1): Framework web untuk REST API
- **cors** (^2.8.6): Middleware Cross-Origin Resource Sharing
- **@modelcontextprotocol/sdk** (^1.27.1): Implementasi protokol MCP
- **ollama** (^0.6.3): Klien model AI Ollama
- **zod** (^4.3.6): Validasi skema pertama TypeScript

### Dependensi Pengembangan
- **typescript** (^5.9.3): Kompiler TypeScript
- **tsx** (^4.21.0): Eksekusi TypeScript dan mode watch
- **@types/express** (^5.0.6): Definisi tipe Express
- **@types/cors** (^2.8.19): Definisi tipe CORS
- **@types/node** (^25.3.3): Definisi tipe Node.js

## Format Data

Resep disimpan di `data/resep.json` dengan struktur berikut:

```json
{
  "id": "R001",
  "nama": "Nasi Goreng Spesial",
  "kategori": "Nasi",
  "deskripsi": "Deskripsi resep",
  "waktuMasak": "20 menit",
  "porsi": 2,
  "kesulitan": "Mudah",
  "waktuMakan": ["sarapan", "makan siang", "makan malam"],
  "bahan": ["bahan1", "bahan2"],
  "langkah": ["langkah1", "langkah2"],
  "tags": ["tag1", "tag2"]
}
```

### Deskripsi Bidang
- **id**: Pengenal resep unik
- **nama**: Nama resep
- **kategori**: Kategori resep (misalnya, Nasi, Sup, Dessert)
- **deskripsi**: Deskripsi singkat
- **waktuMasak**: Waktu memasak
- **porsi**: Jumlah porsi
- **kesulitan**: Tingkat kesulitan (Mudah, Sedang, Sulit)
- **waktuMakan**: Waktu makan (sarapan, makan siang, makan malam)
- **bahan**: Daftar bahan
- **langkah**: Instruksi memasak langkah demi langkah
- **tags**: Tag resep untuk kategorisasi

## Alat MCP

Server mengekspos alat manajemen resep melalui Model Context Protocol:

- **cari_resep**: Cari resep berdasarkan nama atau kategori
- Alat tambahan untuk penyaringan resep dan rekomendasi

## Arsitektur

### app.ts
- Menginisialisasi server Express
- Terhubung ke server MCP
- Memuat data resep dari `resep.json`
- Mengonfigurasi model AI Ollama
- Menangani rute API dan middleware

### mcp-server.ts
- Mengimplementasikan antarmuka server MCP
- Mendefinisikan alat terkait resep
- Memuat dan mengelola database resep
- Menangani eksekusi alat dan validasi dengan skema Zod

## Catatan Pengembangan

- Menggunakan modul ES (`"type": "module"` di package.json)
- Konfigurasi TypeScript ketat diaktifkan
- Dikompilasi ke target ES2022
- Direktori output: `./dist`

## Lisensi

Lihat file LISENSI proyek root.
