const fs = require("fs");

const SITE_URL = "https://globesedge.neocities.org";
const FEED_TITLE = "GlobesEdge";
const FEED_DESCRIPTION =
  "Essays, notes, and long-form writing. No trackers. No noise.";

const postsData = JSON.parse(fs.readFileSync("posts.json", "utf8"));

const items = postsData.posts
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map(post => {
    const pubDate = new Date(post.date).toUTCString();

    return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE_URL}/#${encodeURIComponent(post.id)}</link>
      <guid isPermaLink="false">${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escape(post.description || post.title)}</description>
    </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${FEED_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${FEED_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>
`;

fs.writeFileSync("rss.xml", rss.trim());
console.log("rss.xml generated");

function escape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
