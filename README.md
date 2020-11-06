# Dapr Example

## Requirements

- Docker [(installation)](https://docs.docker.com/get-docker/)
- Dapr [(installation)](https://docs.dapr.io/getting-started/install-dapr/)

## How to run locally

## Backend

### Setup

1. Sign in to your Okta developer dashboard and navigate to _Applications_ > _Add Application_.
2. Choose `Web` and click _Next_.
3. Set all URLs to `http://localhost:8080`
4. Check the box `Client Credentials` and click _Done_
5. Copy the `Client ID` and replace `${yourClientId}` in `backend/components/okta.yaml`.
6. Copy the `Okta domain` and replace `${yourOktaDomain}` in `backend/components/okta.yaml`.
7. Go to _API_ > _Authroization Servers_ > _default_ > _Scopes_.
8. Create a new scope named `yourOwnScope`, it has to match the scope in
   `backend/components/okta.yaml`; You only need to choose a name and click _Create_.

`yourOwnScope` you can name the scope whatever.

```bask
cd backend
npm i
npm start
```

## Frontend

### Setup

1. Sign in to your Okta developer dashboard and navigate to _Applications_ > _Add Application_.
2. Choose `Single-Page App` and click _Next_.
3. Set `http://localhost:8080` as a `Login redirect URI` and click _Done_.
4. Copy the `Client ID` and replace `${yourClientId}` in `frontend/index.html`.
5. Copy the `Okta domain` and replace `${yourOktaDomain}` in `frontend/index.html`.

### Start Frontend

```bash
cd frontend
npm i
npm start
```

## Open up your browser, login to Okta

[localhost:8080](http://localhost:8080)

# License

[ICS License](./LICENSE)
