# Auth Service — JWT + Pitt SSO Stub (Owner: Tanishq) 

This module documents the authentication behavior currently implemented in the API gateway.
It uses a Pitt SSO-compatible stub flow for development and issues JWTs for protected routes.

## Scope

- Provides a mock Pitt SSO login/callback flow for local development and demos.
- Issues signed JWT access tokens on successful callback.
- Enforces auth on protected backend routes using a shared middleware.
- Upserts a student row on login so auth activity is reflected in the database.

## Environment Variables

The auth flow depends on these backend environment variables:

- `JWT_SECRET`: secret used to sign and verify tokens.
- `JWT_EXPIRES_IN`: token TTL (example: `1h`).
- `DATABASE_URL`: enables real Postgres mode for student upsert and persisted data.

If `DATABASE_URL` is missing, the backend can run in demo mode using in-memory `pg-mem`.

## Auth Endpoints

All endpoints are currently defined in `backend/gateway/index.js`.

### `GET /auth`

Returns a simple service descriptor showing available auth routes.

### `GET /auth/pitt/login`

Returns a stub response that describes the next step and includes a callback example.
In production, this endpoint would redirect to the real Pitt IdP.

### `GET /auth/pitt/callback?code=...&username=...`

Simulates successful SSO callback behavior:

1. Validates that `code` is present.
2. Derives a stable user identity (`sub`, `username`, `email`, `provider`).
3. Upserts the user into `students` table (`INSERT ... ON CONFLICT ... DO UPDATE`).
4. Signs and returns a JWT (`accessToken`) plus the user payload.

## JWT Middleware

The `requireAuth` middleware protects routes by validating Bearer tokens:

- Expects header: `Authorization: Bearer <token>`
- Responds `401` when token is missing.
- Responds `401` when token is invalid or expired.
- On success, decoded JWT payload is attached to `req.user`.

Protected route groups:

- `/workouts`
- `/meals`
- `/goals`

## Typical Local Flow

1. Start backend (`node gateway/index.js`).
2. Call callback endpoint:
   - `GET /auth/pitt/callback?code=mock-auth-code&username=<your_username>`
3. Copy `accessToken` from response.
4. Call protected route with header:
   - `Authorization: Bearer <accessToken>`

## Demo Checklist

- Show callback success and token issuance.
- Show `401` on a protected route without token.
- Show successful protected-route response with token.
- Optionally show `/students` debug endpoint to confirm login upsert.

## Notes and Limitations

- Current flow is a development stub, not a full Pitt SSO integration.
- Password from UI is not validated by backend auth logic.
- Refresh tokens/session revocation are not implemented.
