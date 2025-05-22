import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type {Plugin} from '@vue/runtime-core'

export const ElementPlusIcons: Plugin = (app) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
