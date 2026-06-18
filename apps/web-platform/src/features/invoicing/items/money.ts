export function centsToCurrencyInput(cents: string): string {
  if (!cents.trim()) {
    return '';
  }

  const value = Number(cents);

  if (!Number.isFinite(value)) {
    return '';
  }

  return (value / 100).toFixed(2);
}

export function currencyInputToCents(input: string): string {
  const normalized = input.replace(/\s/g, '').replace(',', '.');

  if (!normalized) {
    return '';
  }

  const value = Number(normalized);

  if (!Number.isFinite(value) || value < 0) {
    return '';
  }

  return String(Math.round(value * 100));
}
