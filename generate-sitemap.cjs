const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");

(async () => {
  const sitemap = new SitemapStream({ hostname: "https://ridelyapp.vercel.app" });

  sitemap.write({ url: "/", changefreq: "weekly", priority: 1.0 });
  sitemap.write({ url: "/waitlist" });
  sitemap.write({ url: "/contact" });
  sitemap.write({ url: "/blog" });
  sitemap.write({ url: "/blog/1" });
  sitemap.write({ url: "/blog/2" });
  sitemap.write({ url: "/blog/3" });

  sitemap.end();

  const sitemapData = await streamToPromise(sitemap);
  createWriteStream("./public/sitemap.xml").write(sitemapData.toString());
})();
