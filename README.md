# Govt Job Tracker

A simple two-page site for tracking Indian government job notifications.

- **All jobs**: open forms with start/end dates, exam date, exam stages, salary, eligibility and work description. Tick **Mark as filled** or hide with **Not for me**. Set your date of birth and qualification under *My details* to hide jobs you can't apply for.
- **My forms**: only the forms you filled, nearest exam first, with syllabus, study material and updates (admit card, result, exam date news).

Ticks, removals and your details are saved in your own browser, so each friend has their own list.

## Use it on your computer

```
npm run start      # fetches fresh news, then opens the page
```

Or just double-click `index.html`. Run `npm run fetch` any time to refresh news (needs Node 18+, no installs).

## Where the data comes from

| File | What | Updated by |
|---|---|---|
| `data/jobs.js` | The job list with dates, salary, eligibility, syllabus, notes | You, by hand (copy a block, edit it) |
| `data/feed.js` | News headlines and per-exam updates from Google News RSS | `npm run fetch` (automatic) |

New notifications also become **Auto-added** job cards (dashed border). The fetch script reads the organisation, number of posts and any dates mentioned in the headline. Salary, eligibility and syllabus say "Not added yet". To give a job full details, add it to `data/jobs.js` with a `newsQuery`; the auto-added card for it then stops appearing. Auto-added cards drop off after their last date passes, or after 30 days without news. If you marked one as filled, your browser keeps a copy on *My forms*.

Always confirm dates on the official site, because news sites sometimes disagree.

## Share with friends (free)

1. Put this folder in a GitHub repository and turn on **GitHub Pages** (Settings → Pages → deploy from `main`).
2. Share the Pages link. On a phone, use "Add to Home Screen" to make it look like an app.
3. `.github/workflows/update-news.yml` refreshes the news every 6 hours by itself. You only edit `data/jobs.js` when you want to add a job.
