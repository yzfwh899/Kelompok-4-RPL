// server/app.ts
import express from "express";
import cors from "cors";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Ollama } from "ollama";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();
app.use(cors());
app.use(express.json());

// ==== LOAD DATA RESEP ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataResep: any[] = JSON.parse(
  readFileSync(join(__dirname, "data", "resep.json"), "utf-8")
);

// ==== KONFIGURASI OLLAMA ====
const OLLAMA_API_KEY = "506ba059e911437ba50d0f426e10c32f.OQDUc3KmE6JNtkFhRSoecjzJ"; // <-- Ganti dengan API key Anda
const ollama = new Ollama({
  host: "https://ollama.com",
  headers: { Authorization: `Bearer ${OLLAMA_API_KEY}` },
});
const MODEL = "gpt-oss:120b"; // Cloud model

let mcpClient: Client;
let mcpTools: any[] = [];

// -------------------------------------------------
// 1️⃣ Koneksi ke MCP Server saat startup
// -------------------------------------------------
async function connectMCP() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "mcp-server.ts"],
  });

  mcpClient = new Client({ name: "resep-menu", version: "1.0.0" });
  await mcpClient.connect(transport);

  const { tools } = await mcpClient.listTools();
  mcpTools = tools;
  console.log(
    "✅ MCP Server terhubung! Tools:",
    tools.map((t) => t.name).join(", ")
  );
}

// -------------------------------------------------
// 2️⃣ Ubah format tool agar kompatibel dengan Ollama
// -------------------------------------------------
function mcpToolsToOllamaFormat() {
  return mcpTools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));
}

// -------------------------------------------------
// 3️⃣ Penyimpanan riwayat chat per sesi
// -------------------------------------------------
const chatSessions: Map<string, any[]> = new Map();
function getSession(sessionId: string) {
  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, [
      {
        role: "system",
        content: `Kamu adalah asisten virtual ResepMenu — ahli memasak masakan Indonesia.
Kamu membantu pengguna mencari resep, bahan-bahan, langkah memasak, dan rekomendasi menu.
Jawab dengan ramah, sopan, dan dalam Bahasa Indonesia.
Jika tidak tahu jawabannya, katakan dengan jujur.
Gunakan tools yang tersedia untuk mengambil data resep.
Berikan jawaban yang informatif dan menarik tentang masakan Indonesia.`,
      },
    ]);
  }
  return chatSessions.get(sessionId)!;
}

// -------------------------------------------------
// 4️⃣ API: /api/chat – menangani percakapan
// -------------------------------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    const messages = getSession(sessionId);

    // Tambah pesan user
    messages.push({ role: "user", content: message });

    // Kirim ke Ollama (bersama tools)
    let response = await ollama.chat({
      model: MODEL,
      messages: messages,
      tools: mcpToolsToOllamaFormat(),
    });

    // Jika Ollama meminta tool, panggil MCP dan kirim kembali
    while (
      response.message.tool_calls &&
      response.message.tool_calls.length > 0
    ) {
      // Simpan respons yang mengandung tool_calls
      messages.push(response.message);

      for (const toolCall of response.message.tool_calls) {
        console.log(
          `🔧 Memanggil tool: ${toolCall.function.name}`,
          toolCall.function.arguments
        );
        const result = await mcpClient.callTool({
          name: toolCall.function.name,
          arguments: toolCall.function.arguments,
        });
        const resultText = (result.content as any[])
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text)
          .join("\n");
        // Kirim hasil tool kembali ke Ollama
        messages.push({ role: "tool", content: resultText });
        console.log(`✅ Hasil tool:`, resultText.substring(0, 100) + "...");
      }

      // Kirim ulang (setelah semua tool selesai) untuk dapatkan jawaban akhir
      response = await ollama.chat({
        model: MODEL,
        messages: messages,
        tools: mcpToolsToOllamaFormat(),
      });
    }

    // Simpan jawaban akhir
    messages.push(response.message);
    res.json({ reply: response.message.content, sessionId });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan: " + error.message });
  }
});

// -------------------------------------------------
// 5️⃣ API: /api/reset – reset sesi chat
// -------------------------------------------------
app.post("/api/reset", (req, res) => {
  const { sessionId = "default" } = req.body;
  chatSessions.delete(sessionId);
  res.json({ message: "Sesi chat direset." });
});

// -------------------------------------------------
// 6️⃣ API: /api/resep – search & filter resep
// -------------------------------------------------
app.get("/api/resep", (req, res) => {
  const q = (req.query.q as string || "").toLowerCase().trim();
  const kategori = (req.query.kategori as string || "").toLowerCase().trim();
  const kesulitan = (req.query.kesulitan as string || "").toLowerCase().trim();
  const waktuMakan = (req.query.waktuMakan as string || "").toLowerCase().trim();

  let hasil = dataResep;

  if (q) {
    hasil = hasil.filter(
      (r) =>
        r.nama.toLowerCase().includes(q) ||
        r.deskripsi.toLowerCase().includes(q) ||
        r.tags.some((t: string) => t.toLowerCase().includes(q)) ||
        r.bahan.some((b: string) => b.toLowerCase().includes(q))
    );
  }
  if (kategori) {
    hasil = hasil.filter((r) => r.kategori.toLowerCase() === kategori);
  }
  if (kesulitan) {
    hasil = hasil.filter((r) => r.kesulitan.toLowerCase() === kesulitan);
  }
  if (waktuMakan) {
    hasil = hasil.filter((r) =>
      r.waktuMakan.some((wm: string) => wm.toLowerCase().includes(waktuMakan))
    );
  }

  res.json({ total: hasil.length, resep: hasil });
});

// -------------------------------------------------
// 7️⃣ API: /api/resep/filters – available filter options
// -------------------------------------------------
app.get("/api/resep/filters", (_req, res) => {
  const kategoriSet = new Set<string>();
  const kesulitanSet = new Set<string>();
  const waktuMakanSet = new Set<string>();

  dataResep.forEach((r) => {
    kategoriSet.add(r.kategori);
    kesulitanSet.add(r.kesulitan);
    r.waktuMakan.forEach((wm: string) => waktuMakanSet.add(wm));
  });

  res.json({
    kategori: Array.from(kategoriSet).sort(),
    kesulitan: Array.from(kesulitanSet),
    waktuMakan: Array.from(waktuMakanSet).sort(),
  });
});

// -------------------------------------------------
// 8️⃣ API: /api/health – health check
// -------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mcpConnected: !!mcpClient,
    toolsAvailable: mcpTools.map((t) => t.name),
  });
});

// -------------------------------------------------
// 7️⃣ Serves frontend static files
// -------------------------------------------------
app.use(express.static("../frontend"));

// -------------------------------------------------
// 8️⃣ Start server
// -------------------------------------------------
const PORT = 3000;
connectMCP()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `\n🍳 ResepMenu Chatbot berjalan di http://localhost:${PORT}`
      );
      console.log(`📡 API tersedia di http://localhost:${PORT}/api/chat`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke MCP Server:", err);
    process.exit(1);
  });
