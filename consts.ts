
export const PERIOD_BUTTONS: { label: string; value: string }[] = [
  { label: '1D', value: 'daily' },
  { label: '7D', value: 'weekly' },
  { label: '1M', value: 'monthly' },
  { label: '3M', value: 'quarterly' },
  { label: '1Y', value: 'yearly' },
  // { label: 'ALL', value: 'all' },
];

export const CHART_PERIODS: { label: string; value: string | number }[] = [
  { label: 'daily', value: 1 },
  { label: 'weekly', value: 7 },
  { label: 'monthly', value: 30 },
  { label: 'quarterly', value: 90 },
  { label: 'yearly', value: 365 },
  // { label: 'all', value: 'all' },
];

export const CHART_COLORS = {
  background: '#0b1116',
  text: '#8f9fb1',
  grid: '#1a2332',
  border: '#1a2332',
  crosshairVertical: '#ffffff40',
  crosshairHorizontal: '#ffffff20',
  candleUp: '#158A6E',
  candleDown: '#EB1C36',
} as const;