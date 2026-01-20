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

  // REVISI: Mengambil 1000 link secara ACAK agar menjangkau seluruh 95.501 file
  for (let i = 0; i < 1000; i++) {
    const randomId = Math.floor(Math.random() * totalFiles) + 1;
    xml += `
    <url>
      <loc>${baseUrl}/?data=${randomId}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  }

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.send(xml);
};