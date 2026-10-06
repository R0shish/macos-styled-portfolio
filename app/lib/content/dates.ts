export function parseYearMonth(value: string): Date;
export function parseYearMonth(value?: string): Date | undefined;
export function parseYearMonth(value?: string) {
  if (!value) return undefined;
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1);
}
