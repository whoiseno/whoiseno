export function formatDate(date: Date) {
		return new Intl.DateTimeFormat("en-GB", {
			timeZone: "UTC",
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(date)
}
