// Pulls recent government-job headlines and per-exam updates (admit card, result, exam date)
// from Google News RSS, and writes them to data/feed.js for the website to show.
// Run with: npm run fetch   (needs Node 18+, no extra packages)

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const JOBS_FILE = path.join(root, "data", "jobs.js");
const FEED_FILE = path.join(root, "data", "feed.js");

const HEADLINE_QUERIES = [
  "recruitment 2026 notification out apply online",
  "sarkari naukri notification apply online last date",
  "govt jobs notification released vacancies apply online",
  "recruitment 2026 apply online posts last date",
  "vacancy 2026 notification out posts",
];
const DRAFT_KEEP_DAYS = 30;   // drop a draft if no headline mentioned it for this long
const MAX_DRAFTS = 60;
const UPDATE_WORDS = '("admit card" OR result OR "exam date" OR "answer key" OR "city slip" OR "last date")';
const HEADLINE_DAYS = 10;
const JOB_NEWS_DAYS = 30;

function rssUrl(query) {
  return "https://news.google.com/rss/search?" +
    new URLSearchParams({ q: query, hl: "en-IN", gl: "IN", ceid: "IN:en" });
}

function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, "&").trim();
}

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
}

async function fetchRss(query, tries = 3) {
  const res = await fetch(rssUrl(query), { headers: { "User-Agent": "Mozilla/5.0" } });
  if (res.status === 429 && tries > 1) {        // rate limited: wait and try again
    await pause(8000);
    return fetchRss(query, tries - 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const source = tag(item, "source");
    let title = tag(item, "title");
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
    const pub = new Date(tag(item, "pubDate"));
    return { title, url: tag(item, "link"), source, date: isNaN(pub) ? null : pub.toISOString() };
  });
}

function recent(items, days) {
  const cutoff = Date.now() - days * 86400000;
  return items.filter((i) => i.date && Date.parse(i.date) >= cutoff);
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((i) => {
    const key = i.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const byDateDesc = (a, b) => Date.parse(b.date) - Date.parse(a.date);

async function loadJobs() {
  const ctx = { window: {} };
  vm.runInNewContext(await readFile(JOBS_FILE, "utf8"), ctx);
  return ctx.window.JOBS_DATA.jobs;
}

async function loadPreviousFeed() {
  try {
    const ctx = { window: {} };
    vm.runInNewContext(await readFile(FEED_FILE, "utf8"), ctx);
    return ctx.window.FEED_DATA || {};
  } catch { return {}; }
}

// ---------- draft job cards from headlines ----------

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MON = "(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE = `(?:(\\d{1,2})(?:st|nd|rd|th)?\\s+${MON}|${MON}\\s+(\\d{1,2})(?:st|nd|rd|th)?)\\b`;
const END_RE = new RegExp(`(?:till|until|upto|up to|by|before|last date(?: is| to apply)?|deadline|ends?|closes?|extended to)\\s+(?:on\\s+)?${DATE}`, "i");
const EXAM_RE = new RegExp(`(?:exam|test|prelims)\\s+(?:on|date|from)\\s+(?:on\\s+)?${DATE}`, "i");
const START_RE = new RegExp(`(?:from|starts?|begins?|opens?|started)\\s+(?:on\\s+|from\\s+)?${DATE}`, "i");

const IS_NOTIFICATION = /recruitment|notification|vacanc|bharti|apply online|online form/i;
const NOT_NOTIFICATION = /result|admit card|hall ticket|call letter|answer key|cut ?off|syllabus|exam date|exam pattern|previous year|strategy|how to|salary|merit list|city slip|score ?card|interview schedule|expected|preparation|tips|book list|kab|kya/i;
// Contract, research and one-off academic roles clutter the list, so skip them.
const SHORT_TERM = /consultant|project (associate|assistant|fellow|scientist)|research (associate|fellow)|\bjrf\b|\bsrf\b|guest (faculty|lecturer)|walk.?in|internship|contractual|young professional|amrita|mahavidyalaya/i;
const MIN_POSTS = 5;
const GENERIC_NAME = /\b(govt|government|sarkari|latest|top|weekly|this week|today|jobs?|naukri)\b/i;

const CATEGORY_RULES = [
  [/\b(rrb|railway|rail|metro|nmrc|rites|ircon)\b/i, "Railway"],
  [/\b(bank|ibps|sbi|rbi|nabard|sidbi|exim|lic|insurance|nhb)\b/i, "Bank"],
  [/\b(army|navy|air force|iaf|bsf|crpf|cisf|itbp|ssb|assam rifles|police|constable|agniveer|coast guard|defence|home guard|fire ?fighter|ksfes)\b/i, "Defence / Police"],
  [/\b(high court|court|judicial|judiciary|civil judge|pcs j)\b/i, "Judiciary"],
  [/\b(teacher|tgt|pgt|prt|tet|htet|ctet|lecturer|professor|aees|kvs|nvs)\b/i, "Teaching"],
  [/\b(nhm|nurse|health|medical|hospital|aiims|esic|icmr|chs|cho|doctor|resident)\b/i, "Health"],
  [/\b(ntpc|nhpc|ongc|bhel|bel|bdl|beml|iocl|gail|sail|nlc|wcl|cil|coal|nspcl|nsic|hal|aai|powergrid|psu|trainee engineer|wbsetcl)\b/i, "PSU"],
  [/\b(ssc|upsc|isro|drdo|epfo|nta|central|icar|iit|nit|university|bhu|du)\b/i, "Central Govt"],
  [/\bpsc\b|public service commission|\b(bpsc|uppsc|mpsc|rpsc|tnpsc|kpsc|appsc|tspsc|opsc|wbpsc|hpsc|gpsc|jpsc|ukpsc|cgpsc)\b/i, "State PSC"],
  [/\b(dsssb|sssc|osssc|hssc|upsssc|board|state)\b/i, "State Govt"],
];
const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu", "Kashmir", "Ladakh", "Puducherry", "Chandigarh"];

function nameWords(name) {
  return [...new Set(name.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ")
    .filter((w) => w && !["new", "the", "out", "official", "and", "of", "for"].includes(w)))];
}

function toIsoDate(m, pubIso) {
  if (!m) return null;
  const day = +(m[1] || m[4]);
  const mon = MONTHS.indexOf((m[2] || m[3]).slice(0, 3).toLowerCase());
  if (!day || day > 31 || mon < 0) return null;
  const pub = new Date(pubIso);
  let year = pub.getUTCFullYear();
  if (mon < pub.getUTCMonth() - 2) year++;          // e.g. "till 15 Jan" in a November headline
  if (mon > pub.getUTCMonth() + 9) year--;          // e.g. "from 20 Dec" in a January headline
  return `${year}-${String(mon + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function draftFromHeadline(h) {
  const t = h.title.replace(/\s+/g, " ").trim();
  if (!IS_NOTIFICATION.test(t) || NOT_NOTIFICATION.test(t) || SHORT_TERM.test(t)) return null;
  const m = t.match(/^(.*?)\s+(?:Recruitment|Notification|Vacancy|Vacancies|Bharti|Apply Online|Online Form)\b/i);
  if (!m) return null;
  const name = m[1]
    .replace(/\b20\d\d(-\d\d)?\b/g, "")
    .replace(/^[^A-Za-z]+/, "")
    .replace(/[\s:,–-]+$/, "")
    .trim();
  if (name.length < 3 || name.length > 70 || GENERIC_NAME.test(name) || !/[A-Za-z]{2}/.test(name)) return null;

  const key = nameWords(name).sort().join("-");
  if (!key) return null;
  // "1,397 Clerk & PO Posts" -> 1397 (allows up to 5 words between the number and "posts")
  const posts = t.replace(/\b20\d\d\b/g, "")
    .match(/\b(\d{1,3}(?:,\d{2,3})+|\d+)\s*\+?\s*(?:[A-Za-z&()/.'-]+,?\s+){0,5}?(?:posts?|vacanc(?:y|ies)|seats)\b/i);
  if (posts && +posts[1].replace(/,/g, "") < MIN_POSTS) return null;
  const location = STATES.find((s) => t.toLowerCase().includes(s.toLowerCase())) || "";
  const category = (CATEGORY_RULES.find(([re]) => re.test(t)) || [, "Other"])[1];

  return {
    id: "auto-" + key,
    draft: true,
    title: `${name} Recruitment`,
    org: name,
    category,
    location: location || "Check notification",
    vacancies: posts ? +posts[1].replace(/,/g, "") : null,
    addedOn: h.date,
    lastSeen: h.date,
    formStart: toIsoDate(t.match(START_RE), h.date),
    formEnd: toIsoDate(t.match(END_RE), h.date),
    examDate: toIsoDate(t.match(EXAM_RE), h.date),
    examDateText: "Not added yet",
    examLevels: [],
    salary: "Not added yet",
    minQualification: null,
    ageMin: null,
    ageMax: null,
    eligibility: "Not added yet. Read the news or official notification.",
    description: t,
    officialLink: h.url,
    newsQuery: name,
    syllabus: [],
    materials: [],
    updates: [],
    sources: [{ title: t, url: h.url, source: h.source, date: h.date }],
  };
}

// Combine an older and newer version of the same draft.
function mergeDraft(old, add) {
  const sources = [...old.sources];
  for (const s of add.sources) if (!sources.some((x) => x.url === s.url || x.title === s.title)) sources.push(s);
  sources.sort(byDateDesc);
  const newer = Date.parse(add.lastSeen) >= Date.parse(old.lastSeen);
  const pick = (f) => (newer ? add[f] ?? old[f] : old[f] ?? add[f]);
  return {
    ...old,
    vacancies: pick("vacancies"),
    formStart: pick("formStart"),
    formEnd: pick("formEnd"),
    examDate: pick("examDate"),
    location: old.location === "Check notification" ? add.location : old.location,
    category: old.category === "Other" ? add.category : old.category,
    description: sources[0].title,
    officialLink: sources[0].url,
    addedOn: Date.parse(add.addedOn) < Date.parse(old.addedOn) ? add.addedOn : old.addedOn,
    lastSeen: newer ? add.lastSeen : old.lastSeen,
    sources: sources.slice(0, 5),
  };
}

function coveredByCurated(text, jobs) {
  const t = text.toLowerCase();
  return jobs.some((j) => {
    if (!j.newsQuery) return false;
    const words = j.newsQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 1 && !/^\d+(\/\d+)?$/.test(w));
    return words.length && words.every((w) => t.includes(w));
  });
}

function buildDrafts(rawHeadlines, previous, jobs) {
  const map = new Map();
  for (const d of previous || []) {
    if (!d.sources || coveredByCurated(d.sources[0].title, jobs)) continue;
    map.set(d.id, d);
  }
  for (const h of rawHeadlines) {
    if (coveredByCurated(h.title, jobs)) continue;
    const d = draftFromHeadline(h);
    if (!d) continue;
    map.set(d.id, map.has(d.id) ? mergeDraft(map.get(d.id), d) : d);
  }
  // Fold a vaguer name into a more specific one, e.g. "SIDBI" into "SIDBI Grade A and B",
  // as long as their post counts don't contradict each other.
  const list = [...map.values()].sort((a, b) => nameWords(b.org).length - nameWords(a.org).length);
  const merged = [];
  for (const d of list) {
    const words = nameWords(d.org);
    const target = merged.find((m) => {
      const mw = nameWords(m.org);
      return words.every((w) => mw.includes(w)) &&
        (!d.vacancies || !m.vacancies || d.vacancies === m.vacancies);
    });
    if (target) Object.assign(target, mergeDraft(target, d));
    else merged.push(d);
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const keepAfter = Date.now() - DRAFT_KEEP_DAYS * 86400000;
  return merged
    .filter((d) => (d.formEnd ? d.formEnd >= todayIso : Date.parse(d.lastSeen) >= keepAfter))
    .sort((a, b) => Date.parse(b.addedOn) - Date.parse(a.addedOn))
    .slice(0, MAX_DRAFTS);
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const jobs = await loadJobs();
  const previous = await loadPreviousFeed();
  const errors = [];

  let raw = [];
  for (const q of HEADLINE_QUERIES) {
    try { raw.push(...(await fetchRss(q))); }
    catch (e) { errors.push(`headlines "${q}": ${e.message}`); }
  }
  raw = dedupe(recent(raw, HEADLINE_DAYS)).sort(byDateDesc);
  const headlines = raw.slice(0, 40);

  // If every headline request failed, keep the old drafts instead of wiping them.
  const drafts = raw.length ? buildDrafts(raw, previous.drafts, jobs) : previous.drafts || [];

  const jobNews = {};
  for (const job of [...jobs, ...drafts]) {
    if (!job.newsQuery) continue;
    await pause(500);
    try {
      const items = await fetchRss(`${job.newsQuery} ${UPDATE_WORDS}`);
      // Keep only headlines that mention every word of newsQuery (years and numbers ignored).
      const mustHave = job.newsQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 1 && !/^\d+(\/\d+)?$/.test(w));
      const relevant = items.filter((i) => mustHave.every((w) => i.title.toLowerCase().includes(w)));
      jobNews[job.id] = dedupe(recent(relevant, JOB_NEWS_DAYS)).sort(byDateDesc).slice(0, 6);
    } catch (e) {
      errors.push(`${job.id}: ${e.message}`);
    }
  }

  const feed = { fetchedAt: new Date().toISOString(), headlines, drafts, jobNews };
  await writeFile(
    FEED_FILE,
    "// Generated by `npm run fetch`. Do not edit by hand.\nwindow.FEED_DATA = " +
      JSON.stringify(feed, null, 2) + ";\n"
  );

  const newsCount = Object.values(jobNews).reduce((n, a) => n + a.length, 0);
  console.log(`Saved ${headlines.length} headlines, ${drafts.length} auto-added jobs and ${newsCount} exam updates to data/feed.js`);
  if (errors.length) console.warn("Some requests failed:\n  " + errors.join("\n  "));
}

main().catch((e) => { console.error(e); process.exit(1); });
