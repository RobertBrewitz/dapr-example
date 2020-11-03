# Dapr Example

## Requirements

- Docker [(installation)](https://docs.docker.com/get-docker/)
- Dapr [(installation)](https://docs.dapr.io/getting-started/install-dapr/)

## Okta oauth2

1. Login to Okta admin and create a `Web` application.
2. Set `Login redirect URI`, `Logout redirect URI`, and `Initiate login URI` to
   `http://localhost:3001/v1.0/invoke/dapr-example/method/login`.
3. Get the `clientId` and `secret` from Okta GUI and plug them into `./components/oauth2.yaml`.
4. Get your okta subdomain e.g. `dev-XXXXXXX` from Okta GUI URI and plug it into
   `./components/oauth2.yaml` and in `index.ts`.

## Start Dev

```bash
npm i
npm run dapr
```

## Test

Go to `http://localhost:3001/v1.0/invoke/dapr-example/method/login` and try to
hit the publish event button
