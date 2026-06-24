# The Echoes of the Past - Audio Memory Game

A futuristic, sci-fi-themed web application for event-based puzzle competitions.

## Features
- **Cyberpunk Terminal UI**: Immersive sci-fi experience with CRT effects and glowing aesthetics.
- **Audio Identification**: Participants listen to nostalgic clips and decrypt memory fragments.
- **Live Event Mode (Admin DJ)**: Admin controls a single merged MP3 file from their dashboard. Participants focus on identification without individual player controls.
- **Wordle Integration (Master Override)**: Correct song guesses reward players with scrambled letters. Solve the final 6-letter secret word at any time to override the system and win early.
- **Dynamic Hint System**: Unlocks hints based on failed attempts (Level 1 at 2 fails, Level 2 at 4 fails).
- **Admin Dashboard**: Manage puzzles, set reward letters, configure the final secret word, and track team progress.
- **Leaderboard**: Real-time rankings based on completion and speed.
- **Completion Codes**: Securely generated codes for proof of mission success.

## Tech Stack
- **Frontend**: Next.js 14+, Tailwind CSS v4, Framer Motion.
- **Backend**: Next.js API Routes, MongoDB (Mongoose).
- **Audio**: Howler.js for precise control.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_PASSWORD=your_admin_panel_password
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Assets
- Place background sound effects in `public/sounds/`.
- Place puzzle audio files in the `public/` directory (e.g., `public/miffy.mp3`).
- The system will look for these paths when configured in the Admin Panel.

### 4. Run Development Server
```bash
npm run dev
```

## Admin Access
- URL: `/admin/login`
- Use the `ADMIN_PASSWORD` defined in your environment variables (default fallback is `admin123`).
- **Features**: 
  - Add/Edit/Delete puzzles with specific reward letters.
  - Set the global **Target Word** (6 letters) in the Settings tab.
  - View active teams and progress.

## Gameplay Flow
1. **Join**: Teams enter their Name and a unique Access ID.
2. **Solve**: Listen to the audio and type the identification. Correct guesses provide a **Reward Letter**.
3. **Override**: Switch to the **Master Override** tab at any time to guess the final 6-letter word using collected letters.
4. **Hints**: If stuck, hints appear after 2 and 4 failed attempts.
5. **Win**: Complete all nodes OR successfully solve the Master Override to receive the Unique Completion Hash.
