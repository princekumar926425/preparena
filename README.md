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

Code execution additionally requires a trusted Judge0 instance. Set `JUDGE0_API_URL` to its base URL (for example, `http://localhost:2358` for a locally running Judge0 API). For self-hosted Judge0, optionally set `JUDGE0_API_KEY` to its `X-Auth-Token`. For Judge0 hosted through RapidAPI, set `JUDGE0_API_KEY` and `JUDGE0_API_HOST`; these credentials are only read by the backend. Do not point this variable at an unknown service: submitted source code and stdin are sent to this configured provider. If the provider URL is absent or unavailable, code execution returns an explicit HTTP 503 rather than simulated output.

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
- `POST /api/code/run` — executes C++ (Judge0 ID 54), Java (ID 62), or Python 3 (ID 71) with supplied stdin
- `POST /api/code/submit` — grades the supported Two Sum problem against backend-owned public and hidden cases
- `POST /api/run` — legacy alias for the run/submit API

The built-in lecture and contest content remains as a frontend fallback when the database has no records or cannot be reached. Create records through the admin APIs after setting up an administrator account directly in MongoDB; public signup intentionally creates student accounts only. The admin page currently supports creating YouTube-linked lectures, not uploading video files.

The former prototype compiler launched submitted source files as host processes, so that unsafe implementation was removed. This project never runs submitted code inside Express; all execution is delegated to Judge0, which must run user programs with isolation enabled and network access disabled. Start and secure your Judge0 deployment following the [official Judge0 installation instructions](https://github.com/judge0/judge0), then configure the backend environment above. Execution and grading are currently configured for Two Sum only because the other catalogue problems do not yet define standard-input formats or trusted test data. Other problem submissions are rejected instead of returning fabricated verdicts.

Two Sum uses standard input with three lines: array length `n`, then `n` space-separated integers, then the target. Programs print the two distinct zero-based indices separated by whitespace. Run uses editable stdin; Submit evaluates six backend-owned cases with a 2-second CPU and 128 MB memory limit. Hidden inputs and outputs are never included in the submission response.

MongoDB is required for authentication and persistent contest/lecture records. Without a reachable database, the API still starts and the health route reports `database: "disconnected"`; database-backed routes return HTTP 503. Existing JSON-backed account data is retained in `backend/data.json` but is not automatically imported. Back it up and plan a controlled migration before switching an existing deployment to MongoDB.

## Project layout

```text
frontend/   React app, static assets, Vite and UI tooling
backend/    Express API, MongoDB configuration, models and routes
```
