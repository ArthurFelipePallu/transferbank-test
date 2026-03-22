import type { IDocumentAnalysisGateway } from '@/domain/socialContract/ports/IDocumentAnalysisGateway'
import { BackendDocumentAnalysisGateway } from './BackendDocumentAnalysisGateway'

let instance: IDocumentAnalysisGateway | null = null

export function getDocumentAnalysisGateway(): IDocumentAnalysisGateway {
  if (!instance) {
    instance = new BackendDocumentAnalysisGateway(import.meta.env.VITE_API_URL ?? '')
  }
  return instance
}
