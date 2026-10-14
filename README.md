# Pet Adoption Platform

The main objective of this project is to simplify the pet adoption process by providing a centralized platform where users can explore pets available for adoption and submit adoption requests.

A simple React + Vite landing page for a pet adoption project.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Backend API

The backend needs no SQL server or Workbench. Install dependencies and start the API from the `backend` directory with `npm install` and `npm run dev`. Pet changes are saved in `backend/pet-state.json`; account records and bcrypt password hashes are saved in the ignored local file `backend/user-state.json`. Pet browsing (`GET /api/pets`) is public; creating and deleting pets require an administrator JWT Bearer token.

Register with `POST /api/auth/register` using `{ "name": "Your Name", "email": "you@example.com", "password": "at-least-8-characters" }`. Sign in with `POST /api/auth/login` using `{ "email": "you@example.com", "password": "at-least-8-characters" }`. Registration signs the user in and returns a one-hour Bearer token. Passwords are stored as bcrypt hashes. The existing development administrator can still sign in with the configured admin username and password.

For local development, log in with `POST http://localhost:8080/api/auth/login` using this JSON body:

```json
{
	"username": "admin",
	"password": "pet-admin-dev"
}
```

Copy the `access_token` from the response. In Postman, open the pet request's **Authorization** tab, select **Bearer Token**, and paste the token. Tokens expire after one hour and are invalidated when the backend restarts during development.

Before running in production, set `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` to secure values. The backend refuses to start in production if any are missing.
