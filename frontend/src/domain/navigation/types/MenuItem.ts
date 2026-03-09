/**
 * Menu Item Types - Domain Layer
 * Defines the structure of navigation menu items
 */

export interface MenuItem {
  label: string
  route?: string
  icon?: string
  children?: MenuItem[]
  isDanger?: boolean
}

export interface MenuSection {
  items: MenuItem[]
}
