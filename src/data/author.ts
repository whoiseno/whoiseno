import { getCollection, getEntry } from "astro:content";

export async function getAllAuthors() {
	const authors = await getCollection("authors");

	if (!authors) {
		throw Error("No authors were found");
	}

	return authors;
}

export async function getAuthorById(id: string) {
	const author = await getEntry("authors", id);

	if (!author) {
		throw Error("Author was not found");
	}

	return author;
}
