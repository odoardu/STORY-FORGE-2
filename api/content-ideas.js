import snapshot from "../data/content-ideas.json" with { type: "json" };
import { fetchContentIdeas } from "../lib/content-ideas.mjs";

export default async function handler(req, res) {
  const reply = (code, data) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
  };
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return reply(405, { error: "Método não permitido." });
  }
  try {
    const data = await fetchContentIdeas({ key: process.env.TRELLO_API_KEY, token: process.env.TRELLO_TOKEN });
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=60");
    return reply(200, data);
  } catch (error) {
    const syncStatus = error.message === "not-configured" ? "not-configured" : "unavailable";
    // Log a fixed code only: upstream errors can contain credential-bearing URLs.
    if (syncStatus === "unavailable") console.error("content-ideas: Trello connection failed");
    return reply(200, { ...snapshot, mode: "snapshot", syncStatus });
  }
}
