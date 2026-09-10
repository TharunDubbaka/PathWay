# PathWay

PathWay is an AI-powered learning roadmap generator and teacher. It helps a learner turn a career or study goal into a structured roadmap, track progress through topics, generate study plans and quizzes, evaluate quiz answers, and receive adaptive learning analysis.

The project is split into:

- **FastAPI backend**: authentication, roadmap generation, progress, quizzes, study plans, dashboard data, and AI integrations.
- **React/Vite frontend**: the browser application used to create goals, view roadmaps, study, take quizzes, and inspect progress.
- **MongoDB**: persistence for users, sessions, and generated roadmaps.
- **Google Gemini**: generation of roadmaps, study content, quizzes, and adaptive recommendations.

## Features

- Account registration and login
- Password hashing with PBKDF2-HMAC-SHA256
- Database-backed bearer-token sessions
- AI-generated learning roadmaps based on:
  - Learning goal
  - Overall skill level
  - Existing skills and experience levels
  - Study hours per week
- Roadmap generation with phases, topics, summaries, durations, and resource links
- Background roadmap generation with job-status polling
- Topic completion and progress summaries
- Dashboard data for a roadmap
- AI-generated study plans
- AI-generated quizzes
- Quiz answer evaluation
- Adaptive progress analysis
- Protected frontend routes
- Vercel configuration for the Vite frontend

## Project Structure

```text
.
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Python dependencies
├── vercel.json                # Vercel build and SPA rewrite configuration
├── app/
│   ├── db/
│   │   ├── db.py              # MongoDB client and collections
│   │   └── testingdb.py       # Database testing helper
│   ├── models/                # Pydantic request models
│   ├── routes/                # FastAPI route handlers
│   └── services/              # Business logic and external integrations
└── frontend/
    ├── package.json           # Frontend scripts and dependencies
    ├── src/
    │   ├── api/               # Axios API modules
    │   ├── components/        # Shared React components
    │   ├── pages/             # Application pages
    │   ├── App.jsx            # Frontend routing
    │   └── auth.js            # Browser token storage helpers
    └── public/                # Static frontend assets
```

## Requirements

Install the following before starting development:

- Python 3.10 or newer
- Node.js 18 or newer and npm
- A MongoDB database, preferably MongoDB Atlas for hosted development
- A Google Gemini API key

## Environment Variables

Create a `.env` file in the project root for the backend:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
GEMINI_API=<your-gemini-api-key>
FRONTEND_URL=http://localhost:5173
```

The backend reads these variables as follows:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string used by the application database layer. |
| `GEMINI_API` | Yes | API key used by the Google GenAI client. |
| `FRONTEND_URL` | Recommended | Adds one frontend origin to the backend CORS allowlist. |
| `FRONTEND_URLS` | Optional | Adds multiple comma-separated frontend origins to the CORS allowlist. |

Create `frontend/.env` for the frontend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For a deployed frontend, set `VITE_API_URL` to the public backend URL, for example:

```env
VITE_API_URL=https://your-backend.example.com
```

Never commit `.env` files, database credentials, or API keys. If a credential has been exposed, rotate it before deploying the project.

## Backend Setup

From the repository root, create and activate a virtual environment:

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```powershell
pip install -r requirements.txt
```

Start the FastAPI development server:

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:

- API root: `http://127.0.0.1:8000/`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

The API root returns a small health response confirming that the service is running.

## Frontend Setup

Open a second terminal and move into the frontend directory:

```powershell
cd frontend
npm install
npm run dev
```

Vite normally serves the application at `http://localhost:5173`.

Available frontend commands:

```powershell
npm run dev       # Start the Vite development server
npm run build     # Create a production build in frontend/dist
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

The Axios client reads `VITE_API_URL`. If it is not set, it falls back to `http://127.0.0.1:8000`.

## Typical User Flow

1. A visitor opens the frontend and is redirected to the login page.
2. The user registers or logs in through `/auth/register` or `/auth/login`.
3. The backend creates a random session token and stores it in MongoDB.
4. The frontend stores the token and sends it as an `Authorization: Bearer <token>` header on protected requests.
5. The user submits a learning goal from the home page.
6. The backend queues roadmap generation and returns a job ID immediately.
7. The frontend polls the job endpoint until generation completes.
8. The generated roadmap is stored in MongoDB and shown in the dashboard.
9. The user marks topics complete, generates a study plan, takes quizzes, and reviews adaptive analysis.

## API Reference

All request and response details are also available in Swagger UI at `/docs` while the backend is running.

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create an account and return a session token. |
| `POST` | `/auth/login` | No | Authenticate an account and return a session token. |
| `GET` | `/auth/me` | Bearer token | Return the current user's email. |

Registration and login request body:

```json
{
  "email": "learner@example.com",
  "password": "at-least-six-characters"
}
```

### Roadmaps and Goals

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/roadmap/generate` | Bearer token | Queue AI roadmap generation. |
| `GET` | `/roadmap/jobs/{job_id}` | Bearer token | Read roadmap generation status. |
| `GET` | `/roadmap/{roadmap_id}` | Bearer token | Fetch a roadmap owned by the current user. |
| `GET` | `/goals` | Bearer token | List the user's generated goals and progress. |
| `GET` | `/goals/{goal_id}` | Bearer token | Fetch one goal by ID. |

Roadmap generation request body:

```json
{
  "goal_name": "Become a full-stack developer",
  "current_skills": [
    {
      "name": "HTML",
      "experience_level": "Intermediate"
    },
    {
      "name": "Python",
      "experience_level": "Beginner"
    }
  ],
  "skill_level": "Beginner",
  "study_hours_per_week": 10
}
```

`study_hours_per_week` must be between 1 and 168. Each skill must have a non-empty name.

A successful generation request returns a response similar to:

```json
{
  "job_id": "job-uuid",
  "status": "queued"
}
```

The job status can be `queued`, `generating`, `complete`, or `failed`.

### Progress and Dashboard

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `PATCH` | `/progress/{roadmap_id}/topic` | Bearer token | Mark one roadmap topic as complete. |
| `GET` | `/progress/{roadmap_id}` | Bearer token | Return progress for a roadmap. |
| `GET` | `/dashboard/{roadmap_id}` | Bearer token | Return dashboard information for a roadmap. |

Topic progress request body:

```json
{
  "phase_index": 0,
  "topic_index": 2
}
```

### Study Plans, Quizzes, and Analysis

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/study-plan/` | Bearer token | Generate a study plan for a roadmap. |
| `POST` | `/quiz/` | Bearer token | Generate a quiz for a roadmap. |
| `POST` | `/quiz-evaluation/` | No current route guard | Evaluate submitted answers against correct answers. |
| `POST` | `/adaptive/analyze` | No current route guard | Analyze a roadmap and return adaptive recommendations. |

Study-plan, quiz, and adaptive-analysis request body:

```json
{
  "roadmap_id": "mongodb-object-id"
}
```

Quiz evaluation request body:

```json
{
  "answers": ["answer one", "answer two"],
  "correct_answers": ["answer one", "answer three"]
}
```

## Backend Architecture

### Routes

Route modules translate HTTP requests into service calls. They validate request bodies with Pydantic models, obtain the current user where required, and return HTTP errors for missing or inaccessible records.

### Services

Service modules contain application behavior, including authentication, roadmap persistence, progress calculations, quiz generation, study-plan generation, dashboard aggregation, and Gemini calls. Keeping this logic outside route handlers makes the HTTP layer small and easier to test.

### Database

`app/db/db.py` loads environment variables and creates a MongoDB client. The current database is named `pathforge` and uses these collections:

- `users`: normalized email addresses and password hashes
- `sessions`: random bearer tokens and associated user IDs
- `roadmaps`: generated goals, phases, topics, resources, and progress data

Every roadmap query used by authenticated user-facing routes is scoped to the current user's ID.

### Authentication

Passwords are never stored directly. Registration generates a random salt and stores a PBKDF2-HMAC-SHA256 hash. Login verifies the supplied password with a constant-time comparison.

After login, the backend creates a random URL-safe session token and stores it in MongoDB. Protected requests must include:

```http
Authorization: Bearer <token>
```

The current implementation does not include a session expiration or logout endpoint. Production deployments should add token expiry, revocation, and a logout flow.

### AI Generation

`app/services/gemini_service.py` uses the Google GenAI client with the `gemini-2.5-flash` model. The service asks Gemini to return JSON containing a goal, ordered phases, topics, summaries, durations, and resources.

If Gemini fails, the service returns an empty roadmap structure with an error marker. Callers and frontend screens should handle failed generation jobs gracefully.

## Deployment

### Frontend on Vercel

The repository includes `vercel.json` configured for a Vite application:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite: all paths are sent to the frontend entry point

Set the following Vercel environment variable:

```env
VITE_API_URL=https://your-backend.example.com
```

### Backend hosting

The FastAPI application can be hosted on Render, Railway, Fly.io, or another Python-compatible platform. Use a start command equivalent to:

```text
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Configure `MONGODB_URI`, `GEMINI_API`, and the deployed frontend origin in the hosting provider's environment settings. Do not put backend secrets in frontend variables, because `VITE_*` variables are bundled into browser JavaScript.

### CORS

The backend allows local Vite origins by default and also accepts origins from `FRONTEND_URL` or comma-separated `FRONTEND_URLS`. Set the deployed frontend URL explicitly in production.

## Important Production Considerations

- Replace any exposed database or Gemini credentials immediately.
- Restrict MongoDB network access and database permissions.
- Add session expiration, logout, and token revocation.
- Move generation jobs from the process-local `_jobs` dictionary to a durable queue or job store. The current job status disappears when the backend restarts and is not shared between multiple server instances.
- Protect `/quiz-evaluation/` and `/adaptive/analyze` with the same ownership checks used by the other roadmap routes.
- Add rate limits around authentication and AI-generation endpoints.
- Validate and sanitize AI-generated resource URLs before displaying or redirecting users.
- Add automated backend and frontend tests before production releases.
- Configure HTTPS for the frontend, backend, and database connections.

## Troubleshooting

### The frontend cannot reach the API

1. Confirm the backend is running on port `8000`.
2. Confirm `frontend/.env` contains the correct `VITE_API_URL`.
3. Restart Vite after changing a `VITE_*` variable.
4. Check that the frontend origin is included in the backend CORS configuration.

### MongoDB connection errors

1. Verify `MONGODB_URI` is present in the root `.env` file.
2. Confirm the MongoDB user and password are correct.
3. Add the development machine or hosting provider to the MongoDB network access list.
4. Confirm the database user has read and write permissions.

### Roadmap generation fails

1. Verify `GEMINI_API` is valid and active.
2. Check the backend console for `Gemini Error` output.
3. Inspect `GET /roadmap/jobs/{job_id}` for the job's failure status and error.
4. Confirm the request contains a valid goal and a study-hours value from 1 through 168.

## License

No license file is currently included in this repository. Add a license before distributing the project publicly.
