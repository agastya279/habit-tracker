# Habit Tracker Wiki

This page captures a more detailed overview of the project beyond the main README and is intended as a companion reference for contributors, maintainers, and curious users.

## Project goal

Habit Tracker is a privacy-first personal routines app that works in three modes:

- a responsive website that can be installed as a PWA
- an Android APK built from the same underlying web experience
- a lightweight Python desktop app for the same local, offline workflow

The project is designed around the principle that data should remain on the user's device. There is no sign-in flow, cloud account, or remote sync layer. Each app variant manages its own local storage and focuses on helping people stay consistent without creating friction.

## High-level architecture

The repository keeps the project simple and portable by separating the app experiences while sharing the same user model and privacy-first behavior.

### 1. Web frontend

Files in `web/` define the website experience:

- `index.html` contains the app structure and UI views
- `styles.css` styles the responsive interface
- `app.js` powers habit logic, rendering, state management, and interactions
- `manifest.json` enables installability as a PWA
- `service-worker.js` enables offline caching and local app shell behavior

The website is built around local browser storage. That gives the web app a fast, self-contained experience while still supporting data export and import.

### 2. Desktop app

`habit_tracker.py` is a standalone Python app using Tkinter. It provides a desktop-friendly interface for:

- creating and organizing habits
- tracking daily completions
- reviewing streaks and summaries
- editing or deleting habits
- exporting and restoring local JSON data

The desktop app uses the Python standard library only, which keeps setup easy for users who do not want a full web or mobile toolchain.

### 3. Android packaging

The Android build is created by wrapping the web app in Capacitor. The workflow is managed with:

- `capacitor.config.json`
- `package.json`
- a generated `android/` build output after local setup

This keeps the Android implementation aligned with the same core user experience while avoiding duplicate app logic.

## Core user workflow

The repo is centered on a straightforward daily routine:

1. Add a habit with a name and category
2. Set a weekly goal or target frequency
3. Mark completion for a day
4. Review progress via the daily summary, streaks, and insights views
5. Export data as a backup or restore from a saved JSON file

A habit is treated as a single local record with a calendar-based history. The app prevents duplicate completion entries for the same day and uses local date logic to compute streaks across consecutive active days.

## Data model and privacy model

The project intentionally avoids centralized storage.

- The website stores data in browser local storage
- The desktop app stores data in a local `habits.json` file
- The Android app stores data in its local app environment

This means user data stays on the device where it is created. The repository itself does not include personal habit data; local data files are excluded from version control, and import/export is used as the main portability mechanism.

## Why the project is structured this way

The repo favors simplicity over infrastructure complexity. Rather than introducing a backend service, accounts, or cloud synchronization, the app focuses on:

- offline reliability
- low setup friction
- local-first personal data handling
- repeatable daily habit tracking without subscription requirements

This makes the project especially suitable for lightweight personal productivity tooling and experimentation with small, self-contained app patterns.

## Contribution approach

Contributors can improve the project in several ways:

- improve the web UX and visual design
- refine the desktop workflow and accessibility
- enhance streak logic and summary reporting
- add tests or validation around data import/export
- improve packaging and release automation for Android and deployment

Because the project is intentionally small and local-first, most changes are likely to be in front-end behavior, local state handling, or app packaging rather than backend services or database architecture.

## Operational notes

A few practical notes for maintainers:

- The website should be served from the `web/` directory to ensure the PWA cache and service worker work correctly.
- Python support for Tkinter may require OS packages such as `python3-tk` on Linux.
- Local Android builds require Java and Android SDK configuration before running Gradle.
- Releases are managed as versioned builds with a generated APK artifact.

## Summary

Habit Tracker is a deliberately compact project that brings together three user experiences around one very simple goal: helping people build routines without relying on accounts, cloud sync, or complex infrastructure. The repository is stronger as a personal productivity app because it stays local-first, portable, and easy to understand.
