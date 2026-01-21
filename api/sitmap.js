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

  // 2. Loop 1000 Link dengan Format Slug (Optimasi Kecepatan Pembacaan)
  let count = 0;
  while (count < 1000) {
    const randomId = Math.floor(Math.random() * totalFiles) + 1;
    
    try {
      const dataPath = path.join(process.cwd(), 'data', `data-${randomId}.json`);
      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const movie = jsonData[0];
        
        if (movie && movie.title) {
          const cleanTitle = movie.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
            
          const slug = `${cleanTitle}-${randomId}`;

          xml += `
          <url>
            <loc>${baseUrl}/${slug}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>`;
          count++; // Hanya bertambah jika file berhasil dibaca
        }
      }
    } catch (err) {
      // Jika error, lewati tanpa menghentikan proses
      continue;
    }
  }

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.send(xml);
};