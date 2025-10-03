# GiftLink Full-Stack Capstone

A full-stack web application consisting of a React frontend and a Node.js/Express backend backed by MongoDB. The app provides gift listing, search, and basic authentication (register/login/profile). This README documents the stack, setup, environment variables, scripts, how to run and test, and the project structure.

Note: This document avoids inventing unknowns. Items that require confirmation are marked as TODO.


## Overview
- Frontend: React 18 (Create React App tooling), Bootstrap/React-Bootstrap UI.
- Backend: Node.js + Express, MongoDB (official Node driver), JWT auth, pino logging, CORS.
- Data: MongoDB database named "giftdb" with collections such as gifts and users. A seeding utility exists to import initial gifts data.
- Additional folder: a "sentiment" directory appears to be a separate service placeholder (Express + natural language processing deps), but it lacks documented entry points. See TODOs.


## Requirements
- Node.js and npm installed.
  - TODO: Confirm the recommended Node.js version (e.g., 18 LTS or 20 LTS). The repo does not specify an engines field.
- MongoDB instance/cluster and credentials for the backend.
- Modern browser for the frontend.


## Project Structure
At the repository root:

- giftlink-frontend: React app (Create React App)
- giftlink-backend: Express API server with MongoDB
- sentiment: Separate Node project (potential microservice; not wired-in here)
- LICENSE: Apache-2.0
- README.md: This document

Example tree (abridged):

- giftlink-frontend/
  - package.json
  - .env
  - public/
  - src/
    - config.js (reads REACT_APP_BACKEND_URL)
    - context/AuthContext.js
- giftlink-backend/
  - package.json
  - .env (do not commit secrets; local use only)
  - app.js (server entry; listens on port 3060)
  - models/db.js (connects to Mongo using MONGO_URL; DB name giftdb)
  - routes/
    - giftRoutes.js (CRUD subset for gifts)
    - searchRoutes.js (filtering/search for gifts)
    - authRoutes.js (register/login/profile JWT)
  - logger.js (pino logger) [present per imports]
  - util/import-mongo/
    - index.js (seeds gifts collection from gifts.json)
- sentiment/
  - package.json (Express + NLP deps)
  - TODO: Document entry point and how/if it integrates with the main app.


## Environment Variables
Do not commit actual secrets. Create the following .env files with your own values.

Frontend (giftlink-frontend/.env):
- REACT_APP_BACKEND_URL: Base URL of the backend API (e.g., http://localhost:3060 or a deployed URL)

Backend (giftlink-backend/.env):
- MONGO_URL: Full MongoDB connection string (SRV or standard)
- JWT_SECRET: Secret used to sign JWTs for auth

Optional/Notes:
- The backend port is currently hard-coded to 3060 in giftlink-backend/app.js.
- CORS is enabled with app.use("*", cors()). Adjust for production as needed. TODO: Restrict origins for production.


## Installation
Run the following from the repository root.

1) Install dependencies for frontend and backend:
- cd giftlink-frontend && npm install
- cd ../giftlink-backend && npm install

2) Create environment files:
- giftlink-frontend/.env → REACT_APP_BACKEND_URL=...
- giftlink-backend/.env → MONGO_URL=... and JWT_SECRET=...

3) (Optional) Seed initial data into MongoDB:
- cd giftlink-backend/util/import-mongo
- node index.js


## Running the App
You can run the backend and frontend in two terminals.

Backend (from giftlink-backend):
- Development with live reload: npm run dev
- Production-style start: npm start
- Default port: 3060

Frontend (from giftlink-frontend):
- Start CRA dev server: npm start
- CRA dev server default port: 3000 (will open a browser window)

Once both are running, the frontend will call the backend using the REACT_APP_BACKEND_URL defined in giftlink-frontend/.env.


## Available Scripts
Frontend (giftlink-frontend/package.json):
- npm start → react-scripts start
- npm run build → react-scripts build
- npm test → react-scripts test
- npm run eject → react-scripts eject

Backend (giftlink-backend/package.json):
- npm start → node app.js
- npm run dev → nodemon app.js
- npm test → mocha

Sentiment (sentiment/package.json):
- npm test → placeholder script only (no defined runtime script)
- TODO: Add a start/dev script and document how to run if this service is used.


## API Endpoints (Backend)
Base URL: http://localhost:3060 (or your REACT_APP_BACKEND_URL)

- Health/root:
  - GET / → returns "Inside the server"

- Gifts:
  - GET /api/gifts → list all gifts
  - GET /api/gifts/:id → get a single gift by id field
  - POST /api/gifts → create a new gift (JSON body)

- Search:
  - GET /api/search?name=...&category=...&condition=...&age_years=... → search and filter gifts

- Auth (JWT):
  - POST /api/auth/register → body: { firstName, lastName, email, password }
  - POST /api/auth/login → body: { email, password }
  - GET /api/auth/profile → requires Authorization: Bearer <token>
  - PUT /api/auth/profile → requires Authorization: Bearer <token>, body: { firstName, lastName }

Notes:
- JWT secret is set via JWT_SECRET. Tokens expire in 2 hours by default.
- Database name is giftdb; collections include gifts and users.


## Tests
Frontend:
- From giftlink-frontend: npm test (react-scripts test). By default runs in watch mode.

Backend:
- From giftlink-backend: npm test (mocha). DevDependencies include mocha, chai, sinon, supertest. TODO: Add/verify test files and coverage commands.


## Development Notes
- Logging: pino + pino-http is configured; logs are pretty-printable with pino-pretty in development if piped.
- CORS: Currently permissive (cors() on all routes). TODO: Restrict origins and methods for production.
- Data seeding: util/import-mongo/index.js seeds the gifts collection if empty.
- Frontend config: src/config.js reads REACT_APP_BACKEND_URL and exports urlConfig.
- Auth state: src/context/AuthContext.js maintains basic login state client-side.


## Deployment
- TODO: Document deployment flow for both frontend and backend (hosting provider, build commands, environment variables, and secrets management). The frontend .env currently points to a Render URL in example history; update to your deployed backend URL.


## License
This project is licensed under the Apache License 2.0. See the LICENSE file for details.