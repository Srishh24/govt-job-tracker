(function () {
  "use strict";

  const CURATED = (window.JOBS_DATA && window.JOBS_DATA.jobs) || [];
  const FEED = window.FEED_DATA || { headlines: [], jobNews: {} };
  const DRAFTS = FEED.drafts || [];
  const STORE_KEY = "govt-job-tracker:v1";
  const QUAL_RANK = { "10th": 1, "12th": 2, "Diploma": 3, "Graduate": 4, "Post Graduate": 5 };
  const DAY = 86400000;

  // ---------- storage ----------
  const state = Object.assign(
    { filled: [], removed: [], profile: {}, filters: {}, lastVisit: null, savedDrafts: {} },
    safeParse(localStorage.getItem(STORE_KEY))
  );

  // Auto-added jobs disappear from the feed after a while. Keep a saved copy of the ones you filled
  // so they stay on "My forms".
  const liveIds = new Set([...CURATED, ...DRAFTS].map((j) => j.id));
  const JOBS = [
    ...CURATED,
    ...DRAFTS,
    ...Object.values(state.savedDrafts).filter((d) => !liveIds.has(d.id) && state.filled.includes(d.id)),
  ];
  // Anything newer than the previous visit is marked "New". First visit: last 3 days.
  const prevVisit = state.lastVisit ? Date.parse(state.lastVisit) : Date.now() - 3 * DAY;
  state.lastVisit = new Date().toISOString();
  save();

  function safeParse(s) { try { return JSON.parse(s) || {}; } catch { return {}; } }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  const isFilled = (id) => state.filled.includes(id);
  const isRemoved = (id) => state.removed.includes(id);
  function toggleIn(list, id) {
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
  }

  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? esc(u) : "#"; }
  function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function parseDay(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(s);
  }
  function fmt(d) {
    d = typeof d === "string" ? parseDay(d) : d;
    return d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA";
  }
  function daysUntil(s) {
    const d = parseDay(s);
    if (!d) return null;
    const day = new Date(d); day.setHours(0, 0, 0, 0);
    return Math.round((day - today()) / DAY);
  }
  function relDays(n) {
    if (n === 0) return "today";
    if (n === 1) return "tomorrow";
    if (n === -1) return "yesterday";
    return n > 0 ? `in ${n} days` : `${-n} days ago`;
  }
  const isNew = (dateStr) => dateStr && parseDay(dateStr) > prevVisit;

  // ---------- form status & eligibility ----------
  function formStatus(job) {
    const start = daysUntil(job.formStart);
    const end = daysUntil(job.formEnd);
    if (start != null && start > 0) return { key: "upcoming", cls: "", text: `Opens ${fmt(job.formStart)}` };
    if (end == null && job.draft) return { key: "open", cls: "", text: "Check dates" };
    if (end == null) return { key: "open", cls: "open", text: "Form open" };
    if (end < 0) return { key: "closed", cls: "closed", text: "Form closed" };
    if (end === 0) return { key: "open", cls: "soon", text: "Last day today" };
    if (end <= 5) return { key: "open", cls: "soon", text: `Closes in ${end} day${end > 1 ? "s" : ""}` };
    return { key: "open", cls: "open", text: `Open · ${end} days left` };
  }

  function userAge() {
    const dob = parseDay(state.profile.dob);
    if (!dob) return null;
    const t = today();
    let age = t.getFullYear() - dob.getFullYear();
    if (t < new Date(t.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    return age;
  }

  // Returns { ok: true | false | null, reasons: [] }. null = not enough profile info.
  function eligibility(job) {
    const reasons = [];
    const age = userAge();
    const relax = +state.profile.relax || 0;
    const qual = QUAL_RANK[state.profile.qual];
    if (job.restricted) reasons.push(job.restricted);
    if (qual && job.minQualification && qual < QUAL_RANK[job.minQualification])
      reasons.push(`Needs ${job.minQualification}`);
    if (age != null && job.ageMin != null && age < job.ageMin) reasons.push(`Min age ${job.ageMin}`);
    if (age != null && job.ageMax != null && age > job.ageMax + relax)
      reasons.push(`Max age ${job.ageMax}${relax ? ` (+${relax} relaxation)` : ""}`);
    if (reasons.length) return { ok: false, reasons };
    return { ok: qual && age != null ? true : null, reasons };
  }

  // ---------- rendering: shared bits ----------
  function examText(job) {
    return job.examDateText || (job.examDate ? fmt(job.examDate) : "TBA");
  }
  function siteLink(job) {
    return `<a href="${safeUrl(job.officialLink)}" target="_blank" rel="noopener">${job.draft ? "Read news ↗" : "Official site ↗"}</a>`;
  }
  function chips(list) {
    return list && list.length
      ? `<div class="chips">${list.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>` : "";
  }

  // ---------- ALL JOBS ----------
  function jobCard(job, { removedView = false } = {}) {
    const st = formStatus(job);
    const el = eligibility(job);
    const filled = isFilled(job.id);
    const newBadge = isNew(job.addedOn) ? `<span class="badge new">New</span>` : "";
    const vac = job.vacancies ? ` · ${Number(job.vacancies).toLocaleString("en-IN")} posts` : "";
    const autoBadge = job.draft ? `<span class="badge auto">Auto-added</span>` : "";
    const missing = job.draft ? "Not added yet" : "TBA";
    return `
      <article class="card ${filled ? "filled" : ""} ${job.draft ? "draft" : ""}">
        <div class="card-head">
          <div>
            <h2>${esc(job.title)}${newBadge}${autoBadge}</h2>
            <div class="org">${esc(job.org)} · ${esc(job.location)} · ${esc(job.category)}${vac}</div>
          </div>
          <span class="badge ${st.cls}">${esc(st.text)}</span>
        </div>
        <div class="dates">
          <div><span>Form start</span><b>${job.formStart ? fmt(job.formStart) : job.draft ? missing : "Open now"}</b></div>
          <div><span>Form end</span><b>${job.formEnd ? fmt(job.formEnd) : missing}</b></div>
          <div><span>Exam</span><b>${job.draft && job.examDate ? fmt(job.examDate) : esc(examText(job))}</b></div>
        </div>
        ${chips(job.examLevels)}
        <dl class="facts">
          <dt>Salary</dt><dd>${esc(job.salary)}</dd>
          <dt>Eligibility</dt><dd>${esc(job.eligibility)}
            ${el.ok === false ? `<div class="warn small">You may not be eligible: ${esc(el.reasons.join("; "))}</div>` : ""}</dd>
          <dt>${job.draft ? "Headline" : "Work"}</dt><dd>${esc(job.description)}
            ${job.draft ? `<div class="muted small">Details were read from a news headline. Check the news or official notification.</div>` : ""}</dd>
        </dl>
        <div class="actions">
          ${removedView
            ? `<button class="btn" data-act="restore" data-id="${esc(job.id)}">Restore</button>`
            : `<button class="btn primary ${filled ? "on" : ""}" data-act="fill" data-id="${esc(job.id)}">${filled ? "✓ Form filled" : "Mark as filled"}</button>
               <button class="btn" data-act="remove" data-id="${esc(job.id)}">✕ Not for me</button>`}
          ${siteLink(job)}
        </div>
      </article>`;
  }

  function renderAll() {
    const q = ($("f-search").value || "").trim().toLowerCase();
    const cat = $("f-category").value;
    const onlyEligible = $("f-eligible").checked;
    const showClosed = $("f-closed").checked;
    const sort = $("f-sort").value;
    const showDrafts = $("f-drafts").checked;

    let list = JOBS.filter((j) => !isRemoved(j.id));
    if (!showDrafts) list = list.filter((j) => !j.draft || isFilled(j.id));
    if (!showClosed) list = list.filter((j) => formStatus(j).key !== "closed");
    if (cat) list = list.filter((j) => j.category === cat);
    if (onlyEligible) list = list.filter((j) => eligibility(j).ok !== false);
    if (q) list = list.filter((j) =>
      [j.title, j.org, j.location, j.category, j.description, j.eligibility].join(" ").toLowerCase().includes(q));

    const order = { open: 0, upcoming: 1, closed: 2 };
    list.sort((a, b) => {
      if (sort === "newest") return (b.addedOn || "").localeCompare(a.addedOn || "");
      const sa = formStatus(a).key, sb = formStatus(b).key;
      if (sa !== sb) return order[sa] - order[sb];
      return (a.formEnd || "9999").localeCompare(b.formEnd || "9999");
    });

    let hint = "";
    if (onlyEligible && eligibility({}).ok === null && !state.profile.qual && !state.profile.dob)
      hint = `<p class="muted small">Fill in "My details" above so the eligibility filter can work.</p>`;

    $("job-list").innerHTML = hint + (list.length
      ? list.map((j) => jobCard(j)).join("")
      : `<div class="empty">No jobs match. Try clearing filters or ticking "Show closed forms".</div>`);

    const removed = JOBS.filter((j) => isRemoved(j.id));
    const btn = $("toggle-removed");
    btn.hidden = removed.length === 0;
    const open = !$("removed-list").hidden;
    btn.textContent = open ? "Hide removed jobs" : `Show ${removed.length} removed job${removed.length > 1 ? "s" : ""}`;
    $("removed-list").innerHTML = `<div class="removed">${removed.map((j) => jobCard(j, { removedView: true })).join("")}</div>`;
    if (!removed.length) $("removed-list").hidden = true;

    $("count-all").textContent = JOBS.filter((j) => !isRemoved(j.id) && formStatus(j).key !== "closed").length;
    $("count-mine").textContent = state.filled.length || "";
  }

  function renderHeadlines() {
    const items = FEED.headlines || [];
    const newCount = items.filter((h) => isNew(h.date)).length;
    $("headlines-meta").textContent = `(${items.length}${newCount ? `, ${newCount} new` : ""})`;
    $("headlines").innerHTML = items.length
      ? items.map(newsItem).join("")
      : `<li class="muted">No headlines yet. Run <code>npm run fetch</code>.</li>`;
  }

  function newsItem(n) {
    return `<li>
      <a href="${safeUrl(n.url)}" target="_blank" rel="noopener">${esc(n.title || n.text)}</a>
      ${isNew(n.date) ? `<span class="badge new">New</span>` : ""}
      ${/admit card|hall ticket|call letter/i.test(n.title || n.text) ? `<span class="badge admit">Admit card</span>` : ""}
      <div class="meta">${n.date ? fmt(new Date(n.date)) : ""}${n.source ? " · " + esc(n.source) : ""}</div>
    </li>`;
  }

  // ---------- MY FORMS ----------
  function updatesFor(job) {
    const manual = (job.updates || []).map((u) => ({
      text: u.text, url: u.url, date: u.date, source: "Saved note",
      sortDate: parseDay(u.date) || new Date(0),
    }));
    const seen = new Set();
    const auto = [...((FEED.jobNews || {})[job.id] || []), ...(job.sources || [])]
      .filter((n) => !seen.has(n.title) && seen.add(n.title))
      .map((n) => ({ title: n.title, url: n.url, date: n.date, source: n.source, sortDate: new Date(n.date) }));
    return manual.concat(auto).sort((a, b) => b.sortDate - a.sortDate);
  }

  function mineCard(job) {
    const d = daysUntil(job.examDate);
    const ups = updatesFor(job);
    const admitRecent = ups.some((u) =>
      /admit card|hall ticket|call letter/i.test(u.title || u.text) && !/^expected/i.test(u.text || "") &&
      u.sortDate > Date.now() - 14 * DAY);
    const syllabus = (job.syllabus || []).length
      ? `<ul class="syllabus">${job.syllabus.map((s) =>
          `<li><b>${esc(s.stage)}:</b> ${s.topics.map(esc).join(", ")}</li>`).join("")}</ul>`
      : `<p class="muted small">Not added yet. See the official notification.</p>`;
    const materials = (job.materials || []).length
      ? `<ul class="syllabus">${job.materials.map((m) =>
          `<li><a href="${safeUrl(m.url)}" target="_blank" rel="noopener">${esc(m.label)}</a></li>`).join("")}</ul>`
      : "";
    return `
      <article class="card filled">
        <div class="card-head">
          <div>
            <h2>${esc(job.title)}</h2>
            <div class="org">${esc(job.org)}</div>
            ${admitRecent ? `<span class="badge admit">Admit card news</span>` : ""}
          </div>
          <div class="exam-big">
            <b>${job.examDate ? fmt(job.examDate) : "Exam TBA"}</b>
            <span>${d != null ? relDays(d) : ""}</span>
          </div>
        </div>
        <p class="small muted">${esc(examText(job))}</p>
        ${chips(job.examLevels)}
        <h3>Syllabus</h3>${syllabus}
        ${materials ? `<h3>Study material</h3>${materials}` : ""}
        <h3>Updates</h3>
        ${ups.length ? `<ul class="news">${ups.map(newsItem).join("")}</ul>`
                     : `<p class="muted small">No updates yet.</p>`}
        <div class="actions">
          <button class="btn" data-act="fill" data-id="${esc(job.id)}">Unmark as filled</button>
          ${siteLink(job)}
        </div>
      </article>`;
  }

  function renderMine() {
    const list = JOBS.filter((j) => isFilled(j.id));
    // Upcoming exams soonest first, then exams without a date, then past exams (most recent first).
    const group = (j) => { const d = daysUntil(j.examDate); return d == null ? 1 : d >= 0 ? 0 : 2; };
    list.sort((a, b) => {
      const ga = group(a), gb = group(b);
      if (ga !== gb) return ga - gb;
      if (ga === 0) return a.examDate.localeCompare(b.examDate);
      if (ga === 2) return b.examDate.localeCompare(a.examDate);
      return 0;
    });
    $("mine-list").innerHTML = list.length
      ? list.map(mineCard).join("")
      : `<div class="empty">No forms marked yet. On "All jobs", tap <b>Mark as filled</b> on the forms you've applied for.</div>`;
  }

  // ---------- routing & events ----------
  function route() {
    const mine = location.hash === "#mine";
    $("view-all").hidden = mine;
    $("view-mine").hidden = !mine;
    $("tab-all").classList.toggle("active", !mine);
    $("tab-mine").classList.toggle("active", mine);
    renderAll();
    if (mine) renderMine();
  }

  function renderProfileSummary() {
    const age = userAge();
    const parts = [];
    if (age != null) parts.push(`age ${age}`);
    if (state.profile.qual) parts.push(state.profile.qual);
    $("profile-summary").textContent = parts.length ? `(${parts.join(", ")})` : "(not set)";
  }

  function init() {
    // Category options
    [...new Set(JOBS.map((j) => j.category))].sort().forEach((c) => {
      const o = document.createElement("option"); o.value = o.textContent = c; $("f-category").appendChild(o);
    });

    // Restore profile & filters
    $("p-dob").value = state.profile.dob || "";
    $("p-qual").value = state.profile.qual || "";
    $("p-relax").value = state.profile.relax || "0";
    $("f-eligible").checked = !!state.filters.eligible;
    $("f-closed").checked = !!state.filters.closed;
    $("f-sort").value = state.filters.sort || "closing";
    $("f-drafts").checked = state.filters.drafts !== false;
    if (!state.profile.dob && !state.profile.qual) $("profile-panel").open = true;
    renderProfileSummary();

    ["p-dob", "p-qual", "p-relax"].forEach((id) => $(id).addEventListener("change", () => {
      state.profile = { dob: $("p-dob").value, qual: $("p-qual").value, relax: $("p-relax").value };
      save(); renderProfileSummary(); renderAll();
    }));
    ["f-eligible", "f-closed", "f-drafts", "f-sort", "f-category"].forEach((id) => $(id).addEventListener("change", () => {
      state.filters = { eligible: $("f-eligible").checked, closed: $("f-closed").checked,
        drafts: $("f-drafts").checked, sort: $("f-sort").value };
      save(); renderAll();
    }));
    $("f-search").addEventListener("input", renderAll);
    $("toggle-removed").addEventListener("click", () => {
      $("removed-list").hidden = !$("removed-list").hidden; renderAll();
    });

    document.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      const id = b.dataset.id;
      if (b.dataset.act === "fill") {
        toggleIn(state.filled, id);
        const job = JOBS.find((j) => j.id === id);
        if (job && job.draft && isFilled(id)) state.savedDrafts[id] = job;
        if (!isFilled(id)) delete state.savedDrafts[id];
      }
      if (b.dataset.act === "remove") { toggleIn(state.removed, id); state.filled = state.filled.filter((x) => x !== id); }
      if (b.dataset.act === "restore") toggleIn(state.removed, id);
      save(); route();
    });

    window.addEventListener("hashchange", route);

    // Footer info
    const fetched = FEED.fetchedAt ? new Date(FEED.fetchedAt) : null;
    const stale = fetched && Date.now() - fetched > 2 * DAY;
    $("data-info").innerHTML =
      `${CURATED.length} checked jobs (edited ${esc(fmt(window.JOBS_DATA && window.JOBS_DATA.lastEdited))})` +
      ` · ${DRAFTS.length} auto-added from news` +
      ` · News fetched ${fetched ? esc(fetched.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })) : "never"}` +
      (stale ? ` <span class="warn">(old, run npm run fetch)</span>` : "");

    renderHeadlines();
    route();
  }

  init();
})();
