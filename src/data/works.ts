import { getCollection } from "astro:content";

export async function getAllWorks() {
  const res = await getCollection("works", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  if (!res) {
    throw Error("[api/v1/works]: Internal Server Error");
  }

  const works = res.sort((a, b) => b.data.createdAt.valueOf() - a.data.createdAt.valueOf());

  return works;
}
