# Environment Guide

This repo uses validated environment variables for both the server and the native app.

Environment files:

- `apps/server/.env`
- `apps/native/.env`

Starter templates:

- `apps/server/.env.example`
- `apps/native/.env.example`

## Quick Start

Create local env files from the examples:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/native/.env.example apps/native/.env
```

## How Env Validation Works

- Server env is validated in `packages/env/src/server.ts`
- Native env is validated in `packages/env/src/native.ts`
- Empty strings are treated as missing values
- Server secrets stay on the server package boundary
- Only `EXPO_PUBLIC_*` variables are exposed to the Expo app

## Server Variables

Server env lives in `apps/server/.env`.

### `NODE_ENV`

- Used for runtime mode
- Expected values: `development`, `production`, `test`
- Local default: `development`

Example:

```env
NODE_ENV=development
```

### `PORT`

- Used by `apps/server/src/index.ts`
- Optional in local development
- Defaults to `3000` if omitted

Example:

```env
PORT=3000
```

### `DATABASE_URL`

- PostgreSQL connection string
- Used by Drizzle and migrations
- Required

Local example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finapp
```

Production example:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

### `BETTER_AUTH_SECRET`

- Secret used by Better Auth
- Required
- Must be at least 32 characters

Example:

```env
BETTER_AUTH_SECRET=replace-with-at-least-32-characters
```

### `BETTER_AUTH_URL`

- Base URL for the auth server
- Used by Better Auth server configuration
- Optional in code, but should usually be set explicitly

Local example:

```env
BETTER_AUTH_URL=http://localhost:3000
```

Production example:

```env
BETTER_AUTH_URL=https://your-service.up.railway.app
```

### `CORS_ORIGIN`

- Comma-separated list of allowed browser origins
- Required
- Each origin must be a valid URL

Example:

```env
CORS_ORIGIN=http://localhost:8081,http://192.168.1.100:8081,https://your-web-origin.example.com
```

Use cases:

- `http://localhost:8081` for local Expo web / local browser-based traffic
- `http://<your-local-ip>:8081` when the browser or Expo web is accessed over your LAN
- Production web origins if a browser app calls the API directly

### `FINNHUB_API_KEY`

- API key for Finnhub stock data
- Required

Example:

```env
FINNHUB_API_KEY=your-finnhub-api-key
```

### `FCM_PROJECT_ID`

- Firebase project id used by the server when sending notifications
- Required

Example:

```env
FCM_PROJECT_ID=your-firebase-project-id
```

### `FCM_SERVICE_ACCOUNT_PATH`

- Path to a Firebase service account JSON file
- Required unless `FCM_SERVICE_ACCOUNT_BASE64` is set
- Common choice for local development

Example:

```env
FCM_SERVICE_ACCOUNT_PATH=./secret-config/firebase-service-account.json
```

### `FCM_SERVICE_ACCOUNT_BASE64`

- Base64-encoded Firebase service account JSON
- Required unless `FCM_SERVICE_ACCOUNT_PATH` is set
- Common choice for Railway or other hosted environments

Example:

```bash
base64 -w 0 firebase-service-account.json
```

Then set the output as:

```env
FCM_SERVICE_ACCOUNT_BASE64=...
```

### `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

- Optional
- Only needed if Google social sign-in is enabled
- If both are present, Google is added as a Better Auth social provider

Example:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Native Variables

Native env lives in `apps/native/.env`.

### `EXPO_PUBLIC_SERVER_URL`

- Base URL for the Hono API from the Expo app
- Required
- Must be a full URL

Examples:

```env
EXPO_PUBLIC_SERVER_URL=http://192.168.1.100:3000
```

```env
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

When to use which value:

- Use `http://localhost:3000` only when the client is running in a context where `localhost` truly resolves to the machine running the server, such as some same-machine browser or simulator setups
- Use `http://<your-local-ip>:3000` when testing on a physical phone, across your LAN, or whenever `localhost` does not resolve to your dev machine

Recommended default for physical devices:

```env
EXPO_PUBLIC_SERVER_URL=http://<your-local-ip>:3000
```

## Localhost Vs Local IP

Use `localhost` only when the client and server are effectively running on the same machine context.

Use your local IP when:

- you are testing the Expo app on a physical phone
- another machine on the network needs to reach your server
- Expo tooling is exposing the app over LAN and the app must call your local API

Typical local IP examples:

- `192.168.x.x`
- `10.x.x.x`
- `172.16.x.x` through `172.31.x.x`

Examples:

```env
EXPO_PUBLIC_SERVER_URL=http://192.168.1.100:3000
CORS_ORIGIN=http://localhost:8081,http://192.168.1.100:8081
```

## Docker Notes

When the server runs in Docker, `localhost` inside the container refers to the container itself, not your host machine.

If the container must reach a database running on your host, use:

```env
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/finapp
```

The repo's Docker helper scripts already add `host.docker.internal` support for local runs.

## Railway Notes

Typical Railway server env:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=at-least-32-characters
BETTER_AUTH_URL=https://your-service.up.railway.app
CORS_ORIGIN=https://your-web-origin.example.com
FINNHUB_API_KEY=...
FCM_PROJECT_ID=...
FCM_SERVICE_ACCOUNT_BASE64=...
```

Guidance:

- Do not use `localhost` or `host.docker.internal` on Railway
- Use the platform-provided database URL or hosted database URL
- Prefer `FCM_SERVICE_ACCOUNT_BASE64` for hosted deployment
- Include only real browser origins in `CORS_ORIGIN`

## Troubleshooting

### Native app cannot reach the server

Check these first:

- `EXPO_PUBLIC_SERVER_URL` points to your local IP, not `localhost`, on physical devices
- the server is running on port `3000`
- your phone and dev machine are on the same network
- local firewall rules allow inbound traffic to port `3000`

### CORS errors in browser-based flows

Check these first:

- `CORS_ORIGIN` includes every browser origin that calls the API
- each origin is a full URL including protocol
- values are comma-separated with no invalid entries

### FCM initialization fails

Check these first:

- `FCM_PROJECT_ID` matches the Firebase project
- exactly one valid service account source is available, or at least one is set correctly
- `FCM_SERVICE_ACCOUNT_PATH` points to a real JSON file in local development
- `FCM_SERVICE_ACCOUNT_BASE64` decodes to valid JSON in hosted environments
