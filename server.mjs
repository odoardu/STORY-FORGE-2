import { createServer } from "node:http";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const preferredPort = Number(process.env.PORT || 4173);
const exportsDir = join(root, "exports");
const logosDir = join(root, "assets", "logos");
const textureDirs = [join(root, "assets", "textures"), join(root, "assets", "texture")];
const logoExtensions = new Set([".svg", ".png"]);
const textureExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
  [".otf", "font/otf"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
]);

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const cleanPath = decoded === "/" ? "/index.html" : decoded;
  const absolute = normalize(join(root, cleanPath));
  if (!absolute.startsWith(root)) return null;
  return absolute;
}

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "x-frame-options": "SAMEORIGIN",
    "referrer-policy": "strict-origin-when-cross-origin",
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), "application/json; charset=utf-8");
}

function sanitizeFileName(name) {
  const fallback = `story-lpz-zero-${Date.now()}.png`;
  const raw = String(name || fallback);
  const extensionMatch = raw.match(/\.(png|mp4|webm)$/i);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "png";
  const clean = raw
    .replace(/\.(png|mp4|webm)$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${clean || "story-lpz-zero"}.${extension}`;
}

function readRequestBody(req, limit = 60 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function uniqueExportPath(fileName) {
  const extension = extname(fileName).toLowerCase();
  const parsed = fileName.slice(0, -extension.length);
  let candidate = join(exportsDir, `${parsed}${extension}`);
  let index = 2;

  while (true) {
    try {
      await stat(candidate);
      candidate = join(exportsDir, `${parsed}-${index}${extension}`);
      index += 1;
    } catch {
      return candidate;
    }
  }
}

async function saveExport(req, res) {
  try {
    const body = await readRequestBody(req);
    if (!body.length) {
      sendJson(res, 400, { ok: false, error: "Arquivo vazio" });
      return;
    }

    await mkdir(exportsDir, { recursive: true });
    const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
    const fileName = sanitizeFileName(requestUrl.searchParams.get("filename"));
    const filePath = await uniqueExportPath(fileName);
    await writeFile(filePath, body);

    sendJson(res, 200, {
      ok: true,
      fileName: filePath.split(/[\\/]/).pop(),
      path: filePath,
      folder: exportsDir,
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || "Erro ao salvar arquivo" });
  }
}

async function listLogos(res) {
  try {
    await mkdir(logosDir, { recursive: true });
    const entries = await readdir(logosDir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const extension = extname(entry.name).toLowerCase();
      if (!logoExtensions.has(extension)) continue;

      const filePath = join(logosDir, entry.name);
      const info = await stat(filePath);
      files.push({
        name: entry.name,
        path: `/assets/logos/${encodeURIComponent(entry.name)}`,
        size: info.size,
      });
    }

    files.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    sendJson(res, 200, { ok: true, files });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || "Erro ao listar logos" });
  }
}

async function listTextures(res) {
  try {
    const files = [];

    for (const textureDir of textureDirs) {
      await mkdir(textureDir, { recursive: true });
      const entries = await readdir(textureDir, { withFileTypes: true });
      const relativeDir = textureDir === textureDirs[1] ? "texture" : "textures";

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const extension = extname(entry.name).toLowerCase();
        if (!textureExtensions.has(extension)) continue;

        const filePath = join(textureDir, entry.name);
        const info = await stat(filePath);
        files.push({
          name: entry.name,
          path: `/assets/${relativeDir}/${encodeURIComponent(entry.name)}`,
          size: info.size,
        });
      }
    }

    files.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    sendJson(res, 200, { ok: true, files });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || "Erro ao listar texturas" });
  }
}

async function randomFeedImage(req, res) {
  try {
    const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
    const seed = (requestUrl.searchParams.get("seed") || String(Date.now())).slice(0, 200);
    const imageUrl = `https://picsum.photos/1080/1350?random=${encodeURIComponent(seed)}`;
    const response = await fetch(imageUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Imagem externa respondeu ${response.status}`);
    }

    const body = Buffer.from(await response.arrayBuffer());
    res.writeHead(200, {
      "content-type": response.headers.get("content-type") || "image/jpeg",
      "content-length": body.length,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "x-frame-options": "SAMEORIGIN",
      "referrer-policy": "strict-origin-when-cross-origin",
    });
    res.end(body);
  } catch (error) {
    sendJson(res, 502, { ok: false, error: error.message || "Erro ao buscar imagem aleatoria" });
  }
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && (req.url || "").startsWith("/api/logos")) {
    await listLogos(res);
    return;
  }

  if (req.method === "GET" && (req.url || "").startsWith("/api/textures")) {
    await listTextures(res);
    return;
  }

  if (req.method === "GET" && (req.url || "").startsWith("/api/random-feed-image")) {
    await randomFeedImage(req, res);
    return;
  }

  if (
    req.method === "POST" &&
    ((req.url || "").startsWith("/api/save-png") || (req.url || "").startsWith("/api/save-export"))
  ) {
    await saveExport(req, res);
    return;
  }

  const filePath = safePath(req.url || "/");
  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    res.writeHead(200, {
      "content-type": mime.get(extname(filePath).toLowerCase()) || "application/octet-stream",
      "content-length": info.size,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "x-frame-options": "SAMEORIGIN",
      "referrer-policy": "strict-origin-when-cross-origin",
    });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    if (filePath.endsWith("index.html")) {
      send(res, 500, "Missing index.html");
      return;
    }

    try {
      const html = await readFile(join(root, "index.html"));
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(html);
    } catch {
      send(res, 404, "Not found");
    }
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    server.listen(0, "127.0.0.1");
    return;
  }
  throw error;
});

server.listen(preferredPort, "127.0.0.1", () => {
  const address = server.address();
  console.log(`LPZ Zero Story Maker: http://127.0.0.1:${address.port}`);
});
