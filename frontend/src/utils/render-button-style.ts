export function renderButtonStyle(type: string) {
	switch (type) {
		case "primary":
			return "px-8 py-3 text-lg font-semibold border rounded-full bg-green-500 dark:text-gray-900 border-1 border-black";
		case "secondary":
			return "px-8 py-3 text-lg font-semibold border rounded-full dark:border-gray-100 bg-white border-1 border-black";
		default:
			return "px-8 py-3 text-lg font-semibold border rounded-full bg-green-500 dark:text-gray-900 border-1 border-black";
	}
}
