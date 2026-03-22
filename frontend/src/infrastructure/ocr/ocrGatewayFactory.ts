import type { IOcrGateway } from '@/domain/socialContract/ports/IOcrGateway'
import { BackendOcrGateway } from './BackendOcrGateway'

let instance: IOcrGateway | null = null

export function getOcrGateway(): IOcrGateway {
  if (!instance) {
    instance = new BackendOcrGateway(import.meta.env.VITE_API_URL ?? '')
  }
  return instance
}
