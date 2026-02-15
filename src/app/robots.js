// app/robots.js

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://kimiatoranj.com/sitemap.xml",
  };
}
