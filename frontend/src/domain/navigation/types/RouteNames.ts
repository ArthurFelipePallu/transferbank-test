/**
 * Route name tokens — single source of truth for all named routes.
 * Using an enum means a typo is a compile error, not a silent runtime miss.
 * Import this anywhere you need a route name instead of writing a string literal.
 */
export enum RouteName {
  // ─── Public ──────────────────────────────────────────────────────────────
  Home              = 'home',
  Register          = 'register',
  Login             = 'login',
  Companies         = 'companies',
  Solutions         = 'solutions',
  Pricing           = 'pricing',
  Resources         = 'resources',
  InDevelopment     = 'in-development',
  NotFound          = 'not-found',

  // ─── Account status ───────────────────────────────────────────────────────
  AccountCreated    = 'account-created',
  AccountExists     = 'account-exists',

  // ─── Authenticated ────────────────────────────────────────────────────────
  Dashboard         = 'dashboard',

  // ─── Partner ─────────────────────────────────────────────────────────────
  PartnerRegistration = 'partner-registration',
  PartnerRegistered   = 'partner-registered',

  // ─── Services ────────────────────────────────────────────────────────────
  Accounts          = 'accounts',
  Transfers         = 'transfers',
  Loans             = 'loans',
  Investments       = 'investments',

  // ─── Support ─────────────────────────────────────────────────────────────
  HelpCenter        = 'help-center',
  Security          = 'security',
  ReportFraud       = 'report-fraud',
  ContactUs         = 'contact-us',
  RecoverPassword   = 'recover-password',

  // ─── Legal ───────────────────────────────────────────────────────────────
  CookiePolicy      = 'cookie-policy',
  PrivacyPolicy     = 'privacy-policy',
  Accessibility     = 'accessibility',
}
