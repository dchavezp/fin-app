# Better-Auth Configuration

## Cookie Settings
- `sameSite: "none"`, `secure: true` — required for cross-origin mobile requests
- `httpOnly: true` — prevents XSS access to tokens

## Trusted Origins
Include all origins that the app can be accessed from:
- Custom app scheme: `finn-app://`
- Expo Go: `exp://`
- Metro dev server: `http://localhost:8081`
- Production server URL (from env `CORS_ORIGIN`)

## Plugins
Always enable the `expo()` plugin for native mobile auth flows (token exchange, secure storage).
