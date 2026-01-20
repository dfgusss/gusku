module.exports = (req, res) => {
  const totalFiles = 95501;
  const baseUrl = 'https://gusku.site';
  
  // Membuat struktur XML sitemap
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Daftarkan halaman utama
  xml += `
    <url>
      <loc>${baseUrl}/</loc>
      <changefreq>always</changefreq>
      <priority>1.0</priority>
    </url>`;

  // Tambahkan 1000 link sampel pertama agar Google mulai merayapi
  // Kita batasi 1000 dulu agar loading sitemap tidak berat saat dibuka bot
  for (let i = 1; i <= 1000; i++) {
    xml += `
    <url>
      <loc>${baseUrl}/?data=${i}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  }

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.send(xml);
};