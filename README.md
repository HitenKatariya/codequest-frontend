# CodeQuest Frontend

React frontend for CodeQuest — a MERN Q&A platform with Public Space, profiles/avatars, friends/teams, and an AI Assistant inside the Ask Question flow.

## Features

- Authentication (JWT)
- Ask questions + view questions + answers
- Public Space feed + media
- User profiles + avatar upload
- Friends + teams
- AI Assistant on Ask Question:
	- Improve Question
	- Suggest Tags
	- Generate Answer

## Tech stack

- React (CRA)
- Redux + Thunk
- React Router
- Axios

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in this folder.

Example `.env`:

```env
# Backend base URL
# Local: http://localhost:5050
# Render: https://<your-render-service>.onrender.com
REACT_APP_API_BASE_URL=http://localhost:5050
```

3. Start the app:

```bash
npm start
```

## Configuration

- The frontend reads the backend URL from `REACT_APP_API_BASE_URL`.
- In development, `package.json` also includes a CRA `proxy` for local API calls.

## Deployment (Vercel)

- Set `REACT_APP_API_BASE_URL` to your Render backend URL (example: `https://your-service.onrender.com`).
- Redeploy on Vercel.

## Backend

- Backend is typically deployed on Render.
- Ensure the backend has Cloudinary and AI provider env vars configured.
