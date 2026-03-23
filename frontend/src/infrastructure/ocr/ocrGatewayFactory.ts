import type { IOcrGateway } from '@/domain/socialContract/ports/IOcrGateway'
import { BackendOcrGateway } from './BackendOcrGateway'

export const ocrGateway: IOcrGateway = new BackendOcrGateway()
