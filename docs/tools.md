# 🔧 ResepMenu — Dokumentasi Tools MCP

## Daftar Tools

ResepMenu menyediakan 5 tools MCP yang dapat diakses oleh model AI untuk mengambil data resep masakan.

---

### Tool 1: `cari_resep`

**Deskripsi:** Mencari resep masakan berdasarkan nama atau kategori.

**Parameter:**
| Nama | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `query` | string | ✅ | Nama resep atau kategori yang dicari |

**Contoh Penggunaan:**
- User: "Cari resep nasi goreng"
- User: "Resep apa saja yang ada di kategori sup?"
- User: "Ada resep rendang tidak?"

**Contoh Response:**
```
Ditemukan 1 resep:
• Nasi Goreng Spesial | Kategori: Nasi | Waktu: 20 menit | Porsi: 2 | Kesulitan: Mudah
```

---

### Tool 2: `lihat_bahan`

**Deskripsi:** Menampilkan bahan-bahan yang diperlukan untuk resep tertentu.

**Parameter:**
| Nama | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `namaResep` | string | ✅ | Nama resep |

**Contoh Penggunaan:**
- User: "Apa bahan-bahan untuk rendang?"
- User: "Bahan soto ayam apa saja?"

**Contoh Response:**
```
Bahan untuk Nasi Goreng Spesial:
• 2 piring nasi putih dingin
• 3 butir telur
• 5 siung bawang merah
• 3 siung bawang putih
• 2 sdm kecap manis
• 1 sdm minyak goreng
• Garam secukupnya
```

---

### Tool 3: `cari_berdasarkan_bahan`

**Deskripsi:** Mencari resep yang bisa dimasak dari bahan yang tersedia.

**Parameter:**
| Nama | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `bahan` | string | ✅ | Bahan yang tersedia (pisahkan dengan koma) |

**Contoh Penggunaan:**
- User: "Saya punya ayam, bawang, dan tomat. Bisa masak apa?"
- User: "Bahan yang ada: tahu, tempe, cabai"

**Contoh Response:**
```
Resep yang bisa dibuat dengan bahan Anda:
• Ayam Goreng Kremes (cocok 3/5 bahan)
• Soto Ayam (cocok 2/5 bahan)
```

---

### Tool 4: `rekomendasi_menu`

**Deskripsi:** Memberikan rekomendasi menu harian berdasarkan waktu makan.

**Parameter:**
| Nama | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `waktu` | string | ❌ | Waktu makan: sarapan, makan siang, makan malam |

**Contoh Penggunaan:**
- User: "Rekomendasikan menu sarapan"
- User: "Menu makan malam apa yang enak?"

**Contoh Response:**
```
Rekomendasi Menu Sarapan:
• Nasi Uduk — Nasi | 30 menit | Mudah
• Bubur Ayam — Bubur | 40 menit | Mudah
```

---

### Tool 5: `lihat_kategori`

**Deskripsi:** Menampilkan semua kategori resep yang tersedia.

**Parameter:** Tidak ada

**Contoh Penggunaan:**
- User: "Kategori resep apa saja yang tersedia?"
- User: "Tampilkan semua jenis masakan"

**Contoh Response:**
```
Kategori Resep:
• Nasi (3 resep)
• Sup & Soto (2 resep)
• Lauk Pauk (4 resep)
• Sayuran (2 resep)
• Dessert (2 resep)
• Sambal (2 resep)
```

---

## Alur Kerja Tools

```
User bertanya → Ollama memilih tool → MCP Server menjalankan tool
                                          ↓
                                   Data dari resep.json
                                          ↓
                               Hasil dikirim ke Ollama
                                          ↓
                           Ollama merangkum jawaban → User
```

---

## Catatan Penting

1. Semua tool menggunakan **Zod** untuk validasi parameter
2. Data bersumber dari file `data/resep.json` (dummy data)
3. Tool bersifat **read-only** — tidak mengubah data
4. Setiap tool mengembalikan response dalam format MCP `{ content: [{ type: "text", text: "..." }] }`
