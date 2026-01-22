import { getCollection, getEntry } from "astro:content";

export async function getAllCategories() {
	const categories = await getCollection("categories");

	if (!categories) {
		throw Error("No categories were found");
	}

	return categories;
}

export async function getCategoryById(id: string) {
	const category = await getEntry("categories", id);

	if (!category) {
		throw Error("Category was not found");
	}

	return category;
}
