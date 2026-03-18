/**
 * Gateway Registry — Composition Root
 *
 * This is the ONLY place in the codebase that imports concrete gateway
 * implementations. Stores and use cases depend on port interfaces; they
 * receive gateway instances from here, satisfying DIP.
 *
 * To swap an implementation (e.g. mock for tests), change it here only.
 */
export { httpCompanyGateway as companyGateway } from './company/HttpCompanyGateway'
export { httpPartnerGateway as partnerGateway } from './partner/HttpPartnerGateway'
export { httpAuthGateway as authGateway } from './auth/HttpAuthGateway'
