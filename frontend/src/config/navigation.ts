export interface NavLink {
  label: string
  routeName: string
  variant?: 'default' | 'ghost' | 'primary'
}

export interface NavigationConfig {
  mainLinks: NavLink[]
  authLinks: NavLink[]
}

export const navigationConfig: NavigationConfig = {
  mainLinks: [
    {
      label: 'Companies',
      routeName: 'companies',
    },
    {
      label: 'Solutions',
      routeName: 'solutions',
    },
    {
      label: 'Pricing',
      routeName: 'pricing',
    },
    {
      label: 'Resources',
      routeName: 'resources',
    },
  ],
  authLinks: [
    {
      label: 'Login',
      routeName: 'login',
      variant: 'ghost',
    },
    {
      label: 'Open account',
      routeName: 'home',
      variant: 'primary',
    },
  ],
}
