<div align="center">

# 🌙 Habit Tracker

### Build better routines, one small win at a time.

A privacy-first habit tracker with a responsive, installable **website**, an **Android APK**, and a lightweight **Python desktop app**. Create routines, record daily completions, and follow your progress without an account. Each version stores data on its own device; there is no cloud sync.

[Getting Started](#-getting-started) · [Features](#-features) · [How to Use](#-how-to-use) · [Data & Privacy](#-data--privacy)

<br>

![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![UI](https://img.shields.io/badge/UI-Tkinter-3978F6?style=for-the-badge)
![Dependencies](https://img.shields.io/badge/Dependencies-Standard%20Library-4ADE80?style=for-the-badge)
![Storage](https://img.shields.io/badge/Storage-Local%20JSON-9BB2D3?style=for-the-badge)

</div>

---

## ✨ Features

- **Responsive website** that works on phones, tablets, and desktop browsers.
- **Installable offline PWA** with a cached app shell and a home-screen icon.
- **Habit organization** with editable categories and weekly frequency goals.
- **Daily check-ins** with a seven-day activity strip, reversible completion, and current streaks.
- **Search and status filters** to find habits and focus on what remains today.
- **Insights** with recent check-in totals, streak summaries, a 28-day activity view, and category counts.
- **Full habit management** to create, edit, or delete habits.
- **JSON backups** that can be exported and restored after a confirmation prompt.
- **Python desktop companion** with local JSON storage, daily completion toggles, streaks, editing, and deletion.
- **Android app** packaged from the same web experience with Capacitor.
- **Private by default:** no account, tracking service, or cloud sync.

## 🖥️ Preview

The website opens to a daily dashboard, with separate all-habits and insights views. The desktop companion opens in its own window with an add-habit field, daily summary, and habit table.

> **Tip:** Select a habit in the table before choosing **Mark done today** or **Remove habit**.

## 🚀 Getting Started

### Requirements

- Python **3.8 or newer** and Tkinter for the desktop app
- A modern browser for the website
- Node.js **20+**, Java **21**, and the Android SDK only when building Android locally

The desktop app uses only the Python standard library.

### Run the app

1. Clone the repository and enter its folder:

   ```bash
   git clone https://github.com/agastya279/habit-tracker.git
   cd habit-tracker
   ```

2. Start the tracker:

   ```bash
   python habit_tracker.py
   ```

   Depending on your system, use `python3 habit_tracker.py` instead.

### Run the website locally

Serve the `web/` directory over localhost so the offline service worker can run:

```bash
python3 -m http.server 8000 --directory web
```

Open <http://localhost:8000>. The website is also published through GitHub Pages when the Pages workflow is enabled for the repository.

### Download or build the Android app

The website's **Get Android app** link downloads `habit-tracker.apk` from the latest GitHub release. A new APK is built and attached automatically when a version tag is pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
```

To build locally, install the Android prerequisites above, then run:

```bash
npm install
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

The generated APK is a debug-signed build for direct testing and installation. Store distribution, including Google Play, requires a separately configured release signing key and release build.

### Tkinter on Linux

Some Linux distributions package Tkinter separately. If the app reports that the `tkinter` module is unavailable, install your distribution’s Tkinter package—for example, on Debian or Ubuntu:

```bash
sudo apt install python3-tk
```

Then run the app again.

## 📖 How to Use

1. **Add a habit:** Type a name in the field and press **Add habit** or hit **Enter**.
2. **Record progress:** Toggle today's check-in from the habit card (website) or select a row and click **Toggle today** (desktop). You can undo a check-in the same day.
3. **Review your progress:** Use the weekly strip, streak, daily summary, filters, and **Insights** view (website), or the table summary (desktop).
4. **Change your routine:** Edit a habit's name, category, or weekly goal. Deleting a habit asks for confirmation and removes its saved history.
5. **Move your data:** Use **Export data** to download a JSON backup and **Import data** to replace the current list after confirmation.

Habit names are case-insensitive for duplicate checking. Each habit has at most one completion per calendar day.

## 📊 How Streaks Work

A streak counts consecutive calendar days on which a habit was marked complete. If the habit has not yet been marked complete today, a completion from yesterday can keep the streak active. Missing a day breaks the streak. A new habit starts with a streak of zero.

## 💾 Data & Privacy

The desktop app stores records in `habits.json` next to `habit_tracker.py`. The website and Android app store records in that browser/app installation's local storage. Website data is scoped to the browser profile and site origin, so it does not automatically move between devices or between the website and Android app.

Use the website's JSON export/import controls to back up or move website data. The desktop JSON file can also be copied manually. The local `habits.json` file is excluded from Git so personal records are not accidentally committed. Clearing browser/app data removes the local copy, so keep a backup if the records matter to you.

## 🧰 Built With

- **Python** — application logic and date-based streak calculations
- **Tkinter / ttk** — desktop interface, included in Python’s standard library
- **JSON** — simple local persistence
- **HTML, CSS, and JavaScript** — responsive web app and offline PWA
- **Capacitor** — Android wrapper for the web app
- **GitHub Actions** — website deployment and tagged APK releases

## 📁 Project Structure

```text
habit-tracker/
├── .github/workflows/ # Website deployment and Android release builds
├── web/               # Responsive website, PWA manifest, and offline cache
├── habit_tracker.py   # Python desktop application
├── capacitor.config.json
├── package.json       # Capacitor Android dependencies
├── package-lock.json  # Locked JavaScript dependencies
├── .gitignore         # Excludes local data and generated build files
├── LICENSE            # MIT License
└── README.md
```

## 🛠️ Troubleshooting

| Problem | Try this |
| --- | --- |
| `python` command is not found | Try `python3`; on Windows, try `py habit_tracker.py`. |
| `No module named tkinter` | Install Tkinter for your Python version (for example, `python3-tk` on Debian/Ubuntu). |
| The habit list is empty | Add a habit using the field at the top of the window. |
| A button says to select a habit | Click a row in the table first. |
| Your habits don’t appear on another computer | Copy `habits.json` to the same folder as `habit_tracker.py` on that computer. |

## 🤝 Contributing

Ideas and improvements are welcome. To contribute, fork the repository, make your change on a branch, and open a pull request with a short description of the change and how you tested it.

## 📄 License

This project is released under the [MIT License](LICENSE).

---

<div align="center">

Made for steady progress, not perfection. 💙

</div>
