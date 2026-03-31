export const SOURCE_OPTIONS = [
  { value: 'intercom', label: 'Intercom' },
  { value: 'slack', label: 'Slack' },
  { value: 'email', label: 'Email' },
  { value: 'call_transcript', label: 'Call Transcript' },
  { value: 'mixpanel', label: 'Mixpanel' },
  { value: 'other', label: 'Other' },
] as const

export const CATEGORY_LABELS: Record<string, string> = {
  bug: 'Bug / Error',
  feature_request: 'Feature Request',
  escalation: 'Escalation',
  billing: 'Billing',
  onboarding: 'Onboarding',
  general: 'General',
  praise: 'Praise',
  churn_signal: 'Churn Signal',
}

export const SENTIMENT_LABELS: Record<string, string> = {
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
}

export const ACCEPTED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const SOURCE_LABELS: Record<string, string> = {
  intercom: 'Intercom',
  slack: 'Slack',
  email: 'Email',
  call_transcript: 'Call Transcript',
  mixpanel: 'Mixpanel',
  other: 'Other',
}

export const SENTIMENT_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  positive: { dot: '#22C55E', bg: '#DCFCE7', text: '#166534' },
  neutral:  { dot: '#F59E0B', bg: '#FEF3C7', text: '#92400E' },
  negative: { dot: '#EF4444', bg: '#FEE2E2', text: '#991B1B' },
}

export const SUGGESTED_QUERIES = [
  "What are the most common complaints this week?",
  "Show me all escalations from the past 30 days",
  "What features are users requesting most?",
  "Summarize the billing issues",
  "Which conversations have the most negative sentiment?",
  "What onboarding problems are users facing?",
  "Find conversations about performance issues",
  "What are users praising about the product?",
]
