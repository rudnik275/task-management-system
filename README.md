# 🗂️ Task management system

This app allows you to manage tasks by project.

[🔗 Demo](https://melodious-madeleine-54edc2.netlify.app/)

## 📁 Folder structure

- [\_\_tests__](src/__tests__) - All test specs
- [assets](src/assets) - css and other assets
- [composables](src/composables) - composition functions and helpers
- [plugins](src/plugins) - vue plugins
- [routes](src/routes) - file based router
- [stores](src/stores) - pinia
- [types](src/types) - TS types

## 📚 Libraries

- `element-plus` - UI kit
- `pinia` - store
- `unplugin-auto-import` - auto import vue functions
- `unplugin-vue-router` - auto import vue-router functions
- `unplugin-vue-components` - auto-import Vue and vue-router components, such as RouterLink, etc.
- `unplugin-element-plus` - optimize element-plus components styles
- `unplugin-icons` - element plus icons

## 🚀 Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Tests with [Vitest](https://vitest.dev/)

```sh
npm run test
```

### Run tests with hot-reload and a nice in-browser report

```sh
npm run test:ui
```

## 🧪 Api mocks

The entire backend API is mocked by `axios-mock-adapter`. These mocks are used in the app and tests.
All mocks are located in [mocks.ts](src/plugins/api/mocks.ts).
You can also simulate delay for each response in [main.ts](src/main.ts)
`app.use(ApiPlugin, {delayResponse: 500})`

## 🔐 Auth guards demo

The mocked API includes a simple handler that returns a 401 for any request without an Authorization header, except for
the /projects route.
Axios interceptor throws UI notification when it catches a 401 error.
I have added a demo section for each page where you can remove token from localStorage to see "Unauthorized" error
