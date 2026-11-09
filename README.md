<div align="center">

# 🌙 Habit Tracker

### Build better routines, one small win at a time.

A lightweight desktop habit tracker built with **Python** and **Tkinter**. Add habits, record daily completions, and keep an eye on your streaks—all in a calm, dark-blue interface, with your data saved locally.

[Getting Started](#-getting-started) · [Features](#-features) · [How to Use](#-how-to-use) · [Data & Privacy](#-data--privacy)

<br>

![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![UI](https://img.shields.io/badge/UI-Tkinter-3978F6?style=for-the-badge)
![Dependencies](https://img.shields.io/badge/Dependencies-Standard%20Library-4ADE80?style=for-the-badge)
![Storage](https://img.shields.io/badge/Storage-Local%20JSON-9BB2D3?style=for-the-badge)

</div>

---

## ✨ Features

- **Create habits** with a name that’s easy to recognize.
- **Check off today’s progress** with a single action.
- **Track streaks** based on consecutive completed days.
- **See your latest completion date** and whether each habit is done today.
- **View a daily summary** of completed habits at a glance.
- **Remove habits** you no longer want to track.
- **Keep your information local** in a simple JSON file—no account or internet connection required.
- **Enjoy a dark-blue UI** designed to feel focused and easy on the eyes.

## 🖥️ Preview

The app opens as a desktop window with an add-habit field, action buttons, a daily progress summary, and a table of your habits.

> **Tip:** Select a habit in the table before choosing **Mark done today** or **Remove habit**.

## 🚀 Getting Started

### Requirements

- Python **3.8 or newer**
- Tkinter, included with most Python installations

No third-party Python packages are needed.

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

### Tkinter on Linux

Some Linux distributions package Tkinter separately. If the app reports that the `tkinter` module is unavailable, install your distribution’s Tkinter package—for example, on Debian or Ubuntu:

```bash
sudo apt install python3-tk
```

Then run the app again.

## 📖 How to Use

1. **Add a habit:** Type a name in the field and press **Add habit** or hit **Enter**.
2. **Record progress:** Select the habit in the list and click **Mark done today**. The app records one completion for the current date.
3. **Review your progress:** Check the **Streak**, **Last completed**, and **Today** columns, plus the daily summary above the list.
4. **Remove a habit:** Select it and click **Remove habit**. Confirm to delete the habit and its saved history.

Habit names are case-insensitive for duplicate checking. A habit can only have one completion recorded per day; marking it done again keeps that day complete.

## 📊 How Streaks Work

A streak counts consecutive calendar days on which a habit was marked complete. If the habit has not yet been marked complete today, a completion from yesterday can keep the streak active. Missing a day breaks the streak. A new habit starts with a streak of zero.

## 💾 Data & Privacy

Your habit records are stored in `habits.json` next to `habit_tracker.py`. The file is created when you first add or update a habit. Data stays on your computer; the app does not connect to a service or upload your records.

The JSON file is human-readable and can be copied to back up your data. The local `habits.json` file is excluded from Git so personal habit records are not accidentally committed.

## 🧰 Built With

- **Python** — application logic and date-based streak calculations
- **Tkinter / ttk** — desktop interface, included in Python’s standard library
- **JSON** — simple local persistence

## 📁 Project Structure

```text
habit-tracker/
├── habit_tracker.py   # Desktop application
├── habits.json        # Created locally when you add habits (not committed)
├── .gitignore         # Excludes local data and Python artifacts
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

No license has been specified for this repository yet. Until one is added, all rights are reserved by default; please contact the repository owner before redistributing or reusing the project.

---

<div align="center">

Made for steady progress, not perfection. 💙

</div>
