const monthYear = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

export function formatMonthYear(date: Date): string {
  return monthYear.format(date);
}

export function formatDateRange(start: Date, end?: Date | null): string {
  return `${formatMonthYear(start)} - ${end ? formatMonthYear(end) : "Present"}`;
}
