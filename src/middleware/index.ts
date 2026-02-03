import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  if (import.meta.env.PROD) {
    if (url.pathname.startsWith("/keystatic")) {
      return redirect("/", 301); // 301 = permanent redirect
    }
  }

  return next();
});
