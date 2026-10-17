import test from "node:test";
import assert from "node:assert/strict";
import { fetchContentIdeas } from "../lib/content-ideas.mjs";
import handler from "../api/content-ideas.js";

const inbox = "6ac7a66a2ec9c31b1d772929";
const dates = "6ac7a66d799cc0c69e50c32d";
const now = new Date("2026-10-17T15:00:00Z");
const card = (idList, extra = {}) => ({ idList, name: "Pauta", desc: "Fonte https://linkinpark.com", url: "https://trello.com/c/abcd1234/pauta", dateLastActivity: now.toISOString(), ...extra });

test("publishes only approved open lists and selected editorial fields", async () => {
  const calls = [];
  const data = await fetchContentIdeas({ key: "test-key", token: "test-token", now, fetcher: async (url, options) => {
    calls.push({ url: String(url), options });
    return { ok: true, json: async () => url.pathname.endsWith("/lists") ? [
      { id: inbox, name: "💡 IDEIAS / INBOX" },
      { id: dates, name: "📁 DATAS PASSADAS" },
      { id: "private", name: "💡 IDEIAS / INBOX" },
    ] : [
      card(inbox, { members: ["private"], comments: ["secret"] }),
      card(dates), card("private"), card(inbox, { closed: true }),
      card(inbox, { url: "javascript:alert(1)" }),
    ] };
  } });
  assert.equal(data.mode, "live");
  assert.equal(data.cards.length, 1);
  assert.equal(data.cards[0].list, "💡 IDEIAS / INBOX");
  assert.equal(data.cards[0].members, undefined);
  assert.equal(data.cards[0].comments, undefined);
  assert.equal(data.importedAt, now.toISOString());
  for (const call of calls) {
    assert.ok(!call.url.includes("test-key") && !call.url.includes("test-token"));
    assert.ok(call.options.headers.Authorization.includes("test-token"));
  }
});

test("missing credentials never makes an unauthenticated request", async () => {
  await assert.rejects(fetchContentIdeas({ fetcher: () => assert.fail("must not fetch") }), /not-configured/);
});

test("upstream failures and malformed responses do not become an empty successful sync", async () => {
  await assert.rejects(fetchContentIdeas({ key: "a", token: "b", fetcher: async () => ({ ok: false, status: 401 }) }), /trello-401/);
  await assert.rejects(fetchContentIdeas({ key: "a", token: "b", fetcher: async () => ({ ok: true, json: async () => ({ error: "bad" }) }) }), /invalid-response/);
});

test("an empty Trello list clears previous suggestions", async () => {
  const result = await fetchContentIdeas({ key: "a", token: "b", fetcher: async () => ({ ok: true, json: async () => [] }) });
  assert.equal(result.mode, "live");
  assert.deepEqual(result.cards, []);
});

test("API fallback preserves snapshot date and does not claim a live sync", async () => {
  const originalKey = process.env.TRELLO_API_KEY;
  delete process.env.TRELLO_API_KEY;
  try {
    const headers = {}; let body;
    const res = { setHeader: (key, value) => headers[key] = value, end: value => body = JSON.parse(value) };
    await handler({ method: "GET" }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(body.mode, "snapshot");
    assert.equal(body.syncStatus, "not-configured");
    assert.ok(body.importedAt);
    assert.equal(headers["Cache-Control"], "no-store");
    assert.equal(headers["Vercel-CDN-Cache-Control"], undefined);
    assert.ok(!JSON.stringify(body).includes("oauth_token"));
    await handler({ method: "POST" }, res);
    assert.equal(res.statusCode, 405);
    assert.equal(headers.Allow, "GET");
  } finally {
    if (originalKey !== undefined) process.env.TRELLO_API_KEY = originalKey;
  }
});
