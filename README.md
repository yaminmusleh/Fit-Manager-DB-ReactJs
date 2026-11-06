# Fit Manager – Gym Management System

A web-based gym management application built with React that provides a centralized platform for managing daily gym operations. The system includes dedicated modules for managing members, memberships, trainers, training sessions, gym equipment, maintenance records, and locker assignments.

## Features

- **Dashboard:** Overview of gym management modules and live record counts.
- **Member Management:** Manage gym member information and membership statuses.
- **Membership Management:** Track active, expired, and suspended memberships.
- **Trainer Management:** Manage trainers, their specializations, and coaching information.
- **Training Sessions:** Schedule training sessions and associate trainers with members.
- **Equipment Management:** Organize gym equipment, categories, locations, and condition statuses.
- **Maintenance Management:** Track equipment maintenance and repair progress.
- **Locker Management:** Monitor locker availability and assign lockers to members.

## Technologies Used

- React 19
- JavaScript
- Vite
- React Router
- Material UI (MUI)
- Emotion

## Project Structure

```text
src/
├── layouts/
├── pages/
│   ├── Home.jsx
│   ├── Members.jsx
│   ├── Memberships.jsx
│   ├── Trainers.jsx
│   ├── Sessions.jsx
│   ├── Equipment.jsx
│   ├── Maintenance.jsx
│   └── Lockers.jsx
├── router.jsx
├── App.jsx
└── main.jsx
```

## Getting Started

### Prerequisites

- Node.js
- npm
- The Fit Manager backend API running locally

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yaminmusleh/Fit-Manager-DB-ReactJs.git
```

2. Navigate to the project directory:

```bash
cd Fit-Manager-DB-ReactJs
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL provided by Vite (usually http://localhost:5173).

### Available Scripts

| Command | Description |
|---|---|
| npm run dev | Start development server |
| npm run build | Build the application |
| npm run preview | Preview production build |
| npm run lint | Run ESLint |

## Backend Integration

The frontend communicates with a backend API running at:

`http://localhost:5000`

The application uses API endpoints to retrieve and manage data across its different modules.

**Note:** The backend and database must be configured and running separately for the application's data-management features to work.

## Author

**Yamin Musleh**

GitHub: https://github.com/yaminmusleh
