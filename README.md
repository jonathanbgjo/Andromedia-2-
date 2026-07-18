# Andromedia

A YouTube-style video app: a React + TypeScript + Vite frontend and a Spring Boot (Java 17) backend with PostgreSQL, JWT auth, and S3-backed uploads.

## Stack

- **Frontend:** React 18, TypeScript, Vite, React Router. CSS Modules.
- **Backend:** Spring Boot, Spring Security (JWT), Spring Data JPA / Hibernate, PostgreSQL, AWS S3.

## Prerequisites

- Node.js >= 18 (see `frontend/.nvmrc`)
- Java 17 (backend uses the Maven wrapper `./mvnw`)
- PostgreSQL running locally with a `andromedia` database
- AWS credentials for S3 (only needed for uploads)

## Setup

1. Copy the env template and fill in values:
   ```bash
   cp .env.example .env
   ```
   Required: `POSTGRES_PASSWORD`, `JWT_SECRET` (long random string), and `AWS_ACCESS_KEY` / `AWS_SECRET_KEY` for uploads.

2. **Backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   Runs on `http://localhost:8080`.

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Runs on `http://localhost:5173`.

## Build

- Frontend: `cd frontend && npm run build` (output in `frontend/dist`)
- Backend: `cd backend && ./mvnw package` (jar in `backend/target`)

## Notes

- The home feed is currently seeded from a curated list of YouTube IDs in
  `frontend/src/data/youtubeIds.ts`. A dynamic feed via the YouTube Data API
  is on the backlog (`backend/src/main/java/com/andromedia/model/todos.txt`).
