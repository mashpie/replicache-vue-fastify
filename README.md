# Demo: generic replicache (Vue + Fastify + MongoDB)

> __WIP__: State of this repository is still work-in-progress and subject to change. 

This is a monorepo powered by [Nx](https://nx.dev), demonstrating a generic setup of replicache with a [Vue](https://vuejs.org) frontend and a [Fastify](https://www.fastify.io) backend. The backend uses [MongoDB](https://www.mongodb.com) as its database. 

MongoDB and Nginx get installed and preconfigured as docker containers for local development by [@uscreen.de/dev-service](https://www.npmjs.com/package/@uscreen.de/dev-service).

## Generic implementation of replicache

The primary purpose is to demonstrate a simple and generic setup of replicache in another common stack apart from React + Next + "xSQL".

Replicaches core implementation details are abstracted into two self-contained modules for each frontend and backend. You'll find them embedded into the corresponding client- and server packages.

* Frontend "[replicache-vue](https://github.com/mashpie/replicache-vue-fastify/blob/main/client/todo/src/states/_replicache-vue.js)"
* Backend "[replicache-fastify](https://github.com/mashpie/replicache-vue-fastify/blob/main/server/todo/app/plugins/replicache.js)"

## Directory Layout

- **client** (client, say browser side)
- **server** (server side)
- **packages** (shared packages, ie.: private npm modules)
- **services** (system services, ie.: Nginx, MongoDB for local dev)

## Setup

The Nginx docker container is preconfigured as a proxy with TLS/SSL support on localhost.

- https://localhost -> serves the frontend
- https://localhost/api -> serves the backend

### Replicache Licensing

Replicache requires you to optain a valid license key. You can get one for free at [https://replicache.dev](https://replicache.dev). 
Further details can be found in the [Replicache License](https://doc.replicache.dev/licensing#unit-testing) documentation.

```bash
$ npx replicache get-license
l123d3baa14984beca21bc42aee593064
```

Copy [client/todo/.env.example](https://github.com/mashpie/replicache-vue-fastify/blob/main/client/todo/.env.example) to `client/todo/.env` and paste your license key. 

> __Note__: If the license key is missing, the frontend will fallback to using `TEST_LICENSE_KEY` as the license key. This is only allowed for unit testing and will not work in production.

### Install certificates

Generate a self-signed certificate once before running the app. You'll need to have installed [mkcert](https://mkcert.dev/) for this.

```bash
$ yarn mkcert
```

### Install 

Install node dependencies and all services as a docker container.

```bash
$ yarn install && yarn install.services
```

### Start local dev

Start all services as docker containers and all apps.

```bash
$ yarn start.services && yarn dev
```

Now point your browser to [https://localhost](https://localhost) and you should see the app running.

---

## Roadmap

- Introduce MongoDB Transactions.
- Fork example use of OpenSource pusher.js with [soketi.app](https://docs.soketi.app/) as docker container.
- Find a proper way to clear & reset all clients. Currently, you have to manually clear the browser storage.

## Changelog

### v0.1.0

Initial project setup with local state as plain Vue3 reactive `Map` object.

### v0.2.0

Added replicache with static dummy server implementation. Corresponding to [Local Mutations](https://doc.replicache.dev/guide/local-mutations).

### v0.3.0

Added MongoDB as database and implemented server-side mutations. Cacthing up in replicache tutorial until [Dynamic Pull](https://doc.replicache.dev/guide/dynamic-pull).

### v0.4.0

Added `poke` support powered by [socket.io](https://socket.io/).

---

## License

Demo Licensed under [MIT](./LICENSE).

Published, Supported and Sponsored by [u|screen](https://uscreen.de)