/**
 * Scroll Use Cases - Application Layer
 * Business logic for scroll operations
 * Following Single Responsibility Principle
 */

import type { IScrollService, ScrollToOptions } from '@/domain/scroll/interfaces/IScrollService'

/**
 * Scroll to top of the page
 */
export function scrollToTop(
  scrollService: IScrollService,
  options: ScrollToOptions = {}
): void {
  scrollService.scrollTo({
    top: 0,
    left: 0,
    ...options,
  })
}

/**
 * Scroll to a specific position
 */
export function scrollToPosition(
  scrollService: IScrollService,
  top: number,
  left: number = 0,
  behavior: ScrollBehavior = 'smooth'
): void {
  scrollService.scrollTo({ top, left, behavior })
}

/**
 * Check if page is scrolled
 */
export function checkIfScrolled(scrollService: IScrollService): boolean {
  return scrollService.isScrolled()
}

/**
 * Get current scroll position
 */
export function getCurrentScrollPosition(scrollService: IScrollService) {
  return scrollService.getPosition()
}
