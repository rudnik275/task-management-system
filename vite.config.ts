import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import Vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/routes',
      dts: 'src/types/auto-generated/typed-router.d.ts',
    }),
    Vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      dts: 'src/types/auto-generated/auto-imports.d.ts',
      vueTemplate: true,
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    vueDevTools(),
    ElementPlus({})
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
