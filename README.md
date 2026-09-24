# ⛳ Putt Putt

A friendly golf / mini-golf score tracker built with React Native (Expo) and a lightweight Node/Express backend. Track rounds, keep per-player scores during a game, follow your index and stats over time, save courses, and use the app in English, Spanish, or Korean.

## Features

- **Live scoring** — add players and enter scores during a game; the current leader is highlighted in real time.
- **Rounds & history** — save finished games and browse recent rounds with details.
- **Stats** — index, total rounds, best/average differential, and a differential trend chart.
- **Courses** — save courses with rating and slope for reuse.
- **Profile & goals** — set a name, home club, and target, and track progress toward it.
- **Multi-language** — full UI in English, Spanish (Español), and Korean (한국어).
- **Persistent** — scores and preferences persist locally; rounds/courses/profile sync via the backend.

## Tech stack

| Layer | Stack |
|-------|-------|
| App | Expo SDK 57, React 19, React Native 0.86, React Navigation 7 |
| State | React Context + hooks, AsyncStorage |
| Backend | Node.js, Express 4, JSON file store |
| i18n | Custom lightweight `t()` translator (en / es / ko) |

## Project structure

```
Golf-App/
├── frontend/                 # Expo React Native app
│   ├── App.js                # Navigation (bottom tabs + stack)
│   ├── app.json              # Expo config
│   └── src/
│       ├── config.js         # API base URL (auto-detects LAN host)
│       ├── context/          # Rounds, Courses, Profile, Golfers, Language
│       ├── hooks/            # useHandicap (WHS calc), useStats
│       ├── i18n/             # translations.js (en/es/ko)
│       ├── pages/            # Home, Stats, Profile, Settings, AddRound, RoundDetail, Courses, History
│       └── styles.js
└── backend/                  # Express API
    └── src/
        ├── server.js         # App entry (port 3001)
        ├── db.js             # JSON file persistence (golf.json)
        └── routes/           # rounds, profile, courses, golfers
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) on your phone (must be the SDK 57 build), or an iOS Simulator / Android Emulator
- Your phone and computer on the **same Wi-Fi** network

## Getting started

### 1. Backend

```bash
cd backend
npm install
node src/server.js          # starts the API on http://localhost:3001
```

Data is stored in `backend/src/golf.json` (created on first write).

### 2. Frontend

```bash
cd frontend
npm install
npx expo start              # scan the QR with Expo Go, or press i / a
```

The app auto-detects the API host from the Expo dev server, so a physical
device reaches the backend over your LAN with no manual configuration. On web
and simulators it falls back to `localhost`. See `frontend/src/config.js`.

> **Note:** Expo Go on iOS only runs the latest SDK. This project targets
> **SDK 57** — make sure your Expo Go app is up to date, or use a Simulator.

## Backend API

Base URL: `http://<host>:3001`

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| GET/POST/DELETE | `/api/rounds`  | Manage saved rounds    |
| GET/PUT | `/api/profile`     | Get / update profile   |
| GET/POST/DELETE | `/api/courses` | Manage saved courses   |
| GET/POST/DELETE | `/api/golfers` | Manage players         |

## Scripts

**frontend/**

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run ios` | Open in iOS Simulator |
| `npm run android` | Open in Android Emulator |
| `npm run web` | Run in the browser |

**backend/**

| Command | Description |
|---------|-------------|
| `npm start` | Start the API |
| `npm run dev` | Start the API with nodemon (auto-reload) |

## License

Personal project — no license specified.
