/**
 * Scroll Management Composable - Presentation Layer
 * Provides Vue composable wrapper around scroll use cases
 * Following DDD and Dependency Inversion Principle
 */

import type { IScrollService, ScrollToOptions } from '@/domain/scroll/interfaces/IScrollService'
import { browserScrollService } from '@/infrastructure/scroll/BrowserScrollService'
import {
  scrollToTop as scrollToTopUseCase,
  scrollToPosition,
  checkIfScrolled,
  getCurrentScrollPosition,
} from '@/application/scroll/scrollUseCases'

/**
 * Composable for scroll management
 * Depends on IScrollService interface, not concrete implementation
 */
export function useScrollToTop(scrollService: IScrollService = browserScrollService) {
  /**
   * Scroll to top of the page
   */
  const scrollToTop = (options: ScrollToOptions = {}) => {
    scrollToTopUseCase(scrollService, options)
  }

  /**
   * Scroll to a specific element
   */
  const scrollToElement = (
    element: HTMLElement | string,
    options: ScrollToOptions = {}
  ) => {
    const el = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element

    if (el) {
      const top = el.offsetTop + (options.top ?? 0)
      scrollToPosition(
        scrollService,
        top,
        options.left ?? 0,
        options.behavior ?? 'smooth'
      )
    }
  }

  /**
   * Check if page is scrolled
   */
  const isScrolled = () => {
    return checkIfScrolled(scrollService)
  }

  /**
   * Get current scroll position
   */
  const getScrollPosition = () => {
    return getCurrentScrollPosition(scrollService)
  }

  return {
    scrollToTop,
    scrollToElement,
    isScrolled,
    getScrollPosition,
  }
}
