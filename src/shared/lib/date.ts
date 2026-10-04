const monthYear = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });
const monthYearLong = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" });

const dayMonthYear = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(date: Date): string {
  return dayMonthYear.format(date);
}

export function formatMonthYear(date: Date, style: "short" | "long" = "short"): string {
  return (style === "long" ? monthYearLong : monthYear).format(date);
}

export function formatDateRange(start: Date, end?: Date | null, style: "short" | "long" = "short"): string {
  return `${formatMonthYear(start, style)} - ${end ? formatMonthYear(end, style) : "Present"}`;
}
