import { getCollection } from "astro:content";

export async function getAllPosts() {
  const res = await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  if (!res) {
    throw Error("[api/v1/posts]: Internal Server Error");
  }

  const posts = res.sort((a, b) => b.data.createdAt.valueOf() - a.data.createdAt.valueOf());

  return posts;
}
