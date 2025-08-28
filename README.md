# Pong Game with User Management

A real-time multiplayer Pong game built with Node.js, Socket.io, TypeScript, and Tailwind CSS.

## Technologies Used

### Backend
- **Node.js** with **Fastify** - Fast web framework
- **Socket.IO** - Real-time bidirectional communication
- **Sequelize** with **SQLite** - Database ORM and storage
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Frontend
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **HTML5 Canvas** - Game rendering
- **Socket.IO Client** - Real-time client communication

## Features Implemented

### ✅ Modern Frontend Development
- **TypeScript**: All frontend code is written in TypeScript for type safety
- **Tailwind CSS**: Responsive, utility-first CSS framework instead of custom CSS
- **Component Architecture**: Modular TypeScript files for different concerns
- **Type Definitions**: Comprehensive interfaces for all data structures

### ✅ Standard User Management & Authentication
- **Secure Registration**: Users can securely subscribe to the website with username/password
- **Secure Login**: Registered users can securely log in with JWT authentication
- **Unique Display Names**: Users can select and update unique display names for tournaments
- **Profile Updates**: Users can update their information (display name, email)
- **Avatar Upload**: Users can upload custom avatars with default fallback option
- **Friend System**: Users can add others as friends and view their online status
- **User Profiles**: Display comprehensive stats including wins, losses, and win rate
- **Match History**: Complete 1v1 game history with dates and details, accessible to logged-in users

### 🎮 Game Features
- **Real-time Multiplayer**: Socket.IO powered real-time gameplay
- **Automatic Matchmaking**: Players are automatically matched into rooms
- **Score Tracking**: Games played to 5 points with automatic win detection
- **Match Recording**: All games are automatically saved to database
- **Statistics Updates**: User win/loss stats updated after each game

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password hashing for security
- **Protected Routes**: All user data routes require authentication
- **Socket Authentication**: Real-time connections are authenticated

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### User Management
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/profile/:userId` - Get user profile by ID
- `GET /api/user/friends` - Get user's friends list
- `POST /api/user/friend-request` - Send friend request
- `POST /api/user/friend-response` - Respond to friend request
- `GET /api/user/match-history` - Get user's match history

## Database Schema

### Users Table
- `id`, `username`, `password`, `displayName`, `email`, `avatar`
- `wins`, `losses`, `isOnline`, `lastSeen`

### Friendships Table
- `userId`, `friendId`, `status` (pending/accepted/blocked)

### Matches Table
- `player1Id`, `player2Id`, `player1Score`, `player2Score`
- `winnerId`, `duration`, `gameType`, `createdAt`

## Pages

1. **Login Page** (`/login.html`) - Registration and login forms
2. **Game Page** (`/`) - Main Pong game with real-time multiplayer
3. **Profile Page** (`/profile.html`) - Complete user dashboard with:
   - Profile management
   - Game statistics
   - Friends list with online status
   - Match history
   - Avatar upload

## Technologies Used

- **Backend**: Node.js, Fastify, Socket.IO
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT with @fastify/jwt
- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Real-time**: Socket.IO for game synchronization
- **Security**: bcrypt for password hashing

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the frontend assets:
   ```bash
   # Build Tailwind CSS
   npm run build:css

   # Compile TypeScript
   npm run build:ts
   ```

### Development

For development with automatic rebuilding:
```bash
npm run dev
```

This will start:
- Tailwind CSS watcher (rebuilds CSS on changes)
- TypeScript compiler in watch mode
- Node.js server

### Production

For production:
```bash
# Build assets once
npm run build:css
npm run build:ts

# Start the server
npm start
```

### Access the Application

Open browser and navigate to:
- Login: `http://localhost:3000/login.html`
- Game: `http://localhost:3000`
- Profile: `http://localhost:3000/profile.html`

## File Structure

```
├── package.json              # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── pon-server.js           # Main server file
├── backend/                # Backend logic
│   ├── auth.js            # Authentication middleware
│   ├── db.js              # Database models
│   └── database.sqlite    # SQLite database
├── src/                   # TypeScript source files
│   ├── input.css         # Tailwind CSS input file
│   ├── auth.ts           # Authentication functions
│   ├── game.ts           # Game logic
│   ├── login.ts          # Login/register functions
│   └── profile.ts        # Profile management
└── public/               # Static files and compiled assets
    ├── index.html       # Main game page
    ├── login.html       # Login/register page
    ├── profile.html     # User profile page
    ├── style.css        # Compiled Tailwind CSS
    ├── *.js             # Compiled TypeScript files
    └── *.js.map         # Source maps
```

## Game Rules

- First player to 5 points wins
- Move mouse up/down to control paddle
- Automatic room creation and player matching
- Real-time synchronization across players
- Match results automatically saved to database

## User Features in Detail

### Profile Management
- Update display name and email
- Upload custom avatar (base64 encoded)
- View personal game statistics
- Real-time win/loss tracking

### Social Features
- Add friends by username
- View friends' online status
- See when friends were last active
- Friend request system with accept/reject

### Match History
- Complete history of all 1v1 games
- Shows opponent, score, result (win/loss)
- Displays game date and duration
- Accessible only to authenticated users

All features are fully functional and ready for use!
