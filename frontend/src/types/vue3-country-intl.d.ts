declare module 'vue3-country-intl' {
  import { DefineComponent } from 'vue'

  export interface CountryData {
    name: string
    iso2: string
    dialCode: string
    priority?: number
    areaCodes?: string[]
  }

  export interface Vue3CountryIntlProps {
    modelValue?: string
    defaultCountry?: string
    disabledCountryCode?: boolean
    showAreaCode?: boolean
    showSearchBox?: boolean
    showCountryName?: boolean
    type?: 'phone' | 'text'
    placeholder?: string
    disabled?: boolean
  }

  const vue3CountryIntl: DefineComponent<Vue3CountryIntlProps>
  export default vue3CountryIntl
}

declare module 'vue3-country-intl/lib/vue3-country-intl.css'
