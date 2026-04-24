# Frontend — React + Vite + Tailwind (owner: Ajay, Ohm)

## Stack

- [Vite](https://vitejs.dev/) 5
- React 18
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [React Router](https://reactrouter.com/) v6

## Getting started

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

## Routes

- `/login` — Login page (stub auth, stores a token in `localStorage`)
- `/dashboard` — Basic dashboard (protected)
- `/workouts/new` — Workout log form (protected)

Any unknown route redirects to `/dashboard`.
