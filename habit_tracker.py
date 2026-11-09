import json
from datetime import date, timedelta
from pathlib import Path
import tkinter as tk
from tkinter import messagebox, ttk

# Dark-blue palette
BG = "#081426"
PANEL = "#0f1d31"
CARD = "#12263f"
ACCENT = "#3978f6"
ACCENT_HOVER = "#5792ff"
TEXT = "#edf5ff"
MUTED = "#9bb2d3"
GREEN = "#4ade80"
RED = "#ef5350"

DATA_FILE = Path(__file__).with_name("habits.json")


class HabitTracker:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Habit Tracker")
        self.root.geometry("820x560")
        self.root.minsize(680, 440)
        self.root.configure(bg=BG)
        self.habits = self.load_habits()
        self.build_ui()
        self.refresh()

    def load_habits(self) -> dict:
        try:
            data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (FileNotFoundError, json.JSONDecodeError, OSError):
            return {}

    def save_habits(self) -> None:
        DATA_FILE.write_text(json.dumps(self.habits, indent=2), encoding="utf-8")

    @staticmethod
    def streak(history: dict) -> int:
        """Count consecutive completed days, including today or yesterday."""
        completed = {day for day, done in history.items() if done}
        current = date.today()
        if current.isoformat() not in completed:
            current -= timedelta(days=1)
        count = 0
        while current.isoformat() in completed:
            count += 1
            current -= timedelta(days=1)
        return count

    def add_habit(self) -> None:
        name = self.entry.get().strip()
        if not name:
            messagebox.showinfo("Habit name needed", "Enter a name for your habit.")
            return
        if any(existing.casefold() == name.casefold() for existing in self.habits):
            messagebox.showinfo("Already added", "That habit is already in your list.")
            return
        self.habits[name] = {"history": {}}
        self.save_habits()
        self.entry.delete(0, tk.END)
        self.refresh()

    def mark_done(self) -> None:
        selected = self.table.selection()
        if not selected:
            messagebox.showinfo("Select a habit", "Choose a habit to mark complete.")
            return
        name = self.table.item(selected[0], "values")[0]
        history = self.habits[name].setdefault("history", {})
        history[date.today().isoformat()] = True
        self.save_habits()
        self.refresh()

    def delete_habit(self) -> None:
        selected = self.table.selection()
        if not selected:
            messagebox.showinfo("Select a habit", "Choose a habit to remove.")
            return
        name = self.table.item(selected[0], "values")[0]
        if messagebox.askyesno("Remove habit", f"Remove ‘{name}’ and its history?"):
            del self.habits[name]
            self.save_habits()
            self.refresh()

    def refresh(self) -> None:
        for row in self.table.get_children():
            self.table.delete(row)
        today = date.today().isoformat()
        completed_today = 0
        for name, info in sorted(self.habits.items(), key=lambda item: item[0].casefold()):
            history = info.setdefault("history", {})
            is_done = bool(history.get(today, False))
            completed_today += is_done
            last_done = max((day for day, done in history.items() if done), default="—")
            self.table.insert("", tk.END, values=(name, f"{self.streak(history)} days", last_done, "Done" if is_done else "Pending"))
        self.summary.set(f"{completed_today} of {len(self.habits)} habits completed today")

    def build_ui(self) -> None:
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Treeview", background=CARD, foreground=TEXT, fieldbackground=CARD,
                        rowheight=38, borderwidth=0, font=("Segoe UI", 10))
        style.map("Treeview", background=[("selected", ACCENT)], foreground=[("selected", TEXT)])
        style.configure("Treeview.Heading", background=PANEL, foreground=MUTED,
                        font=("Segoe UI", 10, "bold"), relief="flat", padding=10)
        style.map("Treeview.Heading", background=[("active", PANEL)])

        tk.Label(self.root, text="Your habits", bg=BG, fg=TEXT,
                 font=("Segoe UI", 25, "bold")).pack(anchor="w", padx=28, pady=(24, 2))
        tk.Label(self.root, text="Small steps, consistently.", bg=BG, fg=MUTED,
                 font=("Segoe UI", 11)).pack(anchor="w", padx=30, pady=(0, 20))

        form = tk.Frame(self.root, bg=PANEL, padx=16, pady=16)
        form.pack(fill="x", padx=28, pady=(0, 14))
        self.entry = tk.Entry(form, bg=CARD, fg=TEXT, insertbackground=TEXT,
                              relief="flat", font=("Segoe UI", 11))
        self.entry.pack(side="left", fill="x", expand=True, ipady=10, padx=(0, 12))
        self.entry.bind("<Return>", lambda _event: self.add_habit())
        self.button(form, "Add habit", self.add_habit).pack(side="left")

        actions = tk.Frame(self.root, bg=BG)
        actions.pack(fill="x", padx=28, pady=(0, 10))
        self.button(actions, "Mark done today", self.mark_done).pack(side="left", padx=(0, 9))
        self.button(actions, "Remove habit", self.delete_habit, RED).pack(side="left")

        self.summary = tk.StringVar()
        tk.Label(self.root, textvariable=self.summary, bg=BG, fg=MUTED,
                 font=("Segoe UI", 10, "bold")).pack(anchor="w", padx=30, pady=(8, 10))

        table_frame = tk.Frame(self.root, bg=PANEL, padx=10, pady=10)
        table_frame.pack(fill="both", expand=True, padx=28, pady=(0, 24))
        columns = ("Habit", "Streak", "Last completed", "Today")
        self.table = ttk.Treeview(table_frame, columns=columns, show="headings")
        for column, width, anchor in (("Habit", 300, "w"), ("Streak", 105, "center"),
                                      ("Last completed", 150, "center"), ("Today", 100, "center")):
            self.table.heading(column, text=column)
            self.table.column(column, width=width, anchor=anchor)
        self.table.pack(fill="both", expand=True)

    @staticmethod
    def button(parent: tk.Widget, text: str, command, color: str = ACCENT) -> tk.Button:
        return tk.Button(parent, text=text, command=command, bg=color, activebackground=ACCENT_HOVER,
                         fg=TEXT, activeforeground=TEXT, relief="flat", cursor="hand2",
                         padx=16, pady=9, font=("Segoe UI", 10, "bold"))


if __name__ == "__main__":
    window = tk.Tk()
    app = HabitTracker(window)
    window.mainloop()
