# finflow-mobile

React Native (Expo Router) mobile frontend for the FinFlow API, alongside the existing `finflow-ui` web dashboard.

## Stack
- Expo SDK 57 + Expo Router (file-based navigation)
- TypeScript
- Axios for API calls
- `expo-secure-store` for persisting the JWT access token on-device

## Run it

```bash
cd finflow-mobile
npm install
cp .env.example .env   # set EXPO_PUBLIC_API_BASE_URL to your machine's LAN IP, not localhost
npm start
```

Then press `a` for Android, `i` for iOS (macOS only), or scan the QR code with Expo Go.

The FinFlow API must be running and reachable from the device/emulator (see the repo root `README.md` for `dotnet run --project FinFlow.API`).

## Structure
- `app/(auth)` — login and register screens
- `app/(app)` — authenticated screens (wallets dashboard, wallet transaction detail), guarded by a redirect in `app/(app)/_layout.tsx`
- `lib/api.ts` — Axios client + typed calls to `AuthController` / `WalletsController` / `TransactionsController`
- `lib/auth-context.tsx` — session state, backed by `expo-secure-store`

## Known limitation: refresh tokens
`AuthController.RefreshToken` reads the refresh token from an `HttpOnly` cookie, which works naturally for the browser-based `finflow-ui` but has no equivalent persistent cookie jar in this app. For now, the app only stores the short-lived access token; once it expires, the user is required to log in again rather than transparently refreshing. Supporting silent refresh on mobile would need the API to also accept the refresh token via a mobile-friendly channel (e.g. request body instead of only a cookie).
