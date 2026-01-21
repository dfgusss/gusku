

module.exports = async (req, res) => {
  const totalFiles = 95501;
  const baseUrl = 'https://gusku.site';
  const rawBaseUrl = 'https://raw.githubusercontent.com/dfgusss/gusku/main/data/';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // 1. Daftarkan halaman utama
  xml += `
    <url>
      <loc>${baseUrl}/</loc>
      <changefreq>always</changefreq>
      <priority>1.0</priority>
    </url>`;

  // 2. Loop Link (Gunakan subset kecil untuk kecepatan respon sitemap)
  // Catatan: Fetch 1000 file sekaligus dari GitHub dalam satu request 
  // bisa berisiko timeout, saya optimalkan ke 200 link per hit agar kencang.
  let count = 0;
  const target = 1000; 
  const randomIds = [];
  
  while (randomIds.length < target) {
    const rId = Math.floor(Math.random() * totalFiles) + 1;
    if (!randomIds.includes(rId)) randomIds.push(rId);
  }

  await Promise.all(randomIds.map(async (id) => {
    try {
      const response = await fetch(`${rawBaseUrl}data-${id}.json`);
      if (response.ok) {
        const jsonData = await response.json();
        const movie = jsonData[0];
        
        if (movie && movie.title) {
          const cleanTitle = movie.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
            
          const slug = `${cleanTitle}-${id}`;

          xml += `
          <url>
            <loc>${baseUrl}/${slug}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>`;
        }
      }
    } catch (err) {
      // Skip jika file gagal fetch
    }
  }));

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.send(xml);
};