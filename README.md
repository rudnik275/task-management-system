# Task management system

This app provides ability to manage tasks by projects.

## Libraries

- `element-plus` - UI kit
- `pinia` - store
- `unplugin-auto-import` - auto import vue functions
- `unplugin-vue-router` - auto import vue-router functions
- `unplugin-vue-components` - auto import vue and vue-router components, like RouterLink etc.
- `unplugin-element-plus` - optimize element-plus components styles
- `unplugin-icons` - element plus icons

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

## Api mocks

[axios-mock-plugin.ts](src/plugins/api/axios-mock-plugin.ts) intercepts all requests and checks whether the request
exists in [mocks.ts](src/plugins/api/mocks.ts). If it does, plugin throws an error with isMock flag. Then, in the error
interceptor, it checks for the isMock flag — if it's true, it returns the corresponding mock response for that route.
