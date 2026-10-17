"use strict";
// The server reads Trello; credentials never reach the browser.
(() => {
  const dialog = document.getElementById("contentIdeas");
  const openButton = document.getElementById("openContentIdeas");
  const list = document.getElementById("contentIdeasList");
  const status = document.getElementById("contentIdeasStatus");
  const tabs = [...dialog.querySelectorAll("[data-ideas-view]")];
  let snapshot = null, view = "recent", loading = false, lastLoad = 0;
  const day = value => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
  const dayNumber = value => Math.round(Date.parse(day(value) + "T12:00:00Z") / 86400000);
  const shortDate = value => new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" }).format(new Date(value));
  const clean = value => String(value || "").replace(/\*\*/g, "").trim();
  function section(text, label) {
    const lines = text.split(/\r?\n/), start = lines.findIndex(line => label.test(line));
    if (start < 0) return "";
    const result = [lines[start].replace(/^[^:]*:\s*/, "")];
    for (let index = start + 1; index < lines.length; index++) {
      if (!lines[index].trim() || /^\s*(?:📌|📆|💡|🎯|🔗|⭐|🎂|📍|🎟|🎤|🎪)/u.test(lines[index])) break;
      result.push(lines[index]);
    }
    return clean(result.join("\n"));
  }
  function safeUrl(value) {
    try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  }
  function link(label, url) {
    const a = document.createElement("a"); a.textContent = label; a.href = url;
    a.target = "_blank"; a.rel = "noopener noreferrer"; return a;
  }
  function editorialDate(card) {
    if (card.due) return day(card.due);
    // A news card's prefix is its discovery date, not an expiry date.
    const original = card.description.split(/\r?\n/).find(line => /Data (?:e ano )?origina/i.test(line)) || "";
    const originalYear = Number(original.match(/\b(?:19|20)\d{2}\b/)?.[0]);
    const occurrenceYear = Number(day(card.updatedAt).slice(0, 4));
    const scheduled = card.name.match(/(\d{2})\/(\d{2})\s*•/);
    if (!scheduled || !originalYear || originalYear >= occurrenceYear) return null;
    return `${occurrenceYear}-${scheduled[2]}-${scheduled[1]}`;
  }
  function render() {
    list.replaceChildren();
    if (!snapshot) return;
    const today = dayNumber(new Date());
    const seen = new Set();
    const cards = snapshot.cards.filter(card => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);
      if (/DATAS PASSADAS/i.test(card.list)) return false;
      const scheduledDate = editorialDate(card);
      if (scheduledDate && scheduledDate < day(new Date())) return false;
      if (view === "dates") return card.list === "📆 DATAS ESPECIAIS" && card.due && dayNumber(card.due) >= today && dayNumber(card.due) <= today + 6;
      return card.list === "💡 IDEIAS / INBOX" && dayNumber(card.updatedAt) >= today - 6;
    }).sort((a, b) => view === "dates" ? String(a.due).localeCompare(String(b.due)) : String(b.updatedAt).localeCompare(String(a.updatedAt)));
    for (const card of cards) {
      const article = document.createElement("article"); article.className = "idea-card";
      const meta = document.createElement("small"); meta.textContent = view === "dates" ? `${day(card.due) === day(new Date()) ? "Hoje · " : ""}${shortDate(card.due)} · Data especial` : `Card atualizado em ${shortDate(card.updatedAt)}`;
      const heading = document.createElement("h3"); heading.textContent = clean(card.name.replace(/^[^•]*•\s*/, ""));
      const summary = section(card.description, /O que aconteceu/i);
      const paragraph = document.createElement("p"); paragraph.textContent = summary || "Abra o card para conferir os detalhes da pauta.";
      const angle = section(card.description, /Ângulo sugerido|Sugestão de conteúdo/i);
      const details = document.createElement("details"), detailsTitle = document.createElement("summary"); detailsTitle.textContent = "Abordagem e fontes"; details.append(detailsTitle);
      if (summary) { const context = document.createElement("p"); context.textContent = summary; details.append(context); }
      if (angle) { const p = document.createElement("p"); p.textContent = angle; details.append(p); }
      const urls = [...new Set(card.description.match(/https?:\/\/[^\s<>]+/g) || [])].map(safeUrl).filter(Boolean);
      urls.forEach((url, index) => details.append(link(`Fonte ${index + 1} · ${new URL(url).hostname}`, url)));
      const actions = document.createElement("div"); actions.className = "idea-actions";
      const cardUrl = safeUrl(card.url); if (cardUrl) actions.append(link("Abrir card", cardUrl));
      article.append(meta, heading, paragraph, details, actions); list.append(article);
    }
    if (!cards.length) {
      const empty = document.createElement("p"); empty.className = "ideas-empty";
      empty.textContent = view === "dates" ? "Nenhuma data especial nos próximos sete dias nesta importação." : "Nenhuma pauta atualizada nos últimos sete dias nesta importação.";
      list.append(empty);
    }
    const stamp = shortDate(snapshot.importedAt);
    status.textContent = snapshot.mode === "live"
      ? `Trello conectado · atualizado em ${stamp}.`
      : `Cópia de ${stamp} · ${snapshot.syncStatus === "not-configured" ? "conexão aguardando autorização" : "sincronização indisponível"}.`;
    tabs.forEach(tab => { tab.setAttribute("aria-pressed", String(tab.dataset.ideasView === view)); });
  }
  async function load(autoOpen = false) {
    if (loading) return;
    loading = true; status.textContent = "Carregando pautas…";
    try {
      const response = await fetch("/api/content-ideas", { cache: "no-store", signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.cards)) throw new Error(data.error || "Não foi possível carregar as pautas.");
      snapshot = data; lastLoad = Date.now(); render();
      if (autoOpen && !sessionStorage.getItem("storyforge-ideas-opened")) {
        dialog.showModal(); sessionStorage.setItem("storyforge-ideas-opened", "1");
      }
    } catch {
      if (!snapshot) {
        try {
          const response = await fetch("/catalog/content-ideas.json", { cache: "no-store" });
          const data = await response.json();
          if (!response.ok || !Array.isArray(data.cards) || !data.importedAt) throw new Error();
          snapshot = { ...data, mode: "snapshot", syncStatus: "unavailable" }; render();
          if (autoOpen && !sessionStorage.getItem("storyforge-ideas-opened")) {
            dialog.showModal(); sessionStorage.setItem("storyforge-ideas-opened", "1");
          }
        } catch { status.textContent = "Não foi possível carregar as pautas. Tente recarregar."; }
      } else {
        snapshot = { ...snapshot, mode: "snapshot", syncStatus: "unavailable" }; render();
      }
    }
    finally { loading = false; }
  }
  openButton.hidden = false;
  openButton.addEventListener("click", () => { if (!dialog.open) dialog.showModal(); void load(); });
  document.getElementById("closeContentIdeas").addEventListener("click", () => dialog.close());
  document.getElementById("reloadContentIdeas").addEventListener("click", () => void load());
  tabs.forEach(tab => tab.addEventListener("click", () => { view = tab.dataset.ideasView; render(); }));
  dialog.addEventListener("keydown", event => event.stopPropagation());
  dialog.addEventListener("pointerdown", event => event.stopPropagation());
  const refresh = () => { if (!document.hidden && Date.now() - lastLoad >= 60000) void load(); };
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("focus", refresh);
  setInterval(refresh, 5 * 60 * 1000);
  void load(true);
})();
