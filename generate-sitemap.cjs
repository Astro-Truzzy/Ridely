const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");

const SITE_URL = "https://www.ridelyweb.com";

(async () => {
  const sitemap = new SitemapStream({ hostname: SITE_URL });

  sitemap.write({ url: "/", changefreq: "weekly", priority: 1.0 });
  sitemap.write({ url: "/privacy-policy", changefreq: "monthly", priority: 0.5 });
  sitemap.write({ url: "/blog/1", changefreq: "monthly", priority: 0.7 });
  sitemap.write({ url: "/blog/2", changefreq: "monthly", priority: 0.7 });
  sitemap.write({ url: "/blog/3", changefreq: "monthly", priority: 0.7 });

  sitemap.end();

  const sitemapData = await streamToPromise(sitemap);
  createWriteStream("./public/sitemap.xml").write(sitemapData.toString());
})();
