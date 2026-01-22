module.exports = async (req, res) => {
  const baseUrl = 'https://gusku.site';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${baseUrl}/s1.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/s2.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/s3.xml</loc></sitemap>
</sitemapindex>`;
  res.setHeader('Content-Type', 'text/xml');
  res.send(xml);
};