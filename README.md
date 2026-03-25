# TechLint To-Do Board

A modern Kanban-style task management application built with Next.js, featuring authentication, drag-and-drop board management, and real-time data persistence with Firebase.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Firebase project (for authentication and database)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd to-do
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:

Copy the example environment file and fill in your values:
```bash
cp .env.example .env.local
```

Edit `.env.local` with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes (login, register)
│   ├── (board)/           # Board routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to board)
├── components/            # Reusable UI components
│   ├── icons/             # Icon components
│   └── ui/                # UI component library
│       ├── atoms/         # Basic components (Button, Input, etc.)
│       ├── molecules/     # Composite components
│       └── organisms/     # Complex components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Auth forms
│   │   ├── hooks/         # Auth hooks
│   │   ├── store/         # Redux store
│   │   └── types.ts       # Type definitions
│   ├── board/             # Board feature
│   │   ├── components/    # Board components
│   │   ├── dnd/           # Drag and drop logic
│   │   ├── hooks/         # Board hooks
│   │   ├── store/         # Board Redux store
│   │   └── types.ts       # Type definitions
│   └── history/           # History feature
├── lib/                   # Third-party library configurations
│   └── firebase/          # Firebase configuration
└── __tests__/             # General tests
```

## Features

### Authentication
- User registration with email/password
- User login with email/password
- Protected routes
- Persistent authentication state

### Board Management
- Create, edit, and delete categories (columns)
- Create, edit, and delete tickets
- Drag and drop tickets between categories
- Drag and drop to reorder categories
- Ticket priority levels (Low, Medium, High, Urgent)
- Ticket due date/expiry tracking
- Draft indicator for unsaved changes

### History Tracking
- Track board changes (category additions, deletions, renames)
- Track ticket changes (creations, updates, deletions, moves)
- View history by board or by ticket

### UI Components
- Reusable component library with atoms, molecules, and organisms
- Form validation
- Loading states (spinners)
- Modal system
- Password visibility toggle

## Testing

The project includes comprehensive test coverage using Jest and React Testing Library.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files are located in:
- `src/__tests__/` - General tests
- Feature directories contain their own test files

## Firebase Security Rules

When deploying to Firebase, use the following security rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId}/boards/{boardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId}/boards/{boardId}/categories/{categoryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId}/boards/{boardId}/categories/{categoryId}/tickets/{ticketId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Docker Setup

This project includes Docker support for containerized deployment.

### Prerequisites

- Docker
- Docker Compose

### Quick Start

1. Clone the repository and navigate to the project directory

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Fill in your Firebase configuration in `.env`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Build and run the container:
   ```bash
   docker-compose up --build
   ```

5. Access the application at [http://localhost:3000](http://localhost:3000)

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Build and start the container |
| `docker-compose up` | Start the container (use existing image) |
| `docker-compose down` | Stop and remove containers |
| `docker-compose logs -f` | View logs |
| `docker-compose restart` | Restart the container |

### Docker Configuration

- **Base Image**: Node.js 18 Alpine
- **Multi-stage Build**: Optimized for production with separate deps and builder stages
- **Standalone Output**: Uses Next.js standalone mode for smaller image size
- **Health Check**: Container includes health checks for reliability

## License

MIT
