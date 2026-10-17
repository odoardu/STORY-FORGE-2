// Only these editorial lists are allowed onto the public website.
const BOARD = "6aac632b56798761300ebbe2";
const LISTS = new Map([
  ["6ac7a66a2ec9c31b1d772929", "💡 IDEIAS / INBOX"],
  ["6ac7a66d799cc0c69e50c32d", "📆 DATAS ESPECIAIS"],
]);

export async function fetchContentIdeas({ key, token, fetcher = fetch, now = new Date() }) {
  if (!key || !token) throw new Error("not-configured");
  const headers = {
    Accept: "application/json",
    Authorization: `OAuth oauth_consumer_key="${encodeURIComponent(key)}", oauth_token="${encodeURIComponent(token)}"`,
  };
  async function get(path, params) {
    const url = new URL(`https://api.trello.com/1/boards/${BOARD}/${path}`);
    url.search = new URLSearchParams(params).toString();
    const response = await fetcher(url, { headers, signal: AbortSignal.timeout(10000), redirect: "error" });
    if (!response.ok) throw new Error(`trello-${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("invalid-response");
    return data;
  }
  const [lists, cards] = await Promise.all([
    get("lists", { filter: "open", fields: "name,closed" }),
    get("cards/open", { fields: "name,desc,url,idList,due,dateLastActivity,closed" }),
  ]);
  const allowed = new Set(lists.filter(list => !list.closed && LISTS.get(list.id) === list.name).map(list => list.id));
  const published = cards.filter(card => !card.closed && allowed.has(card.idList)).flatMap(card => {
    // Never forward Trello account metadata, arbitrary links or API credentials.
    let url;
    try { url = new URL(card.url); } catch { return []; }
    if (url.protocol !== "https:" || url.hostname !== "trello.com" || !/^\/c\/[A-Za-z0-9]+(?:\/|$)/.test(url.pathname)) return [];
    url.search = ""; url.hash = "";
    return [{
      id: url.href, url: url.href,
      name: String(card.name || ""), description: String(card.desc || ""),
      list: LISTS.get(card.idList),
      due: card.due && Number.isFinite(Date.parse(card.due)) ? new Date(card.due).toISOString() : null,
      updatedAt: Number.isFinite(Date.parse(card.dateLastActivity)) ? new Date(card.dateLastActivity).toISOString() : now.toISOString(),
    }];
  });
  return { mode: "live", importedAt: now.toISOString(), cards: published };
}
