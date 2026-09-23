# Quiz Builder

A full-stack web application for creating, managing, and inspecting custom quizzes with multiple question types. Built with an Express.js and Prisma (SQLite) backend and a Next.js (App Router) and Tailwind CSS frontend.

---

## Tech Stack

### Backend
- Node.js and Express.js
- TypeScript
- Prisma ORM
- SQLite (default, easily switchable to PostgreSQL via DATABASE_URL)
- Zod (schema validation)
- CORS and dotenv

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form with Zod resolver
- Lucide React (icons)

---

## Project Structure

```text
quiz-builder/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.ts             # Sample data seeder
│   ├── src/
│   │   ├── controllers/        # HTTP request controllers
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Prisma business logic layer
│   │   ├── types/              # TypeScript interfaces and types
│   │   ├── validations/        # Zod validation schemas
│   │   ├── app.ts              # Express application configuration
│   │   ├── index.ts            # Server entrypoint
│   │   └── prisma.ts           # Prisma client instance
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── create/         # Dynamic quiz builder page
│   │   │   ├── quizzes/        # Quizzes list dashboard
│   │   │   │   └── [id]/       # Read-only quiz inspection page
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/         # Shared UI components (Navbar, etc.)
│   │   ├── services/           # Typed API client
│   │   └── types/              # Frontend TypeScript definitions
│   ├── .env.local.example
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Default `.env` configuration:
   ```env
   PORT=4000
   DATABASE_URL="file:./dev.db"
   CORS_ORIGIN="http://localhost:3000"
   ```

4. Push the Prisma database schema:
   ```bash
   npx prisma db push
   ```

5. (Optional) Seed the database with sample quizzes:
   ```bash
   npm run prisma:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:4000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Default `.env.local` configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be accessible at `http://localhost:3000`.

---

## Supported Question Types

The quiz builder supports three distinct question types:

1. **Boolean**: True / False radio buttons where one answer is designated as correct.
2. **Input**: Short open-ended text answer with an optional expected answer reference.
3. **Checkbox**: Multiple choice question supporting dynamic addition and removal of options, with one or more designated correct answers.

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/quizzes` | List all quizzes with title, question count, and creation timestamp |
| `GET` | `/quizzes/:id` | Retrieve full quiz details including all questions and options |
| `POST` | `/quizzes` | Create a new quiz with nested questions and options |
| `DELETE` | `/quizzes/:id` | Delete a quiz and cascade deletion of related questions |
| `GET` | `/health` | Service health check |

### Sample Payload for `POST /quizzes`

```json
{
  "title": "Frontend Essentials",
  "questions": [
    {
      "title": "Is HTML a programming language?",
      "type": "BOOLEAN",
      "order": 0,
      "correctAnswer": "false",
      "options": [
        { "text": "True", "isCorrect": false },
        { "text": "False", "isCorrect": true }
      ]
    },
    {
      "title": "What CSS unit is relative to the root font size?",
      "type": "INPUT",
      "order": 1,
      "correctAnswer": "rem"
    },
    {
      "title": "Which of the following are valid CSS display values?",
      "type": "CHECKBOX",
      "order": 2,
      "options": [
        { "text": "flex", "isCorrect": true },
        { "text": "grid", "isCorrect": true },
        { "text": "block", "isCorrect": true },
        { "text": "slider", "isCorrect": false }
      ]
    }
  ]
}
```

---

## Code Quality and Verification

Run linter checks across the codebase:
- Backend: `npm run lint --prefix backend`
- Frontend: `npm run lint --prefix frontend`

Check production build:
- Backend: `npm run build --prefix backend`
- Frontend: `npm run build --prefix frontend`
