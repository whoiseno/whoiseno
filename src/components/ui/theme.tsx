import { CircleHalfIcon } from "@phosphor-icons/react";
import React from "react";
import { Button } from "@/components/ui/button";

export function Theme() {
	const [theme, setThemeState] = React.useState<"theme-light" | "dark" | "system">("theme-light");

	React.useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains("dark");
		setThemeState(isDarkMode ? "dark" : "theme-light");
	}, []);

	React.useEffect(() => {
		const isDark =
			theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
		document.documentElement.classList[isDark ? "add" : "remove"]("dark");
	}, [theme]);

	return (
		<Button variant="ghost" size="icon" onClick={() => setThemeState(theme === "theme-light" ? "dark" : "theme-light")}>
			<CircleHalfIcon className="size-5" weight="fill" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
