import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = "/Users/seb/Documents/GitHub/sebastian-olascoaga.github.io/.claude/worktrees/charming-heisenberg-2fdf70";
const port = process.env.PORT || 8765;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".md":   "text/markdown; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
};

createServer(async (req, res) => {
  try {
    let url = decodeURIComponent(req.url.split("?")[0]);
    if (url.endsWith("/")) url += "index.html";
    const filePath = normalize(join(root, url));
    if (!filePath.startsWith(root)) { res.writeHead(403); res.end("forbidden"); return; }
    const s = await stat(filePath).catch(() => null);
    if (!s || s.isDirectory()) { res.writeHead(404); res.end("not found"); return; }
    const buf = await readFile(filePath);
    res.writeHead(200, { "content-type": types[extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(buf);
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
}).listen(port, () => console.log(`preview server on http://localhost:${port}`));
