# @rnvf monorepo

> "rnvf": replicache + nx + vue + fastify 

Nginx is prepconfigured as proxy with SSL support on localhost.

- https://localhost -> serves the frontend
- https://localhost/api -> serves the backend

> run: `yarn mkcert` to generate a self-signed certificate once before running the app.

## Directoy Layout

- **client** (client, say browser side)
- **server** (server side)
- **packages** (shared packages, ie.: private npm modules)
- **services** (system services, ie.: Nginx, MongoBD for local dev)

## Install all deps

```bash
$ yarn install
```

## Install all services

```bash
$ service install
```

## Start all services

```bash
$ service start
```

## Start all apps

```bash
$ yarn dev
```