import { getCollection, getEntry } from "astro:content";
import { getAuthorById } from "./author";
import { getCategoryById } from "./category";

export async function getAllBlogs() {
	const blogs = await getCollection("blog", ({ data }) => {
		return import.meta.env.PROD ? data.isPublished !== false : true;
	});

	if (!blogs) {
		throw Error("No blogs were found");
	}

	const sortedBlogs = blogs.sort((a, b) => b.data.createdAt.valueOf() - a.data.createdAt.valueOf());

	return sortedBlogs;
}

export async function getBlogById(id: string) {
	const blog = await getEntry("blog", id);

	if (!blog) {
		throw Error("Blog was not found");
	}

	return blog;
}

export function getBlogByDate(date: Date) {
	return date;
}

export async function getBlogByCategory(category: string) {
	const categoryToFind = await getCategoryById(category);

	const blogsToFind = await getCollection("blog", ({ data }) => {
		return data.category.id === categoryToFind.id;
	});

	return blogsToFind;
}

export async function getBlogByAuthor(author: string) {
	const authorToFind = await getAuthorById(author);

	const blogsToFind = await getCollection("blog", ({ data }) => {
		return data.author.includes(authorToFind);
	});

	return blogsToFind;
}
