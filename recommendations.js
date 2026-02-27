/**
 * Recommendations — store and display user-added recs (localStorage)
 */

const STORAGE_KEY = "spain-trip-recommendations";

function loadRecs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecs(recs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recs));
}

function renderRecList() {
  const recs = loadRecs();
  const container = document.getElementById("rec-list");
  const emptyEl = document.getElementById("rec-empty");
  if (!container) return;

  if (recs.length === 0) {
    container.innerHTML = "";
    if (emptyEl) emptyEl.hidden = false;
    return;
  }

  if (emptyEl) emptyEl.hidden = true;

  container.innerHTML = recs
    .map(
      (r, i) => `
    <div class="rec-item" data-index="${i}">
      <div class="rec-item-header">
        <span class="rec-item-category">${escapeHtml(r.category)}</span>
        ${r.city ? `<span class="rec-item-city">${escapeHtml(r.city)}</span>` : ""}
        ${r.from ? `<span class="rec-item-from">From ${escapeHtml(r.from)}</span>` : ""}
        <button type="button" class="rec-item-delete" aria-label="Remove recommendation" data-index="${i}">×</button>
      </div>
      <p class="rec-item-text">${escapeHtml(r.text)}</p>
    </div>
  `
    )
    .join("");

  container.querySelectorAll(".rec-item-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = loadRecs();
      const idx = Number(btn.dataset.index);
      list.splice(idx, 1);
      saveRecs(list);
      renderRecList();
    });
  });
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

document.getElementById("rec-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const from = document.getElementById("rec-from")?.value?.trim() || "";
  const category = document.getElementById("rec-category")?.value || "Other";
  const text = document.getElementById("rec-text")?.value?.trim();
  const city = document.getElementById("rec-city")?.value?.trim() || "";

  if (!text) return;

  const recs = loadRecs();
  recs.push({ from, category, text, city });
  saveRecs(recs);
  renderRecList();

  document.getElementById("rec-form").reset();
  document.getElementById("rec-text").focus();
});

renderRecList();
