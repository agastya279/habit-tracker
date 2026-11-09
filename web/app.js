const STORAGE_KEY = "daymark-habits-v1";
const weekLabels = ["S", "M", "T", "W", "T", "F", "S"];
const habitList = document.querySelector("#habit-list");
const toast = document.querySelector("#toast");
let habits = loadHabits();
let activeView = "today";
let toastTimer;

function loadHabits() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((habit) => habit && typeof habit.id === "string" && typeof habit.name === "string")
      .map((habit) => ({
        id: habit.id,
        name: habit.name,
        category: typeof habit.category === "string" ? habit.category : "Personal",
        goal: Math.min(7, Math.max(1, Number(habit.goal) || 5)),
        history: habit.history && typeof habit.history === "object" && !Array.isArray(habit.history) ? habit.history : {},
      }));
  } catch {
    return [];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function offsetDate(daysAgo) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function isDone(habit, date = new Date()) {
  return Boolean(habit.history[dateKey(date)]);
}

function streakFor(habit) {
  let count = 0;
  let cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  if (!isDone(habit, cursor)) cursor.setDate(cursor.getDate() - 1);
  while (isDone(habit, cursor)) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function render() {
  const today = new Date();
  document.querySelector("#date-stamp").textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long", month: "long", day: "numeric",
  }).format(today);
  const completed = habits.filter((habit) => isDone(habit)).length;
  const percent = habits.length ? Math.round((completed / habits.length) * 100) : 0;
  const weekCompletions = habits.reduce((total, habit) => total + Array.from({ length: 7 }, (_, index) => isDone(habit, offsetDate(index))).filter(Boolean).length, 0);

  document.querySelector("#stat-total").textContent = habits.length;
  document.querySelector("#stat-completed").innerHTML = `${completed} <small>/ ${habits.length}</small>`;
  document.querySelector("#stat-week").textContent = weekCompletions;
  document.querySelector("#progress-value").textContent = `${percent}%`;
  document.querySelector("#progress-ring").setAttribute("aria-label", `${percent} percent complete today`);
  document.querySelector("#progress-ring").classList.toggle("is-complete", percent === 100 && habits.length > 0);
  document.querySelector("#overview-title").textContent = habits.length && percent === 100 ? "You showed up for yourself." : "Make room for a small win.";
  document.querySelector("#overview-copy").textContent = habits.length ? `${completed} of ${habits.length} habits checked in today. Keep your own pace.` : "Every check-in is a promise kept to yourself.";
  document.querySelector("#page-title").textContent = activeView === "all" ? "Your habits, your pace." : "A little progress adds up.";
  document.querySelector("#today-label").textContent = activeView === "all" ? "YOUR ROUTINE" : "YOUR DAILY PRACTICE";
  document.querySelector("#habits-heading").textContent = activeView === "all" ? "All habits" : "Today's habits";
  document.querySelector("#empty-title").textContent = habits.length ? "No habits match that view." : "Start with one small thing.";
  document.querySelector("#empty-copy").textContent = habits.length ? "Try a different search or filter." : "A habit doesn't need to be impressive. It just needs to be yours.";

  const search = document.querySelector("#search-input").value.trim().toLocaleLowerCase();
  const filter = document.querySelector("#status-filter").value;
  const visible = habits.filter((habit) => {
    const matchesSearch = `${habit.name} ${habit.category}`.toLocaleLowerCase().includes(search);
    const matchesFilter = filter === "all" || (filter === "done" ? isDone(habit) : !isDone(habit));
    return matchesSearch && matchesFilter;
  }).sort((left, right) => left.name.localeCompare(right.name));
  document.querySelector("#list-count").textContent = `${visible.length} ${visible.length === 1 ? "habit" : "habits"}`;
  habitList.replaceChildren(...visible.map(createHabitCard));
  document.querySelector("#empty-state").hidden = visible.length > 0;
  document.querySelector("#dashboard-view").hidden = activeView === "insights";
  document.querySelector("#insights-view").hidden = activeView !== "insights";
  document.querySelectorAll(".nav-link").forEach((button) => {
    const selected = button.dataset.view === activeView;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-current", selected ? "page" : "false");
  });
  if (activeView === "insights") renderInsights();
}

function createHabitCard(habit) {
  const card = document.createElement("article");
  card.className = "habit-card";
  const done = isDone(habit);
  const info = document.createElement("div");
  const nameRow = document.createElement("div");
  nameRow.className = "habit-name-row";
  const marker = document.createElement("span");
  marker.className = "habit-marker";
  marker.setAttribute("aria-hidden", "true");
  const name = document.createElement("strong");
  name.className = "habit-name";
  name.textContent = habit.name;
  nameRow.append(marker, name);
  const meta = document.createElement("div");
  meta.className = "habit-meta";
  const category = document.createElement("span");
  category.className = "category-tag";
  category.textContent = habit.category;
  const goal = document.createElement("span");
  goal.textContent = `${habit.goal} days / week`;
  meta.append(category, goal);
  info.append(nameRow, meta);

  const week = document.createElement("div");
  week.className = "week-track";
  week.setAttribute("aria-label", "Last seven days");
  for (let index = 6; index >= 0; index -= 1) {
    const date = offsetDate(index);
    const day = document.createElement("span");
    day.className = "week-day";
    const label = document.createElement("span");
    label.textContent = weekLabels[date.getDay()];
    const dot = document.createElement("span");
    dot.className = `week-dot${isDone(habit, date) ? " done" : ""}${index === 0 ? " today" : ""}`;
    dot.textContent = isDone(habit, date) ? "✓" : "·";
    dot.setAttribute("aria-label", `${date.toLocaleDateString(undefined, { weekday: "long" })}: ${isDone(habit, date) ? "complete" : "not complete"}`);
    day.append(label, dot);
    week.append(day);
  }

  const actions = document.createElement("div");
  actions.className = "habit-actions";
  const streak = document.createElement("span");
  streak.className = "streak";
  streak.innerHTML = `<strong>${streakFor(habit)}</strong> day streak`;
  const check = document.createElement("button");
  check.className = `check-button${done ? " is-done" : ""}`;
  check.type = "button";
  check.dataset.action = "toggle";
  check.dataset.id = habit.id;
  check.setAttribute("aria-pressed", String(done));
  check.textContent = done ? "✓ Done" : "Mark today";
  const more = document.createElement("button");
  more.className = "more-button";
  more.type = "button";
  more.dataset.action = "edit";
  more.dataset.id = habit.id;
  more.setAttribute("aria-label", `Edit ${habit.name}`);
  more.textContent = "···";
  actions.append(streak, check, more);
  card.append(info, week, actions);
  return card;
}

function renderInsights() {
  const total = habits.length;
  const checkIns = habits.reduce((sum, habit) => sum + Array.from({ length: 7 }, (_, index) => isDone(habit, offsetDate(index))).filter(Boolean).length, 0);
  const best = habits.reduce((maximum, habit) => Math.max(maximum, streakFor(habit)), 0);
  const stats = [[checkIns, "Check-ins in the last seven days"], [best, "Longest current streak, in days"], [total, "Habits in your routine"]];
  document.querySelector("#insight-stats").replaceChildren(...stats.map(([value, label]) => {
    const item = document.createElement("article");
    item.className = "insight-stat";
    const count = document.createElement("strong");
    count.textContent = value;
    const caption = document.createElement("span");
    caption.textContent = label;
    item.append(count, caption);
    return item;
  }));

  const grid = document.querySelector("#activity-grid");
  grid.replaceChildren(...Array.from({ length: 28 }, (_, index) => {
    const date = offsetDate(27 - index);
    const count = habits.filter((habit) => isDone(habit, date)).length;
    const cell = document.createElement("div");
    cell.className = `activity-day${count ? " has-checkins" : ""}`;
    cell.title = `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}: ${count} check-ins`;
    const dayLabel = document.createElement("span");
    dayLabel.textContent = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const dayCount = document.createElement("strong");
    dayCount.textContent = count;
    cell.append(dayLabel, dayCount);
    return cell;
  }));

  const categories = new Map();
  habits.forEach((habit) => categories.set(habit.category, (categories.get(habit.category) || 0) + 1));
  const categoryList = document.querySelector("#category-list");
  const rows = [...categories.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([name, count]) => {
    const row = document.createElement("div");
    row.className = "category-row";
    const label = document.createElement("span");
    label.textContent = name;
    const value = document.createElement("span");
    value.textContent = `${count} ${count === 1 ? "habit" : "habits"}`;
    row.append(label, value);
    return row;
  });
  if (!rows.length) {
    const message = document.createElement("p");
    message.className = "list-count";
    message.textContent = "Add a habit and your category mix will show up here.";
    rows.push(message);
  }
  categoryList.replaceChildren(...rows);
}

document.querySelector("#add-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get("name").trim();
  if (habits.some((habit) => habit.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    showToast("That habit is already on your list.");
    return;
  }
  habits.push({ id: crypto.randomUUID(), name, category: form.elements.category.value, goal: Number(form.elements.goal.value), history: {} });
  saveHabits();
  form.reset();
  form.elements.goal.value = 5;
  render();
  showToast("Habit added. Make it your own.");
  document.querySelector("#habit-name").focus();
});

habitList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const habit = habits.find((item) => item.id === button.dataset.id);
  if (!habit) return;
  if (button.dataset.action === "toggle") {
    const key = dateKey(new Date());
    if (habit.history[key]) delete habit.history[key];
    else habit.history[key] = true;
    saveHabits();
    render();
    return;
  }
  const dialog = document.querySelector("#edit-dialog");
  const form = document.querySelector("#edit-form");
  form.elements.id.value = habit.id;
  form.elements.name.value = habit.name;
  form.elements.category.value = habit.category;
  form.elements.goal.value = habit.goal;
  dialog.showModal();
  form.elements.name.focus();
});

document.querySelector("#edit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const id = form.elements.id.value;
  const name = form.elements.name.value.trim();
  if (habits.some((habit) => habit.id !== id && habit.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    showToast("That habit is already on your list.");
    return;
  }
  const habit = habits.find((item) => item.id === id);
  if (habit) Object.assign(habit, { name, category: form.elements.category.value, goal: Number(form.elements.goal.value) });
  saveHabits();
  document.querySelector("#edit-dialog").close();
  render();
  showToast("Habit updated.");
});

document.querySelector(".dialog-close").addEventListener("click", () => document.querySelector("#edit-dialog").close());
document.querySelector(".dialog-cancel").addEventListener("click", () => document.querySelector("#edit-dialog").close());
document.querySelector(".dialog-delete").addEventListener("click", () => {
  const form = document.querySelector("#edit-form");
  const habit = habits.find((item) => item.id === form.elements.id.value);
  if (!habit || !window.confirm(`Delete “${habit.name}” and its history?`)) return;
  habits = habits.filter((item) => item.id !== habit.id);
  saveHabits();
  document.querySelector("#edit-dialog").close();
  render();
  showToast("Habit deleted.");
});
document.querySelector("#search-input").addEventListener("input", render);
document.querySelector("#status-filter").addEventListener("change", render);
document.querySelectorAll(".nav-link").forEach((button) => button.addEventListener("click", () => {
  activeView = button.dataset.view;
  render();
}));

document.querySelector("#export-button").addEventListener("click", () => {
  const file = new Blob([JSON.stringify(habits, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `daymark-backup-${dateKey(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Your backup is ready.");
});

document.querySelector("#import-file").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported) || imported.some((habit) => (
      !habit || typeof habit.name !== "string" || !habit.name.trim() ||
      (habit.id !== undefined && (typeof habit.id !== "string" || !habit.id)) ||
      !habit.history || typeof habit.history !== "object" || Array.isArray(habit.history)
    ))) {
      throw new Error("Invalid habit backup");
    }
    const names = imported.map((habit) => habit.name.trim().toLocaleLowerCase());
    const ids = imported.map((habit) => habit.id).filter(Boolean);
    if (new Set(names).size !== names.length || new Set(ids).size !== ids.length) {
      throw new Error("Duplicate habits in backup");
    }
    if (!window.confirm(`Replace your ${habits.length} habits with ${imported.length} imported habits?`)) return;
    habits = imported.map((habit) => ({
      id: typeof habit.id === "string" ? habit.id : crypto.randomUUID(),
      name: habit.name.trim(),
      category: typeof habit.category === "string" ? habit.category : "Personal",
      goal: Math.min(7, Math.max(1, Number(habit.goal) || 5)),
      history: habit.history && typeof habit.history === "object" && !Array.isArray(habit.history) ? habit.history : {},
    }));
    saveHabits();
    render();
    showToast("Backup imported.");
  } catch {
    showToast("That file is not a valid habit backup.");
  } finally {
    event.target.value = "";
  }
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}

render();