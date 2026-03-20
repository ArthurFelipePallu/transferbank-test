/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-country-intl' {
  import type { DefineComponent } from 'vue'
  const Vue3CountryIntl: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default Vue3CountryIntl
}
