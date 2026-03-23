import type { IDocumentAnalysisGateway } from '@/domain/socialContract/ports/IDocumentAnalysisGateway'
import { BackendDocumentAnalysisGateway } from './BackendDocumentAnalysisGateway'

export const documentAnalysisGateway: IDocumentAnalysisGateway = new BackendDocumentAnalysisGateway()
