/**
 * Scroll Service Interface - Domain Layer
 * Defines the contract for scroll operations
 * Following Dependency Inversion Principle
 */

export interface ScrollPosition {
  x: number
  y: number
}

export interface ScrollToOptions {
  top?: number
  left?: number
  behavior?: ScrollBehavior
}

export interface IScrollService {
  scrollTo(options: ScrollToOptions): void
  getPosition(): ScrollPosition
  isScrolled(): boolean
}
