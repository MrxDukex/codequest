# CodeQuest

Learn HTML, CSS, and JavaScript through an interactive, gamified Progressive Web App. Works on desktop and mobile, with optional Obsidian note exports.

## Quick Start

1. Open `index.html` in your browser.
2. On mobile, open once in Chrome/Safari and "Add to Home Screen" to install.
3. Start from the dashboard or pick a path: HTML, CSS, JavaScript.

## Features

- Dark, modern UI with mobile-first design
- 65+ challenges (HTML 20, CSS 20, JS 25)
- XP, levels, achievements, daily quests, streaks
- Progressive hints + "Really Stuck" with review flagging
- Auto-save and export progress
- Code Playground for experiments
- Obsidian export: per-challenge notes, daily log, tracker

## Sync Between Devices

- Place the `CodeQuest` folder in OneDrive (recommended).
- Your progress is saved in browser storage. Use Profile → Export Progress to back up or transfer.
- Challenge notes export as `.md` so you can move them to your Obsidian vault at:
  `C:\Users\stivi\Documents\Notes\Notes` (recommend creating `CodeQuest/` inside).

## Installing on Phone (PWA)

- Open `index.html` from OneDrive in your mobile browser.
- Tap the browser menu and choose "Add to Home Screen" or "Install".
- The app will then open like a native app.

## Folder Structure

```
CodeQuest/
├─ index.html
├─ manifest.json
├─ service-worker.js
├─ assets/
│  ├─ css/
│  │  ├─ main.css
│  │  └─ themes.css
│  ├─ js/
│  │  ├─ app.js
│  │  ├─ challenges.js
│  │  ├─ editor.js
│  │  ├─ gamification.js
│  │  ├─ obsidian.js
│  │  └─ progress.js
│  └─ images/
│     ├─ icon-192.png  (optional)
│     └─ icon-512.png  (optional)
```

## Icons

PWA icons are optional. You can add your own PNGs at:

```
assets/images/icon-192.png
assets/images/icon-512.png
```

If missing, installation still works in most browsers; add them later for a nicer homescreen icon.

## Notes

- First run shows a short tutorial. You can skip and access the dashboard.
- Daily quests reset at midnight (your local time).
- Streak is harsh mode: miss a day → reset to 0.

## Troubleshooting

- If challenges don’t appear: hard refresh (Ctrl+F5) to reload `challenges.js`.
- To reset everything, go to Profile → Reset All Progress.

## License

Personal use. Do not redistribute without permission.
