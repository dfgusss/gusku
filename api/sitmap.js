const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const totalFiles = 95501;
  const baseUrl = 'https://gusku.site';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // 1. Daftarkan halaman utama
  xml += `
    <url>
      <loc>${baseUrl}/</loc>
      <changefreq>always</changefreq>
      <priority>1.0</priority>
    </url>`;

  // 2. Loop 1000 Link dengan Format Slug yang Sesuai (Judul-ID)
  for (let i = 0; i < 1000; i++) {
    const randomId = Math.floor(Math.random() * totalFiles) + 1;
    
    try {
      const dataPath = path.join(process.cwd(), 'data', `data-${randomId}.json`);
      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const movie = jsonData[0];
        
        if (movie) {
          // Buat slug yang sama persis dengan logika di index.js
          const cleanTitle = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const slug = `${cleanTitle}-${randomId}`;

          xml += `
          <url>
            <loc>${baseUrl}/${slug}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>`;
        }
      }
    } catch (err) {
      // Jika error, lewati file ini
      continue;
    }
  }

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.send(xml);
};