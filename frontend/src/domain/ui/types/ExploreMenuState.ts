/**
 * Domain type representing the state of the mobile explore FAB menu.
 * Kept in the domain layer so the composable and any future store
 * can share a single source of truth for this shape.
 */
export interface ExploreMenuState {
  isOpen: boolean
}
