# API Gateway — Error Response Format & Validation Contract

**Owner:** Srivats Pulumati  
**Subsystem:** SS2 — API Gateway (`backend/gateway/index.js`)

---

## Overview

All error responses from the API Gateway follow a consistent JSON format:

```json
{
  "message": "Human-readable error description",
  "missing": ["field1", "field2"]  // only included for 400 validation errors
}
```

---

## HTTP Status Codes

| Code | Meaning | When it occurs |
|------|---------|----------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Missing required fields in request body |
| 401 | Unauthorized | Missing or invalid/expired Bearer token |
| 500 | Internal Server Error | Unhandled server-side error |
| 503 | Service Unavailable | Database connection timed out |

---

## Endpoint Error Reference

### GET /ping
| Status | Response |
|--------|----------|
| 200 | `{ "message": "pong" }` |

---

### GET /auth/pitt/login
| Status | Response |
|--------|----------|
| 200 | SSO login stub info |

---

### GET /auth/pitt/callback
| Status | Response |
|--------|----------|
| 200 | JWT access token + user info |
| 400 | `{ "message": "Missing SSO code" }` |

---

### GET /workouts
| Status | Response |
|--------|----------|
| 200 | Workout data for authenticated user |
| 401 | `{ "message": "Missing Bearer token" }` |
| 401 | `{ "message": "Invalid or expired token" }` |

---

### POST /workouts
| Status | Response |
|--------|----------|
| 201 | Workout created successfully |
| 401 | `{ "message": "Missing Bearer token" }` |
| 401 | `{ "message": "Invalid or expired token" }` |

---

### GET /meals
| Status | Response |
|--------|----------|
| 200 | Meal data for authenticated user |
| 401 | `{ "message": "Missing Bearer token" }` |
| 401 | `{ "message": "Invalid or expired token" }` |

---

### POST /meals
| Status | Response |
|--------|----------|
| 201 | Meal created successfully |
| 401 | `{ "message": "Missing Bearer token" }` |
| 401 | `{ "message": "Invalid or expired token" }` |

---

### GET /goals
| Status | Response |
|--------|----------|
| 200 | Goals data for authenticated user |
| 401 | `{ "message": "Missing Bearer token" }` |
| 401 | `{ "message": "Invalid or expired token" }` |

---

### POST /goals
| Status | Response |
|--------|----------|
| 201 | `{ "message": "Goal created", "data": { ... } }` |
| 400 | `{ "message": "Missing required fields", "missing": ["type", "target"] }` |
| 401 | `{ "message": "Missing Bearer token" }` |
| 401 | `{ "message": "Invalid or expired token" }` |

**Required fields:** `type`, `target`

---

### GET /db-ping
| Status | Response |
|--------|----------|
| 200 | `{ "connected": true, "time": "<timestamp>" }` |
| 503 | `{ "connected": false, "error": "Database connection timed out..." }` |
| 500 | `{ "connected": false, "error": "<error message>" }` |

---

## Validation Contract

The `validateBody` middleware is used to enforce required fields on POST endpoints.

**How it works:**
1. Checks that all required fields are present in `req.body`
2. If any fields are missing → returns `400` with a list of missing fields
3. If all fields present → passes request to the next handler

**Example 400 response for POST /goals with missing fields:**
```json
{
  "message": "Missing required fields",
  "missing": ["type", "target"]
}
```

---

## Global Error Handler

Any unhandled error that reaches the end of the middleware chain is caught by the global error handler and returns:

```json
{
  "message": "Internal server error"
}
```

With HTTP status **500**.