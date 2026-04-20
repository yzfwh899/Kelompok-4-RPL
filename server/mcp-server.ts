// server/mcp-server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ==========================================
// LOAD DATA RESEP DARI JSON
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataResep = JSON.parse(
  readFileSync(join(__dirname, "data", "resep.json"), "utf-8")
);

// ==========================================
// TIPE DATA
// ==========================================
interface Resep {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  waktuMasak: string;

  porsi: number;
  kesulitan: string;
  waktuMakan: string[];
  bahan: string[];
  langkah: string[];
  tags: string[];
}

const resepList: Resep[] = dataResep;

// ==========================================
// INISIALISASI MCP SERVER
// ==========================================
const server = new McpServer({
  name: "mcp-server-resep-menu",
  version: "1.0.0",
});

// ---- TOOL 1: Cari Resep ----
server.tool(
  "cari_resep",
  "Mencari resep masakan berdasarkan nama atau kategori. Gunakan tool ini ketika user bertanya tentang resep tertentu atau ingin mencari resep.",
  { query: z.string().describe("Nama resep atau kategori (contoh: nasi goreng, sup, dessert)") },
  async ({ query }) => {
    const q = query.toLowerCase();
    const hasil = resepList.filter(
      (r) =>
        r.nama.toLowerCase().includes(q) ||
        r.kategori.toLowerCase().includes(q) ||
        r.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    if (hasil.length === 0) {
      return {
        content: [{ type: "text", text: `Resep "${query}" tidak ditemukan.` }],
      };
    }
    const teks = hasil
      .map(
        (r) =>
          `• ${r.nama} | Kategori: ${r.kategori} | Waktu: ${r.waktuMasak} | Porsi: ${r.porsi} | Kesulitan: ${r.kesulitan}\n  ${r.deskripsi}`
      )
      .join("\n\n");
    return {
      content: [
        { type: "text", text: `Ditemukan ${hasil.length} resep:\n\n${teks}` },
      ],
    };
  }
);

// ---- TOOL 2: Lihat Bahan ----
server.tool(
  "lihat_bahan",
  "Menampilkan daftar bahan-bahan dan langkah memasak untuk resep tertentu. Gunakan tool ini ketika user ingin tahu bahan atau cara memasak suatu resep.",
  {
    namaResep: z
      .string()
      .describe("Nama resep yang ingin dilihat bahannya (contoh: rendang, soto ayam)"),
  },
  async ({ namaResep }) => {
    const q = namaResep.toLowerCase();
    const resep = resepList.find((r) => r.nama.toLowerCase().includes(q));
    if (!resep) {
      return {
        content: [
          { type: "text", text: `Resep "${namaResep}" tidak ditemukan.` },
        ],
      };
    }
    const bahanTeks = resep.bahan.map((b) => `• ${b}`).join("\n");
    const langkahTeks = resep.langkah
      .map((l, i) => `${i + 1}. ${l}`)
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: `📖 ${resep.nama}\n${resep.deskripsi}\n\n🛒 Bahan-bahan (${resep.porsi} porsi):\n${bahanTeks}\n\n👨‍🍳 Langkah Memasak:\n${langkahTeks}\n\n⏱️ Waktu: ${resep.waktuMasak} | Kesulitan: ${resep.kesulitan}`,
        },
      ],
    };
  }
);

// ---- TOOL 3: Cari Berdasarkan Bahan ----
server.tool(
  "cari_berdasarkan_bahan",
  "Mencari resep yang bisa dimasak berdasarkan bahan yang dimiliki user. Gunakan tool ini ketika user menyebutkan bahan-bahan yang mereka punya dan ingin tahu bisa masak apa.",
  {
    bahan: z
      .string()
      .describe(
        "Bahan-bahan yang tersedia, pisahkan dengan koma (contoh: ayam, bawang, tomat)"
      ),
  },
  async ({ bahan }) => {
    const bahanList = bahan
      .toLowerCase()
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const hasil = resepList
      .map((r) => {
        const matchCount = bahanList.filter((b) =>
          r.tags.some((tag) => tag.includes(b)) ||
          r.bahan.some((rb) => rb.toLowerCase().includes(b))
        ).length;
        return { resep: r, matchCount };
      })
      .filter((h) => h.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    if (hasil.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `Tidak ditemukan resep yang cocok dengan bahan: ${bahan}`,
          },
        ],
      };
    }

    const teks = hasil
      .map(
        (h) =>
          `• ${h.resep.nama} (cocok ${h.matchCount}/${bahanList.length} bahan) | ${h.resep.kategori} | ${h.resep.waktuMasak}`
      )
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: `Resep yang bisa dibuat dengan bahan Anda (${bahan}):\n\n${teks}`,
        },
      ],
    };
  }
);

// ---- TOOL 4: Rekomendasi Menu ----
server.tool(
  "rekomendasi_menu",
  "Memberikan rekomendasi menu harian berdasarkan waktu makan (sarapan, makan siang, makan malam). Gunakan tool ini ketika user minta rekomendasi atau saran menu.",
  {
    waktu: z
      .string()
      .optional()
      .describe(
        "Waktu makan: sarapan, makan siang, makan malam. Kosongkan untuk semua."
      ),
  },
  async ({ waktu }) => {
    if (waktu) {
      const w = waktu.toLowerCase();
      const hasil = resepList.filter((r) =>
        r.waktuMakan.some((wm) => wm.includes(w))
      );
      if (hasil.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Tidak ada rekomendasi untuk waktu: ${waktu}`,
            },
          ],
        };
      }
      // Ambil random 3 rekomendasi
      const shuffled = hasil.sort(() => 0.5 - Math.random());
      const rekomendasi = shuffled.slice(0, 3);
      const teks = rekomendasi
        .map(
          (r) =>
            `• ${r.nama} — ${r.kategori} | ${r.waktuMasak} | ${r.kesulitan}\n  ${r.deskripsi}`
        )
        .join("\n\n");
      return {
        content: [
          {
            type: "text",
            text: `🍽️ Rekomendasi Menu ${waktu.charAt(0).toUpperCase() + waktu.slice(1)}:\n\n${teks}`,
          },
        ],
      };
    }

    // Jika tidak ada waktu, tampilkan rekomendasi untuk semua waktu
    const waktuList = ["sarapan", "makan siang", "makan malam"];
    const hasil = waktuList
      .map((w) => {
        const resepWaktu = resepList.filter((r) =>
          r.waktuMakan.some((wm) => wm.includes(w))
        );
        const pick =
          resepWaktu[Math.floor(Math.random() * resepWaktu.length)];
        return `🕐 ${w.charAt(0).toUpperCase() + w.slice(1)}: ${pick.nama} (${pick.kategori} — ${pick.waktuMasak})`;
      })
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: `🍽️ Rekomendasi Menu Harian:\n\n${hasil}`,
        },
      ],
    };
  }
);

// ---- TOOL 5: Lihat Kategori ----
server.tool(
  "lihat_kategori",
  "Menampilkan semua kategori resep yang tersedia beserta jumlah resep di setiap kategori. Gunakan tool ini ketika user bertanya tentang kategori atau jenis masakan apa saja yang tersedia.",
  {},
  async () => {
    const kategoriMap = new Map<string, number>();
    resepList.forEach((r) => {
      kategoriMap.set(r.kategori, (kategoriMap.get(r.kategori) || 0) + 1);
    });

    const teks = Array.from(kategoriMap.entries())
      .map(([kategori, jumlah]) => `• ${kategori} (${jumlah} resep)`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `📂 Kategori Resep yang Tersedia:\n\n${teks}\n\nTotal: ${resepList.length} resep`,
        },
      ],
    };
  }
);

// ---- JALANKAN SERVER ----
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🍳 MCP Server Resep Menu aktif!");
}

main().catch(console.error);
