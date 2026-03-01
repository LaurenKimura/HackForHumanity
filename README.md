# BloomFocus - Mind Garden

A gamified study timer and productivity app that rewards focused study sessions with a virtual garden you can grow and customize. Built with React and Firebase.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Firestore Data Model](#firestore-data-model)
- [App Routes](#app-routes)
- [Components](#components)
- [Points & Rewards System](#points--rewards-system)
- [Garden & Drag-and-Drop](#garden--drag-and-drop)
- [Music & Audio](#music--audio)
- [Guest Mode](#guest-mode)
- [Deployment](#deployment)
- [Scripts](#scripts)

---

## Overview

BloomFocus (also referred to as "Mind Garden") is a productivity web app designed around the concept that **"the brain grows constantly... just like a garden."** Users study using a Pomodoro-style countdown timer, complete tasks on a to-do list, and earn **sprouts** (points) that can be spent on flowers, animals, and decorations to place in their own virtual garden via drag-and-drop.

The app features a warm, botanical aesthetic with hand-drawn art assets, a Cherry Bomb One cursive font, sky-to-green gradient backgrounds, and frosted glass UI elements.

---

## Features

### Study Timer
- Pomodoro-style countdown timer with customizable duration (1-120 minutes)
- Increment/decrement buttons and direct input for setting time
- Start, pause, and reset controls
- Background music playlist with 11 tracks that auto-advance and loop
- Completion sound effect when the timer reaches zero
- Animated sky scene with clouds and rolling green hills

### Task Management
- Create, rename, and delete tasks
- Mark tasks as complete/incomplete with checkboxes
- Tasks sorted with incomplete items displayed first
- Real-time sync with Firebase Firestore for logged-in users

### Points & Rewards
- Earn 2 sprouts for every 5 minutes of focused study time
- Earn 1 sprout for each completed task
- Leftover study minutes carry over to the next block (e.g., 7 minutes = 2 sprouts + 2 minutes carried over)
- Points persist in Firestore for logged-in users

### Interactive Garden
- Full-page garden canvas with hand-drawn background and fence art
- 12 purchasable items ranging from 5 to 60 sprouts (flowers, bushes, butterflies, animals, decorations)
- Drag items from the store carousel directly onto the garden to place them
- Reposition placed items by dragging them to new locations
- Items render with depth sorting based on vertical position
- Per-item scale factors for natural size variation
- Inline store carousel with left/right navigation and pagination dots

### Authentication
- Email/password sign up and sign in
- Google OAuth integration
- Guest mode for trying the app without an account

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Frontend Framework | React | 19.2.0 |
| Routing | React Router DOM | 7.13.1 |
| Build Tool | Vite | 7.3.1 |
| CSS Framework | Tailwind CSS | 4.2.1 |
| Backend / Database | Firebase (Auth + Firestore) | 12.10.0 |
| Linting | ESLint | 9.39.1 |
| Primary Font | Cherry Bomb One | Google Fonts |

---

## Project Structure

```
HackForHumanity/
├── index.html                     # HTML entry point (loads Google Fonts)
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite build configuration
├── eslint.config.js               # ESLint rules
├── firebase.json                  # Firebase hosting and auth config
├── firestore.rules                # Firestore security rules
├── firestore.indexes.json         # Firestore index definitions
├── .firebaserc.example            # Firebase project reference template
│
├── public/                        # Static assets
│   ├── icon.png                   # App mascot icon
│   ├── background.png             # Garden scene background
│   ├── fence.png                  # Garden fence overlay
│   ├── stone_pathway.png          # Garden pathway
│   ├── flower_one.png             # Pink flower
│   ├── flower_two.png             # Yellow flower
│   ├── flower_three.png           # Purple flower
│   ├── bush_one.png               # White flower bush
│   ├── bush_two.png               # Pink flower bush
│   ├── apple_tree.png             # Apple tree decoration
│   ├── bunny.png                  # Bunny decoration
│   ├── derpy_frog.png             # Frog decoration
│   ├── orange_butterfly.png       # Orange butterfly
│   ├── blue_butterfly.png         # Blue butterfly
│   ├── picnic.png                 # Picnic set decoration
│   ├── pond.png                   # Pond decoration
│   ├── endTimerSound.mp3          # Timer completion sound
│   └── music1.mp3 - music11.mp3  # Study session music playlist
│
├── src/
│   ├── main.jsx                   # React entry point, BrowserRouter setup
│   ├── App.jsx                    # Root component, state management, routing
│   ├── index.css                  # Global styles (Tailwind imports)
│   │
│   ├── components/
│   │   ├── LandingPage.jsx        # Welcome screen with mascot and CTA
│   │   ├── AuthForm.jsx           # Sign in / sign up form
│   │   ├── NavBar.jsx             # Top navigation bar
│   │   ├── DashboardPage.jsx      # Main dashboard layout (stats, timer, tasks)
│   │   ├── PointsSummary.jsx      # Stat cards (sprouts, study time, tasks done)
│   │   ├── StudyTimer.jsx         # Countdown timer with sky scene and music
│   │   ├── TaskSidebar.jsx        # To-do list with CRUD operations
│   │   ├── YourGardenPage.jsx     # Interactive garden with drag-and-drop
│   │   ├── GardenStorePage.jsx    # Standalone store page
│   │   ├── StorePanel.jsx         # Store items list component
│   │   └── GardenView.jsx         # Garden preview component
│   │
│   ├── firebase/
│   │   ├── config.js              # Firebase app initialization
│   │   ├── auth.js                # Auth functions (sign up, sign in, Google, logout)
│   │   └── firestore.js           # All Firestore CRUD operations
│   │
│   ├── hooks/
│   │   └── useStudyTimer.js       # Custom hook for countdown timer logic
│   │
│   ├── utils/
│   │   └── time.js                # Time formatting (MM:SS, human-readable durations)
│   │
│   └── data/
│       └── flowers.js             # Flower/decoration catalog (12 items)
│
└── dist/                          # Production build output (generated)
```

---

## Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** (comes with Node.js)
- A **Firebase project** with Authentication and Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/LaurenKimura/HackForHumanity.git
cd HackForHumanity

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

All variables are prefixed with `VITE_` so they are accessible in the client bundle via `import.meta.env`.

If any variables are missing, the app will display a configuration error screen listing the missing keys.

---

## Firebase Setup

### Authentication

Enable the following sign-in providers in the Firebase Console under **Authentication > Sign-in method**:

1. **Email/Password** - Native email authentication
2. **Google** - OAuth sign-in

### Firestore

Create a Firestore database. The app uses the following security rules (update for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // Replace with proper rules for production
    }
  }
}
```

### Hosting (Optional)

Firebase Hosting is configured to serve from the `dist/` directory with SPA rewrites:

```bash
# Build and deploy
npm run build
firebase deploy
```

---

## Firestore Data Model

```
/users/{uid}
│
├── name: string                    # Display name
├── email: string                   # Email address
├── totalPoints: number             # Lifetime sprouts earned
├── totalStudyTime: number          # Total study time in seconds
│
├── /tasks/{taskId}
│   ├── title: string               # Task description
│   ├── completed: boolean          # Completion status
│   └── createdAt: timestamp        # Creation timestamp
│
└── /garden/{itemId}
    ├── flowerId: string            # References a flower ID from flowers.js
    ├── x: number                   # Horizontal position (0-100%)
    ├── y: number                   # Vertical position (0-100%)
    └── purchasedAt: timestamp      # Purchase timestamp
```

### Firestore Functions

| Function | Description |
|----------|-------------|
| `ensureUserProfile(user)` | Creates or validates a user document on sign-up |
| `listenToUserProfile(uid, onData, onError)` | Real-time listener for user stats |
| `addStudyProgress(uid, minutes, points)` | Atomically updates study time and points |
| `addPoints(uid, points)` | Awards points (e.g., for task completion) |
| `listenToTasks(uid, onData, onError)` | Real-time listener for user's tasks |
| `createTask(uid, title)` | Adds a new task |
| `updateTask(uid, taskId, updates)` | Modifies a task (title, completed status) |
| `removeTask(uid, taskId)` | Deletes a task |
| `listenToGarden(uid, onData, onError)` | Real-time listener for garden items |
| `purchaseFlower(uid, flower, x, y)` | Buys a flower, deducts points, saves position |
| `updateGardenItemPosition(uid, itemId, x, y)` | Moves a placed garden item |

All point-related operations use Firestore **transactions** to prevent race conditions.

---

## App Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `DashboardPage` | Main view with stats, study timer, and to-do list |
| `/garden` | `YourGardenPage` | Full-page interactive garden with store carousel |
| `/store` | `GardenStorePage` | Standalone store page |
| `*` | Redirects to `/` | Catch-all for unknown routes |

### Navigation Flow

1. **Landing Page** - Welcome screen with mascot and "Start watering your brain" button
2. **Auth Screen** - Sign in, sign up, or enter guest mode
3. **Dashboard** - Study timer + to-do list + stats summary
4. **Your Garden** - Interactive garden canvas with inline store

---

## Components

### Page Components

| Component | File | Description |
|-----------|------|-------------|
| `LandingPage` | `LandingPage.jsx` | Welcome screen with sky-blue background, mascot image, tagline, and CTA button |
| `DashboardPage` | `DashboardPage.jsx` | Two-column grid layout: TaskSidebar (320px) on the left, StudyTimer filling the right. PointsSummary stats displayed above. |
| `YourGardenPage` | `YourGardenPage.jsx` | Full-viewport garden scene with floating navbar, background/fence images, drag-and-drop system, and store carousel |
| `GardenStorePage` | `GardenStorePage.jsx` | Standalone store using StorePanel component |

### Feature Components

| Component | File | Description |
|-----------|------|-------------|
| `AuthForm` | `AuthForm.jsx` | Toggleable sign-in/sign-up form with email, password, display name fields. Cream card styling. |
| `NavBar` | `NavBar.jsx` | Top header with mascot icon and navigation links (dashboard, your garden). Active tab highlighted in green. |
| `StudyTimer` | `StudyTimer.jsx` | Animated sky scene (gradient, clouds, hills) with large countdown display, editable duration, play/pause/reset, and music playlist integration |
| `TaskSidebar` | `TaskSidebar.jsx` | Botanical journal-style to-do list with add, edit, toggle, and delete functionality. Frosted glass card. |
| `PointsSummary` | `PointsSummary.jsx` | Three stat cards in a row: sprouts, study time, tasks done. Frosted glass effect. |

### Custom Hooks

| Hook | File | Description |
|------|------|-------------|
| `useStudyTimer` | `useStudyTimer.js` | Manages countdown state with `start()`, `pause()`, `reset()` controls. Returns `remainingSeconds` and `isRunning`. Auto-resets when initial duration changes. |

### Utilities

| Function | File | Description |
|----------|------|-------------|
| `formatSecondsToClock(seconds)` | `time.js` | Converts seconds to `MM:SS` or `HH:MM:SS` format |
| `formatStudyDuration(totalSeconds)` | `time.js` | Human-readable format like `1h 30m` or `45m` |

---

## Points & Rewards System

### Earning Sprouts

| Action | Reward |
|--------|--------|
| Study for 5 minutes | 2 sprouts |
| Complete a task | 1 sprout |

### Study Timer Point Calculation

- Points are awarded in blocks: every **5 minutes** of study time earns **2 sprouts**
- **Carryover system**: Leftover minutes are saved and added to the next study session
  - Example: Study 12 minutes = 2 blocks (10 min) = 4 sprouts, with 2 minutes carried over
  - Next session: Those 2 minutes count toward the next 5-minute block
- Points sync to Firestore in real-time for logged-in users
- Guest mode tracks points locally (starting balance: 9999 for testing)

### Spending Sprouts

Sprouts are spent in the garden store to purchase decorations:

| Item | Cost | Scale |
|------|------|-------|
| Pink Flower | 5 sprouts | 1x |
| Yellow Flower | 5 sprouts | 1x |
| Purple Flower | 5 sprouts | 1x |
| White Flower Bush | 10 sprouts | 1x |
| Pink Flower Bush | 10 sprouts | 1x |
| Orange Butterfly | 15 sprouts | 1x |
| Blue Butterfly | 15 sprouts | 1x |
| Frog | 20 sprouts | 0.5x |
| Bunny | 25 sprouts | 0.5x |
| Apple Tree | 30 sprouts | 3x |
| Picnic | 60 sprouts | 1.75x |
| Pond | 60 sprouts | 2x |

---

## Garden & Drag-and-Drop

The garden page (`/garden`) features an interactive canvas where users can place and arrange purchased items.

### How It Works

1. **Store Carousel** - Bottom of the garden page shows 4 items at a time. Navigate with arrow buttons or pagination dots.
2. **Drag to Place** - Click and drag an item from the carousel onto the garden scene. If you can afford it, the item is purchased and placed at the drop location.
3. **Reposition** - Click and drag any placed item to move it to a new location.
4. **Depth Sorting** - Items lower on the screen (higher y-value) appear in front of items higher up, creating a natural depth effect.

### Technical Implementation

- Positions are stored as **percentages** (0-100%) relative to the garden scene container
- Mouse events (`mousedown`, `mousemove`, `mouseup`) handle all drag interactions
- A ghost image follows the cursor during drag operations
- A dashed border drop zone hint appears while dragging
- For logged-in users, positions sync to Firestore via `purchaseFlower()` and `updateGardenItemPosition()`
- For guests, positions are stored in React state (lost on refresh)

---

## Music & Audio

### Study Music Playlist

The timer includes a background music system with 11 tracks (`music1.mp3` through `music11.mp3`):

- Music starts when the timer is started
- Music pauses when the timer is paused
- Tracks auto-advance when one finishes
- After track 11, the playlist loops back to track 1
- Volume: 40%

### Timer Completion Sound

When the countdown reaches zero, `endTimerSound.mp3` plays once at 70% volume to notify the user that their study session is complete.

---

## Guest Mode

Guest mode allows users to try the app without creating an account:

- Accessible via the **"guest mode"** link on the login screen
- All data (tasks, garden items, points) is stored in React state only
- **Starting balance: 9999 sprouts** (for testing/exploration)
- Data is **not persisted** - everything resets on page refresh
- All features work identically to logged-in mode except for data persistence

---

## Deployment

### Firebase Hosting

```bash
# Build the production bundle
npm run build

# Deploy to Firebase
firebase deploy
```

The app is configured for Firebase Hosting with:
- Build output from `dist/` directory
- SPA rewrites (all routes serve `index.html`)
- Automatic HTTPS

### Other Hosting Providers

Since this is a standard Vite/React SPA, it can be deployed to any static hosting service (Vercel, Netlify, etc.). Just ensure:
1. Build command: `npm run build`
2. Output directory: `dist`
3. SPA rewrites are configured (all routes to `index.html`)
4. Environment variables are set

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server at `localhost:5173` |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on source files |

---

## Design System

### Colors

| Role | Value | Usage |
|------|-------|-------|
| Primary Brown | `#5C4033` | Text, buttons, headings |
| Olive Green | `#6B7A3D` | Badges, active states, accents |
| Light Green | `#d8ecac` | Active nav tabs, card backgrounds |
| Gold | `#C4A76C` | Borders, secondary buttons, accents |
| Sky Blue | `#A8DFF0` | Gradient backgrounds |
| Grass Green | `#c4e280` | Gradient backgrounds, garden page |

### Typography

- **Cherry Bomb One** (cursive) - Used throughout the app for all text. Gives a playful, hand-drawn feel.
- Font sizes range from 12px (labels) to 100px (garden page title)

### Visual Style

- **Frosted glass cards** - Semi-transparent white backgrounds with `backdrop-filter: blur(8px)` and soft borders
- **Sky-to-green gradients** - Background transitions from sky blue at the top to grass green at the bottom
- **Rounded corners** - 12px-24px border radius on all interactive elements
- **Warm, botanical aesthetic** - Nature-inspired color palette with hand-drawn art assets

---

## License

See [LICENSE](LICENSE) for details.
