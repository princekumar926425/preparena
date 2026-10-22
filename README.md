# PrepArena

PrepArena is split into a React/Vite frontend and an Express/Mongoose API. The existing page components, styling, static study material, route URLs, and public assets are kept in `frontend/`.

## Requirements

- Node.js 20 or newer and npm
- MongoDB (local or hosted)

## Setup and start

From the project root:

```sh
npm run install
```

Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a unique `JWT_SECRET`. An existing root `.env` is also loaded as a fallback, and legacy `MONGO_URI` is accepted if `MONGODB_URI` is unset. The frontend can use its default same-origin API proxy; to override it, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL`.

Start both development servers:

```sh
npm run dev
```

- Frontend: http://localhost:8080
- API: http://localhost:5000
- Health: http://localhost:5000/api/health

Other root commands:

```sh
npm run build
npm test
npm run lint
npm start
```

`npm start` starts only the production API; deploy the built frontend separately or serve its `frontend/dist` output from a static web server.

## API

- `GET /api/health` — API and MongoDB status
- `POST /api/signup`, `POST /api/login` — validated account registration/login with bcrypt password hashes and signed JWTs
- `GET /api/contests`, `GET /api/lectures` — database-backed content
- `POST /api/contests`, `POST /api/lectures` — admin-only content creation
- `POST /api/run` — returns HTTP 503 until a secure isolated compiler service is configured

The built-in lecture and contest content remains as a frontend fallback when the database has no records or cannot be reached. Create records through the admin APIs after setting up an administrator account directly in MongoDB; public signup intentionally creates student accounts only. The admin page currently supports creating YouTube-linked lectures, not uploading video files.

The former prototype compiler launched submitted source files as host processes. It has been disabled rather than exposing server-side arbitrary code execution. Configure a dedicated sandboxed compiler provider before enabling run/submit functionality. No compiler credentials or provider are present in this project.

MongoDB is required for authentication and persistent contest/lecture records. Without a reachable database, the API still starts and the health route reports `database: "disconnected"`; database-backed routes return HTTP 503. Existing JSON-backed account data is retained in `backend/data.json` but is not automatically imported. Back it up and plan a controlled migration before switching an existing deployment to MongoDB.

## Project layout

```text
frontend/   React app, static assets, Vite and UI tooling
backend/    Express API, MongoDB configuration, models and routes
```
