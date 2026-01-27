export function formatDate(date: Date | undefined) {
	if (date === undefined) {
		return 0;
	}
	return new Intl.DateTimeFormat("en-GB", {
		timeZone: "UTC",
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}

export function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
