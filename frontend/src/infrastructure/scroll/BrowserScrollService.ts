/**
 * Browser Scroll Service - Infrastructure Layer
 * Concrete implementation of IScrollService using browser APIs
 * Following Dependency Inversion Principle
 */

import type { IScrollService, ScrollPosition, ScrollToOptions } from '@/domain/scroll/interfaces/IScrollService'

export class BrowserScrollService implements IScrollService {
  scrollTo(options: ScrollToOptions): void {
    window.scrollTo({
      top: options.top ?? 0,
      left: options.left ?? 0,
      behavior: options.behavior ?? 'smooth',
    })
  }

  getPosition(): ScrollPosition {
    return {
      x: window.scrollX,
      y: window.scrollY,
    }
  }

  isScrolled(): boolean {
    return window.scrollY > 0
  }
}

// Singleton instance
export const browserScrollService = new BrowserScrollService()
