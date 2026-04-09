export function formatCredits(value: number) {
  return `${value} credits`;
}

export function formatCurrency(value: number) {
  return `$${value.toFixed(0)}`;
}

export function formatDistance(value: number) {
  return `${value.toFixed(1)} km`;
}
